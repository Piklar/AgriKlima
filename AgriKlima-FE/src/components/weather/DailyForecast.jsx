// src/components/weather/DailyForecast.jsx

import React from 'react';
import { Paper, Box, Typography, Skeleton, Divider } from '@mui/material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import CloudIcon from '@mui/icons-material/Cloud';
import GrainIcon from '@mui/icons-material/Grain';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';

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
    case '13': return <AcUnitIcon sx={{ ...commonStyle, color: '#81d4fa' }} />;
    default: return <CloudIcon sx={{ ...commonStyle, color: '#90caf9' }} />;
  }
};

const DailyForecast = ({ forecast, loading }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom fontWeight="600" color="primary">
        7-Day Forecast
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {/* Make the scroll container explicitly sized relative to the Paper height.
          96px is an approximate space for header + divider + padding; adjust if you change padding/header size */}
      <Box
        sx={{
          mt: 2,
          overflowY: 'auto',
          // ensure this container never exceeds the Paper's height
          maxHeight: 'calc(100% - 96px)',
          flex: '0 1 auto',
          pr: 1.5,
          scrollbarWidth: 'thin',
          scrollbarColor: '#a5d6a7 #f0f0f0',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#a5d6a7',
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#81c784',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
          },
          scrollBehavior: 'smooth',
        }}
      >
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Skeleton width="100%" height={100} sx={{ borderRadius: 2 }} />
              </Box>
            ))
          : forecast.map((day, index) => (
              <Box
  key={index}
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' }, // stack on very small screens
    alignItems: 'center',
    justifyContent: 'space-between',
    p: 2,
    mb: 1.5,
    borderRadius: 3,
    bgcolor: index === 0 ? 'primary.light' : 'background.default',
    color: index === 0 ? 'white' : 'inherit',
    border: index === 0 ? '2px solid #2e7d32' : '1px solid #e0e0e0',
    transition: 'all 0.2s',
    '&:hover': { 
      bgcolor: index === 0 ? 'primary.main' : '#f5f5f5',
      transform: 'translateX(8px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    width: '100%',
    boxSizing: 'border-box',
  }}
>
  <Box sx={{ flex: 1, minWidth: 0, mb: { xs: 1, sm: 0 } }}>
    <Typography variant="h6" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
      {day.day}
    </Typography>
    <Typography variant="body2" sx={{ opacity: index === 0 ? 0.9 : 0.7, wordBreak: 'break-word' }}>
      {day.date}
    </Typography>
  </Box>

  <Box sx={{ flex: 1, minWidth: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 1, sm: 0 } }}>
    {getWeatherIcon(day.icon)}
    <Typography variant="body2" fontWeight="500" sx={{ mt: 1, wordBreak: 'break-word', textAlign: 'center' }}>
      {day.condition}
    </Typography>
  </Box>

  <Box sx={{ flex: 1, minWidth: 0, textAlign: 'center', mb: { xs: 1, sm: 0 } }}>
    <Typography variant="body2" sx={{ mb: 0.5, opacity: index === 0 ? 0.9 : 0.7, wordBreak: 'break-word' }}>
      💧 {day.humidity}% humidity
    </Typography>
    <Typography variant="body2" sx={{ opacity: index === 0 ? 0.9 : 0.7, wordBreak: 'break-word' }}>
      🌧️ {Math.round(day.precipitation)}% rain
    </Typography>
  </Box>

  <Box sx={{ flex: 1, minWidth: 0, textAlign: { xs: 'center', sm: 'right' } }}>
    <Typography variant="h5" fontWeight="bold">
      {day.high}°C
    </Typography>
    <Typography variant="body1" sx={{ opacity: index === 0 ? 0.9 : 0.6 }}>
      {day.low}°C
    </Typography>
  </Box>
</Box>

            ))}
      </Box>
    </Paper>
  );
};

export default DailyForecast;