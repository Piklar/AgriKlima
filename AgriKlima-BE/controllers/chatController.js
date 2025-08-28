// controllers/chatController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini client with the API key from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This is the main function that will handle chat requests
module.exports.sendMessage = async (req, res) => {
    try {
        // We get the user's message and any context from the request body
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).send({ error: "Message is required." });
        }

        // --- THIS IS THE FIX ---
        // For text-only input, use the latest stable gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
        
        // We create a more specific prompt for the AI
        const agriKlimaPrompt = `
            You are "KlimaBot," a helpful AI assistant for farmers using the AgriKlima application.
            Your expertise is in Philippine agriculture, climate-smart farming, pest control, and crop management.
            Always provide concise, practical, and easy-to-understand advice.
            If the user asks a question outside of this scope, gently guide them back to agricultural topics.

            User's question: "${message}"
        `;

        const result = await model.generateContent(agriKlimaPrompt);
        const response = await result.response;
        const text = response.text();

        // Send the AI's response back to the frontend
        res.status(200).send({ response: text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).send({ error: "Failed to get a response from the AI." });
    }
};