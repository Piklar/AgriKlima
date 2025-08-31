// src/pages/Admin/AdminLayout.jsx

import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';

// Icons for the sidebar
import GrassIcon from '@mui/icons-material/Grass';
import PestControlIcon from '@mui/icons-material/PestControl';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // <-- Import new icon

const drawerWidth = 240;

const AdminLayout = () => {
    const menuItems = [
        { text: 'Crops', icon: <GrassIcon />, path: '/admin/crops' },
        { text: 'Pests', icon: <PestControlIcon />, path: '/admin/pests' },
        { text: 'News', icon: <ArticleIcon />, path: '/admin/news' },
        { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Tasks', icon: <TaskIcon />, path: '/admin/tasks' },
        { text: 'Weather', icon: <WbSunnyIcon />, path: '/admin/weather' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">AgriKlima Admin</Typography>
                </Toolbar>
                <Divider />
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton component={NavLink} to={item.path}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                {/* --- ADDED: Back to App Button --- */}
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={NavLink} to="/dashboard">
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary="Back to App" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f4f6f8', p: 3, minHeight: '100vh' }}>
                <Toolbar /> {/* This is a spacer to push content below the app bar */}
                <Outlet /> {/* Child routes will be rendered here */}
            </Box>
        </Box>
    );
};

export default AdminLayout;