import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversation",
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    content: String,
    attachment: String,
    status: {
        type: String,
        enum: ["sent", "delivered", "read"],
        default: "sent"
    }
}, {
    timestamps: true
})

const Message = mongoose.model("Message", messageSchema);

export default Message;