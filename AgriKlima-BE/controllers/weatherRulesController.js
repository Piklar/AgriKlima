// backend/controllers/weatherRulesController.js

const WeatherRecommendationRules = require('../models/WeatherRecommendationRules');

// Get active rules
module.exports.getActiveRules = async (req, res) => {
  try {
    let rules = await WeatherRecommendationRules.findOne({ active: true });
    
    // If no rules exist, create default ones
    if (!rules) {
      rules = new WeatherRecommendationRules({
        temperatureRules: {
          extremelyCold: {
            threshold: 18,
            scoreDeduction: 30,
            warning: '🌡️ Temperature too cold for most crops',
            recommendations: ['Consider covering sensitive plants', 'Delay planting heat-loving crops']
          },
          belowOptimal: {
            minThreshold: 18,
            maxThreshold: 25,
            scoreDeduction: 10,
            recommendations: ['Good for cool-season vegetables']
          },
          optimal: {
            minThreshold: 25,
            maxThreshold: 32,
            scoreDeduction: 0,
            recommendations: ['Excellent temperature for tropical crops']
          },
          highTemp: {
            minThreshold: 32,
            maxThreshold: 35,
            scoreDeduction: 10,
            warning: '🌡️ High temperature - ensure adequate irrigation',
            recommendations: ['Water crops early morning or late afternoon']
          },
          extremeHeat: {
            threshold: 35,
            scoreDeduction: 25,
            warning: '🌡️ Extreme heat - crop stress likely',
            recommendations: ['Provide shade for sensitive crops', 'Increase watering frequency']
          }
        },
        humidityRules: {
          low: {
            threshold: 40,
            scoreDeduction: 15,
            warning: '💧 Low humidity - increased water loss',
            recommendations: ['Increase irrigation frequency', 'Consider mulching to retain moisture']
          },
          belowOptimal: {
            minThreshold: 40,
            maxThreshold: 60,
            scoreDeduction: 5,
            recommendations: ['Monitor soil moisture levels']
          },
          optimal: {
            minThreshold: 60,
            maxThreshold: 80,
            scoreDeduction: 0,
            recommendations: ['Optimal humidity for plant growth']
          },
          high: {
            threshold: 80,
            scoreDeduction: 10,
            warning: '💧 High humidity - disease risk increased',
            recommendations: ['Ensure good air circulation', 'Monitor for fungal diseases']
          }
        },
        windRules: {
          high: {
            threshold: 30,
            scoreDeduction: 15,
            warning: '💨 High winds - avoid spraying',
            recommendations: ['Secure tall crops and structures', 'Delay pesticide application']
          },
          moderate: {
            threshold: 20,
            scoreDeduction: 5,
            recommendations: ['Moderate winds - be cautious with spraying']
          }
        },
        precipitationRules: {
          heavy: {
            threshold: 70,
            scoreDeduction: 20,
            warning: '🌧️ Heavy rain expected - flooding risk',
            recommendations: ['Delay fertilizer application', 'Check drainage systems', 'Postpone pesticide spraying']
          },
          moderate: {
            threshold: 40,
            scoreDeduction: 10,
            recommendations: ['Good rainfall for crops', 'Delay irrigation']
          }
        },
        active: true
      });
      await rules.save();
    }
    
    res.status(200).json(rules);
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({ error: 'Failed to fetch rules', details: error.message });
  }
};

// Update rules (Admin only)
module.exports.updateRules = async (req, res) => {
  try {
    // Deactivate all existing rules
    await WeatherRecommendationRules.updateMany({}, { active: false });
    
    // Create or update new rules
    const rules = new WeatherRecommendationRules({
      ...req.body,
      active: true,
      createdBy: req.user.id,
      lastUpdated: new Date()
    });
    
    await rules.save();
    
    res.status(200).json({ message: 'Rules updated successfully', rules });
  } catch (error) {
    console.error('Error updating rules:', error);
    res.status(500).json({ error: 'Failed to update rules', details: error.message });
  }
};

// Reset to default rules (Admin only)
module.exports.resetToDefault = async (req, res) => {
  try {
    await WeatherRecommendationRules.deleteMany({});
    
    const rules = await module.exports.getActiveRules(req, res);
    
    res.status(200).json({ message: 'Rules reset to default', rules });
  } catch (error) {
    console.error('Error resetting rules:', error);
    res.status(500).json({ error: 'Failed to reset rules', details: error.message });
  }
};
