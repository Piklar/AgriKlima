// src/pages/WeatherPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Grid, Paper, InputBase, Typography,
  ThemeProvider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { createTheme } from '@mui/material/styles';

import CurrentWeather from '../components/weather/CurrentWeather';
import HourlyForecast from '../components/weather/HourlyForecast';
import DailyForecast from '../components/weather/DailyForecast';
import DetailedWeatherOverlay from '../components/DetailedWeatherOverlay';

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

const WeatherPage = () => {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (user?.location) setLocation(user.location);
  }, [user]);

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
        title: 'Location Not Found',
        text: `Could not find weather data for "${location}". Please try a different municipality in Pampanga's 3rd District.`,
      });
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) setLocation(searchQuery);
  };

  return (
    <ThemeProvider theme={theme}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');`}
      </style>

      <Box sx={{ py: 4, px: { xs: 2, md: 6 }, minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 6 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
              Weather Forecast
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Get accurate weather predictions for your location in Pampanga's 3rd District
            </Typography>
          </Box>

          {/* Search */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <Paper component="form" onSubmit={handleSearch} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', maxWidth: 600, borderRadius: theme.shape.borderRadius, boxShadow: 2 }}>
              <SearchIcon sx={{ p: '10px', color: 'grey.700' }} />
              <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search Municipality (e.g., Mexico, Pampanga)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </Paper>
          </Box>

          {/* Weather Data */}
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} lg={7}>
              <CurrentWeather weather={weatherData} loading={loading} onOpenDetail={() => setIsDetailOpen(true)} />
            </Grid>

            <Grid item xs={12} md={8} lg={5}>
              <HourlyForecast weather={weatherData} loading={loading} />
            </Grid>

            <Grid item xs={12} md={8} lg={5}>
              <DailyForecast weather={weatherData} loading={loading} />
            </Grid>
          </Grid>

          {/* Detail Overlay */}
          {weatherData && (
            <DetailedWeatherOverlay open={isDetailOpen} onClose={() => setIsDetailOpen(false)} weatherData={weatherData} />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default WeatherPage;
