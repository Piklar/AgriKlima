// src/components/LoggedInNavbar.jsx

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    AppBar, 
    Toolbar, 
    Button, 
    Box, 
    Avatar, 
    Menu, 
    MenuItem, 
    ListItemIcon, 
    Typography, 
    Divider 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

// Icon Imports
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // For default avatar

const LoggedInNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  const navLinkStyle = {
    fontWeight: 'normal',
    color: 'var(--dark-text)',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    transition: 'background-color 0.2s ease-in-out',
  };

  const activeNavLinkStyle = {
    fontWeight: 'bold',
    backgroundColor: 'rgba(106, 153, 78, 0.1)'
  };

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={1} 
      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', padding: '10px 5%' }}
    >
      <Toolbar>
        {/* Logo */}
        <Box sx={{ flexGrow: 1 }}>
          <NavLink to="/dashboard">
            <img src={logo} alt="AgriKlima Logo" style={{ height: '45px', display: 'block' }} />
          </NavLink>
        </Box>

        {/* Navigation Links - CENTERED */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
          <NavLink to="/dashboard" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}>Home</NavLink>
          <NavLink to="/my-farm" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}>My Farm</NavLink>
          <NavLink to="/about" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}>About Us</NavLink>
          <NavLink to="/weather" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}>Weather</NavLink>
          <NavLink to="/crops" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}>Crops</NavLink>
          <NavLink to="/pests" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}>Pests</NavLink>
          <NavLink to="/calendar" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}>Calendar</NavLink>
          <NavLink to="/news" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}>News</NavLink>

          {user && user.isAdmin && (
            <Button 
              component={NavLink} 
              to="/admin/crops"
              variant="contained"
              size="small"
              startIcon={<AdminPanelSettingsIcon />}
              sx={{ bgcolor: 'var(--primary-green)', '&:hover': { bgcolor: 'var(--light-green)' }, textTransform: 'none' }}
            >
              Admin Panel
            </Button>
          )}
        </Box>

        {/* User Profile Section */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', ml: 3 }}>
          <Button onClick={handleMenu} sx={{ textTransform: 'none', borderRadius: '20px', p: 0.5 }}>
            <Avatar 
              alt={user?.firstName} 
              src={user?.profilePictureUrl} 
              sx={{ width: 32, height: 32, mr: 1, bgcolor: 'var(--primary-green)' }}
            >
              {!user?.profilePictureUrl && <AccountCircleIcon />}
            </Avatar>
            <Typography sx={{ color: 'var(--dark-text)', display: { xs: 'none', md: 'block' } }}>
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </Typography>
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
