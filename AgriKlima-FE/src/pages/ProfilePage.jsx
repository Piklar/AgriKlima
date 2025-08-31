// src/pages/ProfilePage.jsx

import React, { useState } from 'react';
import {
  Container, Box, Typography, Avatar, Paper, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, IconButton
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import ProfilePictureModal from '../components/ProfilePictureModal';

// --- REMOVED unused userAvatar import ---

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
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // For default avatar

const ProfilePage = () => {
  const { user, fetchUserDetails } = useAuth();
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  // Your other modal states would go here
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Loading profile...</Typography>;
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper elevation={4} sx={{ borderRadius: '24px', p: 3, textAlign: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', width: 120, height: 120, margin: '0 auto 16px' }}>
            {/* --- THIS IS THE FIX --- */}
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
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {`${user.firstName || ''} ${user.lastName || ''}`}
          </Typography>
          <Box
            sx={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              color: 'text.secondary', mt: 1
            }}
          >
            <LocationOnOutlinedIcon fontSize="small" />
            <Typography sx={{ ml: 1 }}>{user.location || 'Location not set'}</Typography>
          </Box>
        </Paper>

        {/* The rest of the page lists... */}
        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, mb: 3, border: '1px solid #eee' }}>
          <List>
            <ListItemButton>
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
              <Typography color="text.secondary">{user.language || 'Not set'}</Typography>
            </ListItem>
          </List>
        </Paper>

        <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, mb: 3, border: '1px solid #eee' }}>
          <List>
            <ListItemButton>
              <ListItemIcon><SecurityOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Security" />
            </ListItemButton>
            <ListItem>
              <ListItemIcon><PaletteOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Theme" />
              <Typography color="text.secondary">Light mode</Typography>
            </ListItem>
          </List>
        </Paper>

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
      
      {user && (
        <ProfilePictureModal
          open={isPictureModalOpen}
          onClose={handleClosePictureModal}
          user={user}
        />
      )}
    </>
  );
};

export default ProfilePage;