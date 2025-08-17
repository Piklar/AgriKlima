// src/components/AddCropEntryOverlay.jsx

import React, { useState } from 'react';
import { 
    Modal, Box, Paper, Typography, Grid, TextField, Button, 
    FormControl, InputLabel, Select, MenuItem, IconButton, Divider
} from '@mui/material';

// --- Icon Imports ---
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';

const AddCropEntryOverlay = ({ open, onClose }) => {
    // Mock data for dropdowns
    const currentCrops = ['Wheat Field A', 'Corn Section B', 'Tomato Greenhouse'];
    const activityTypes = ['Planting', 'Irrigation', 'Fertilizing', 'Pest Control', 'Harvesting', 'Scouting'];

    const [formData, setFormData] = useState({
        title: '',
        crop: '',
        activity: '',
        date: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would send this data to a backend or state management store
        console.log("New Crop Entry:", formData);
        onClose(); // Close the modal after submission
    };

    return (
        <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ width: '90%', maxWidth: '600px', borderRadius: '24px', overflow: 'hidden' }}>
                <Box component="form" onSubmit={handleSubmit}>
                    {/* --- Header --- */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f5f5f5' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon color="primary"/>
                            Add New Crop Entry
                        </Typography>
                        <IconButton onClick={onClose}><CloseIcon /></IconButton>
                    </Box>
                    <Divider />

                    {/* --- Form Content --- */}
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    name="title"
                                    label="Entry Title"
                                    placeholder="e.g., Apply Nitrogen Fertilizer"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Select Crop</InputLabel>
                                    <Select name="crop" value={formData.crop} label="Select Crop" onChange={handleChange}>
                                        {currentCrops.map(crop => <MenuItem key={crop} value={crop}>{crop}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Activity Type</InputLabel>
                                    <Select name="activity" value={formData.activity} label="Activity Type" onChange={handleChange}>
                                        {activityTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    name="date"
                                    label="Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    name="notes"
                                    label="Notes (Optional)"
                                    placeholder="e.g., Applied 50kg/hectare, weather was clear."
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />

                    {/* --- Footer/Actions --- */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, gap: 1 }}>
                        <Button onClick={onClose} color="secondary">Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--primary-green)', '&:hover': { bgcolor: 'var(--light-green)' } }}>
                            Add Entry
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    );
};

export default AddCropEntryOverlay;