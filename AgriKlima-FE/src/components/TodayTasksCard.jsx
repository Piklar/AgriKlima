// src/components/TodayTasksCard.jsx

import React from 'react';
import { Box, Typography, Paper, Button, Skeleton, List, ListItem, Checkbox, ListItemText, Divider, Chip } from '@mui/material';
import { isToday } from 'date-fns';
import TaskIcon from '@mui/icons-material/Task';

const TodayTasksCard = ({ tasks, loading, onTaskToggle, onManageTasks }) => {
  const todayTasks = tasks.filter(task => isToday(new Date(task.dueDate)));
  const pendingTasksCount = todayTasks.filter(t => t.status !== 'completed').length;

  return (
    <Paper sx={{ p: 3, borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TaskIcon color="primary" sx={{ mr: 1.5, fontSize: '2rem' }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold', flexGrow: 1 }}>Today's Tasks</Typography>
        {pendingTasksCount > 0 && <Chip label={`${pendingTasksCount} pending`} color="primary" size="small" />}
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
        {loading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} variant="text" height={40} sx={{ mb: 1 }} />)
        ) : todayTasks.length > 0 ? (
          <List dense>
            {todayTasks.map(task => (
              <ListItem
                key={task._id}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    checked={task.status === 'completed'}
                    onChange={() => onTaskToggle(task._id)}
                  />
                }
                disablePadding
              >
                <ListItemText
                  primary={task.title}
                  sx={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? 'text.disabled' : 'text.primary' }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <TaskIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">No tasks scheduled for today.</Typography>
          </Box>
        )}
      </Box>
      <Button 
        variant="contained"
        onClick={onManageTasks}
        sx={{ mt: 2, bgcolor: 'var(--primary-green)', '&:hover': { bgcolor: 'var(--light-green)' } }}
      >
        Manage All Tasks
      </Button>
    </Paper>
  );
};

export default TodayTasksCard;