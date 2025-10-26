import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { Box, Container, Typography, Grid, Stack, createTheme, ThemeProvider } from '@mui/material';
import PageDataLoader from '../components/PageDataLoader';
import TaskManagementModal from '../components/TaskManagementModal';
import { isToday } from 'date-fns';
import Swal from 'sweetalert2';

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
    weather: null, tasks: [], userCrops: { activeCrops: [], harvestedCrops: [] }, pests: []
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
    
    const locationCity = user.location.split(',')[0].trim();
    
    try {
      const [weatherResponse, tasksResponse, cropsResponse, pestsResponse] = await Promise.all([
        api.getWeather(locationCity),
        api.getMyTasks(),
        api.getUserCrops(),
        api.getPests(),
      ]);
      setDashboardData({
        weather: weatherResponse.data || null,
        tasks: tasksResponse.data || [],
        userCrops: cropsResponse.data || { activeCrops: [], harvestedCrops: [] },
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

  // --- THIS IS THE FIX: Optimistic UI update for tasks ---
  const handleTaskToggle = async (taskId) => {
    const originalTasks = dashboardData.tasks;
    
    // Optimistically update the UI
    const updatedTasks = originalTasks.map(task => 
      task._id === taskId
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    );
    
    setDashboardData(prevData => ({
      ...prevData,
      tasks: updatedTasks,
    }));

    // Perform the API call in the background
    try {
      await api.toggleTaskStatus(taskId);
    } catch (err) {
      console.error('Failed to toggle task:', err);
      // If the API call fails, revert the change and notify the user
      setDashboardData(prevData => ({
        ...prevData,
        tasks: originalTasks,
      }));
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Could not sync task status. Please try again.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  const { peakHot, peakCold } = useMemo(() => {
    const dailyData = dashboardData.weather?.daily;
    if (!dailyData || dailyData.length === 0) {
      return { peakHot: null, peakCold: null };
    }
    
    let hottest = { temp: -Infinity, day: '' };
    let coldest = { temp: Infinity, day: '' };

    dailyData.forEach(day => {
      if (day.high > hottest.temp) {
        hottest = { temp: day.high, day: day.day };
      }
      if (day.low < coldest.temp) {
        coldest = { temp: day.low, day: day.day };
      }
    });

    return { peakHot: hottest, peakCold: coldest };
  }, [dashboardData.weather]);

  return (
    <ThemeProvider theme={theme}>
      <PageDataLoader loading={loading} error={error} onRetry={fetchDashboardData}>
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
          <Container maxWidth="xl">
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{...theme.typography.h4}}>
                Welcome back, {user?.firstName || 'Farmer'}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Here’s your farm’s overview for today.
              </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
              <Grid item xs={12} md={4}>
                <Stack spacing={3} sx={{ height: '100%' }}>
                  <WeatherTodayCard weather={dashboardData.weather} loading={loading} />
                  <PestAlertCard pests={dashboardData.pests} loading={loading} />
                </Stack>
              </Grid>

              <Grid item xs={12} md={4}>
                <MyCropsCard userCrops={dashboardData.userCrops.activeCrops} loading={loading} />
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={3} sx={{ height: '100%' }}>
                  <TodayTasksCard
                    tasks={dashboardData.tasks}
                    loading={loading}
                    onTaskToggle={handleTaskToggle}
                    onManageTasks={() => setIsTaskModalOpen(true)}
                  />
                  <WeatherForecastCard 
                    weather={dashboardData.weather} 
                    loading={loading} 
                    peakHot={peakHot} 
                    peakCold={peakCold} 
                  />
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