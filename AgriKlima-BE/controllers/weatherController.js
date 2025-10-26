// backend/controllers/weatherController.js

const axios = require('axios');
const WeatherRecommendationRules = require('../models/WeatherRecommendationRules'); // <-- 1. IMPORT THE RULES MODEL

// Coordinates for Pampanga's 3rd District municipalities
const LOCATIONS = {
  'San Fernando': { lat: 15.0794, lon: 120.6200, name: 'San Fernando' },
  'CSFP': { lat: 15.0794, lon: 120.6200, name: 'San Fernando' },
  'City of San Fernando': { lat: 15.0794, lon: 120.6200, name: 'San Fernando' },
  'Sta. Ana': { lat: 15.0942, lon: 120.7700, name: 'Santa Ana' },
  'Santa Ana': { lat: 15.0942, lon: 120.7700, name: 'Santa Ana' },
  'Mexico': { lat: 15.0667, lon: 120.7197, name: 'Mexico' },
  'Bacolor': { lat: 14.9975, lon: 120.6606, name: 'Bacolor' },
  'Arayat': { lat: 15.1500, lon: 120.7667, name: 'Arayat' }
};

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPENMETEO_BASE_URL = 'https://api.open-meteo.com/v1';

const getLocationCoords = (locationName) => {
  const normalized = locationName.trim();
  
  if (LOCATIONS[normalized]) {
    return LOCATIONS[normalized];
  }
  
  const key = Object.keys(LOCATIONS).find(
    k => k.toLowerCase() === normalized.toLowerCase()
  );
  
  if (key) {
    return LOCATIONS[key];
  }
  
  return LOCATIONS['San Fernando'];
};

const getWeatherFromCode = (code) => {
  const weatherCodes = {
    0: { description: 'Clear sky', icon: '01d' }, 1: { description: 'Mainly clear', icon: '01d' },
    2: { description: 'Partly cloudy', icon: '02d' }, 3: { description: 'Overcast', icon: '03d' },
    45: { description: 'Foggy', icon: '50d' }, 48: { description: 'Foggy', icon: '50d' },
    51: { description: 'Light drizzle', icon: '09d' }, 53: { description: 'Moderate drizzle', icon: '09d' },
    55: { description: 'Dense drizzle', icon: '09d' }, 61: { description: 'Light rain', icon: '10d' },
    63: { description: 'Moderate rain', icon: '10d' }, 65: { description: 'Heavy rain', icon: '10d' },
    71: { description: 'Light snow', icon: '13d' }, 73: { description: 'Moderate snow', icon: '13d' },
    75: { description: 'Heavy snow', icon: '13d' }, 77: { description: 'Snow grains', icon: '13d' },
    80: { description: 'Light showers', icon: '09d' }, 81: { description: 'Moderate showers', icon: '09d' },
    82: { description: 'Heavy showers', icon: '09d' }, 85: { description: 'Light snow showers', icon: '13d' },
    86: { description: 'Heavy snow showers', icon: '13d' }, 95: { description: 'Thunderstorm', icon: '11d' },
    96: { description: 'Thunderstorm with hail', icon: '11d' }, 99: { description: 'Thunderstorm with hail', icon: '11d' }
  };
  return weatherCodes[code] || { description: 'Unknown', icon: '03d' };
};

// --- 2. REPLACE THE OLD HARDCODED FUNCTION WITH THE DYNAMIC ONE ---
const generateFarmingRecommendations = async (weatherData) => {
  let rules = await WeatherRecommendationRules.findOne({ active: true });
  
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

  // Temperature scoring
  if (temp < rules.temperatureRules.extremelyCold.threshold) {
    score -= rules.temperatureRules.extremelyCold.scoreDeduction;
    warnings.push(rules.temperatureRules.extremelyCold.warning);
    recommendations.push(...rules.temperatureRules.extremelyCold.recommendations);
  } else if (temp < rules.temperatureRules.belowOptimal.maxThreshold) {
    score -= rules.temperatureRules.belowOptimal.scoreDeduction;
    recommendations.push(...rules.temperatureRules.belowOptimal.recommendations);
  } else if (temp <= rules.temperatureRules.optimal.maxThreshold) {
    recommendations.push(...rules.temperatureRules.optimal.recommendations);
  } else if (temp <= rules.temperatureRules.highTemp.maxThreshold) {
    score -= rules.temperatureRules.highTemp.scoreDeduction;
    warnings.push(rules.temperatureRules.highTemp.warning);
    recommendations.push(...rules.temperatureRules.highTemp.recommendations);
  } else {
    score -= rules.temperatureRules.extremeHeat.scoreDeduction;
    warnings.push(rules.temperatureRules.extremeHeat.warning);
    recommendations.push(...rules.temperatureRules.extremeHeat.recommendations);
  }

  // Humidity scoring
  if (humidity < rules.humidityRules.low.threshold) {
    score -= rules.humidityRules.low.scoreDeduction;
    warnings.push(rules.humidityRules.low.warning);
    recommendations.push(...rules.humidityRules.low.recommendations);
  } else if (humidity < rules.humidityRules.belowOptimal.maxThreshold) {
    score -= rules.humidityRules.belowOptimal.scoreDeduction;
    recommendations.push(...rules.humidityRules.belowOptimal.recommendations);
  } else if (humidity <= rules.humidityRules.optimal.maxThreshold) {
    recommendations.push(...rules.humidityRules.optimal.recommendations);
  } else {
    score -= rules.humidityRules.high.scoreDeduction;
    warnings.push(rules.humidityRules.high.warning);
    recommendations.push(...rules.humidityRules.high.recommendations);
  }

  // Wind scoring
  if (windSpeed > rules.windRules.high.threshold) {
    score -= rules.windRules.high.scoreDeduction;
    warnings.push(rules.windRules.high.warning);
    recommendations.push(...rules.windRules.high.recommendations);
  } else if (windSpeed > rules.windRules.moderate.threshold) {
    score -= rules.windRules.moderate.scoreDeduction;
    recommendations.push(...rules.windRules.moderate.recommendations);
  }

  // Precipitation scoring
  if (precipitation > rules.precipitationRules.heavy.threshold) {
    score -= rules.precipitationRules.heavy.scoreDeduction;
    warnings.push(rules.precipitationRules.heavy.warning);
    recommendations.push(...rules.precipitationRules.heavy.recommendations);
  } else if (precipitation > rules.precipitationRules.moderate.threshold) {
    score -= rules.precipitationRules.moderate.scoreDeduction;
    recommendations.push(...rules.precipitationRules.moderate.recommendations);
  }

  if (condition.includes('storm') || condition.includes('thunder')) {
    score -= 30;
    warnings.push('⚠️ Severe weather - secure equipment');
    recommendations.push('Postpone all field activities', 'Secure greenhouses and structures');
  }

  score = Math.max(0, Math.min(100, score));
  let status = 'poor';
  if (score >= 91) status = 'excellent';
  else if (score >= 76) status = 'good';
  else if (score >= 60) status = 'fair';

  if (score >= 76) recommendations.unshift('Conditions are favorable for farming activities');
  else if (score >= 60) recommendations.unshift('Proceed with caution for farming activities');
  else recommendations.unshift('Consider postponing non-essential farming activities');

  return {
    score: Math.round(score),
    status,
    statusLabel: 
      status === 'excellent' ? 'Excellent Conditions' :
      status === 'good' ? 'Good Conditions' :
      status === 'fair' ? 'Fair Conditions' : 'Poor Conditions',
    warnings: [...new Set(warnings)],
    recommendations: [...new Set(recommendations)].slice(0, 5),
    details: {
      temperature: temp >= rules.temperatureRules.optimal.minThreshold && temp <= rules.temperatureRules.optimal.maxThreshold ? 'Optimal' : 'Not Optimal',
      humidity: humidity >= rules.humidityRules.optimal.minThreshold && humidity <= rules.humidityRules.optimal.maxThreshold ? 'Optimal' : 'Not Optimal',
      rainfall: precipitation > 70 ? 'Heavy' : precipitation > 40 ? 'Moderate' : precipitation > 0 ? 'Light' : 'None',
      wind: windSpeed > 30 ? 'Strong' : windSpeed > 20 ? 'Moderate' : 'Light'
    }
  };
};

module.exports.getWeatherByLocation = async (req, res) => {
  try {
    const locationName = decodeURIComponent(req.params.location);
    const coords = getLocationCoords(locationName);

    if (!OPENWEATHER_API_KEY) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const [currentResponse, forecastResponse, openMeteoResponse] = await Promise.all([
      axios.get(`${OPENWEATHER_BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`),
      axios.get(`${OPENWEATHER_BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`),
      axios.get(`${OPENMETEO_BASE_URL}/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max&timezone=Asia/Manila&forecast_days=7`)
    ]);
    
    const current = currentResponse.data;
    const forecast = forecastResponse.data;
    const openMeteoData = openMeteoResponse.data;

    const hourlyForecast = forecast.list.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      temperature: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: Math.round(item.wind.speed * 3.6),
      dt: item.dt
    }));

    const dailyForecast = openMeteoData.daily.time.map((time, i) => {
      const date = new Date(time);
      const weatherInfo = getWeatherFromCode(openMeteoData.daily.weathercode[i]);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        high: Math.round(openMeteoData.daily.temperature_2m_max[i]),
        low: Math.round(openMeteoData.daily.temperature_2m_min[i]),
        condition: weatherInfo.description,
        icon: weatherInfo.icon,
        humidity: current.main.humidity, // Using current humidity as a placeholder
        precipitation: openMeteoData.daily.precipitation_probability_max[i],
        dt: Math.floor(date.getTime() / 1000)
      };
    });

    const weatherData = {
      location: coords.name,
      current: {
        temperature: Math.round(current.main.temp),
        condition: current.weather[0].description.charAt(0).toUpperCase() + current.weather[0].description.slice(1),
        icon: current.weather[0].icon,
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6),
        visibility: (current.visibility / 1000).toFixed(1),
        airPressure: current.main.pressure,
        feelsLike: Math.round(current.main.feels_like)
      },
      detailed: {
        sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        // Placeholder values as OpenWeather free tier doesn't provide them
        feelsLike: Math.round(current.main.feels_like), uvIndex: 'N/A', dewPoint: 'N/A', cloudCover: current.clouds.all
      },
      hourly: hourlyForecast,
      daily: dailyForecast,
      lastUpdated: new Date()
    };
    
    // --- 3. MAKE SURE THIS IS AWAITED ---
    const farmingAdvice = await generateFarmingRecommendations(weatherData);
    weatherData.farmingAdvice = farmingAdvice;

    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    if (error.response) console.error('Error response:', error.response.data);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      details: error.response?.data?.message || error.message 
    });
  }
};

module.exports.getLocations = (req, res) => {
  const locations = Object.values(LOCATIONS)
    .filter((value, index, self) => index === self.findIndex((t) => t.name === value.name))
    .map(loc => loc.name);
  res.status(200).json(locations);
};