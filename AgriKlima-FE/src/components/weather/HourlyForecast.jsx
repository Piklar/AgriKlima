// src/components/weather/HourlyForecast.jsx

import React from 'react';
import { Paper, Box, Typography, Skeleton, Divider } from '@mui/material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import CloudIcon from '@mui/icons-material/Cloud';
import GrainIcon from '@mui/icons-material/Grain';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';

const getWeatherIcon = (icon, size = '2.5rem') => {
  if (!icon) return <CloudIcon sx={{ fontSize: size, color: '#90caf9' }} />;
  
  const iconCode = icon.substring(0, 2);
  const commonStyle = { fontSize: size };
  
  switch(iconCode) {
    case '01': return <WbSunnyOutlinedIcon sx={{ ...commonStyle, color: '#ffa000' }} />;
    case '02': 
    case '03': 
    case '04': return <CloudIcon sx={{ ...commonStyle, color: '#90caf9' }} />;
    case '09': 
    case '10': return <GrainIcon sx={{ ...commonStyle, color: '#64b5f6' }} />;
    case '11': return <ThunderstormIcon sx={{ ...commonStyle, color: '#7e57c2' }} />;
    default: return <CloudIcon sx={{ ...commonStyle, color: '#90caf9' }} />;
  }
};

const HourlyForecast = ({ forecast, loading }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="600" color="primary">
        Hourly Forecast
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          py: 2,
          '&::-webkit-scrollbar': { height: 10 },
          '&::-webkit-scrollbar-track': { bgcolor: 'background.default', borderRadius: 5 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'primary.light', borderRadius: 5, '&:hover': { bgcolor: 'primary.main' } }
        }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Box key={i} sx={{ minWidth: 120, textAlign: 'center' }}>
                <Skeleton width={100} sx={{ mx: 'auto' }} />
                <Skeleton variant="circular" width={50} height={50} sx={{ mx: 'auto', my: 1 }} />
                <Skeleton width={80} sx={{ mx: 'auto' }} />
              </Box>
            ))
          : forecast.map((hour, index) => (
              <Box
                key={index}
                sx={{
                  minWidth: 120,
                  textAlign: 'center',
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: 'background.default',
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.2s',
                  '&:hover': { 
                    transform: 'translateY(-8px)', 
                    bgcolor: 'primary.light', 
                    color: 'white',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                  {hour.time}
                </Typography>
                <Box sx={{ my: 1.5 }}>{getWeatherIcon(hour.icon)}</Box>
                <Typography variant="h6" fontWeight="bold">
                  {hour.temperature}°
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8 }}>
                  {hour.condition}
                </Typography>
              </Box>
            ))}
      </Box>
    </Paper>
  );
};

export default HourlyForecast;
