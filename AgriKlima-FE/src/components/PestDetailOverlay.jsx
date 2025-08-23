import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Grid, Paper, Chip } from '@mui/material';

// --- Reusable Info Components ---
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
    {(items && items.length > 0)
      ? items.map((item, index) => (
        <Paper key={index} elevation={0} sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '16px', mb: 1.5 }}>
          <Typography>{item}</Typography>
        </Paper>
      ))
      : <Typography color="text.secondary">N/A</Typography>}
  </>
);

const TabButton = ({ label, activeTab, setActiveTab }) => {
  const isActive = activeTab === label;
  return (
    <Box
      component="button"
      onClick={() => setActiveTab(label)}
      sx={{
        border: 0,
        outline: 0,
        borderRadius: '30px',
        px: 3,
        py: 1,
        mr: 2,
        mb: 1,
        fontWeight: 600,
        fontSize: '1rem',
        backgroundColor: isActive ? 'var(--primary-green)' : '#e0e0e0',
        color: isActive ? 'white' : 'var(--dark-text)',
        cursor: 'pointer',
        textTransform: 'none',
        transition: 'background 0.2s',
        '&:hover': {
          backgroundColor: isActive ? 'var(--light-green)' : '#d5d5d5'
        }
      }}
    >
      {label}
    </Box>
  );
};

const PestDetailOverlay = ({ open, onClose, pestData }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  // When the modal opens, reset the tab to Overview
  useEffect(() => {
    if (open) setActiveTab('Overview');
  }, [open]);

  if (!pestData) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'Identification':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Physical Characteristics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}><InfoItem title="Size" content={pestData.identification?.size || 'N/A'} /></Grid>
              <Grid item xs={6}><InfoItem title="Color" content={pestData.identification?.color || 'N/A'} /></Grid>
              <Grid item xs={6}><InfoItem title="Shape" content={pestData.identification?.shape || 'N/A'} /></Grid>
              <Grid item xs={6}><InfoItem title="Behavior" content={pestData.identification?.behavior || 'N/A'} /></Grid>
            </Grid>
          </>
        );
      case 'Prevention':
        return <InfoList items={pestData.prevention} />;
      case 'Treatment':
        return <InfoList items={pestData.treatment} />;
      case 'Overview':
      default:
        return (
          <>
            <InfoItem title="Description" content={pestData.overview?.description || 'N/A'} />
            <Box mb={2}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>Commonly Affects</Typography>
              {(pestData.overview?.commonlyAffects || []).map(crop => (
                <Chip key={crop} label={crop} sx={{ mr: 1, bgcolor: '#e0e0e0' }} />
              ))}
            </Box>
            <InfoItem title="Seasonal Activity" content={pestData.overview?.seasonalActivity || 'N/A'} />
          </>
        );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper sx={{ width: '80%', maxWidth: '1000px', maxHeight: '90vh', borderRadius: '24px', overflowY: 'auto' }}>
        {/* Hero/Header */}
        <Box
          sx={{
            height: '220px',
            background: `linear-gradient(to top, rgba(0,0,0,0.5), transparent), url(${pestData.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            color: 'white',
            p: 4
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>{pestData.name}</Typography>
            <Chip
              label={`${pestData.riskLevel} Risk`}
              sx={{
                backgroundColor: pestData.riskLevel === 'High' ? '#f44336' : '#ffc107',
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
          <Typography>{pestData.type}</Typography>
        </Box>
        {/* Tabs and Content */}
        <Box p={4}>
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <TabButton label="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton label="Identification" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton label="Prevention" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton label="Treatment" activeTab={activeTab} setActiveTab={setActiveTab} />
          </Box>
          {renderContent()}
        </Box>
      </Paper>
    </Modal>
  );
};

export default PestDetailOverlay;