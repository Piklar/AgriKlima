// backend/models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    publicationDate: { type: Date, default: Date.now },
    // --- THIS IS THE FIX ---
    imageUrl: { type: String, required: false }, // Changed from true to false
    content: { type: String, required: true },
    summary: {
        keyPoints: [String],
        quotes: [String],
        impact: String
    }
});

module.exports = mongoose.model('News', newsSchema);