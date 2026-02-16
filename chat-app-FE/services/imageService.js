import axios from "axios";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../constants";

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

export const uploadToCloudinary = async (file, folderName) => {
    try {
        if (!file) {
            return { success: true, data: null }
        }

        if (typeof file == "string") {
            return { success: true, data: file }
        }
        if (file && file.uri) {
            const formData = new FormData();
            formData.append("file", {
                uri: file?.uri,
                type: "image/jpeg",
                name: file?.uri.split("/").pop() || "file.jpeg"
            })
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            formData.append("folder", folderName);

            const response = await axios.post(CLOUDINARY_API_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return { success: true, data: response?.data?.secure_url }
        }
        return { success: true, data: null }

    } catch (error) {
        console.log("error uploading file", error.response?.data || error.message)
        return { success: false, error: error }
    }
}
export const getAvatarPath = (file, isGroup) => {
    if (file && typeof file == 'string') return file;

    if (file && typeof file == 'object') return file.uri || file.url;

    if (isGroup) return require("../assets/images/defaultAvatar.png");

    return require("../assets/images/defaultAvatar.png");
}