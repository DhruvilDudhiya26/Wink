import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { Expo } from 'expo-server-sdk';
import { generateReplySuggestions } from "../services/aiService.js";

const expo = new Expo();

export function registerChatEvents(io, socket) {

    socket.on("getConversations", async () => {
        try {
            const userId = socket.data.userId
            if (!userId) {
                socket.emit("getConversation", {
                    success: false,
                    msg: "unauthorized"
                });
                return;
            }
            // find all the conversations where user is a participant
            const conversations = await Conversation.find({
                participants: userId
            }).sort({ updatedAt: -1 }).populate({
                path: "lastMessage",
                select: "content senderId attachment createdAt"
            }).populate({
                path: "participants",
                select: "name avatar email"
            }).lean();

            socket.emit("getConversations", {
                success: true,
                data: conversations,
            })

        } catch (error) {
            console.log("error", error);
            socket.emit("getConversations", {
                success: false,
                msg: "failed to fetch conversations"
            })
        }

    })
    socket.on("newConversation", async (data) => {
        try {
            if (data.type == "direct") {
                const existingConversation = await Conversation.findOne({
                    type: "direct",
                    participants: {
                        $all: data.participants, $size: 2
                    }
                }).populate({
                    path: "participants",
                    select: "name avatar email"
                });

                if (existingConversation) {
                    socket.emit("newConversation", {
                        success: true,
                        data: { ...existingConversation, isNew: false }
                    })
                    return
                }

            }
            // create a new conversation
            const conversation = await Conversation.create({
                type: data.type,
                participants: data.participants,
                name: data.name,
                avatar: data.avatar,
                createdBy: socket.data.userId
            })

            // get all connected sockets
            const connectedSockets = Array.from(io.sockets.sockets.values()).filter((s) => data.participants.includes(s.data.userId));

            // join this conversation by all online participants 
            connectedSockets.forEach((participantSocket) => {
                participantSocket.join(conversation._id.toString());
            })

            const populatedConversation = await Conversation.findById(conversation._id).populate({
                path: "participants",
                select: "name avatar email"
            }).lean();

            if (!populatedConversation) {
                throw new Error("failed to populate conversation ")
            }

            // emit conversation to all participants 
            io.to(conversation._id.toString()).emit("newConversation", {
                success: true,
                data: { ...populatedConversation, isNew: true }
            })

        } catch (error) {
            console.log("error", error);
            socket.emit("newConversation", {
                success: false,
                msg: "failed to create conversation"
            })

        }
    })

    socket.on("newMessage", async (data) => {
        console.log("new Message", data)
        try {
            const message = await Message.create({
                conversationId: data.conversationId,
                senderId: data.sender.id,
                content: data.content,
                attachment: data.attachment
            });
            io.to(data.conversationId).emit("newMessage", {
                success: true,
                data: {
                    id: message._id,
                    content: data.content,
                    sender: {
                        id: data.sender.id,
                        name: data.sender.name,
                        avatar: data.sender.avatar,
                    },
                    attachment: data.attachment,
                    createdAt: new Date().toISOString(),
                    conversationId: data.conversationId,
                }
            });

            // update conversation's last message 
            await Conversation.findByIdAndUpdate(data.conversationId, {
                lastMessage: message._id
            });

            // Send Push Notification
            try {
                // Determine recipients (excluding sender)
                const conversation = await Conversation.findById(data.conversationId).populate("participants", "pushToken name");
                const recipients = conversation.participants.filter(p => p._id.toString() !== data.sender.id);

                console.log("Checking recipients for push notification:", recipients.length);

                let messages = [];
                for (let recipient of recipients) {
                    if (recipient.pushToken && Expo.isExpoPushToken(recipient.pushToken)) {
                        console.log("Preparing notification for:", recipient.name, recipient.pushToken);
                        messages.push({
                            to: recipient.pushToken,
                            sound: 'default',
                            title: data.sender.name,
                            body: data.content || (data.attachment ? "Sent an image" : "New Message"),
                            data: { conversationId: data.conversationId },
                        })
                    } else {
                        console.log("User", recipient.name, "has no valid push token:", recipient.pushToken);
                    }
                }

                let chunks = expo.chunkPushNotifications(messages);
                for (let chunk of chunks) {
                    console.log("Sending chunk of notifications...");
                    let ticket = await expo.sendPushNotificationsAsync(chunk);
                    console.log("Notification Ticket:", ticket);
                }

            } catch (notifyError) {
                console.log("Error sending push notification", notifyError);
            }

            // Generate AI Reply Suggestions
            try {
                // Determine recipients (excluding sender)
                // Reuse recipients filtering logic if possible, or query again if needed
                // But we already have conversationId, so we can emit to the room.
                // Or better: emit to specific sockets.

                // Simple approach: Generate suggestions based on content
                if (data.content) {
                    const suggestions = await generateReplySuggestions(data.content);
                    if (suggestions && suggestions.length > 0) {
                        console.log("Generated AI Suggestions:", suggestions);
                        // Emit to everyone in the room EXCEPT the sender
                        // We can use socket.to(room).emit() which broadcasts to everyone in room except sender
                        socket.to(data.conversationId).emit("messageSuggestions", {
                            conversationId: data.conversationId,
                            messageId: message._id,
                            suggestions: suggestions
                        });
                        console.log("Emitted messageSuggestions to:", data.conversationId);
                    } else {
                        console.log("No AI suggestions generated (empty or null)");
                    }
                }
            } catch (aiError) {
                console.log("Error generating AI suggestions", aiError);
            }

        } catch (error) {
            console.log("error", error);
            socket.emit("newMessage", {
                success: false,
                msg: "failed to fetch conversations"
            })
        }

        // --- GURU AI BOT LOGIC START ---
        try {
            // 1. Check if this conversation involves the Bot 
            // We need to fetch the conversation to check participants. 
            // We already did this potentially in "Send Push Notification" block, but let's be safe and efficient.

            // Re-fetch clean conversation to check emails
            const aiConversation = await Conversation.findById(data.conversationId)
                .populate("participants", "email name avatar");

            const botParticipant = aiConversation.participants.find(p => p.email === "guru@ai.bot");

            // If Bot is in the chat AND the sender is NOT the bot
            if (botParticipant && data.sender.id !== botParticipant._id.toString()) {
                console.log("🤖 Message sent to Guru Bot! Generating response...");

                // 2. Call Gemini
                // Note: ideally we fetch previous messages for history here. 
                // For now, let's do single-turn or simple context.

                // Import chatWithGemini if not imported (I need to update imports!)
                const { chatWithGemini } = await import("../services/aiService.js");

                const aiReplyText = await chatWithGemini(data.content);

                // 3. Create Bot Message in DB
                const botMessage = await Message.create({
                    conversationId: data.conversationId,
                    senderId: botParticipant._id,
                    content: aiReplyText,
                    attachment: null
                });

                // 4. Update Conversation Last Message
                await Conversation.findByIdAndUpdate(data.conversationId, {
                    lastMessage: botMessage._id
                });

                // 5. Emit Bot Message to Room
                io.to(data.conversationId).emit("newMessage", {
                    success: true,
                    data: {
                        id: botMessage._id,
                        content: aiReplyText,
                        sender: {
                            id: botParticipant._id,
                            name: botParticipant.name,
                            avatar: botParticipant.avatar,
                        },
                        attachment: null,
                        createdAt: new Date().toISOString(),
                        conversationId: data.conversationId,
                    }
                });
            }

        } catch (botError) {
            console.error("Guru Bot Error:", botError);
        }
        // --- GURU AI BOT LOGIC END ---
    })

    socket.on("getMessages", async (data) => {
        console.log("getMessages", data)
        try {
            const messages = await Message.find({ conversationId: data.conversationId }).sort({ createdAt: -1 }).populate({ path: "senderId", select: "name avatar" }).lean();

            const messageWithSender = messages.map(message => ({
                ...message,
                id: message._id,
                sender: {
                    id: message.senderId._id,
                    name: message.senderId.name,
                    avatar: message.senderId.avatar
                }
            }))

            socket.emit("getMessages", {
                success: true,
                data: messageWithSender,
            })

        } catch (error) {
            console.log("error", error);
            socket.emit("getMessages", {
                success: false,
                msg: "failed to fetch conversations"
            })
        }
    })

    socket.on("getConversationById", async (data) => {
        try {
            const { conversationId } = data;
            const conversation = await Conversation.findById(conversationId)
                .populate({
                    path: "participants",
                    select: "name avatar email pushToken"
                })
                .lean();

            if (!conversation) {
                socket.emit("getConversationById", {
                    success: false,
                    msg: "Conversation not found"
                });
                return;
            }

            socket.emit("getConversationById", {
                success: true,
                data: conversation
            });

        } catch (error) {
            console.log("error", error);
            socket.emit("getConversationById", {
                success: false,
                msg: "failed to fetch conversation"
            });
        }
    })



    socket.on("typing", (data) => {
        socket.to(data.conversationId).emit("typing", data);
    });

    socket.on("stopTyping", (data) => {
        socket.to(data.conversationId).emit("stopTyping", data);
    });

}