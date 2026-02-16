import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

export function registerUserEvents(io, socket) {
    socket.on("testSocket", (data) => {
        socket.emit("testSocket", { msg: "Socket is working" })

    })

    socket.on("updateProfile", async (data) => {
        console.log(" update profile event ", data);
        const userId = socket.data.userId
        if (!userId) {
            return socket.emit("updateProfile", {
                success: false,
                msg: "Unauthorized user"
            })
        }
        const updateData = {}
        if (data.name) updateData.name = data.name;
        if (data.avatar) updateData.avatar = data.avatar;
        if (data.pushToken) {
            console.log("Saving push token for user:", userId, data.pushToken);
            updateData.pushToken = data.pushToken;
        }

        try {
            const updateUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
            if (!updateUser) {
                return socket.emit("updateProfile", {
                    success: false,
                    msg: "user not found"
                })
            }
            const newToken = generateToken(updateUser)
            return socket.emit("updateProfile", {
                success: true,
                msg: "Profile updated successfully",
                token: newToken
            })

        } catch (error) {
            return socket.emit("updateProfile", {
                success: false,
                msg: "Internal server error"
            })
        }

    })


    socket.on("getContacts", async () => {

        try {
            const currentUserId = socket.data.userId;
            if (!currentUserId) {
                socket.emit("getContacts", {
                    success: false,
                    msg: "Unauthorized user"
                })
            }
            const users = await User.find({
                _id: { $ne: currentUserId }
            }, { password: 0 } // exclude password
            ).lean();   // will fatch js object

            const contacts = users.map((user) => {
                return {
                    _id: user._id,
                    name: user.name,
                    avatar: user.avatar,
                    email: user.email
                }
            })
            socket.emit("getContacts", {
                success: true,
                msg: "Contacts fetched successfully",
                contacts
            })

        } catch (error) {
            console.log("error", error)
            socket.emit("getContacts", {
                success: false,
                msg: "Failed to fatch contacts"
            })
        }
    })

}