// src/components/ProfilePictureModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Box, Paper, Typography, Avatar, Button, Stack, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import * as api from '../services/api';

const ProfilePictureModal = ({ open, onClose, user }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.profilePictureUrl) {
      setPreviewUrl(user.profilePictureUrl);
    } else {
      setPreviewUrl('');
    }
    setFile(null);
  }, [user, open]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      onClose(false);
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      await api.updateProfilePicture(formData);
      onClose(true);
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      onClose(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <Paper sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%', maxWidth: 500, p: 3, borderRadius: '16px'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Profile Picture</Typography>
          <IconButton onClick={() => onClose(false)}><CloseIcon /></IconButton>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2} alignItems="center">
            <Avatar src={previewUrl} sx={{ width: 200, height: 200, mb: 2, border: '4px solid #eee' }} />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/png, image/jpeg, image/gif"
            />
            <Button
              variant="outlined"
              onClick={handleButtonClick}
              startIcon={<AddAPhotoIcon />}
            >
              Choose Picture
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!file || isSubmitting}
              fullWidth
              sx={{ bgcolor: 'var(--primary-green)', '&:hover': { bgcolor: 'var(--light-green)' } }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save New Picture'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ProfilePictureModal;