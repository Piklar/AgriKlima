// src/components/weather/CurrentWeather.jsx

import React from 'react';
import { Paper, Box, Typography, Grid, Skeleton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WbCloudyOutlinedIcon from '@mui/icons-material/WbCloudyOutlined';
import CloudIcon from '@mui/icons-material/Cloud';
import GrainIcon from '@mui/icons-material/Grain';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SpeedIcon from '@mui/icons-material/Speed';
import AirIcon from '@mui/icons-material/Air';

const getWeatherIcon = (icon, size = '6rem') => {
  if (!icon) return <WbCloudyOutlinedIcon sx={{ fontSize: size, color: '#90caf9' }} />;
  
  // OpenWeather icon codes
  const iconCode = icon.substring(0, 2);
  const commonStyle = { fontSize: size };
  
  switch(iconCode) {
    case '01': return <WbSunnyOutlinedIcon sx={{ ...commonStyle, color: '#ffa000' }} />;
    case '02': 
    case '03': 
    case '04': return <CloudIcon sx={{ ...commonStyle, color: '#90caf9' }} />;
    case '09': 
    case '10': return <GrainIcon sx={{ ...commonStyle, color: '#64b5f6' }} />;
    case '11': return <ThunderstormIcon sx={{ ...commonStyle, color: '#7e57c2' }} />;
    case '13': return <AcUnitIcon sx={{ ...commonStyle, color: '#81d4fa' }} />;
    default: return <WbCloudyOutlinedIcon sx={{ ...commonStyle, color: '#90caf9' }} />;
  }
};

const Metric = ({ icon, value, unit, label, loading }) => (
  <Box sx={{ textAlign: 'center' }}>
    {loading ? (
      <Skeleton variant="rectangular" width={100} height={80} sx={{ borderRadius: 2 }} />
    ) : (
      <>
        <Box sx={{ color: 'primary.main', mb: 1 }}>{icon}</Box>
        <Typography variant="h6" fontWeight="bold">
          {value}{unit}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </>
    )}
  </Box>
);

const CurrentWeather = ({ weather, loading }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #2e7d32 0%, #ffc107 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, width: '100%' }}>
          <LocationOnIcon sx={{ mr: 1 }} />
          {loading ? (
            <Skeleton width={200} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          ) : (
            <Typography variant="h4">{weather?.location}</Typography>
          )}
        </Box>

        {/* Weather Icon */}
  <Box sx={{ my: 3, display: 'flex', justifyContent: 'center', width: '100%' }}>
          {loading ? (
            <Skeleton variant="circular" width={100} height={100} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.2)' }} />
          ) : (
            getWeatherIcon(weather?.current?.icon)
          )}
        </Box>

        {/* Temperature */}
        {loading ? (
          <Skeleton width={150} height={80} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.2)' }} />
        ) : (
          <Typography variant="h1" fontWeight="bold" sx={{ textAlign: 'center' }}>
            {Math.round(weather?.current?.temperature || 0)}°C
          </Typography>
        )}

        {/* Condition */}
        {loading ? (
          <Skeleton width={120} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.2)' }} />
        ) : (
          <Typography variant="h5" sx={{ mb: 1 }}>
            {weather?.current?.condition}
          </Typography>
        )}

        {/* Feels Like */}
        {loading ? (
          <Skeleton width={100} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.2)' }} />
        ) : (
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Feels like {weather?.current?.feelsLike || '--'}°C
          </Typography>
        )}
      </Box>

      {/* Metrics */}
      <Grid container spacing={2} sx={{ mt: 4, width: '100%', justifyContent: 'center' }}>
        <Grid item xs={6} sm={3}>
          <Metric
            icon={<WaterDropIcon />}
            value={weather?.current?.humidity}
            unit="%"
            label="Humidity"
            loading={loading}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Metric
            icon={<AirIcon />}
            value={weather?.current?.windSpeed}
            unit=" km/h"
            label="Wind Speed"
            loading={loading}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Metric
            icon={<VisibilityIcon />}
            value={weather?.current?.visibility}
            unit=" km"
            label="Visibility"
            loading={loading}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Metric
            icon={<SpeedIcon />}
            value={weather?.current?.airPressure}
            unit=" hPa"
            label="Pressure"
            loading={loading}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CurrentWeather;