import React, { useState } from 'react';
import {
  Container, Box, Typography, Avatar, Paper, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, IconButton,
  Divider, Switch, CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

// Modals
import ProfilePictureModal from '../components/ProfilePictureModal';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';

// Icons
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
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

  // Light / Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setDarkMode((prev) => !prev);
    document.body.setAttribute('data-theme', !darkMode ? 'dark' : 'light');
  };

  const handleClosePictureModal = (wasUpdateSuccessful) => {
    setIsPictureModalOpen(false);
    if (wasUpdateSuccessful) {
      Swal.fire({
        title: 'Success!',
        text: 'Your profile picture has been updated.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      if (typeof fetchUserDetails === 'function') {
        fetchUserDetails();
      }
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontFamily: 'inherit' }}>
        <CircularProgress />
      </Box>
    );
  }

  const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 6, fontFamily: 'inherit' }}>
        {/* Profile Header */}
        <Paper elevation={4} sx={{ borderRadius: '24px', p: 3, textAlign: 'center', mb: 4, fontFamily: 'inherit' }}>
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
          <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
            {displayName}
          </Typography>
          <Box
            sx={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              color: 'text.secondary', mt: 1, fontFamily: 'inherit'
            }}
          >
            <LocationOnOutlinedIcon fontSize="small" />
            <Typography sx={{ ml: 1, fontFamily: 'inherit' }}>{user.location || 'Location not set'}</Typography>
          </Box>
        </Paper>

        {/* General Settings */}
        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, mb: 3, border: '1px solid #eee', fontFamily: 'inherit' }}>
          <List>
            <ListItemButton onClick={() => setEditModalOpen(true)}>
              <ListItemIcon><EditOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Edit profile information" sx={{ fontFamily: 'inherit' }} />
            </ListItemButton>
            <ListItem>
              <ListItemIcon><NotificationsOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Notifications" sx={{ fontFamily: 'inherit' }} />
              <Switch defaultChecked color="success" />
            </ListItem>
            <ListItem>
              <ListItemIcon><LanguageOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Language" sx={{ fontFamily: 'inherit' }} />
              <Typography color="text.secondary" sx={{ fontFamily: 'inherit' }}>{user.language || 'English'}</Typography>
            </ListItem>
          </List>
        </Paper>

        {/* Security and Theme */}
        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, mb: 3, border: '1px solid #eee', fontFamily: 'inherit' }}>
          <List>
            <ListItem>
              <ListItemIcon><SecurityOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Security" sx={{ fontFamily: 'inherit' }} />
            </ListItem>

            <ListItemButton onClick={() => setPasswordModalOpen(true)}>
              <ListItemIcon><LockResetOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Change Password" sx={{ fontFamily: 'inherit' }} />
            </ListItemButton>

            <Divider component="li" sx={{ mx: 2 }} />

            {/* Theme toggle */}
            <ListItem>
              <ListItemIcon><PaletteOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Theme" sx={{ fontFamily: 'inherit' }} />
              <Typography color="text.secondary" sx={{ mr: 1, fontFamily: 'inherit' }}>
                {darkMode ? 'Dark mode' : 'Light mode'}
              </Typography>
              <Switch
                checked={darkMode}
                onChange={handleThemeToggle}
                color="success"
              />
            </ListItem>
          </List>
        </Paper>

        {/* Help & Support */}
        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, border: '1px solid #eee', fontFamily: 'inherit' }}>
          <List>
            <ListItemButton>
              <ListItemIcon><HelpOutlineOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Help & Support" sx={{ fontFamily: 'inherit' }} />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><ContactSupportOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Contact us" sx={{ fontFamily: 'inherit' }} />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><PrivacyTipOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Privacy policy" sx={{ fontFamily: 'inherit' }} />
            </ListItemButton>
          </List>
        </Paper>
      </Container>

      {/* Modals */}
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
          />
        </>
      )}
    </>
  );
};

export default ProfilePage;
