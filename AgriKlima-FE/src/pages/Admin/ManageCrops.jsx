// src/pages/Admin/ManageCrops.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Avatar,
  TextField,
  InputAdornment,
  Pagination,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';
import * as api from '../../services/api';
import AdminFormModal from '../../components/AdminFormModal';
import VarietyManagementModal from '../../components/VarietyManagementModal'; // ✅ NEW IMPORT
import { useAuth } from '../../context/AuthContext';

// ✨ SweetAlert2 agricultural-themed styling
const styleSweetAlert = () => {
  const popup = Swal.getPopup();
  if (popup) {
    popup.style.borderRadius = '20px';
    popup.style.padding = '30px';
    popup.style.boxShadow = '0 6px 25px rgba(46, 125, 50, 0.4)';
  }

  const confirmBtn = Swal.getConfirmButton();
  if (confirmBtn) {
    confirmBtn.style.backgroundColor = '#66bb6a';
    confirmBtn.style.color = 'white';
    confirmBtn.style.fontWeight = '600';
    confirmBtn.style.padding = '10px 25px';
    confirmBtn.style.borderRadius = '8px';
    confirmBtn.style.margin = '5px';
    confirmBtn.style.border = 'none';
    confirmBtn.style.cursor = 'pointer';
    confirmBtn.style.transition = '0.3s';
    confirmBtn.onmouseover = () => (confirmBtn.style.backgroundColor = '#4caf50');
    confirmBtn.onmouseout = () => (confirmBtn.style.backgroundColor = '#66bb6a');
  }

  const cancelBtn = Swal.getCancelButton();
  if (cancelBtn) {
    cancelBtn.style.backgroundColor = '#ffffff';
    cancelBtn.style.color = '#2e7d32';
    cancelBtn.style.fontWeight = '600';
    cancelBtn.style.padding = '10px 25px';
    cancelBtn.style.borderRadius = '8px';
    cancelBtn.style.margin = '5px';
    cancelBtn.style.border = '1px solid #a5d6a7';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.style.transition = '0.3s';
    cancelBtn.onmouseover = () => (cancelBtn.style.backgroundColor = '#e8f5e9');
    cancelBtn.onmouseout = () => (cancelBtn.style.backgroundColor = '#ffffff');
  }
};

const ManageCrops = () => {
  const { token } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentCrop, setCurrentCrop] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ Variety modal states
  const [isVarietyModalOpen, setIsVarietyModalOpen] = useState(false);
  const [selectedCropForVarieties, setSelectedCropForVarieties] = useState(null);

  const handleOpenVarietyModal = (crop) => {
    setSelectedCropForVarieties(crop);
    setIsVarietyModalOpen(true);
  };

  const handleCloseVarietyModal = () => {
    setIsVarietyModalOpen(false);
    setSelectedCropForVarieties(null);
  };

  // 📥 Fetch crops
  const fetchCrops = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getCrops({ search, page, limit: 10 });
      setCrops(response.data.crops);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      Swal.fire({
        title: '❌ Error',
        text: 'Could not fetch crops from the server.',
        icon: 'error',
        background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
        color: '#2e7d32',
        didOpen: styleSweetAlert,
      });
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCrops();
    }, 500);
    return () => clearTimeout(handler);
  }, [fetchCrops]);

  const handlePageChange = (event, value) => setPage(value);

  // ➕ Add / ✏️ Edit Modal
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

  // 📝 Save or Update Crop
  const handleFormSubmit = async (formData, imageFile) => {
    if (!token) {
      Swal.fire({
        title: '❌ Error',
        text: 'You must be logged in.',
        icon: 'error',
        background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
        color: '#2e7d32',
        didOpen: styleSweetAlert,
      });
      return;
    }
    try {
      let savedItem;
      if (modalMode === 'add') {
        const response = await api.addCrop(formData, token);
        savedItem = response.data;

        if (imageFile) {
          Swal.fire({
            title: 'Step 1/2 Complete',
            text: 'Crop details saved. Now uploading image...',
            icon: 'info',
            showConfirmButton: false,
            timer: 1500,
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            color: '#2e7d32',
            didOpen: styleSweetAlert,
          });
        }
      } else {
        const response = await api.updateCrop(currentCrop._id, formData, token);
        savedItem = response.data;
      }

      if (imageFile && savedItem?._id) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        await api.uploadCropImage(savedItem._id, uploadFormData);
      }

      Swal.fire({
        title: '🌿 Success!',
        text: `Crop ${modalMode === 'add' ? 'created' : 'updated'} successfully!`,
        icon: 'success',
        background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
        color: '#2e7d32',
        didOpen: styleSweetAlert,
      });

      handleCloseModal();
      fetchCrops();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'An unexpected error occurred.';
      Swal.fire({
        title: '❌ Error',
        text: `Failed to save the crop: ${errorMessage}`,
        icon: 'error',
        background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
        color: '#2e7d32',
        didOpen: styleSweetAlert,
      });
    }
  };

  // 🗑️ Delete Crop
  const handleDelete = (id) => {
    if (!token) {
      Swal.fire({
        title: '❌ Error',
        text: 'You must be logged in.',
        icon: 'error',
        background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
        color: '#2e7d32',
        didOpen: styleSweetAlert,
      });
      return;
    }

    Swal.fire({
      title: '🚜 Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
      color: '#2e7d32',
      didOpen: styleSweetAlert,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.deleteCrop(id, token);
          Swal.fire({
            title: '🌿 Deleted!',
            text: 'The crop has been deleted.',
            icon: 'success',
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            color: '#2e7d32',
            didOpen: styleSweetAlert,
          });
          fetchCrops();
        } catch (error) {
          Swal.fire({
            title: '❌ Error',
            text: `Failed to delete the crop: ${
              error.response?.data?.error || 'An unexpected error occurred.'
            }`,
            icon: 'error',
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            color: '#2e7d32',
            didOpen: styleSweetAlert,
          });
        }
      }
    });
  };

  const cropFields = [
    { name: 'name', label: 'Crop Name', required: true, group: 'Basic Information' },
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
    { name: 'marketInfo.priceRange', label: 'Price Range', group: 'Growing Guide' },
    { name: 'marketInfo.storageMethod', label: 'Storage Method', group: 'Growing Guide' },
    { name: 'healthCare.commonDiseases', label: 'Common Diseases', type: 'textarea', isArray: true, rows: 4, group: 'Health & Market' },
    { name: 'healthCare.pestControl', label: 'Pest Control', type: 'textarea', isArray: true, rows: 4, group: 'Health & Market' },
    { name: 'healthCare.nutritionalValue', label: 'Nutritional Value', type: 'textarea', isArray: true, rows: 4, group: 'Health & Market' },
    { name: 'marketInfo.cookingTips', label: 'Cooking Tips', type: 'textarea', isArray: true, rows: 4, group: 'Health & Market' },
  ];

  // ✅ Updated columns with Varieties button
  const columns = [
    {
      field: 'imageUrl',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <Avatar src={params.value} variant="rounded" sx={{ width: 56, height: 56 }} />
      ),
      sortable: false,
      filterable: false,
    },
    { field: 'name', headerName: 'Crop Name', width: 200 },
    { field: 'growingDuration', headerName: 'Duration (Days)', width: 150 },
    { field: 'season', headerName: 'Season', width: 150 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 280, // ⬆️ Increased width for new button
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
            onClick={() => handleOpenVarietyModal(params.row)}
          >
            Varieties
          </Button>
          <Button
            size="small"
            variant="outlined"
            sx={{ borderRadius: 2 }}
            onClick={() => handleOpenEditModal(params.row)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            sx={{ borderRadius: 2 }}
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Manage Crops
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#66bb6a',
            '&:hover': { bgcolor: '#4caf50' },
            borderRadius: 2,
          }}
          onClick={handleOpenAddModal}
        >
          Add New Crop
        </Button>
      </Box>

      {/* Search */}
      <Paper sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by crop name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Table */}
      <Paper sx={{ height: '70vh', width: '100%' }}>
        <DataGrid
          rows={crops}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id}
          rowHeight={70}
          paginationMode="server"
          rowCount={totalPages * 10}
          hideFooter
          sx={{
            '& .MuiDataGrid-cell': { py: 1 },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f0f4f0' },
          }}
        />
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
      </Box>

      {/* Modals */}
      <AdminFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={currentCrop}
        mode={modalMode}
        title={modalMode === 'add' ? 'Add New Crop' : 'Edit Crop'}
        fields={cropFields}
      />

      {/* ✅ Variety Management Modal */}
      <VarietyManagementModal
        open={isVarietyModalOpen}
        onClose={handleCloseVarietyModal}
        crop={selectedCropForVarieties}
      />
    </Box>
  );
};

export default ManageCrops;
