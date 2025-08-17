// src/components/NewsSummaryOverlay.jsx

import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Paper, Chip, List, ListItem, ListItemIcon } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Reusable Quote component
const QuoteItem = ({ text }) => (
    <Paper elevation={0} sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '16px', mb: 2 }}>
        <Typography>"{text}"</Typography>
    </Paper>
);

// Main Overlay Component
const NewsSummaryOverlay = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState('Full Article');

  const renderContent = () => {
    switch (activeTab) {
      case 'Key Points':
        return (
            <>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Key Highlights</Typography>
                <List>
                    <ListItem><ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>Modern machines and farming tools</ListItem>
                    <ListItem><ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>More land and water areas for agriculture use</ListItem>
                    <ListItem><ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>Irrigation infrastructure development</ListItem>
                </List>
            </>
        );
      case 'Quotes':
        return (
             <>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Notable Quotes</Typography>
                <QuoteItem text="Norem ako dito madame" />
                <QuoteItem text="Norem ako dito madame" />
            </>
        );
      case 'Impact':
        return (
             <>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Expected Impact</Typography>
                <Paper elevation={0} sx={{ backgroundColor: '#f5f5f5', p: 3, borderRadius: '16px' }}>
                    <Typography variant="h6" sx={{fontWeight: 600}}>Agricultural Impact</Typography>
                    <Typography>Lorem Ipsum keme keme route</Typography>
                </Paper>
            </>
        );
      case 'Full Article':
      default:
        return (
             <>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Full Article</Typography>
                <Typography>
                    Lorem, Full Article. On November 3, 2023, Francisco P Tiu Laurel, Jr. took his oath as Secretary of the Department of Agriculture...
                </Typography>
             </>
        );
    }
  };

  const TabButton = ({ label }) => {
    const isActive = activeTab === label;
    return (
        <Button onClick={() => setActiveTab(label)} sx={{ borderRadius: '30px', px: 3, py: 1, textTransform: 'none', fontSize: '1rem', fontWeight: 600, backgroundColor: isActive ? 'var(--primary-green)' : '#e0e0e0', color: isActive ? 'white' : 'var(--dark-text)', '&:hover': { backgroundColor: isActive ? 'var(--light-green)' : '#d5d5d5' }}}>
            {label}
        </Button>
    );
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ position: 'relative', width: '85%', maxWidth: '1100px', height: '85vh', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {/* --- Green Header Section --- */}
        <Box sx={{ backgroundColor: '#81c784', p: 4, color: '#1b5e20' }}>
            <Box sx={{display: 'flex', gap: 2, mb: 2}}>
                <Chip label="News Type" sx={{bgcolor: 'rgba(0,0,0,0.1)', color: 'inherit'}}/>
                <Typography sx={{alignSelf: 'center'}}>News Duration</Typography>
            </Box>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'black' }}>News Title</Typography>
            <Typography sx={{color: '#212121'}}>Date * Author</Typography>
        </Box>

        {/* --- Main Content Section --- */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
            {/* Tab Navigation */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <TabButton label="Full Article" />
                <TabButton label="Key Points" />
                <TabButton label="Quotes" />
                <TabButton label="Impact" />
            </Box>

            {/* Tab Content */}
            {renderContent()}
        </Box>

        {/* --- Close Button --- */}
        <Button 
            onClick={onClose}
            sx={{ 
                position: 'absolute', 
                bottom: 24, 
                right: 24, 
                borderRadius: '30px', 
                backgroundColor: '#424242', 
                color: 'white', 
                textTransform: 'none',
                fontSize: '1rem',
                px: 3, 
                py: 1,
                '&:hover': {
                    backgroundColor: '#616161'
                }
            }}
        >
            Close Article
        </Button>
      </Paper>
    </Modal>
  );
};

export default NewsSummaryOverlay;