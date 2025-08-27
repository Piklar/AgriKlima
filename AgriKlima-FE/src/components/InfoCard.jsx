// src/components/InfoCard.jsx

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

// This component is designed to show a title, a large value, a unit, an icon, and child content.
const InfoCard = ({ title, value, unit, icon, children }) => {
  return (
    <Card sx={{ borderRadius: '16px', boxShadow: 3, height: '100%' }}>
      <CardContent>
        {/* Top section with Icon and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
          {/* We use React.cloneElement to safely add styling to the passed icon */}
          {icon && React.cloneElement(icon, { sx: { mr: 1.5 } })}
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {title || 'Untitled'}
          </Typography>
        </Box>
        
        {/* Main Value and Unit */}
        {/* We check if `value` is not null or undefined before rendering */}
        {(value !== undefined && value !== null && value !== '--') ? (
          <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
            {value}
            {/* Render the unit only if it exists */}
            {unit && (
              <Typography variant="h6" component="span" color="text.secondary" sx={{ ml: 0.5 }}>
                {unit}
              </Typography>
            )}
          </Typography>
        ) : (
            // If the value is missing, show a clear fallback
            <Typography variant="h4" component="p" sx={{ fontWeight: 'bold', color: 'text.disabled' }}>
                --
            </Typography>
        )}
        
        {/* Any child components (like the LinearProgress bar) are rendered here */}
        {children}
      </CardContent>
    </Card>
  );
};

export default InfoCard;