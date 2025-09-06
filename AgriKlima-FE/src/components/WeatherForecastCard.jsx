// src/components/WeatherForecastCard.jsx
import React from 'react';
import { Box, Typography, Paper, Skeleton, Stack, Divider } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import WbCloudyOutlinedIcon from '@mui/icons-material/WbCloudyOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import GrainIcon from '@mui/icons-material/Grain'; // For rain

const WeatherForecastCard = ({ weather, loading }) => {
  const forecast = weather?.daily?.slice(0, 7) || [];

  const getWeatherIcon = (condition) => {
    if (!condition) return <WbCloudyOutlinedIcon color="action" sx={{ fontSize: 32 }} />;
    const lower = condition.toLowerCase();

    if (lower.includes('sun'))
      return <WbSunnyOutlinedIcon sx={{ color: '#CDDC39', fontSize: 32 }} />;
    if (lower.includes('rain'))
      return <GrainIcon sx={{ color: '#8BC34A', fontSize: 32 }} />;
    if (lower.includes('cloud'))
      return <WbCloudyOutlinedIcon sx={{ color: '#A5D6A7', fontSize: 32 }} />;

    return <WbCloudyOutlinedIcon color="action" sx={{ fontSize: 32 }} />;
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(145deg, #f1f8e9, #e8f5e9)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 28px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <EventIcon sx={{ mr: 1.5, fontSize: '2rem', color: '#2e7d32' }} />
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            color: '#2e7d32',
          }}
        >
          7-Day Forecast
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={1}
        sx={{ overflowX: 'auto', flexGrow: 1, p: 1 }}
      >
        {loading ? (
          [...Array(7)].map((_, i) => (
            <Box key={i} sx={{ p: 2, textAlign: 'center', minWidth: 90 }}>
              <Skeleton variant="text" width={40} height={20} sx={{ mx: 'auto', borderRadius: '10px' }} />
              <Skeleton variant="circular" width={40} height={40} sx={{ my: 1, mx: 'auto' }} />
              <Skeleton variant="text" width={40} height={25} sx={{ mx: 'auto', borderRadius: '10px' }} />
            </Box>
          ))
        ) : forecast.length > 0 ? (
          forecast.map((day, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 2,
                textAlign: 'center',
                borderRadius: '12px',
                background: 'rgba(139, 195, 74, 0.1)',
                minWidth: 90,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                {day.day.substring(0, 3)}
              </Typography>
              <Box sx={{ my: 1 }}>{getWeatherIcon(day.condition)}</Box>
              <Typography sx={{ fontWeight: 'bold', fontFamily: 'Inter, sans-serif' }}>
                {Math.round(day.temperature)}°C
              </Typography>
            </Paper>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
            <Typography color="text.secondary" sx={{ fontFamily: 'Inter, sans-serif' }}>
              Forecast not available.
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default WeatherForecastCard;
