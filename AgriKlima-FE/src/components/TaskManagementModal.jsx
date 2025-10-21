// src/components/TaskManagementModal.jsx

import React, { useState, useEffect } from 'react';
import { 
  Modal, Box, Paper, Typography, TextField, Button, Stack, 
  CircularProgress, IconButton, Divider, Select, MenuItem, 
  InputLabel, FormControl, List, ListItem, ListItemText, 
  ListItemButton, Checkbox, FormControlLabel, Chip 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, isSameDay } from 'date-fns';
import * as api from '../services/api';
import Swal from 'sweetalert2';

const TaskForm = ({ task, onSave, onCancel, isNew }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [frequency, setFrequency] = useState(task?.frequency || 'Once');
  const [applyToSeries, setApplyToSeries] = useState(false);

  const handleSave = () => {
    onSave({ ...task, title, description, dueDate, frequency, applyToSeries });
  };

  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {isNew ? 'Create New Task' : 'Edit Task'}
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          required
        />
        <FormControl fullWidth>
          <InputLabel>Frequency</InputLabel>
          <Select value={frequency} onChange={(e) => setFrequency(e.target.value)} label="Frequency">
            <MenuItem value="Once">Once</MenuItem>
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        {!isNew && task.recurrenceId && (
          <FormControlLabel
            control={<Checkbox checked={applyToSeries} onChange={(e) => setApplyToSeries(e.target.checked)} />}
            label="Apply changes to all future recurring tasks"
          />
        )}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Save</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

const TaskManagementModal = ({ open, onClose, selectedDate, tasks, onTasksUpdate }) => {
  const [view, setView] = useState('list');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setView('list');
      setSelectedTask(null);
    }
  }, [open]);

  const handleSaveTask = async (taskData) => {
    setIsLoading(true);
    try {
      if (taskData._id) {
        await api.updateTask(taskData._id, {
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate,
          frequency: taskData.frequency,
          applyToSeries: taskData.applyToSeries
        });
      } else {
        await api.addTask(taskData);
      }
      Swal.fire({ icon: 'success', title: 'Task saved!', showConfirmButton: false, timer: 1500 });
      onTasksUpdate();
      setView('list');
    } catch (error) {
      Swal.fire('Error', 'Failed to save task.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (taskId) => {
    try {
      await api.toggleTaskStatus(taskId);
      onTasksUpdate();
    } catch (error) {
      Swal.fire('Error', 'Could not update task status.', 'error');
    }
  };

  const handleDeleteTask = async (task) => {
    const hasRecurrence = task.recurrenceId;
    let deleteOptions = {
      title: 'Delete this task?',
      text: `"${task.title}" will be permanently deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      customClass: { container: 'swal-high-z-index' },
      backdrop: true
    };

    if (hasRecurrence) {
      deleteOptions = {
        ...deleteOptions,
        title: 'Delete recurring task',
        text: `"${task.title}" is a recurring task. What would you like to delete?`,
        showDenyButton: true,
        confirmButtonText: 'Delete all future occurrences',
        denyButtonText: 'Delete only this one',
        denyButtonColor: '#ff9800',
      };
    }

    Swal.fire(deleteOptions).then(async (result) => {
      if (result.isConfirmed || result.isDenied) {
        setIsLoading(true);
        try {
          const deleteAll = hasRecurrence && result.isConfirmed;
          await api.deleteTask(task._id, deleteAll);
          Swal.fire({
            title: 'Deleted!',
            text: deleteAll ? 'All future recurring tasks have been deleted.' : 'The task has been deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { container: 'swal-high-z-index' }
          });
          onTasksUpdate();
        } catch (error) {
          Swal.fire({
            title: 'Error', text: 'Could not delete the task.', icon: 'error',
            customClass: { container: 'swal-high-z-index' }
          });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const tasksForDay = tasks.filter(t => isSameDay(new Date(t.dueDate), selectedDate));
  const uniqueTasksForDay = [];
  const seenRecurrenceIds = new Set();
  
  tasksForDay.forEach(task => {
    if (task.recurrenceId) {
      if (!seenRecurrenceIds.has(task.recurrenceId.toString())) {
        uniqueTasksForDay.push(task);
        seenRecurrenceIds.add(task.recurrenceId.toString());
      }
    } else {
      uniqueTasksForDay.push(task);
    }
  });

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Paper
          sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500 }, maxHeight: '80vh',
            overflow: 'auto', p: 3, borderRadius: 2, zIndex: 1300
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            </Typography>
            <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
          </Box>

          {isLoading && <CircularProgress />}

          {view === 'list' && !isLoading && (
            <>
              <List>
                {uniqueTasksForDay.length > 0 ? uniqueTasksForDay.map(task => (
                  <ListItem
                    key={task._id}
                    disablePadding
                    sx={{
                      borderLeft: task.cropId ? `4px solid ${task.color}` : 'none',
                      pl: task.cropId ? 1 : 0, mb: 1,
                      backgroundColor: task.cropId ? `${task.color}08` : 'transparent',
                      borderRadius: 1
                    }}
                  >
                    <Checkbox
                      edge="start"
                      checked={task.status === 'completed'}
                      onChange={() => handleToggleStatus(task._id)}
                    />
                    <ListItemButton onClick={() => { setSelectedTask(task); setView('form'); }} sx={{ flex: 1 }}>
                      <ListItemText
                        primary={
                          <Box>
                            {task.title}
                            {task.status === 'completed' && (<Chip label="Completed" size="small" color="success" sx={{ ml: 1 }} />)}
                            {task.cropId && (<Chip label={`🌱 ${task.cropId.name}`} size="small" sx={{ ml: 1, backgroundColor: task.color, color: 'white' }} />)}
                            {task.recurrenceId && (<Chip label={`🔁 ${task.frequency}`} size="small" sx={{ ml: 1 }} variant="outlined" />)}
                          </Box>
                        }
                        secondary={task.description}
                      />
                    </ListItemButton>
                    <IconButton edge="end" onClick={() => handleDeleteTask(task)}><DeleteIcon /></IconButton>
                  </ListItem>
                )) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    No tasks for this day.
                  </Typography>
                )}
              </List>

              <Divider sx={{ my: 2 }} />
              
              <Button variant="contained" startIcon={<AddIcon />} fullWidth onClick={() => { setSelectedTask(null); setView('form'); }}>
                Add New Task
              </Button>
            </>
          )}

          {view === 'form' && !isLoading && (
            <TaskForm
              task={selectedTask}
              onSave={handleSaveTask}
              onCancel={() => setView('list')}
              isNew={!selectedTask}
            />
          )}
        </Paper>
      </Modal>

      {/* --- THIS IS THE FIX --- */}
      {/* Replace the <style jsx global> tag with a standard <style> tag */}
      <style>
        {`
          .swal-high-z-index {
            z-index: 9999 !important;
          }
        `}
      </style>
    </>
  );
};

export default TaskManagementModal;