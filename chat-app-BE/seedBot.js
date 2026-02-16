
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const seedBot = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        const botEmail = "guru@ai.bot";
        const existingBot = await User.findOne({ email: botEmail });

        if (existingBot) {
            console.log("✅ Bot user already exists:", existingBot._id);
            console.log("Tokens:", existingBot.pushToken); // Just in case we need it
        } else {
            const newBot = await User.create({
                name: "Guru AI",
                email: botEmail,
                password: "secure_bot_password_123", // Not used for login really
                avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png", // Robot Icon
                pushToken: "BOT_TOKEN"
            });
            console.log("🚀 Created Guru AI Bot:", newBot._id);
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding bot:", error);
        process.exit(1);
    }
};

seedBot();
