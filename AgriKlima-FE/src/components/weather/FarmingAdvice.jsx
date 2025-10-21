// src/components/weather/FarmingAdvice.jsx

import React from 'react';
import { Paper, Box, Typography, Grid, Chip, Alert, LinearProgress, Skeleton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import GrainIcon from '@mui/icons-material/Grain';

const FarmingAdvice = ({ advice, loading }) => {
  if (loading) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          height: 'auto',
          minHeight: 640,
          maxHeight: 780,
          boxSizing: 'border-box',
        }}
      >
        <Skeleton width="60%" height={40} />
        <Skeleton width="100%" height={100} sx={{ mt: 2 }} />
        <Skeleton width="100%" height={100} sx={{ mt: 2 }} />
      </Paper>
    );
  }

  if (!advice) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return '#2e7d32';
      case 'good':
        return '#4caf50';
      case 'fair':
        return '#ffa000';
      case 'poor':
        return '#d32f2f';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return <CheckCircleIcon sx={{ fontSize: { xs: '2.5rem', sm: '3rem' }, color: '#2e7d32' }} />;
      case 'good':
        return <CheckCircleIcon sx={{ fontSize: { xs: '2.5rem', sm: '3rem' }, color: '#4caf50' }} />;
      case 'fair':
        return <WarningIcon sx={{ fontSize: { xs: '2.5rem', sm: '3rem' }, color: '#ffa000' }} />;
      case 'poor':
        return <ErrorIcon sx={{ fontSize: { xs: '2.5rem', sm: '3rem' }, color: '#d32f2f' }} />;
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        height: 'auto',
        minHeight: 640,
        maxHeight: 780,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight="600" color="primary">
        🌾 Farming Conditions Analysis
      </Typography>

      {/* Score Section */}
          <Box
            sx={{
              textAlign: 'center',
              my: 2,
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 3,
            }}
          >
            {getStatusIcon(advice.status)}
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: getStatusColor(advice.status),
                mt: 1,
                fontSize: { xs: '1.5rem', sm: '2.2rem' },
              }}
            >
              {advice.score}/100
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              {advice.statusLabel}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={advice.score}
              sx={{
                mt: 2,
                height: { xs: 8, sm: 10 },
                borderRadius: 6,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 6,
                  backgroundColor: getStatusColor(advice.status),
                },
              }}
            />
          </Box>


     {/* Condition Details */}
        <Grid container spacing={1.2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1.2, bgcolor: 'background.default', borderRadius: 2 }}>
              <ThermostatIcon color="error" sx={{ fontSize: 22 }} />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Temperature
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
                {advice.details.temperature}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1.2, bgcolor: 'background.default', borderRadius: 2 }}>
              <WaterDropIcon color="primary" sx={{ fontSize: 22 }} />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Humidity
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
                {advice.details.humidity}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1.2, bgcolor: 'background.default', borderRadius: 2 }}>
              <GrainIcon color="info" sx={{ fontSize: 22 }} />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Rainfall
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
                {advice.details.rainfall}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1.2, bgcolor: 'background.default', borderRadius: 2 }}>
              <AirIcon color="secondary" sx={{ fontSize: 22 }} />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Wind
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
                {advice.details.wind}
              </Typography>
            </Box>
          </Grid>
        </Grid>


      {/* Warnings */}
      {advice.warnings && advice.warnings.length > 0 && (
        <Box sx={{ mb: 2, flex: '0 0 auto', maxHeight: 220, overflow: 'auto' }}>
          <Typography variant="subtitle2" fontWeight="600" gutterBottom>
            ⚠️ Warnings
          </Typography>
          {advice.warnings.map((warning, index) => (
            <Alert key={index} severity="warning" sx={{ mb: 1, py: 0.5 }}>
              <Typography variant="caption">{warning}</Typography>
            </Alert>
          ))}
        </Box>
      )}

      {/* Recommendations */}
      <Box sx={{ flex: '1 1 auto', overflow: 'auto', maxHeight: 360 }}>
        <Typography
          variant="subtitle2"
          fontWeight="600"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <LightbulbIcon color="primary" fontSize="small" />
          Recommendations
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5 } }}>
          {advice.recommendations.map((rec, index) => (
            <Chip
              key={index}
              label={rec}
              icon={<CheckCircleIcon />}
              sx={{
                justifyContent: 'flex-start',
                height: 'auto',
                py: { xs: 1, sm: 1.25 },
                px: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                '& .MuiChip-label': {
                  whiteSpace: 'normal',
                  textAlign: 'left',
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                },
              }}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default FarmingAdvice;