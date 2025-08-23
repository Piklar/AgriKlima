// src/pages/Admin/ManagePests.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';

import * as api from '../../services/api';
import AdminFormModal from '../../components/AdminFormModal';
import { useAuth } from '../../context/AuthContext'; // Import auth context

const ManagePests = () => {
    const { token } = useAuth(); // 🔑 Get auth token
    const [pests, setPests] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentPest, setCurrentPest] = useState(null);

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
        console.log("Pest form submitted with data:", formData);
        
        if (!token) {
            Swal.fire('Error', 'You must be logged in to perform this action.', 'error');
            return;
        }
        
        try {
            if (modalMode === 'add') {
                console.log("Adding pest...");
                await api.addPest(formData, token);
                Swal.fire('Success', 'Pest created successfully!', 'success');
            } else {
                console.log("Updating pest:", currentPest._id);
                await api.updatePest(currentPest._id, formData, token);
                Swal.fire('Success', 'Pest updated successfully!', 'success');
            }
            handleCloseModal();
            fetchPests();
        } catch (error) {
            console.error("Failed to save pest:", error);
            const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
            Swal.fire('Error', `Failed to save the pest: ${errorMessage}`, 'error');
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
                    await api.deletePest(id, token);
                    Swal.fire('Deleted!', 'The pest has been deleted.', 'success');
                    fetchPests();
                } catch (error) {
                    console.error("Failed to delete pest:", error);
                    const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
                    Swal.fire('Error', `Failed to delete the pest: ${errorMessage}`, 'error');
                }
            }
        });
    };

    // --- FIXED pestFields ---
    const pestFields = [
        { name: 'name', label: 'Pest Name', required: true },
        { name: 'imageUrl', label: 'Image URL', required: true },
        { name: 'type', label: 'Type', type: 'select', options: ['Insect Pest', 'Disease', 'Weed'], required: true },
        { name: 'riskLevel', label: 'Risk Level', type: 'select', options: ['Low', 'Medium', 'High'], required: true },
        
        // Overview - FIXED: use type instead of multiline
        { name: 'overview.description', label: 'Description (Overview)', type: 'textarea', rows: 3 },
        { name: 'overview.commonlyAffects', label: 'Commonly Affects (comma-separated)', type: 'textarea', isArray: true, rows: 2 },
        { name: 'overview.seasonalActivity', label: 'Seasonal Activity (Overview)' },
        
        // Identification
        { name: 'identification.size', label: 'Size (ID)', halfWidth: true },
        { name: 'identification.color', label: 'Color (ID)', halfWidth: true },
        { name: 'identification.shape', label: 'Shape (ID)', halfWidth: true },
        { name: 'identification.behavior', label: 'Behavior (ID)', halfWidth: true },
        
        // Prevention & Treatment - FIXED: use type instead of multiline
        { name: 'prevention', label: 'Prevention Methods (one per line)', type: 'textarea', isArray: true, rows: 4 },
        { name: 'treatment', label: 'Treatment Methods (one per line)', type: 'textarea', isArray: true, rows: 4 },
    ];

    // FIXED: Define columns for the DataGrid - use 'field' instead of 'name'
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