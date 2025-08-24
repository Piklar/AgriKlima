import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Grid, Paper, Chip } from '@mui/material';

// --- Reusable Info Components ---
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
    {(Array.isArray(items) && items.length > 0)
      ? items.map((item, index) => (
          <Paper key={index} elevation={0} sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '16px', mb: 1.5 }}>
            <Typography>{item}</Typography>
          </Paper>
        ))
      : <Typography color="text.secondary" sx={{pl:1}}>None</Typography>
    }
  </Box>
);

// --- Main Overlay Component ---
const CropDetailOverlay = ({ open, onClose, cropData }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!cropData) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'Growing Guide':
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}><InfoItem title="Climate Requirements" content={cropData.growingGuide?.climate || 'N/A'} /></Grid>
            <Grid item xs={12} md={6}><InfoItem title="Soil Type" content={cropData.growingGuide?.soilType || 'N/A'} /></Grid>
            <Grid item xs={12} md={6}><InfoItem title="Water Requirements" content={cropData.growingGuide?.waterNeeds || 'N/A'} /></Grid>
            <Grid item xs={12} md={6}><InfoItem title="Fertilizer" content={cropData.growingGuide?.fertilizer || 'N/A'} /></Grid>
          </Grid>
        );
      case 'Health & Care':
        return (
          <>
            <InfoList title="Common Diseases" items={cropData.healthCare?.commonDiseases || []} />
            <InfoList title="Pest Control" items={cropData.healthCare?.pestControl || []} />
            <InfoList title="Nutritional Value" items={cropData.healthCare?.nutritionalValue || []} />
          </>
        );
      case 'Market Info':
        return (
          <>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}><InfoItem title="Market Price" content={cropData.marketInfo?.priceRange || 'N/A'} /></Grid>
              <Grid item xs={12} md={6}><InfoItem title="Storage Method" content={cropData.marketInfo?.storageMethod || 'N/A'} /></Grid>
            </Grid>
            <InfoList title="Cooking Tips" items={cropData.marketInfo?.cookingTips || []} />
          </>
        );
      case 'Overview':
      default:
        return (
          <>
            <Typography sx={{ mb: 3 }}>{cropData.description || 'No description available.'}</Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}><InfoItem title="Planting Season" content={cropData.overview?.plantingSeason || 'N/A'} /></Grid>
              <Grid item xs={12} md={6}><InfoItem title="Harvest Time" content={cropData.overview?.harvestTime || 'N/A'} /></Grid>
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
            background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${cropData.imageUrl})`,
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
          <Typography variant="h2" sx={{ fontWeight: 'bold' }}>{cropData.name}</Typography>
          <Chip label={cropData.season || 'Crop'} sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', mt: 1 }} />
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