// src/components/AdminRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  // Assume your useAuth hook also provides the full user object
  // You may need to modify your AuthContext to fetch and store the user profile
  const { isAuthenticated, user, loading } = useAuth();

  // If auth state is still loading, you can show a loader
  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  if (!isAuthenticated) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (!user.isAdmin) {
    // If logged in but not an admin, redirect to the user dashboard
    return <Navigate to="/dashboard" />;
  }

  // If authenticated and is an admin, render the requested component
  return children;
};

export default AdminRoute;