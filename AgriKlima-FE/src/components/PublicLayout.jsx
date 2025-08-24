// src/components/PublicLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // This is your original public navbar
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* The HomePage will be rendered here */}
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;