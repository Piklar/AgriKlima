// src/components/MyCropsCard.jsx

import React from 'react';
import { Box, Typography, Paper, Button, Skeleton, List, ListItem, ListItemText, Divider, Avatar, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays, formatDistanceToNow } from 'date-fns';
import GrassIcon from '@mui/icons-material/Grass';

const MyCropsCard = ({ userCrops, loading }) => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 3, borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <GrassIcon color="success" sx={{ mr: 1.5, fontSize: '2rem' }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>My Crops</Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
        {loading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} variant="rounded" height={60} sx={{ mb: 2 }} />)
        ) : userCrops.length > 0 ? (
          <List disablePadding>
            {userCrops.map((crop) => {
              const startDate = new Date(crop.plantingDate);
              const endDate = new Date(crop.estimatedHarvestDate);
              const totalDuration = differenceInDays(endDate, startDate) || 1;
              const daysPassed = differenceInDays(new Date(), startDate);
              const progress = Math.min(Math.max((daysPassed / totalDuration) * 100, 0), 100);

              return (
                <ListItem key={crop._id} disablePadding sx={{ mb: 2 }}>
                  <Avatar src={crop.cropId?.imageUrl} variant="rounded" sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.light' }}>
                    <GrassIcon />
                  </Avatar>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{crop.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{Math.round(progress)}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, my: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      Harvest in {formatDistanceToNow(endDate, { addSuffix: true })}
                    </Typography>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">No crops are currently being tracked.</Typography>
            <Button size="small" sx={{ mt: 1 }} onClick={() => navigate('/crops')}>Add a Crop</Button>
          </Box>
        )}
      </Box>
      <Button 
        variant="contained" 
        onClick={() => navigate('/my-farm')}
        sx={{ mt: 2, bgcolor: 'var(--primary-green)', '&:hover': { bgcolor: 'var(--light-green)' } }}
      >
        View Full Farm Overview
      </Button>
    </Paper>
  );
};

export default MyCropsCard;