// src/components/PestAlertCard.jsx
import React from 'react';
import { Box, Typography, Paper, Button, Skeleton, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const PestAlertCard = ({ pests, loading }) => {
  const navigate = useNavigate();
  const alertPest = pests.find(p => p.riskLevel === 'High') || pests[0];

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        height: '100%',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 28px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <WarningAmberIcon
          color="error"
          sx={{ mr: 1.5, fontSize: '2rem' }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Pest & Disease Alert
        </Typography>
      </Box>

      <Box>
        {loading ? (
          <>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={20} />
            <Skeleton
              variant="rectangular"
              height={40}
              sx={{ mt: 2, borderRadius: '10px' }}
            />
          </>
        ) : alertPest ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={alertPest.imageUrl}
              variant="rounded"
              sx={{ width: 70, height: 70, borderRadius: '10px' }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
              >
                {alertPest.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: 'Inter, sans-serif' }}
              >
                A pest with a <strong>{alertPest.riskLevel} risk level</strong> is active.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography
            color="text.secondary"
            sx={{ py: 3, textAlign: 'center', fontFamily: 'Inter, sans-serif' }}
          >
            No current pest alerts.
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        onClick={() => navigate('/pests')}
        fullWidth
        sx={{
          mt: 2,
          bgcolor: 'var(--primary-green)',
          '&:hover': { bgcolor: 'var(--light-green)' },
          borderRadius: '10px',
          textTransform: 'none',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        View All Pests
      </Button>
    </Paper>
  );
};

export default PestAlertCard;
