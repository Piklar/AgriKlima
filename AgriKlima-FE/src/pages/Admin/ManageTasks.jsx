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
            setTasks(response.data);
        } catch (error) {
            Swal.fire('Error', 'Could not fetch tasks from the server.', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleFormSubmit = async (formData) => {
        try {
            if (modalMode === 'add') {
                await api.addTask(formData);
            } else {
                await api.updateTask(currentTask._id, formData);
            }
            Swal.fire('Success', `Task ${modalMode === 'add' ? 'created' : 'updated'}!`, 'success');
            handleCloseModal();
            fetchTasks();
        } catch (error) {
            Swal.fire('Error', 'Operation failed.', 'error');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await api.deleteTask(id);
                Swal.fire('Deleted!', 'The task has been deleted.', 'success');
                fetchTasks();
            }
        });
    };
    
    // ... (handleOpenAddModal, handleOpenEditModal, handleCloseModal are identical to ManagePests)
    const handleOpenAddModal = () => { /*...*/ };
    const handleOpenEditModal = (task) => { /*...*/ };
    const handleCloseModal = () => { /*...*/ };

    const taskFields = [
        { name: 'title', label: 'Title', required: true },
        { name: 'description', label: 'Description', multiline: true, rows: 3 },
        { name: 'status', label: 'Status', type: 'select', options: ['pending', 'completed'], defaultValue: 'pending' },
        { name: 'dueDate', label: 'Due Date', type: 'date' },
        { name: 'assignedTo', label: 'Assigned To (User ID)', required: false }, // Simple text field for admin
    ];

    const columns = [
        { field: 'title', headerName: 'Title', width: 250 },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'dueDate', headerName: 'Due Date', width: 150, valueGetter: (params) => params.row.dueDate ? new Date(params.row.dueDate).toLocaleDateString() : 'N/A' },
        { field: 'assignedTo', headerName: 'Assigned To', width: 220, valueGetter: (params) => params.row.assignedTo?._id || 'N/A' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Button size="small" onClick={() => handleOpenEditModal(params.row)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(params.row._id)}>Delete</Button>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Manage Tasks</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: 'var(--primary-green)' }} onClick={handleOpenAddModal}>
                    Add New Task
                </Button>
            </Box>
            <Paper sx={{ height: '70vh', width: '100%' }}>
                <DataGrid rows={tasks} columns={columns} loading={loading} getRowId={(row) => row._id} />
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