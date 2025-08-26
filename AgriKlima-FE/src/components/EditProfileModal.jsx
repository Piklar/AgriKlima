// src/components/EditProfileModal.jsx

import React, { useState, useEffect } from 'react';
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

const EditProfileModal = ({ open, handleClose, user }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && open) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
      setError(null);
    }
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        // --- THIS IS THE FIX ---
        // We now use the correct key 'authToken' to match your AuthContext.
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            // This error should no longer appear.
            throw new Error("Authentication token not found.");
        }

        const response = await fetch(`http://localhost:4000/users/update-profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to update profile');
        }

        setIsLoading(false);
        handleClose(true); // Close modal and signal success
    } catch (error) {
        console.error('Error updating profile:', error);
        setError(error.message);
        setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal open={open} onClose={() => handleClose(false)}>
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Edit Profile Information
        </Typography>
        <TextField name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" required />
        {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
            </Typography>
        )}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
          <Button onClick={() => handleClose(false)} disabled={isLoading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProfileModal;