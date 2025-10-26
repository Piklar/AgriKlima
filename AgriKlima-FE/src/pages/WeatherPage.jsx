// src/pages/WeatherPage.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Import useMemo
import {
    Container,
    Box,
    Paper,
    Typography,
    ThemeProvider,
    MenuItem,
    Select,
    FormControl,
    CircularProgress
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
    const [location, setLocation] = useState('');
    
    // Initialize location based on user profile
    useEffect(() => {
        if (user && user.location) {
            const userCity = user.location.split(',')[0].trim();
            const matchedLocation = LOCATIONS.find(loc => userCity.includes(loc));
            setLocation(matchedLocation || 'San Fernando');
        } else if (user) {
            setLocation('San Fernando');
        }
    }, [user]);

    // Fetch weather data
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

    // Calculate peak temperatures using useMemo
    const { peakHot, peakCold } = useMemo(() => {
        const dailyData = weatherData?.daily;
        if (!dailyData || dailyData.length === 0) {
            return { peakHot: null, peakCold: null };
        }

        // Use reduce for a concise way to find the min/max
        const hottestDay = dailyData.reduce((max, day) => (day.high > max.high ? day : max), dailyData[0]);
        const coldestDay = dailyData.reduce((min, day) => (day.low < min.low ? day : min), dailyData[0]);

        return {
            peakHot: { temp: hottestDay.high, day: hottestDay.day },
            peakCold: { temp: coldestDay.low, day: coldestDay.day }
        };
    }, [weatherData]);

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
                        {/* DAILY FORECAST (Left) */}
                        <Box
                            sx={{
                                flex: '1 1 400px',
                                maxWidth: 520,
                                p: { xs: 1, md: 2 },
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 640,
                                maxHeight: 720,
                                overflowY: 'auto',
                                order: { xs: 2, md: 1 },
                            }}
                        >
                            <DailyForecast
                                forecast={weatherData?.daily || []}
                                loading={loading}
                                peakHot={peakHot} // Pass calculated values
                                peakCold={peakCold} // Pass calculated values
                            />
                        </Box>

                        {/* CURRENT WEATHER (Center on wide, first on mobile) */}
                        <Box
                            sx={{
                                flex: '1 1 440px',
                                maxWidth: 580,
                                p: { xs: 1, md: 2 },
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                order: { xs: 1, md: 2 },
                            }}
                        >
                            <CurrentWeather weather={weatherData} loading={loading} />
                        </Box>

                        {/* FARMING ADVICE (Right) */}
                        <Box
                            sx={{
                                flex: '1 1 400px',
                                maxWidth: 520,
                                p: { xs: 1, md: 2 },
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 640,
                                maxHeight: 720,
                                overflowY: 'auto',
                                order: { xs: 3, md: 3 },
                            }}
                        >
                            <FarmingAdvice advice={weatherData?.farmingAdvice} loading={loading} />
                        </Box>
                    </Box>

                    {/* HOURLY FORECAST */}
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