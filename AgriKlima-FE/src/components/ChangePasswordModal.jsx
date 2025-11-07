import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';
import * as api from '../services/api';
import Swal from 'sweetalert2';

const ChangePasswordModal = ({ open, onClose }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate matching new passwords
    if (passwords.newPassword !== passwords.confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'New passwords do not match.',
        icon: 'error',
        customClass: { container: 'swal-high-z-index' },
      });
      return;
    }

    try {
      // ✅ Call change password API
      await api.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      // ✅ Close modal and show success
      onClose();
      Swal.fire({
        title: 'Success',
        text: 'Password changed successfully!',
        icon: 'success',
        customClass: { container: 'swal-high-z-index' },
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.error || 'Failed to change password.',
        icon: 'error',
        customClass: { container: 'swal-high-z-index' },
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Change Password</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                pt: 1,
              }}
            >
              <TextField
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={handleChange}
                required
              />
              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handleChange}
                required
              />
              <TextField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={handleChange}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ✅ Fix overlapping SweetAlert with MUI dialogs */}
      <style>
        {`
          .swal-high-z-index {
            z-index: 9999 !important;
          }
        `}
      </style>
    </>
  );
};

export default ChangePasswordModal;
