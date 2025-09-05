// src/components/WeatherTodayCard.jsx

import React from 'react';
import { Box, Typography, Paper, Skeleton, Stack, Divider } from '@mui/material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbCloudyOutlinedIcon from '@mui/icons-material/WbCloudyOutlined';
import GrainIcon from '@mui/icons-material/Grain'; // For rain

const WeatherTodayCard = ({ weather, loading }) => {
  // Use optional chaining (?.) to safely access nested properties
  const current = weather?.current;
  const detailed = weather?.detailed;

  // A helper function to choose an icon based on the weather condition text
  const getWeatherIcon = (condition) => {
    if (!condition) return <WbCloudyOutlinedIcon sx={{ fontSize: 80, color: 'white', opacity: 0.8 }} />;
    const lowerCaseCondition = condition.toLowerCase();
    
    if (lowerCaseCondition.includes('sun')) return <WbSunnyOutlinedIcon sx={{ fontSize: 80, color: '#ffc107' }} />;
    if (lowerCaseCondition.includes('rain')) return <GrainIcon sx={{ fontSize: 80, color: '#90caf9' }} />;
    if (lowerCaseCondition.includes('cloud')) return <WbCloudyOutlinedIcon sx={{ fontSize: 80, color: 'white', opacity: 0.8 }} />;
    
    // Default icon
    return <WbCloudyOutlinedIcon sx={{ fontSize: 80, color: 'white', opacity: 0.8 }} />;
  };

  return (
    <Paper sx={{ 
      p: 3, borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', height: '100%',
      background: 'linear-gradient(135deg, #66bb6a 30%, #a5d6a7 90%)', color: 'white'
    }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Weather Today</Typography>
      {loading ? (
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Skeleton variant="text" height={80} sx={{ bgcolor: 'rgba(255,255,255,0.3)'}} />
          <Skeleton variant="text" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.3)'}} />
          <Skeleton variant="rectangular" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
        </Stack>
      ) : current && detailed ? ( // Only render if we have data
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          {getWeatherIcon(current.condition)}
          
          {/* Data from weather.current */}
          <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
            {Math.round(current.temperature)}°C
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {current.condition}
          </Typography>
          
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />

          {/* Data from weather.detailed */}
          <Stack direction="row" justifyContent="space-around" spacing={2}>
            <Box>
              <ThermostatIcon />
              <Typography sx={{ fontWeight: 'bold' }}>{detailed.feelsLike}°C</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Feels Like</Typography>
            </Box>
            <Box>
              <WbSunnyOutlinedIcon />
              <Typography sx={{ fontWeight: 'bold' }}>{detailed.sunrise}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Sunrise</Typography>
            </Box>
            <Box>
              <WbTwilightIcon />
              <Typography sx={{ fontWeight: 'bold' }}>{detailed.sunset}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Sunset</Typography>
            </Box>
          </Stack>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography>Weather data not available for your location.</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default WeatherTodayCard;