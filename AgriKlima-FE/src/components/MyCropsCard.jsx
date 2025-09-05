// src/components/MyCropsCard.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Skeleton,
  List,
  ListItem,
  Divider,
  Avatar,
  LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import GrassIcon from '@mui/icons-material/Grass';

const MyCropsCard = ({ userCrops, loading }) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: '10px', // ← custom radius
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: (theme) => theme.palette.background.paper,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 28px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <GrassIcon sx={{ mr: 1.5, fontSize: '2rem', color: (theme) => theme.palette.primary.main }} />
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: (theme) => theme.palette.primary.main,
          }}
        >
          My Crops
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={60} sx={{ mb: 2, borderRadius: '10px' }} />
          ))
        ) : userCrops.length > 0 ? (
          <List disablePadding>
            {userCrops.map((crop) => {
              const startDate = new Date(crop.plantingDate);
              const endDate = new Date(crop.estimatedHarvestDate);
              const totalDuration = differenceInDays(endDate, startDate) || 1;
              const daysPassed = differenceInDays(new Date(), startDate);
              const progress = Math.min(Math.max((daysPassed / totalDuration) * 100, 0), 100);

              return (
                <ListItem
                  key={crop._id}
                  disablePadding
                  sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    src={crop.cropId?.imageUrl}
                    variant="rounded"
                    sx={{
                      width: 56,
                      height: 56,
                      mr: 2,
                      bgcolor: (theme) => theme.palette.primary.light,
                      borderRadius: '10px',
                    }}
                  >
                    <GrassIcon />
                  </Avatar>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {crop.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round(progress)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 8,
                        borderRadius: '10px',
                        my: 0.5,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: (theme) => theme.palette.primary.main,
                        },
                      }}
                    />
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
            <Button
              size="small"
              color="primary"
              sx={{ mt: 1, textTransform: 'none' }}
              onClick={() => navigate('/crops')}
            >
              Add a Crop
            </Button>
          </Box>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/my-farm')}
        sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
      >
        View Full Farm Overview
      </Button>
    </Paper>
  );
};

export default MyCropsCard;
