// src/pages/Admin/ManageCrops.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';

// --- UPDATED: Import all functions from your api.js file ---
import * as api from '../../services/api'; 
import CropFormModal from '../../components/CropFormModal';
import { useAuth } from '../../context/AuthContext'; // We need this to get the token

const ManageCrops = () => {
    const { token } = useAuth(); // <-- Get the auth token from your context
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentCrop, setCurrentCrop] = useState(null);

    const fetchCrops = useCallback(async () => {
        setLoading(true);
        try {
            // --- UPDATED: Use your axios function. Data is in `response.data` ---
            const response = await api.getCrops();
            setCrops(response.data); 
        } catch (error) {
            console.error("Failed to fetch crops:", error);
            Swal.fire('Error', 'Could not fetch crops from the server.', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCrops();
    }, [fetchCrops]);

    const handleOpenAddModal = () => {
        setModalMode('add');
        setCurrentCrop(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (crop) => {
        setModalMode('edit');
        setCurrentCrop(crop);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCrop(null);
    };

    const handleFormSubmit = async (formData) => {
        if (!token) {
            Swal.fire('Error', 'You must be logged in to perform this action.', 'error');
            return;
        }
        try {
            if (modalMode === 'add') {
                // --- UPDATED: Pass the token as the first argument ---
                await api.addCrop(token, formData);
                Swal.fire('Success', 'Crop created successfully!', 'success');
            } else {
                // --- UPDATED: Pass the token as the first argument ---
                await api.updateCrop(token, currentCrop._id, formData);
                Swal.fire('Success', 'Crop updated successfully!', 'success');
            }
            handleCloseModal();
            fetchCrops(); // Refresh the data grid
        } catch (error) {
            console.error("Failed to save crop:", error.response?.data?.error || 'An unexpected error occurred.');
            Swal.fire('Error', `Failed to save the crop: ${error.response?.data?.error || ''}`, 'error');
        }
    };

    const handleDelete = (id) => {
        if (!token) {
            Swal.fire('Error', 'You must be logged in to perform this action.', 'error');
            return;
        }
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
                    // --- UPDATED: Pass the token as the first argument ---
                    await api.deleteCrop(token, id);
                    Swal.fire('Deleted!', 'The crop has been deleted.', 'success');
                    fetchCrops(); // Refresh the data grid
                } catch (error) {
                    console.error("Failed to delete crop:", error.response?.data?.error || 'An unexpected error occurred.');
                    Swal.fire('Error', `Failed to delete the crop: ${error.response?.data?.error || ''}`, 'error');
                }
            }
        });
    };

    const columns = [
        { field: '_id', headerName: 'ID', width: 220 },
        { field: 'name', headerName: 'Crop Name', width: 200 },
        { field: 'season', headerName: 'Season', width: 150 },
        { field: 'description', headerName: 'Description', width: 300 },
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
            {/* The UI part remains mostly the same */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Manage Crops</Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: 'var(--primary-green)' }} onClick={handleOpenAddModal}>
                    Add New Crop
                </Button>
            </Box>
            <Paper sx={{ height: '70vh', width: '100%' }}>
                <DataGrid
                    rows={crops}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row._id}
                />
            </Paper>
            <CropFormModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                initialData={currentCrop}
                mode={modalMode}
            />
        </Box>
    );
};

export default ManageCrops;