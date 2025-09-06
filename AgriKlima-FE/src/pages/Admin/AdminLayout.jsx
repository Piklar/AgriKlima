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

// Icons
import GrassIcon from '@mui/icons-material/Grass';
import PestControlIcon from '@mui/icons-material/PestControl';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    background: { default: '#f8f9f8' },
  },
  typography: {
    fontFamily: 'inherit', // Sidebar and menu items inherit font
    h6: { fontFamily: '"Playfair Display", serif', fontWeight: 700 }, // Header
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 'bold', color: 'primary.dark', fontFamily: '"Playfair Display", serif' }}
          >
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
                  transition: 'all 0.3s ease',
                  '&.active': {
                    backgroundColor: 'rgba(46,125,50,0.1)',
                    color: 'primary.main',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(46,125,50,0.08)',
                    transform: 'translateX(2px)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: 'inherit', // inherit font
                      fontWeight: 'normal',
                      fontSize: '1rem',
                      color: 'inherit',
                      transition: 'color 0.3s ease',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Back Button fixed at bottom left */}
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
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText
                primary="Back to App"
                primaryTypographyProps={{
                  sx: {
                    fontFamily: 'inherit', // inherit font
                    fontWeight: 'normal',
                    fontSize: '1rem',
                    color: 'inherit',
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
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
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
