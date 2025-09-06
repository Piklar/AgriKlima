// src/pages/Admin/AdminLayout.jsx
import React from 'react';
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
  createTheme
} from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';

// Icons for the sidebar
import GrassIcon from '@mui/icons-material/Grass';
import PestControlIcon from '@mui/icons-material/PestControl';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const drawerWidth = 240;

// Create theme matching your main app
const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    background: { default: '#f8f9f8' },
  },
  typography: {
    fontFamily: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h6: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
  },
  shape: { borderRadius: 10 },
});

const AdminLayout = () => {
  const menuItems = [
    { text: 'Crops', icon: <GrassIcon />, path: '/admin/crops' },
    { text: 'Pests', icon: <PestControlIcon />, path: '/admin/pests' },
    { text: 'News', icon: <ArticleIcon />, path: '/admin/news' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/admin/tasks' },
    { text: 'Weather', icon: <WbSunnyIcon />, path: '/admin/weather' },
  ];

  const isMobile = useMediaQuery('(max-width:900px)');

  const drawerContent = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          AgriKlima Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                borderRadius: theme.shape.borderRadius,
                mx: 1,
                my: 0.5,
                '&.active': {
                  backgroundColor: 'rgba(46,125,50,0.1)',
                  color: 'primary.main',
                  fontWeight: 'bold',
                },
                '&:hover': {
                  backgroundColor: 'rgba(46,125,50,0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/dashboard"
            sx={{
              borderRadius: theme.shape.borderRadius,
              mx: 1,
              my: 0.5,
              '&:hover': { backgroundColor: 'rgba(46,125,50,0.08)' },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Back to App" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        `}
      </style>
      <Box sx={{ display: 'flex' }}>
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
          open={!isMobile || undefined}
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
