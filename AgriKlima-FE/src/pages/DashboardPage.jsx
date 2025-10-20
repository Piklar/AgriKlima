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
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh',
            py: { xs: 3, sm: 4, md: 6 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            overflowX: 'hidden',
          }}
        >
          <Container
            maxWidth="xl"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: { xs: 2.5, sm: 3.5, md: 4 },
              px: { xs: 1.5, sm: 3, md: 4, lg: 6 },
              boxSizing: 'border-box',
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 2.5, sm: 3.5, md: 4 } }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  color: 'black',
                  fontSize: { xs: '1.6rem', sm: '2rem', md: '2.6rem', lg: '2.8rem' },
                  lineHeight: 1.2,
                  mb: { xs: 0.5, sm: 1 },
                }}
              >
                Welcome back, {user?.firstName || 'Farmer'}!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.05rem', lg: '1.1rem' },
                  lineHeight: 1.6,
                }}
              >
                Here’s your farm’s overview for today.
              </Typography>
            </Box>

            {/* Dashboard Grid */}
            <Grid
              container
              spacing={{ xs: 2, sm: 3, md: 4 }}
              justifyContent="center"
              alignItems="stretch"
              sx={{
                width: '100%',
                maxWidth: 1600,
                mx: 'auto',
              }}
            >
              {/* Left Column */}
              <Grid item xs={12} sm={6} lg={4} sx={{ display: 'flex' }}>
                <Stack
                  spacing={{ xs: 1.5, sm: 2, md: 3 }}
                  sx={{
                    width: '100%',
                    '& > *': {
                      borderRadius: { xs: 2, sm: 3 },
                      p: { xs: 1.5, sm: 2, md: 3 },
                      boxShadow: 3,
                    },
                  }}
                >
                  <WeatherTodayCard weather={dashboardData.weather} loading={loading} />
                  <PestAlertCard pests={dashboardData.pests} loading={loading} />
                </Stack>
              </Grid>

              {/* Middle Column */}
              <Grid item xs={12} sm={6} lg={4} sx={{ display: 'flex' }}>
                <Stack
                  spacing={{ xs: 1.5, sm: 2, md: 3 }}
                  sx={{
                    width: '100%',
                    '& > *': {
                      borderRadius: { xs: 2, sm: 3 },
                      p: { xs: 1.5, sm: 2, md: 3 },
                      boxShadow: 3,
                    },
                  }}
                >
                  <MyCropsCard userCrops={dashboardData.userCrops} loading={loading} />
                </Stack>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} sm={6} lg={4} sx={{ display: 'flex' }}>
                <Stack
                  spacing={{ xs: 1.5, sm: 2, md: 3 }}
                  sx={{
                    width: '100%',
                    '& > *': {
                      borderRadius: { xs: 2, sm: 3 },
                      p: { xs: 1.5, sm: 2, md: 3 },
                      boxShadow: 3,
                    },
                  }}
                >
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
