// src/components/SharedLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- THIS IS THE FIX ---
// Change the import from "./PublicHeader" to "./Header"
import PublicHeader from './Header'; // The navbar for logged-out users

import LoggedInNavbar from './LoggedInNavbar'; // The navbar for logged-in users
import Footer from './Footer'; // The footer is the same for everyone

const SharedLayout = () => {
  // Get the authentication status from our context
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* This conditional logic now works because it can find both components */}
      {isAuthenticated ? <LoggedInNavbar /> : <PublicHeader />}

      {/* The main content of the page will be rendered here */}
      <main style={{ flexGrow: 1, backgroundColor: '#f9fafb' }}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default SharedLayout;