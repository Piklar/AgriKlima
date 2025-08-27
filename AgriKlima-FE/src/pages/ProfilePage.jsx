// src/pages/ProfilePage.jsx

import React, { useState } from 'react';
import {
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
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import userAvatar from '../assets/images/user-avatar.jpg';
import EditProfileModal from '../components/EditProfileModal';
// --- ADDITION: Import the new ChangePasswordModal component ---
import ChangePasswordModal from '../components/ChangePasswordModal';
import Swal from 'sweetalert2';

// Icon Imports
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
// --- ADDITION: Import the icon for the new button ---
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';


const ProfilePage = () => {
  const { user, fetchUserDetails } = useAuth();
  // State for your existing edit profile modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // --- ADDITION: Add state for the new password modal ---
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);


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

  if (!user) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Loading profile...</Typography>;
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        {/* Profile Header (No changes here) */}
        <Paper elevation={4} sx={{ borderRadius: '24px', p: 3, textAlign: 'center', mb: 4 }}>
          <Avatar
            src={userAvatar}
            sx={{ width: 100, height: 100, margin: '0 auto 16px', border: '4px solid white' }}
          />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {`${user.firstName || ''} ${user.lastName || ''}`}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'text.secondary',
              mt: 1
            }}
          >
            <LocationOnOutlinedIcon fontSize="small" />
            <Typography sx={{ ml: 1 }}>{user.location || 'Location not set'}</Typography>
          </Box>
        </Paper>

        {/* --- Settings Lists (No changes here) --- */}
        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, mb: 3, border: '1px solid #eee' }}>
          <List>
            <ListItemButton onClick={handleOpenEditModal}>
              <ListItemIcon><EditOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Edit profile information" />
            </ListItemButton>
            <ListItem>
              <ListItemIcon><NotificationsOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Notifications" />
              <Typography color="primary">ON</Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon><LanguageOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Language" />
              <Typography color="text.secondary">English</Typography>
            </ListItem>
          </List>
        </Paper>

        {/* --- Security & Theme List (MODIFIED) --- */}
        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, mb: 3, border: '1px solid #eee' }}>
          <List>
            <ListItemButton>
              <ListItemIcon><SecurityOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Security" />
            </ListItemButton>
            
            {/* --- ADDITION: The "Change Password" button --- */}
            <ListItemButton onClick={() => setIsPasswordModalOpen(true)}>
              <ListItemIcon><VpnKeyOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Change Password" />
            </ListItemButton>

            <ListItem>
              <ListItemIcon><PaletteOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Theme" />
              <Typography color="text.secondary">Light mode</Typography>
            </ListItem>
          </List>
        </Paper>

        {/* --- Help & Support List (No changes here) --- */}
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
          />
        </>
      )}
    </>
  );
};

export default ProfilePage;