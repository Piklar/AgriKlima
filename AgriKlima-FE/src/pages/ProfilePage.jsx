import React, { useState } from 'react';
import {
<<<<<<< Updated upstream
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
=======
  Container, Box, Typography, Avatar, Paper, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, IconButton,
  Divider, Switch, CircularProgress // <-- Import CircularProgress
>>>>>>> Stashed changes
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import userAvatar from '../assets/images/user-avatar.jpg';
import EditProfileModal from '../components/EditProfileModal';
// --- ADDITION: Import the new ChangePasswordModal component ---
import ChangePasswordModal from '../components/ChangePasswordModal';
import Swal from 'sweetalert2';

<<<<<<< Updated upstream
// Icon Imports
=======
// Modals
import ProfilePictureModal from '../components/ProfilePictureModal';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';

// Icons
>>>>>>> Stashed changes
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
<<<<<<< Updated upstream
// --- ADDITION: Import the icon for the new button ---
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';


const ProfilePage = () => {
  const { user, fetchUserDetails } = useAuth();
  // State for your existing edit profile modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // --- ADDITION: Add state for the new password modal ---
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
=======
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';

const ProfilePage = () => {
  const { user, fetchUserDetails } = useAuth();
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
>>>>>>> Stashed changes


  const handleOpenEditModal = () => {
    if (user) {
      setIsEditModalOpen(true);
    }
  };
  
  const handleCloseEditModal = (wasUpdateSuccessful) => {
    setIsEditModalOpen(false);
    if (wasUpdateSuccessful) {
      Swal.fire({
        title: 'Success!',
        text: 'Your profile has been updated successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      if (typeof fetchUserDetails === 'function') {
        fetchUserDetails(); 
      }
    }
  };

<<<<<<< Updated upstream
  // --- ADDITION: Add a handler function for the new password modal ---
  const handleClosePasswordModal = (wasUpdateSuccessful) => {
    setIsPasswordModalOpen(false);
    if (wasUpdateSuccessful) {
      Swal.fire({
        title: 'Success!',
        text: 'Your password has been changed successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

=======
  // --- THIS IS THE UPDATED LOADING INDICATOR ---
  // It provides a better user experience and prevents any child components
  // from rendering before the user data is available.
>>>>>>> Stashed changes
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 6 }}>
<<<<<<< Updated upstream
        {/* Profile Header (No changes here) */}
        <Paper elevation={4} sx={{ borderRadius: '24px', p: 3, textAlign: 'center', mb: 4 }}>
          <Avatar
            src={userAvatar}
            sx={{ width: 100, height: 100, margin: '0 auto 16px', border: '4px solid white' }}
          />
=======
        {/* Your existing JSX is preserved from here */}
        <Paper elevation={4} sx={{ borderRadius: '24px', p: 3, textAlign: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', width: 120, height: 120, margin: '0 auto 16px' }}>
            <Avatar
              src={user.profilePictureUrl}
              sx={{ width: 120, height: 120, border: '4px solid white', bgcolor: 'var(--primary-green)' }}
            >
              {!user.profilePictureUrl && <AccountCircleIcon sx={{ width: 100, height: 100 }} />}
            </Avatar>
            <IconButton
              onClick={() => setIsPictureModalOpen(true)}
              aria-label="change profile picture"
              sx={{
                position: 'absolute', bottom: 0, right: 0,
                bgcolor: 'rgba(240, 240, 240, 0.9)',
                '&:hover': { bgcolor: 'white' }
              }}
            >
              <AddAPhotoIcon />
            </IconButton>
          </Box>
>>>>>>> Stashed changes
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {displayName}
          </Typography>
<<<<<<< Updated upstream
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'text.secondary',
              mt: 1
            }}
          >
=======
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'text.secondary', mt: 1 }}>
>>>>>>> Stashed changes
            <LocationOnOutlinedIcon fontSize="small" />
            <Typography sx={{ ml: 1 }}>{user.location || 'Location not set'}</Typography>
          </Box>
        </Paper>

<<<<<<< Updated upstream
        {/* --- Settings Lists (No changes here) --- */}
        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, mb: 3, border: '1px solid #eee' }}>
          <List>
            <ListItemButton onClick={handleOpenEditModal}>
=======
        {/* General Settings */}
        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, mb: 3, border: '1px solid #eee' }}>
          <List>
            <ListItemButton onClick={() => setEditModalOpen(true)}>
>>>>>>> Stashed changes
              <ListItemIcon><EditOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Edit profile information" />
            </ListItemButton>
            <ListItem>
              <ListItemIcon><NotificationsOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Notifications" />
              <Switch defaultChecked color="success" />
            </ListItem>
            <ListItem>
              <ListItemIcon><LanguageOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Language" />
<<<<<<< Updated upstream
              <Typography color="text.secondary">English</Typography>
=======
              <Typography color="text.secondary">{user.language || 'English'}</Typography>
>>>>>>> Stashed changes
            </ListItem>
          </List>
        </Paper>

<<<<<<< Updated upstream
        {/* --- Security & Theme List (MODIFIED) --- */}
=======
        {/* Security and Theme */}
>>>>>>> Stashed changes
        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, mb: 3, border: '1px solid #eee' }}>
          <List>
            <ListItem>
              <ListItemIcon><SecurityOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Security" />
            </ListItem>

            <ListItemButton onClick={() => setPasswordModalOpen(true)}>
              <ListItemIcon><LockResetOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Change Password" />
            </ListItemButton>
<<<<<<< Updated upstream
            
            {/* --- ADDITION: The "Change Password" button --- */}
            <ListItemButton onClick={() => setIsPasswordModalOpen(true)}>
              <ListItemIcon><VpnKeyOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Change Password" />
            </ListItemButton>

=======

            <Divider component="li" sx={{ mx: 2 }} />
>>>>>>> Stashed changes
            <ListItem>
              <ListItemIcon><PaletteOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Theme" />
              <Typography color="text.secondary">Light mode</Typography>
            </ListItem>
          </List>
        </Paper>

<<<<<<< Updated upstream
        {/* --- Help & Support List (No changes here) --- */}
=======
        {/* Help & Support */}
>>>>>>> Stashed changes
        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, border: '1px solid #eee' }}>
          <List>
            <ListItemButton>
              <ListItemIcon><HelpOutlineOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Help & Support" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><ContactSupportOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Contact us" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><PrivacyTipOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Privacy policy" />
            </ListItemButton>
          </List>
        </Paper>
      </Container>

<<<<<<< Updated upstream
      {/* MODALS */}
      {user && (
        <>
          {/* Your existing Edit Profile Modal */}
          <EditProfileModal 
            open={isEditModalOpen}
            handleClose={handleCloseEditModal}
            user={user}
          />
          {/* --- ADDITION: The new Change Password Modal --- */}
          <ChangePasswordModal 
            open={isPasswordModalOpen}
            handleClose={handleClosePasswordModal}
=======
      {/* Modals - This section is correct */}
      {user && (
        <>
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
>>>>>>> Stashed changes
          />
        </>
      )}
    </>
  );
};

export default ProfilePage;