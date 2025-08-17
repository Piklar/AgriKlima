// src/components/PestDetailOverlay.jsx

import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Grid, Paper, Chip } from '@mui/material';
import aphidsHeroImg from '../assets/images/pest-aphids-hero.jpg';

// Reusable Info Item components (can be moved to a shared file later)
const InfoItem = ({ title, content }) => (
  <Box mb={2}>
    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>{title}</Typography>
    <Paper elevation={0} sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '16px' }}>
      <Typography>{content}</Typography>
    </Paper>
  </Box>
);

const InfoList = ({ items }) => (
    <>
      {items.map((item, index) => (
         <Paper key={index} elevation={0} sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '16px', mb: 1.5 }}>
            <Typography>{item}</Typography>
        </Paper>
      ))}
    </>
);

// Main Overlay Component
const PestDetailOverlay = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Identification':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Physical Characteristics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}><InfoItem title="Size" content="1 - 10 mm long" /></Grid>
              <Grid item xs={6}><InfoItem title="Color" content="Green, Black, Red, or White" /></Grid>
              <Grid item xs={6}><InfoItem title="Shape" content="Pear-shaped body with long antennae" /></Grid>
              <Grid item xs={6}><InfoItem title="Behavior" content="Cluster on stems and undersides of leaves" /></Grid>
            </Grid>
          </>
        );
      case 'Prevention':
        return <InfoList items={['Use reflective mulches to deter aphids', 'Plant companion crops like marigolds and nasturtiums', 'Encourage beneficial insects like ladybugs', 'Regular inspection of plants']} />;
      case 'Treatment':
        return <InfoList items={['Spray with insecticidal soap solution', 'Use neem oil applications', 'Introduce ladybugs and lacewings', 'Use garlic or pepper spray']} />;
      case 'Overview':
      default:
        return (
          <>
            <InfoItem title="Description" content="Small, soft-bodied insects that feed on plant sap and can cause significant damage to crops." />
            <Box mb={2}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>Commonly Affects</Typography>
                <Chip label="Tomato" sx={{ mr: 1, backgroundColor: '#ffc107', color: 'black' }} />
                <Chip label="Pepper" sx={{ mr: 1, backgroundColor: '#ffc107', color: 'black' }} />
                <Chip label="Lettuce" sx={{ backgroundColor: '#ffc107', color: 'black' }} />
            </Box>
            <InfoItem title="Seasonal Activity" content="Most active in spring and fall, peak in warm weather" />
          </>
        );
    }
  };

  const TabButton = ({ label }) => {
    const isActive = activeTab === label;
    return (
        <Button onClick={() => setActiveTab(label)} sx={{ borderRadius: '30px', px: 3, py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 600, backgroundColor: isActive ? 'var(--primary-green)' : '#e0e0e0', color: isActive ? 'white' : 'var(--dark-text)', '&:hover': { backgroundColor: isActive ? 'var(--light-green)' : '#d5d5d5' }}}>
            {label}
        </Button>
    );
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ width: '80%', maxWidth: '1000px', maxHeight: '90vh', borderRadius: '24px', overflowY: 'auto' }}>
        {/* Hero Section */}
        <Box sx={{ height: '220px', background: `linear-gradient(to top, rgba(0,0,0,0.5), transparent), url(${aphidsHeroImg})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: 'white', p: 4 }}>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>Aphids</Typography>
            <Chip label="High Risk" sx={{ backgroundColor: '#f44336', color: 'white', fontWeight: 600 }} />
          </Box>
          <Typography>Insect Pest / Scientific Name-crap</Typography>
        </Box>

        {/* Main Content */}
        <Box p={4}>
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <TabButton label="Overview" />
            <TabButton label="Identification" />
            <TabButton label="Prevention" />
            <TabButton label="Treatment" />
          </Box>
          {renderContent()}
        </Box>
      </Paper>
    </Modal>
  );
};

export default PestDetailOverlay;