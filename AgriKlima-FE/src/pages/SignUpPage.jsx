// src/pages/SignUpPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, Box, Typography, Button, Grid, Card, CardMedia, CardContent,
  TextField, Link as MuiLink, Select, MenuItem, FormControl, InputLabel,
  InputAdornment, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from '../assets/logo.png';
import Swal from 'sweetalert2';

// Image Imports (ensure these paths are correct in your project)
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
import farmerImg from '../assets/images/farmer-long-term.png';

// --- THIS IS THE FIX: The actual component code is included ---
const SelectionCard = ({ image, label, isSelected, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: 'pointer',
      borderRadius: '20px',
      boxShadow: isSelected ? '0 0 0 3px var(--primary-green)' : '0 4px 12px rgba(0,0,0,0.08)',
      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
      transition: 'all 0.2s ease-in-out',
      border: '1px solid #eee'
    }}
  >
    <CardMedia component="img" image={image} alt={label} sx={{ height: 160 }} />
    <CardContent>
      <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
    </CardContent>
  </Card>
);

// --- Main SignUp Page Component ---
const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', dob: '', gender: '', phone: '',
    language: 'Tagalog', email: '', password: '', confirmPassword: '',
    farmerStatus: '', crops: [], location: '',
  });

  // --- MODIFIED handleNext with Password Validation ---
  const handleNext = () => {
    if (step === 1) {
      if (formData.password.length < 8) {
        Swal.fire('Password Too Short', 'Your password must be at least 8 characters long.', 'error');
        return; 
      }
      if (formData.password !== formData.confirmPassword) {
        Swal.fire('Passwords Do Not Match', 'Please ensure both password fields are the same.', 'error');
        return;
      }
    }
    setStep(prev => prev + 1);
  };
  
  const handleBack = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCropToggle = (crop) => {
    const newCrops = formData.crops.includes(crop)
      ? formData.crops.filter(c => c !== crop)
      : [...formData.crops, crop];
    handleCustomChange('crops', newCrops);
  };
  
  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Error', 'Passwords do not match.', 'error');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:4000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed.');
      }
      Swal.fire({
        title: 'Registration Successful!',
        text: 'You can now log in with your new account.',
        icon: 'success',
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    } catch (error) {
      Swal.fire('Registration Failed', error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>Sign Up</Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={5}>
          <Box sx={{ border: '1px solid #ddd', borderRadius: '20px', p: 4 }}>
            <TextField fullWidth name="fullName" label="Complete Name" value={formData.fullName} onChange={handleChange} placeholder="Ex: Juan Dela Cruz" variant="outlined" margin="normal" />
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth name="dob" label="Date of birth" value={formData.dob} onChange={handleChange} placeholder="DD/MM/YYYY" variant="outlined" margin="normal" /></Grid>
              <Grid item xs={6}><FormControl fullWidth margin="normal"><InputLabel>Gender</InputLabel><Select name="gender" value={formData.gender} onChange={handleChange} label="Gender"><MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem></Select></FormControl></Grid>
            </Grid>
            <TextField fullWidth name="phone" label="Phone number" value={formData.phone} onChange={handleChange} placeholder="+63XXXXXXXXXX" variant="outlined" margin="normal" />
            <FormControl fullWidth margin="normal"><InputLabel>Language</InputLabel><Select name="language" value={formData.language} onChange={handleChange} label="Language"><MenuItem value="Tagalog">Tagalog</MenuItem><MenuItem value="English">English</MenuItem></Select></FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
            <TextField fullWidth name="email" label="Email Address" value={formData.email} onChange={handleChange} sx={{'& .MuiOutlinedInput-root': {borderRadius: '30px'}}} margin="normal" InputProps={{startAdornment: (<InputAdornment position="start"><EmailOutlinedIcon sx={{color: 'grey.500'}} /></InputAdornment>)}}/>
            <TextField fullWidth name="password" type="password" label="Password" value={formData.password} onChange={handleChange} sx={{'& .MuiOutlinedInput-root': {borderRadius: '30px'}}} margin="normal" InputProps={{startAdornment: (<InputAdornment position="start"><LockOutlinedIcon sx={{color: 'grey.500'}} /></InputAdornment>)}}/>
            <TextField fullWidth name="confirmPassword" type="password" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} sx={{'& .MuiOutlinedInput-root': {borderRadius: '30px'}}} margin="normal" InputProps={{startAdornment: (<InputAdornment position="start"><LockOutlinedIcon sx={{color: 'grey.500'}} /></InputAdornment>)}}/>
        </Grid>
      </Grid>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button onClick={handleNext} variant="contained" sx={{ backgroundColor: 'var(--primary-green)', borderRadius: '30px', padding: '12px 80px', textTransform: 'none', fontSize: '18px' }}>Signup</Button>
        <Typography variant="body2" sx={{ mt: 2, color: 'grey.600' }}>
            By creating an account, you agree to the <MuiLink component={RouterLink} to="/terms">Terms of use</MuiLink> and <MuiLink component={RouterLink} to="/privacy">Privacy Policy</MuiLink>.
        </Typography>
      </Box>
    </>
  );

  const renderStep2 = () => (
    <>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 5, fontWeight: 600 }}>Starting to Farm or Current Farmer?</Typography>
      <Grid container spacing={4} justifyContent="center" maxWidth="sm" mx="auto">
        <Grid item xs={12} sm={6}>
          <SelectionCard image={farmerImg} label="Long Term Farmer" isSelected={formData.farmerStatus === 'Long Term'} onClick={() => handleCustomChange('farmerStatus', 'Long Term')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <SelectionCard image={farmerImg} label="Starting Farmer" isSelected={formData.farmerStatus === 'Starting'} onClick={() => handleCustomChange('farmerStatus', 'Starting')} />
        </Grid>
      </Grid>
    </>
  );

  const renderStep3 = () => (
    <>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 5, fontWeight: 600 }}>Choose what are the crops</Typography>
      <Grid container spacing={4} justifyContent="center" maxWidth="lg" mx="auto">
        {[{label: 'Wheat', img: wheatImg}, {label: 'Corn', img: cornImg}, {label: 'Onion', img: onionImg}, {label: 'Others', img: othersImg}].map(crop => (
            <Grid item xs={12} sm={6} md={3} key={crop.label}>
                <SelectionCard image={crop.img} label={crop.label} isSelected={formData.crops.includes(crop.label)} onClick={() => handleCropToggle(crop.label)} />
            </Grid>
        ))}
      </Grid>
    </>
  );

  const renderStep4 = () => (
    <>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 5, fontWeight: 600 }}>Where do you reside?</Typography>
      <Grid container spacing={4} justifyContent="center" maxWidth="lg" mx="auto">
        {[
            {label: 'Mexico', img: mexicoImg}, {label: 'CSFP', img: csfpImg}, {label: 'Sta Ana', img: staAnaImg},
            {label: 'Arayat', img: arayatImg}, {label: 'Bacolor', img: bacolorImg}, {label: 'Use my GPS', img: gpsImg}
        ].map(loc => (
            <Grid item xs={12} sm={6} md={4} key={loc.label}>
                <SelectionCard image={loc.img} label={loc.label} isSelected={formData.location === loc.label} onClick={() => handleCustomChange('location', loc.label)} />
            </Grid>
        ))}
      </Grid>
    </>
  );

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
          <Button startIcon={<ArrowBackIcon />} onClick={step === 1 ? () => navigate(-1) : handleBack} sx={{ color: 'var(--dark-text)', textTransform: 'none' }}>Back</Button>
          <img src={logo} alt="AgriKlima Logo" style={{ height: '40px' }} />
          <Box sx={{ width: 80 }} />
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </Container>
      
      {step > 1 && (
        <Box sx={{ padding: '40px 0', textAlign: 'center' }}>
          <Button 
            onClick={step === 4 ? handleSubmit : handleNext} 
            variant="contained"
            disabled={isSubmitting}
            sx={{ backgroundColor: 'var(--primary-green)', borderRadius: '30px', padding: '12px 100px', textTransform: 'none', fontSize: '18px' }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (step === 4 ? 'Finish' : 'Next')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SignUpPage;