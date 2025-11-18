import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Box, Typography, CircularProgress, Paper, Avatar, Grid,
  List, ListItem, ListItemText, Divider, Chip
} from '@mui/material';
import { format } from 'date-fns';
import * as api from '../services/api';

const DetailItem = ({ label, value }) => (
    <Box sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body1">{value || 'N/A'}</Typography>
    </Box>
);

const UserDetailModal = ({ open, onClose, userId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && userId) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const response = await api.getUserDetailsForAdmin(userId);
                    setData(response.data);
                } catch (error) {
                    console.error("Failed to fetch user details:", error);
                    setData(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [open, userId]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>User Overview</DialogTitle>
            <DialogContent dividers>
                {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}
                {!loading && data && (
                    <Grid container spacing={3}>
                        {/* User Info Column */}
                        <Grid item xs={12} md={4}>
                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                <Avatar src={data.user.profilePictureUrl} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} />
                                <Typography variant="h6" fontWeight="bold">{`${data.user.firstName} ${data.user.lastName}`}</Typography>
                                <Typography color="text.secondary">{data.user.email}</Typography>
                            </Paper>
                            <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Details</Typography>
                                <DetailItem label="Mobile" value={data.user.mobileNo} />
                                <DetailItem label="Location" value={data.user.location} />
                                <DetailItem label="Date of Birth" value={data.user.dob} />
                            </Paper>
                        </Grid>

                        {/* Crops and Tasks Column */}
                        <Grid item xs={12} md={8}>
                            {/* Active Crops */}
                            <Box mb={3}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Active Crops ({data.activeCrops.length})</Typography>
                                {data.activeCrops.length > 0 ? (
                                    <List dense>
                                        {data.activeCrops.map(crop => (
                                            <ListItem key={crop._id} divider>
                                                <ListItemText
                                                    primary={`${crop.varietyId.parentCrop.name} (${crop.varietyId.name})`}
                                                    secondary={`Planted: ${format(new Date(crop.plantingDate), 'MMM d, yyyy')}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : <Typography color="text.secondary">No active crops.</Typography>}
                            </Box>

                            {/* Assigned Tasks */}
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Assigned Tasks ({data.tasks.length})</Typography>
                                {data.tasks.length > 0 ? (
                                    <List dense>
                                        {data.tasks.map(task => (
                                            <ListItem key={task._id} divider>
                                                <ListItemText
                                                    primary={task.title}
                                                    secondary={`Due: ${format(new Date(task.dueDate), 'MMM d, yyyy')}`}
                                                />
                                                <Chip label={task.status} color={task.status === 'completed' ? 'success' : 'warning'} size="small" />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : <Typography color="text.secondary">No tasks assigned to this user.</Typography>}
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserDetailModal;