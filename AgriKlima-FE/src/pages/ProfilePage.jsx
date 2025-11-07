import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

// --- Modals ---
import ProfilePictureModal from '../components/ProfilePictureModal';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import ContactUsModal from '../components/ContactUsModal';
import Terms from '../components/Terms';

// --- Icons ---
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';

const ProfilePage = () => {
  const { user, fetchUserDetails } = useAuth();

  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleClosePictureModal = (wasUpdateSuccessful) => {
    setIsPictureModalOpen(false);
    if (wasUpdateSuccessful) {
      Swal.fire('Success!', 'Your profile picture has been updated.', 'success');
      fetchUserDetails();
    }
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        {/* --- Profile Header --- */}
        <Paper
          elevation={4}
          sx={{
            borderRadius: '24px',
            p: 3,
            textAlign: 'center',
            mb: 4,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 120,
              height: 120,
              margin: '0 auto 16px',
            }}
          >
            <Avatar
              src={user.profilePictureUrl}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
                bgcolor: 'primary.main',
              }}
            >
              {!user.profilePictureUrl && (
                <AccountCircleIcon sx={{ width: 100, height: 100 }} />
              )}
            </Avatar>
            <IconButton
              onClick={() => setIsPictureModalOpen(true)}
              aria-label="change profile picture"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'grey.200' },
              }}
            >
              <AddAPhotoIcon />
            </IconButton>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {displayName}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'text.secondary',
              mt: 1,
            }}
          >
            <LocationOnOutlinedIcon fontSize="small" />
            <Typography sx={{ ml: 1 }}>
              {user.location || 'Location not set'}
            </Typography>
          </Box>
        </Paper>

        {/* --- FIXED: Combined Account & Security Section --- */}
        <Paper elevation={1} sx={{ borderRadius: '24px', p: 2, mb: 3 }}>
          <List>
            <ListItemButton onClick={() => setEditModalOpen(true)}>
              <ListItemIcon>
                <EditOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Edit Profile Information" />
            </ListItemButton>
            <ListItemButton onClick={() => setPasswordModalOpen(true)}>
              <ListItemIcon>
                <LockResetOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Change Password" />
            </ListItemButton>
          </List>
        </Paper>

        {/* --- Support & Legal Section --- */}
        <Paper elevation={1} sx={{ borderRadius: '24px', p: 2 }}>
          <List>
            <ListItemButton onClick={() => setIsContactModalOpen(true)}>
              <ListItemIcon>
                <ContactSupportOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Contact Us" />
            </ListItemButton>
            <ListItemButton onClick={() => setIsTermsModalOpen(true)}>
              <ListItemIcon>
                <PrivacyTipOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Terms of Use & Privacy Policy" />
            </ListItemButton>
          </List>
        </Paper>
      </Container>

      {/* --- MODALS --- */}
      <ProfilePictureModal
        open={isPictureModalOpen}
        onClose={handleClosePictureModal}
        user={user}
      />
      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={user}
        onUpdate={fetchUserDetails}
      />
      <ChangePasswordModal
        open={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
      <ContactUsModal
        open={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      <Terms
        open={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </>
  );
};

export default ProfilePage;
