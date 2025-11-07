// src/pages/CalendarPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Box, Typography, Paper, Button, IconButton,
    List, ListItem, ListItemIcon, ListItemText, Tooltip, Checkbox,
    ThemeProvider, ListItemSecondaryAction
} from '@mui/material';
import {
    format, startOfMonth, startOfWeek, add, sub,
    isSameDay, isWithinInterval, isSameMonth, isToday, isSunday
} from 'date-fns';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskManagementModal from '../components/TaskManagementModal';
import { createTheme } from '@mui/material/styles';
import Swal from 'sweetalert2';

// Icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CircleIcon from '@mui/icons-material/Circle';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import AgricultureIcon from '@mui/icons-material/Agriculture';

const holidays = [
    { date: '2024-01-01', name: "New Year's Day" },
    { date: '2024-07-04', name: 'Independence Day' },
    { date: '2024-12-25', name: 'Christmas Day' },
    // Add other relevant Philippine holidays
];

// Crop color palette for tasks
const CROP_COLORS = [
    '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b',
    '#ffc107', '#ff9800', '#ff5722', '#795548',
    '#9c27b0', '#673ab7', '#3f51b5', '#2196f3',
    '#00bcd4', '#009688', '#66bb6a', '#81c784'
];

/**
 * Generates a consistent color for a crop name using hashing.
 * @param {string} cropName - The name of the crop (or task cropId.name).
 * @returns {string} Hex color code.
 */
const getCropColor = (cropName) => {
    if (!cropName) return '#757575'; // Default gray for non-crop tasks
    
    // Generate consistent color based on crop name
    let hash = 0;
    for (let i = 0; i < cropName.length; i++) {
        hash = cropName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % CROP_COLORS.length;
    return CROP_COLORS[index];
};


const theme = createTheme({
    palette: {
        primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
        secondary: { main: '#ffa000', light: '#ffc107', dark: '#ff8f00' },
        background: { default: '#f8f9f8' },
        holiday: '#fff9c4',
        todayRing: 'rgba(76,175,80,0.18)',
        success: { main: '#4caf50' },
        warning: { main: '#ff9800' }
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
                root: { boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }
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
            styleOverrides: { root: { letterSpacing: '0.01em' } }
        }
    }
});

const SidebarCard = ({ title, children, onManageTasks }) => (
    <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">{title}</Typography>
            {onManageTasks && (
                <Button size="small" onClick={onManageTasks} sx={{ borderRadius: 2, p: '4px 12px', fontSize: '0.9rem' }}>
                    Add/Manage
                </Button>
            )}
        </Box>
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
            const monthEnd = add(monthStart, { days: 41 });

            const [tasksResponse, userCropsResponse] = await Promise.all([
                api.getMyTasks({
                    startDate: format(monthStart, 'yyyy-MM-dd'),
                    endDate: format(monthEnd, 'yyyy-MM-dd')
                }),
                api.getUserCrops()
            ]);

            setTasks(tasksResponse?.data || []);
            
            // This is correct, it gets the activeUserCrops
            setUserCrops(userCropsResponse?.data?.activeCrops || []);

        } catch (error) {
            console.error('Failed to fetch calendar data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load calendar data. Please reload.'
            });
        }
    }, [currentMonth]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTaskToggle = async (taskId) => {
        try {
            await api.toggleTaskStatus(taskId);
            await fetchData();
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Task updated',
                showConfirmButton: false,
                timer: 1300
            });
        } catch (error) {
            console.error('Failed to toggle task status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Could not update the task status. Please try again.'
            });
        }
    };

    const confirmToggle = (task) => {
        const willComplete = task.status !== 'completed';
        Swal.fire({
            title: willComplete ? 'Mark task as complete?' : 'Mark task as not complete?',
            text: task.title,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: willComplete ? 'Yes, complete it' : 'Yes, mark incomplete',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                handleTaskToggle(task._id);
            }
        });
    };

    const nextMonth = () => setCurrentMonth(add(currentMonth, { months: 1 }));
    const prevMonth = () => setCurrentMonth(sub(currentMonth, { months: 1 }));

    const startDate = startOfWeek(startOfMonth(currentMonth));
    const days = Array.from({ length: 42 }, (_, i) => add(startDate, { days: i }));

    // Group recurring tasks to avoid duplicates
    const getUniqueTasksForDay = (day) => {
        // Ensure task.dueDate is treated as a Date object for comparison
        const dayTasks = tasks.filter(task => isSameDay(new Date(task.dueDate), day));
        const uniqueTasks = [];
        const seenRecurrenceIds = new Set();

        dayTasks.forEach(task => {
            if (task.recurrenceId) {
                if (!seenRecurrenceIds.has(task.recurrenceId.toString())) {
                    seenRecurrenceIds.add(task.recurrenceId.toString());
                    uniqueTasks.push(task);
                }
            } else {
                uniqueTasks.push(task);
            }
        });

        uniqueTasks.sort((a, b) => (a.status === 'completed') - (b.status === 'completed'));

        return uniqueTasks;
    };

    const getEventsForDay = (day) => {
        const cropsPlanted = userCrops.filter(crop => isSameDay(new Date(crop.plantingDate), day));
        const cropsToHarvest = userCrops.filter(crop => isSameDay(new Date(crop.estimatedHarvestDate), day));
        const dayTasks = getUniqueTasksForDay(day);
        const holiday = holidays.find(h => isSameDay(new Date(h.date), day));
        return { cropsPlanted, cropsToHarvest, dayTasks, holiday };
    };

    const isDuringGrowingPeriod = (day) => {
        return userCrops.some(crop => {
            const start = new Date(crop.plantingDate);
            const end = new Date(crop.estimatedHarvestDate);
            return isWithinInterval(day, { start, end });
        });
    };

    const handleDateClick = (day) => {
        setSelectedDate(day);
    };

    const {
        cropsPlanted,
        cropsToHarvest,
        dayTasks: tasksForSelectedDay,
        holiday: holidayForSelectedDay
    } = getEventsForDay(selectedDate);

    return (
        <ThemeProvider theme={theme}>
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap"
                rel="stylesheet"
            />
            
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Farming Calendar 🗓️
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track your crops and plan your farming activities efficiently.
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                    {/* Calendar Section */}
                    <Paper sx={{ flex: '1 1 72%', p: 3 }}>
                        {/* Month Navigation */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton onClick={prevMonth}><ChevronLeftIcon /></IconButton>
                                <Typography variant="h5">{format(currentMonth, 'MMMM yyyy')}</Typography>
                                <IconButton onClick={nextMonth}><ChevronRightIcon /></IconButton>
                            </Box>

                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                sx={{ borderRadius: '10px', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, ml: 2 }}
                                onClick={() => setIsTaskModalOpen(true)}
                            >
                                Add Task
                            </Button>
                        </Box>

                        {/* Calendar Grid */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                gridTemplateRows: '40px repeat(6, 1fr)',
                                gap: 1,
                                minHeight: '600px'
                            }}
                        >
                            {/* Weekday Headers */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
                                <Box key={w} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'text.secondary' }}>{w}</Box>
                            ))}

                            {/* Day Cells */}
                            {days.map((day, idx) => {
                                const { 
                                    cropsPlanted: dayCropsPlanted, 
                                    cropsToHarvest: dayCropsToHarvest, 
                                    dayTasks: dayDayTasks, 
                                    holiday 
                                } = getEventsForDay(day);
                                const isGrowing = isDuringGrowingPeriod(day);
                                const sunday = isSunday(day);

                                return (
                                    <Box
                                        key={idx}
                                        onClick={() => handleDateClick(day)}
                                        sx={{
                                            p: 1, textAlign: 'left',
                                            backgroundColor: holiday 
                                                ? theme.palette.holiday 
                                                : sunday 
                                                ? '#fff5f5' 
                                                : 'white',
                                            color: !isSameMonth(day, currentMonth) ? 'text.disabled' : 'inherit',
                                            cursor: 'pointer', transition: 'all 0.18s ease',
                                            border: isSameDay(day, selectedDate) 
                                                ? `2px solid ${theme.palette.secondary.main}` 
                                                : '1px solid #f0f0f0',
                                            '&:hover': { bgcolor: '#e8f4ff', transform: 'translateY(-2px)', zIndex: 2 },
                                            display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
                                            minHeight: { xs: '120px', md: '140px' }
                                        }}
                                    >
                                        {/* Day Number */}
                                        <Box sx={{ 
                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
                                            width: '28px', height: '28px', borderRadius: '50%', fontWeight: 'bold', 
                                            backgroundColor: isToday(day) ? theme.palette.todayRing : 'transparent', mb: 1,
                                            color: isToday(day) ? theme.palette.primary.dark : 'inherit',
                                            border: isToday(day) ? `2px solid ${theme.palette.primary.main}` : 'none',
                                            position: 'relative', zIndex: 3
                                        }}>
                                            {format(day, 'd')}
                                        </Box>
                                        {holiday && (
                                            <Typography variant="caption" sx={{ color: '#f57f17', fontWeight: 'bold', lineHeight: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                🎉 {holiday.name}
                                            </Typography>
                                        )}
                                        
                                        {/* Events Container */}
                                        <Box sx={{ flex: 1, overflowY: 'hidden', fontSize: '0.75rem' }}>
                                            
                                            {/* --- FIX #1 --- */}
                                            {/* Planted Crops */}
                                            {dayCropsPlanted.slice(0, 1).map(crop => (
                                                <Box key={`plant-${crop._id}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                                    <LocalFloristIcon sx={{ fontSize: '0.85rem', color: 'success.main' }} />
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                                        Planted: {crop.varietyId?.parentCrop?.name}
                                                    </Typography>
                                                </Box>
                                            ))}
                                            {dayCropsPlanted.length > 1 && <Typography variant="caption" color="text.secondary">+{dayCropsPlanted.length - 1} more planted</Typography>}

                                            {/* Harvest Events */}
                                            {dayCropsToHarvest.slice(0, 1).map(crop => (
                                                <Box key={`harvest-${crop._id}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                                    <ContentCutIcon sx={{ fontSize: '0.85rem', color: 'warning.main' }} />
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                                        Harvest: {crop.varietyId?.parentCrop?.name}
                                                    </Typography>
                                                </Box>
                                            ))}
                                            {dayCropsToHarvest.length > 1 && <Typography variant="caption" color="text.secondary">+{dayCropsToHarvest.length - 1} more to harvest</Typography>}

                                            {/* Tasks with Crop Color Coding */}
                                            {dayDayTasks.slice(0, 3).map(task => {
                                                const cropName = task.cropId?.name; 
                                                return (
                                                    <Tooltip key={task._id} title={`${cropName ? `[${cropName}] ` : ''}${task.title}`} placement="top">
                                                        <Box 
                                                            sx={{ 
                                                                display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5, p: 0.5, borderRadius: 1,
                                                                backgroundColor: cropName 
                                                                    ? `${getCropColor(cropName)}20` 
                                                                    : 'rgba(0,0,0,0.05)',
                                                                borderLeft: `3px solid ${getCropColor(cropName)}`,
                                                                opacity: task.status === 'completed' ? 0.6 : 1
                                                            }}
                                                        >
                                                            <CircleIcon sx={{ 
                                                                fontSize: '0.5rem', 
                                                                color: task.status === 'completed' ? 'success.main' : getCropColor(cropName)
                                                            }} />
                                                            <Typography variant="caption" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                                                                {task.title}
                                                            </Typography>
                                                        </Box>
                                                    </Tooltip>
                                                );
                                            })}
                                            {dayDayTasks.length > 3 && <Typography variant="caption" color="text.secondary">+{dayDayTasks.length - 3} more tasks</Typography>}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Paper>

                    {/* Sidebar */}
                    <Box sx={{ flex: '1 1 28%' }}>
                        <SidebarCard 
                            title={format(selectedDate, 'MMMM d, yyyy')} 
                            onManageTasks={() => setIsTaskModalOpen(true)}
                        >
                            {/* Weather Alert */}
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'info.main' }}>
                                    <WbSunnyOutlinedIcon />
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Local Weather Forecast</Typography>
                                </Box>
                                <Typography variant="body1" sx={{ ml: 3, color: 'text.secondary' }}>
                                    High of 32°C. Clear skies.
                                </Typography>
                            </Box>

                            {/* Holiday */}
                            {holidayForSelectedDay && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>Holiday</Typography>
                                    <Typography variant="body2" sx={{ color: '#f57f17' }}>🎉 **{holidayForSelectedDay.name}**</Typography>
                                </Box>
                            )}

                            {/* --- FIX #2 --- */}
                            {/* Planting Events */}
                            {cropsPlanted.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>Planting Events</Typography>
                                    <List dense disablePadding>
                                        {cropsPlanted.map(crop => (
                                            <ListItem key={`sidebar-plant-${crop._id}`} disableGutters>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <LocalFloristIcon color="success" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={crop.varietyId?.parentCrop?.name}
                                                    secondary={crop.varietyId?.name || "Planted on this date"}
                                                    primaryTypographyProps={{ fontWeight: 'bold' }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}

                            {/* Harvest Events */}
                            {cropsToHarvest.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>Harvest Events</Typography>
                                    <List dense disablePadding>
                                        {cropsToHarvest.map(crop => (
                                            <ListItem key={`sidebar-harvest-${crop._id}`} disableGutters>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <ContentCutIcon color="warning" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={crop.varietyId?.parentCrop?.name}
                                                    secondary={crop.varietyId?.name || "Estimated harvest date"}
                                                    primaryTypographyProps={{ fontWeight: 'bold' }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}

                            {/* Tasks */}
                            {tasksForSelectedDay.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>Tasks Due</Typography>
                                    <List dense disablePadding>
                                        {tasksForSelectedDay.map((task) => {
                                            const cropName = task.cropId?.name;
                                            return (
                                                <ListItem 
                                                    key={`sidebar-task-${task._id}`}
                                                    disableGutters
                                                    sx={{
                                                        borderLeft: cropName 
                                                            ? `4px solid ${getCropColor(cropName)}` 
                                                            : 'none',
                                                        pl: cropName ? 1 : 2,
                                                        mb: 1,
                                                        backgroundColor: task.status === 'completed' ? '#f1f8f4' : 'transparent',
                                                        opacity: task.status === 'completed' ? 0.7 : 1
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={task.status === 'completed'}
                                                        onChange={() => confirmToggle(task)}
                                                        edge="start"
                                                        color="success"
                                                    />
                                                    <ListItemText
                                                        primary={
                                                            <Typography 
                                                                variant="body2" 
                                                                sx={{ 
                                                                    fontWeight: 'bold', 
                                                                    textDecoration: task.status === 'completed' ? 'line-through' : 'none' 
                                                                }}
                                                            >
                                                                {task.title}
                                                            </Typography>
                                                        }
                                                        secondary={cropName ? `[${cropName}] ${task.description || ''}` : task.description}
                                                        secondaryTypographyProps={{ 
                                                            style: { 
                                                                whiteSpace: 'nowrap', 
                                                                overflow: 'hidden', 
                                                                textOverflow: 'ellipsis' 
                                                            } 
                                                        }}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Tooltip title={task.frequency}>
                                                            <CircleIcon sx={{ fontSize: '0.5rem', color: cropName ? getCropColor(cropName) : 'grey.500' }} />
                                                        </Tooltip>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Box>
                            )}

                            {tasksForSelectedDay.length === 0 && 
                                cropsPlanted.length === 0 && 
                                cropsToHarvest.length === 0 && 
                                !holidayForSelectedDay && (
                                <Typography variant="body2" color="text.secondary" sx={{ pt: 2, textAlign: 'center' }}>
                                    No scheduled events or tasks.
                                </Typography>
                            )}
                        </SidebarCard>

                        <SidebarCard title="Growing Progress">
                            <Box sx={{ p: 1, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    {isDuringGrowingPeriod(selectedDate) 
                                        ? "This day falls within the growing period of at least one crop."
                                        : "No crops are actively growing during this day."}
                                </Typography>
                                <Button 
                                    size="small" 
                                    sx={{ mt: 1, borderRadius: 2, fontSize: '0.9rem' }}
                                    onClick={() => {/* Navigate to MyFarm */}}
                                >
                                    View My Farm
                                </Button>
                            </Box>
                        </SidebarCard>
                    </Box>
                </Box>

                {/* Task Management Modal */}
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