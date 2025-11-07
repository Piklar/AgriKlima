import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Box, Typography, TextField, List, ListItem, ListItemText,
  IconButton, Divider, CircularProgress, Paper, Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import * as api from '../services/api';
import Swal from 'sweetalert2';

const VarietyForm = ({ variety, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: variety?.name || '',
        description: variety?.description || '',
        imageUrl: variety?.imageUrl || '',
        growingDuration: variety?.growingDuration || 90,
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        onSave({ ...variety, ...formData });
    };

    return (
        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>{variety?._id ? 'Edit Variety' : 'Add New Variety'}</Typography>
            <Stack spacing={2}>
                <TextField name="name" label="Variety Name" value={formData.name} onChange={handleChange} fullWidth required />
                <TextField name="description" label="Description (Optional)" value={formData.description} onChange={handleChange} fullWidth multiline rows={2} />
                <TextField name="imageUrl" label="Image URL (Optional)" value={formData.imageUrl} onChange={handleChange} fullWidth />
                <TextField name="growingDuration" label="Growing Duration (Days)" type="number" value={formData.growingDuration} onChange={handleChange} fullWidth required />
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </Stack>
            </Stack>
        </Paper>
    );
};

const VarietyManagementModal = ({ open, onClose, crop }) => {
    const [varieties, setVarieties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingVariety, setEditingVariety] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchVarieties = useCallback(async () => {
        if (!crop) return;
        setLoading(true);
        try {
            const response = await api.getVarietiesForCrop(crop._id);
            setVarieties(response.data);
        } catch (error) {
            console.error("Failed to fetch varieties", error);
        } finally {
            setLoading(false);
        }
    }, [crop]);

    useEffect(() => {
        if (open) {
            fetchVarieties();
            setEditingVariety(null);
            setShowAddForm(false);
        }
    }, [open, fetchVarieties]);

    const handleSave = async (varietyData) => {
        try {
            if (varietyData._id) { // Update existing
                await api.updateVariety(varietyData._id, varietyData);
            } else { // Add new
                await api.addVariety({ ...varietyData, parentCrop: crop._id });
            }
            Swal.fire('Success', 'Variety saved successfully!', 'success');
            fetchVarieties();
            setEditingVariety(null);
            setShowAddForm(false);
        } catch (error) {
            Swal.fire('Error', 'Failed to save variety.', 'error');
        }
    };

    const handleDelete = (varietyId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.deleteVariety(varietyId);
                    Swal.fire('Deleted!', 'The variety has been deleted.', 'success');
                    fetchVarieties();
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete variety.', 'error');
                }
            }
        });
    };

    if (!crop) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Manage Varieties for {crop.name}
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {loading && <CircularProgress />}
                {!loading && (
                    <List>
                        {varieties.map(v => (
                            editingVariety?._id === v._id ? (
                                <VarietyForm key={v._id} variety={editingVariety} onSave={handleSave} onCancel={() => setEditingVariety(null)} />
                            ) : (
                                <ListItem key={v._id} secondaryAction={
                                    <>
                                        <IconButton edge="end" onClick={() => setEditingVariety(v)}><EditIcon /></IconButton>
                                        <IconButton edge="end" onClick={() => handleDelete(v._id)}><DeleteIcon /></IconButton>
                                    </>
                                }>
                                    <ListItemText primary={v.name} secondary={`Duration: ${v.growingDuration} days`} />
                                </ListItem>
                            )
                        ))}
                    </List>
                )}
                {showAddForm ? (
                    <VarietyForm onSave={handleSave} onCancel={() => setShowAddForm(false)} />
                ) : (
                    <Button startIcon={<AddIcon />} onClick={() => setShowAddForm(true)} sx={{ mt: 2 }}>
                        Add New Variety
                    </Button>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Done</Button>
            </DialogActions>
        </Dialog>
    );
};

export default VarietyManagementModal;