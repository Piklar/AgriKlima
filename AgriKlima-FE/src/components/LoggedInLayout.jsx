// src/components/LoggedInLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- STEP 1: IMPORT Outlet
import LoggedInNavbar from './LoggedInNavbar';
import Footer from './Footer';

const LoggedInLayout = () => { // <-- Note: The 'children' prop is no longer needed
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LoggedInNavbar />
      <main style={{ flexGrow: 1, backgroundColor: '#f9fafb' }}>
        <Outlet /> {/* <-- STEP 2: REPLACE {children} WITH <Outlet /> */}
      </main>
      <Footer />
    </div>
  );
};

export default LoggedInLayout;