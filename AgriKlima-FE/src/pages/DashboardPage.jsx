// src/pages/DashboardPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  LinearProgress,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Divider
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AddTaskOverlay from '../components/AddTaskOverlay';
import InfoCard from '../components/InfoCard'; // <-- Reusable InfoCard

// --- ICONS ---
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- STATE ---
  const [weather, setWeather] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskOverlayOpen, setIsTaskOverlayOpen] = useState(false);

  // --- Fetch dashboard data ---
  const fetchDashboardData = useCallback(async () => {
    if (user && user.location) {
      try {
        const [weatherResponse, tasksResponse] = await Promise.all([
          api.getWeather(user.location),
          api.getTasks()
        ]);
        setWeather(weatherResponse.data);
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    } else if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- Task handlers ---
  const handleOpenTaskOverlay = () => setIsTaskOverlayOpen(true);
  const handleCloseTaskOverlay = () => setIsTaskOverlayOpen(false);

  const handleAddTask = async (newTask) => {
    try {
      await api.addTask(newTask);
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId || t._id === taskId);
      if (task) {
        await api.updateTask(taskId, { ...task, completed: !task.completed });
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- Loading Guard ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Dashboard...</Typography>
      </Box>
    );
  }

  // --- Dummy Chart Data ---
  const weeklyHarvestData = [
    { day: 'Mon', harvestKg: 35 },
    { day: 'Tue', harvestKg: 42 },
    { day: 'Wed', harvestKg: 55 },
    { day: 'Thu', harvestKg: 51 },
    { day: 'Fri', harvestKg: 60 },
    { day: 'Sat', harvestKg: 75 },
    { day: 'Sun', harvestKg: 70 },
  ];

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* --- Header --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Welcome back, {user ? user.firstName : 'Farmer'}!
            </Typography>
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

        {/* --- Info Cards --- */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard
              title="Weather"
              value={weather?.current?.temperature || '--'}
              unit="°C"
              icon={<WbSunnyOutlinedIcon color="warning" />}
            >
              <Typography color="text.secondary">{weather?.current?.condition || 'Unavailable'}</Typography>
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard
              title="Humidity"
              value={weather?.current?.humidity || '--'}
              unit="%"
              icon={<WaterDropOutlinedIcon color="info" />}
            >
              <LinearProgress
                variant="determinate"
                value={weather?.current?.humidity || 0}
                sx={{ height: 8, borderRadius: 5, mt: 1 }}
              />
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard
              title="UV Index"
              value={weather?.detailed?.uvIndex || '--'}
              icon={<GrassOutlinedIcon color="success" />}
            >
              <Typography color="text.secondary">Higher values require sun protection.</Typography>
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard
              title="Feels Like"
              value={weather?.detailed?.feelsLike || '--'}
              unit="°C"
              icon={<EventAvailableOutlinedIcon color="primary" />}
            >
              <Typography color="text.secondary">Adjusted for humidity.</Typography>
            </InfoCard>
          </Grid>
        </Grid>

        {/* --- Chart & Tasks --- */}
        <Grid container spacing={4} mt={2}>
          {/* Harvest Chart */}
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

          {/* Task List */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: 3, height: '400px', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>My Tasks</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={handleOpenTaskOverlay}
                  sx={{
                    bgcolor: 'var(--primary-green)',
                    borderRadius: '20px',
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'var(--light-green)' }
                  }}
                >
                  New Task
                </Button>
              </Box>
              <Divider />
              <List sx={{ overflowY: 'auto', flexGrow: 1, mt: 1 }}>
                {tasks && tasks.length > 0 ? (
                  tasks.map(task => (
                    <ListItem key={task.id || task._id} disablePadding>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id || task._id)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={task.text}
                        secondary={task.date && `${task.date} ${task.time || ''}`}
                        sx={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.disabled' : 'inherit'
                        }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No tasks yet." />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Add Task Overlay */}
      <AddTaskOverlay
        open={isTaskOverlayOpen}
        onClose={handleCloseTaskOverlay}
        onAddTask={handleAddTask}
      />
    </Box>
  );
};

export default DashboardPage;