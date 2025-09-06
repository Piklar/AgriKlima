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
  Divider,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

// Icon Imports
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const LoggedInNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Home' },
    { to: '/my-farm', label: 'My Farm' },
    { to: '/about', label: 'About Us' },
    { to: '/weather', label: 'Weather' },
    { to: '/crops', label: 'Crops' },
    { to: '/pests', label: 'Pests' },
    { to: '/calendar', label: 'Calendar' },
    { to: '/news', label: 'News' },
  ];

  const navLinkStyle = {
    fontWeight: 'normal',
    color: 'var(--dark-text)',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    transition: 'background-color 0.2s ease-in-out',
    fontFamily: 'inherit',
  };

  const activeNavLinkStyle = {
    fontWeight: 'bold',
    backgroundColor: 'rgba(106, 153, 78, 0.1)',
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={1}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        padding: '10px 5%',
        fontFamily: 'inherit', // inherit font for AppBar
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'inherit',
        }}
      >
        {/* Logo */}
        <Box sx={{ flexGrow: 0 }}>
          <NavLink to="/dashboard">
            <img src={logo} alt="AgriKlima Logo" style={{ height: '45px', display: 'block' }} />
          </NavLink>
        </Box>

        {/* Centered Navigation Links */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            gap: 2,
            fontFamily: 'inherit',
          }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeNavLinkStyle : {}) })}
            >
              {link.label}
            </NavLink>
          ))}

          {user?.isAdmin && (
            <Button
              component={NavLink}
              to="/admin/crops"
              variant="contained"
              size="small"
              startIcon={<AdminPanelSettingsIcon />}
              sx={{
                bgcolor: 'var(--primary-green)',
                '&:hover': { bgcolor: 'var(--light-green)' },
                textTransform: 'none',
                fontFamily: 'inherit',
              }}
            >
              Admin Panel
            </Button>
          )}
        </Box>

        {/* Mobile Hamburger Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton onClick={handleOpenNavMenu} color="inherit">
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {navLinks.map((link) => (
              <MenuItem
                key={link.to}
                onClick={() => {
                  navigate(link.to);
                  handleCloseNavMenu();
                }}
                sx={{ fontFamily: 'inherit' }}
              >
                {link.label}
              </MenuItem>
            ))}
            {user?.isAdmin && (
              <MenuItem
                onClick={() => {
                  navigate('/admin/crops');
                  handleCloseNavMenu();
                }}
                sx={{ fontFamily: 'inherit' }}
              >
                Admin Panel
              </MenuItem>
            )}
          </Menu>
        </Box>

        {/* User Profile */}
        <Box sx={{ ml: 2, flexGrow: 0 }}>
          <Button onClick={handleOpenUserMenu} sx={{ textTransform: 'none', borderRadius: '20px', p: 0.5 }}>
            <Avatar
              alt={user?.firstName}
              src={user?.profilePictureUrl}
              sx={{ width: 32, height: 32, mr: 1, bgcolor: 'var(--primary-green)' }}
            >
              {!user?.profilePictureUrl && <AccountCircleIcon />}
            </Avatar>
            <Typography
              sx={{
                color: 'var(--dark-text)',
                display: { xs: 'none', md: 'block' },
                fontFamily: 'inherit', // <-- this ensures font inheritance
              }}
            >
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </Typography>
          </Button>
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                navigate('/profile');
              }}
              sx={{ fontFamily: 'inherit' }}
            >
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Profile & Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ fontFamily: 'inherit' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LoggedInNavbar;
