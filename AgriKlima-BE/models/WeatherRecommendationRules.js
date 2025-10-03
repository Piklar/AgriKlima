// backend/models/WeatherRecommendationRules.js

const mongoose = require('mongoose');

const weatherRecommendationRulesSchema = new mongoose.Schema({
  // Temperature Rules
  temperatureRules: {
    extremelyCold: {
      threshold: { type: Number, default: 18 },
      scoreDeduction: { type: Number, default: 30 },
      warning: { type: String, default: '🌡️ Temperature too cold for most crops' },
      recommendations: [{ type: String }]
    },
    belowOptimal: {
      minThreshold: { type: Number, default: 18 },
      maxThreshold: { type: Number, default: 25 },
      scoreDeduction: { type: Number, default: 10 },
      recommendations: [{ type: String }]
    },
    optimal: {
      minThreshold: { type: Number, default: 25 },
      maxThreshold: { type: Number, default: 32 },
      scoreDeduction: { type: Number, default: 0 },
      recommendations: [{ type: String }]
    },
    highTemp: {
      minThreshold: { type: Number, default: 32 },
      maxThreshold: { type: Number, default: 35 },
      scoreDeduction: { type: Number, default: 10 },
      warning: { type: String, default: '🌡️ High temperature - ensure adequate irrigation' },
      recommendations: [{ type: String }]
    },
    extremeHeat: {
      threshold: { type: Number, default: 35 },
      scoreDeduction: { type: Number, default: 25 },
      warning: { type: String, default: '🌡️ Extreme heat - crop stress likely' },
      recommendations: [{ type: String }]
    }
  },

  // Humidity Rules
  humidityRules: {
    low: {
      threshold: { type: Number, default: 40 },
      scoreDeduction: { type: Number, default: 15 },
      warning: { type: String, default: '💧 Low humidity - increased water loss' },
      recommendations: [{ type: String }]
    },
    belowOptimal: {
      minThreshold: { type: Number, default: 40 },
      maxThreshold: { type: Number, default: 60 },
      scoreDeduction: { type: Number, default: 5 },
      recommendations: [{ type: String }]
    },
    optimal: {
      minThreshold: { type: Number, default: 60 },
      maxThreshold: { type: Number, default: 80 },
      scoreDeduction: { type: Number, default: 0 },
      recommendations: [{ type: String }]
    },
    high: {
      threshold: { type: Number, default: 80 },
      scoreDeduction: { type: Number, default: 10 },
      warning: { type: String, default: '💧 High humidity - disease risk increased' },
      recommendations: [{ type: String }]
    }
  },

  // Wind Speed Rules (km/h)
  windRules: {
    high: {
      threshold: { type: Number, default: 30 },
      scoreDeduction: { type: Number, default: 15 },
      warning: { type: String, default: '💨 High winds - avoid spraying' },
      recommendations: [{ type: String }]
    },
    moderate: {
      threshold: { type: Number, default: 20 },
      scoreDeduction: { type: Number, default: 5 },
      recommendations: [{ type: String }]
    }
  },

  // Precipitation Rules
  precipitationRules: {
    heavy: {
      threshold: { type: Number, default: 70 },
      scoreDeduction: { type: Number, default: 20 },
      warning: { type: String, default: '🌧️ Heavy rain expected - flooding risk' },
      recommendations: [{ type: String }]
    },
    moderate: {
      threshold: { type: Number, default: 40 },
      scoreDeduction: { type: Number, default: 10 },
      recommendations: [{ type: String }]
    }
  },

  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeatherRecommendationRules', weatherRecommendationRulesSchema);
