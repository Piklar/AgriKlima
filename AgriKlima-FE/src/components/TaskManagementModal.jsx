// src/components/TaskManagementModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Box, Paper, Typography, TextField, Button, Stack, CircularProgress, IconButton, Divider, Select, MenuItem, InputLabel, FormControl, List, ListItem, ListItemText, ListItemButton, Checkbox, FormControlLabel, Chip } from '@mui/material'; // Import Chip
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, isSameDay } from 'date-fns';
import * as api from '../services/api';
import Swal from 'sweetalert2';

const TaskForm = ({ task, onSave, onCancel, isNew }) => {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [dueDate, setDueDate] = useState(task?.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
    const [frequency, setFrequency] = useState(task?.frequency || 'Once');
    const [applyToSeries, setApplyToSeries] = useState(false);

    const handleSave = () => {
        onSave({ ...task, title, description, dueDate, frequency, applyToSeries });
    };

    return (
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }} sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {isNew ? 'Create New Task' : 'Edit Task'}
            </Typography>
            <Stack spacing={2}>
                <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required />
                <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} />
                <TextField label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} required />
                <FormControl fullWidth disabled={!isNew}>
                    <InputLabel>Frequency</InputLabel>
                    <Select value={frequency} label="Frequency" onChange={(e) => setFrequency(e.target.value)}>
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
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                    <Button type="button" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={!title}>Save</Button>
                </Box>
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
                await api.updateTask(taskData._id, { title: taskData.title, description: taskData.description, dueDate: taskData.dueDate });
            } else {
                await api.addTask(taskData);
            }
            Swal.fire({ icon: 'success', title: 'Task saved!', showConfirmButton: false, timer: 1500 });
            onTasksUpdate();
            setView('list');
        } catch (error) {
            Swal.fire('Error', 'Failed to save task.', 'error');
            console.error("Failed to save task", error);
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
            console.error(error);
        }
    };
    
    const handleDeleteTask = async (task) => {
        Swal.fire({
            title: `Delete this task?`,
            text: `"${task.title}" will be permanently deleted.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                try {
                    await api.deleteTask(task._id);
                    Swal.fire('Deleted!', 'The task has been deleted.', 'success');
                    onTasksUpdate();
                } catch (error) {
                    Swal.fire('Error', 'Could not delete the task.', 'error');
                    console.error("Failed to delete task", error);
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    const tasksForDay = tasks.filter(t => isSameDay(new Date(t.dueDate), selectedDate));

    return (
        <Modal open={open} onClose={onClose}>
            <Paper sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '90%', maxWidth: 500, p: 3, borderRadius: '16px',
                maxHeight: '90vh', display: 'flex', flexDirection: 'column'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Tasks for {format(selectedDate, 'MMMM d, yyyy')}
                    </Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>

                {isLoading && <CircularProgress sx={{ mx: 'auto', my: 2 }} />}

                {view === 'list' && !isLoading && (
                    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        <List>
                            {tasksForDay.length > 0 ? tasksForDay.map(task => (
                                <ListItem 
                                    key={task._id} 
                                    secondaryAction={
                                        <Checkbox
                                            edge="end"
                                            checked={task.status === 'completed'}
                                            onChange={() => handleToggleStatus(task._id)}
                                        />
                                    }
                                    disablePadding
                                >
                                    <ListItemButton onClick={() => { setSelectedTask(task); setView('form'); }}>
                                        <ListItemText 
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography sx={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? 'text.disabled' : 'text.primary' }}>
                                                        {task.title}
                                                    </Typography>
                                                    {task.status === 'completed' && (
                                                        <Chip label="Done" color="success" size="small" sx={{ ml: 2 }} />
                                                    )}
                                                </Box>
                                            }
                                            secondary={task.description}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            )) : (
                                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 2, p: 2 }}>
                                    No tasks for this day.
                                </Typography>
                            )}
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={() => { setSelectedTask(null); setView('form'); }}>
                            Add New Task
                        </Button>
                    </Box>
                )}
                {view === 'form' && !isLoading && (
                    <TaskForm
                        isNew={!selectedTask}
                        task={selectedTask || { dueDate: selectedDate }}
                        onSave={handleSaveTask}
                        onCancel={() => setView('list')}
                    />
                )}
            </Paper>
        </Modal>
    );
};

export default TaskManagementModal;