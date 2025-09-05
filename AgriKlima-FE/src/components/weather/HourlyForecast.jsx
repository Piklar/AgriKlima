// src/components/weather/HourlyForecast.jsx

import React from 'react';
import { Paper, Box, Typography, Skeleton, Stack } from '@mui/material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WbCloudyOutlinedIcon from '@mui/icons-material/WbCloudyOutlined';
import GrainIcon from '@mui/icons-material/Grain';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const HourlyItem = ({ time, icon, temp, loading }) => (
    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: '24px', bgcolor: '#fffde7', minWidth: 100 }}>
        {loading ? (
            <Stack alignItems="center" spacing={1}>
                <Skeleton variant="text" width={40} height={20} />
                <Skeleton variant="circular" width={30} height={30} />
                <Skeleton variant="text" width={40} height={30} />
            </Stack>
        ) : (
            <>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{time}</Typography>
                <Box my={1}>{icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{temp}°</Typography>
            </>
        )}
    </Paper>
);

const getWeatherIcon = (condition) => {
    if (!condition) return <WbCloudyOutlinedIcon color="action" />;
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes('sun')) return <WbSunnyOutlinedIcon sx={{ color: '#ffc107' }} />;
    if (lowerCaseCondition.includes('rain')) return <GrainIcon sx={{ color: '#64b5f6' }} />;
    return <WbCloudyOutlinedIcon color="action" />;
};

const HourlyForecast = ({ weather, loading }) => {
    const forecast = weather?.hourly || [];

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: '30px', bgcolor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon color="primary" sx={{ mr: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Hourly Forecast</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                {loading ? (
                    [...Array(6)].map((_, i) => <HourlyItem key={i} loading={true} />)
                ) : forecast.length > 0 ? (
                    forecast.map((item, index) => (
                        <HourlyItem 
                            key={index}
                            time={item.time}
                            icon={getWeatherIcon(item.condition)}
                            temp={Math.round(item.temperature)}
                        />
                    ))
                ) : (
                    <Typography color="text.secondary" sx={{ p: 2 }}>Hourly data not available.</Typography>
                )}
            </Box>
        </Paper>
    );
};

export default HourlyForecast;