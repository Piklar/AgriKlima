import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Skeleton,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { isToday } from 'date-fns';
import TaskIcon from '@mui/icons-material/Task';

const TodayTasksCard = ({ tasks, loading, onTaskToggle, onManageTasks }) => {
  const todayTasks = tasks.filter((task) => isToday(new Date(task.dueDate)));
  const pendingTasksCount = todayTasks.filter((t) => t.status !== 'completed').length;

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: (theme) => theme.palette.background.paper,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 28px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TaskIcon sx={{ mr: 1.5, fontSize: '2rem', color: (theme) => theme.palette.primary.main }} />
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            flexGrow: 1,
            color: (theme) => theme.palette.primary.main,
          }}
        >
          Today’s Tasks
        </Typography>
        {pendingTasksCount > 0 && (
          <Chip
            label={`${pendingTasksCount} pending`}
            color="primary"
            size="small"
            sx={{ fontFamily: 'Inter, sans-serif' }}
          />
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="text" height={40} sx={{ mb: 1, borderRadius: '10px' }} />
          ))
        ) : todayTasks.length > 0 ? (
          <List dense>
            {todayTasks.map((task) => (
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
                // --- THIS IS THE FIX ---
                sx={{
                  mb: 1,
                  p: 1,
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease, opacity 0.3s ease',
                  backgroundColor: task.status === 'completed' ? 'action.hover' : 'transparent',
                  opacity: task.status === 'completed' ? 0.6 : 1,
                }}
              >
                <ListItemText
                  primary={task.title}
                  sx={{
                    transition: 'color 0.3s ease',
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    color: task.status === 'completed' ? 'text.disabled' : 'text.primary',
                  }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              textAlign: 'center', py: 6, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <TaskIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary" sx={{ fontFamily: 'Inter, sans-serif' }}>
              No tasks scheduled for today.
            </Typography>
          </Box>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={onManageTasks}
        sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
      >
        Manage All Tasks
      </Button>
    </Paper>
  );
};

export default TodayTasksCard;