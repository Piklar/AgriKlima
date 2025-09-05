// src/components/PestAlertCard.jsx

import React from 'react';
import { Box, Typography, Paper, Button, Skeleton, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const PestAlertCard = ({ pests, loading }) => {
    const navigate = useNavigate();
    // Show the first high-risk pest as an alert, or the first pest if none are high-risk
    const alertPest = pests.find(p => p.riskLevel === 'High') || pests[0];

    return (
        <Paper sx={{ p: 3, borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningAmberIcon color="error" sx={{ mr: 1.5, fontSize: '2rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Pest & Disease Alert</Typography>
            </Box>
            <Box>
                {loading ? (
                    <>
                        <Skeleton variant="text" height={40} />
                        <Skeleton variant="text" height={20} />
                        <Skeleton variant="rectangular" height={40} sx={{ mt: 2, borderRadius: 2 }}/>
                    </>
                ) : alertPest ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={alertPest.imageUrl} variant="rounded" sx={{ width: 70, height: 70 }} />
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{alertPest.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                A pest with a <strong>{alertPest.riskLevel} risk level</strong> is active.
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                        No current pest alerts.
                    </Typography>
                )}
            </Box>
            <Button 
                variant="contained" 
                onClick={() => navigate('/pests')}
                fullWidth
                sx={{ mt: 2, bgcolor: '#d32f2f', '&:hover': { bgcolor: '#c62828' } }}
            >
                View All Pests
            </Button>
        </Paper>
    );
};

export default PestAlertCard;