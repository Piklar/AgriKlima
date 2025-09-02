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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import userAvatar from '../assets/images/user-avatar.jpg';

import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    secondary: { main: '#ffa000', light: '#ffc107', dark: '#ff8f00' },
    background: { default: '#f8f9f8' },
    text: { primary: '#333333', secondary: '#666666' }
  },
  typography: {
    fontFamily: 'inherit',
    h6: { fontWeight: 600, fontSize: '1.1rem' },
    body1: { fontSize: '1rem', lineHeight: 1.6 }
  },
});

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
    fontWeight: 500,
    color: theme.palette.text.primary,
    textDecoration: 'none',
    padding: '6px 8px',
    borderRadius: '4px',
    transition: 'color 0.3s',
  };

  const activeNavLinkStyle = {
    fontWeight: 600,
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(46, 125, 50, 0.08)',
  };

  return (
    <ThemeProvider theme={theme}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        `}
      </style>

      <AppBar 
        position="static" 
        color="default" 
        elevation={1} 
        sx={{ backgroundColor: '#ffffffF2', padding: '10px 5%' }}
      >
        <Toolbar>
          {/* Logo */}
          <Box sx={{ flexGrow: 1 }}>
            <NavLink to="/dashboard">
              <img src={logo} alt="AgriKlima Logo" style={{ height: '45px', display: 'block' }} />
            </NavLink>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <NavLink 
              to="/dashboard" 
              style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}
            >
              About Us
            </NavLink>
            <NavLink 
              to="/weather" 
              style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}
            >
              Weather
            </NavLink>
            <NavLink 
              to="/crops" 
              style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}
            >
              Crops
            </NavLink>
            <NavLink 
              to="/pests" 
              style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}
            >
              Pests
            </NavLink>
            <NavLink 
              to="/calendar" 
              style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}
            >
              Calendar
            </NavLink>
            <NavLink 
              to="/news" 
              style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}
            >
              News
            </NavLink>

            {/* Conditional Admin Panel Button */}
            {user && user.isAdmin && (
              <Button 
                component={NavLink} 
                to="/admin/crops"
                variant="contained"
                size="small"
                startIcon={<AdminPanelSettingsIcon />}
                sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  '&:hover': { bgcolor: theme.palette.primary.dark }, 
                  textTransform: 'none',
                }}
              >
                Admin Panel
              </Button>
            )}
          </Box>

          {/* User Profile Section */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleMenu} sx={{ textTransform: 'none', borderRadius: '20px' }}>
              <Avatar alt={user?.firstName} src={userAvatar} sx={{ width: 32, height: 32, mr: 1 }} />
              <Typography sx={{ color: theme.palette.text.primary }}>
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              disableScrollLock  // ✅ Prevents layout shift when menu opens
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
    </ThemeProvider>
  );
};

export default LoggedInNavbar;
