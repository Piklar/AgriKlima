// src/components/LoggedInNavbar.jsx

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Button, Box, Avatar, Menu, MenuItem, 
  ListItemIcon, Typography, Divider 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import userAvatar from '../assets/images/user-avatar.jpg'; // Add a placeholder user avatar image

// Icons for the dropdown menu
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const LoggedInNavbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  // Style for NavLinks to show active state
  const navLinkStyle = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    color: 'var(--dark-text)',
    textDecoration: 'none',
  });

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={1} 
      sx={{ backgroundColor: '#ffffffF2', padding: '10px 5%' }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <img src={logo} alt="AgriKlima Logo" style={{ height: '45px' }} />
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <NavLink to="/dashboard" style={navLinkStyle}>Home</NavLink>
          <NavLink to="/about" style={navLinkStyle}>About Us</NavLink>
          <NavLink to="/weather" style={navLinkStyle}>Weather</NavLink>
          <NavLink to="/crops" style={navLinkStyle}>Crops</NavLink>
          <NavLink to="/pests" style={navLinkStyle}>Pests</NavLink>
          <NavLink to="/calendar" style={navLinkStyle}>Calendar</NavLink>
          <NavLink to="/news" style={navLinkStyle}>News</NavLink>
        </Box>

        {/* User Profile Section */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleMenu} sx={{ textTransform: 'none', borderRadius: '20px' }}>
            <Avatar alt="Kimberly Manaloto" src={userAvatar} sx={{ width: 32, height: 32, mr: 1 }} />
            <Typography sx={{ color: 'var(--dark-text)' }}>Kimberly G. Manaloto</Typography>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              Profile & Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LoggedInNavbar;