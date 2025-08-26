// src/components/PageDataLoader.jsx

import React from 'react';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';

const PageDataLoader = ({ loading, error, children, onRetry }) => {
  // 1. If we are in a loading state, show a spinner.
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, minHeight: '60vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Content...</Typography>
      </Box>
    );
  }

  // 2. If an error occurred, show an error message with a retry button.
  if (error) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <Alert severity="error" action={
          onRetry && <Button color="inherit" size="small" onClick={onRetry}>RETRY</Button>
        }>
          {typeof error === 'string' ? error : 'Failed to load data. Please try again.'}
        </Alert>
      </Box>
    );
  }

  // 3. If not loading and no error, render the actual page content.
  return <>{children}</>;
};

export default PageDataLoader;