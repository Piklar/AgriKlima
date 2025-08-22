// src/pages/Admin/AdminLayout.jsx

import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';

// Icons for the sidebar
import DashboardIcon from '@mui/icons-material/Dashboard';
import GrassIcon from '@mui/icons-material/Grass';
import PestControlIcon from '@mui/icons-material/PestControl';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

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
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <Toolbar /> {/* This is a spacer to push content below the app bar */}
                <Outlet /> {/* Child routes will be rendered here */}
            </Box>
        </Box>
    );
};

export default AdminLayout;