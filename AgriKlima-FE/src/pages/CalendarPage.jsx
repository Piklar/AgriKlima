// src/pages/CalendarPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Typography, Grid, Paper, Button, IconButton,
  List, ListItem, ListItemIcon, ListItemText, Tooltip, Checkbox
} from '@mui/material';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday, add, sub, isSameDay, isWithinInterval
} from 'date-fns';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskManagementModal from '../components/TaskManagementModal';

// --- Icons ---
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import PestControlOutlinedIcon from '@mui/icons-material/PestControlOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AgricultureOutlinedIcon from '@mui/icons-material/AgricultureOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ContentCutIcon from '@mui/icons-material/ContentCut';

// --- Sidebar Card ---
const SidebarCard = ({ title, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5, borderRadius: '24px',
      border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 3
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

const CalendarPage = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [userCrops, setUserCrops] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      const monthStart = startOfWeek(startOfMonth(currentMonth));
      const monthEnd = endOfWeek(endOfMonth(currentMonth));
      const [tasksResponse, userCropsResponse] = await Promise.all([
        api.getMyTasks({ startDate: format(monthStart, 'yyyy-MM-dd'), endDate: format(monthEnd, 'yyyy-MM-dd') }),
        api.getUserCrops()
      ]);
      
      setTasks(tasksResponse.data || []);
      setUserCrops(userCropsResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const nextMonth = () => setCurrentMonth(add(currentMonth, { months: 1 }));
  const prevMonth = () => setCurrentMonth(sub(currentMonth, { months: 1 }));

  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  const getEventsForDay = (day) => {
    const cropsPlanted = userCrops.filter(crop => isSameDay(new Date(crop.plantingDate), day));
    const cropsToHarvest = userCrops.filter(crop => isSameDay(new Date(crop.estimatedHarvestDate), day));
    const dayTasks = tasks.filter(task => isSameDay(new Date(task.dueDate), day));
    return { cropsPlanted, cropsToHarvest, dayTasks };
  };

  const isDuringGrowingPeriod = (day) => {
    return userCrops.some(crop => 
      isWithinInterval(day, {
        start: new Date(crop.plantingDate),
        end: new Date(crop.estimatedHarvestDate)
      })
    );
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setIsTaskModalOpen(true);
  };

  const { cropsPlanted, cropsToHarvest, dayTasks: tasksForSelectedDay } = getEventsForDay(selectedDate);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Farming Calendar</Typography>
          <Typography color="text.secondary">Track your crops and plan your farming activities</Typography>
        </Box>
        <IconButton><MoreVertIcon /></IconButton>
      </Box>

      <Grid container spacing={4}>
        {/* Calendar */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #eee' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#009688', color: 'white', borderRadius: '30px', p: '4px' }}>
                <IconButton onClick={prevMonth} size="small" sx={{ color: 'white' }}><ChevronLeftIcon /></IconButton>
                <Typography variant="h6" sx={{ fontWeight: 600, mx: 2 }}>{format(currentMonth, 'MMMM yyyy')}</Typography>
                <IconButton onClick={nextMonth} size="small" sx={{ color: 'white' }}><ChevronRightIcon /></IconButton>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: 'var(--primary-green)', borderRadius: '20px' }} onClick={() => { setSelectedDate(new Date()); setIsTaskModalOpen(true); }}>
                Add Task
              </Button>
            </Box>

            {/* Calendar Days */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Typography key={day} sx={{ fontWeight: 600, my: 1, color: 'text.secondary', fontSize: '0.875rem' }}>{day}</Typography>
              ))}
              {days.map((day, i) => {
                const { cropsPlanted, cropsToHarvest, dayTasks } = getEventsForDay(day);
                const isGrowing = isDuringGrowingPeriod(day);

                return (
                  <Box
                    key={i}
                    onClick={() => handleDateClick(day)}
                    sx={{
                      borderTop: '1px solid #f0f0f0', minHeight: '120px', p: 1, textAlign: 'left',
                      color: !isSameMonth(day, currentMonth) ? 'text.disabled' : 'inherit',
                      backgroundColor: isGrowing ? 'rgba(167, 201, 87, 0.15)' : 'transparent',
                      cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' },
                      transition: 'background-color 0.2s ease-in-out',
                    }}
                  >
                    <Typography component="div" sx={{
                      fontWeight: 500, border: isToday(day) ? '2px solid #009688' : 'none',
                      borderRadius: '50%', width: 28, height: 28,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {format(day, 'd')}
                    </Typography>

                    {/* Crop Events + Tasks */}
                    {cropsPlanted.map(crop => (
                      <Tooltip key={crop._id} title={`Planted: ${crop.name}`}>
                        <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem', mt: 0.5, color: '#2e7d32', fontWeight: 'bold' }}>
                          <LocalFloristIcon sx={{ fontSize: '0.8rem', mr: 0.5 }} /> {crop.name}
                        </Box>
                      </Tooltip>
                    ))}
                    {cropsToHarvest.map(crop => (
                      <Tooltip key={crop._id} title={`Harvest: ${crop.name}`}>
                        <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem', mt: 0.5, color: '#d32f2f', fontWeight: 'bold' }}>
                          <ContentCutIcon sx={{ fontSize: '0.8rem', mr: 0.5 }} /> {crop.name}
                        </Box>
                      </Tooltip>
                    ))}
                    {dayTasks.length > 0 && (
                      <Tooltip title={`${dayTasks.length} task(s)`}>
                        <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem', mt: 0.5, color: 'primary.main' }}>
                          <CircleIcon sx={{ fontSize: '0.5rem', mr: 0.5, color: dayTasks.every(t => t.status === 'completed') ? 'success.main' : 'primary.main' }} /> 
                          {dayTasks.length} task(s)
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <SidebarCard title={`Events for ${format(selectedDate, 'MMMM d, yyyy')}`}>
            {tasksForSelectedDay.length === 0 && cropsPlanted.length === 0 && cropsToHarvest.length === 0 && (
              <Typography color="text.secondary">No events scheduled for this date.</Typography>
            )}

            {/* Crops */}
            {cropsPlanted.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'green', mb: 1 }}>
                  Planting Events
                </Typography>
                {cropsPlanted.map(crop => (
                  <Paper key={crop._id} elevation={0} sx={{ display: 'flex', alignItems: 'center', p: 1.5, mb: 1, bgcolor: '#f0f9f0', borderRadius: '12px' }}>
                    <LocalFloristIcon sx={{ color: 'green', mr: 1.5, fontSize: '1rem' }} />
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{crop.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Planted on this date</Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}

            {cropsToHarvest.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'orange', mb: 1 }}>
                  Harvest Events
                </Typography>
                {cropsToHarvest.map(crop => (
                  <Paper key={crop._id} elevation={0} sx={{ display: 'flex', alignItems: 'center', p: 1.5, mb: 1, bgcolor: '#fffaf0', borderRadius: '12px' }}>
                    <ContentCutIcon sx={{ color: 'orange', mr: 1.5, fontSize: '1rem' }} />
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{crop.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Estimated harvest date</Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}

            {/* Tasks */}
            {tasksForSelectedDay.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'blue', mb: 1 }}>
                  Tasks
                </Typography>
                <List dense>
                  {tasksForSelectedDay.map((task) => (
                    <ListItem key={task._id} disableGutters>
                      <ListItemIcon sx={{ minWidth: '32px' }}>
                        <Checkbox edge="start" checked={task.status === 'completed'} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={task.title} 
                        sx={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? 'text.disabled' : 'inherit' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Manage Tasks */}
            <Button variant="outlined" fullWidth sx={{ mt: 2, borderRadius: '20px' }} onClick={() => setIsTaskModalOpen(true)}>
              Manage Tasks
            </Button>
          </SidebarCard>

          {/* Weather Widget */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '24px', background: '#26c6da', color: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Weather Alert</Typography>
            <List dense sx={{ color: 'white' }}>
              <ListItem disableGutters>
                <ListItemIcon><WbSunnyOutlinedIcon sx={{ color: 'white' }} /></ListItemIcon>
                Light rain expected tomorrow
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon><WaterDropOutlinedIcon sx={{ color: 'white' }} /></ListItemIcon>
                Good for watering crops naturally
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Task Modal */}
      <TaskManagementModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        selectedDate={selectedDate}
        tasks={tasks}
        onTasksUpdate={fetchData}
      />
    </Container>
  );
};

export default CalendarPage;
