// src/pages/Admin/ManageWeather.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import * as api from '../../services/api';

const ManageWeather = () => {
    // We will manage a single location's weather data
    const location = "Mexico, Pampanga"; // Hardcoded for this example
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchWeather = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.getWeather(location);
            setWeatherData(response.data);
        } catch (error) {
            if (error.response?.status === 404) {
                // If no data exists, create a default structure to populate the form
                setWeatherData({ location, current: {}, detailed: {} });
                Swal.fire('Info', 'No weather data found for this location. You can create a new entry by filling out and saving the form.', 'info');
            } else {
                console.error("Failed to fetch weather:", error);
                Swal.fire('Error', 'Could not fetch weather data.', 'error');
            }
        } finally {
            setLoading(false);
        }
    }, [location]);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [section, key] = name.split('.'); // e.g., "current.temperature"
        
        setWeatherData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.updateWeather(location, weatherData);
            Swal.fire('Success', 'Weather data updated successfully!', 'success');
            fetchWeather();
        } catch (error) {
            Swal.fire('Error', 'Failed to save weather data.', 'error');
        }
    };
    
    if (loading) {
        return <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}><CircularProgress /></Box>;
    }
    
    if (!weatherData) {
        return <Typography>Could not load weather data.</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Manage Weather for {location}</Typography>
            <Paper component="form" onSubmit={handleSave} sx={{ p: 3, borderRadius: '16px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}><Typography variant="h6">Current Conditions</Typography></Grid>
                    <Grid item xs={6} md={3}><TextField fullWidth label="Temperature (°C)" name="current.temperature" value={weatherData.current?.temperature || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={6} md={3}><TextField fullWidth label="Humidity (%)" name="current.humidity" value={weatherData.current?.humidity || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={6} md={3}><TextField fullWidth label="Air Pressure (hPa)" name="current.airPressure" value={weatherData.current?.airPressure || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={6} md={3}><TextField fullWidth label="Wind Speed (mph)" name="current.windSpeed" value={weatherData.current?.windSpeed || ''} onChange={handleChange} /></Grid>
                    
                    <Grid item xs={12} mt={2}><Typography variant="h6">Detailed Information</Typography></Grid>
                    <Grid item xs={6} md={4}><TextField fullWidth label="UV Index" name="detailed.uvIndex" value={weatherData.detailed?.uvIndex || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={6} md={4}><TextField fullWidth label="Air Quality" name="detailed.airQuality" value={weatherData.detailed?.airQuality || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={6} md={4}><TextField fullWidth label="Feels Like (°C)" name="detailed.feelsLike" value={weatherData.detailed?.feelsLike || ''} onChange={handleChange} /></Grid>
                </Grid>
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--primary-green)' }}>Save Changes</Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ManageWeather;