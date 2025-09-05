// src/pages/Admin/ManageCrops.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Paper, Avatar } from '@mui/material';
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

  const handleFormSubmit = async (formData, imageFile) => {
    if (!token) {
      Swal.fire('Error', 'You must be logged in to perform this action.', 'error');
      return;
    }
    try {
      let savedItem;
      if (modalMode === 'add') {
        const response = await api.addCrop(formData, token);
        savedItem = response.data;
        if (imageFile) Swal.fire({ title: 'Step 1/2 Complete', text: 'Crop details saved. Now uploading image...', icon: 'info', timer: 1500, showConfirmButton: false });
      } else {
        const response = await api.updateCrop(currentCrop._id, formData, token);
        savedItem = response.data;
      }
      
      if (imageFile && savedItem?._id) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        await api.uploadCropImage(savedItem._id, uploadFormData);
      }
      
      Swal.fire('Success', `Crop ${modalMode === 'add' ? 'created' : 'updated'} successfully!`, 'success');
      handleCloseModal();
      fetchCrops();

    } catch (error) {
      console.error("Failed to save crop:", error);
      const errorMessage = error.response?.data?.error || "An unexpected error occurred.";
      Swal.fire('Error', `Failed to save the crop: ${errorMessage}`, 'error');
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

  // --- THIS IS THE FIX (Part 1) ---
  const cropFields = [
    { name: 'name', label: 'Crop Name', required: true, group: 'Basic Information' },
    // Add the new field to the form definition
    { name: 'growingDuration', label: 'Growing Duration (Days)', required: true, type: 'number', group: 'Basic Information' },
    { name: 'description', label: 'Main Description', required: true, type: 'textarea', rows: 4, group: 'Basic Information' },
    { name: 'imageUrl', label: 'Image URL', group: 'Basic Information' },
    { name: 'season', label: 'Season', type: 'select', options: ['All Year', 'Dry Season', 'Wet Season'], defaultValue: 'All Year', group: 'Basic Information' },
    { name: 'overview.plantingSeason', label: 'Planting Season', group: 'Basic Information' },
    { name: 'overview.harvestTime', label: 'Harvest Time', group: 'Basic Information' },
    { name: 'growingGuide.climate', label: 'Climate', group: 'Growing Guide' },
    { name: 'growingGuide.soilType', label: 'Soil Type', group: 'Growing Guide' },
    { name: 'growingGuide.waterNeeds', label: 'Water Needs', group: 'Growing Guide' },
    { name: 'growingGuide.fertilizer', label: 'Fertilizer', group: 'Growing Guide' },
    { name: 'marketInfo.priceRange', label: 'Price Range (e.g., ₱50-₱60/kg)', group: 'Growing Guide' },
    { name: 'marketInfo.storageMethod', label: 'Storage Method', group: 'Growing Guide' },
    { name: 'healthCare.commonDiseases', label: 'Common Diseases (one per line)', type: 'textarea', isArray: true, rows: 4, group: 'Health & Market' },
    { name: 'healthCare.pestControl', label: 'Pest Control (one per line)', type: 'textarea', isArray: true, rows: 4, group: 'Health & Market' },
    { name: 'healthCare.nutritionalValue', label: 'Nutritional Value (one per line)', type: 'textarea', isArray: true, rows: 4, group: 'Health & Market' },
    { name: 'marketInfo.cookingTips', label: 'Cooking Tips (one per line)', type: 'textarea', isArray: true, rows: 4, group: 'Health & Market' },
  ];

  // --- THIS IS THE FIX (Part 2) ---
  const columns = [
    { 
      field: 'imageUrl', 
      headerName: 'Image', 
      width: 100,
      renderCell: (params) => (
        <Avatar 
          src={params.value} 
          variant="rounded"
          sx={{ width: 56, height: 56 }} 
        />
      ),
      sortable: false,
      filterable: false,
    },
    { field: 'name', headerName: 'Crop Name', width: 200 },
    // Add the new column to the grid display
    { field: 'growingDuration', headerName: 'Duration (Days)', width: 150 },
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
          rowHeight={70}
        />
      </Paper>
      <AdminFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={currentCrop}
        mode={modalMode}
        title={modalMode === 'add' ? 'Add New Crop' : 'Edit Crop'}
        fields={cropFields}
      />
    </Box>
  );
};

export default ManageCrops;