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
    <Modal 
      open={open} 
      onClose={onClose} 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 2
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '90%',
          maxWidth: '800px', // Reduced maxWidth for better centering
          maxHeight: '95vh',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          mx: 'auto' // Center horizontally
        }}
      >
        {/* Header - Centered */}
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid #e0e0e0',
          bgcolor: 'background.paper'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center', flex: 1 }}>
            {title}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 16 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Content Area - Centered */}
        <Box sx={{ 
          overflowY: 'auto', 
          flexGrow: 1, 
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Image Upload Section - Centered */}
          <Box sx={{ 
            mb: 4, 
            textAlign: 'center',
            p: 3,
            border: '1px dashed #e0e0e0',
            borderRadius: 2,
            bgcolor: 'grey.50',
            width: '100%',
            maxWidth: '400px'
          }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Item Image
            </Typography>
            <Avatar
              src={imageUrl}
              variant="rounded"
              sx={{ 
                width: 120, 
                height: 120, 
                margin: '0 auto', 
                border: '2px solid #e0e0e0',
                mb: 2
              }}
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
              size="medium"
            >
              {imageUrl ? 'Change Image' : 'Upload Image'}
            </Button>
          </Box>
          
          {/* Form Fields - Centered */}
          <Box sx={{ width: '100%', maxWidth: '700px' }}>
            <Grid container spacing={4} justifyContent="center">
              {Object.entries(groupedFields).map(([groupName, groupFields]) => (
                <Grid item xs={12} md={6} key={groupName} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 3, 
                      fontWeight: 600, 
                      color: 'primary.main',
                      pb: 1,
                      borderBottom: '2px solid',
                      borderColor: 'primary.light',
                      textAlign: 'center'
                    }}
                  >
                    {groupName}
                  </Typography>
                  <Stack spacing={3}>
                    {groupFields.map(field => {
                      if (field.name === 'imageUrl') return null;
                      return (
                        <Box key={field.name} sx={{ display: 'flex', justifyContent: 'center' }}>
                          {field.type === 'select' ? (
                            <FormControl fullWidth size="medium" sx={{ maxWidth: '400px' }}>
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
                              size="medium"
                              name={field.name}
                              label={field.label}
                              type={field.type === 'textarea' ? 'text' : field.type || 'text'}
                              multiline={field.type === 'textarea'}
                              rows={field.rows || (field.type === 'textarea' ? 4 : 1)}
                              value={formData[field.name] || ''}
                              onChange={handleChange}
                              required={field.required}
                              helperText={field.helperText}
                              sx={{ maxWidth: '400px' }}
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
        </Box>
        
        {/* Footer - Centered */}
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2, 
          borderTop: '1px solid #e0e0e0',
          bgcolor: 'grey.50'
        }}>
          <Button 
            type="button" 
            onClick={onClose} 
            variant="outlined" 
            color="secondary"
            sx={{ minWidth: 120 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              minWidth: 120,
              bgcolor: 'primary.main', 
              '&:hover': { 
                bgcolor: 'primary.dark' 
              } 
            }}
          >
            {mode === 'add' ? 'Create' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default AdminFormModal;