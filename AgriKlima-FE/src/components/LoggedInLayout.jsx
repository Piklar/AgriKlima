// src/components/LoggedInLayout.jsx

import React from 'react';
import LoggedInNavbar from './LoggedInNavbar';
import Footer from './Footer';

const LoggedInLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LoggedInNavbar />
      <main style={{ flexGrow: 1, backgroundColor: '#f9fafb' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LoggedInLayout;