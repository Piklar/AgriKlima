// src/components/AdminFormModal.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Modal, Box, Paper, Typography, TextField, Button, Divider, 
  Select, MenuItem, InputLabel, FormControl, Grid, IconButton, Stack // <-- THIS IS THE FIX
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Helper to handle nested form data
const getNestedValue = (obj, path, fallback = '') => {
  if (!path || !obj) return fallback;
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback), obj);
};

const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]] = current[keys[i]] || {};
  }
  current[keys[keys.length - 1]] = value;
  return obj;
};

const AdminFormModal = ({ open, onClose, onSubmit, initialData = {}, mode, title, fields }) => {
  const [formData, setFormData] = useState({});

  // --- Group fields by the new 'group' property ---
  const groupedFields = fields.reduce((acc, field) => {
    const groupName = field.group || 'Details'; // Default group name
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(field);
    return acc;
  }, {});

  const initializeForm = useCallback(() => {
    let state = {};
    fields.forEach(field => {
      const value = getNestedValue(initialData, field.name);
      // Handle array-to-string conversion for textareas
      const processedValue = field.isArray && Array.isArray(value) ? value.join('\n') : value;
      state[field.name] = processedValue || field.defaultValue || '';
    });
    setFormData(state);
  }, [initialData, fields]);

  useEffect(() => { 
    if (open) {
      initializeForm();
    }
  }, [open, initializeForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalData = {};
    
    for (const key in formData) {
      const fieldDef = fields.find(f => f.name === key);
      let value = formData[key];
      
      // Convert textarea strings back to arrays if needed
      if (fieldDef?.isArray && typeof value === 'string') {
        value = value.split('\n').map(item => item.trim()).filter(Boolean);
      }
      
      finalData = setNestedValue(finalData, key, value);
    }
    
    onSubmit(finalData);
  };

  if (!fields) return null;

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper
        sx={{
          width: '90%',
          maxWidth: '900px', // Wider for a better layout
          maxHeight: '90vh',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden' // Prevent content from spilling
        }}
      >
        {/* --- Modal Header --- */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        
        {/* --- Form Section --- */}
        <Box component="form" onSubmit={handleSubmit} sx={{ overflowY: 'auto', flexGrow: 1, p: 3 }}>
          <Grid container spacing={4}>
            {/* Render each group of fields in its own column */}
            {Object.entries(groupedFields).map(([groupName, groupFields]) => (
              <Grid item xs={12} md={6} key={groupName}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--primary-green)' }}>
                  {groupName}
                </Typography>
                <Stack spacing={2.5}>
                  {groupFields.map(field => (
                    <Box key={field.name}>
                      {field.type === 'select' ? (
                        <FormControl fullWidth>
                          <InputLabel>{field.label}</InputLabel>
                          <Select
                            name={field.name}
                            label={field.label}
                            value={formData[field.name] || field.defaultValue || ''}
                            onChange={handleChange}
                            required={field.required}
                          >
                            {field.options?.map(option => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          fullWidth
                          name={field.name}
                          label={field.label}
                          type={field.type === 'textarea' ? 'text' : field.type || 'text'}
                          multiline={field.type === 'textarea'}
                          rows={field.rows || (field.type === 'textarea' ? 3 : 1)}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          required={field.required}
                          helperText={field.helperText}
                        />
                      )}
                    </Box>
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* --- Modal Footer / Actions --- */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1, borderTop: '1px solid #eee' }}>
          <Button type="button" onClick={onClose} variant="outlined" color="secondary">Cancel</Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--primary-green)', '&:hover': { bgcolor: 'var(--light-green)' } }}>
            {mode === 'add' ? 'Create' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default AdminFormModal;