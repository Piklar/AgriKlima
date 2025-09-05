// src/pages/WeatherPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Grid, Paper, InputBase, Fab, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

// Import the new components
import CurrentWeather from '../components/weather/CurrentWeather';
import HourlyForecast from '../components/weather/HourlyForecast';
import DailyForecast from '../components/weather/DailyForecast';
import DetailedWeatherOverlay from '../components/DetailedWeatherOverlay';
import chatbotIcon from '../assets/images/chatbot-icon.png';

const WeatherPage = () => {
    const { user } = useAuth();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Set the initial location from the user's profile
    useEffect(() => {
        if (user?.location) {
            setLocation(user.location);
        }
    }, [user]);

    // Fetch weather data whenever the location state changes
    const fetchWeather = useCallback(async () => {
        if (!location) return;
        setLoading(true);
        try {
            const response = await api.getWeather(location);
            setWeatherData(response.data);
        } catch (error) {
            console.error("Failed to fetch weather:", error);
            setWeatherData(null); // Clear old data on error
            Swal.fire({
                icon: 'error',
                title: 'Location Not Found',
                text: `Could not find weather data for "${location}". Please try a different municipality in Pampanga's 3rd District.`
            });
        } finally {
            setLoading(false);
        }
    }, [location]);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery) {
            setLocation(searchQuery);
        }
    };

    return (
        <Box sx={{ py: 4, px: { xs: 2, md: 6 }, minHeight: '100vh', background: '#f4f6f8' }}>
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4, position: 'relative' }}>
                    <Paper component="form" onSubmit={handleSearch} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', borderRadius: '30px' }}>
                        <SearchIcon sx={{ p: '10px', color: 'grey.700' }} />
                        <InputBase 
                            sx={{ ml: 1, flex: 1 }} 
                            placeholder="Search Municipality (e.g., Mexico, Pampanga)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Paper>
                    <Fab size="small" sx={{ position: 'absolute', right: 0, top: 0, bgcolor: 'white', '&:hover': { bgcolor: '#f0f0f0' }, boxShadow: 2 }}>
                        <img src={chatbotIcon} alt="Chatbot" style={{ width: '100%', height: '100%' }} />
                    </Fab>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} lg={7}>
                        <CurrentWeather 
                            weather={weatherData} 
                            loading={loading}
                            onOpenDetail={() => setIsDetailOpen(true)}
                        />
                    </Grid>
                    <Grid item xs={12} lg={5}>
                        <DailyForecast weather={weatherData} loading={loading} />
                    </Grid>
                    <Grid item xs={12}>
                        <HourlyForecast weather={weatherData} loading={loading} />
                    </Grid>
                </Grid>

                {weatherData && (
                    <DetailedWeatherOverlay 
                        open={isDetailOpen} 
                        onClose={() => setIsDetailOpen(false)}
                        weatherData={weatherData} // Pass the real data
                    />
                )}
            </Container>
        </Box>
    );
};

export default WeatherPage;