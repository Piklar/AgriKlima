// src/pages/ProfilePage.jsx

import React, { useState } from 'react';
import {
  Container, Box, Typography, Avatar, Paper, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, IconButton,
  Divider, Switch, CircularProgress, Dialog, DialogTitle, DialogActions, Button
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext'; // <-- Import Theme hook
import { useLanguage } from '../context/LanguageContext'; // <-- Import Language hook
import Swal from 'sweetalert2';

// Modals
import ProfilePictureModal from '../components/ProfilePictureModal';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';

// Icons
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
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
  const { mode, toggleTheme } = useThemeContext(); // Use theme context
  const { language, changeLanguage, t } = useLanguage(); // Use language context

  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false); // State for new modal

  const handleClosePictureModal = (wasUpdateSuccessful) => {
    setIsPictureModalOpen(false);
    if (wasUpdateSuccessful) {
      Swal.fire('Success!', 'Your profile picture has been updated.', 'success');
      fetchUserDetails();
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
  const currentLanguageLabel = language === 'fil' ? 'Filipino' : 'English';

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        {/* Profile Header */}
        <Paper elevation={4} sx={{ borderRadius: '24px', p: 3, textAlign: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', width: 120, height: 120, margin: '0 auto 16px' }}>
            <Avatar
              src={user.profilePictureUrl}
              sx={{ width: 120, height: 120, border: '4px solid white', bgcolor: 'primary.main' }}
            >
              {!user.profilePictureUrl && <AccountCircleIcon sx={{ width: 100, height: 100 }} />}
            </Avatar>
            <IconButton
              onClick={() => setIsPictureModalOpen(true)}
              aria-label="change profile picture"
              sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.paper', '&:hover': { bgcolor: 'grey.200' } }}
            >
              <AddAPhotoIcon />
            </IconButton>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{displayName}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'text.secondary', mt: 1 }}>
            <LocationOnOutlinedIcon fontSize="small" />
            <Typography sx={{ ml: 1 }}>{user.location || 'Location not set'}</Typography>
          </Box>
        </Paper>

        {/* General Settings */}
        <Paper elevation={1} sx={{ borderRadius: '24px', p: 2, mb: 3 }}>
          <List>
            <ListItemButton onClick={() => setEditModalOpen(true)}>
              <ListItemIcon><EditOutlinedIcon color="primary" /></ListItemIcon>
              <ListItemText primary={t('editProfileInfo')} />
            </ListItemButton>
            <ListItemButton onClick={() => setIsLanguageModalOpen(true)}>
              <ListItemIcon><LanguageOutlinedIcon color="primary" /></ListItemIcon>
              <ListItemText primary={t('language')} />
              <Typography color="text.secondary">{currentLanguageLabel}</Typography>
            </ListItemButton>
          </List>
        </Paper>

        {/* Security and Theme */}
        <Paper elevation={1} sx={{ borderRadius: '24px', p: 2, mb: 3 }}>
          <List>
            <ListItem>
              <ListItemIcon><SecurityOutlinedIcon color="primary" /></ListItemIcon>
              <ListItemText primary={t('security')} />
            </ListItem>
            <ListItemButton onClick={() => setPasswordModalOpen(true)}>
              <ListItemIcon><LockResetOutlinedIcon /></ListItemIcon>
              <ListItemText primary={t('changePassword')} />
            </ListItemButton>
            <Divider component="li" sx={{ my: 1 }} />
            <ListItem>
              <ListItemIcon><PaletteOutlinedIcon /></ListItemIcon>
              <ListItemText primary={t('theme')} />
              <Typography color="text.secondary" sx={{ mr: 1 }}>
                {mode === 'dark' ? t('darkMode') : t('lightMode')}
              </Typography>
              <Switch checked={mode === 'dark'} onChange={toggleTheme} color="primary" />
            </ListItem>
          </List>
        </Paper>

        {/* Help & Support */}
        <Paper elevation={1} sx={{ borderRadius: '24px', p: 2 }}>
          <List>
            <ListItemButton>
              <ListItemIcon><HelpOutlineOutlinedIcon color="primary" /></ListItemIcon>
              <ListItemText primary={t('helpAndSupport')} />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><ContactSupportOutlinedIcon /></ListItemIcon>
              <ListItemText primary={t('contactUs')} />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon><PrivacyTipOutlinedIcon /></ListItemIcon>
              <ListItemText primary={t('privacyPolicy')} />
            </ListItemButton>
          </List>
        </Paper>
      </Container>

      {/* MODALS */}
      <ProfilePictureModal open={isPictureModalOpen} onClose={handleClosePictureModal} user={user} />
      <EditProfileModal open={isEditModalOpen} onClose={() => setEditModalOpen(false)} user={user} onUpdate={fetchUserDetails} />
      <ChangePasswordModal open={isPasswordModalOpen} onClose={() => setPasswordModalOpen(false)} />

      {/* NEW Language Selection Modal */}
      <Dialog open={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)}>
        <DialogTitle>Select Language</DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem disableGutters>
            <ListItemButton onClick={() => { changeLanguage('en'); setIsLanguageModalOpen(false); }}>
              <ListItemText primary="English" />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters>
            <ListItemButton onClick={() => { changeLanguage('fil'); setIsLanguageModalOpen(false); }}>
              <ListItemText primary="Filipino" />
            </ListItemButton>
          </ListItem>
        </List>
        <DialogActions>
            <Button onClick={() => setIsLanguageModalOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfilePage;