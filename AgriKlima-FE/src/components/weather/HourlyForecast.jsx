// src/components/weather/HourlyForecast.jsx
import React from 'react';
import { Paper, Box, Typography, Skeleton, Stack, useTheme } from '@mui/material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WbCloudyOutlinedIcon from '@mui/icons-material/WbCloudyOutlined';
import GrainIcon from '@mui/icons-material/Grain';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const playfairFont = { fontFamily: '"Playfair Display", serif' };

const HourlyItem = ({ time, icon, temp, loading }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      textAlign: 'center',
      borderRadius: '10px',
      minWidth: 100,
      backgroundColor: '#ffffff', // light background
      color: '#000',
      flexShrink: 0,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // subtle shadow for each item
    }}
  >
    {loading ? (
      <Stack alignItems="center" spacing={1}>
        <Skeleton variant="text" width={40} height={20} />
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="text" width={40} height={30} />
      </Stack>
    ) : (
      <>
        <Typography variant="body2" sx={{ fontWeight: 600, ...playfairFont, color: '#000' }}>
          {time}
        </Typography>
        <Box my={1} sx={{ fontSize: 28 }}>{icon}</Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            ...playfairFont,
            fontSize: '1.25rem',
            color: '#000',
          }}
        >
          {temp}°
        </Typography>
      </>
    )}
  </Paper>
);

const getWeatherIcon = (condition, theme) => {
  if (!condition) return <WbCloudyOutlinedIcon sx={{ fontSize: 28, color: '#555' }} />;
  const lowerCaseCondition = condition.toLowerCase();
  if (lowerCaseCondition.includes('sun'))
    return <WbSunnyOutlinedIcon sx={{ color: theme.palette.warning.main, fontSize: 28 }} />;
  if (lowerCaseCondition.includes('rain'))
    return <GrainIcon sx={{ color: theme.palette.info.main, fontSize: 28 }} />;
  return <WbCloudyOutlinedIcon sx={{ fontSize: 28, color: '#555' }} />;
};

const HourlyForecast = ({ weather, loading }) => {
  const theme = useTheme();
  const forecast = weather?.hourly || [];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '10px',
        backgroundColor: '#ffffff', // simple white background
        color: '#000',
        width: '100%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // subtle shadow for the whole block
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AccessTimeIcon sx={{ mr: 1.5, fontSize: 26, color: '#000' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, ...playfairFont, color: '#000' }}>
          Hourly Forecast
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
        {loading
          ? [...Array(6)].map((_, i) => <HourlyItem key={i} loading={true} />)
          : forecast.length > 0
          ? forecast.map((item, index) => (
              <HourlyItem
                key={index}
                time={item.time}
                icon={getWeatherIcon(item.condition, theme)}
                temp={Math.round(item.temperature)}
              />
            ))
          : (
            <Typography sx={{ p: 2, ...playfairFont, color: '#000' }}>
              Hourly data not available.
            </Typography>
          )}
      </Box>
    </Paper>
  );
};

export default HourlyForecast;
