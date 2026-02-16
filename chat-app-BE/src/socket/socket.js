import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Server as SocketIoServer } from "socket.io";
import { registerUserEvents } from "./userEvent.js";
import { registerChatEvents } from "./chatevents.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import { Expo } from 'expo-server-sdk';

const expo = new Expo();

dotenv.config();

export function initializeSocket(server) {
    const io = new SocketIoServer(server, {
        cors: {
            origin: "*"
        }
    }) // Socket io server instance


    // auth middleware  
    io.use((socket, next) => {
        console.log("socket auth middleware hit:", socket.id)
        const token = socket.handshake.auth.token;
        console.log("token", token)
        if (!token) {
            return next(new Error("Authentication error : no token provided"))
        }

        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                return next(new Error("Authentication error : invalid token"))
            }

            console.log("user data", decoded.user)
            // attach user data to socket
            const userData = decoded?.user ?? decoded;
            socket.data.user = userData;
            socket.data.userId = userData?.userId ?? userData?.id;
            next();
        })
    })

    io.on("connection", async (socket) => {
        const userId = socket.data?.userId;
        console.log("socket connected:", socket.id, "userId:", userId);

        if (userId) {
            await User.findByIdAndUpdate(userId, { isOnline: true });
            socket.broadcast.emit("userOnline", { userId });
        }


        // register events
        registerUserEvents(io, socket)
        registerChatEvents(io, socket)

        // join all the conversations the user is part of 
        try {
            const conversations = await Conversation.find({
                participants: socket.data?.userId
            }).select("_id");

            conversations.forEach(conversation => {
                socket.join(conversation._id.toString());
            })

        } catch (error) {

        }

        socket.on("disconnect", async () => {
            const userId = socket.data?.userId;
            console.log("socket disconnected:", socket.id, "userId:", userId);
            if (userId) {
                await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
                socket.broadcast.emit("userOffline", { userId, lastSeen: new Date() });
            }
        })

        socket.on("updateLocation", async (data) => {
            const userId = socket.data?.userId;
            if (!userId || !data.latitude || !data.longitude) return;

            try {
                // Update user location
                await User.findByIdAndUpdate(userId, {
                    location: {
                        type: "Point",
                        coordinates: [data.longitude, data.latitude]
                    }
                });

                // Check for nearby users (e.g., within 500 meters)
                const nearbyUsers = await User.find({
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [data.longitude, data.latitude]
                            },
                            $maxDistance: 500 // 500 meters
                        }
                    },
                    _id: { $ne: userId } // Exclude self
                }).select("name pushToken");

                if (nearbyUsers.length > 0) {
                    console.log(`Found ${nearbyUsers.length} users nearby ${socket.data.user.name}`);

                    // Notify nearby users
                    // Optimization: In real app, check cooldown to avoid spam
                    let messages = [];
                    for (const user of nearbyUsers) {
                        if (user.pushToken && Expo.isExpoPushToken(user.pushToken)) {
                            messages.push({
                                to: user.pushToken,
                                sound: 'default',
                                title: "Nearby Friend!",
                                body: `${socket.data.user.name} is near you!`,
                                data: { type: 'proximity', userId: userId },
                            });
                        }
                    }
                    if (messages.length > 0) {
                        let chunks = expo.chunkPushNotifications(messages);
                        for (let chunk of chunks) {
                            await expo.sendPushNotificationsAsync(chunk);
                        }
                    }
                }

            } catch (error) {
                console.error("Error updating location:", error);
            }
        });
    })

    return io
}