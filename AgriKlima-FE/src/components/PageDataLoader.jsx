// src/components/PageDataLoader.jsx

import React from 'react';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';

const PageDataLoader = ({ loading, error, children, onRetry }) => {
  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1">Loading Content...</Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          p: 4,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Alert
          severity="error"
          sx={{ borderRadius: '10px', width: '100%', maxWidth: 400 }}
          action={
            onRetry && (
              <Button
                color="inherit"
                size="small"
                onClick={onRetry}
                sx={{ fontWeight: 600 }}
              >
                RETRY
              </Button>
            )
          }
        >
          {typeof error === 'string'
            ? error
            : 'Failed to load data. Please try again.'}
        </Alert>
      </Box>
    );
  }

  // Render content if no loading/error
  return <>{children}</>;
};

export default PageDataLoader;
