// src/pages/CalendarPage.jsx
// Full CalendarPage component in a single file.
// - Always 6 rows (42 days)
// - Current month days visually different from other-month filler days
// - Today's date highlighted with a subtle green circle background
// - Hover effect: light blue tint on hover
// - SweetAlert2 integration for confirming task completion toggles
// - Displays Tasks, 🌱 planting, 🌾 harvest, 🎉 holidays in each cell
// - Layout: Calendar 72% / Sidebar 28%
// - Inline comments throughout to help you understand and edit

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Typography, Paper, Button, IconButton,
  List, ListItem, ListItemIcon, ListItemText, Tooltip, Checkbox,
  ThemeProvider
} from '@mui/material';
import {
  format, startOfMonth, startOfWeek, add, sub,
  isSameDay, isWithinInterval, isSameMonth, isToday, isSunday
} from 'date-fns';
import * as api from '../services/api'; // expects getMyTasks, getUserCrops, toggleTaskStatus
import { useAuth } from '../context/AuthContext';
import TaskManagementModal from '../components/TaskManagementModal';
import { createTheme } from '@mui/material/styles';
import Swal from 'sweetalert2';

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

// -----------------------------------------------------------------------------
// Holidays - example static list. You can replace this with an API call later.
// Each holiday has a `date` (YYYY-MM-DD) and a human-friendly `name`.
// -----------------------------------------------------------------------------
const holidays = [
  { date: '2024-01-01', name: "New Year's Day" },
  { date: '2024-07-04', name: 'Independence Day' },
  { date: '2024-12-25', name: 'Christmas Day' },
  // Add more holidays as needed
];

// -----------------------------------------------------------------------------
// Theme: re-use the theme you provided and keep it centralized so styles are
// consistent across the calendar and sidebar. This theme is passed through
// ThemeProvider. Modify palette/typography here if you want global changes.
// -----------------------------------------------------------------------------
const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    secondary: { main: '#ffa000', light: '#ffc107', dark: '#ff8f00' },
    background: { default: '#f8f9f8' },
    holiday: '#fff9c4', // pale yellow for holiday cells
    todayRing: 'rgba(76,175,80,0.18)' // subtle green circle background for today
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
          borderRadius: '30px', textTransform: 'none',
          fontSize: '1.1rem', padding: '12px 30px'
        }
      }
    },
    MuiTypography: {
      styleOverrides: { root: { letterSpacing: '0.01em' } }
    }
  }
});

// -----------------------------------------------------------------------------
// SidebarCard - small reusable card used by the sidebar to keep UI consistent.
// This is kept simple and has an optional `onManageTasks` handler that opens
// the TaskManagementModal in the parent component.
// -----------------------------------------------------------------------------
const SidebarCard = ({ title, children, onManageTasks }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: '24px',
      mb: 3,
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
      {title}
    </Typography>
    {children}
    <Button variant="outlined" fullWidth sx={{ mt: 2, borderRadius: '10px' }} onClick={onManageTasks}>
      Manage Tasks
    </Button>
  </Paper>
);

// -----------------------------------------------------------------------------
// CalendarPage component
// - This component contains everything: header, calendar grid, sidebar, and
//   the task modal wiring. All logic is inside this file to keep it self-contained.
// -----------------------------------------------------------------------------
const CalendarPage = () => {
  // --- Auth context (if you want to scope data by user) ---
  const { user } = useAuth(); // using destructured user from your AuthContext

  // --- Local state ---
  const [currentMonth, setCurrentMonth] = useState(new Date()); // the month being displayed
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // controls modal visibility
  const [tasks, setTasks] = useState([]); // tasks fetched for the 6-week range
  const [userCrops, setUserCrops] = useState([]); // user's crops info
  const [selectedDate, setSelectedDate] = useState(new Date()); // currently selected date for sidebar

  // --------------------------------------------------------------------------------
  // fetchData: loads tasks and user crops for the visible 6-week window.
  // - We request tasks from the start of the first week that contains the
  //   first day of month (startOfWeek(startOfMonth(currentMonth))) up to 42 days.
  // - userCrops is fetched via getUserCrops() in case planting/harvest dates
  //   are attached to crops rather than tasks.
  // --------------------------------------------------------------------------------
  const fetchData = useCallback(async () => {
    try {
      // compute 6-week window boundaries (we always render 42 cells)
      const monthStart = startOfWeek(startOfMonth(currentMonth));
      const monthEnd = add(monthStart, { days: 41 }); // 0..41 => 42 days

      // parallel API calls for efficiency
      const [tasksResponse, userCropsResponse] = await Promise.all([
        api.getMyTasks({ startDate: format(monthStart, 'yyyy-MM-dd'), endDate: format(monthEnd, 'yyyy-MM-dd') }),
        api.getUserCrops()
      ]);

      // set local state (guarding against undefined responses)
      setTasks(tasksResponse?.data || []);
      setUserCrops(userCropsResponse?.data || []);
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
      // user-friendly feedback
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load calendar data. Please reload.' });
    }
  }, [currentMonth]);

  // fetch when component mounts and whenever currentMonth changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --------------------------------------------------------------------------------
  // Task toggle handling
  // - Instead of immediately toggling when checkbox clicks, we show a SweetAlert2
  //   confirmation modal so users don't accidentally toggle tasks.
  // - After confirmation we call API, then refresh local data.
  // --------------------------------------------------------------------------------
  const handleTaskToggle = async (taskId) => {
    try {
      await api.toggleTaskStatus(taskId); // call server to toggle
      await fetchData(); // refresh tasks/crops to reflect change
      // give a subtle success toast
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Task updated', showConfirmButton: false, timer: 1300 });
    } catch (error) {
      console.error('Failed to toggle task status:', error);
      Swal.fire({ icon: 'error', title: 'Update Failed', text: 'Could not update the task status. Please try again.' });
    }
  };

  // Small wrapper that prompts user via SweetAlert2 before toggling
  const confirmToggle = (task) => {
    // show confirmation: mark as complete OR mark as incomplete depending on current status
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
        // call the actual toggle (the API expects the task id)
        handleTaskToggle(task._id);
      }
    });
  };

  // --------------------------------------------------------------------------------
  // Month navigation helpers
  // --------------------------------------------------------------------------------
  const nextMonth = () => setCurrentMonth(add(currentMonth, { months: 1 }));
  const prevMonth = () => setCurrentMonth(sub(currentMonth, { months: 1 }));

  // --------------------------------------------------------------------------------
  // Build the 6-week (42-day) array for rendering calendar cells.
  // - startDate is the Sunday of the week that contains the 1st of the month.
  // - days is an array of 42 Date objects.
  // --------------------------------------------------------------------------------
  const startDate = startOfWeek(startOfMonth(currentMonth));
  const days = Array.from({ length: 42 }, (_, i) => add(startDate, { days: i }));

  // --------------------------------------------------------------------------------
  // getEventsForDay
  // - returns planted crops, harvest crops, tasks scheduled for the given date,
  //   and holiday if any.
  // - IMPORTANT: This uses date equality matching via isSameDay so timezone
  //   mismatches are minimized assuming server returns UTC-like ISO dates.
  // --------------------------------------------------------------------------------
  const getEventsForDay = (day) => {
    const cropsPlanted = userCrops.filter(crop => isSameDay(new Date(crop.plantingDate), day));
    const cropsToHarvest = userCrops.filter(crop => isSameDay(new Date(crop.estimatedHarvestDate), day));
    const dayTasks = tasks.filter(task => isSameDay(new Date(task.dueDate), day));
    const holiday = holidays.find(h => isSameDay(new Date(h.date), day));
    return { cropsPlanted, cropsToHarvest, dayTasks, holiday };
  };

  // --------------------------------------------------------------------------------
  // isDuringGrowingPeriod
  // - returns true if `day` falls between plantingDate and estimatedHarvestDate
  //   of any user crop. This is used to give a subtle background for days that
  //   are within a crop's growing window, helping visually track progress.
  // --------------------------------------------------------------------------------
  const isDuringGrowingPeriod = (day) => {
    return userCrops.some(crop =>
      isWithinInterval(day, {
        start: new Date(crop.plantingDate),
        end: new Date(crop.estimatedHarvestDate),
      })
    );
  };

  // --------------------------------------------------------------------------------
  // Date click handler - selecting a date updates the sidebar with that date's
  // events and sets it as the active date (used to outline the selected cell).
  // --------------------------------------------------------------------------------
  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  // --------------------------------------------------------------------------------
  // Compute sidebar data for the currently selected date. We're calling the
  // helper once so the JSX later remains concise.
  // --------------------------------------------------------------------------------
  const {
    cropsPlanted,
    cropsToHarvest,
    dayTasks: tasksForSelectedDay,
    holiday: holidayForSelectedDay
  } = getEventsForDay(selectedDate);

  // --------------------------------------------------------------------------------
  // Render
  // - Use ThemeProvider to apply custom theme
  // - The layout uses a flex container with two columns: calendar (72%) and
  //   sidebar (28%). On small screens they stack vertically.
  // --------------------------------------------------------------------------------
  return (
    <ThemeProvider theme={theme}>
      {/* Load Google fonts used in the theme. Putting inside component so the
          font request is included with the page when this component mounts. */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');`}</style>

      {/* Primary container */}
      <Container maxWidth="xl" sx={{ py: 4, background: theme.palette.background.default, minHeight: '100vh' }}>

        {/* Page Header: title and small subtitle */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
              Farming Calendar
            </Typography>
            <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
              Track your crops and plan your farming activities
            </Typography>
          </Box>
          <IconButton aria-label="more-options"><MoreVertIcon /></IconButton>
        </Box>

        {/* MAIN LAYOUT: flex container that holds the calendar and the sidebar */}
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            mt: 3,
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', md: 'row' }, // stack on small screens
          }}
        >

          {/* ====================================================================
              LEFT: Calendar (72% width on medium and up)
              ==================================================================== */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '0 0 72%' }, // full width on xs, 72% on md+
              backgroundColor: 'white',
              borderRadius: 2,
              p: { xs: 2, md: 3 },
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
          >
            {/* Calendar container (Paper) */}
            <Paper elevation={0} sx={{ p: 0, borderRadius: '10px', overflow: 'hidden' }}>

              {/* -----------------------------
                  Top controls (month nav + add task button)
                  ------------------------------*/}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: { xs: 1, md: 6 },
                py: 2,
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 2
              }}>
                {/* Month navigator: left/right arrows and current month */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: '10px',
                  px: 2,
                  py: 0.5,
                  minWidth: { xs: 'auto', md: '280px' },
                  justifyContent: 'center',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                }}>
                  <IconButton onClick={prevMonth} size="small" sx={{ color: 'white' }} aria-label="previous month">
                    <ChevronLeftIcon />
                  </IconButton>

                  <Typography variant="h6" sx={{ fontWeight: 600, mx: 2, textAlign: 'center', flex: 1 }}>
                    {format(currentMonth, 'MMMM yyyy')}
                  </Typography>

                  <IconButton onClick={nextMonth} size="small" sx={{ color: 'white' }} aria-label="next month">
                    <ChevronRightIcon />
                  </IconButton>
                </Box>

                {/* Add Task button: opens TaskManagementModal */}
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ borderRadius: '10px', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, ml: 2 }}
                  onClick={() => setIsTaskModalOpen(true)}
                >
                  Add Task
                </Button>
              </Box>

              {/* -----------------------------
                  Calendar Grid: Weekday headers + 6x7 day cells (42 total)
                  - gridTemplateRows uses a 40px row for weekday headers followed by
                    6 equal rows for day cells. This guarantees consistent layout.
                  - minHeight ensures the grid has comfortable vertical space.
                  ------------------------------*/}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gridTemplateRows: '40px repeat(6, 1fr)',
                gap: '2px',
                backgroundColor: '#f5f5f5',
                borderRadius: '0 0 10px 10px',
                p: 1.5,
                minHeight: '760px',
                maxHeight: { xs: 'auto', md: '1020px' },
                height: { xs: 'auto', md: '1020px' },
                overflow: 'hidden'
              }}>

                {/* Weekday header labels (Sun..Sat) */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
                  <Box key={w} sx={{
                    backgroundColor: 'white',
                    py: 1,
                    fontWeight: 700,
                    color: w === 'Sun' ? 'red' : 'text.primary',
                    fontSize: '0.95rem',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {w}
                  </Box>
                ))}

                {/* Day cells - exactly 42 cells */}
                {days.map((day, idx) => {
                  // for each day compute events and flags used to render content
                  const { cropsPlanted: dayCropsPlanted, cropsToHarvest: dayCropsToHarvest, dayTasks: dayDayTasks, holiday } = getEventsForDay(day);
                  const isGrowing = isDuringGrowingPeriod(day);
                  const hasMorePlanted = dayCropsPlanted.length > 2;
                  const hasMoreHarvest = dayCropsToHarvest.length > 2;
                  const sunday = isSunday(day);

                  // Visual styles: different for current-month days vs filler days
                  // - filler days (not isSameMonth) are dimmed via `text.disabled` color
                  // - current month days keep default text color so they appear prominent
                  // - if the day is today, show subtle green circular background behind the day number

                  return (
                    <Box
                      key={idx}
                      onClick={() => handleDateClick(day)}
                      sx={{
                        p: 1,
                        textAlign: 'left',
                        // holiday cell gets a pale yellow bg; Sundays get light pink tint
                        backgroundColor: holiday ? theme.palette.holiday : sunday ? '#fff5f5' : (isGrowing ? 'transparent' : 'white'),
                        // dim other-month filler days
                        color: !isSameMonth(day, currentMonth) ? 'text.disabled' : 'inherit',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        // selectedDate gets a subtle outline via secondary color; today gets a ring
                        border: isSameDay(day, selectedDate) ? `2px solid ${theme.palette.secondary.main}` : 'none',
                        '&:hover': { backgroundColor: '#e8f4ff', transform: 'translateY(-2px)', zIndex: 2 }, // light blue tint on hover
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        minHeight: { xs: '120px', md: '140px' }
                      }}
                    >
                      {/* Day number with subtle green circle if today
                          - We render the number inside a small box that becomes a green
                            circular badge when `isToday(day)` is true. */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Box sx={{
                          width: 34,
                          height: 34,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          // subtle green circle background for today only; otherwise transparent
                          backgroundColor: isToday(day) ? theme.palette.todayRing : 'transparent',
                          color: isToday(day) ? theme.palette.primary.dark : (isSameMonth(day, currentMonth) ? 'text.primary' : 'text.disabled'),
                          fontWeight: 700,
                          fontSize: '0.95rem'
                        }}>
                          {format(day, 'd')}
                        </Box>
                      </Box>

                      {/* Events container: scrollable area inside cell */}
                      <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0, pr: 0.5, mt: 1 }}>

                        {/* Holiday label */}
                        {holiday && (
                          <Tooltip key={`holiday-${idx}`} title={holiday.name}>
                            <Typography variant="caption" sx={{ color: 'black', fontWeight: 'bold', display: 'block' }}>{holiday.name}</Typography>
                          </Tooltip>
                        )}

                        {/* Planted crops (show up to 2; show a +n more indicator if more) */}
                        {dayCropsPlanted.slice(0, 2).map(crop => (
                          <Tooltip key={`plant-${crop._id}`} title={`Planted: ${crop.name}`}>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', mb: 0.5, color: 'primary.main', fontWeight: 500 }}>
                              <LocalFloristIcon sx={{ fontSize: '0.9rem', mr: 0.75 }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{crop.name}</span>
                            </Box>
                          </Tooltip>
                        ))}
                        {hasMorePlanted && <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>+{dayCropsPlanted.length - 2} more planted</Box>}

                        {/* Harvest events (show up to 2) */}
                        {dayCropsToHarvest.slice(0, 2).map(crop => (
                          <Tooltip key={`harv-${crop._id}`} title={`Harvest: ${crop.name}`}>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', mb: 0.5, color: 'secondary.main', fontWeight: 500 }}>
                              <ContentCutIcon sx={{ fontSize: '0.9rem', mr: 0.75 }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{crop.name}</span>
                            </Box>
                          </Tooltip>
                        ))}
                        {hasMoreHarvest && <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>+{dayCropsToHarvest.length - 2} more to harvest</Box>}

                        {/* Tasks summary indicator */}
                        {dayDayTasks.length > 0 && (
                          <Tooltip key={`tasks-${idx}`} title={`${dayDayTasks.length} task(s)`}>
                            <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: 'primary.main' }}>
                              <CircleIcon sx={{ fontSize: '0.6rem', mr: 0.75, color: dayDayTasks.every(t => t.status === 'completed') ? 'success.main' : 'primary.main' }} />
                              {dayDayTasks.length} task{dayDayTasks.length > 1 ? 's' : ''}
                            </Box>
                          </Tooltip>
                        )}

                      </Box>
                    </Box>
                  );
                })}

              </Box>
            </Paper>
          </Box>

          {/* ====================================================================
              RIGHT: Sidebar (28% width on medium and up)
              - Shows events for the selected date and a small weather widget.
              ==================================================================== */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '0 0 28%' },
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            {/* Sidebar: events for currently selectedDate */}
            <SidebarCard
              title={`Events for ${format(selectedDate, 'MMMM d, yyyy')}`}
              onManageTasks={() => setIsTaskModalOpen(true)}
            >
              {/* If there are no events, show a helpful message */}
              {tasksForSelectedDay.length === 0 && cropsPlanted.length === 0 && cropsToHarvest.length === 0 && !holidayForSelectedDay && (
                <Typography color="text.secondary">No events scheduled for this date.</Typography>
              )}

              {/* Holiday block (if present) */}
              {holidayForSelectedDay && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'secondary.main', mb: 1 }}>Holiday</Typography>
                  <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', p: 1.5, mb: 1, bgcolor: '#fffaf0', borderRadius: '10px' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{holidayForSelectedDay.name}</Typography>
                  </Paper>
                </Box>
              )}

              {/* Planting events list */}
              {cropsPlanted.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>Planting Events</Typography>
                  {cropsPlanted.map(crop => (
                    <Paper key={crop._id} elevation={0} sx={{ display: 'flex', alignItems: 'center', p: 1.5, mb: 1, bgcolor: '#f0f9f0', borderRadius: '10px' }}>
                      <LocalFloristIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1rem' }} />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{crop.name}</Typography>
                        <Typography variant="body2" color="text.secondary">Planted on this date</Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}

              {/* Harvest events list */}
              {cropsToHarvest.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'secondary.main', mb: 1 }}>Harvest Events</Typography>
                  {cropsToHarvest.map(crop => (
                    <Paper key={crop._id} elevation={0} sx={{ display: 'flex', alignItems: 'center', p: 1.5, mb: 1, bgcolor: '#fffaf0', borderRadius: '10px' }}>
                      <ContentCutIcon sx={{ color: 'secondary.main', mr: 1.5, fontSize: '1rem' }} />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{crop.name}</Typography>
                        <Typography variant="body2" color="text.secondary">Estimated harvest date</Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}

              {/* Tasks list with checkboxes. Clicking a checkbox prompts confirmation
                  via SweetAlert2 (confirmToggle).

                  Note: We pass the entire `task` object into confirmToggle so we
                  can tailor the confirmation message depending on status. */}
              {tasksForSelectedDay.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>Tasks</Typography>
                  <List dense>
                    {tasksForSelectedDay.map((task) => (
                      <ListItem key={task._id} disableGutters>
                        <ListItemIcon sx={{ minWidth: '32px' }}>
                          {/* We intentionally don't directly call handleTaskToggle here so
                              we can confirm the user's intention first using SweetAlert2. */}
                          <Checkbox
                            edge="start"
                            checked={task.status === 'completed'}
                            onChange={() => confirmToggle(task)}
                            inputProps={{ 'aria-label': `Mark task ${task.title} as complete` }}
                          />
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

            </SidebarCard>

            {/* Small Weather/Alert card - static for now but easy to convert to API later */}
            <Paper elevation={0} sx={{
              p: 2.5,
              borderRadius: '10px',
              background: 'linear-gradient(135deg,#26c6da,#2e7d32)',
              color: 'white',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }
            }}>
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

          </Box>
        </Box>

        {/* Task Management Modal - open/close wired to local state. The modal
            should call `onTasksUpdate` when tasks are changed so we can refresh
            the calendar by re-fetching the 6-week window. */}
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
