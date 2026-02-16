import { getSocket } from "./socket";

export const testSocket = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log(" socket is not connected ");
        return;
    }
    if (off) {
        socket.off("testSocket", payload);
    } else if (typeof payload == "function") {
        socket.on("testSocket", payload);
    } else {
        socket.emit("testSocket", payload)
    }
};

export const updateProfile = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log(" socket is not connected ");
        return;
    }
    if (off) {
        socket.off("updateProfile", payload);
    } else if (typeof payload == "function") {
        socket.on("updateProfile", payload);
    } else {
        socket.emit("updateProfile", payload)
    }
};

export const getContacts = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log(" socket is not connected ");
        return;
    }
    if (off) {
        socket.off("getContacts", payload);
    } else if (typeof payload == "function") {
        socket.on("getContacts", payload);
    } else {
        socket.emit("getContacts", payload)
    }
};
export const newConversation = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log(" socket is not connected ");
        return;
    }
    if (off) {
        socket.off("newConversation", payload);
    } else if (typeof payload == "function") {
        socket.on("newConversation", payload);
    } else {
        socket.emit("newConversation", payload)
    }
};
export const getConversations = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log(" socket is not connected ");
        return;
    }
    if (off) {
        socket.off("getConversations", payload);
    } else if (typeof payload == "function") {
        socket.on("getConversations", payload);
    } else {
        socket.emit("getConversations", payload)
    }
};

export const newMessage = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log(" socket is not connected ");
        return;
    }
    if (off) {
        socket.off("newMessage", payload);
    } else if (typeof payload == "function") {
        socket.on("newMessage", payload);
    } else {
        socket.emit("newMessage", payload)
    }
};

export const getMessages = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log("socket is not connected ");
        return;
    }
    if (off) {
        socket.off("getMessages", payload);
    } else if (typeof payload == "function") {
        socket.on("getMessages", payload);
    } else {
        socket.emit("getMessages", payload)
    }
};
export const getConversationById = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log("socket is not connected ");
        return;
    }
    if (off) {
        socket.off("getConversationById", payload);
    } else if (typeof payload == "function") {
        socket.on("getConversationById", payload);
    } else {
        socket.emit("getConversationById", payload)
    }
};

export const messageSuggestions = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log("socket is not connected ");
        return;
    }
    if (off) {
        socket.off("messageSuggestions", payload);
    } else if (typeof payload == "function") {
        socket.on("messageSuggestions", payload);
    } else {
        socket.emit("messageSuggestions", payload)
    }
};

export const typing = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log("socket is not connected ");
        return;
    }
    if (off) {
        socket.off("typing", payload);
    } else if (typeof payload == "function") {
        socket.on("typing", payload);
    } else {
        socket.emit("typing", payload)
    }
};

export const stopTyping = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log("socket is not connected ");
        return;
    }
    if (off) {
        socket.off("stopTyping", payload);
    } else if (typeof payload == "function") {
        socket.on("stopTyping", payload);
    } else {
    }
};

export const userOnline = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log("socket is not connected ");
        return;
    }
    if (off) {
        socket.off("userOnline", payload);
    } else if (typeof payload == "function") {
        socket.on("userOnline", payload);
    } else {
        socket.emit("userOnline", payload)
    }
};

export const userOffline = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log("socket is not connected ");
        return;
    }
    if (off) {
        socket.off("userOffline", payload);
    } else if (typeof payload == "function") {
        socket.on("userOffline", payload);
    } else {
        socket.emit("userOffline", payload)
    }
};

export const updateLocation = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log("socket is not connected ");
        return;
    }
    if (off) {
        socket.off("updateLocation", payload);
    } else if (typeof payload == "function") {
        socket.on("updateLocation", payload);
    } else {
        socket.emit("updateLocation", payload)
    }
};

export const markMessagesAsRead = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log("socket is not connected ");
        return;
    }
    if (off) {
        socket.off("markMessagesAsRead", payload);
    } else if (typeof payload == "function") {
        socket.on("markMessagesAsRead", payload);
    } else {
        socket.emit("markMessagesAsRead", payload)
    }
};

export const messagesRead = (payload, off) => {
    const socket = getSocket();
    if (!socket) {
        console.log("socket is not connected ");
        return;
    }
    if (off) {
        socket.off("messagesRead", payload);
    } else if (typeof payload == "function") {
        socket.on("messagesRead", payload);
    } else {
        socket.emit("messagesRead", payload)
    }
};
