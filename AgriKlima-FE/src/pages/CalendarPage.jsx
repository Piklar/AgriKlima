import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  add,
  sub,
  isSameDay
} from 'date-fns';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AddCropEntryOverlay from '../components/AddCropEntryOverlay';

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

// --- Sidebar Card ---
const SidebarCard = ({ title, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: '24px',
      border: '1px solid #f0f0f0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      mb: 3
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
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [userCrops, setUserCrops] = useState([]);

  // --- Fetch Data (with month scoping + fallback) ---
  const fetchData = useCallback(async () => {
    try {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);

      const tasksResponse = await api.getMyTasks({
        startDate: format(monthStart, 'yyyy-MM-dd'),
        endDate: format(monthEnd, 'yyyy-MM-dd'),
      });
      setTasks(tasksResponse.data || []);

      if (user?.crops?.length) {
        const cropData = user.crops.map((cropName) => ({
          name: cropName,
          details: 'Your Farm',
          color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        }));
        setUserCrops(cropData);
      }
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
      // --- Fallback: show static sample data ---
      setUserCrops([
        { name: 'Wheat Field A', details: 'Wheat • North Field', color: '#4caf50' },
        { name: 'Corn Section B', details: 'Corn • South Field', color: '#2196f3' },
        { name: 'Tomato Greenhouse', details: 'Tomatoes • Greenhouse 1', color: '#f44336' }
      ]);
      setTasks([
        { _id: '1', title: 'Water tomato greenhouse', dueDate: new Date() },
        { _id: '2', title: 'Check wheat growth progress', dueDate: new Date() },
        { _id: '3', title: 'Pest inspection - corn field', dueDate: new Date() },
        { _id: '4', title: 'Apply fertilizer to section B', dueDate: new Date() }
      ]);
    }
  }, [user, currentMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Calendar grid setup ---
  const nextMonth = () => setCurrentMonth(add(currentMonth, { months: 1 }));
  const prevMonth = () => setCurrentMonth(sub(currentMonth, { months: 1 }));

  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // --- Helpers ---
  const todayTasks = tasks.filter((task) => isToday(new Date(task.dueDate)));
  const getTasksForDay = (day) => tasks.filter(task => isSameDay(new Date(task.dueDate), day));

  // --- Modal handlers ---
  const handleOpenAddEntry = () => setIsAddEntryOpen(true);
  const handleCloseAddEntry = () => setIsAddEntryOpen(false);

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

      {/* Main Grid */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={4} sx={{ maxWidth: 1200, width: '100%' }}>
          {/* Calendar */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #eee', mx: 'auto' }}>
              {/* Calendar Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#009688', color: 'white', borderRadius: '30px', p: '4px' }}>
                  <IconButton onClick={prevMonth} size="small" sx={{ color: 'white' }}><ChevronLeftIcon /></IconButton>
                  <Typography variant="h6" sx={{ fontWeight: 600, mx: 2 }}>{format(currentMonth, 'MMMM yyyy')}</Typography>
                  <IconButton onClick={nextMonth} size="small" sx={{ color: 'white' }}><ChevronRightIcon /></IconButton>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: 'var(--primary-green)', borderRadius: '20px' }} onClick={handleOpenAddEntry}>
                  Add Crop Entry
                </Button>
              </Box>

              {/* Calendar Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <Typography key={day} sx={{ fontWeight: 600, my: 1, color: 'text.secondary', fontSize: '0.875rem' }}>{day}</Typography>
                ))}
                {days.map((day, i) => {
                  const dayTasks = getTasksForDay(day);
                  return (
                    <Box key={i} sx={{ borderTop: '1px solid #f0f0f0', height: '100px', p: 1, textAlign: 'left', color: !isSameMonth(day, currentMonth) ? 'text.disabled' : 'inherit' }}>
                      <Typography component="div" sx={{
                        fontWeight: 500,
                        border: isToday(day) ? '2px solid #009688' : 'none',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {format(day, 'd')}
                      </Typography>
                      {/* Marker if tasks exist */}
                      {dayTasks.length > 0 && <CircleIcon sx={{ fontSize: '0.5rem', color: 'green', display: 'block', mt: 1, ml: 1 }} />}
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <SidebarCard title="Current Crops">
              {userCrops.map((crop) => (
                <Paper key={crop.name} elevation={0} sx={{ display: 'flex', alignItems: 'center', p: 1.5, mb: 1, bgcolor: '#fafafa', borderRadius: '16px' }}>
                  <CircleIcon sx={{ color: crop.color, mr: 1.5, fontSize: '0.8rem' }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{crop.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{crop.details}</Typography>
                  </Box>
                </Paper>
              ))}
            </SidebarCard>

            <SidebarCard title="Today's Tasks">
              {todayTasks.length > 0 ? (
                <List dense>
                  {todayTasks.map((task) => (
                    <ListItem key={task._id || task.title} disableGutters>
                      <ListItemIcon sx={{ minWidth: '32px' }}>
                        {task.title && /pest|insect/i.test(task.title) ? <PestControlOutlinedIcon color="error" /> :
                         task.title && /fertilizer|apply/i.test(task.title) ? <AgricultureOutlinedIcon sx={{ color: '#795548' }} /> :
                         task.title && /check|progress/i.test(task.title) ? <CheckCircleOutlineIcon color="success" /> :
                         <CircleOutlinedIcon color="primary" />}
                      </ListItemIcon>
                      <ListItemText primary={task.title || task.text} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">No tasks scheduled for today.</Typography>
              )}
            </SidebarCard>

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
      </Box>

      {/* Overlay */}
      <AddCropEntryOverlay open={isAddEntryOpen} onClose={handleCloseAddEntry} />
    </Container>
  );
};

export default CalendarPage;
