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
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Divider,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import AddTaskOverlay from '../components/AddTaskOverlay';
import InfoCard from '../components/InfoCard';
import PageDataLoader from '../components/PageDataLoader';

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

  const [weather, setWeather] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskOverlayOpen, setIsTaskOverlayOpen] = useState(false);
  const [error, setError] = useState(null);

  // --- Safe nested value getter ---
  const getNestedValue = (obj, path, fallback = '--') => {
    try {
      const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
      return value !== undefined && value !== null ? value : fallback;
    } catch {
      return fallback;
    }
  };

  const safeWeatherValue = (value, fallback = '--') => {
    if (value === null || value === undefined || value === '' || typeof value === 'object') {
      return fallback;
    }
    return value;
  };

  const fetchDashboardData = useCallback(async () => {
    if (!user || !user.location) return;

    setLoading(true);
    setError(null);

    try {
      const [weatherResponse, tasksResponse] = await Promise.allSettled([
        api.getWeather(user.location),
        api.getMyTasks(),
      ]);

      if (weatherResponse.status === 'fulfilled') {
        setWeather(weatherResponse.value?.data || null);
      } else {
        console.error('Weather fetch failed:', weatherResponse.reason);
        setError('Failed to load weather data');
      }

      if (tasksResponse.status === 'fulfilled') {
        const tasksData = tasksResponse.value?.data || tasksResponse.value || [];
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      } else {
        console.error('Tasks fetch failed:', tasksResponse.reason);
        setError('Failed to load tasks');
      }
    } catch (err) {
      console.error('!!! CRITICAL ERROR in fetchDashboardData:', err);
      setError('Failed to load dashboard data. Please check console for details.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenTaskOverlay = () => setIsTaskOverlayOpen(true);
  const handleCloseTaskOverlay = () => setIsTaskOverlayOpen(false);

  const handleAddTask = async (newTask) => {
    try {
      await api.addTask(newTask);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find((t) => t.id === taskId || t._id === taskId);
      if (task) {
        await api.updateTask(taskId, { ...task, completed: !task.completed });
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const weeklyHarvestData = [
    { day: 'Mon', harvestKg: 35 },
    { day: 'Tue', harvestKg: 42 },
    { day: 'Wed', harvestKg: 55 },
    { day: 'Thu', harvestKg: 51 },
    { day: 'Fri', harvestKg: 60 },
    { day: 'Sat', harvestKg: 75 },
    { day: 'Sun', harvestKg: 70 },
  ];

  try {
    return (
      <PageDataLoader loading={loading} error={error} onRetry={fetchDashboardData}>
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
          <Container maxWidth="xl">
            {/* --- Header --- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  Welcome back, {user?.firstName || 'Farmer'}!
                </Typography>
                <Typography color="text.secondary">
                  Here is your farm's overview. {user?.location && `Location: ${user.location}`}
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ backgroundColor: '#2e7d32' }}
                >
                  Log Out
                </Button>
              </Box>
            </Box>

            {/* Error Banner */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* --- Info Cards --- */}
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Weather"
                  value={safeWeatherValue(getNestedValue(weather, 'current.temperature'))}
                  unit="°C"
                  icon={<WbSunnyOutlinedIcon color="warning" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Humidity"
                  value={safeWeatherValue(getNestedValue(weather, 'current.humidity'))}
                  unit="%"
                  icon={<WaterDropOutlinedIcon color="info" />}
                >
                  <LinearProgress
                    variant="determinate"
                    value={Number(safeWeatherValue(getNestedValue(weather, 'current.humidity'), 0))}
                    sx={{ height: 8, borderRadius: 5, mt: 1 }}
                  />
                </InfoCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="UV Index"
                  value={safeWeatherValue(getNestedValue(weather, 'detailed.uvIndex'))}
                  icon={<GrassOutlinedIcon color="success" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoCard
                  title="Feels Like"
                  value={safeWeatherValue(getNestedValue(weather, 'detailed.feelsLike'))}
                  unit="°C"
                  icon={<EventAvailableOutlinedIcon color="primary" />}
                />
              </Grid>
            </Grid>

            {/* --- Chart + Tasks --- */}
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} lg={8}>
                <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: 3, height: '400px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Weekly Harvest Forecast (kg)
                  </Typography>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={weeklyHarvestData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="harvestKg"
                        fill="#2e7d32"
                        name="Harvest (kg)"
                        barSize={30}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Task List */}
              <Grid item xs={12} lg={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    boxShadow: 3,
                    height: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      My Tasks
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      size="small"
                      onClick={handleOpenTaskOverlay}
                      sx={{
                        bgcolor: '#2e7d32',
                        borderRadius: '20px',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#1b5e20' },
                      }}
                    >
                      New Task
                    </Button>
                  </Box>
                  <Divider />
                  <List sx={{ overflowY: 'auto', flexGrow: 1, mt: 1 }}>
                    {tasks && tasks.length > 0 ? (
                      tasks.map((task, index) => (
                        <ListItem key={task.id || task._id || `task-${index}`}>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={task.completed || false}
                              onChange={() => handleToggleTask(task.id || task._id)}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={task.title || 'Untitled Task'}
                            secondary={
                              task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''
                            }
                            sx={{
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed ? 'text.disabled' : 'inherit',
                            }}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary="No tasks yet. Add your first task!" />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Container>

          {/* Task Overlay */}
          <AddTaskOverlay
            open={isTaskOverlayOpen}
            onClose={handleCloseTaskOverlay}
            onAddTask={handleAddTask}
          />
        </Box>
      </PageDataLoader>
    );
  } catch (renderError) {
    console.error('!!! CATASTROPHIC RENDER ERROR:', renderError);
    return null;
  }
};

export default DashboardPage;
