import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Typography, Grid, Card, CardContent, Button,
  LinearProgress, Paper, ThemeProvider, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem,
  FormControl, InputLabel, CircularProgress, Divider, Stack,
  IconButton, Checkbox, List, ListItem, ListItemText, ListItemSecondaryAction,
  Modal, Avatar, ListItemAvatar, ListItemButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import { format, differenceInDays } from 'date-fns';
import { createTheme } from '@mui/material/styles';
import * as api from '../services/api';

// -----------------------------------------------------------------------------
// THEME & HELPERS
// -----------------------------------------------------------------------------
const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    secondary: { main: '#66bb6a', light: '#81c784', dark: '#388e3c' },
    background: { default: '#f8f9f8' },
  },
  typography: {
    fontFamily: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.8rem' },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.2rem' },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: '1.8rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
});

const cropColors = [
  '#7986CB', '#64B5F6', '#4DB6AC', '#81C784', '#AED581', '#FFD54F', 
  '#FFB74D', '#FF8A65', '#E57373', '#F06292', '#BA68C8', '#9575CD'
];

const PageDataLoader = ({ loading, error, children }) => {
  if (loading) return <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ py: 8, textAlign: 'center' }}><Typography color="error">{error}</Typography></Box>;
  return <>{children}</>;
};

// -----------------------------------------------------------------------------
// CARD COMPONENTS
// (Using the new variety-based structure)
// -----------------------------------------------------------------------------
const CropProgressCard = ({ crop, onDelete, onAddTask, onManageTasks }) => {
  const variety = crop?.varietyId;
  if (!variety) return null;

  const parentCrop = variety.parentCrop || {};
  const startDate = new Date(crop.plantingDate);
  const endDate = new Date(crop.estimatedHarvestDate);
  const totalDuration = differenceInDays(endDate, startDate) || 1;
  const daysPassed = differenceInDays(new Date(), startDate);
  const progress = Math.min(Math.max((daysPassed / totalDuration) * 100, 0), 100);

  const handleDelete = () => {
    Swal.fire({
      title: `Harvest ${parentCrop.name}?`,
      text: "This will move the crop to your harvest history.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2e7d32',
      confirmButtonText: 'Yes, harvest it!'
    }).then(result => {
      if (result.isConfirmed) {
        onDelete(crop._id);
      }
    });
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 4, overflow: 'hidden', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }, transition: 'all 0.2s', borderLeft: `4px solid ${crop.color}` }}>
      <CardContent>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {parentCrop.name} <Typography variant="h6" component="span" color="text.secondary">({variety.name})</Typography>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Planted on: {format(startDate, 'MMMM d, yyyy')}</Typography>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Progress</Typography>
            <Typography variant="body2" fontWeight="bold" color="primary">{Math.round(progress)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, '& .MuiLinearProgress-bar': { backgroundColor: crop.color } }} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Estimated Harvest: {format(endDate, 'MMMM d, yyyy')}</Typography>
        <Stack spacing={1}>
          <Button variant="contained" color="secondary" size="small" startIcon={<AddTaskIcon />} onClick={() => onAddTask(crop)} fullWidth>Add Task</Button>
          <Button variant="outlined" color="primary" size="small" startIcon={<ManageSearchIcon />} onClick={() => onManageTasks(crop)} fullWidth>Manage Tasks</Button>
          <Button variant="outlined" color="error" size="small" onClick={handleDelete} fullWidth>Mark as Harvested</Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const HarvestHistoryCard = ({ crop }) => {
  const variety = crop?.varietyId;
  if (!variety) return null;
  const parentCrop = variety.parentCrop || {};
  const startDate = new Date(crop.plantingDate);
  const harvestDate = crop.harvestDate ? new Date(crop.harvestDate) : new Date();
  const growingTime = differenceInDays(harvestDate, startDate);

  return (
    <Card elevation={1} sx={{ borderRadius: 3, border: '1px solid #eee', bgcolor: '#f9f9f9' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="600">{parentCrop.name} <Typography variant="body1" component="span" color="text.secondary">({variety.name})</Typography></Typography>
        <Typography variant="body2" color="text.secondary">Planted: {format(startDate, 'MMMM d, yyyy')}</Typography>
        <Typography variant="body2" color="text.secondary">Harvested: {format(harvestDate, 'MMMM d, yyyy')}</Typography>
        <Typography variant="body1" color="primary.dark" fontWeight="500" sx={{ mt: 1 }}>Growing Duration: <strong>{growingTime} days</strong></Typography>
      </CardContent>
    </Card>
  );
};

// -----------------------------------------------------------------------------
// MODAL COMPONENTS
// -----------------------------------------------------------------------------

// --- "ADD CROP" FLOW MODALS ---
const ViewAllCropsModal = ({ open, onClose, items, onItemClick }) => (
  <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Paper sx={{ width: '80%', maxWidth: 700, maxHeight: '80vh', overflowY: 'auto', p: 3, borderRadius: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Select a Crop to Plant</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>
      <List>
        {items.map(item => (
          <ListItemButton key={item._id} onClick={() => onItemClick(item)} sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'action.hover' } }}>
            <ListItemAvatar><Avatar src={item.imageUrl} variant="rounded" sx={{ width: 56, height: 56, mr: 2 }} /></ListItemAvatar>
            <ListItemText primary={item.name} secondary={item.description} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  </Modal>
);

const VarietyChoiceModal = ({ open, onClose, onChoice, cropName }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle fontWeight="bold">Add {cropName}</DialogTitle>
    <DialogContent>
      <Typography>Are you planting a specific variety of {cropName}, or a common type?</Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2 }}>
      <Button onClick={() => onChoice('common')} variant="outlined">Add as Common Crop</Button>
      <Button onClick={() => onChoice('specific')} variant="contained">Select Specific Variety</Button>
    </DialogActions>
  </Dialog>
);

const VarietySelectionModal = ({ open, onClose, varieties, onSelectVariety, cropName }) => (
  <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Paper sx={{ width: '80%', maxWidth: 700, maxHeight: '80vh', overflowY: 'auto', p: 3, borderRadius: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Select a {cropName} Variety</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>
      <List>
        {varieties.map(variety => (
          <ListItemButton key={variety._id} onClick={() => onSelectVariety(variety)} sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'action.hover' } }}>
            <ListItemAvatar><Avatar src={variety.imageUrl} variant="rounded" sx={{ width: 56, height: 56, mr: 2 }} /></ListItemAvatar>
            <ListItemText primary={variety.name} secondary={`${variety.growingDuration} days growing duration`} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  </Modal>
);

const AddPlantingDateModal = ({ open, onClose, varietyData, onCropAdded }) => {
  const [plantingDate, setPlantingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (open) setPlantingDate(format(new Date(), 'yyyy-MM-dd')); }, [open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.addUserCrop({ varietyId: varietyData._id, plantingDate });
      Swal.fire('Success', `${varietyData.name} has been added to your farm.`, 'success');
      onCropAdded();
      onClose();
    } catch (err) {
      Swal.fire('Error', 'Could not add crop to farm.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!varietyData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight="bold">Add {varietyData.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography>Please confirm the planting date for this variety.</Typography>
          <TextField 
            label="Planting Date" 
            type="date" 
            value={plantingDate} 
            onChange={(e) => setPlantingDate(e.target.value)} 
            InputLabelProps={{ shrink: true }} 
            fullWidth 
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Add to Farm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


// --- TASK MODALS (Merged and Adapted) ---
const CropTaskDialog = ({ open, onClose, crop, onSave }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDueDate, setTaskDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [taskFrequency, setTaskFrequency] = useState('Once');
  
    const cropName = crop?.varietyId?.parentCrop?.name || 'Crop';

    useEffect(() => {
        if (open) {
            setTaskTitle(`${cropName} - `);
            setTaskDescription('');
            setTaskDueDate(format(new Date(), 'yyyy-MM-dd'));
            setTaskFrequency('Once');
        }
    }, [open, cropName]);

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
            cropId: crop?.varietyId?.parentCrop?._id, // Pass the master crop ID
            color: crop?.color
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '2rem' }}>
                Add Task for {cropName}
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

// **MERGED & FIXED**: This component now has the full logic from File 1 AND the crash fix
const ManageCropTasksDialog = ({ open, onClose, crop, tasks, onTasksUpdate }) => {
    const [loading, setLoading] = useState(false);
    if (!crop) return null;

    const cropName = crop?.varietyId?.parentCrop?.name || 'Selected Crop';
    const masterCropId = crop?.varietyId?.parentCrop?._id;

    // --- THIS IS THE FIX ---
    // We must check if `task.cropId` exists before accessing its properties.
    const cropTasks = tasks.filter(task => {
        // 1. If task.cropId is null or undefined, skip it.
        if (!task.cropId) {
            return false; 
        }
        
        // 2. Now that we know task.cropId exists, we can safely access it.
        const taskCropId = typeof task.cropId === 'object' ? task.cropId._id : task.cropId;
        return taskCropId === masterCropId;

    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    // --- END FIX ---


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
            customClass: { container: 'swal-high-z-index' }, // Uses global style
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
            <DialogTitle>Manage Tasks for {cropName}</DialogTitle>
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


// -----------------------------------------------------------------------------
// MAIN PAGE COMPONENT
// -----------------------------------------------------------------------------
const MyFarmPage = () => {
  const [activeCrops, setActiveCrops] = useState([]);
  const [harvestedCrops, setHarvestedCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allCrops, setAllCrops] = useState([]);
  const [varietiesForCrop, setVarietiesForCrop] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingAllCrops, setLoadingAllCrops] = useState(false);
  const [loadingVarieties, setLoadingVarieties] = useState(false);
  const [error, setError] = useState(null);

  const [isViewAllCropsOpen, setIsViewAllCropsOpen] = useState(false);
  const [isVarietyChoiceOpen, setIsVarietyChoiceOpen] = useState(false);
  const [isVarietyListOpen, setIsVarietyListOpen] = useState(false);
  const [isAddPlantingDateOpen, setIsAddPlantingDateOpen] = useState(false);
  
  const [selectedMasterCrop, setSelectedMasterCrop] = useState(null);
  const [varietyToAdd, setVarietyToAdd] = useState(null);
  
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [manageTasksDialogOpen, setManageTasksDialogOpen] = useState(false);
  const [selectedCropForTask, setSelectedCropForTask] = useState(null);

  const fetchPageData = useCallback(async () => {
    // Set loading to true only if it's not the initial load
    // (We'll use the PageDataLoader for the initial load)
    // setLoading(true); // This might be too aggressive, let PageDataLoader handle initial
    setError(null);
    try {
      const [cropsRes, tasksRes] = await Promise.all([api.getUserCrops(), api.getMyTasks()]);
      const { activeCrops: active = [], harvestedCrops: harvested = [] } = cropsRes.data || {};

      setActiveCrops(active.map((crop, index) => ({ ...crop, color: cropColors[index % cropColors.length] })));
      setHarvestedCrops(harvested);
      setTasks(tasksRes.data || []);
    } catch (err) {
      console.error("Failed to fetch page data:", err);
      setError("Could not load your farm data.");
    } finally {
      setLoading(false); // Only set loading false after initial load
    }
  }, []);

  useEffect(() => { 
    setLoading(true); // Set loading to true on mount
    fetchPageData(); 
  }, [fetchPageData]);

  const handleOpenAddCropFlow = async () => {
    setLoadingAllCrops(true);
    try {
      const response = await api.getCrops({ limit: 1000 });
      setAllCrops(response.data.crops || []);
      setIsViewAllCropsOpen(true);
    } catch (err) {
      Swal.fire('Error', 'Could not load the list of available crops.', 'error');
    } finally {
      setLoadingAllCrops(false);
    }
  };

  const handleMasterCropSelected = (crop) => {
    setSelectedMasterCrop(crop);
    setIsViewAllCropsOpen(false);
    setTimeout(() => setIsVarietyChoiceOpen(true), 300);
  };

  const handleVarietyChoice = async (choice) => {
    setIsVarietyChoiceOpen(false);
    setLoadingVarieties(true);

    try {
      const response = await api.getVarietiesForCrop(selectedMasterCrop._id);
      const varieties = response.data || [];

      if (varieties.length === 0) {
        Swal.fire('No Varieties Found', `There are no varieties listed for ${selectedMasterCrop.name}. Please add one via the admin panel.`, 'info');
        setLoadingVarieties(false);
        return;
      }

      if (choice === 'specific') {
        setVarietiesForCrop(varieties);
        setTimeout(() => setIsVarietyListOpen(true), 300);
      } else { // 'common' choice
        let defaultVariety = varieties.find(v => v.name.toLowerCase().includes('common') || v.name.toLowerCase().includes('generic')) || varieties[0];
        setVarietyToAdd(defaultVariety);
        setTimeout(() => setIsAddPlantingDateOpen(true), 300);
      }
    } catch (error) {
       Swal.fire('Error', 'Could not fetch crop varieties.', 'error');
    } finally {
        setLoadingVarieties(false);
    }
  };
  
  const handleVarietySelected = (variety) => {
    setVarietyToAdd(variety);
    setIsVarietyListOpen(false);
    setTimeout(() => setIsAddPlantingDateOpen(true), 300);
  };

  const handleFinalCropAdd = () => {
    setIsAddPlantingDateOpen(false);
    setVarietyToAdd(null);
    setSelectedMasterCrop(null);
    fetchPageData(); // Refresh everything
  };

  const handleHarvestCrop = async (userCropId) => {
    try {
      await api.harvestUserCrop(userCropId);
      Swal.fire('Harvested!', 'The crop has been moved to your history.', 'success');
      fetchPageData();
    } catch (err) {
      Swal.fire('Error', 'Could not update the crop status.', 'error');
    }
  };
  
  const handleAddTask = (crop) => { setSelectedCropForTask(crop); setTaskDialogOpen(true); };
  const handleManageTasks = (crop) => { setSelectedCropForTask(crop); setManageTasksDialogOpen(true); };
  
  const handleSaveTask = async (taskData) => {
    if (!taskData.cropId) {
        Swal.fire('Error', 'Could not associate task with a crop. Please try again.', 'error');
        return;
    }
    try {
      await api.addTask(taskData);
      Swal.fire('Success!', 'Task has been added to the calendar.', 'success');
      setTaskDialogOpen(false);
      fetchPageData(); // Refresh all data
    } catch (err) {
      Swal.fire('Error', 'Could not add the task.', 'error');
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <PageDataLoader loading={loading} error={error}>
        <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'transparent' }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography variant="h4">My Farm Overview</Typography>
              <Typography variant="body1" color="text.secondary">Track the progress of your crops and manage your farming activities</Typography>
            </Box>

            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Currently Planted Crops 🌱</Typography>
                <Button variant="contained" startIcon={loadingAllCrops || loadingVarieties ? <CircularProgress size={20} color="inherit" /> : <AddCircleOutlineIcon />} onClick={handleOpenAddCropFlow} disabled={loadingAllCrops || loadingVarieties}>Add New Crop</Button>
              </Box>
              {activeCrops.length > 0 ? (
                <Grid container spacing={3}>
                  {activeCrops.map(crop => (
                    <Grid item xs={12} sm={6} md={4} key={crop._id}>
                      <CropProgressCard crop={crop} onDelete={handleHarvestCrop} onAddTask={handleAddTask} onManageTasks={handleManageTasks} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', mt: 4, borderStyle: 'dashed' }}>
                  <Typography variant="h6" gutterBottom>No crops are currently being tracked.</Typography>
                  <Typography variant="body2" color="text.secondary">Click "Add New Crop" to get started.</Typography>
                </Paper>
              )}
            </Box>

            <Divider sx={{ my: 6 }} />

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <HistoryIcon color="primary" />
                <Typography variant="h5">Harvest History 🌾</Typography>
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
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed' }}>
                  <Typography variant="body2" color="text.secondary">Your harvest history is empty.</Typography>
                </Paper>
              )}
            </Box>
          </Paper>
        </Container>
      </PageDataLoader>

      {/* MODALS FOR THE "ADD CROP" FLOW */}
      <ViewAllCropsModal open={isViewAllCropsOpen} onClose={() => setIsViewAllCropsOpen(false)} items={allCrops} onItemClick={handleMasterCropSelected} />
      <VarietyChoiceModal open={isVarietyChoiceOpen} onClose={() => setIsVarietyChoiceOpen(false)} onChoice={handleVarietyChoice} cropName={selectedMasterCrop?.name} />
      <VarietySelectionModal open={isVarietyListOpen} onClose={() => setIsVarietyListOpen(false)} varieties={varietiesForCrop} onSelectVariety={handleVarietySelected} cropName={selectedMasterCrop?.name} />
      <AddPlantingDateModal open={isAddPlantingDateOpen} onClose={() => setIsAddPlantingDateOpen(false)} varietyData={varietyToAdd} onCropAdded={handleFinalCropAdd} />
      
      {/* TASK MODALS (from File 1, adapted by File 3) */}
      <CropTaskDialog 
        open={taskDialogOpen} 
        onClose={() => setTaskDialogOpen(false)} 
        crop={selectedCropForTask} 
        onSave={handleSaveTask} 
      />
      <ManageCropTasksDialog 
        open={manageTasksDialogOpen} 
        onClose={() => setManageTasksDialogOpen(false)} 
        crop={selectedCropForTask} 
        tasks={tasks} 
        onTasksUpdate={fetchPageData} 
      />

      {/* Global style for Swal z-index */}
      <style>{` .swal-high-z-index { z-index: 9999 !important; } `}</style>
    </ThemeProvider>
  );
};

export default MyFarmPage;