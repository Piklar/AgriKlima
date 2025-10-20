// src/pages/Admin/ManagePests.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Paper, Avatar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import * as api from '../../services/api';
import AdminFormModal from '../../components/AdminFormModal';
import { useAuth } from '../../context/AuthContext';

const ManagePests = () => {
  const { token } = useAuth();
  const [pests, setPests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentPest, setCurrentPest] = useState(null);

  // ✨ Style function for SweetAlert2
  const styleSweetAlert = () => {
    const popup = Swal.getPopup();
    popup.style.borderRadius = '20px';
    popup.style.padding = '30px';
    popup.style.boxShadow = '0 6px 25px rgba(46, 125, 50, 0.4)';

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

  // 📥 Fetch pests
  const fetchPests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getPests();
      setPests(response.data);
    } catch (error) {
      console.error('Failed to fetch pests:', error);
      Swal.fire('Error', 'Could not fetch pests from the server.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPests();
  }, [fetchPests]);

  // ➕ Add
  const handleOpenAddModal = () => {
    setModalMode('add');
    setCurrentPest(null);
    setIsModalOpen(true);
  };

  // ✏️ Edit
  const handleOpenEditModal = (pest) => {
    setModalMode('edit');
    setCurrentPest(pest);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPest(null);
  };

  // 📝 Save or Update Pest
  const handleFormSubmit = async (formData, imageFile) => {
    if (!token) {
      Swal.fire('Error', 'You must be logged in to perform this action.', 'error');
      return;
    }
    try {
      let savedItem;
      if (modalMode === 'add') {
        const response = await api.addPest(formData, token);
        savedItem = response.data;
        if (imageFile) {
          Swal.fire({
            title: 'Step 1/2 Complete',
            text: 'Pest details saved. Now uploading image...',
            icon: 'info',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } else {
        const response = await api.updatePest(currentPest._id, formData, token);
        savedItem = response.data.pest;
      }

      if (imageFile && savedItem?._id) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        await api.uploadPestImage(savedItem._id, uploadFormData);
      }

      Swal.fire({
        title: '🌿 Success!',
        text: `Pest ${modalMode === 'add' ? 'created' : 'updated'} successfully.`,
        icon: 'success',
        background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
        color: '#2e7d32',
        confirmButtonText: 'OK',
        didOpen: styleSweetAlert
      });
      handleCloseModal();
      fetchPests();
    } catch (error) {
      console.error('Failed to save pest:', error);
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
      Swal.fire({
        title: '❌ Error',
        text: `Failed to save the pest: ${errorMessage}`,
        icon: 'error',
        background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
        color: '#2e7d32',
        confirmButtonText: 'OK',
        didOpen: styleSweetAlert
      });
    }
  };

  // 🗑️ Delete Pest
  const handleDelete = (id) => {
    if (!token) {
      Swal.fire({
        title: '❌ Error',
        text: 'You must be logged in to perform this action.',
        icon: 'error',
        background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
        color: '#2e7d32',
        confirmButtonText: 'OK',
        didOpen: styleSweetAlert
      });
      return;
    }

    Swal.fire({
      title: '🚜 Are you sure?',
      html: `
        <div style="font-family: 'Poppins', sans-serif; font-size: 16px; color: #2e4d2c;">
          <p>This pest record will be permanently removed.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
      color: '#2e7d32',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: styleSweetAlert
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.deletePest(id, token);
          Swal.fire({
            title: '🌿 Deleted!',
            text: 'The pest record has been successfully deleted.',
            icon: 'success',
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            color: '#2e7d32',
            confirmButtonText: 'OK',
            didOpen: styleSweetAlert
          });
          fetchPests();
        } catch (error) {
          console.error('Failed to delete pest:', error);
          const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
          Swal.fire({
            title: '❌ Error',
            text: `Failed to delete the pest: ${errorMessage}`,
            icon: 'error',
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            color: '#2e7d32',
            confirmButtonText: 'OK',
            didOpen: styleSweetAlert
          });
        }
      }
    });
  };

  const pestFields = [
    { name: 'name', label: 'Pest Name', required: true, group: 'Basic Information' },
    { name: 'imageUrl', label: 'Image URL', group: 'Basic Information' },
    { name: 'type', label: 'Type', type: 'select', options: ['Insect Pest', 'Disease', 'Weed'], required: true, group: 'Basic Information' },
    { name: 'riskLevel', label: 'Risk Level', type: 'select', options: ['Low', 'Medium', 'High'], required: true, group: 'Basic Information' },
    { name: 'overview.description', label: 'Description', type: 'textarea', rows: 3, group: 'Basic Information' },
    { name: 'overview.seasonalActivity', label: 'Seasonal Activity', group: 'Basic Information' },
    { name: 'identification.size', label: 'Size', group: 'Identification' },
    { name: 'identification.color', label: 'Color', group: 'Identification' },
    { name: 'identification.shape', label: 'Shape', group: 'Identification' },
    { name: 'identification.behavior', label: 'Behavior', group: 'Identification' },
    { name: 'overview.commonlyAffects', label: 'Commonly Affects (one per line)', type: 'textarea', isArray: true, rows: 4, group: 'Control Methods' },
    { name: 'prevention', label: 'Prevention Methods (one per line)', type: 'textarea', isArray: true, rows: 4, group: 'Control Methods' },
    { name: 'treatment', label: 'Treatment Methods (one per line)', type: 'textarea', isArray: true, rows: 4, group: 'Control Methods' },
  ];

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
    { field: 'name', headerName: 'Pest Name', width: 200 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'riskLevel', headerName: 'Risk Level', width: 150 },
    {
      field: 'overview.description',
      headerName: 'Description',
      flex: 1,
      valueGetter: (value, row) => row.overview?.description || '',
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
            sx={{ mr: 1, borderRadius: 2 }}
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
          Manage Pests
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
          Add New Pest
        </Button>
      </Box>

      <Paper sx={{ height: '75vh', width: '100%' }}>
        <DataGrid
          rows={pests}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id}
          rowHeight={70}
          sx={{
            '& .MuiDataGrid-cell': { py: 1 },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f0f4f0' },
          }}
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
