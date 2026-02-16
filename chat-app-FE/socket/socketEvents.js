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
        socket.emit("stopTyping", payload)
    }
};
