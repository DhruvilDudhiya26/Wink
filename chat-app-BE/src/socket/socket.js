import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Server as SocketIoServer } from "socket.io";
import { registerUserEvents } from "./userEvent.js";
import { registerChatEvents } from "./chatevents.js";
import Conversation from "../models/Conversation.js";

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
        console.log("socket connected:", socket.id, "userId:", socket.data?.userId);


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

        socket.on("disconnect", () => {
            console.log("socket disconnected:", socket.id, "userId:", socket.data?.userId);
        })
    })

    return io
}