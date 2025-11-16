// src/components/VarietyManagementModal.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Box, Typography, TextField, List, ListItem, ListItemText,
  IconButton, Divider, CircularProgress, Paper, Stack,
  Avatar // --- ADDED ---
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'; // --- ADDED ---
import * as api from '../services/api';
import Swal from 'sweetalert2';

// --- MODIFIED VarietyForm Component ---
const VarietyForm = ({ variety, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: variety?.name || '',
        description: variety?.description || '',
        growingDuration: variety?.growingDuration || 90,
    });
    
    // --- ADDED: State for image file and preview ---
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(variety?.imageUrl || '');
    const fileInputRef = useRef(null);
    // --- END ADD ---

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // --- ADDED: Handler for file input ---
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    // --- END ADD ---

    const handleSave = () => {
        // Pass both form data AND the image file to the parent
        onSave({ ...variety, ...formData }, imageFile);
    };

    return (
        <Paper elevation={2} sx={{ p: 3, mt: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>{variety?._id ? 'Edit Variety' : 'Add New Variety'}</Typography>
            <Stack spacing={2}>
                
                {/* --- ADDED: Image Upload UI --- */}
                <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                        src={previewUrl}
                        variant="rounded"
                        sx={{ width: 100, height: 100, margin: '0 auto 16px', border: '1px solid #ddd' }}
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/png, image/jpeg"
                    />
                    <Button
                        startIcon={<AddAPhotoIcon />}
                        onClick={() => fileInputRef.current.click()}
                        variant="outlined"
                        size="small"
                    >
                        {previewUrl ? 'Change Image' : 'Upload Image'}
                    </Button>
                </Box>
                {/* --- END ADD --- */}

                <TextField name="name" label="Variety Name" value={formData.name} onChange={handleChange} fullWidth required />
                <TextField name="description" label="Description (Optional)" value={formData.description} onChange={handleChange} fullWidth multiline rows={2} />
                
                {/* --- REMOVED: Old Image URL TextField --- */}
                {/* <TextField name="imageUrl" label="Image URL (Optional)" value={formData.imageUrl} onChange={handleChange} fullWidth /> */}
                
                <TextField name="growingDuration" label="Growing Duration (Days)" type="number" value={formData.growingDuration} onChange={handleChange} fullWidth required />
                
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </Stack>
            </Stack>
        </Paper>
    );
};
// --- END MODIFIED VarietyForm ---


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

    // --- MODIFIED: handleSave now accepts imageFile ---
    const handleSave = async (varietyData, imageFile) => {
        try {
            let savedVariety;
            
            // Step 1: Save text data
            if (varietyData._id) { // Update existing
                const response = await api.updateVariety(varietyData._id, varietyData);
                savedVariety = response.data;
            } else { // Add new
                const response = await api.addVariety({ ...varietyData, parentCrop: crop._id });
                savedVariety = response.data;
            }

            // Step 2: If there's an image file, upload it
            if (imageFile && savedVariety?._id) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', imageFile);
                await api.uploadVarietyImage(savedVariety._id, uploadFormData);
            }
            
            Swal.fire('Success', 'Variety saved successfully!', 'success');
            fetchVarieties(); // Refresh the list
            setEditingVariety(null);
            setShowAddForm(false);
        } catch (error) {
            Swal.fire('Error', 'Failed to save variety.', 'error');
        }
    };
    // --- END MODIFICATION ---

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
                {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}
                {!loading && (
                    <List>
                        {varieties.map(v => (
                            editingVariety?._id === v._id ? (
                                <VarietyForm key={v._id} variety={editingVariety} onSave={handleSave} onCancel={() => setEditingVariety(null)} />
                            ) : (
                                <ListItem 
                                    key={v._id} 
                                    divider
                                    secondaryAction={
                                        <Stack direction="row" spacing={1}>
                                            <IconButton edge="end" onClick={() => setEditingVariety(v)}><EditIcon /></IconButton>
                                            <IconButton edge="end" onClick={() => handleDelete(v._id)}><DeleteIcon color="error" /></IconButton>
                                        </Stack>
                                    }
                                >
                                    {/* --- ADDED: Avatar to list item --- */}
                                    <Avatar src={v.imageUrl} variant="rounded" sx={{ mr: 2, width: 56, height: 56 }} />
                                    <ListItemText primary={v.name} secondary={`Duration: ${v.growingDuration} days`} />
                                </ListItem>
                            )
                        ))}
                    </List>
                )}
                
                {/* This section handles the "Add New Variety" form */}
                {showAddForm ? (
                    <VarietyForm onSave={handleSave} onCancel={() => setShowAddForm(false)} />
                ) : (
                    !loading && <Button startIcon={<AddIcon />} onClick={() => setShowAddForm(true)} sx={{ mt: 2 }}>
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