// backend/models/Crop.js
const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false },
    // --- THIS IS THE NEW, CRUCIAL FIELD ---
    growingDuration: { type: Number, required: true }, // Estimated days from planting to harvest
    season: { type: String, enum: ['All Year', 'Dry Season', 'Wet Season'], default: 'All Year' },
    overview: {
        plantingSeason: String,
        harvestTime: String
    },
    growingGuide: {
        climate: String,
        soilType: String,
        waterNeeds: String,
        fertilizer: String
    },
    healthCare: {
        commonDiseases: [String],
        pestControl: [String],
        nutritionalValue: [String]
    },
    marketInfo: {
        priceRange: String,
        storageMethod: String,
        cookingTips: [String]
    }
});

module.exports = mongoose.model('Crop', cropSchema);