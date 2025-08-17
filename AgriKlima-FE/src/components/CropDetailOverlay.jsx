// src/components/CropDetailOverlay.jsx

import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Grid, Paper, Chip } from '@mui/material';
import wheatHeroImg from '../assets/images/crop-wheat-large.jpg'; // The hero image

// --- Reusable Component for Info Items ---
const InfoItem = ({ title, content }) => (
  <Box mb={3}>
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
    <Paper elevation={0} sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '16px' }}>
      <Typography>{content}</Typography>
    </Paper>
  </Box>
);

const InfoList = ({ title, items }) => (
    <Box mb={3}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
      {items.map((item, index) => (
         <Paper key={index} elevation={0} sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '16px', mb: 1.5 }}>
            <Typography>{item}</Typography>
        </Paper>
      ))}
    </Box>
);


// --- Main Overlay Component ---
const CropDetailOverlay = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Growing Guide':
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}><InfoItem title="Climate Requirements" content="Wheat needs at least 6-8 hours of direct sunlight per day." /></Grid>
            <Grid item xs={12} md={6}><InfoItem title="Soil Type" content="Wheat can grow in various soil types, but it prefers well-drained, fertile soils." /></Grid>
            <Grid item xs={12} md={6}><InfoItem title="Water Requirements" content="The crop requires between 300 mm and 500 mm of water throughout its entire growth cycle." /></Grid>
            <Grid item xs={12} md={6}><InfoItem title="Fertilizer" content="Proper fertilization: Nitrogen (N), Phosphorus (P), Potassium (K)." /></Grid>
          </Grid>
        );
      case 'Health & Care':
        return (
            <>
                <InfoList title="Common Diseases" items={['Rust', 'Leaf Spot', 'Smut']} />
                <InfoList title="Pest Control" items={['Aphids Management', 'Termite Control', 'Regular Field Inspection']} />
                <InfoList title="Nutritional Value" items={['Primarily composed of Carbohydrates', 'Provide protein, fiber, and various vitamins and minerals']} />
            </>
        );
      case 'Market Info':
         return (
            <>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}><InfoItem title="Market Price" content="PHP 41.77 to PHP 213.49 per kilogram" /></Grid>
                    <Grid item xs={12} md={6}><InfoItem title="Storage Method" content="Store in dry, cold place" /></Grid>
                </Grid>
                <InfoList title="Cooking Tips" items={['Perfect for Breadmaking', 'Can be ground into Flour', 'Used in various baked goods']} />
            </>
        );
      case 'Overview':
      default:
        return (
            <>
                <Typography sx={{ mb: 3 }}>
                    A wheat crop refers to the cultivated plants of the genus Triticum, which are a type of cereal grass. The term also refers to the edible grain produced by these plants. Wheat is one of the oldest and most important staple food crops in the world.
                </Typography>
                 <Grid container spacing={4}>
                    <Grid item xs={12} md={6}><InfoItem title="Planting Season" content="In the Philippines, wheat is typically grown in two main seasons. The planting and harvesting times can vary slightly depending on the specific region." /></Grid>
                    <Grid item xs={12} md={6}><InfoItem title="Harvest Time" content="Main season: Planted from June to July, and harvested from October to December." /></Grid>
                </Grid>
            </>
        );
    }
  };

  const TabButton = ({ label }) => {
    const isActive = activeTab === label;
    return (
        <Button
            onClick={() => setActiveTab(label)}
            sx={{
                borderRadius: '30px',
                padding: '10px 25px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 600,
                backgroundColor: isActive ? 'var(--primary-green)' : '#e0e0e0',
                color: isActive ? 'white' : 'var(--dark-text)',
                '&:hover': {
                    backgroundColor: isActive ? 'var(--light-green)' : '#d5d5d5',
                },
            }}
        >
            {label}
        </Button>
    );
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ width: '80%', maxWidth: '1000px', maxHeight: '90vh', borderRadius: '24px', overflowY: 'auto' }}>
        {/* Hero Section */}
        <Box
          sx={{
            height: '250px',
            background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${wheatHeroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            color: 'white',
            p: 4,
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: 'bold' }}>Wheat</Typography>
          <Chip label="Cereal" sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', mt: 1 }} />
        </Box>

        {/* Main Content */}
        <Box p={4}>
          {/* Tab Navigation */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <TabButton label="Overview" />
            <TabButton label="Growing Guide" />
            <TabButton label="Health & Care" />
            <TabButton label="Market Info" />
          </Box>

          {/* Tab Content */}
          {renderContent()}
        </Box>
      </Paper>
    </Modal>
  );
};

export default CropDetailOverlay;