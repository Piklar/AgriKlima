// src/components/CropFormModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Box, Paper, Typography, Grid, TextField, Button, Divider } from '@mui/material';

const CropFormModal = ({ open, onClose, onSubmit, initialData, mode }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        season: 'All Year',
    });

    useEffect(() => {
        // If we are in 'edit' mode and have initial data, populate the form
        if (mode === 'edit' && initialData) {
            setFormData(initialData);
        } else {
            // Reset form for 'add' mode
            setFormData({ name: '', description: '', imageUrl: '', season: 'All Year' });
        }
    }, [initialData, mode, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, p: 3, borderRadius: '16px' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {mode === 'add' ? 'Add New Crop' : 'Edit Crop'}
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}><TextField fullWidth name="name" label="Crop Name" value={formData.name} onChange={handleChange} required /></Grid>
                        <Grid item xs={12}><TextField fullWidth name="description" label="Description" value={formData.description} onChange={handleChange} required multiline rows={3} /></Grid>
                        <Grid item xs={12}><TextField fullWidth name="imageUrl" label="Image URL" value={formData.imageUrl} onChange={handleChange} required /></Grid>
                        <Grid item xs={12}><TextField fullWidth name="season" label="Season" value={formData.season} onChange={handleChange} /></Grid>
                        {/* You can add more complex fields for the nested data later */}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                        <Button onClick={onClose} color="secondary">Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--primary-green)' }}>
                            {mode === 'add' ? 'Create Crop' : 'Save Changes'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    );
};

export default CropFormModal;