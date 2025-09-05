// src/pages/MyFarmPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Box, Typography, Grid, Card, CardContent, Button, 
  LinearProgress, Paper, ThemeProvider 
} from '@mui/material';
import * as api from '../services/api';
import Swal from 'sweetalert2';
import PageDataLoader from '../components/PageDataLoader';
import { format, differenceInDays } from 'date-fns';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    secondary: { main: '#ffa000', light: '#ffc107', dark: '#ff8f00' },
    background: { default: '#f8f9f8' },
  },
  typography: {
    fontFamily: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.8rem', lineHeight: 1.2 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: '1.8rem' },
    body1: { fontSize: '1.1rem', lineHeight: 1.7 },
    body2: { fontSize: '1rem', lineHeight: 1.6 },
  },
  shape: { borderRadius: 12 },
});

const CropProgressCard = ({ crop, onDelete }) => {
  const today = new Date();
  const startDate = new Date(crop.plantingDate);
  const endDate = new Date(crop.estimatedHarvestDate);

  const totalDuration = differenceInDays(endDate, startDate);
  const daysPassed = differenceInDays(today, startDate);
  const progress = Math.min(Math.max((daysPassed / totalDuration) * 100, 0), 100);

  const handleDelete = () => {
    Swal.fire({
      title: `Harvest ${crop.name}?`,
      text: "This will remove the crop from your farm. This action cannot be undone.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, harvest it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        onDelete(crop._id);
      }
    });
  };

  return (
    <Card sx={{ 
      borderRadius: '10px', 
      boxShadow: 3, 
      width: '100%',
      maxWidth: { xs: '100%', sm: 360 }, // full width on xs, fixed on sm+
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 1 }}>
          {crop.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Planted on: {format(startDate, 'MMMM d, yyyy')}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: 'rgba(46, 125, 50, 0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'primary.main'
              }
            }} 
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Estimated Harvest: <strong style={{ color: 'primary.dark' }}>{format(endDate, 'MMMM d, yyyy')}</strong>
        </Typography>

        <Button 
          variant="contained" 
          onClick={handleDelete}
          fullWidth
          sx={{ 
            mt: 3, 
            borderRadius: '10px',
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          Mark as Harvested
        </Button>
      </CardContent>
    </Card>
  );
};

const MyFarmPage = () => {
  const [userCrops, setUserCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserCrops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getUserCrops();
      setUserCrops(response.data || []);
    } catch (err) {
      console.error("Failed to fetch user crops:", err);
      setError("Could not load your farm data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserCrops();
  }, [fetchUserCrops]);

  const handleDeleteCrop = async (userCropId) => {
    try {
      await api.deleteUserCrop(userCropId);
      Swal.fire('Harvested!', 'The crop has been removed from your farm.', 'success');
      fetchUserCrops();
    } catch (err) {
      console.error("Failed to delete crop:", err);
      Swal.fire('Error', 'Could not remove the crop.', 'error');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        `}
      </style>
      
      <PageDataLoader loading={loading} error={error} onRetry={fetchUserCrops}>
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 4 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                My Farm Overview
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Track the progress of your crops and manage your farming activities
              </Typography>
            </Box>

            {userCrops.length > 0 ? (
              <Grid 
                container 
                spacing={4} 
                justifyContent="center" // center cards
              >
                {userCrops.map(crop => (
                  <Grid 
                    item 
                    xs={12} sm={6} md={4} 
                    key={crop._id} 
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <CropProgressCard crop={crop} onDelete={handleDeleteCrop} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ 
                p: 6, 
                textAlign: 'center', 
                borderRadius: '10px',
                backgroundColor: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                maxWidth: '500px',
                mx: 'auto'
              }}>
                <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                  Your farm is empty!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Go to the 'Crops' page to add your first planted crop.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ borderRadius: theme.shape.borderRadius }}
                  onClick={() => window.location.href = '/crops'}
                >
                  Browse Crops
                </Button>
              </Paper>
            )}
          </Container>
        </Box>
      </PageDataLoader>
    </ThemeProvider>
  );
};

export default MyFarmPage;
