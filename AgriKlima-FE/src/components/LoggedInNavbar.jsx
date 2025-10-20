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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        px: { xs: 2, sm: 3, md: '5%' },
        py: { xs: 1, sm: 1.2, md: 1.5 },
        fontFamily: 'inherit',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          minHeight: { xs: 56, sm: 64, md: 70 },
          gap: { xs: 1, sm: 2 },
          fontFamily: 'inherit',
        }}
      >
        {/* Logo */}
        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
          <NavLink to="/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={logo}
              alt="AgriKlima Logo"
              style={{
                height: 'auto',
                width: 'auto',
                maxHeight: '40px',
                objectFit: 'contain',
              }}
            />
          </NavLink>
        </Box>

        {/* Centered Navigation Links */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: { md: 1.5, lg: 2 },
            flexWrap: 'wrap',
            fontFamily: 'inherit',
          }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                ...navLinkStyle,
                ...(isActive ? activeNavLinkStyle : {}),
              })}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: { md: '0.95rem', lg: '1rem' },
                  fontWeight: 'inherit',
                  fontFamily: 'inherit',
                }}
              >
                {link.label}
              </Typography>
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
                fontSize: { md: '0.8rem', lg: '0.9rem' },
                py: { md: 0.4, lg: 0.5 },
                px: { md: 1.2, lg: 1.8 },
                borderRadius: '8px',
                fontFamily: 'inherit',
              }}
            >
              Admin Panel
            </Button>
          )}
        </Box>

        {/* User Profile + Burger beside */}
        <Box
          sx={{
            ml: { xs: 1, sm: 2 },
            flexGrow: 0,
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          {/* Burger Menu beside Avatar */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                p: 0.8,
                borderRadius: 2,
                backgroundColor: 'rgba(106,153,78,0.05)',
                '&:hover': { backgroundColor: 'rgba(106,153,78,0.15)' },
              }}
            >
              <MenuIcon sx={{ fontSize: 26, color: 'var(--dark-text)' }} />
            </IconButton>
          </Box>

          {/* Avatar */}
          <Button
            onClick={handleOpenUserMenu}
            sx={{
              textTransform: 'none',
              borderRadius: '20px',
              p: { xs: 0.2, sm: 0.5 },
              display: 'flex',
              alignItems: 'center',
              minWidth: 'unset',
            }}
          >
            <Avatar
              alt={user?.firstName}
              src={user?.profilePictureUrl}
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                mr: { xs: 0.5, sm: 1 },
                bgcolor: 'var(--primary-green)',
              }}
            >
              {!user?.profilePictureUrl && <AccountCircleIcon />}
            </Avatar>
            <Typography
              sx={{
                color: 'var(--dark-text)',
                display: { xs: 'none', sm: 'block', md: 'block' },
                fontSize: { sm: '0.9rem', md: '1rem' },
                fontFamily: 'inherit',
              }}
            >
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </Typography>
          </Button>
        </Box>

        {/* Mobile Menu */}
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
              sx={{ fontFamily: 'inherit', fontSize: '0.95rem' }}
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
              sx={{ fontFamily: 'inherit', fontSize: '0.95rem' }}
            >
              Admin Panel
            </MenuItem>
          )}
        </Menu>

        {/* User Menu */}
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
      </Toolbar>
    </AppBar>
  );
};

export default LoggedInNavbar;
