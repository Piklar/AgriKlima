// src/components/AddUserCropModal.jsx

import React, { useState } from 'react';
import { Modal, Box, Paper, Typography, TextField, Button, Stack, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as api from '../services/api';
import Swal from 'sweetalert2';

const AddUserCropModal = ({ open, onClose, cropData, onCropAdded }) => {
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.addUserCrop({ cropId: cropData._id, plantingDate });
      Swal.fire('Success!', `${cropData.name} has been added to your farm.`, 'success');
      onCropAdded(); // This will trigger a refresh on the parent page
      onClose();
    } catch (error) {
      console.error("Failed to add crop to user's farm:", error);
      Swal.fire('Error', 'Failed to add crop. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cropData) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%', maxWidth: 400, p: 3, borderRadius: '16px'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Add {cropData.name} to Farm</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography>Please enter the date you planted this crop.</Typography>
            <TextField
              fullWidth
              required
              label="Planting Date"
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              fullWidth
              sx={{ bgcolor: 'var(--primary-green)', '&:hover': { bgcolor: 'var(--light-green)' } }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Confirm & Add'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Modal>
  );
};

export default AddUserCropModal;