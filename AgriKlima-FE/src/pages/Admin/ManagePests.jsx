// src/pages/Admin/ManagePests.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';

import * as api from '../../services/api';
import AdminFormModal from '../../components/AdminFormModal';

const ManagePests = () => {
    const [pests, setPests] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentPest, setCurrentPest] = useState(null); // Holds data for editing

    const fetchPests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.getPests();
            setPests(response.data);
        } catch (error) {
            console.error("Failed to fetch pests:", error);
            Swal.fire('Error', 'Could not fetch pests from the server.', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPests();
    }, [fetchPests]);

    const handleOpenAddModal = () => {
        setModalMode('add');
        setCurrentPest(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (pest) => {
        setModalMode('edit');
        setCurrentPest(pest);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPest(null);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (modalMode === 'add') {
                await api.addPest(formData);
                Swal.fire('Success', 'Pest created successfully!', 'success');
            } else {
                await api.updatePest(currentPest._id, formData);
                Swal.fire('Success', 'Pest updated successfully!', 'success');
            }
            handleCloseModal();
            fetchPests(); // Refresh the data grid
        } catch (error) {
            Swal.fire('Error', `Failed to save the pest: ${error.response?.data?.error || ''}`, 'error');
        }
    };

    const handleDelete = (id) => {
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
                    await api.deletePest(id);
                    Swal.fire('Deleted!', 'The pest has been deleted.', 'success');
                    fetchPests(); // Refresh the data grid
                } catch (error) {
                    Swal.fire('Error', `Failed to delete the pest: ${error.response?.data?.error || ''}`, 'error');
                }
            }
        });
    };

    // Define fields for the reusable form modal
    const pestFields = [
        { name: 'name', label: 'Pest Name', required: true },
        { name: 'imageUrl', label: 'Image URL', required: true },
        { name: 'type', label: 'Type', required: true, type: 'select', options: ['Insect Pest', 'Disease', 'Weed'] },
        { name: 'riskLevel', label: 'Risk Level', required: true, type: 'select', options: ['Low', 'Medium', 'High'] },
        // For nested fields, you would typically use dot notation in a more advanced form
        // For simplicity here, we'll stick to top-level fields
    ];

    // Define columns for the DataGrid
    const columns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'name', headerName: 'Pest Name', width: 200 },
        { field: 'type', headerName: 'Type', width: 150 },
        { field: 'riskLevel', headerName: 'Risk Level', width: 150 },
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
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Manage Pests</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: 'var(--primary-green)' }} onClick={handleOpenAddModal}>
                    Add New Pest
                </Button>
            </Box>
            <Paper sx={{ height: '70vh', width: '100%' }}>
                <DataGrid
                    rows={pests}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row._id}
                />
            </Paper>
            <AdminFormModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                initialData={currentPest}
                mode={modalMode}
                title={modalMode === 'add' ? 'Add New Pest' : 'Edit Pest'}
                fields={pestFields}
            />
        </Box>
    );
};

export default ManagePests;