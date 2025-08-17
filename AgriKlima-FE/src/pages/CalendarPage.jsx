import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Container } from '@mui/material';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, add, sub } from 'date-fns';

// --- Component Import ---
import AddCropEntryOverlay from '../components/AddCropEntryOverlay'; // <-- Import the new overlay

// --- Icon Imports ---
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

// --- Reusable Sidebar Card ---
const SidebarCard = ({ title, children }) => (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '24px', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>{title}</Typography>
        {children}
    </Paper>
);

// --- Main Calendar Page Component ---
const CalendarPage = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7, 1));
    const [isAddEntryOpen, setIsAddEntryOpen] = useState(false); // <-- Add state for the new overlay

    const handleOpenAddEntry = () => setIsAddEntryOpen(true);
    const handleCloseAddEntry = () => setIsAddEntryOpen(false);

    const nextMonth = () => setCurrentMonth(add(currentMonth, { months: 1 }));
    const prevMonth = () => setCurrentMonth(sub(currentMonth, { months: 1 }));

    // Calendar grid generation logic
    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Mock Data for the sidebar
    const currentCrops = [
        { name: 'Wheat Field A', details: 'Wheat • North Field', color: '#4caf50' },
        { name: 'Corn Section B', details: 'Corn • South Field', color: '#2196f3' },
        { name: 'Tomato Greenhouse', details: 'Tomatoes • Greenhouse 1', color: '#f44336' },
    ];
    const todayTasks = [
        { text: 'Water tomato greenhouse', icon: <CircleOutlinedIcon color="primary" /> },
        { text: 'Check wheat growth progress', icon: <CheckCircleOutlineIcon color="success" /> },
        { text: 'Pest inspection - corn field', icon: <PestControlOutlinedIcon color="error" /> },
        { text: 'Apply fertilizer to section B', icon: <AgricultureOutlinedIcon sx={{color: '#795548'}} /> },
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* --- Header --- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Farming Calendar</Typography>
                    <Typography color="text.secondary">Track your crops and plan your farming activities</Typography>
                </Box>
                <IconButton><MoreVertIcon /></IconButton>
            </Box>

            {/* --- Centered Main Content Grid --- */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Grid container spacing={4} sx={{ maxWidth: 1200, width: '100%' }}>
                    {/* Left Column: Calendar */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #eee', mx: 'auto' }}>
                            {/* Calendar Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#009688', color: 'white', borderRadius: '30px', p: '4px' }}>
                                    <IconButton onClick={prevMonth} size="small" sx={{ color: 'white' }}><ChevronLeftIcon /></IconButton>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mx: 2 }}>{format(currentMonth, 'MMMM yyyy')}</Typography>
                                    <IconButton onClick={nextMonth} size="small" sx={{ color: 'white' }}><ChevronRightIcon /></IconButton>
                                </Box>
                                {/* --- UPDATE THIS BUTTON --- */}
                                <Button 
                                    variant="contained" 
                                    startIcon={<AddIcon />} 
                                    sx={{ bgcolor: 'var(--primary-green)', borderRadius: '20px', textTransform: 'none', px: 3, '&:hover': { bgcolor: 'var(--light-green)' } }}
                                    onClick={handleOpenAddEntry} // <-- Add onClick handler
                                >
                                    Add Crop Entry
                                </Button>
                            </Box>
                            {/* Calendar Grid */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center' }}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <Typography key={day} sx={{ fontWeight: 600, my: 1, color: 'text.secondary', fontSize: '0.875rem' }}>{day}</Typography>
                                ))}
                                {days.map((day, i) => (
                                    <Box key={i} sx={{ borderTop: '1px solid #f0f0f0', height: '100px', p: 1, textAlign: 'left', color: !isSameMonth(day, currentMonth) ? 'text.disabled' : 'inherit' }}>
                                        <Typography component="div" sx={{ 
                                            fontWeight: 500, 
                                            border: isToday(day) ? '2px solid #009688' : 'none', 
                                            borderRadius: '50%', 
                                            width: 28, height: 28, 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            bgcolor: format(day, 'd') === '14' ? '#e8f5e9' : 'transparent',
                                        }}>
                                            {format(day, 'd')}
                                        </Typography>
                                        {format(day, 'd') === '14' && <CircleIcon sx={{ fontSize: '0.5rem', color: 'green', display: 'block', mt: 1, ml: 1 }} />}
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                    {/* Right Column: Sidebar */}
                    <Grid item xs={12} md={4}>
                        <SidebarCard title="Current Crops">
                            {currentCrops.map(crop => (
                                 <Paper key={crop.name} elevation={0} sx={{ display: 'flex', alignItems: 'center', p: 1.5, mb: 1, bgcolor: '#fafafa', borderRadius: '16px' }}>
                                    <CircleIcon sx={{ color: crop.color, mr: 1.5, fontSize: '0.8rem' }} />
                                    <Box>
                                        <Typography sx={{fontWeight: 600, fontSize: '0.9rem'}}>{crop.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{crop.details}</Typography>
                                    </Box>
                                </Paper>
                            ))}
                        </SidebarCard>
                        <SidebarCard title="Today's Tasks">
                            <List dense>
                                {todayTasks.map(task => (
                                    <ListItem key={task.text} disableGutters>
                                        <ListItemIcon sx={{minWidth: '32px'}}>{task.icon}</ListItemIcon>
                                        <ListItemText primary={task.text} />
                                    </ListItem>
                                ))}
                            </List>
                        </SidebarCard>
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '24px', background: '#26c6da', color: 'white' }}>
                            <Typography variant="h6" sx={{fontWeight: 600}}>Weather Alert</Typography>
                            <List dense sx={{color: 'white'}}>
                                <ListItem disableGutters><ListItemIcon><WbSunnyOutlinedIcon sx={{color: 'white'}}/></ListItemIcon>Light rain expected tomorrow</ListItem>
                                <ListItem disableGutters><ListItemIcon><WaterDropOutlinedIcon sx={{color: 'white'}}/></ListItemIcon>Good for watering crops naturally</ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* --- RENDER THE NEW OVERLAY --- */}
            <AddCropEntryOverlay open={isAddEntryOpen} onClose={handleCloseAddEntry} />
        </Container>
    );
};

export default CalendarPage;