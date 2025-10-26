// src/components/WeatherForecastCard.jsx

import React from 'react';
import { Paper, Box, Typography, Grid, Skeleton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Whatshot from '@mui/icons-material/Whatshot';
import AcUnit from '@mui/icons-material/AcUnit';
import { getWeatherIcon } from '../utils/weatherIcons'; // Import utility function

const WeatherForecastCard = ({ weather, loading, peakHot, peakCold }) => {
  const navigate = useNavigate();

  const handleViewForecast = () => {
    navigate('/weather');
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CalendarMonthIcon color="primary" />
          <Skeleton width={150} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={200} />
      </Paper>
    );
  }

  const hasForecast = weather && weather.daily && weather.daily.length > 0;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, height: '100%', display: 'flex', flexDirection: 'column',
        borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }
      }}
      onClick={handleViewForecast}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CalendarMonthIcon color="primary" />
        <Typography variant="h6" fontWeight="600" color="primary">7-Day Forecast</Typography>
      </Box>

      {/* Peak Temperature Section (Merged with extra null/undefined check) */}
      {hasForecast && peakHot && peakCold && (
        <>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Whatshot color="error" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Hottest</Typography>
                  <Typography variant="body2" fontWeight="bold">{peakHot.temp}° on {peakHot.day}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AcUnit color="info" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Coldest</Typography>
                  <Typography variant="body2" fontWeight="bold">{peakCold.temp}° on {peakCold.day}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 2 }}/>
        </>
      )}

      {hasForecast ? (
        <Grid container spacing={1.5} sx={{ flex: 1 }}>
          {weather.daily.slice(0, 4).map((day, index) => (
            <Grid item xs={6} key={index}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body2" fontWeight="600">{day.day}</Typography>
                <Box sx={{ my: 1 }}>
                  {getWeatherIcon(day.icon, '2rem')}
                </Box>
                <Typography variant="body2" fontWeight="bold">{day.high}° / {day.low}°</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Box>
            <CalendarMonthIcon sx={{ fontSize: '3rem', color: 'text.secondary', opacity: 0.3 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Forecast not available.</Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
          View Full Forecast →
        </Typography>
      </Box>
    </Paper>
  );
};

export default WeatherForecastCard;