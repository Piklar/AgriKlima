import React, { useEffect, useRef } from 'react'; // <-- Import useRef
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    
    // --- THIS IS THE FIX ---
    // We use a ref to track the previous authentication state.
    // This helps us distinguish between a user who was never logged in
    // and a user who just logged out.
    const prevIsAuthenticated = useRef(isAuthenticated);

    useEffect(() => {
        // If loading is finished, the user is NOT authenticated now,
        // AND they were also NOT authenticated in the previous render (e.g., a direct page load),
        // then we show the notification.
        if (!loading && !isAuthenticated && !prevIsAuthenticated.current) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'info',
                title: 'Please log in to access this page.',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }

        // After every check, we update the ref to the current state.
        // This ensures on the next render, it holds the "previous" value.
        prevIsAuthenticated.current = isAuthenticated;

    }, [isAuthenticated, loading]); // This effect runs whenever auth or loading state changes.

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isAuthenticated) {
        return <Outlet />;
    }

    return <Navigate to="/login" />;
};

export default ProtectedRoute;