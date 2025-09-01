// src/components/LoggedInLayout.jsx

import React, { useState } from 'react'; // <-- Import useState
import { Outlet } from 'react-router-dom';
import LoggedInNavbar from './LoggedInNavbar';
import Footer from './Footer';
import { Fab } from '@mui/material'; // <-- Import Fab
import chatbotIcon from '../assets/images/chatbot-icon.png'; // <-- Import the icon
import ChatbotOverlay from './ChatbotOverlay'; // <-- Import the new overlay

const LoggedInLayout = () => {
  // --- ADD STATE TO MANAGE THE CHATBOT VISIBILITY ---
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LoggedInNavbar />
      <main style={{ flexGrow: 1, backgroundColor: '#f9fafb' }}>
        <Outlet /> 
      </main>
      <Footer />

      {/* --- ADD THE CHATBOT FLOATING BUTTON AND OVERLAY --- */}
      <Fab
        onClick={() => setIsChatOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 40,
          right: 40,
          backgroundColor: 'white',
          '&:hover': { backgroundColor: '#f0f0f0' },
          zIndex: 1200
        }}
      >
        <img src={chatbotIcon} alt="Chatbot" style={{ width: '100%', height: '100%' }} />
      </Fab>

      <ChatbotOverlay open={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default LoggedInLayout;