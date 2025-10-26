// src/components/weather/DailyForecast.jsx

import React from 'react';
import { Paper, Box, Typography, Skeleton, Divider, Grid } from '@mui/material';
import { getWeatherIcon } from '../../utils/weatherIcons';
import Whatshot from '@mui/icons-material/Whatshot';
import AcUnit from '@mui/icons-material/AcUnit';

const DailyForecast = ({ forecast, loading, peakHot, peakCold }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      {/* Title */}
      <Typography variant="h5" gutterBottom fontWeight="600" color="primary">
        7-Day Forecast
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Hottest & Coldest Day Summary */}
      {!loading && forecast.length > 0 && (
        <Grid
          container
          spacing={2}
          sx={{
            mb: 2,
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 2,
            flexShrink: 0,
          }}
        >
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Whatshot color="error" fontSize="large" />
              <Box>
                <Typography variant="body1" color="text.secondary">
                  Hottest Day
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {peakHot?.temp}°C{' '}
                  <Typography component="span" variant="body2">
                    ({peakHot?.day})
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AcUnit color="info" fontSize="large" />
              <Box>
                <Typography variant="body1" color="text.secondary">
                  Coldest Day
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {peakCold?.temp}°C{' '}
                  <Typography component="span" variant="body2">
                    ({peakCold?.day})
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Forecast list and Skeleton Loading */}
      <Box
        sx={{
          mt: 1,
          flexGrow: 1,
          overflowY: 'auto', // scrolls only when needed
          pr: 1,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={80}
                sx={{ mb: 1.5, borderRadius: 3 }}
              />
            ))
          : forecast.map((day, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  mb: 1.5,
                  borderRadius: 3,
                  bgcolor: index === 0 ? 'primary.light' : 'background.default',
                  color: index === 0 ? 'white' : 'inherit',
                  border: index === 0 ? 'none' : '1px solid #e0e0e0',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateX(5px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ flex: 1, minWidth: '80px' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {day.day}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ opacity: index === 0 ? 0.9 : 0.7 }}
                  >
                    {day.date}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  {getWeatherIcon(day.icon, '2.5rem')}
                </Box>

                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{ opacity: index === 0 ? 0.9 : 0.7 }}
                  >
                    💧 {day.humidity}%
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ opacity: index === 0 ? 0.9 : 0.7 }}
                  >
                    🌧️ {Math.round(day.precipitation)}%
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography variant="h5" fontWeight="bold">
                    {day.high}°
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ opacity: index === 0 ? 0.9 : 0.6 }}
                  >
                    {day.low}°
                  </Typography>
                </Box>
              </Box>
            ))}
      </Box>
    </Paper>
  );
};

export default DailyForecast;