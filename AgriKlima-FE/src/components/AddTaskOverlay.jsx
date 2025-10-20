import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';

const AddTaskOverlay = ({ open, onClose, onAddTask }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  // The state will now hold a datetime string, e.g., "2025-08-31T14:30"
  const [dueDate, setDueDate] = useState(''); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert('Please provide a title, a due date, and a time.');
      return;
    }

    const newTask = {
      title,
      dueDate, // Send the combined datetime string
      assignedTo: user._id,
    };

    onAddTask(newTask);
    
    // Reset form and close
    setTitle('');
    setDueDate('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }}>
          Add a New Task
          <IconButton
            onClick={onClose}
            aria-label="Close"
            disableRipple
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 10,
              backgroundColor: 'transparent',
              padding: 0,
              borderRadius: 0,
              color: 'rgba(0,0,0,0.6)',
              '&:hover': { backgroundColor: 'transparent' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              autoFocus
              label="Task Title"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {/* --- THIS IS THE MODIFIED INPUT --- */}
            <TextField
              label="Due Date and Time"
              type="datetime-local" // Changed from "date"
              fullWidth
              variant="outlined"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#2e7d32' }}>
            Add Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTaskOverlay;