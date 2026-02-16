import { model, Schema } from "mongoose";

const ConversationSchema = new Schema({
    type: {
        type: String,
        enum: ['direct', "group"],
        required: true,
    },
    name: String,
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: true
        }
    ],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    avatar: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

export default model("Conversation", ConversationSchema) 