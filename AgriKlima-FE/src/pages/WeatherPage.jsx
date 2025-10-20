// src/pages/WeatherPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  ThemeProvider,
  MenuItem,
  Select,
  FormControl,
  CircularProgress // <-- Import CircularProgress for a better loading experience
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
    body1: { fontSize: '1.05rem', lineHeight: 1.6 },
    body2: { fontSize: '0.95rem', lineHeight: 1.5 },
  },
  shape: { borderRadius: 10 },
});

const LOCATIONS = ['San Fernando', 'Santa Ana', 'Mexico', 'Bacolor', 'Arayat'];

const WeatherPage = () => {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FIX #1: Initialize location state as an empty string ---
  // This prevents the page from immediately fetching "San Fernando" by default.
  const [location, setLocation] = useState('');

  // --- FIX #2: Add a new useEffect hook to set the initial location from the user object ---
  useEffect(() => {
    // This effect runs when the 'user' object from useAuth() is loaded.
    if (user && user.location) {
      // Parse the user's location (e.g., "Mexico, Pampanga") to get the city/municipality.
      const userCity = user.location.split(',')[0].trim();
      
      // Find a matching location from our predefined list.
      const matchedLocation = LOCATIONS.find(loc => userCity.includes(loc));

      if (matchedLocation) {
        setLocation(matchedLocation);
      } else {
        // If the user's location isn't in our list, use a default fallback.
        setLocation('San Fernando');
      }
    } else if (user) {
      // If the user object is available but has no location property, set a default.
      setLocation('San Fernando');
    }
    // This effect should only run when the 'user' object changes.
  }, [user]);

  const fetchWeather = useCallback(async () => {
    // --- FIX #3: Add a guard clause to prevent fetching if the location hasn't been set yet ---
    if (!location) {
      return;
    }
    
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
  }, [location]); // This correctly depends on 'location'.

  useEffect(() => {
    // This effect will now wait until 'location' is set by the user data before running.
    fetchWeather();
  }, [fetchWeather]);

  const handleLocationChange = (event) => setLocation(event.target.value);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 3, md: 5 } }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                color: 'black',
                fontSize: { xs: '1.8rem', md: '2.8rem' },
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              Weather Forecast
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}
            >
              Real-time weather data for Pampanga's 3rd District
            </Typography>
          </Box>

          {/* Location Selector */}
          <Box sx={{ mb: { xs: 3, md: 5 }, display: 'flex', justifyContent: 'center' }}>
            <Paper
              elevation={3}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 3, minWidth: 280, maxWidth: 360 }}
            >
              <LocationOnIcon color="primary" />
              {/* --- FIX #4: Show a loading state while waiting for the user's location --- */}
              {!location ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                  <CircularProgress size={20} />
                  <Typography color="text.secondary">Getting your location...</Typography>
                </Box>
              ) : (
                <FormControl fullWidth>
                  <Select
                    value={location}
                    onChange={handleLocationChange}
                    variant="standard"
                    disableUnderline
                    sx={{ fontSize: '1rem', fontWeight: 500 }}
                  >
                    {LOCATIONS.map((loc) => (
                      <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Paper>
          </Box>

          {/* Main Content Layout */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: { xs: 3, md: 7 },
              mb: 4,
            }}
          >
            <Box sx={{
              flex: '1 1 400px',
              maxWidth: 520,
              p: { xs: 1, md: 2 },
              display: 'flex',
              flexDirection: 'column',
              minHeight: 640,
              maxHeight: 720,
              overflowY: 'auto',
            }}>
              <DailyForecast forecast={weatherData?.daily || []} loading={loading} />
            </Box>

            <Box sx={{
              flex: '1 1 440px',
              maxWidth: 580,
              p: { xs: 1, md: 2 },
              display: 'flex',
              justifyContent: 'center',
            }}>
              <CurrentWeather weather={weatherData} loading={loading} />
            </Box>

            <Box sx={{
              flex: '1 1 400px',
              maxWidth: 520,
              p: { xs: 1, md: 2 },
              display: 'flex',
              flexDirection: 'column',
              minHeight: 640,
              maxHeight: 720,
              overflowY: 'auto',
            }}>
              <FarmingAdvice advice={weatherData?.farmingAdvice} loading={loading} />
            </Box>
          </Box>

          <Box sx={{ width: '100%', mb: 3, px: 1, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: '1600px', boxSizing: 'border-box' }}>
              <HourlyForecast forecast={weatherData?.hourly || []} loading={loading} />
            </Box>
          </Box>

          {weatherData && !loading && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
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