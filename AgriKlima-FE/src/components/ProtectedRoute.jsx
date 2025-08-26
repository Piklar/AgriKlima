// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = () => {
    // We now get all three values from the context.
    const { isAuthenticated, user, loading } = useAuth();

    console.log('[DEBUG] ProtectedRoute Check -> Loading:', loading, '| Authenticated:', isAuthenticated, '| User:', user);

    // 1. If the context is still loading, we MUST show a loading indicator.
    // This is the most important part of the fix.
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // 2. After loading is finished, we check if the user is authenticated.
    // The `Outlet` renders the child route (e.g., your LoggedInLayout).
    if (isAuthenticated) {
        return <Outlet />;
    }

    // 3. If not loading and not authenticated, redirect to login.
    return <Navigate to="/login" />;
};

export default ProtectedRoute;