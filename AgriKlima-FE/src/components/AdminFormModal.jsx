// src/components/AdminFormModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Modal, 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Divider, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl,
  Grid
} from '@mui/material';

// --- Helper functions for nested state ---
const getNestedValue = (obj, path) => {
  if (!path || !obj) return '';
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
};

const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const newObj = { ...obj };
  keys.reduce((acc, key, index) => {
    if (index === keys.length - 1) {
      acc[key] = value;
    } else {
      acc[key] = acc[key] || {};
    }
    return acc[key];
  }, newObj);
  return newObj;
};

const AdminFormModal = ({ open, onClose, onSubmit, initialData = {}, mode, title, fields }) => {
  const [formData, setFormData] = useState({});

  // Initialize form with nested values
  const initializeForm = useCallback(() => {
    const state = {};
    fields.forEach(field => {
      const value = getNestedValue(initialData, field.name);
      state[field.name] = field.type === 'textarea' && Array.isArray(value) ? value.join('\n') : value || field.defaultValue || '';
    });
    setFormData(state);
  }, [initialData, fields]);

  useEffect(() => { 
    if (open) initializeForm(); 
  }, [open, initializeForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalData = {};
    
    for (const key in formData) {
      let value = formData[key];
      const fieldDef = fields.find(f => f.name === key);
      
      // Convert textarea arrays
      if (fieldDef?.type === 'textarea' && fieldDef.isArray) {
        value = value.split('\n').map(item => item.trim()).filter(Boolean);
      }
      
      finalData = setNestedValue(finalData, key, value);
    }
    
    console.log("Submitting data:", finalData);
    onSubmit(finalData);
  };

  if (!fields) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          p: 3,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>{title}</Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box component="form" onSubmit={handleSubmit} sx={{ overflowY: 'auto', flexGrow: 1, pr: 2 }}>
          <Grid container spacing={2}>
            {fields.map(field => (
              <Grid key={field.name} item xs={12} md={field.halfWidth ? 6 : 12}>
                {field.type === 'select' ? (
                  <FormControl fullWidth>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      name={field.name}
                      label={field.label}
                      value={formData[field.name] || field.defaultValue || ''}
                      onChange={handleChange}
                      required={field.required !== false}
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
                    rows={field.rows || (field.type === 'textarea' ? 4 : 1)}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required !== false}
                  />
                )}
              </Grid>
            ))}
          </Grid>
          
          {/* MOVE BUTTONS INSIDE THE FORM */}
          <Divider sx={{ mt: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1, flexShrink: 0 }}>
            <Button type="button" onClick={onClose} color="secondary">Cancel</Button>
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