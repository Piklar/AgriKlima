// src/pages/DashboardPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { Box, Container, Typography, Grid, Stack } from '@mui/material'; // <-- THIS IS THE FIX
import PageDataLoader from '../components/PageDataLoader';
import TaskManagementModal from '../components/TaskManagementModal';
import { isToday } from 'date-fns';

// Import all the new card components
import MyCropsCard from '../components/MyCropsCard';
import WeatherTodayCard from '../components/WeatherTodayCard';
import TodayTasksCard from '../components/TodayTasksCard';
import WeatherForecastCard from '../components/WeatherForecastCard';
import PestAlertCard from '../components/PestAlertCard';

const DashboardPage = () => {
  const { user } = useAuth();

  // Single state object for all dashboard data
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
      console.error("Failed to toggle task:", err);
    }
  };

  return (
    <PageDataLoader loading={loading} error={error} onRetry={fetchDashboardData}>
      <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Welcome back, {user?.firstName || 'Farmer'}!
            </Typography>
            <Typography color="text.secondary">
              Here is your farm's overview for today.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Column 1 */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                <WeatherTodayCard weather={dashboardData.weather} loading={loading} />
                <PestAlertCard pests={dashboardData.pests} loading={loading} />
              </Stack>
            </Grid>

            {/* Column 2 */}
            <Grid item xs={12} lg={5}>
                <MyCropsCard userCrops={dashboardData.userCrops} loading={loading} />
            </Grid>

            {/* Column 3 */}
            <Grid item xs={12} lg={3}>
                <Stack spacing={4}>
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
  );
};

export default DashboardPage;