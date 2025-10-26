// backend/models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    publicationDate: { type: Date, default: Date.now },
    imageUrl: { type: String, required: false },
    content: { type: String, required: true },
    // --- THIS IS THE FIX ---
    sourceUrl: { type: String, required: false }, // Add the new field
    summary: {
        keyPoints: [String],
        quotes: [String],
        impact: String
    }
});

module.exports = mongoose.model('News', newsSchema);