// src/pages/Admin/ManageCrops.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';

import * as api from '../../services/api';
import AdminFormModal from '../../components/AdminFormModal';
import { useAuth } from '../../context/AuthContext';

const ManageCrops = () => {
  const { token } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentCrop, setCurrentCrop] = useState(null);

  // Fetch crops
  const fetchCrops = useCallback(async () => {
    setLoading(true);
    try {
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

  // Modal handlers
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

  // Form submission
  const handleFormSubmit = async (formData) => {
    if (!token) {
      Swal.fire('Error', 'You must be logged in to perform this action.', 'error');
      return;
    }
    try {
      if (modalMode === 'add') {
        await api.addCrop(formData, token);
        Swal.fire('Success', 'Crop created successfully!', 'success');
      } else {
        await api.updateCrop(currentCrop._id, formData, token);
        Swal.fire('Success', 'Crop updated successfully!', 'success');
      }
      handleCloseModal();
      fetchCrops();
    } catch (error) {
      console.error("Failed to save crop:", error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      Swal.fire('Error', `Failed to save the crop: ${errorMessage}`, 'error');
    }
  };

  // Delete
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
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.deleteCrop(id);
          Swal.fire('Deleted!', 'The crop has been deleted.', 'success');
          fetchCrops();
        } catch (error) {
          console.error("Failed to delete crop:", error.response?.data?.error || error);
          Swal.fire('Error', `Failed to delete the crop: ${error.response?.data?.error || ''}`, 'error');
        }
      }
    });
  };

  // --- Field definitions with 'group' property ---
  const cropFields = [
    // Group 1: Basic Information
    { name: 'name', label: 'Crop Name', required: true, group: 'Basic Information' },
    { name: 'description', label: 'Main Description', required: true, type: 'textarea', rows: 4, group: 'Basic Information' },
    { name: 'imageUrl', label: 'Image URL', required: true, group: 'Basic Information' },
    { name: 'season', label: 'Season', type: 'select', options: ['All Year', 'Dry Season', 'Wet Season'], defaultValue: 'All Year', group: 'Basic Information' },
    { name: 'overview.plantingSeason', label: 'Planting Season', group: 'Basic Information' },
    { name: 'overview.harvestTime', label: 'Harvest Time', group: 'Basic Information' },

    // Group 2: Growing Guide
    { name: 'growingGuide.climate', label: 'Climate', group: 'Growing Guide' },
    { name: 'growingGuide.soilType', label: 'Soil Type', group: 'Growing Guide' },
    { name: 'growingGuide.waterNeeds', label: 'Water Needs', group: 'Growing Guide' },
    { name: 'growingGuide.fertilizer', label: 'Fertilizer', group: 'Growing Guide' },
    { name: 'marketInfo.priceRange', label: 'Price Range (e.g., ₱50-₱60/kg)', group: 'Growing Guide' },
    { name: 'marketInfo.storageMethod', label: 'Storage Method', group: 'Growing Guide' },

    // Group 3: Health & Market
    { name: 'healthCare.commonDiseases', label: 'Common Diseases (one per line)', type: 'textarea', isArray: true, rows: 4, group: 'Health & Market' },
    { name: 'healthCare.pestControl', label: 'Pest Control (one per line)', type: 'textarea', isArray: true, rows: 4, group: 'Health & Market' },
    { name: 'healthCare.nutritionalValue', label: 'Nutritional Value (one per line)', type: 'textarea', isArray: true, rows: 4, group: 'Health & Market' },
    { name: 'marketInfo.cookingTips', label: 'Cooking Tips (one per line)', type: 'textarea', isArray: true, rows: 4, group: 'Health & Market' },
  ];

  // DataGrid columns
  const columns = [
    { field: 'name', headerName: 'Crop Name', width: 200 },
    { field: 'season', headerName: 'Season', width: 150 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleOpenEditModal(params.row)}>Edit</Button>
          <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(params.row._id)}>Delete</Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Manage Crops</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: 'var(--primary-green)', '&:hover': { bgcolor: 'var(--light-green)'} }}
          onClick={handleOpenAddModal}
        >
          Add New Crop
        </Button>
      </Box>
      <Paper sx={{ height: '75vh', width: '100%' }}>
        <DataGrid
          rows={crops}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id}
        />
      </Paper>
      <AdminFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={currentCrop}
        mode={modalMode}
        // --- THIS IS THE FIX: Changed `mode` to `modalMode` ---
        title={modalMode === 'add' ? 'Add New Crop' : 'Edit Crop'}
        fields={cropFields}
      />
    </Box>
  );
};

export default ManageCrops;