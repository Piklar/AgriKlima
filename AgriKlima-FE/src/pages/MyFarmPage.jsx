// src/pages/MyFarmPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Typography, Grid, Card, CardContent, Button,
  LinearProgress, Paper, ThemeProvider, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem,
  FormControl, InputLabel
} from '@mui/material';
import * as api from '../services/api';
import Swal from 'sweetalert2';
import PageDataLoader from '../components/PageDataLoader';
import { format, differenceInDays } from 'date-fns';
import { createTheme } from '@mui/material/styles';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    secondary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    background: { default: '#f8f9f8' },
  },
  typography: {
    fontFamily: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.8rem', lineHeight: 1.2 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: '1.8rem' },
    body1: { fontSize: '1.1rem', lineHeight: 1.7 },
    body2: { fontSize: '1rem', lineHeight: 1.6 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontFamily: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    },
  },
  shape: { borderRadius: 12 },
});

// Define more minimal crop colors
const cropColors = [
  '#7986CB', '#64B5F6', '#4DB6AC', '#81C784', '#AED581',
  '#FFD54F', '#FFB74D', '#FF8A65', '#E57373', '#F06292',
  '#BA68C8', '#9575CD', '#90A4AE', '#A1887F', '#4FC3F7'
];

const CropProgressCard = ({ crop, onDelete, onAddTask, onManageTasks }) => {
  const today = new Date();
  const startDate = new Date(crop.plantingDate);
  const endDate = new Date(crop.estimatedHarvestDate);
  const totalDuration = differenceInDays(endDate, startDate);
  const daysPassed = differenceInDays(today, startDate);
  const progress = Math.min(Math.max((daysPassed / totalDuration) * 100, 0), 100);

  const handleDelete = () => {
    Swal.fire({
      title: `Harvest ${crop.name}?`,
      text: "This will remove the crop from your farm. This action cannot be undone.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, harvest it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        onDelete(crop._id);
      }
    });
  };

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
        },
        borderLeft: `4px solid ${crop.color || '#2e7d32'}`,
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom color="text.primary" fontWeight="bold">
          {crop.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Planted on: {format(startDate, 'MMMM d, yyyy')}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: crop.color || '#2e7d32',
              }
            }}
          />
          <Typography variant="body2" color="primary" fontWeight="bold" sx={{ mt: 0.5 }}>
            {Math.round(progress)}%
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Estimated Harvest: {format(endDate, 'MMMM d, yyyy')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<AddTaskIcon />}
            onClick={() => onAddTask(crop)}
            fullWidth
          >
            Add Task
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<ManageSearchIcon />}
            onClick={() => onManageTasks(crop)}
            fullWidth
          >
            Manage Crop Tasks
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleDelete}
            fullWidth
          >
            Mark as Harvested
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

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
      cropId: crop.cropId._id,
      color: crop.color
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontFamily: 'Playfair Display, serif',
          fontWeight: 700,
          fontSize: '2rem',
          px: 3,
          pt: 2,
          pb: 0.5,
          mb: 2,
        }}
      >
        Add Task for {crop?.name}
      </DialogTitle>
      <DialogContent
        sx={{
          px: 3,
          pt: 3,
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            fullWidth
            required
            sx={{ mt: 1 }}
            InputProps={{
              sx: {
                fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
                fontSize: '1.1rem',
              }
            }}
            InputLabelProps={{
              sx: {
                fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
                fontSize: '1rem',
              }
            }}
          />
          <TextField
            label="Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            InputProps={{
              sx: {
                fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
                fontSize: '1.1rem',
              }
            }}
            InputLabelProps={{
              sx: {
                fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
                fontSize: '1rem',
              }
            }}
          />
          <TextField
            label="Due Date"
            type="date"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true,
              sx: {
                fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
                fontSize: '1rem',
              }
            }}
            InputProps={{
              sx: {
                fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
                fontSize: '1.1rem',
              }
            }}
            required
          />
          <FormControl fullWidth sx={{ fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif', fontSize: '1rem' }}>
            <InputLabel sx={{ fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif', fontSize: '1rem' }}>Frequency</InputLabel>
            <Select
              value={taskFrequency}
              onChange={(e) => setTaskFrequency(e.target.value)}
              label="Frequency"
              sx={{ fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif', fontSize: '1.1rem' }}
            >
              <MenuItem value="Once">Once</MenuItem>
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif', fontSize: '1rem', textTransform: 'none' }}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary" sx={{ fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif', fontSize: '1rem', textTransform: 'none' }}>
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ManageCropTasksDialog = ({ open, onClose, crop, tasks, onTasksUpdate }) => {
  const [loading, setLoading] = useState(false);

  // Add null check for crop
  if (!crop) {
    return null;
  }

  // Filter tasks by the actual crop's master crop ID (cropId._id)
  const cropTasks = tasks.filter(task => {
    if (!task.cropId) return false;
    
    // Check if task's cropId matches the master crop ID
    const taskCropId = typeof task.cropId === 'object' ? task.cropId._id : task.cropId;
    const masterCropId = crop.cropId?._id || crop.cropId;
    
    return taskCropId === masterCropId;
  });

  const handleToggleStatus = async (taskId) => {
    setLoading(true);
    try {
      await api.toggleTaskStatus(taskId);
      onTasksUpdate();
    } catch (error) {
      Swal.fire('Error', 'Could not update task status.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (task) => {
    // FIX: Temporarily hide the dialog to ensure SweetAlert appears on top
    const hasRecurrence = task.recurrenceId;

    // Configure SweetAlert with higher z-index
    const swalConfig = {
      title: 'Delete this task?',
      text: `"${task.title}" will be permanently deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        container: 'swal-high-z-index'
      },
      backdrop: true
    };

    // If recurring task, give option to delete all
    if (hasRecurrence) {
      swalConfig.title = 'Delete recurring task';
      swalConfig.text = `"${task.title}" is a recurring task. What would you like to delete?`;
      swalConfig.showDenyButton = true;
      swalConfig.confirmButtonText = 'Delete all future occurrences';
      swalConfig.denyButtonText = 'Delete only this one';
      swalConfig.cancelButtonText = 'Cancel';
      swalConfig.denyButtonColor = '#ff9800';
    }

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
          console.error("Failed to delete task", error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            zIndex: 1300
          }
        }
      }}
    >
      <DialogTitle>
        Manage Tasks for {crop.name}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {cropTasks.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {cropTasks.map(task => (
                <Card 
                  key={task._id} 
                  variant="outlined"
                  sx={{ 
                    borderLeft: `3px solid ${crop.color}`,
                    backgroundColor: task.status === 'completed' ? '#f1f8f4' : '#fafafa'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {task.title}
                        </Typography>
                        {task.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {task.description}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </Typography>
                        <Box
                          component="span"
                          sx={{ 
                            mt: 0.5, 
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            backgroundColor: task.status === 'completed' ? '#e8f5e9' : '#fff3e0',
                            color: task.status === 'completed' ? '#2e7d32' : '#2e7d32'
                          }}
                        >
                          {task.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: '90px' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          color={task.status === 'completed' ? 'warning' : 'success'}
                          onClick={() => handleToggleStatus(task._id)}
                          disabled={loading}
                          fullWidth
                        >
                          {task.status === 'completed' ? 'Undo' : 'Complete'}
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteTask(task)}
                          disabled={loading}
                          fullWidth
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No tasks found for this crop.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MyFarmPage = () => {
  const [userCrops, setUserCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [manageTasksDialogOpen, setManageTasksDialogOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const fetchUserCrops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getUserCrops();
      // Assign colors to crops
      const cropsWithColors = (response.data || []).map((crop, index) => ({
        ...crop,
        color: cropColors[index % cropColors.length]
      }));
      setUserCrops(cropsWithColors);
    } catch (err) {
      console.error("Failed to fetch user crops:", err);
      setError("Could not load your farm data.");
    } finally {
      setLoading(false);
    }
  }, []);

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

  const handleDeleteCrop = async (userCropId) => {
    try {
      await api.deleteUserCrop(userCropId);
      Swal.fire('Harvested!', 'The crop has been removed from your farm.', 'success');
      fetchUserCrops();
    } catch (err) {
      console.error("Failed to delete crop:", err);
      Swal.fire('Error', 'Could not remove the crop.', 'error');
    }
  };

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

  return (
    <ThemeProvider theme={theme}>
      <PageDataLoader loading={loading} error={error}>
        <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
          <Paper elevation={0} sx={{ pt: 2, pb: 3, px: 4, backgroundColor: 'transparent' }}>
            <Box sx={{ textAlign: 'center', mb: 3, pb: { xs: 3, md: 5 } }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  color: 'black',
                  fontSize: { xs: '2rem', md: '2.8rem' },
                  lineHeight: 1.2,
                }}
              >
                My Farm Overview
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                Track the progress of your crops and manage your farming activities
              </Typography>
            </Box>

            {userCrops.length > 0 ? (
              <Grid container spacing={3}>
                {userCrops.map(crop => (
                  <Grid item xs={12} sm={6} md={4} key={crop._id}>
                    <CropProgressCard
                      crop={crop}
                      onDelete={handleDeleteCrop}
                      onAddTask={handleAddTask}
                      onManageTasks={handleManageTasks}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Your farm is empty!
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Go to the 'Crops' page to add your first planted crop.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => window.location.href = '/crops'}
                  sx={{ mt: 2 }}
                >
                  Browse Crops
                </Button>
              </Paper>
            )}
          </Paper>
        </Container>
      </PageDataLoader>

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

      <style jsx global>{`
        .swal-high-z-index {
          z-index: 9999 !important;
        }
      `}</style>
    </ThemeProvider>
  );
};

export default MyFarmPage;