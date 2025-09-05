// src/pages/MyFarmPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button, LinearProgress, Paper } from '@mui/material';
import * as api from '../services/api';
import Swal from 'sweetalert2';
import PageDataLoader from '../components/PageDataLoader';
import { format, differenceInDays } from 'date-fns';

const CropProgressCard = ({ crop, onDelete }) => {
  const today = new Date();
  const startDate = new Date(crop.plantingDate);
  const endDate = new Date(crop.estimatedHarvestDate);

  const totalDuration = differenceInDays(endDate, startDate);
  const daysPassed = differenceInDays(today, startDate);
  
  // Calculate progress percentage, ensuring it's between 0 and 100
  const progress = Math.min(Math.max((daysPassed / totalDuration) * 100, 0), 100);

  const handleDelete = () => {
    Swal.fire({
      title: `Harvest ${crop.name}?`,
      text: "This will remove the crop from your farm. This action cannot be undone.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6a994e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, harvest it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        onDelete(crop._id);
      }
    });
  };

  return (
    <Card sx={{ borderRadius: '16px', boxShadow: 3, height: '100%' }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{crop.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Planted on: {format(startDate, 'MMMM d, yyyy')}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{Math.round(progress)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Estimated Harvest: <strong>{format(endDate, 'MMMM d, yyyy')}</strong>
        </Typography>

        <Button 
          variant="contained" 
          onClick={handleDelete}
          fullWidth
          sx={{ mt: 3, bgcolor: 'var(--primary-green)', '&:hover': { bgcolor: 'var(--light-green)' } }}
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
      fetchUserCrops(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete crop:", err);
      Swal.fire('Error', 'Could not remove the crop.', 'error');
    }
  };

  return (
    <PageDataLoader loading={loading} error={error} onRetry={fetchUserCrops}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4 }}>My Farm Overview</Typography>
        {userCrops.length > 0 ? (
          <Grid container spacing={4}>
            {userCrops.map(crop => (
              <Grid item xs={12} sm={6} md={4} key={crop._id}>
                <CropProgressCard crop={crop} onDelete={handleDeleteCrop} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '16px' }}>
            <Typography variant="h6">Your farm is empty!</Typography>
            <Typography color="text.secondary">
              Go to the 'Crops' page to add your first planted crop.
            </Typography>
          </Paper>
        )}
      </Container>
    </PageDataLoader>
  );
};

export default MyFarmPage;