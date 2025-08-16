// src/pages/DashboardPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Paper, 
  LinearProgress 
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- ICONS ---
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

// --- Mock Data for the Chart ---
const weeklyHarvestData = [
  { day: 'Mon', harvestKg: 35 },
  { day: 'Tue', harvestKg: 42 },
  { day: 'Wed', harvestKg: 55 },
  { day: 'Thu', harvestKg: 51 },
  { day: 'Fri', harvestKg: 60 },
  { day: 'Sat', harvestKg: 75 },
  { day: 'Sun', harvestKg: 70 },
];

// --- Reusable Info Card Component ---
const InfoCard = ({ title, value, icon, unit, children }) => (
  <Card sx={{ borderRadius: '16px', boxShadow: 3, height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>{title}</Typography>
      </Box>
      {value && (
        <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
          {value} <Typography variant="h6" component="span" color="text.secondary">{unit}</Typography>
        </Typography>
      )}
      {children}
    </CardContent>
  </Card>
);

// --- Main Dashboard Page Component ---
const DashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* --- Header --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Welcome back, Farmer!</Typography>
            <Typography color="text.secondary">Here is your farm's overview for today.</Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={handleLogout} 
            startIcon={<LogoutIcon />}
            sx={{ 
              backgroundColor: 'var(--primary-green)',
              borderRadius: '20px',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'var(--light-green)' }
            }}
          >
            Log Out
          </Button>
        </Box>

        {/* --- Key Info Cards Grid --- */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard 
              title="Weather" 
              value="32" 
              unit="°C"
              icon={<WbSunnyOutlinedIcon color="warning" />}
            >
              <Typography color="text.secondary">Sunny with light winds.</Typography>
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard 
              title="Soil Moisture"
              icon={<WaterDropOutlinedIcon color="info" />}
            >
                <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>65%</Typography>
                <LinearProgress variant="determinate" value={65} sx={{ height: 8, borderRadius: 5, mt: 1 }} />
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard 
              title="Crop Advisory"
              icon={<GrassOutlinedIcon color="success" />}
            >
              <Typography color="text.secondary">High priority: Check for pests on corn stalks.</Typography>
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard 
              title="Next Irrigation"
              icon={<EventAvailableOutlinedIcon color="primary" />}
            >
                <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>Tomorrow</Typography>
                <Typography color="text.secondary">August 17, 2025</Typography>
            </InfoCard>
          </Grid>
        </Grid>

        {/* --- Main Content Area (Chart and Activity) --- */}
        <Grid container spacing={4} mt={2}>
          {/* Harvest Forecast Chart */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: 3, height: '400px' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Weekly Harvest Forecast (kg)</Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={weeklyHarvestData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="harvestKg" fill="var(--primary-green)" name="Harvest (kg)" barSize={30} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Recent Activity List */}
          <Grid item xs={12} lg={4}>
             <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: 3, height: '400px' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Farmer's To-Do List</Typography>
                <Box>
                    {/* Placeholder for activity items */}
                    <Typography sx={{ mb: 1 }}>• Prepare fertilizer for the onion field.</Typography>
                    <Typography sx={{ mb: 1 }}>• Calibrate water sprinklers.</Typography>
                    <Typography sx={{ mb: 1 }}>• Order new batch of seeds.</Typography>
                    <Typography sx={{ mb: 1 }}>• Schedule tractor maintenance.</Typography>
                </Box>
             </Paper>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default DashboardPage;