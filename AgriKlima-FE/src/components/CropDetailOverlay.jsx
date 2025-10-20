import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Grid, Paper, Chip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddUserCropModal from './AddUserCropModal';
import { useAuth } from '../context/AuthContext';

// --- Reusable Info Components (aligned with PestDetailOverlay style) ---
const InfoItem = ({ title, content }) => (
  <Box mb={2}>
    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>
      {title}
    </Typography>
    <Paper elevation={0} sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '10px' }}>
      <Typography>{content}</Typography>
    </Paper>
  </Box>
);

const InfoList = ({ title, items }) => (
  <Box mb={2}>
    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>
      {title}
    </Typography>
    {(Array.isArray(items) && items.length > 0)
      ? items.map((item, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              backgroundColor: '#f5f5f5',
              p: 2,
              borderRadius: '10px',
              mb: 1.5
            }}
          >
            <Typography>{item}</Typography>
          </Paper>
        ))
      : <Typography color="text.secondary">None</Typography>
    }
  </Box>
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
        mr: 1.5,
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

// --- Main Overlay Component ---
const CropDetailOverlay = ({ open, onClose, cropData }) => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!cropData) return null;

  const handleCropAdded = () => setIsAddModalOpen(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'Growing Guide':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InfoItem title="Climate Requirements" content={cropData.growingGuide?.climate || 'N/A'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoItem title="Soil Type" content={cropData.growingGuide?.soilType || 'N/A'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoItem title="Water Requirements" content={cropData.growingGuide?.waterNeeds || 'N/A'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoItem title="Fertilizer" content={cropData.growingGuide?.fertilizer || 'N/A'} />
            </Grid>
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
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InfoItem title="Market Price" content={cropData.marketInfo?.priceRange || 'N/A'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem title="Storage Method" content={cropData.marketInfo?.storageMethod || 'N/A'} />
              </Grid>
            </Grid>
            <InfoList title="Cooking Tips" items={cropData.marketInfo?.cookingTips || []} />
          </>
        );
      case 'Overview':
      default:
        return (
          <>
            <InfoItem title="Description" content={cropData.description || 'No description available.'} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InfoItem title="Planting Season" content={cropData.overview?.plantingSeason || 'N/A'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem title="Harvest Time" content={cropData.overview?.harvestTime || 'N/A'} />
              </Grid>
            </Grid>
          </>
        );
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper
          sx={{
            width: '80%',
            maxWidth: 1000,
            maxHeight: '90vh',
            borderRadius: '16px',
            overflowY: 'auto',
            position: 'relative'
          }}
        >
          {/* Close / Exit Button */}
          <IconButton
            onClick={onClose}
            aria-label="Close"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 10,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.55)' }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Hero Section */}
          <Box
            sx={{
              height: 240,
              background: `linear-gradient(to top, rgba(0,0,0,0.45), transparent), url(${cropData.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              color: 'white',
              p: 4
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {cropData.name}
              </Typography>
              <Chip
                label={cropData.season || 'Crop'}
                sx={{ backgroundColor: 'rgba(255,255,255,0.18)', color: 'white', mt: 1 }}
              />

              {isAuthenticated && (
                <Button
                  variant="contained"
                  onClick={() => setIsAddModalOpen(true)}
                  sx={{
                    bgcolor: 'var(--light-green)',
                    color: 'black',
                    mt: 2,
                    '&:hover': { bgcolor: 'white' }
                  }}
                >
                  Add to My Farm
                </Button>
              )}
            </Box>
          </Box>

          {/* Tabs & Content */}
          <Box p={4}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
              <TabButton label="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton label="Growing Guide" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton label="Health & Care" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton label="Market Info" activeTab={activeTab} setActiveTab={setActiveTab} />
            </Box>
            {renderContent()}
          </Box>
        </Paper>
      </Modal>

      {/* Add Crop Modal */}
      <AddUserCropModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        cropData={cropData}
        onCropAdded={handleCropAdded}
      />
    </>
  );
};

export default CropDetailOverlay;
