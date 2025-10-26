// src/components/ViewAllOverlay.jsx

import React from 'react';
import {
  Modal, Paper, Box, Grid, Typography, IconButton,
  Card, CardMedia, CardContent, CardActionArea
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// A generic, reusable card for displaying items in the overlay grid.
const ItemCard = ({ item, onClick }) => {
  // --- THIS IS FIX #1: Correctly access the nested pest description ---
  // The logic now checks for the pest's nested description before falling back.
  const description = item.description || item.overview?.description || item.content || 'No description available.';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        borderRadius: 3, // Slightly more rounded corners for a modern look
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
        }
      }}
    >
      <CardActionArea 
        onClick={() => onClick(item)} 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          alignItems: 'stretch'
        }}
      >
        <CardMedia
          component="img"
          sx={{ 
            height: 180,
            // --- THIS IS FIX #2: Ensure all images are uniform ---
            // 'object-fit: cover' makes the image fill the space without stretching.
            objectFit: 'cover',
          }}
          image={item.imageUrl || 'https://via.placeholder.com/300x180?text=No+Image'} // Added a fallback image
          alt={item.name || item.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {item.name || item.title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              display: '-webkit-box', 
              WebkitLineClamp: 3, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const ViewAllOverlay = ({ open, onClose, title, items, onItemClick }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper
        sx={{
          width: '90%',
          maxWidth: '1200px',
          height: '90vh',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid #eee',
          flexShrink: 0
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Grid Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
          {items.length > 0 ? (
            <Grid container spacing={3}>
              {items.map(item => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                  <ItemCard item={item} onClick={onItemClick} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="h6" color="text.secondary">
                No items available.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Modal>
  );
};

export default ViewAllOverlay;