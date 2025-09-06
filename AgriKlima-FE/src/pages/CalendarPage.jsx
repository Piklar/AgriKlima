import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Typography, Grid, Paper, Button, IconButton,
  List, ListItem, ListItemIcon, ListItemText, Tooltip, Checkbox,
  ThemeProvider
} from '@mui/material';
import {
  format, startOfMonth, endOfMonth, startOfWeek, add, sub, isSameDay, isWithinInterval, isSameMonth, isToday
} from 'date-fns';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskManagementModal from '../components/TaskManagementModal';
import { createTheme } from '@mui/material/styles';

// --- Icons ---
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CircleIcon from '@mui/icons-material/Circle';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';

// Create a custom theme with enhanced typography for better readability
const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    secondary: { main: '#ffa000', light: '#ffc107', dark: '#ff8f00' },
    background: { default: '#f8f9f8' },
  },
  typography: {
    fontFamily: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '3.5rem', lineHeight: 1.3 },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '3rem', lineHeight: 1.3 },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.8rem', lineHeight: 1.3 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.2rem', lineHeight: 1.3 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: '1.8rem', lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.4 },
    body1: { fontSize: '1.1rem', lineHeight: 1.8 },
    body2: { fontSize: '1rem', lineHeight: 1.7 },
    subtitle2: { fontWeight: 500, lineHeight: 1.6 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #f0f0f0'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '30px',
          textTransform: 'none',
          fontSize: '1.1rem',
          padding: '12px 30px'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: '0.01em',
        }
      }
    }
  }
});

// --- Sidebar Card ---
const SidebarCard = ({ title, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: '24px',
      mb: 3,
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
      }
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
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
      // Always fetch 6 weeks for consistent layout
      const monthStart = startOfWeek(startOfMonth(currentMonth));
      const monthEnd = add(monthStart, { days: 41 });
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

  // Always show 6 weeks (42 days) for every month
  const startDate = startOfWeek(startOfMonth(currentMonth));
  const days = Array.from({ length: 42 }, (_, i) => add(startDate, { days: i }));

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
    <ThemeProvider theme={theme}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        `}
      </style>

      <Container maxWidth="xl" sx={{ py: 4, background: '#f8f9f8', minHeight: '100vh' }}>
        {/* Header */}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ width: '100%' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: 'black',
                textAlign: 'center',
                width: '100%',
                display: 'block'
              }}
            >
              Farming Calendar
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                textAlign: 'center',
                width: '100%',
                display: 'block'
              }}
            >
              Track your crops and plan your farming activities
            </Typography>
          </Box>
          <IconButton><MoreVertIcon /></IconButton>
        </Box>


        <Grid container spacing={8} justifyContent="center">
          {/* Calendar */}
          <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper
              elevation={0}
              sx={{
                p: 0,
                borderRadius: '10px',
                width: '100%',
                maxWidth: '950px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Fixed Header */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 29,
                  py: 2,
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: '#fff',
                  position: 'sticky',
                  top: 0,
                  zIndex: 2
                }}
              >
                {/* Month Navigation */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '10px',
                    px: 2,
                    py: 0.5,
                    minWidth: '280px',
                    justifyContent: 'center',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  <IconButton onClick={prevMonth} size="small" sx={{ color: 'white' }}>
                    <ChevronLeftIcon />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mx: 2, textAlign: 'center', flex: 1 }}
                  >
                    {format(currentMonth, 'MMMM yyyy')}
                  </Typography>
                  <IconButton onClick={nextMonth} size="small" sx={{ color: 'white' }}>
                    <ChevronRightIcon />
                  </IconButton>
                </Box>

                {/* Add Task Button */}
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: '10px',
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                    ml: 2
                  }}
                  onClick={() => {
                    setSelectedDate(new Date());
                    setIsTaskModalOpen(true);
                  }}
                >
                  Add Task
                </Button>
              </Box>

              {/* Calendar Days */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gridTemplateRows: '40px repeat(6, 1fr)', // header + 6 weeks
                  textAlign: 'center',
                  gap: '2px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '0 0 10px 10px',
                  p: 1.5,
                  minHeight: '1020px',
                  maxHeight: '1020px',
                  height: '1020px'
                }}
              >
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <Box
                    key={day}
                    sx={{
                      backgroundColor: 'white',
                      py: 1,
                      fontWeight: 700,
                      color: 'text.primary',
                      fontSize: '0.95rem',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {day}
                  </Box>
                ))}

                {/* Calendar cells */}
                {days.map((day, i) => {
                  const { cropsPlanted, cropsToHarvest, dayTasks } = getEventsForDay(day);
                  const isGrowing = isDuringGrowingPeriod(day);
                  const hasMorePlanted = cropsPlanted.length > 2;
                  const hasMoreHarvest = cropsToHarvest.length > 2;

                  return (
                    <Box
                      key={i}
                      onClick={() => handleDateClick(day)}
                      sx={{
                        height: '140px',
                        minHeight: '140px',
                        maxHeight: '140px',
                        p: 1,
                        textAlign: 'left',
                        backgroundColor: 'white',
                        color: !isSameMonth(day, currentMonth) ? 'text.disabled' : 'inherit',
                        background: isGrowing
                          ? 'linear-gradient(135deg, rgba(167,201,87,0.08) 0%, rgba(167,201,87,0.04) 100%)'
                          : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        border: isToday(day) ? `2px solid ${theme.palette.primary.main}` : 'none',
                        '&:hover': {
                          backgroundColor: '#f9fff9',
                          transform: 'scale(1.02)',
                          boxShadow: '0 4px 12px rgba(46,125,50,0.15)',
                          zIndex: 1
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        fontFamily: theme.typography.fontFamily
                      }}
                    >
                      {/* Day Number */}
                      <Typography
                        component="div"
                        sx={{
                          fontWeight: 600,
                          alignSelf: 'flex-end',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '10px',
                          backgroundColor: isToday(day)
                            ? theme.palette.primary.main
                            : 'transparent',
                          color: isToday(day) ? 'white' : 'text.primary',
                          mb: 1,
                          fontSize: '1rem',
                          flexShrink: 0
                        }}
                      >
                        {format(day, 'd')}
                      </Typography>

                      {/* Events scrollable container */}
                      <Box
                        sx={{
                          flex: 1,
                          overflowY: 'auto',
                          minHeight: 0,
                          pr: 0.5
                        }}
                      >
                        {/* Crops + Tasks */}
                        {cropsPlanted.slice(0, 2).map((crop) => (
                          <Tooltip key={crop._id} title={`Planted: ${crop.name}`}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.8rem',
                                mb: 0.5,
                                color: theme.palette.primary.dark,
                                fontWeight: 500
                              }}
                            >
                              <LocalFloristIcon sx={{ fontSize: '0.9rem', mr: 0.75 }} />
                              <span
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {crop.name}
                              </span>
                            </Box>
                          </Tooltip>
                        ))}
                        {hasMorePlanted && (
                          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
                            +{cropsPlanted.length - 2} more planted
                          </Box>
                        )}

                        {cropsToHarvest.slice(0, 2).map((crop) => (
                          <Tooltip key={crop._id} title={`Harvest: ${crop.name}`}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.8rem',
                                mb: 0.5,
                                color: theme.palette.secondary.dark,
                                fontWeight: 500
                              }}
                            >
                              <ContentCutIcon sx={{ fontSize: '0.9rem', mr: 0.75 }} />
                              <span
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {crop.name}
                              </span>
                            </Box>
                          </Tooltip>
                        ))}
                        {hasMoreHarvest && (
                          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
                            +{cropsToHarvest.length - 2} more to harvest
                          </Box>
                        )}

                        {dayTasks.length > 0 && (
                          <Tooltip title={`${dayTasks.length} task(s)`}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.8rem',
                                color: 'primary.main'
                              }}
                            >
                              <CircleIcon
                                sx={{
                                  fontSize: '0.6rem',
                                  mr: 0.75,
                                  color: dayTasks.every((t) => t.status === 'completed')
                                    ? 'success.main'
                                    : 'primary.main'
                                }}
                              />
                              {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>


          {/* Sidebar */}
          <Grid item xs={12} md={4} sx={{ maxWidth: '400px' }}>
            <SidebarCard title={`Events for ${format(selectedDate, 'MMMM d, yyyy')}`}>
              {tasksForSelectedDay.length === 0 && cropsPlanted.length === 0 && cropsToHarvest.length === 0 && (
                <Typography color="text.secondary">No events scheduled for this date.</Typography>
              )}

              {/* Crops */}
              {cropsPlanted.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                    Planting Events
                  </Typography>
                  {cropsPlanted.map(crop => (
                    <Paper
                      key={crop._id}
                      elevation={0}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1.5,
                        mb: 1,
                        bgcolor: '#f0f9f0',
                        borderRadius: '10px'
                      }}
                    >
                      <LocalFloristIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1rem' }} />
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
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'secondary.main', mb: 1 }}>
                    Harvest Events
                  </Typography>
                  {cropsToHarvest.map(crop => (
                    <Paper
                      key={crop._id}
                      elevation={0}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1.5,
                        mb: 1,
                        bgcolor: '#fffaf0',
                        borderRadius: '10px'
                      }}
                    >
                      <ContentCutIcon sx={{ color: 'secondary.main', mr: 1.5, fontSize: '1rem' }} />
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
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
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
                          sx={{
                            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                            color: task.status === 'completed' ? 'text.disabled' : 'inherit'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Manage Tasks */}
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2, borderRadius: '10px' }}
                onClick={() => setIsTaskModalOpen(true)}
              >
                Manage Tasks
              </Button>
            </SidebarCard>

            {/* Weather Widget */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '10px',
                background: '#26c6da',
                color: 'white',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
                }
              }}
            >
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
    </ThemeProvider>
  );
};

export default CalendarPage;
