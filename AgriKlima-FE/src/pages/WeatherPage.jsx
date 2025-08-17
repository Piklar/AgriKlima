// src/pages/WeatherPage.jsx

import React, { useState, useEffect } from 'react';
// IMPORTANT: Add ButtonBase for the clickable card
import { Container, Box, Typography, Grid, Paper, InputBase, Fab, ButtonBase } from '@mui/material';

// --- Component Imports ---
import DetailedWeatherOverlay from '../components/DetailedWeatherOverlay'; // <-- Import the new overlay

// --- Icon Imports ---
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import GrainIcon from '@mui/icons-material/Grain'; // For rain
import NavigationIcon from '@mui/icons-material/Navigation';
import chatbotIcon from '../assets/images/chatbot-icon.png';

// --- Reusable Hourly Forecast Item ---
const HourlyForecastItem = ({ time, icon, temp, windSpeed, isNight }) => (
    <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: isNight ? '#4a5568' : '#ffc107',
        color: isNight ? 'white' : 'black',
        borderRadius: '24px',
        p: 2,
        minWidth: '80px',
        textAlign: 'center'
    }}>
        <Typography variant="body2">{time}</Typography>
        <Box my={1}>{icon}</Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{temp}°C</Typography>
        <NavigationIcon sx={{ transform: 'rotate(180deg)', fontSize: '1rem', mt: 1 }} />
        <Typography variant="caption">{windSpeed}km/h</Typography>
    </Box>
);

// --- Main Weather Page Component ---
const WeatherPage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isDetailOpen, setIsDetailOpen] = useState(false); // <-- Add state for overlay

    const handleOpenDetail = () => setIsDetailOpen(true);
    const handleCloseDetail = () => setIsDetailOpen(false);

    // Effect to update the clock every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer); // Cleanup on component unmount
    }, []);

    const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const formatDate = (date) => date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    // Mock Data
    const dailyForecast = [
        { day: 'Friday, 1 Sep', temp: '20', icon: <WbCloudyIcon /> },
        { day: 'Saturday, 2 Sep', temp: '22', icon: <WbSunnyIcon sx={{ color: '#ffc107' }} /> },
        { day: 'Sunday, 3 Sep', temp: '27', icon: <WbSunnyIcon sx={{ color: '#ffc107' }} /> },
        { day: 'Monday, 4 Sep', temp: '18', icon: <WbCloudyIcon /> },
        { day: 'Tuesday, 5 Sep', temp: '16', icon: <GrainIcon /> },
    ];

    return (
        <Box sx={{ py: 4, px: { xs: 2, md: 6 } }}>
            {/* --- Search Bar & Chatbot --- */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4, position: 'relative' }}>
                <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', borderRadius: '30px', bgcolor: '#e0e0e0' }}>
                    <SearchIcon sx={{ p: '10px', color: 'grey.700' }} />
                    <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search Municipality..." />
                </Paper>
                <Fab sx={{ position: 'absolute', right: 0, top: 0, bgcolor: 'white', '&:hover': { bgcolor: '#f0f0f0' } }}>
                    <img src={chatbotIcon} alt="Chatbot" style={{ width: '100%', height: '100%' }} />
                </Fab>
            </Box>

            {/* --- Main Grid --- */}
            <Grid container spacing={3}>
                {/* Main Weather Card */}
                <Grid item xs={12} md={7}>
                    {/* WRAP THE PAPER IN A CLICKABLE ButtonBase */}
                    <ButtonBase 
                        onClick={handleOpenDetail}
                        sx={{ 
                            width: '100%', 
                            borderRadius: '30px',
                            textAlign: 'left',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.01)' }
                        }}
                    >
                        <Paper elevation={0} sx={{ width: '100%', p: 4, borderRadius: '30px', background: 'linear-gradient(to right, #a8e063, #f9d423)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocationOnIcon />
                                <Typography variant="h5" sx={{ ml: 1, fontWeight: 600 }}>Mexico, Pampanga</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', my: 3 }}>
                                <DeviceThermostatIcon sx={{ fontSize: '4rem' }} />
                                <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '7rem' }}>27°</Typography>
                                <WbCloudyIcon sx={{ fontSize: '6rem', color: 'rgba(255,255,255,0.8)' }} />
                            </Box>
                            <Grid container textAlign="center">
                                <Grid item xs={3}><Typography>HUMIDITY</Typography><Typography sx={{fontWeight: 600}}>99%</Typography></Grid>
                                <Grid item xs={3}><Typography>VISIBILITY</Typography><Typography sx={{fontWeight: 600}}>8km</Typography></Grid>
                                <Grid item xs={3}><Typography>AIR PRESSURE</Typography><Typography sx={{fontWeight: 600}}>1005hPa</Typography></Grid>
                                <Grid item xs={3}><Typography>WIND</Typography><Typography sx={{fontWeight: 600}}>2mph</Typography></Grid>
                            </Grid>
                        </Paper>
                    </ButtonBase>
                </Grid>

                {/* 5 Day Forecast & Clock */}
                <Grid item xs={12} md={5}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: '30px', bgcolor: '#fff9c4' }}>
                                <Typography variant="h6" sx={{fontWeight: 600, mb: 2}}>5 Days Forecast:</Typography>
                                {dailyForecast.map(item => (
                                    <Box key={item.day} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                        {item.icon}
                                        <Typography sx={{flex: 1, ml: 2, fontWeight: 500}}>{item.temp}°C</Typography>
                                        <Typography color="text.secondary">{item.day}</Typography>
                                    </Box>
                                ))}
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: '30px', bgcolor: '#fff9c4', textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '5rem', fontWeight: 'bold', lineHeight: 1.2 }}>
                                    {formatTime(currentTime)}
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    {formatDate(currentTime)}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Hourly Forecast */}
                <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '30px', bgcolor: '#fff9c4' }}>
                        <Typography variant="h6" sx={{fontWeight: 600, mb: 2}}>Hourly Forecast:</Typography>
                        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                            <HourlyForecastItem time="12:00" icon={<WbSunnyIcon />} temp="26" windSpeed="3" />
                            <HourlyForecastItem time="15:00" icon={<WbSunnyIcon />} temp="27" windSpeed="2" />
                            <HourlyForecastItem time="18:00" icon={<WbCloudyIcon />} temp="27" windSpeed="2" />
                            <HourlyForecastItem time="21:00" icon={<WbCloudyIcon />} temp="25" windSpeed="3" isNight />
                            <HourlyForecastItem time="00:00" icon={<WbSunnyIcon />} temp="22" windSpeed="3" isNight />
                            {/* Add more items here if needed */}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* --- RENDER THE OVERLAY COMPONENT --- */}
            <DetailedWeatherOverlay open={isDetailOpen} onClose={handleCloseDetail} />
        </Box>
    );
};

export default WeatherPage;