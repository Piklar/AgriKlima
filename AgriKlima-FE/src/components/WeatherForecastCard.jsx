// src/components/WeatherForecastCard.jsx

import React from 'react';
import { Paper, Box, Typography, Grid, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import CloudIcon from '@mui/icons-material/Cloud';
import GrainIcon from '@mui/icons-material/Grain';

const getWeatherIcon = (icon, size = '2rem') => {
  if (!icon) return <CloudIcon sx={{ fontSize: size, color: '#90caf9' }} />;
  
  const iconCode = icon.substring(0, 2);
  const commonStyle = { fontSize: size };
  
  switch(iconCode) {
    case '01': return <WbSunnyOutlinedIcon sx={{ ...commonStyle, color: '#ffa000' }} />;
    case '09': 
    case '10': return <GrainIcon sx={{ ...commonStyle, color: '#64b5f6' }} />;
    default: return <CloudIcon sx={{ ...commonStyle, color: '#90caf9' }} />;
  }
};

const WeatherForecastCard = ({ weather, loading }) => {
  const navigate = useNavigate();

  const handleViewForecast = () => {
    navigate('/weather');
  };

  if (loading) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CalendarMonthIcon color="primary" />
          <Skeleton width={150} />
        </Box>
        <Skeleton width="100%" height={200} />
      </Paper>
    );
  }

  // Check if we have forecast data
  const hasForecast = weather && weather.daily && weather.daily.length > 0;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
        }
      }}
      onClick={handleViewForecast}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CalendarMonthIcon color="primary" />
        <Typography variant="h6" fontWeight="600" color="primary">
          7-Day Forecast
        </Typography>
      </Box>

      {hasForecast ? (
        <Grid container spacing={1.5} sx={{ flex: 1 }}>
          {weather.daily.slice(0, 4).map((day, index) => (
            <Grid item xs={6} key={index}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  textAlign: 'center',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'white'
                  }
                }}
              >
                <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>
                  {day.day}
                </Typography>
                <Box sx={{ my: 1 }}>
                  {getWeatherIcon(day.icon)}
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {day.high}° / {day.low}°
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {day.condition}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center',
            py: 4
          }}
        >
          <Box>
            <CalendarMonthIcon sx={{ fontSize: '3rem', color: 'text.secondary', opacity: 0.3 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Forecast not available.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click to view weather page
            </Typography>
          </Box>
        </Box>
      )}

      {hasForecast && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            View Full 7-Day Forecast →
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default WeatherForecastCard;
