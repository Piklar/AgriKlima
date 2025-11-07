// backend/models/Variety.js
const mongoose = require('mongoose');

const varietySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    imageUrl: { type: String, required: false },
    growingDuration: { type: Number, required: true }, // Duration specific to the variety
    parentCrop: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Crop', 
        required: true 
    },
    // You can add more variety-specific fields here later if needed
    // e.g., resistance_to: [String], best_for: String
});

module.exports = mongoose.model('Variety', varietySchema);