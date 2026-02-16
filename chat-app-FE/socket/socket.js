import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import { API_URL } from "../constants";

// Hold the current socket.io client instance (or null when disconnected)
let socket = null;

export async function connectSocket() {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
        throw new Error("no token found. User must login first");
    }

    // Reuse existing connection if it already exists and is connected
    if (socket && socket.connected) {
        return socket;
    }

    socket = io(API_URL, {
        auth: { token },
    });

    await new Promise((resolve) => {
        socket.on("connect", () => {
            console.log("Socket connected", socket.id);
            resolve(true);
        });
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });

    return socket;
}

export function getSocket() {
    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}