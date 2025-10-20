// src/pages/Admin/AdminLayout.jsx
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  IconButton,
} from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';

// Icons
import GrassIcon from '@mui/icons-material/Grass';
import PestControlIcon from '@mui/icons-material/PestControl';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    background: { default: '#f8f9f8' },
  },
  typography: {
    fontFamily: 'inherit',
    h6: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
  },
  shape: { borderRadius: 10 },
});

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  const menuItems = [
    { text: 'Crops', icon: <GrassIcon />, path: '/admin/crops' },
    { text: 'Pests', icon: <PestControlIcon />, path: '/admin/pests' },
    { text: 'News', icon: <ArticleIcon />, path: '/admin/news' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/admin/tasks' },
    { text: 'Weather', icon: <WbSunnyIcon />, path: '/admin/weather' },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box>
        <Toolbar sx={{ justifyContent: 'space-between', px: 1 }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 'bold',
              color: 'primary.dark',
              fontFamily: '"Playfair Display", serif',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '70%',
            }}
          >
            AgriKlima Admin
          </Typography>
          {isMobile && mobileOpen && (
            <IconButton onClick={() => setMobileOpen(false)}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  borderRadius: theme.shape.borderRadius,
                  mx: 1,
                  my: 0.5,
                  transition: 'all 0.3s ease',
                  '&.active': {
                    backgroundColor: 'rgba(46,125,50,0.1)',
                    color: 'primary.main',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(46,125,50,0.08)',
                    transform: 'translateX(2px)',
                  },
                  px: { xs: 1, sm: 2 },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main', minWidth: { xs: 30, sm: 40 } }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: 'inherit',
                      fontWeight: 'normal',
                      fontSize: { xs: '0.8rem', sm: '1rem' },
                      color: 'inherit',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mt: 'auto', mb: 2 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/dashboard"
              sx={{
                borderRadius: theme.shape.borderRadius,
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(46,125,50,0.08)',
                  transform: 'translateX(2px)',
                },
                transition: 'all 0.3s ease',
                px: { xs: 1, sm: 2 },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main', minWidth: { xs: 30, sm: 40 } }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText
                primary="Back to App"
                primaryTypographyProps={{
                  sx: {
                    fontFamily: 'inherit',
                    fontWeight: 'normal',
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');`}
      </style>
      <Box sx={{ display: 'flex' }}>
        {/* Menu Icon: Only shows on mobile when drawer is closed */}
        {isMobile && !mobileOpen && (
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ position: 'fixed', top: 16, left: 16, zIndex: 2000, bgcolor: 'white', borderRadius: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#ffffff',
            },
          }}
          variant={isMobile ? 'temporary' : 'permanent'}
          anchor="left"
          open={!isMobile || mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          {drawerContent}
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: '#f4f6f8',
            p: { xs: 2, md: 3 },
            minHeight: '100vh',
            width: '100%',
            transition: 'margin 0.3s ease',
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;