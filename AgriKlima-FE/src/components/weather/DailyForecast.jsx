// src/components/weather/DailyForecast.jsx
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Skeleton,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WbCloudyOutlinedIcon from '@mui/icons-material/WbCloudyOutlined';
import GrainIcon from '@mui/icons-material/Grain';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const getWeatherIcon = (condition, theme) => {
  if (!condition) return <WbCloudyOutlinedIcon sx={{ fontSize: 28, color: '#555' }} />;
  const lowerCaseCondition = condition.toLowerCase();
  if (lowerCaseCondition.includes('sun'))
    return <WbSunnyOutlinedIcon sx={{ color: theme.palette.warning.main, fontSize: 28 }} />;
  if (lowerCaseCondition.includes('rain'))
    return <GrainIcon sx={{ color: theme.palette.info.main, fontSize: 28 }} />;
  return <WbCloudyOutlinedIcon sx={{ fontSize: 28, color: '#555' }} />;
};

const DailyForecast = ({ weather, loading }) => {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (date) =>
    date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const forecast = weather?.daily?.slice(0, 5) || [];
  const playfairFont = { fontFamily: '"Playfair Display", serif' };

  const paperStyle = {
    p: 3,
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    color: '#000',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // added subtle shadow
    ...playfairFont,
  };

  return (
    <Grid container spacing={3}>
      {/* 5-Day Forecast */}
      <Grid item xs={12}>
        <Paper elevation={0} sx={paperStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarTodayIcon sx={{ mr: 1.5, fontSize: 26, color: '#000' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#000', ...playfairFont }}>
              5-Day Forecast
            </Typography>
          </Box>

          <List>
            {loading
              ? [...Array(5)].map((_, i) => (
                  <ListItem key={i}>
                    <Skeleton variant="text" width="100%" height={30} />
                  </ListItem>
                ))
              : forecast.length > 0
              ? forecast.map((item) => (
                  <ListItem
                    key={item.day}
                    disablePadding
                    sx={{ justifyContent: 'space-between' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <ListItemIcon sx={{ minWidth: 40, color: '#000' }}>
                        {getWeatherIcon(item.condition, theme)}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.day}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          color: '#000',
                          ...playfairFont,
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: '#000',
                        ...playfairFont,
                      }}
                    >
                      {Math.round(item.temperature)}°C
                    </Typography>
                  </ListItem>
                ))
              : (
                <Typography sx={{ p: 2, color: '#000', ...playfairFont }}>
                  5-day forecast not available.
                </Typography>
              )}
          </List>
        </Paper>
      </Grid>

      {/* Current Time */}
      <Grid item xs={12}>
        <Paper elevation={0} sx={{ ...paperStyle, textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '4.5rem',
              fontWeight: 'bold',
              lineHeight: 1.2,
              color: '#000',
              ...playfairFont,
            }}
          >
            {formatTime(currentTime)}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontSize: '1.25rem', color: '#000', ...playfairFont }}
          >
            {formatDate(currentTime)}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DailyForecast;
