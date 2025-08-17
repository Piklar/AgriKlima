// src/pages/DashboardPage.jsx

import React, { useState } from 'react';
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
  LinearProgress, 
  List, 
  ListItem, 
  ListItemIcon, 
  Checkbox, 
  ListItemText, 
  Divider
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Component Import ---
import AddTaskOverlay from '../components/AddTaskOverlay'; // <-- Import the new overlay

// --- ICONS ---
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';

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

  // --- NEW STATE FOR TASKS ---
  const [tasks, setTasks] = useState([
      { id: 1, text: 'Prepare fertilizer for the onion field', completed: false, date: '2025-08-17', time: '09:00' },
      { id: 2, text: 'Calibrate water sprinklers', completed: true, date: '2025-08-16', time: '14:00' },
  ]);
  const [isTaskOverlayOpen, setIsTaskOverlayOpen] = useState(false);

  // --- NEW HANDLER FUNCTIONS ---
  const handleOpenTaskOverlay = () => setIsTaskOverlayOpen(true);
  const handleCloseTaskOverlay = () => setIsTaskOverlayOpen(false);

  const handleAddTask = (newTask) => {
      setTasks(prevTasks => [newTask, ...prevTasks]); // Add new task to the top of the list
  };

  const handleToggleTask = (taskId) => {
      setTasks(prevTasks =>
          prevTasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
          )
      );
  };

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

          {/* --- UPDATED TASK LIST --- */}
          <Grid item xs={12} lg={4}>
             <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: 3, height: '400px', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>My Tasks</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} size="small" onClick={handleOpenTaskOverlay} sx={{ bgcolor: 'var(--primary-green)', borderRadius: '20px', textTransform: 'none', '&:hover': { bgcolor: 'var(--light-green)' } }}>
                        New Task
                    </Button>
                </Box>
                <Divider />
                <List sx={{ overflowY: 'auto', flexGrow: 1, mt: 1 }}>
                    {tasks.map(task => (
                        <ListItem key={task.id} disablePadding>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={task.completed}
                                    onChange={() => handleToggleTask(task.id)}
                                />
                            </ListItemIcon>
                            <ListItemText 
                                primary={task.text}
                                secondary={task.date && `${task.date} ${task.time || ''}`}
                                sx={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'text.disabled' : 'inherit' }}
                            />
                        </ListItem>
                    ))}
                </List>
             </Paper>
          </Grid>
        </Grid>

      </Container>
      
      {/* --- RENDER THE OVERLAY --- */}
      <AddTaskOverlay open={isTaskOverlayOpen} onClose={handleCloseTaskOverlay} onAddTask={handleAddTask} />
    </Box>
  );
};

export default DashboardPage;