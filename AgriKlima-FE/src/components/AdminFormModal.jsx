import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Modal, Box, Paper, Typography, TextField, Button, Divider, 
  Select, MenuItem, InputLabel, FormControl, Grid, IconButton, Stack, Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

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

const AdminFormModal = ({ open, onClose, onSubmit, initialData, mode, title, fields }) => {
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const groupedFields = fields.reduce((acc, field) => {
    const groupName = field.group || 'Details';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(field);
    return acc;
  }, {});

  const initializeForm = useCallback(() => {
    let state = {};
    fields.forEach(field => {
      const value = initialData ? getNestedValue(initialData, field.name) : '';
      const processedValue = field.isArray && Array.isArray(value) ? value.join('\n') : value;
      state[field.name] = processedValue || field.defaultValue || '';
    });
    setFormData(state);
    setPreviewUrl(initialData?.imageUrl || '');
    setImageFile(null);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalData = {};
    for (const key in formData) {
      const fieldDef = fields.find(f => f.name === key);
      let value = formData[key];
      if (fieldDef?.isArray && typeof value === 'string') {
        value = value.split('\n').map(item => item.trim()).filter(Boolean);
      }
      finalData = setNestedValue(finalData, key, value);
    }
    onSubmit(finalData, imageFile);
  };

  if (!fields) return null;

  const imageUrl = previewUrl || formData.imageUrl || '';

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* --- THIS IS THE FIX: The Paper is now the form element --- */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '90%', maxWidth: '900px', maxHeight: '90vh',
          borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        
        {/* --- This Box is no longer a form, just a container --- */}
        <Box sx={{ overflowY: 'auto', flexGrow: 1, p: 3 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
              Item Image
            </Typography>
            <Avatar
              src={imageUrl}
              variant="rounded"
              sx={{ width: 150, height: 150, margin: '0 auto', border: '2px solid #eee' }}
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
              size="small"
              sx={{ mt: 1 }}
            >
              {imageUrl ? 'Change Image' : 'Upload Image'}
            </Button>
          </Box>
          
          <Grid container spacing={4}>
            {Object.entries(groupedFields).map(([groupName, groupFields]) => (
              <Grid item xs={12} md={6} key={groupName}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--primary-green)' }}>
                  {groupName}
                </Typography>
                <Stack spacing={2.5}>
                  {groupFields.map(field => {
                    if (field.name === 'imageUrl') return null;
                    return (
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
                    );
                  })}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* --- This Box is now INSIDE the form --- */}
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