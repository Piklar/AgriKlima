// src/components/EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import * as api from '../services/api';
import Swal from 'sweetalert2';

const EditProfileModal = ({ open, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      Swal.fire('Error', 'User data is not available. Please try again.', 'error');
      return;
    }
    try {
      await api.updateUser(user._id, formData);

      Swal.fire({
        title: 'Success!',
        text: 'Profile updated successfully!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      Swal.fire('Error', error.response?.data?.error || 'Failed to update profile.', 'error');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{ fontFamily: 'inherit' }} // ⬅️ all children inherit this font
    >
      <DialogTitle sx={{ fontFamily: 'inherit' }}>Edit Profile Information</DialogTitle>
      <form onSubmit={handleSubmit} style={{ fontFamily: 'inherit' }}>
        <DialogContent sx={{ fontFamily: 'inherit' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1, fontFamily: 'inherit' }}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              fullWidth
              sx={{ fontFamily: 'inherit' }}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              fullWidth
              sx={{ fontFamily: 'inherit' }}
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              sx={{ fontFamily: 'inherit' }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px', fontFamily: 'inherit' }}>
          <Button onClick={onClose} sx={{ fontFamily: 'inherit' }}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ fontFamily: 'inherit' }}>Save Changes</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProfileModal;
