import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as api from '../services/api';

import {
  Container, Box, Typography, Button, Grid, Card, CardMedia, CardContent,
  TextField, Stepper, Step, StepLabel, Paper, Stack,
  CircularProgress, MenuItem, FormControl, InputLabel, Select,
  InputAdornment, IconButton, Fade, Avatar, Link as MuiLink, Collapse
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import logo from '../assets/logo.png';

// Images
import mexicoImg from '../assets/images/location-mexico.jpg';
import csfpImg from '../assets/images/location-csfp.jpg';
import staAnaImg from '../assets/images/location-sta-ana.jpg';
import arayatImg from '../assets/images/location-arayat.jpg';
import bacolorImg from '../assets/images/location-bacolor.jpg';
import gpsImg from '../assets/images/location-gps.jpg';
import wheatImg from '../assets/images/crop-wheat.jpg';
import cornImg from '../assets/images/crop-corn.jpg';
import onionImg from '../assets/images/crop-onion.jpg';
import othersImg from '../assets/images/crop-others.jpg';

// Reusable SelectionCard for locations
const SelectionCard = ({ image, label, isSelected, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: 'pointer',
      borderRadius: '20px',
      boxShadow: isSelected ? '0 0 0 4px var(--primary-green)' : '0 4px 12px rgba(0,0,0,0.08)',
      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
      transition: 'all 0.2s ease-in-out',
      border: '1px solid #eee',
      height: '100%',
    }}
  >
    <CardMedia component="img" image={image} alt={label} sx={{ height: 160 }} />
    <CardContent sx={{ p: 2 }}>
      <Typography variant="subtitle1" align="center" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
    </CardContent>
  </Card>
);

// --- NEW CROP SELECTION CARD WITH DATE INPUT ---
const CropSelectionCard = ({ image, label, isSelected, onToggle, onDateChange, plantingDate }) => (
  <Card
    sx={{
      borderRadius: '20px',
      boxShadow: isSelected ? '0 0 0 4px var(--primary-green)' : '0 4px 12px rgba(0,0,0,0.08)',
      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
      transition: 'all 0.2s ease-in-out',
      border: '1px solid #eee',
      height: '100%',
    }}
  >
    <CardMedia component="img" image={image} alt={label} sx={{ height: 140, cursor: 'pointer' }} onClick={() => onToggle(label)} />
    <CardContent sx={{ p: 2, pt: 1 }}>
      <Typography variant="subtitle1" align="center" sx={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => onToggle(label)}>
        {label}
      </Typography>
      <Collapse in={isSelected}>
        <TextField
          label="Planting Date"
          type="date"
          fullWidth
          value={plantingDate}
          onChange={(e) => onDateChange(label, e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mt: 2 }}
          required={isSelected}
        />
      </Collapse>
    </CardContent>
  </Card>
);

const STEPS = ['Account Info', 'Personal Details', 'Your Crops', 'Location', 'Profile Picture'];

const LOCATION_OPTIONS = [
  { label: 'Mexico, Pampanga', img: mexicoImg, value: 'Mexico, Pampanga' },
  { label: 'City of San Fernando, Pampanga', img: csfpImg, value: 'City of San Fernando, Pampanga' },
  { label: 'Santa Ana, Pampanga', img: staAnaImg, value: 'Santa Ana, Pampanga' },
  { label: 'Arayat, Pampanga', img: arayatImg, value: 'Arayat, Pampanga' },
  { label: 'Bacolor, Pampanga', img: bacolorImg, value: 'Bacolor, Pampanga' },
  { label: 'Others', img: gpsImg, value: 'Others' },
];

const CROP_OPTIONS = [
  { id: '60d5f2f9a7b9a72b5c8f7f8b', name: 'Rice', img: wheatImg }, // Example IDs
  { id: '60d5f2f9a7b9a72b5c8f7f8c', name: 'Corn', img: cornImg },
  { id: '60d5f2f9a7b9a72b5c8f7f8d', name: 'Onion', img: onionImg },
  { id: '60d5f2f9a7b9a72b5c8f7f8e', name: 'Others', img: othersImg },
];

const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  // --- REFINED STATE ---
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobileNo: '',
    password: '', confirmPassword: '', dob: '', gender: '',
    language: 'Filipino', location: '',
    // This will now store objects: { name: 'Rice', plantingDate: '2025-10-21' }
    userCrops: [], 
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelection = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- UPDATED CROP HANDLING LOGIC ---
  const handleCropToggle = (cropName) => {
    setFormData(prev => {
      const isSelected = prev.userCrops.some(c => c.name === cropName);
      if (isSelected) {
        // Remove the crop
        return { ...prev, userCrops: prev.userCrops.filter(c => c.name !== cropName) };
      } else {
        // Add the crop with a default planting date
        const cropDetails = CROP_OPTIONS.find(c => c.name === cropName);
        return {
          ...prev,
          userCrops: [...prev.userCrops, { cropId: cropDetails.id, name: cropName, plantingDate: '' }]
        };
      }
    });
  };

  const handleCropDateChange = (cropName, date) => {
    setFormData(prev => ({
      ...prev,
      userCrops: prev.userCrops.map(c => c.name === cropName ? { ...c, plantingDate: date } : c)
    }));
  };

  const handleClickShowPassword = () => setShowPassword(s => !s);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(s => !s);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setProfilePictureFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };
  const triggerFileInput = () => fileInputRef.current.click();

  const isStepValid = useMemo(() => {
    switch (step) {
      case 1:
        return (
          formData.firstName.trim() !== '' &&
          formData.lastName.trim() !== '' &&
          formData.email.includes('@') &&
          /^\d{11}$/.test(formData.mobileNo) && // Use regex for 11 digits
          formData.password.length >= 8 &&
          formData.password === formData.confirmPassword
        );
      case 2:
        return formData.dob && formData.gender && formData.language;
      case 3:
        // Validate that all selected crops have a planting date
        return formData.userCrops.length > 0 && formData.userCrops.every(c => c.plantingDate);
      case 4:
        return !!formData.location;
      case 5:
        return true; // Profile picture is optional
      default:
        return false;
    }
  }, [formData, step]);

  // --- REFINED SUBMIT LOGIC TO HANDLE IMAGE UPLOAD ---
  const handleSubmit = async () => {
    if (!isStepValid) {
        Swal.fire('Incomplete Information', 'Please ensure all required fields are filled correctly.', 'warning');
        return;
    }
    setIsSubmitting(true);

    // Prepare data for registration (remove confirmPassword)
    const { confirmPassword, ...registrationData } = formData;

    try {
      // Step 1: Register the user
      await api.registerUser(registrationData);
      
      // Step 2 (Optional): If there's a profile picture, log in to get a token and then upload
      if (profilePictureFile) {
        Swal.fire({
          title: 'Almost Done!',
          text: 'User registered. Now uploading profile picture...',
          icon: 'info',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        // Log in silently to get the auth token
        const loginResponse = await api.loginUser({ email: formData.email, password: formData.password });
        const token = loginResponse.data.access;
        
        // Use the token to upload the picture
        const pictureFormData = new FormData();
        pictureFormData.append('profilePicture', profilePictureFile);
        
        // Manually create an Axios instance with the token for this one-off request
        const apiWithToken = api.default.create({
            baseURL: import.meta.env.VITE_API_URL,
            headers: { 'Authorization': `Bearer ${token}` }
        });
        await apiWithToken.patch('/users/update-picture', pictureFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      Swal.fire({
        title: 'Registration Successful!',
        text: 'You can now log in with your new account.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
      navigate('/login');

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
      Swal.fire('Registration Failed', errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => (
    <Fade in key={step}>
      <Box>
        {(() => {
          switch (step) {
            case 1:
              return (
                <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                  <Stack spacing={3}>
                    <TextField name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} fullWidth required />
                    <TextField name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} fullWidth required />
                    <TextField name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} fullWidth required />
                    <TextField name="mobileNo" label="Mobile Number" type="tel" value={formData.mobileNo} onChange={handleChange} fullWidth required inputProps={{ maxLength: 11 }} helperText="Format: 09123456789" />
                    <TextField
                      name="password"
                      label="Password (min 8 characters)"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                      helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Passwords do not match' : ''}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                </Box>
              );
            case 2:
              return (
                <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                  <Stack spacing={3}>
                    <TextField name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
                    <FormControl fullWidth required>
                      <InputLabel>Gender</InputLabel>
                      <Select name="gender" value={formData.gender} onChange={handleChange}>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth required>
                      <InputLabel>Language</InputLabel>
                      <Select name="language" value={formData.language} onChange={handleChange}>
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Filipino">Filipino</MenuItem>
                        <MenuItem value="Kapampangan">Kapampangan</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
              );
            case 3:
              return (
                <Grid container spacing={3} justifyContent="center">
                  {CROP_OPTIONS.map(crop => {
                    const selectedCrop = formData.userCrops.find(c => c.name === crop.name);
                    return (
                      <Grid item xs={12} sm={6} md={3} key={crop.name}>
                        <CropSelectionCard 
                          image={crop.img} 
                          label={crop.name} 
                          isSelected={!!selectedCrop}
                          onToggle={handleCropToggle}
                          onDateChange={handleCropDateChange}
                          plantingDate={selectedCrop ? selectedCrop.plantingDate : ''}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              );
            case 4:
              return (
                <Grid container spacing={3} justifyContent="center">
                  {LOCATION_OPTIONS.map(loc => (
                    <Grid item xs={12} sm={6} md={4} key={loc.value}>
                      <SelectionCard image={loc.img} label={loc.label} isSelected={formData.location === loc.value} onClick={() => handleSelection('location', loc.value)} />
                    </Grid>
                  ))}
                </Grid>
              );
            case 5:
              return (
                <Box sx={{ maxWidth: 500, mx: 'auto', textAlign: 'center' }}>
                  <Stack spacing={3} alignItems="center">
                    <Avatar src={previewUrl} sx={{ width: 150, height: 150, mb: 2, bgcolor: 'grey.300', border: '2px solid #ccc' }}>
                      <AddAPhotoIcon sx={{ fontSize: 60, color: 'grey.500' }} />
                    </Avatar>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/png, image/jpeg" />
                    <Button variant="outlined" startIcon={<AddAPhotoIcon />} onClick={triggerFileInput}>
                      Choose Picture
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      This step is optional. You can add a profile picture later from your profile page.
                    </Typography>
                  </Stack>
                </Box>
              );
            default:
              return null;
          }
        })()}
      </Box>
    </Fade>
  );

  return (
    <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={step === 1 ? () => navigate(-1) : handleBack} sx={{ color: 'var(--dark-text)', textTransform: 'none' }}>
            Back
          </Button>
          <RouterLink to="/"><img src={logo} alt="AgriKlima Logo" style={{ height: '40px' }} /></RouterLink>
          <Box sx={{ width: 80 }} />
        </Box>
      </Container>

      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
        <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', boxShadow: '0px 4px 16px rgba(0,0,0,0.05)' }}>
          <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 5 }}>
            {STEPS.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>
            {STEPS[step - 1]}
          </Typography>

          <Box sx={{ minHeight: '350px' }}>{renderStepContent()}</Box>
        </Paper>

        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 4 }}>
          <Button
            onClick={step === 5 ? handleSubmit : handleNext}
            variant="contained"
            disabled={!isStepValid || isSubmitting}
            sx={{
              backgroundColor: 'var(--primary-green)',
              borderRadius: '30px',
              px: 10,
              py: 1.5,
              textTransform: 'none',
              fontSize: '18px',
              '&:disabled': {
                backgroundColor: 'grey.300'
              }
            }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : step === 5 ? 'Finish Registration' : 'Next'}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default SignUpPage;