// backend/routes/weatherRoutes.js

const WeatherRecommendationRules = require('../models/WeatherRecommendationRules');

// Update the generateFarmingRecommendations function
const generateFarmingRecommendations = async (weatherData) => {
  // Fetch active rules
  let rules = await WeatherRecommendationRules.findOne({ active: true });
  
  // If no rules, use defaults (this creates them automatically)
  if (!rules) {
    rules = new WeatherRecommendationRules({ active: true });
    await rules.save();
  }
  
  const temp = weatherData.current.temperature;
  const humidity = weatherData.current.humidity;
  const condition = weatherData.current.condition.toLowerCase();
  const windSpeed = weatherData.current.windSpeed;
  const precipitation = weatherData.daily[0]?.precipitation || 0;

  let score = 100;
  const warnings = [];
  const recommendations = [];
  let status = 'excellent';

  // Temperature scoring using dynamic rules
  if (temp < rules.temperatureRules.extremelyCold.threshold) {
    score -= rules.temperatureRules.extremelyCold.scoreDeduction;
    warnings.push(rules.temperatureRules.extremelyCold.warning);
    recommendations.push(...rules.temperatureRules.extremelyCold.recommendations);
  } else if (temp >= rules.temperatureRules.belowOptimal.minThreshold && 
             temp < rules.temperatureRules.belowOptimal.maxThreshold) {
    score -= rules.temperatureRules.belowOptimal.scoreDeduction;
    recommendations.push(...rules.temperatureRules.belowOptimal.recommendations);
  } else if (temp >= rules.temperatureRules.optimal.minThreshold && 
             temp <= rules.temperatureRules.optimal.maxThreshold) {
    recommendations.push(...rules.temperatureRules.optimal.recommendations);
  } else if (temp > rules.temperatureRules.highTemp.minThreshold && 
             temp <= rules.temperatureRules.highTemp.maxThreshold) {
    score -= rules.temperatureRules.highTemp.scoreDeduction;
    warnings.push(rules.temperatureRules.highTemp.warning);
    recommendations.push(...rules.temperatureRules.highTemp.recommendations);
  } else if (temp > rules.temperatureRules.extremeHeat.threshold) {
    score -= rules.temperatureRules.extremeHeat.scoreDeduction;
    warnings.push(rules.temperatureRules.extremeHeat.warning);
    recommendations.push(...rules.temperatureRules.extremeHeat.recommendations);
  }

  // Humidity scoring using dynamic rules
  if (humidity < rules.humidityRules.low.threshold) {
    score -= rules.humidityRules.low.scoreDeduction;
    warnings.push(rules.humidityRules.low.warning);
    recommendations.push(...rules.humidityRules.low.recommendations);
  } else if (humidity >= rules.humidityRules.belowOptimal.minThreshold && 
             humidity < rules.humidityRules.belowOptimal.maxThreshold) {
    score -= rules.humidityRules.belowOptimal.scoreDeduction;
    recommendations.push(...rules.humidityRules.belowOptimal.recommendations);
  } else if (humidity >= rules.humidityRules.optimal.minThreshold && 
             humidity <= rules.humidityRules.optimal.maxThreshold) {
    recommendations.push(...rules.humidityRules.optimal.recommendations);
  } else if (humidity > rules.humidityRules.high.threshold) {
    score -= rules.humidityRules.high.scoreDeduction;
    warnings.push(rules.humidityRules.high.warning);
    recommendations.push(...rules.humidityRules.high.recommendations);
  }

  // Wind scoring using dynamic rules
  if (windSpeed > rules.windRules.high.threshold) {
    score -= rules.windRules.high.scoreDeduction;
    warnings.push(rules.windRules.high.warning);
    recommendations.push(...rules.windRules.high.recommendations);
  } else if (windSpeed > rules.windRules.moderate.threshold) {
    score -= rules.windRules.moderate.scoreDeduction;
    recommendations.push(...rules.windRules.moderate.recommendations);
  }

  // Precipitation using dynamic rules
  if (precipitation > rules.precipitationRules.heavy.threshold) {
    score -= rules.precipitationRules.heavy.scoreDeduction;
    warnings.push(rules.precipitationRules.heavy.warning);
    recommendations.push(...rules.precipitationRules.heavy.recommendations);
  } else if (precipitation > rules.precipitationRules.moderate.threshold) {
    score -= rules.precipitationRules.moderate.scoreDeduction;
    recommendations.push(...rules.precipitationRules.moderate.recommendations);
  }

  // Weather condition assessment
  if (condition.includes('clear') || condition.includes('sun')) {
    recommendations.push('Good day for field activities', 'Ideal for pesticide/fertilizer application');
  } else if (condition.includes('storm') || condition.includes('thunder')) {
    score -= 30;
    warnings.push('⚠️ Severe weather - secure equipment');
    recommendations.push('Postpone all field activities', 'Secure greenhouses and structures');
  }

  score = Math.max(0, Math.min(100, score));

  if (score >= 91) status = 'excellent';
  else if (score >= 76) status = 'good';
  else if (score >= 60) status = 'fair';
  else status = 'poor';

  if (score >= 76) {
    recommendations.unshift('Conditions are favorable for farming activities');
  } else if (score >= 60) {
    recommendations.unshift('Proceed with caution for farming activities');
  } else {
    recommendations.unshift('Consider postponing non-essential farming activities');
  }

  return {
    score: Math.round(score),
    status,
    statusLabel: 
      score >= 91 ? 'Excellent Conditions' :
      score >= 76 ? 'Good Conditions' :
      score >= 60 ? 'Fair Conditions' : 'Poor Conditions',
    warnings: [...new Set(warnings)],
    recommendations: [...new Set(recommendations)].slice(0, 5),
    details: {
      temperature: temp >= rules.temperatureRules.optimal.minThreshold && 
                   temp <= rules.temperatureRules.optimal.maxThreshold ? 'Optimal' : 
                   temp < rules.temperatureRules.optimal.minThreshold ? 'Below Optimal' : 'Above Optimal',
      humidity: humidity >= rules.humidityRules.optimal.minThreshold && 
                humidity <= rules.humidityRules.optimal.maxThreshold ? 'Optimal' : 
                humidity < rules.humidityRules.optimal.minThreshold ? 'Low' : 'High',
      rainfall: precipitation > 70 ? 'Heavy' : precipitation > 40 ? 'Moderate' : precipitation > 0 ? 'Light' : 'None',
      wind: windSpeed > 30 ? 'Strong' : windSpeed > 20 ? 'Moderate' : 'Light'
    }
  };
};

const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { verify, verifyAdmin } = require('../auth');

// Public routes
router.get('/locations', weatherController.getLocations);
router.get('/:location', weatherController.getWeatherByLocation);

module.exports = router;
