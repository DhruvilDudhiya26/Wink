import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config();


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log("mongodb connection error", error);
        throw error
    }
}

export default connectDB