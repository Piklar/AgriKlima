// src/pages/Admin/ManageTasks.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Paper, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import * as api from '../../services/api';
import AdminFormModal from '../../components/AdminFormModal';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentTask, setCurrentTask] = useState(null);

  // ✅ for responsiveness
  const isSmall = useMediaQuery('(max-width:600px)');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksResponse, usersResponse] = await Promise.all([
        api.getTasks(),
        api.getAllUsers()
      ]);

      const tasksData = tasksResponse.data || [];
      const gridTasks = tasksData.map(task => ({
        id: task._id,
        ...task,
        displayAssignedTo: task.assignedTo
          ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
          : 'Not Assigned'
      }));

      setTasks(gridTasks);
      setUsers(usersResponse.data?.users || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire('Error', 'Could not fetch tasks or users from the server.', 'error');
      setTasks([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormSubmit = async (formData) => {
    try {
      if (modalMode === 'add') {
        await api.addTask(formData);
      } else {
        await api.updateTask(currentTask.id, formData);
      }
      Swal.fire('Success', `Task ${modalMode === 'add' ? 'created' : 'updated'}!`, 'success');
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Form submission error:', error);
      Swal.fire('Error', 'Operation failed. Please check the console for details.', 'error');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.deleteTask(id);
          Swal.fire('Deleted!', 'The task has been deleted.', 'success');
          fetchData();
        } catch (error) {
          console.error('Delete error:', error);
          Swal.fire('Error!', 'Could not delete the task.', 'error');
        }
      }
    });
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setModalMode('edit');
    const preparedTask = {
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      assignedTo: task.assignedTo?._id || ''
    };
    setCurrentTask(preparedTask);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  const columns = [
    { field: 'title', headerName: 'Title', minWidth: 150, flex: 1 },
    { field: 'description', headerName: 'Description', minWidth: 200, flex: 1 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 150,
      valueGetter: (value, row) => row.dueDate ? new Date(row.dueDate).toLocaleDateString() : 'N/A'
    },
    { field: 'displayAssignedTo', headerName: 'Assigned To', minWidth: 150, flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => handleOpenEditModal(params.row)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const taskFields = [
    { name: 'title', label: 'Title', required: true, group: 'Task Details' },
    { name: 'description', label: 'Description', type: 'textarea', rows: 4, group: 'Task Details' },
    { name: 'status', label: 'Status', type: 'select', options: ['pending', 'completed'], defaultValue: 'pending', group: 'Task Details' },
    { name: 'dueDate', label: 'Due Date', type: 'date', group: 'Task Details' },
    {
      name: 'assignedTo',
      label: 'Assign To User',
      type: 'select',
      options: users.map(user => ({ label: `${user.firstName} ${user.lastName}`, value: user._id })),
      group: 'Task Details'
    },
    { name: 'frequency', label: 'Frequency', type: 'select', options: ['Once', 'Daily', 'Weekly', 'Monthly'], defaultValue: 'Once', group: 'Task Details' },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmall ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isSmall ? 'stretch' : 'center',
          mb: 2,
          gap: 2
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: isSmall ? 'center' : 'left' }}>
          Manage Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: 'var(--primary-green)',
            '&:hover': { bgcolor: 'var(--light-green)' },
            width: isSmall ? '100%' : 'auto'
          }}
          onClick={handleOpenAddModal}
        >
          Add New Task
        </Button>
      </Box>

      <Paper sx={{ height: '75vh', width: '100%' }}>
        <DataGrid
          rows={tasks}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          rowHeight={isSmall ? 60 : 70}
          autoHeight={false}
        />
      </Paper>

      <AdminFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={currentTask}
        mode={modalMode}
        title={modalMode === 'add' ? 'Add New Task' : 'Edit Task'}
        fields={taskFields}
      />
    </Box>
  );
};

export default ManageTasks;
