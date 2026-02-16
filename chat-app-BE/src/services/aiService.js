import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

export const generateReplySuggestions = async (messageContent) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("GEMINI_API_KEY is not set.");
            return [];
        }


        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
        You are a smart reply assistant.
        Analyze this incoming message: "${messageContent}"
        Suggest exactly 3 short, natural, and contextually appropriate replies.
        Return ONLY a raw JSON array of strings, e.g., ["Yes", "No", "Maybe"].
        Do not include markdown formatting or explanations.
        Replies should be brief (1-4 words).
        `,
        })
        const response = await result;
        // Extract text from the new response format
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

        console.log("AI Raw Text:", text);

        // Clean up the response to ensure it's valid JSON
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const suggestions = JSON.parse(cleanText);
            if (Array.isArray(suggestions)) {
                return suggestions.slice(0, 3); // Ensure max 3
            }
            return [];
        } catch (parseError) {
            console.error("Failed to parse AI response:", text);
            return [];
        }

    } catch (error) {
        console.error("Error generating AI suggestions:", error);
        return [];
    }
};

export const chatWithGemini = async (userMessage) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("GEMINI_API_KEY is not set.");
            return "I'm having trouble connecting to my brain right now. Please try again later.";
        }

        // The new SDK (@google/genai) doesn't use getGenerativeModel or startChat in the same way.
        // We implicitly manage history by sending it in 'contents'.
        // For a stateless request (since we don't persist history object here effectively across requests in this function), 
        // we should conceptually pass the conversation history. 
        // But the previous implementation hardcoded a system instruction and a welcome message.
        // Let's replicate that "single turn" approach or "simulated chat" for now.

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: "You are Guru AI, a helpful, friendly, and intelligent assistant in a React Native chat app. Be concise and helpful. Reply to this: " + userMessage }],
                }
            ],
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure what to say.";
        return text;

    } catch (error) {
        console.error("Error chatting with Gemini:", error);
        return "Sorry, I'm a bit overwhelmed right now. Can you ask me that again?";
    }
};
