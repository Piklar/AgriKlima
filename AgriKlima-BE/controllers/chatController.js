// backend/controllers/chatController.js

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

// This will now correctly initialize with the key from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Handles incoming chat messages, maintains conversation history, and returns a response from the Gemini AI.
 */
module.exports.sendMessage = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        // Use the latest stable and powerful Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        // --- THE CONVERSATION OVERHAUL ---
        // We start a chat session that remembers the history you send from the frontend.
        const chat = model.startChat({
            history: history || [], // Use history if provided, otherwise start fresh
            generationConfig: {
                maxOutputTokens: 1500, // Increased token limit for more detailed answers
            },
            // Best practice: Add safety settings to filter harmful content
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ],
        });

        // A more directive and clear prompt for the AI
        const agriKlimaPrompt = `
            You are "KlimaBot," an expert AI assistant for farmers in the Philippines using the AgriKlima app.
            Your role is to provide practical, concise, and easy-to-understand advice on agriculture.
            Your expertise includes:
            - Climate-smart farming techniques suitable for the Philippine climate.
            - Detailed crop management for rice, corn, vegetables, etc.
            - Identification, prevention, and treatment of common local pests and diseases.
            - General farming best practices.
            If a user asks a question outside this scope (e.g., politics, celebrities), gently refuse and guide them back to agricultural topics.
            Keep your answers helpful and focused on farming.

            The user's question is: "${message}"
        `;

        // Send the message to the ongoing chat session
        const result = await chat.sendMessage(agriKlimaPrompt);
        const response = await result.response;
        const text = response.text();

        // Send the AI's clean text response back to the frontend
        res.status(200).json({ response: text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        // Provide a user-friendly error message
        const errorMessage = error.response?.data?.error?.message || "The AI is currently unavailable. Please try again later.";
        res.status(500).json({ error: errorMessage });
    }
};