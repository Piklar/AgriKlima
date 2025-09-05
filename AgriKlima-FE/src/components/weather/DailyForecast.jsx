// src/components/weather/DailyForecast.jsx

import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, Skeleton, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WbCloudyOutlinedIcon from '@mui/icons-material/WbCloudyOutlined';
import GrainIcon from '@mui/icons-material/Grain';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const getWeatherIcon = (condition) => {
    if (!condition) return <WbCloudyOutlinedIcon color="action" />;
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes('sun')) return <WbSunnyOutlinedIcon sx={{ color: '#ffc107' }} />;
    if (lowerCaseCondition.includes('rain')) return <GrainIcon sx={{ color: '#64b5f6' }} />;
    return <WbCloudyOutlinedIcon color="action" />;
};

const DailyForecast = ({ weather, loading }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const formatDate = (date) => date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    const forecast = weather?.daily?.slice(0, 5) || []; // Show 5 days

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '30px', bgcolor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarTodayIcon color="primary" sx={{ mr: 1.5 }}/>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>5-Day Forecast</Typography>
                    </Box>
                    <List>
                        {loading ? (
                             [...Array(5)].map((_, i) => <ListItem key={i}><Skeleton variant="text" width="100%" height={30} /></ListItem>)
                        ) : forecast.length > 0 ? (
                            forecast.map(item => (
                                <ListItem key={item.day} disablePadding>
                                    <ListItemIcon>{getWeatherIcon(item.condition)}</ListItemIcon>
                                    <ListItemText primary={item.day} primaryTypographyProps={{ fontWeight: 500 }} />
                                    <Typography sx={{ fontWeight: 'bold' }}>{Math.round(item.temperature)}°C</Typography>
                                </ListItem>
                            ))
                        ) : (
                            <Typography color="text.secondary" sx={{ p: 2 }}>5-day forecast not available.</Typography>
                        )}
                    </List>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '30px', bgcolor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '4rem', fontWeight: 'bold', lineHeight: 1.2 }}>
                        {formatTime(currentTime)}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {formatDate(currentTime)}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default DailyForecast;