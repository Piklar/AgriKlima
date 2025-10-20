// src/components/weather/HourlyForecast.jsx

import React from 'react';
import { Paper, Box, Typography, Skeleton, Divider } from '@mui/material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import CloudIcon from '@mui/icons-material/Cloud';
import GrainIcon from '@mui/icons-material/Grain';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';

const getWeatherIcon = (icon, size = '2rem') => {
  if (!icon) return <CloudIcon sx={{ fontSize: size, color: '#90caf9' }} />;

  const iconCode = icon.substring(0, 2);
  const commonStyle = { fontSize: size };

  switch (iconCode) {
    case '01':
      return <WbSunnyOutlinedIcon sx={{ ...commonStyle, color: '#ffa000' }} />;
    case '02':
    case '03':
    case '04':
      return <CloudIcon sx={{ ...commonStyle, color: '#90caf9' }} />;
    case '09':
    case '10':
      return <GrainIcon sx={{ ...commonStyle, color: '#64b5f6' }} />;
    case '11':
      return <ThunderstormIcon sx={{ ...commonStyle, color: '#7e57c2' }} />;
    default:
      return <CloudIcon sx={{ ...commonStyle, color: '#90caf9' }} />;
  }
};

const HourlyForecast = ({ forecast, loading }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 4,
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h5" fontWeight="600" color="primary" sx={{ mb: 1 }}>
        Hourly Forecast
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
          gap: 2,
          width: '100%',
        }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Box key={i} sx={{ textAlign: 'center' }}>
                <Skeleton width="80%" sx={{ mx: 'auto' }} />
                <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', my: 0.5 }} />
                <Skeleton width="60%" sx={{ mx: 'auto' }} />
              </Box>
            ))
          : forecast.map((hour, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: 'center',
                  p: 1.5,
                  borderRadius: 3,
                  bgcolor: 'background.default',
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    bgcolor: 'primary.light',
                    color: 'white',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {hour.time}
                </Typography>
                <Box sx={{ my: 0.5, display: 'flex', justifyContent: 'center' }}>
                  {getWeatherIcon(hour.icon)}
                </Box>
                <Typography variant="body1" fontWeight="bold">
                  {hour.temperature}Â°
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.25, opacity: 0.8 }}>
                  {hour.condition}
                </Typography>
              </Box>
            ))}
      </Box>
    </Paper>
  );
};

export default HourlyForecast;