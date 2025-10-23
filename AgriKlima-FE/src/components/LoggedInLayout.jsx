// src/components/LoggedInLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LoggedInNavbar from './LoggedInNavbar';
import Footer from './Footer';

const LoggedInLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LoggedInNavbar />
      
      <main style={{ flexGrow: 1, backgroundColor: '#f9fafb' }}>
        <Outlet /> 
      </main>
      
      <Footer />
    </div>
  );
};

export default LoggedInLayout;
