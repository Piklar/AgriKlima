// src/components/AddTaskOverlay.jsx

import React, { useState } from 'react';
import { 
    Modal, Box, Paper, Typography, Grid, TextField, Button, 
    IconButton, Divider, FormControlLabel, Switch, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const AddTaskOverlay = ({ open, onClose, onAddTask }) => {
    // State for the form inputs
    const [taskText, setTaskText] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [isRepeating, setIsRepeating] = useState(false);
    const [repeatFrequency, setRepeatFrequency] = useState(''); // <-- new state
    const [specificDay, setSpecificDay] = useState(''); // <-- for specific day option

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!taskText) return; // Simple validation

        const newTask = {
            id: Date.now(), // Simple unique ID for mock purposes
            text: taskText,
            date: dueDate,
            time: dueTime,
            repeating: isRepeating,
            frequency: isRepeating ? repeatFrequency : null,
            specificDay: repeatFrequency === 'specific' ? specificDay : null,
            completed: false,
        };
        
        onAddTask(newTask);
        handleClose(); // Close and reset form
    };

    const handleClose = () => {
        // Reset form state on close
        setTaskText('');
        setDueDate('');
        setDueTime('');
        setIsRepeating(false);
        setRepeatFrequency('');
        setSpecificDay('');
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ width: '90%', maxWidth: '500px', borderRadius: '24px' }}>
                <Box component="form" onSubmit={handleSubmit}>
                    {/* --- Header --- */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f5f5f5' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TaskAltIcon color="primary" />
                            Add a New Task
                        </Typography>
                        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                    </Box>
                    <Divider />

                    {/* --- Form Content --- */}
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    autoFocus
                                    required
                                    label="Task"
                                    placeholder="e.g., Check moisture levels in Section B"
                                    value={taskText}
                                    onChange={(e) => setTaskText(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Due Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                 <TextField
                                    fullWidth
                                    label="Due Time"
                                    type="time"
                                    InputLabelProps={{ shrink: true }}
                                    value={dueTime}
                                    onChange={(e) => setDueTime(e.target.value)}
                                />
                            </Grid>
                             <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isRepeating}
                                            onChange={(e) => setIsRepeating(e.target.checked)}
                                            name="repeating"
                                            color="primary"
                                        />
                                    }
                                    label="Make this a repeating task"
                                />
                            </Grid>

                            {/* --- Frequency Dropdown (only show if repeating is ON) --- */}
                            {isRepeating && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Repeat Frequency</InputLabel>
                                        <Select
                                            value={repeatFrequency}
                                            label="Repeat Frequency"
                                            onChange={(e) => setRepeatFrequency(e.target.value)}
                                        >
                                            <MenuItem value="daily">Every Day</MenuItem>
                                            <MenuItem value="otherday">Every Other Day</MenuItem>
                                            <MenuItem value="weekly">Every Week</MenuItem>
                                            <MenuItem value="monthly">Every Month</MenuItem>
                                            <MenuItem value="specific">Specific Day</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            {/* --- Specific Day Input (only if user selects "Specific Day") --- */}
                            {isRepeating && repeatFrequency === 'specific' && (
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Enter Specific Day (e.g., Monday or 15th)"
                                        placeholder="e.g., Monday or 15"
                                        value={specificDay}
                                        onChange={(e) => setSpecificDay(e.target.value)}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                    <Divider />

                    {/* --- Footer/Actions --- */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, gap: 1 }}>
                        <Button onClick={handleClose} color="secondary">Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--primary-green)', '&:hover': { bgcolor: 'var(--light-green)' } }}>
                            Add Task
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    );
};

export default AddTaskOverlay;
