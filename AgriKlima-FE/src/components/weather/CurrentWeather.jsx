// src/components/weather/CurrentWeather.jsx

import React from 'react';
import { Paper, Box, Typography, Grid, Skeleton, ButtonBase } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WbCloudyOutlinedIcon from '@mui/icons-material/WbCloudyOutlined';
import GrainIcon from '@mui/icons-material/Grain';
import AirIcon from '@mui/icons-material/Air';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SpeedIcon from '@mui/icons-material/Speed';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    secondary: { main: '#ffa000', light: '#ffc107', dark: '#ff8f00' },
    background: { default: '#f8f9f8' },
  },
  typography: {
    fontFamily: '"Playfair Display", serif',
    h1: { fontWeight: 700, fontSize: '6rem' },
    h2: { fontWeight: 700, fontSize: '3rem' },
    h3: { fontWeight: 700, fontSize: '2.2rem' },
    h5: { fontWeight: 600, fontSize: '1.8rem' },
    body1: { fontSize: '1.1rem', lineHeight: 1.7 },
    body2: { fontSize: '1rem', lineHeight: 1.6 },
    caption: { fontSize: '0.85rem' },
  },
  shape: { borderRadius: '16px' },
});

const getWeatherIcon = (condition, size = '6rem') => {
  if (!condition) return <WbCloudyOutlinedIcon sx={{ fontSize: size, color: 'rgba(255,255,255,0.8)' }} />;
  const lowerCaseCondition = condition.toLowerCase();
  if (lowerCaseCondition.includes('sun')) return <WbSunnyOutlinedIcon sx={{ fontSize: size, color: '#ffc107' }} />;
  if (lowerCaseCondition.includes('rain')) return <GrainIcon sx={{ fontSize: size, color: '#90caf9' }} />;
  return <WbCloudyOutlinedIcon sx={{ fontSize: size, color: 'rgba(255,255,255,0.8)' }} />;
};

const Metric = ({ icon, value, unit, label, loading }) => (
  <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
    {loading ? (
      <Skeleton width={60} height={40} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.3)' }} />
    ) : (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          {icon}
          <Typography sx={{ fontWeight: 600, fontFamily: '"Playfair Display", serif' }}>{value}{unit}</Typography>
        </Box>
        <Typography variant="caption" sx={{ opacity: 0.8, fontFamily: '"Playfair Display", serif' }}>{label}</Typography>
      </>
    )}
  </Grid>
);

const CurrentWeather = ({ weather, loading, onOpenDetail }) => {
  return (
    <ThemeProvider theme={theme}>
      <ButtonBase 
        onClick={onOpenDetail}
        sx={{ 
            width: '100%', borderRadius: '10px', textAlign: 'left',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.02)' }
        }}
      >
        <Paper elevation={0} sx={{ 
            width: '100%', p: { xs: 2, md: 4 }, borderRadius: '10px', 
            background: 'linear-gradient(135deg, #2e7d32 30%, #ffc107 90%)', color: 'white' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon />
            <Typography variant="h5" sx={{ ml: 1, fontWeight: 600, fontFamily: '"Playfair Display", serif' }}>
              {loading ? <Skeleton width={200} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} /> : weather?.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', my: 3 }}>
            {loading ? (
              <Skeleton variant="circular" width={100} height={100} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
            ) : (
              getWeatherIcon(weather?.current?.condition)
            )}
            <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: { xs: '5rem', md: '7rem' }, fontFamily: '"Playfair Display", serif' }}>
              {loading ? <Skeleton width={120} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} /> : `${Math.round(weather?.current?.temperature || 0)}°`}
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 600, fontFamily: '"Playfair Display", serif' }}>
                {loading ? <Skeleton width={80} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} /> : weather?.current?.condition}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, fontFamily: '"Playfair Display", serif' }}>
                {loading ? <Skeleton width={60} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} /> : `Feels like ${weather?.detailed?.feelsLike || '--'}°`}
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={1}>
            <Metric loading={loading} icon={<WaterDropIcon fontSize="small"/>} value={weather?.current?.humidity} unit="%" label="Humidity" />
            <Metric loading={loading} icon={<VisibilityIcon fontSize="small"/>} value={weather?.current?.visibility} unit="km" label="Visibility" />
            <Metric loading={loading} icon={<SpeedIcon fontSize="small"/>} value={weather?.current?.airPressure} unit="hPa" label="Pressure" />
            <Metric loading={loading} icon={<AirIcon fontSize="small"/>} value={weather?.current?.windSpeed} unit="km/h" label="Wind" />
          </Grid>
        </Paper>
      </ButtonBase>
    </ThemeProvider>
  );
};

export default CurrentWeather;
