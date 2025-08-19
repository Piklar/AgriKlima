// models/Pest.js
const mongoose = require('mongoose');

const pestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Insect Pest', 'Disease', 'Weed'], required: true },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    imageUrl: { type: String, required: true },
    overview: {
        description: String,
        commonlyAffects: [String],
        seasonalActivity: String
    },
    identification: {
        size: String,
        color: String,
        shape: String,
        behavior: String
    },
    prevention: [String],
    treatment: [String]
});

module.exports = mongoose.model('Pest', pestSchema);