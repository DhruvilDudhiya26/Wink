import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Using API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");

    try {
        // There isn't a direct "listModels" on the instance in some versions,
        // but we can try to hit the endpoint or use the model that SHOULD exist.
        // Actually, the error message suggested calling ListModels. 
        // This is often exposed via a ModelManager or similar.
        // Let's try to just run a simple prompt with 'gemini-1.0-pro' which is older.

        // Attempt to list models via REST API to verify Key permissions
        const key = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        console.log("Fetching models from:", "https://generativelanguage.googleapis.com/v1beta/models?key=***");

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                console.error("API Error:", data.error);
            } else if (data.models) {
                console.log("Available Models:");
                data.models.forEach(m => console.log(`- ${m.name}`));
            } else {
                console.log("Unexpected response:", data);
            }
        } catch (e) {
            console.error("Fetch Error:", e);
        }

    } catch (error) {
        console.error("Global Error:", error);
    }
}

listModels();
