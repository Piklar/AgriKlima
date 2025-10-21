// src/components/WeatherTodayCard.jsx

import React from 'react';
import { Box, Typography, Paper, Skeleton, Stack, Divider } from '@mui/material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { getWeatherIcon } from '../utils/weatherIcons'; // <-- IMPORT THE NEW UTILITY

const WeatherTodayCard = ({ weather, loading }) => {
  const current = weather?.current;
  const detailed = weather?.detailed;

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        height: '100%',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.light} 90%)`,
        color: 'white',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 28px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 1,
          fontFamily: '"Playfair Display", serif',
        }}
      >
        Weather Today
      </Typography>

      {loading ? (
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Skeleton variant="text" height={80} sx={{ bgcolor: 'rgba(255,255,255,0.3)'}} />
          <Skeleton variant="text" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.3)'}} />
          <Skeleton variant="rectangular" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.3)'}} />
        </Stack>
      ) : current && detailed ? (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          {/* --- FIX: Use the new icon utility --- */}
          {getWeatherIcon(current.icon, '80px')}

          <Typography variant="h2" sx={{ fontWeight: 'bold', fontFamily: 'Inter, sans-serif' }}>
            {Math.round(current.temperature)}°C
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontFamily: 'Inter, sans-serif' }}>
            {current.condition}
          </Typography>

          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />

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
          <Typography>Weather data not available.</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default WeatherTodayCard;