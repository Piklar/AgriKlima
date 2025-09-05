// src/components/DetailedWeatherOverlay.jsx
import React from 'react';
import { Modal, Box, Typography, Paper, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Icon Imports
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import AirOutlinedIcon from '@mui/icons-material/AirOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined';
import AirIcon from '@mui/icons-material/Air';

const MetricCard = ({ title, icon, value, subtext, description, bgColor }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: '10px',  
      height: '100%',
      bgcolor: bgColor,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.3s',
      '&:hover': { transform: 'translateY(-4px)' }
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>{title}</Typography>
      {icon}
    </Box>
    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
      {value}{subtext && <Typography variant="h6" component="span" sx={{ ml: 0.5 }}>{subtext}</Typography>}
    </Typography>
    <Typography variant="body2" color="text.secondary">{description}</Typography>
  </Paper>
);

const DetailedWeatherOverlay = ({ open, onClose, weatherData }) => {
  if (!weatherData) return null;

  const { detailed, current, location } = weatherData;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: 1000,
          p: 4,
          borderRadius: '10px', 
          backgroundColor: 'background.paper',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Detailed Weather for {location}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Metrics Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="UV Index"
              icon={<WbSunnyOutlinedIcon sx={{ color: '#f57c00' }} />}
              value={detailed.uvIndex}
              description="Higher values require sun protection"
              bgColor="#fff3e0"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Air Quality"
              icon={<AirOutlinedIcon sx={{ color: '#4caf50' }} />}
              value={detailed.airQuality}
              description="Based on local sensor readings"
              bgColor="#e8f5e9"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Precipitation"
              icon={<WaterDropOutlinedIcon sx={{ color: '#03a9f4' }} />}
              value={detailed.precipitation}
              subtext="mm"
              description="Expected in the next 24 hours"
              bgColor="#e0f7fa"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Humidity"
              icon={<WaterDropOutlinedIcon sx={{ color: '#00bcd4' }} />}
              value={current.humidity}
              subtext="%"
              description="The moisture content of the air"
              bgColor="#e0f7fa"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Wind Speed"
              icon={<AirIcon sx={{ color: '#78909c' }} />}
              value={current.windSpeed}
              subtext="km/h"
              description="Current wind conditions"
              bgColor="#eceff1"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Moon Phase"
              icon={<NightsStayOutlinedIcon sx={{ color: '#7e57c2' }} />}
              value={detailed.moonPhase}
              description="Current phase of the lunar cycle"
              bgColor="#ede7f6"
            />
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default DetailedWeatherOverlay;
