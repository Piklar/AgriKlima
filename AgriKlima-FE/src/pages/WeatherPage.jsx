// src/pages/WeatherPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Grid, Paper, Typography,
  ThemeProvider, MenuItem, Select, FormControl
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { createTheme } from '@mui/material/styles';
import CurrentWeather from '../components/weather/CurrentWeather';
import HourlyForecast from '../components/weather/HourlyForecast';
import DailyForecast from '../components/weather/DailyForecast';
import FarmingAdvice from '../components/weather/FarmingAdvice';

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    secondary: { main: '#ffa000', light: '#ffc107', dark: '#ff8f00' },
    background: { default: '#f8f9f8' },
  },
  typography: {
    fontFamily: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '3.5rem', lineHeight: 1.2 },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '3rem', lineHeight: 1.2 },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.8rem', lineHeight: 1.2 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.2rem' },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: '1.8rem' },
    h6: { fontWeight: 600, fontSize: '1.2rem' },
    body1: { fontSize: '1.1rem', lineHeight: 1.7 },
    body2: { fontSize: '1rem', lineHeight: 1.6 },
  },
  shape: { borderRadius: 10 },
});

const LOCATIONS = [
  'San Fernando',
  'Santa Ana',
  'Mexico',
  'Bacolor',
  'Arayat'
];

const WeatherPage = () => {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('San Fernando');

  const fetchWeather = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    try {
      const response = await api.getWeather(location);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      setWeatherData(null);
      Swal.fire({
        icon: 'error',
        title: 'Weather Data Unavailable',
        text: `Could not fetch weather data for ${location}. Please try again later.`,
      });
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" color="primary" gutterBottom>
              Weather Forecast
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time weather data for Pampanga's 3rd District
            </Typography>
          </Box>

          {/* Location Selector */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Paper
              elevation={3}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 3,
                minWidth: 300
              }}
            >
              <LocationOnIcon color="primary" />
              <FormControl fullWidth>
                <Select
                  value={location}
                  onChange={handleLocationChange}
                  variant="standard"
                  disableUnderline
                  sx={{ fontSize: '1.1rem', fontWeight: 500 }}
                >
                  {LOCATIONS.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Box>

          {/* 2x2 Grid Layout - Matching your Paint mockup */}
          <Grid container spacing={3}>
            {/* Row 1: Two equal boxes */}
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '100%' }}>
                <CurrentWeather weather={weatherData} loading={loading} />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '100%' }}>
                <FarmingAdvice advice={weatherData?.farmingAdvice} loading={loading} />
              </Box>
            </Grid>
            
            {/* Row 2: Two full-width boxes */}
            <Grid item xs={12}>
              <HourlyForecast forecast={weatherData?.hourly || []} loading={loading} />
            </Grid>
            
            <Grid item xs={12}>
              <DailyForecast forecast={weatherData?.daily || []} loading={loading} />
            </Grid>
          </Grid>

          {/* Last Updated */}
          {weatherData && !loading && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Last updated: {new Date(weatherData.lastUpdated).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Data provided by OpenWeatherMap & Open-Meteo
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default WeatherPage;
