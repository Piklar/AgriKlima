// src/components/DetailedWeatherOverlay.jsx

import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Grid, Paper } from '@mui/material';

// --- Icon Imports ---
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import AirOutlinedIcon from '@mui/icons-material/AirOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import ThermostatOutlinedIcon from '@mui/icons-material/ThermostatOutlined';
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined';

// --- Reusable Weather Metric Card Component ---
const MetricCard = ({ title, icon, value, subtext, description, bgColor }) => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', height: '100%', bgcolor: bgColor }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="body1" color="text.secondary">{title}</Typography>
            {icon}
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {value}
            <Typography variant="h6" component="span" sx={{ ml: 0.5 }}>{subtext}</Typography>
        </Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
    </Paper>
);

const SunriseSunsetCard = () => (
     <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', height: '100%', bgcolor: '#f3e5f5' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="body1" color="text.secondary">Sunrise & Sunset</Typography>
            <WbSunnyOutlinedIcon sx={{color: '#fbc02d'}} />
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
            <Typography>Sunrise</Typography>
            <Typography sx={{fontWeight: 600}}>6:12 AM</Typography>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography>Sunset</Typography>
            <Typography sx={{fontWeight: 600}}>6:45 PM</Typography>
        </Box>
     </Paper>
);


// --- Main Overlay Component ---
const DetailedWeatherOverlay = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState('Today');

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ width: '90%', maxWidth: '1200px', p: 4, borderRadius: '24px' }}>
        
        {/* --- Header with Toggle --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Detailed Weather Information</Typography>
            <Paper elevation={0} sx={{ borderRadius: '30px', bgcolor: '#e0e0e0', p: 0.5 }}>
                <Button 
                    onClick={() => setActiveTab('Today')}
                    sx={{ borderRadius: '30px', px: 3, textTransform: 'none', bgcolor: activeTab === 'Today' ? 'var(--primary-green)' : 'transparent', color: activeTab === 'Today' ? 'white' : 'black' }}
                >
                    Today
                </Button>
                <Button 
                    onClick={() => setActiveTab('7-Day')}
                    sx={{ borderRadius: '30px', px: 3, textTransform: 'none', bgcolor: activeTab === '7-Day' ? 'var(--primary-green)' : 'transparent', color: activeTab === '7-Day' ? 'white' : 'black' }}
                >
                    7-Day Forecast
                </Button>
            </Paper>
        </Box>
        
        {/* --- Metrics Grid --- */}
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <MetricCard title="UV Index" icon={<WbSunnyOutlinedIcon sx={{color: '#f57c00'}}/>} value="8" description="Very High - Use sunscreen" bgColor='#e3f2fd' />
            </Grid>
            <Grid item xs={12} md={4}>
                <MetricCard title="Air Quality" icon={<AirOutlinedIcon sx={{color: '#4caf50'}} />} value="Good" description="AQI: 45 - Safe for outdoor activities" bgColor='#e8f5e9' />
            </Grid>
            <Grid item xs={12} md={4}>
                <SunriseSunsetCard />
            </Grid>
            <Grid item xs={12} md={4}>
                <MetricCard title="Precipitation" icon={<WaterDropOutlinedIcon sx={{color: '#03a9f4'}} />} value="15" subtext="%" description="Low chance of rain today" bgColor='#e0f7fa' />
            </Grid>
            <Grid item xs={12} md={4}>
                <MetricCard title="Feels Like" icon={<ThermostatOutlinedIcon sx={{color: '#ff7043'}} />} value="31" subtext="°C" description="Higher due to humidity" bgColor='#fff3e0' />
            </Grid>
            <Grid item xs={12} md={4}>
                <MetricCard title="Moon Phase" icon={<NightsStayOutlinedIcon sx={{color: '#7e57c2'}} />} value="Waning Crescent" description="18% illuminated" bgColor='#ede7f6' />
            </Grid>
        </Grid>

      </Paper>
    </Modal>
  );
};

export default DetailedWeatherOverlay;