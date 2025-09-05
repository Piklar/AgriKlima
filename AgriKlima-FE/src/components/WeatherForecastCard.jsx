// src/components/WeatherForecastCard.jsx

import React from 'react';
import { Box, Typography, Paper, Skeleton, Stack, Divider } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import WbCloudyOutlinedIcon from '@mui/icons-material/WbCloudyOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import GrainIcon from '@mui/icons-material/Grain'; // For rain

const WeatherForecastCard = ({ weather, loading }) => {
  // Safely access the daily forecast array and limit it to 7 days
  const forecast = weather?.daily?.slice(0, 7) || [];

  const getWeatherIcon = (condition) => {
    if (!condition) return <WbCloudyOutlinedIcon color="action" />;
    const lowerCaseCondition = condition.toLowerCase();

    if (lowerCaseCondition.includes('sun')) return <WbSunnyOutlinedIcon sx={{ color: '#ffc107', fontSize: 32 }} />;
    if (lowerCaseCondition.includes('rain')) return <GrainIcon sx={{ color: '#64b5f6', fontSize: 32 }} />;
    if (lowerCaseCondition.includes('cloud')) return <WbCloudyOutlinedIcon sx={{ color: 'action', fontSize: 32 }} />;
    
    return <WbCloudyOutlinedIcon color="action" sx={{ fontSize: 32 }} />;
  };

  return (
    <Paper sx={{ p: 3, borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <EventIcon color="secondary" sx={{ mr: 1.5, fontSize: '2rem' }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>7-Day Forecast</Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        spacing={1} 
        sx={{ overflowX: 'auto', flexGrow: 1, p: 1 }}
      >
        {loading ? (
            // Show skeletons while loading
            [...Array(7)].map((_, i) => (
              <Box key={i} sx={{ p: 2, textAlign: 'center', minWidth: 90 }}>
                <Skeleton variant="text" width={40} height={20} sx={{ mx: 'auto' }} />
                <Skeleton variant="circular" width={40} height={40} sx={{ my: 1, mx: 'auto' }} />
                <Skeleton variant="text" width={40} height={25} sx={{ mx: 'auto' }} />
              </Box>
            ))
        ) : forecast.length > 0 ? (
          // Render the real data once it's available
          forecast.map((day, index) => (
            <Paper key={index} elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: '12px', bgcolor: '#f5f5f5', minWidth: 90 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {/* Data from weather.daily[i].day */}
                {day.day.substring(0, 3)}
              </Typography>
              <Box sx={{ my: 1 }}>
                {/* Data from weather.daily[i].condition */}
                {getWeatherIcon(day.condition)}
              </Box>
              <Typography sx={{ fontWeight: 'bold' }}>
                {/* Data from weather.daily[i].temperature */}
                {Math.round(day.temperature)}°C
              </Typography>
            </Paper>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
            <Typography color="text.secondary">Forecast not available.</Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default WeatherForecastCard;