import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as api from '../services/api';

import {
  Container, Box, Typography, Button, Grid, Card, CardMedia, CardContent,
  TextField, Stepper, Step, StepLabel, Paper, Stack,
  CircularProgress, MenuItem, FormControl, InputLabel, Select,
  InputAdornment, IconButton, Fade, Avatar, Link as MuiLink
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import logo from '../assets/logo.png';

// images …
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

// selection card
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

const STEPS = ['Account Info', 'Personal Details', 'Crops', 'Location', 'Profile Picture'];

const LOCATION_OPTIONS = [
  { label: 'Mexico, Pampanga', img: mexicoImg, value: 'Mexico, Pampanga' },
  { label: 'City of San Fernando, Pampanga', img: csfpImg, value: 'City of San Fernando, Pampanga' },
  { label: 'Santa Ana, Pampanga', img: staAnaImg, value: 'Santa Ana, Pampanga' },
  { label: 'Arayat, Pampanga', img: arayatImg, value: 'Arayat, Pampanga' },
  { label: 'Bacolor, Pampanga', img: bacolorImg, value: 'Bacolor, Pampanga' },
  { label: 'Others', img: gpsImg, value: 'Others' },
];
const CROP_OPTIONS = [
  { label: 'Rice', img: wheatImg },
  { label: 'Corn', img: cornImg },
  { label: 'Onion', img: onionImg },
  { label: 'Others', img: othersImg },
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

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobileNo: '',
    password: '', confirmPassword: '', dob: '', gender: '',
    language: '', crops: [], location: '',
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
  const handleCropToggle = (crop) => {
    const newCrops = formData.crops.includes(crop)
      ? formData.crops.filter(c => c !== crop)
      : [...formData.crops, crop];
    handleSelection('crops', newCrops);
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
          formData.firstName &&
          formData.lastName &&
          formData.email.includes('@') &&
          formData.mobileNo.length === 11 &&
          formData.password.length >= 8 &&
          formData.password === formData.confirmPassword
        );
      case 2:
        return formData.dob && formData.gender && formData.language;
      case 3:
        return formData.crops.length > 0;
      case 4:
        return !!formData.location;
      case 5:
        return true;
      default:
        return false;
    }
  }, [formData, step]);

  const handleSubmit = async () => {
    if (!isStepValid) return;
    setIsSubmitting(true);
    try {
      await api.registerUser(formData);
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
                  {CROP_OPTIONS.map(crop => (
                    <Grid item xs={12} sm={6} md={3} key={crop.label}>
                      <SelectionCard image={crop.img} label={crop.label} isSelected={formData.crops.includes(crop.label)} onClick={() => handleCropToggle(crop.label)} />
                    </Grid>
                  ))}
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
                    <Avatar src={previewUrl} sx={{ width: 150, height: 150, mb: 2, bgcolor: 'grey.300' }}>
                      <AddAPhotoIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/png, image/jpeg" />
                    <Button variant="outlined" startIcon={<AddAPhotoIcon />} onClick={triggerFileInput}>
                      Choose Picture
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      This step is optional. You can add a profile picture later.
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
            disabled={isSubmitting}
            sx={{
              backgroundColor: 'var(--primary-green)',
              borderRadius: '30px',
              px: 10,
              py: 1.5,
              textTransform: 'none',
              fontSize: '18px',
            }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : step === 5 ? 'Finish' : 'Next'}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default SignUpPage;
