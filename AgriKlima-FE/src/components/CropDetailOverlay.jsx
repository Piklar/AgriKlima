// src/components/CropDetailOverlay.jsx

import React, { useState } from 'react';
import {
  Modal, Box, Typography, Button, Grid, Paper, Chip, IconButton,
  List, ListItem, Avatar, ListItemText,
  // --- ADDED FOR NEW MODAL FLOW ---
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, 
  CircularProgress, TextField, ListItemButton, ListItemAvatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';

// --- ADDED FOR NEW MODAL FLOW ---
import { format } from 'date-fns';
import * as api from '../services/api';
import Swal from 'sweetalert2';

// --- Reusable Info Components ---
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

// -----------------------------------------------------------------------------
// --- ADDED: "ADD CROP" MODAL FLOW COMPONENTS ---
// -----------------------------------------------------------------------------

// STEP 2: Asks if user wants a specific variety or a common one
const VarietyChoiceModal = ({ open, onClose, onChoice, cropName }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle fontWeight="bold">Add {cropName}</DialogTitle>
    <DialogContent>
      <Typography>Are you planting a specific variety of {cropName}, or a common type?</Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2 }}>
      <Button onClick={() => onChoice('common')} variant="outlined">Add as Common Crop</Button>
      <Button onClick={() => onChoice('specific')} variant="contained">Select Specific Variety</Button>
    </DialogActions>
  </Dialog>
);

// STEP 3: Shows list of specific varieties for the selected crop
const VarietySelectionModal = ({ open, onClose, varieties, onSelectVariety, cropName }) => (
  <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Paper sx={{ width: '80%', maxWidth: 700, maxHeight: '80vh', overflowY: 'auto', p: 3, borderRadius: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Select a {cropName} Variety</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>
      <List>
        {varieties.map(variety => (
          <ListItemButton key={variety._id} onClick={() => onSelectVariety(variety)} sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'action.hover' } }}>
            <ListItemAvatar><Avatar src={variety.imageUrl} variant="rounded" sx={{ width: 56, height: 56, mr: 2 }} /></ListItemAvatar>
            <ListItemText primary={variety.name} secondary={`${variety.growingDuration} days growing duration`} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  </Modal>
);

// STEP 4: Final modal to set planting date
const AddPlantingDateModal = ({ open, onClose, varietyData, onCropAdded }) => {
  const [plantingDate, setPlantingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);

  React.useEffect(() => { if (open) setPlantingDate(format(new Date(), 'yyyy-MM-dd')); }, [open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.addUserCrop({ varietyId: varietyData._id, plantingDate });
      Swal.fire('Success', `${varietyData.name} has been added to your farm.`, 'success');
      onCropAdded();
      onClose();
    } catch (err) {
      Swal.fire('Error', 'Could not add crop to farm.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!varietyData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight="bold">Add {varietyData.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography>Please confirm the planting date for this variety.</Typography>
          <TextField 
            label="Planting Date" 
            type="date" 
            value={plantingDate} 
            onChange={(e) => setPlantingDate(e.target.value)} 
            InputLabelProps={{ shrink: true }} 
            fullWidth 
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Add to Farm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


// --- Main Overlay Component ---
const CropDetailOverlay = ({ open, onClose, cropData }) => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');

  // --- ADDED: State for the "Add Crop" modal flow ---
  const [varietiesForCrop, setVarietiesForCrop] = useState([]);
  const [loadingVarieties, setLoadingVarieties] = useState(false);
  const [isVarietyChoiceOpen, setIsVarietyChoiceOpen] = useState(false);
  const [isVarietyListOpen, setIsVarietyListOpen] = useState(false);
  const [isAddPlantingDateOpen, setIsAddPlantingDateOpen] = useState(false);
  const [varietyToAdd, setVarietyToAdd] = useState(null);

  // Reset tab when modal opens
  React.useEffect(() => {
    if (open) {
      setActiveTab('Overview');
    }
  }, [open]);

  if (!cropData) return null;

  
  // --- ADDED: Handlers for the "Add Crop" modal flow ---

  // STEP 2: User chooses "Common" or "Specific"
  const handleVarietyChoice = async (choice) => {
    setIsVarietyChoiceOpen(false);
    setLoadingVarieties(true);

    try {
      // Use the cropData from props to fetch its varieties
      const response = await api.getVarietiesForCrop(cropData._id);
      const varieties = response.data || [];

      if (varieties.length === 0) {
        Swal.fire('No Varieties Found', `There are no varieties listed for ${cropData.name}. Please add one via the admin panel.`, 'info');
        setLoadingVarieties(false);
        return;
      }

      if (choice === 'specific') {
        setVarietiesForCrop(varieties);
        setTimeout(() => setIsVarietyListOpen(true), 300);
      } else { // 'common' choice
        let defaultVariety = varieties.find(v => v.name.toLowerCase().includes('common') || v.name.toLowerCase().includes('generic')) || varieties[0];
        setVarietyToAdd(defaultVariety);
        setTimeout(() => setIsAddPlantingDateOpen(true), 300);
      }
    } catch (error) {
       Swal.fire('Error', 'Could not fetch crop varieties.', 'error');
    } finally {
        setLoadingVarieties(false);
    }
  };
  
  // STEP 3: User picks a specific variety from the list
  const handleVarietySelected = (variety) => {
    setVarietyToAdd(variety);
    setIsVarietyListOpen(false);
    setTimeout(() => setIsAddPlantingDateOpen(true), 300);
  };

  // STEP 4: User confirms planting date, flow is complete
  const handleFinalCropAdd = () => {
    setIsAddPlantingDateOpen(false);
    setVarietyToAdd(null);
    onClose(); // Close the main CropDetailOverlay
  };

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

            {/* --- MODIFIED: This section is now removed as per the new flow --- */}
            {/* <Box mt={4}>
              <Typography variant="h6" ...>Available Varieties</Typography>
              <List> ... </List>
            </Box>
            */}
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
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {cropData.name}
            </Typography>
            <Chip
              label={cropData.season || 'Crop'}
              sx={{ backgroundColor: 'rgba(255,255,255,0.18)', color: 'white', mt: 1, alignSelf: 'flex-start' }}
            />
            
            {/* --- THIS IS THE "ADD" BUTTON --- */}
            {isAuthenticated && (
              <Button 
                variant="contained" 
                size="medium"
                // STEP 1: This button starts the flow
                onClick={() => setIsVarietyChoiceOpen(true)} 
                sx={{ 
                  mt: 2, 
                  bgcolor: 'white', 
                  color: 'primary.dark', 
                  '&:hover': { bgcolor: '#f0f0f0' },
                  alignSelf: 'flex-start'
                }}
              >
                Add to My Farm
              </Button>
            )}
            
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

      {/* --- ADDED: Modals for the "Add Crop" flow --- */}
      <VarietyChoiceModal 
        open={isVarietyChoiceOpen} 
        onClose={() => setIsVarietyChoiceOpen(false)} 
        onChoice={handleVarietyChoice} 
        cropName={cropData?.name} 
      />
      <VarietySelectionModal 
        open={isVarietyListOpen || loadingVarieties} 
        onClose={() => setIsVarietyListOpen(false)} 
        varieties={varietiesForCrop} 
        onSelectVariety={handleVarietySelected} 
        cropName={cropData?.name} 
      />
      <AddPlantingDateModal 
        open={isAddPlantingDateOpen} 
        onClose={() => setIsAddPlantingDateOpen(false)} 
        varietyData={varietyToAdd} 
        onCropAdded={handleFinalCropAdd} 
      />
    </>
  );
};

export default CropDetailOverlay;