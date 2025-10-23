// src/pages/MyFarmPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Typography, Grid, Card, CardContent, Button,
  LinearProgress, Paper, ThemeProvider, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem,
  FormControl, InputLabel, CircularProgress, Divider, Stack, // FIX: Import Stack for CropTaskDialog
  IconButton, Checkbox, List, ListItem, ListItemText, ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import * as api from '../services/api';
import Swal from 'sweetalert2';
import PageDataLoader from '../components/PageDataLoader';
import { format, differenceInDays } from 'date-fns';
import { createTheme } from '@mui/material/styles';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from '@mui/icons-material/History';

import ViewAllOverlay from '../components/ViewAllOverlay';
import AddUserCropModal from '../components/AddUserCropModal';

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    secondary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    background: { default: '#f8f9f8' },
  },
  typography: {
    fontFamily: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.8rem', lineHeight: 1.2 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.2rem', lineHeight: 1.2 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: '1.8rem' },
    body1: { fontSize: '1.1rem', lineHeight: 1.7 },
    body2: { fontSize: '1rem', lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
});

const cropColors = [
  '#7986CB', '#64B5F6', '#4DB6AC', '#81C784', '#AED581',
  '#FFD54F', '#FFB74D', '#FF8A65', '#E57373', '#F06292',
  '#BA68C8', '#9575CD', '#90A4AE', '#A1887F', '#4FC3F7'
];

/**
 * Renders a card displaying a single active crop's progress and actions.
 */
const CropProgressCard = ({ crop, onDelete, onAddTask, onManageTasks }) => {
  const today = new Date();
  const startDate = new Date(crop.plantingDate);
  const endDate = new Date(crop.estimatedHarvestDate);
  // Prevent division by zero if totalDuration is 0 (planted and harvested on same day or date error)
  const totalDuration = differenceInDays(endDate, startDate) || 1; 
  const daysPassed = differenceInDays(today, startDate);
  const progress = Math.min(Math.max((daysPassed / totalDuration) * 100, 0), 100);

  const handleDelete = () => {
    Swal.fire({
      title: `Harvest ${crop.name}?`,
      text: "This will move the crop to your harvest history.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, harvest it!'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(crop._id);
      }
    });
  };

  return (
    <Card elevation={2} sx={{ 
      borderRadius: 4, 
      overflow: 'hidden', 
      transition: 'transform 0.2s, box-shadow 0.2s', 
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }, 
      borderLeft: `4px solid ${crop.color || '#2e7d32'}` 
    }}>
      <CardContent>
        <Typography variant="h5" gutterBottom color="text.primary" fontWeight="bold">{crop.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Planted on: {format(startDate, 'MMMM d, yyyy')}</Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>Progress</Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 10, 
              borderRadius: 5, 
              backgroundColor: 'rgba(46, 125, 50, 0.1)', 
              '& .MuiLinearProgress-bar': { borderRadius: 5, backgroundColor: crop.color || '#2e7d32' } 
            }} 
          />
          <Typography variant="body2" color="primary" fontWeight="bold" sx={{ mt: 0.5 }}>{Math.round(progress)}%</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Estimated Harvest: {format(endDate, 'MMMM d, yyyy')}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button variant="contained" color="secondary" size="small" startIcon={<AddTaskIcon />} onClick={() => onAddTask(crop)} fullWidth>Add Task</Button>
          <Button variant="outlined" color="primary" size="small" startIcon={<ManageSearchIcon />} onClick={() => onManageTasks(crop)} fullWidth>Manage Crop Tasks</Button>
          <Button variant="outlined" color="error" size="small" onClick={handleDelete} fullWidth>Mark as Harvested</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * Renders a card displaying a single harvested crop's history.
 */
const HarvestHistoryCard = ({ crop }) => {
    const startDate = new Date(crop.plantingDate);
    // Use the actual harvestDate, defaulting to a sensible fallback if missing
    const harvestDate = crop.harvestDate ? new Date(crop.harvestDate) : new Date(); 
    const growingTime = differenceInDays(harvestDate, startDate);

    return (
        <Card elevation={1} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #eee', backgroundColor: '#f9f9f9' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom color="text.primary" fontWeight="600">{crop.name}</Typography>
                <Typography variant="body2" color="text.secondary">Planted: {format(startDate, 'MMMM d, yyyy')}</Typography>
                <Typography variant="body2" color="text.secondary">Harvested: {format(harvestDate, 'MMMM d, yyyy')}</Typography>
                <Typography variant="body2" color="primary.dark" fontWeight="500" sx={{ mt: 1 }}>
                    Growing Duration: **{growingTime} days**
                </Typography>
            </CardContent>
        </Card>
    );
};

/**
 * Dialog for adding a new task to a specific crop.
 */
const CropTaskDialog = ({ open, onClose, crop, onSave }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDueDate, setTaskDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [taskFrequency, setTaskFrequency] = useState('Once');

    useEffect(() => {
        if (open && crop) {
            setTaskTitle(`${crop.name} - `);
            setTaskDescription('');
            setTaskDueDate(format(new Date(), 'yyyy-MM-dd'));
            setTaskFrequency('Once');
        }
    }, [open, crop]);

    const handleSave = () => {
        if (!taskTitle.trim()) {
            Swal.fire('Error', 'Please enter a task title', 'error');
            return;
        }

        onSave({
            title: taskTitle,
            description: taskDescription,
            dueDate: taskDueDate,
            frequency: taskFrequency,
            // Use the correct cropId from the userCrop object, which has been enriched with master crop data
            cropId: crop.cropId._id, 
            color: crop.color
        });
        onClose(); // Close on successful save attempt (actual closure happens after API call in parent)
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '2rem' }}>
                Add Task for {crop?.name}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <TextField label="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} fullWidth required />
                    <TextField label="Description" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} fullWidth multiline rows={3} />
                    <TextField label="Due Date" type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} required />
                    <FormControl fullWidth>
                        <InputLabel>Frequency</InputLabel>
                        <Select value={taskFrequency} onChange={(e) => setTaskFrequency(e.target.value)} label="Frequency">
                            <MenuItem value="Once">Once</MenuItem>
                            <MenuItem value="Daily">Daily</MenuItem>
                            <MenuItem value="Weekly">Weekly</MenuItem>
                            <MenuItem value="Monthly">Monthly</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} variant="contained" color="primary">Create Task</Button>
            </DialogActions>
        </Dialog>
    );
};

/**
 * Dialog for viewing, completing, and deleting tasks related to a specific crop.
 */
const ManageCropTasksDialog = ({ open, onClose, crop, tasks, onTasksUpdate }) => {
    const [loading, setLoading] = useState(false);
    if (!crop) return null;

    // Filter tasks by the actual crop's master crop ID (cropId._id)
    const cropTasks = tasks.filter(task => {
        if (!task.cropId) return false;
        const taskCropId = typeof task.cropId === 'object' ? task.cropId._id : task.cropId;
        const masterCropId = crop.cropId?._id || crop.cropId;
        // The crop object in `MyFarmPage`'s state is an enriched userCrop, so its `cropId` property is the master crop object.
        return taskCropId === masterCropId;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort by due date

    const handleToggleStatus = async (taskId) => {
        setLoading(true);
        try {
            await api.toggleTaskStatus(taskId);
            onTasksUpdate(); // Refresh tasks
        } catch (error) {
            Swal.fire('Error', 'Could not update task status.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = (task) => {
        const hasRecurrence = task.recurrenceId;

        const swalConfig = {
            title: 'Delete this task?',
            text: `"${task.title}" will be permanently deleted.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            customClass: { container: 'swal-high-z-index' },
            backdrop: true,
            ...(hasRecurrence && {
                title: 'Delete recurring task',
                text: `"${task.title}" is a recurring task. What would you like to delete?`,
                showDenyButton: true,
                confirmButtonText: 'Delete all future occurrences',
                denyButtonText: 'Delete only this one',
                denyButtonColor: '#ff9800',
            })
        };

        Swal.fire(swalConfig).then(async (result) => {
            if (result.isConfirmed || result.isDenied) {
                setLoading(true);
                try {
                    const deleteAll = hasRecurrence && result.isConfirmed;
                    await api.deleteTask(task._id, deleteAll);
                    Swal.fire({ 
                      title: 'Deleted!', 
                      text: deleteAll ? 'All future recurring tasks have been deleted.' : 'The task has been deleted.', 
                      icon: 'success', 
                      timer: 1500, 
                      showConfirmButton: false 
                    });
                    onTasksUpdate();
                } catch (error) {
                    Swal.fire('Error', 'Could not delete the task.', 'error');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ '& .MuiDialog-container': { '& .MuiPaper-root': { zIndex: 1300 } } }}>
            <DialogTitle>Manage Tasks for {crop.name}</DialogTitle>
            <DialogContent>
                {loading && <LinearProgress color="primary" sx={{ my: 1 }} />}
                <List dense>
                    {cropTasks.length > 0 ? (
                        cropTasks.map((task) => (
                            <ListItem 
                              key={task._id} 
                              disablePadding 
                              sx={{ 
                                borderBottom: '1px solid #eee', 
                                '&:last-child': { borderBottom: 'none' },
                                backgroundColor: task.status === 'completed' ? '#f1f8f4' : 'transparent',
                                borderRadius: 1,
                                mb: 1,
                                pr: 1 
                              }}
                            >
                                <Checkbox
                                    edge="start"
                                    checked={task.status === 'completed'}
                                    tabIndex={-1}
                                    disableRipple
                                    onChange={() => handleToggleStatus(task._id)}
                                    icon={<RadioButtonUncheckedIcon />}
                                    checkedIcon={<CheckCircleOutlineIcon color="success" />}
                                    disabled={loading}
                                    sx={{ color: crop.color }}
                                />
                                <ListItemText
                                    primary={
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                textDecoration: task.status === 'completed' ? 'line-through' : 'none', 
                                                fontWeight: task.status === 'completed' ? 'normal' : 'bold'
                                            }}
                                        >
                                            {task.title}
                                        </Typography>
                                    }
                                    secondary={`Due: ${format(new Date(task.dueDate), 'MMM d, yyyy')} - ${task.frequency}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task)} disabled={loading}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                            No tasks found for this crop.
                        </Typography>
                    )}
                </List>
            </DialogContent>
            <DialogActions><Button onClick={onClose} variant="contained">Close</Button></DialogActions>
        </Dialog>
    );
};


const MyFarmPage = () => {
  // State to hold the two separate lists of user crops
  const [activeCrops, setActiveCrops] = useState([]);
  const [harvestedCrops, setHarvestedCrops] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [manageTasksDialogOpen, setManageTasksDialogOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const [isViewAllCropsOpen, setIsViewAllCropsOpen] = useState(false);
  const [isAddCropModalOpen, setIsAddCropModalOpen] = useState(false);
  const [cropToAdd, setCropToAdd] = useState(null);
  const [allCrops, setAllCrops] = useState([]);
  const [loadingAllCrops, setLoadingAllCrops] = useState(false);

  // Fetching User Crops (Active and Harvested)
  const fetchUserCrops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getUserCrops();
      // Assume API returns { activeCrops: [...], harvestedCrops: [...] }
      const { activeCrops: active, harvestedCrops: harvested } = response.data;
        
      const activeWithColors = (active || []).map((crop, index) => ({
        ...crop,
        color: cropColors[index % cropColors.length]
      }));
        
      setActiveCrops(activeWithColors);
      setHarvestedCrops(harvested || []);

    } catch (err) {
      console.error("Failed to fetch user crops:", err);
      setError("Could not load your farm data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetching Tasks
  const fetchTasks = useCallback(async () => {
      try {
        const response = await api.getMyTasks();
        setTasks(response.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
  }, []);

  useEffect(() => {
    fetchUserCrops();
    fetchTasks();
  }, [fetchUserCrops, fetchTasks]);

  // Harvest Handler (moves crop from active to harvested list)
  const handleHarvestCrop = async (userCropId) => {
    try {
      await api.harvestUserCrop(userCropId);
      Swal.fire('Harvested!', 'The crop has been moved to your history.', 'success');
      fetchUserCrops(); // Refresh both active and harvested lists
      fetchTasks(); // Also refresh tasks in case there were related incomplete tasks
    } catch (err) {
      console.error("Failed to harvest crop:", err);
      Swal.fire('Error', 'Could not update the crop status.', 'error');
    }
  };

  // Task Handlers
  const handleAddTask = (crop) => {
    setSelectedCrop(crop);
    setTaskDialogOpen(true);
  };

  const handleManageTasks = (crop) => {
    setSelectedCrop(crop);
    setManageTasksDialogOpen(true);
  };

  const handleSaveTask = async (taskData) => {
      try {
        await api.addTask(taskData);
        Swal.fire('Success!', 'Task has been added to the calendar.', 'success');
        setTaskDialogOpen(false);
        setSelectedCrop(null);
        fetchTasks();
      } catch (err) {
        console.error("Failed to add task:", err);
        Swal.fire('Error', 'Could not add the task.', 'error');
      }
  };

  const handleTasksUpdate = () => {
    fetchTasks();
  };

  // Add Crop Handlers
  const handleOpenAddCropOverlay = async () => {
    setLoadingAllCrops(true);
    try {
        const response = await api.getCrops(); // Assuming this fetches the master crop list
        setAllCrops(response.data.crops || []);
        setIsViewAllCropsOpen(true);
    } catch (err) {
        Swal.fire('Error', 'Could not load the crop list.', 'error');
    } finally {
        setLoadingAllCrops(false);
    }
  };

  const handleCropSelectedFromAll = (crop) => {
    setIsViewAllCropsOpen(false);
    setCropToAdd(crop);
    setTimeout(() => setIsAddCropModalOpen(true), 300);
  };

  const handleCropAddedToFarm = () => {
    setIsAddCropModalOpen(false);
    setCropToAdd(null);
    fetchUserCrops(); // Refresh the farm list
  };

  return (
    <ThemeProvider theme={theme}>
      <PageDataLoader loading={loading} error={error}>
        <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
          <Paper elevation={0} sx={{ pt: 2, pb: 3, px: 4, backgroundColor: 'transparent' }}>
            <Box sx={{ textAlign: 'center', mb: 3, pb: { xs: 3, md: 5 } }}>
              <Typography variant="h4" sx={{...theme.typography.h4}}>My Farm Overview</Typography>
              <Typography variant="body1" color="text.secondary">Track the progress of your crops and manage your farming activities</Typography>
            </Box>

            {/* Section 1: Currently Planted Crops */}
            <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{...theme.typography.h5}}>Currently Planted Crops 🌱</Typography>
                    <Button
                        variant="contained"
                        startIcon={loadingAllCrops ? <CircularProgress size={20} color="inherit" /> : <AddCircleOutlineIcon />}
                        onClick={handleOpenAddCropOverlay}
                        disabled={loadingAllCrops}
                    >
                        Add New Crop
                    </Button>
                </Box>

                {activeCrops.length > 0 ? (
                  <Grid container spacing={3}>
                    {activeCrops.map(crop => (
                      <Grid item xs={12} sm={6} md={4} key={crop._id}>
                        <CropProgressCard
                          crop={crop}
                          onDelete={handleHarvestCrop}
                          onAddTask={handleAddTask}
                          onManageTasks={handleManageTasks}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Paper sx={{ p: 4, textAlign: 'center', mt: 4, border: '1px dashed #ccc' }}>
                    <Typography variant="h6" gutterBottom>No crops are currently being tracked.</Typography>
                    <Typography variant="body2" color="text.secondary">Click "Add New Crop" to get started.</Typography>
                  </Paper>
                )}
            </Box>

            <Divider sx={{ my: 6, borderColor: 'rgba(0, 0, 0, 0.12)' }} />

            {/* Section 2: Harvest History */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <HistoryIcon color="primary" />
                    <Typography variant="h5" sx={{...theme.typography.h5}}>Harvest History 🌾</Typography>
                </Box>
                
                {harvestedCrops.length > 0 ? (
                    <Grid container spacing={3}>
                        {harvestedCrops.map(crop => (
                            <Grid item xs={12} sm={6} md={4} key={crop._id}>
                                <HarvestHistoryCard crop={crop} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Paper sx={{ p: 4, textAlign: 'center', border: '1px dashed #ccc' }}>
                        <Typography variant="body2" color="text.secondary">Your harvest history is empty.</Typography>
                    </Paper>
                )}
            </Box>

          </Paper>
        </Container>
      </PageDataLoader>

      {/* Modals */}
      <CropTaskDialog 
        open={taskDialogOpen} 
        onClose={() => setTaskDialogOpen(false)} 
        crop={selectedCrop} 
        onSave={handleSaveTask} 
      />
      <ManageCropTasksDialog 
        open={manageTasksDialogOpen} 
        onClose={() => setManageTasksDialogOpen(false)} 
        crop={selectedCrop} 
        tasks={tasks} 
        onTasksUpdate={handleTasksUpdate} 
      />
      
      {/* Assuming ViewAllOverlay and AddUserCropModal are defined in their respective files */}
      <ViewAllOverlay 
        open={isViewAllCropsOpen} 
        onClose={() => setIsViewAllCropsOpen(false)} 
        title="Select a Crop to Add" 
        items={allCrops} 
        onItemClick={handleCropSelectedFromAll} 
      />
      <AddUserCropModal 
        open={isAddCropModalOpen} 
        onClose={() => setIsAddCropModalOpen(false)} 
        cropData={cropToAdd} 
        onCropAdded={handleCropAddedToFarm} 
      />

      <style jsx global>{` .swal-high-z-index { z-index: 9999 !important; } `}</style>
    </ThemeProvider>
  );
};

export default MyFarmPage;