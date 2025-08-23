// src/components/PublicHomeRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicHomeRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // While we're checking the auth status, don't render anything yet
    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    // If the user IS authenticated, redirect them to their dashboard.
    // They should not see the public landing page again.
    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    // If they are NOT authenticated, render the child component (the PublicLayout and HomePage).
    return <Outlet />;
};

export default PublicHomeRoute;