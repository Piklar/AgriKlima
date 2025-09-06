// src/components/LoggedInLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LoggedInNavbar from './LoggedInNavbar';
import Footer from './Footer';
import { Fab } from '@mui/material';
import chatbotIcon from '../assets/images/chatbot-icon.png';
import ChatbotOverlay from './ChatbotOverlay';

const LoggedInLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LoggedInNavbar />
      
      <main style={{ flexGrow: 1, backgroundColor: '#f9fafb' }}>
        <Outlet /> 
      </main>
      
      <Footer />

      {/* Floating Chatbot Button */}
      <Fab
        onClick={() => setIsChatOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 40,
          right: 40,
          width: 56,
          height: 56,
          background: 'linear-gradient(135deg, #6a994e, #ffe066)', // Green → Yellow gradient
          '&:hover': { background: 'linear-gradient(135deg, #5e8c46, #ffd700)' }, // Slightly darker on hover
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.2)', // subtle shadow
        }}
      >
        <img
          src={chatbotIcon}
          alt="Chatbot"
          style={{ width: 32, height: 32, objectFit: 'contain' }}
        />
      </Fab>

      {/* Chatbot Overlay */}
      <ChatbotOverlay
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        sx={{ zIndex: 1400 }} // Optional: ensure overlay appears above FAB
      />
    </div>
  );
};

export default LoggedInLayout;
