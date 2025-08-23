import React from 'react';
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
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import userAvatar from '../assets/images/user-avatar.jpg';

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

const ProfilePage = () => {
  const { user } = useAuth();

  // Fallback values if user is not loaded yet
  if (!user) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Loading profile...</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      {/* Profile Header (Dynamic) */}
      <Paper elevation={4} sx={{ borderRadius: '24px', p: 3, textAlign: 'center', mb: 4 }}>
        <Avatar
          src={userAvatar}
          sx={{ width: 100, height: 100, margin: '0 auto 16px', border: '4px solid white' }}
        />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {user.firstName} {user.lastName}
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

      {/* Settings Lists */}
      <Paper
        elevation={0}
        sx={{ borderRadius: '24px', p: 2, mb: 3, border: '1px solid #eee' }}
      >
        <List>
          <ListItemButton>
            <ListItemIcon>
              <EditOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Edit profile information" />
          </ListItemButton>
          <ListItem>
            <ListItemIcon>
              <NotificationsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
            <Typography color="primary">ON</Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LanguageOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Language" />
            <Typography color="text.secondary">English</Typography>
          </ListItem>
        </List>
      </Paper>

      <Paper
        elevation={0}
        sx={{ borderRadius: '24px', p: 2, mb: 3, border: '1px solid #eee' }}
      >
        <List>
          <ListItemButton>
            <ListItemIcon>
              <SecurityOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Security" />
          </ListItemButton>
          <ListItem>
            <ListItemIcon>
              <PaletteOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Theme" />
            <Typography color="text.secondary">Light mode</Typography>
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: '24px', p: 2, border: '1px solid #eee' }}>
        <List>
          <ListItemButton>
            <ListItemIcon>
              <HelpOutlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <ContactSupportOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Contact us" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <PrivacyTipOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Privacy policy" />
          </ListItemButton>
        </List>
      </Paper>
    </Container>
  );
};

export default ProfilePage;