// src/components/AdminRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  // --- THIS IS THE KEY FIX ---
  // 1. If the authentication state is still being determined, show a loading spinner.
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Verifying access...</Typography>
      </Box>
    );
  }

  // 2. After loading, check if the user is authenticated AND is an admin.
  if (isAuthenticated && user?.isAdmin) {
    // If they are, render the child component (in our case, the AdminLayout).
    return <Outlet />; // Using Outlet is a great practice for nested routes
  }

  // 3. If they are not authenticated, or not an admin, redirect them.
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  } else {
    // If they are logged in but NOT an admin
    return <Navigate to="/dashboard" />;
  }
};

export default AdminRoute;