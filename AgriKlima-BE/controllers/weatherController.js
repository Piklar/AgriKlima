// backend/controllers/weatherController.js

const axios = require('axios');

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
    0: { description: 'Clear sky', icon: '01d' },
    1: { description: 'Mainly clear', icon: '01d' },
    2: { description: 'Partly cloudy', icon: '02d' },
    3: { description: 'Overcast', icon: '03d' },
    45: { description: 'Foggy', icon: '50d' },
    48: { description: 'Foggy', icon: '50d' },
    51: { description: 'Light drizzle', icon: '09d' },
    53: { description: 'Moderate drizzle', icon: '09d' },
    55: { description: 'Dense drizzle', icon: '09d' },
    61: { description: 'Light rain', icon: '10d' },
    63: { description: 'Moderate rain', icon: '10d' },
    65: { description: 'Heavy rain', icon: '10d' },
    71: { description: 'Light snow', icon: '13d' },
    73: { description: 'Moderate snow', icon: '13d' },
    75: { description: 'Heavy snow', icon: '13d' },
    77: { description: 'Snow grains', icon: '13d' },
    80: { description: 'Light showers', icon: '09d' },
    81: { description: 'Moderate showers', icon: '09d' },
    82: { description: 'Heavy showers', icon: '09d' },
    85: { description: 'Light snow showers', icon: '13d' },
    86: { description: 'Heavy snow showers', icon: '13d' },
    95: { description: 'Thunderstorm', icon: '11d' },
    96: { description: 'Thunderstorm with hail', icon: '11d' },
    99: { description: 'Thunderstorm with hail', icon: '11d' }
  };
  
  return weatherCodes[code] || { description: 'Unknown', icon: '03d' };
};

const generateFarmingRecommendations = (weatherData) => {
  const temp = weatherData.current.temperature;
  const humidity = weatherData.current.humidity;
  const condition = weatherData.current.condition.toLowerCase();
  const windSpeed = weatherData.current.windSpeed;
  const precipitation = weatherData.daily[0]?.precipitation || 0;

  let score = 100;
  const warnings = [];
  const recommendations = [];
  let status = 'excellent';

  if (temp < 18) {
    score -= 30;
    warnings.push('🌡️ Temperature too cold for most crops');
    recommendations.push('Consider covering sensitive plants');
    recommendations.push('Delay planting heat-loving crops');
  } else if (temp >= 18 && temp < 25) {
    score -= 10;
    recommendations.push('Good for cool-season vegetables');
  } else if (temp >= 25 && temp <= 32) {
    recommendations.push('Excellent temperature for tropical crops');
  } else if (temp > 32 && temp <= 35) {
    score -= 10;
    warnings.push('🌡️ High temperature - ensure adequate irrigation');
    recommendations.push('Water crops early morning or late afternoon');
  } else {
    score -= 25;
    warnings.push('🌡️ Extreme heat - crop stress likely');
    recommendations.push('Provide shade for sensitive crops');
    recommendations.push('Increase watering frequency');
  }

  if (humidity < 40) {
    score -= 15;
    warnings.push('💧 Low humidity - increased water loss');
    recommendations.push('Increase irrigation frequency');
    recommendations.push('Consider mulching to retain moisture');
  } else if (humidity >= 40 && humidity < 60) {
    score -= 5;
    recommendations.push('Monitor soil moisture levels');
  } else if (humidity >= 60 && humidity <= 80) {
    recommendations.push('Optimal humidity for plant growth');
  } else {
    score -= 10;
    warnings.push('💧 High humidity - disease risk increased');
    recommendations.push('Ensure good air circulation');
    recommendations.push('Monitor for fungal diseases');
  }

  if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    if (precipitation > 70) {
      score -= 20;
      warnings.push('🌧️ Heavy rain expected - flooding risk');
      recommendations.push('Delay fertilizer application');
      recommendations.push('Check drainage systems');
      recommendations.push('Postpone pesticide spraying');
    } else if (precipitation > 40) {
      score -= 10;
      recommendations.push('Good rainfall for crops');
      recommendations.push('Delay irrigation');
    } else {
      recommendations.push('Light rain - beneficial for crops');
    }
  } else if (condition.includes('clear') || condition.includes('sun')) {
    recommendations.push('Good day for field activities');
    recommendations.push('Ideal for pesticide/fertilizer application');
  } else if (condition.includes('cloud')) {
    recommendations.push('Moderate conditions for farming');
  } else if (condition.includes('storm') || condition.includes('thunder')) {
    score -= 30;
    warnings.push('⚠️ Severe weather - secure equipment');
    recommendations.push('Postpone all field activities');
    recommendations.push('Secure greenhouses and structures');
  }

  if (windSpeed > 30) {
    score -= 15;
    warnings.push('💨 High winds - avoid spraying');
    recommendations.push('Secure tall crops and structures');
    recommendations.push('Delay pesticide application');
  } else if (windSpeed > 20) {
    score -= 5;
    recommendations.push('Moderate winds - be cautious with spraying');
  }

  score = Math.max(0, Math.min(100, score));

  if (score >= 91) {
    status = 'excellent';
  } else if (score >= 76) {
    status = 'good';
  } else if (score >= 60) {
    status = 'fair';
  } else {
    status = 'poor';
  }

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
    warnings,
    recommendations: recommendations.slice(0, 5),
    details: {
      temperature: temp >= 25 && temp <= 32 ? 'Optimal' : temp < 25 ? 'Below Optimal' : 'Above Optimal',
      humidity: humidity >= 60 && humidity <= 80 ? 'Optimal' : humidity < 60 ? 'Low' : 'High',
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
      return res.status(500).json({ 
        error: 'Weather API key not configured' 
      });
    }

    // Current weather from OpenWeatherMap
    const currentWeatherUrl = `${OPENWEATHER_BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const currentResponse = await axios.get(currentWeatherUrl);
    const current = currentResponse.data;

    // Hourly forecast from OpenWeatherMap
    const forecastUrl = `${OPENWEATHER_BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const forecastResponse = await axios.get(forecastUrl);
    const forecast = forecastResponse.data;

    // 7-day forecast from Open-Meteo (FREE!)
    const openMeteoUrl = `${OPENMETEO_BASE_URL}/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max&timezone=Asia/Manila&forecast_days=7`;
    console.log('Fetching from Open-Meteo:', openMeteoUrl);
    const openMeteoResponse = await axios.get(openMeteoUrl);
    const openMeteoData = openMeteoResponse.data;
    console.log('Open-Meteo data received:', openMeteoData.daily);

    // Hourly forecast
    const hourlyForecast = forecast.list.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      temperature: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: Math.round(item.wind.speed * 3.6),
      dt: item.dt
    }));

    // 7-day forecast from Open-Meteo
    const dailyForecast = [];
    for (let i = 0; i < openMeteoData.daily.time.length; i++) {
      const date = new Date(openMeteoData.daily.time[i]);
      const weatherInfo = getWeatherFromCode(openMeteoData.daily.weathercode[i]);
      
      dailyForecast.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        high: Math.round(openMeteoData.daily.temperature_2m_max[i]),
        low: Math.round(openMeteoData.daily.temperature_2m_min[i]),
        condition: weatherInfo.description,
        icon: weatherInfo.icon,
        humidity: current.main.humidity,
        precipitation: openMeteoData.daily.precipitation_probability_max[i],
        dt: Math.floor(date.getTime() / 1000)
      });
    }

    console.log('Daily forecast created:', dailyForecast.length, 'days');

    const weather = {
      main: current.weather[0].main,
      description: current.weather[0].description.charAt(0).toUpperCase() + current.weather[0].description.slice(1),
      icon: current.weather[0].icon
    };

    const weatherData = {
      location: coords.name,
      current: {
        temperature: Math.round(current.main.temp),
        condition: weather.description,
        icon: weather.icon,
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6),
        visibility: (current.visibility / 1000).toFixed(1),
        airPressure: current.main.pressure,
        feelsLike: Math.round(current.main.feels_like)
      },
      detailed: {
        feelsLike: Math.round(current.main.feels_like),
        uvIndex: 'N/A',
        dewPoint: 'N/A',
        sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        cloudCover: current.clouds.all
      },
      hourly: hourlyForecast,
      daily: dailyForecast,
      lastUpdated: new Date()
    };

    const farmingAdvice = generateFarmingRecommendations(weatherData);
    weatherData.farmingAdvice = farmingAdvice;

    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      details: error.response?.data?.message || error.message 
    });
  }
};

module.exports.getLocations = (req, res) => {
  const locations = Object.values(LOCATIONS)
    .filter((value, index, self) => 
      index === self.findIndex((t) => t.name === value.name)
    )
    .map(loc => loc.name);
  
  res.status(200).json(locations);
};
