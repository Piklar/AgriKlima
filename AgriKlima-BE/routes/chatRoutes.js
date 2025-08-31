// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { verify } = require("../auth"); // Secure this endpoint, only logged-in users can chat

// Define the route for sending a message to the chatbot
// POST /chat/send
router.post("/send", verify, chatController.sendMessage);

module.exports = router;