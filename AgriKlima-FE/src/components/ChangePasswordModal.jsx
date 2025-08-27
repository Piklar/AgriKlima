import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  maxWidth: '95%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
};

const ChangePasswordModal = ({ open, handleClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await fetch(`http://localhost:4000/users/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to change password');
        }

        setIsLoading(false);
        handleClose(true); // Close modal and signal success

    } catch (error) {
        console.error('Error changing password:', error);
        setError(error.message);
        setIsLoading(false);
    }
  };
  
  // Reset form state when modal closes
  const handleModalClose = (wasSuccess) => {
    handleClose(wasSuccess);
    setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError(null);
    }, 300); // Delay reset to allow modal to animate out
  };

  return (
    <Modal open={open} onClose={() => handleModalClose(false)}>
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Change Password
        </Typography>

        <TextField
          type="password"
          name="currentPassword"
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          type="password"
          name="newPassword"
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          type="password"
          name="confirmPassword"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        
        {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
            </Typography>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
          <Button onClick={() => handleModalClose(false)} disabled={isLoading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;