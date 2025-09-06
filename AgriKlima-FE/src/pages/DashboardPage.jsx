// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  createTheme,
  ThemeProvider
} from '@mui/material';
import PageDataLoader from '../components/PageDataLoader';
import TaskManagementModal from '../components/TaskManagementModal';
import { isToday } from 'date-fns';

import MyCropsCard from '../components/MyCropsCard';
import WeatherTodayCard from '../components/WeatherTodayCard';
import TodayTasksCard from '../components/TodayTasksCard';
import WeatherForecastCard from '../components/WeatherForecastCard';
import PestAlertCard from '../components/PestAlertCard';

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    secondary: { main: '#ffa000', light: '#ffc107', dark: '#ff8f00' },
    background: { default: '#f8f9f8' },
  },
  typography: {
    fontFamily: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.2rem' },
    body1: { fontSize: '1.1rem', lineHeight: 1.7 },
    body2: { fontSize: '1rem', lineHeight: 1.6 },
  },
  shape: { borderRadius: 12 },
});

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    weather: null,
    tasks: [],
    userCrops: [],
    pests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!user || !user.location) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [weatherResponse, tasksResponse, cropsResponse, pestsResponse] = await Promise.all([
        api.getWeather(user.location),
        api.getMyTasks(),
        api.getUserCrops(),
        api.getPests(),
      ]);
      setDashboardData({
        weather: weatherResponse.data || null,
        tasks: tasksResponse.data || [],
        userCrops: cropsResponse.data || [],
        pests: pestsResponse.data || []
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not load all dashboard information. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleTaskToggle = async (taskId) => {
    try {
      await api.toggleTaskStatus(taskId);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        `}
      </style>

      <PageDataLoader loading={loading} error={error} onRetry={fetchDashboardData}>
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: { xs: 4, md: 6 } }}>
          <Container maxWidth="xl">
           {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                color: 'black',
                fontSize: { xs: '2rem', md: '2.8rem' }, // match NewsPage h3/h4 scale
                lineHeight: 1.2,
              }}
            >
              Welcome back, {user?.firstName || 'Farmer'}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              Here’s your farm’s overview for today.
            </Typography>
          </Box>

            {/* Dashboard Grid */}
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                  <WeatherTodayCard weather={dashboardData.weather} loading={loading} />
                  <PestAlertCard pests={dashboardData.pests} loading={loading} />
                </Stack>
              </Grid>

              {/* Middle Column */}
              <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                  <MyCropsCard userCrops={dashboardData.userCrops} loading={loading} />
                </Stack>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                  <TodayTasksCard
                    tasks={dashboardData.tasks}
                    loading={loading}
                    onTaskToggle={handleTaskToggle}
                    onManageTasks={() => setIsTaskModalOpen(true)}
                  />
                  <WeatherForecastCard weather={dashboardData.weather} loading={loading} />
                </Stack>
              </Grid>
            </Grid>
          </Container>

          <TaskManagementModal
            open={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            selectedDate={new Date()}
            tasks={dashboardData.tasks.filter(t => isToday(new Date(t.dueDate)))}
            onTasksUpdate={fetchDashboardData}
          />
        </Box>
      </PageDataLoader>
    </ThemeProvider>
  );
};

export default DashboardPage;
