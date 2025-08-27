// src/pages/Admin/ManageTasks.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';

import * as api from '../../services/api';
import AdminFormModal from '../../components/AdminFormModal';

const ManageTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentTask, setCurrentTask] = useState(null);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.getTasks();
            console.log('Tasks API response:', response); // Debug log
            
            // Extract tasks data from response
            let tasksData = [];
            
            if (response && response.data && Array.isArray(response.data)) {
                tasksData = response.data;
            } else if (Array.isArray(response)) {
                tasksData = response;
            } else if (response && Array.isArray(response.tasks)) {
                tasksData = response.tasks;
            } else if (response && response.data && Array.isArray(response.data.tasks)) {
                tasksData = response.data.tasks;
            }
            
            console.log('Processed tasks data:', tasksData); // Debug log
            
            // Transform data for DataGrid - use direct field access
            const gridTasks = tasksData.map((task, index) => ({
                // Use id field that DataGrid expects
                id: task._id || task.id || `temp-id-${index}`,
                // Keep all original data
                ...task,
                // Ensure we have display-friendly fields
                displayTitle: task.title || 'Untitled Task',
                displayDescription: task.description ? (task.description.length > 50 ? `${task.description.substring(0, 50)}...` : task.description) : 'No description',
                displayStatus: task.status || 'pending',
                displayDueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date',
                displayAssignedTo: task.assignedTo ? 
                    (typeof task.assignedTo === 'object' ? 
                        (task.assignedTo.firstName && task.assignedTo.lastName ? 
                            `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : 
                            task.assignedTo.username || task.assignedTo.email || task.assignedTo._id || 'Unknown User') : 
                        `User ID: ${task.assignedTo}`) : 
                    'Not Assigned'
            }));
            
            setTasks(gridTasks);
            
            if (gridTasks.length === 0) {
                Swal.fire('Info', 'No tasks found.', 'info');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            Swal.fire('Error', 'Could not fetch tasks from the server.', 'error');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleFormSubmit = async (formData) => {
        try {
            let response;
            if (modalMode === 'add') {
                response = await api.addTask(formData);
            } else {
                response = await api.updateTask(currentTask._id, formData);
            }
            
            if (response && (response.status === 200 || response.status === 201)) {
                Swal.fire('Success', `Task ${modalMode === 'add' ? 'created' : 'updated'}!`, 'success');
                handleCloseModal();
                fetchTasks();
            } else {
                throw new Error('Operation failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            Swal.fire('Error', 'Operation failed. Please check the console for details.', 'error');
        }
    };

    const handleDelete = async (id) => {
        // Extract the actual _id from the grid id
        const actualId = tasks.find(task => task.id === id)?._id || id;
        
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
                    await api.deleteTask(actualId);
                    Swal.fire('Deleted!', 'The task has been deleted.', 'success');
                    fetchTasks();
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

    const handleOpenEditModal = (gridTask) => {
        setModalMode('edit');
        // Get the original task data (without display fields)
        const originalTask = {
            _id: gridTask._id,
            title: gridTask.title,
            description: gridTask.description,
            status: gridTask.status,
            dueDate: gridTask.dueDate,
            assignedTo: gridTask.assignedTo
        };
        
        const preparedTask = {
            ...originalTask,
            dueDate: originalTask.dueDate ? new Date(originalTask.dueDate).toISOString().split('T')[0] : '',
            assignedTo: originalTask.assignedTo ? 
                (typeof originalTask.assignedTo === 'object' ? 
                    originalTask.assignedTo._id || originalTask.assignedTo.id : 
                    originalTask.assignedTo) 
                : ''
        };
        
        setCurrentTask(preparedTask);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentTask(null);
    };

    const columns = [
        { 
            field: 'displayTitle', 
            headerName: 'Title', 
            width: 250,
        },
        { 
            field: 'displayDescription', 
            headerName: 'Description', 
            width: 200,
        },
        { 
            field: 'displayStatus', 
            headerName: 'Status', 
            width: 120,
            renderCell: (params) => (
                <span style={{ 
                    color: params.value === 'completed' ? 'green' : 'orange',
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                }}>
                    {params.value}
                </span>
            )
        },
        { 
            field: 'displayDueDate', 
            headerName: 'Due Date', 
            width: 150,
        },
        { 
            field: 'displayAssignedTo', 
            headerName: 'Assigned To', 
            width: 220,
        },
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
                        onClick={() => handleOpenEditModal(params.row)}
                        sx={{ mr: 1 }}
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
        { name: 'title', label: 'Title', required: true },
        { name: 'description', label: 'Description', multiline: true, rows: 3 },
        { 
            name: 'status', 
            label: 'Status', 
            type: 'select', 
            options: ['pending', 'completed'], 
            defaultValue: 'pending' 
        },
        { 
            name: 'dueDate', 
            label: 'Due Date', 
            type: 'date'
        },
        { 
            name: 'assignedTo', 
            label: 'Assigned To (User ID)', 
            required: false,
            helperText: 'Enter the user ID or leave empty if not assigned'
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Manage Tasks
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    sx={{ 
                        bgcolor: 'primary.main',
                        '&:hover': { bgcolor: 'primary.dark' }
                    }} 
                    onClick={handleOpenAddModal}
                >
                    Add New Task
                </Button>
            </Box>

            <Paper sx={{ height: '70vh', width: '100%', p: 2 }}>
                <DataGrid 
                    rows={tasks} 
                    columns={columns} 
                    loading={loading} 
                    getRowId={(row) => row.id}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    disableSelectionOnClick
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