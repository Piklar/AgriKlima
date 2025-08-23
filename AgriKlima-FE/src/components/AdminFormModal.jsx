// src/components/AdminFormModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Box, Paper, Typography, Grid, TextField, Button, Divider, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const AdminFormModal = ({ open, onClose, onSubmit, initialData = null, mode, title, fields }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // --- THIS IS THE KEY FIX ---
        // Only run this logic if the modal is actually open.
        if (open) {
            const state = {};
            fields.forEach(field => {
                // Check if initialData exists before trying to access its properties.
                // If it doesn't, or if the specific property doesn't exist, fall back to defaults.
                state[field.name] = (initialData && initialData[field.name]) ? initialData[field.name] : (field.defaultValue || '');
            });
            setFormData(state);
        }
    }, [open, initialData, fields]); // Dependency array remains the same.

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // If the fields aren't ready yet, don't render the form to prevent errors.
    if (!fields) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '600px', p: 3, borderRadius: '16px' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>{title}</Typography>
                <Divider sx={{ mb: 3 }} />
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {fields.map(field => (
                            <Grid item xs={12} sm={field.halfWidth ? 6 : 12} key={field.name}>
                                {field.type === 'select' ? (
                                    <FormControl fullWidth required={field.required !== false}>
                                        <InputLabel>{field.label}</InputLabel>
                                        <Select name={field.name} label={field.label} value={formData[field.name] || ''} onChange={handleChange}>
                                            {field.options && field.options.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <TextField fullWidth name={field.name} label={field.label} type={field.type || 'text'} multiline={!!field.multiline} rows={field.rows || 1} value={formData[field.name] || ''} onChange={handleChange} required={field.required !== false} />
                                )}
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                        <Button onClick={onClose} color="secondary">Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--primary-green)' }}>
                            {mode === 'add' ? 'Create' : 'Save Changes'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    );
};

export default AdminFormModal;