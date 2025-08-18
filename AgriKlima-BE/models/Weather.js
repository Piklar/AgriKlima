// models/Weather.js
const mongoose = require('mongoose');

const hourlyForecastSchema = new mongoose.Schema({
    time: String, // e.g., "12:00"
    temperature: Number,
    windSpeed: Number,
    condition: String // e.g., "Sunny", "Cloudy"
});

const dailyForecastSchema = new mongoose.Schema({
    day: String, // e.g., "Friday, 1 Sep"
    temperature: Number,
    condition: String
});

const weatherSchema = new mongoose.Schema({
    location: { type: String, required: true, unique: true }, // e.g., "Mexico, Pampanga"
    current: {
        temperature: Number,
        humidity: Number,
        visibility: Number,
        airPressure: Number,
        windSpeed: Number,
        condition: String
    },
    hourly: [hourlyForecastSchema],
    daily: [dailyForecastSchema],
    detailed: {
        uvIndex: Number,
        airQuality: String,
        sunrise: String,
        sunset: String,
        precipitation: Number,
        feelsLike: Number,
        moonPhase: String
    },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Weather', weatherSchema);