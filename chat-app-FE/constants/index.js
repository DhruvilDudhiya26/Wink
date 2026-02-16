import { Platform } from "react-native";

export const FALLBACK_API_URL =
    Platform.OS === "android" ? 'http://192.168.200.35:3001' : 'http://localhost:3001';

export const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL || FALLBACK_API_URL;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dusgimcqs";
export const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || "images";
