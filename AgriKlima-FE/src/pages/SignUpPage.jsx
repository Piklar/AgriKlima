// src/pages/SignUpPage.jsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';

import {
    Container, Box, Typography, Button, Grid, Card, CardMedia, CardContent,
    TextField, Stepper, Step, StepLabel, Paper, Stack,
    CircularProgress, MenuItem, FormControl, InputLabel, Select,
    InputAdornment, IconButton, Fade, Avatar, Collapse, Link as MuiLink,
    FormControlLabel, Checkbox, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; // <-- IMPORT ICON
import logo from '../assets/logo.png';

// Import local images
import mexicoImg from '../assets/images/location-mexico.jpg';
import csfpImg from '../assets/images/location-csfp.jpg';
import staAnaImg from '../assets/images/location-sta-ana.jpg';
import arayatImg from '../assets/images/location-arayat.jpg';
import bacolorImg from '../assets/images/location-bacolor.jpg';
import startingImg from '../assets/images/crop-starting.jpg';
import othersImg from '../assets/images/crop-others.jpg';

import Terms from '../components/Terms';

// --- Reusable Component Definitions ---
const SelectionCard = ({ image, label, isSelected, onClick }) => (
    <Card
        onClick={onClick}
        sx={{
            cursor: 'pointer', borderRadius: '20px',
            boxShadow: isSelected ? '0 0 0 4px #2e7d32' : '0 4px 12px rgba(0,0,0,0.08)',
            transform: isSelected ? 'scale(1.03)' : 'scale(1)',
            transition: 'all 0.2s ease-in-out', border: '1px solid #eee', height: '100%',
        }}
    >
        <CardMedia component="img" image={image} alt={label} sx={{ height: 160, objectFit: 'cover' }} />
        <CardContent sx={{ p: 2 }}><Typography variant="subtitle1" align="center" sx={{ fontWeight: 600 }}>{label}</Typography></CardContent>
    </Card>
);

const CropSelectionCard = ({ image, label, isSelected, onToggle, onDateChange, plantingDate }) => (
    <Card
        sx={{
            borderRadius: '20px', boxShadow: isSelected ? '0 0 0 4px #2e7d32' : '0 4px 12px rgba(0,0,0,0.08)',
            transform: isSelected ? 'scale(1.03)' : 'scale(1)',
            transition: 'all 0.2s ease-in-out', border: '1px solid #eee', height: '100%',
        }}
    >
        <CardMedia component="img" image={image || othersImg} alt={label} sx={{ height: 140, cursor: 'pointer', objectFit: 'cover' }} onClick={onToggle} />
        <CardContent sx={{ p: 2, pt: 1 }}>
            <Typography variant="subtitle1" align="center" sx={{ fontWeight: 600, cursor: 'pointer' }} onClick={onToggle}>{label}</Typography>
            <Collapse in={isSelected}>
                <TextField label="Planting Date" type="date" fullWidth value={plantingDate} onChange={(e) => onDateChange(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mt: 2 }} required={isSelected} />
            </Collapse>
        </CardContent>
    </Card>
);

const PasswordStrengthIndicator = ({ password }) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const hasMinLength = password.length >= 8;

    const requirementStyle = { display: 'flex', alignItems: 'center', mb: 0.5 };
    const iconStyle = { fontSize: '1rem', mr: 1 };
    const textStyle = { fontSize: '0.8rem' };

    return (
        <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f1f8f4', borderRadius: 2 }}>
            <List dense>
                <ListItem sx={requirementStyle}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                        {hasMinLength ? <CheckCircleOutlineIcon color="success" sx={iconStyle} /> : <HighlightOffIcon color="error" sx={iconStyle} />}
                    </ListItemIcon>
                    <ListItemText primary="At least 8 characters" primaryTypographyProps={{ color: hasMinLength ? 'success.main' : 'error.main', sx: textStyle }} />
                </ListItem>
                <ListItem sx={requirementStyle}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                        {hasUpperCase ? <CheckCircleOutlineIcon color="success" sx={iconStyle} /> : <HighlightOffIcon color="error" sx={iconStyle} />}
                    </ListItemIcon>
                    <ListItemText primary="One uppercase letter" primaryTypographyProps={{ color: hasUpperCase ? 'success.main' : 'error.main', sx: textStyle }} />
                </ListItem>
                <ListItem sx={requirementStyle}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                        {hasSpecialChar ? <CheckCircleOutlineIcon color="success" sx={iconStyle} /> : <HighlightOffIcon color="error" sx={iconStyle} />}
                    </ListItemIcon>
                    <ListItemText primary="One special character (!@#$...)" primaryTypographyProps={{ color: hasSpecialChar ? 'success.main' : 'error.main', sx: textStyle }} />
                </ListItem>
            </List>
        </Box>
    );
};

const STEPS = ['Account Info', 'Personal Details', 'Your Crops', 'Location', 'Finalize'];
const LOCATION_OPTIONS = [
    { label: 'Mexico, Pampanga', img: mexicoImg, value: 'Mexico, Pampanga' },
    { label: 'City of San Fernando, Pampanga', img: csfpImg, value: 'City of San Fernando, Pampanga' },
    { label: 'Santa Ana, Pampanga', img: staAnaImg, value: 'Santa Ana, Pampanga' },
    { label: 'Arayat, Pampanga', img: arayatImg, value: 'Arayat, Pampanga' },
    { label: 'Bacolor, Pampanga', img: bacolorImg, value: 'Bacolor, Pampanga' },
];

const SignUpPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [dbCrops, setDbCrops] = useState([]);
    const [loadingCrops, setLoadingCrops] = useState(true);

    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isJustStarting, setIsJustStarting] = useState(false);
    
    // FIX: Add state for age validation error
    const [dobError, setDobError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', mobileNo: '',
        password: '', confirmPassword: '', dob: '', gender: '',
        language: 'Filipino', location: '', userCrops: [],
    });

    const [validation, setValidation] = useState({
        emailError: '',
        mobileError: '',
        isEmailLoading: false,
        isMobileLoading: false,
    });
    const debounceTimeout = useRef(null);

    useEffect(() => {
        const fetchCropsForSignup = async () => {
            setLoadingCrops(true);
            try {
                const response = await api.getCrops({ page: 1, limit: 100 });
                setDbCrops(response.data?.crops || []);
            } catch (error) {
                console.error("Failed to load crops for signup:", error);
                Swal.fire('Error', 'Could not load crop options. Please try refreshing.', 'error');
            } finally {
                setLoadingCrops(false);
            }
        };
        fetchCropsForSignup();
    }, []);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    // FIX: AGE VALIDATION LOGIC
    const handleAgeValidation = (dateString) => {
        if (!dateString) {
            setDobError('');
            return;
        }
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 14) {
            setDobError('You must be 14 years or older to register.');
        } else {
            setDobError('');
        }
    };
    
    const validateField = useCallback((name, value) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
            if ((name === 'email' && !value.includes('@')) || (name === 'mobileNo' && value.length !== 11)) {
                return;
            }

            const key = name === 'email' ? 'isEmailLoading' : 'isMobileLoading';
            const errorKey = name === 'email' ? 'emailError' : 'mobileError';
            setValidation(prev => ({ ...prev, [key]: true, [errorKey]: '' }));

            try {
                const response = await api.checkUserExists({ [name]: value });
                if (response.data.exists) {
                    setValidation(prev => ({ ...prev, [errorKey]: response.data.message }));
                }
            } catch (error) {
                console.error(`Validation error for ${name}:`, error);
            } finally {
                setValidation(prev => ({ ...prev, [key]: false }));
            }
        }, 800);
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'email' || name === 'mobileNo') {
            const errorKey = name === 'email' ? 'emailError' : 'mobileError';
            setValidation(prev => ({ ...prev, [errorKey]: '' }));
            validateField(name, value);
        }
        
        // FIX: Trigger age validation on DOB change
        if (name === 'dob') {
            handleAgeValidation(value);
        }
    };
    
    const handleSelection = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCropToggle = (crop) => {
        setIsJustStarting(false);
        setFormData(prev => {
            const isSelected = prev.userCrops.some(c => c.cropId === crop._id);
            if (isSelected) {
                return { ...prev, userCrops: prev.userCrops.filter(c => c.cropId !== crop._id) };
            } else {
                return { ...prev, userCrops: [...prev.userCrops, { cropId: crop._id, name: crop.name, plantingDate: '' }] };
            }
        });
    };

    const handleJustStartingToggle = () => {
        setIsJustStarting(true);
        setFormData(f => ({ ...f, userCrops: [] }));
    };

    const handleCropDateChange = (cropId, date) => {
        setFormData(prev => ({
            ...prev,
            userCrops: prev.userCrops.map(c => c.cropId === cropId ? { ...c, plantingDate: date } : c)
        }));
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setProfilePictureFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };
    const triggerFileInput = () => fileInputRef.current.click();

    const passwordHasUpperCase = /[A-Z]/.test(formData.password);
    const passwordHasSpecialChar = /[!@#$%^&*]/.test(formData.password);
    const passwordHasMinLength = formData.password.length >= 8;
    const isPasswordValid = passwordHasUpperCase && passwordHasSpecialChar && passwordHasMinLength;

    const isStepValid = useMemo(() => {
        switch (step) {
            case 1: return (
                formData.firstName && formData.lastName && 
                formData.email.includes('@') && !validation.emailError &&
                formData.mobileNo.length === 11 && !validation.mobileError &&
                isPasswordValid &&
                formData.password === formData.confirmPassword
            );
            // FIX: Add dobError check to step 2 validation
            case 2: return (formData.dob && formData.gender && formData.language && !dobError);
            case 3: return (isJustStarting || (formData.userCrops.length > 0 && formData.userCrops.every(c => c.plantingDate)));
            case 4: return !!formData.location;
            case 5: return agreedToTerms;
            default: return false;
        }
    }, [formData, step, agreedToTerms, isJustStarting, validation.emailError, validation.mobileError, isPasswordValid, dobError]); // <-- dobError dependency added

    const handleSubmit = async () => {
        if (!isStepValid) {
          Swal.fire('Incomplete Information', 'Please ensure all required fields are filled and you have agreed to the terms.', 'warning');
          return;
        }
        setIsSubmitting(true);
        const { confirmPassword, ...registrationDataRaw } = formData;
        const registrationData = {
          ...registrationDataRaw,
          email: (registrationDataRaw.email || '').trim().toLowerCase(),
          mobileNo: (registrationDataRaw.mobileNo || '').trim(),
        };
    
        try {
            const userCropsToSend = isJustStarting ? [] : registrationData.userCrops;
            await api.registerUser({ ...registrationData, userCrops: userCropsToSend });

            await Swal.fire({
                title: 'Registration Successful!',
                text: 'Logging you in automatically...',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });
    
            try {
                const loggedInUser = await login(registrationData.email, formData.password);
    
                if (profilePictureFile) {
                    try {
                        const pictureFormData = new FormData();
                        pictureFormData.append('profilePicture', profilePictureFile);
                        await api.updateProfilePicture(pictureFormData);
                    } catch (pictureError) {
                        console.warn('Profile picture upload failed, continuing:', pictureError);
                    }
                }
    
                navigate(loggedInUser?.isAdmin ? '/admin/dashboard' : '/dashboard');
            } catch (loginError) {
                console.error('Auto-login failed:', loginError);
                const loginErrorMessage = loginError?.response?.data?.error || loginError?.message || 'Auto-login failed. Please log in manually.';
                await Swal.fire({
                    title: 'Registration Successful!',
                    text: `Auto-login failed: ${loginErrorMessage}. Please log in manually.`,
                    icon: 'warning',
                    confirmButtonText: 'Go to Login'
                });
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration Error:', error);
    
            if (!error.response) {
                Swal.fire('Registration Failed', 'No response from server. Check your network or backend server.', 'error');
            } else {
                const status = error.response.status;
                const data = error.response.data;
    
                if (status === 409) {
                    const msg = data?.error || data?.message || 'Email or Mobile Number already in use.';
                    Swal.fire('Account Already Registered', msg, 'warning');
                } else if (status >= 500) {
                    const msg = data?.error || data?.message || 'Internal server error. Check backend logs.';
                    Swal.fire('Server Error', msg, 'error');
                } else if (data?.error) {
                    Swal.fire('Registration Failed', data.error, 'warning');
                } else {
                    const msg = data?.message || 'An unexpected error occurred during registration.';
                    Swal.fire('Registration Failed', msg, 'error');
                }
            }
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
                                        <TextField 
                                            name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} fullWidth required 
                                            error={!!validation.emailError} helperText={validation.emailError}
                                            InputProps={{ endAdornment: validation.isEmailLoading && <CircularProgress size={20} /> }}
                                        />
                                        <TextField 
                                            name="mobileNo" label="Mobile Number" type="tel" value={formData.mobileNo} onChange={handleChange} fullWidth required 
                                            inputProps={{ maxLength: 11 }} helperText={validation.mobileError || "Format: 09123456789"}
                                            error={!!validation.mobileError}
                                            InputProps={{ endAdornment: validation.isMobileLoading && <CircularProgress size={20} /> }}
                                        />
                                        <TextField 
                                            name="password" label="Password" type={showPassword ? 'text' : 'password'} value={formData.password} 
                                            onChange={handleChange} fullWidth required 
                                            InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={handleClickShowPassword} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>)}}
                                        />
                                        {formData.password && <PasswordStrengthIndicator password={formData.password} />}

                                        <TextField 
                                            name="confirmPassword" label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} fullWidth required 
                                            error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''} 
                                            helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Passwords do not match' : ''} 
                                            InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={handleClickShowConfirmPassword} edge="end">{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>),}} 
                                        />
                                    </Stack>
                                </Box>
                            );
                        case 2:
                            return (
                                <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                                    <Stack spacing={3}>
                                        {/* FIX: Integrated Date of Birth Field with Age Validation */}
                                        <TextField 
                                            name="dob" 
                                            label="Date of Birth" 
                                            type="date" 
                                            value={formData.dob} 
                                            onChange={handleChange} 
                                            fullWidth 
                                            required 
                                            error={!!dobError}
                                            helperText={dobError}
                                            InputLabelProps={{ shrink: true }} 
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CalendarMonthIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <FormControl fullWidth required>
                                            <InputLabel>Gender</InputLabel>
                                            <Select name="gender" value={formData.gender} onChange={handleChange} label="Gender">
                                                <MenuItem value="Male">Male</MenuItem>
                                                <MenuItem value="Female">Female</MenuItem>
                                                <MenuItem value="Other">Other</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth required>
                                            <InputLabel>Language</InputLabel>
                                            <Select name="language" value={formData.language} onChange={handleChange} label="Language">
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
                                <Box>
                                    {loadingCrops ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                                    ) : (
                                        <Grid container spacing={3} justifyContent="center">
                                            {dbCrops.map((crop) => {
                                                const selectedCrop = formData.userCrops.find((c) => c.cropId === crop._id);
                                                return (
                                                    <Grid item xs={12} sm={6} md={3} key={crop._id}>
                                                        <CropSelectionCard 
                                                            image={crop.imageUrl} 
                                                            label={crop.name} 
                                                            isSelected={!!selectedCrop}
                                                            onToggle={() => handleCropToggle(crop)}
                                                            onDateChange={(date) => handleCropDateChange(crop._id, date)}
                                                            plantingDate={selectedCrop ? selectedCrop.plantingDate : ''}
                                                        />
                                                    </Grid>
                                                );
                                            })}
                                            {/* "I'm just starting" card */}
                                            <Grid item xs={12} sm={6} md={3}>
                                                <SelectionCard image={startingImg} label="I'm just starting" isSelected={isJustStarting} onClick={handleJustStartingToggle} />
                                            </Grid>
                                        </Grid>
                                    )}
                                </Box>
                            );
                        case 4:
                            return (
                                <Grid container spacing={3} justifyContent="center">
                                    {LOCATION_OPTIONS.map((loc) => (
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
                                        <Typography variant="h6">Profile Picture (Optional)</Typography>
                                        <Avatar src={previewUrl} sx={{ width: 150, height: 150, mb: 2, bgcolor: 'grey.300', border: '2px solid #ccc' }}>
                                            <AddAPhotoIcon sx={{ fontSize: 60, color: 'grey.500' }} />
                                        </Avatar>
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/png, image/jpeg" />
                                        <Button variant="outlined" startIcon={<AddAPhotoIcon />} onClick={triggerFileInput}>Choose Picture</Button>
                                        
                                        <FormControlLabel
                                            control={<Checkbox checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} name="agreedToTerms" color="primary" />}
                                            label={
                                                <Typography variant="body2">
                                                    I agree to the{' '}
                                                    <MuiLink component="button" type="button" onClick={() => setIsTermsModalOpen(true)} variant="body2" sx={{ verticalAlign: 'baseline' }}>
                                                        Terms of Service & Privacy Policy
                                                    </MuiLink>
                                                    .
                                                </Typography>
                                            }
                                        />
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
        <>
            <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
                        <Button 
                            startIcon={<ArrowBackIcon />} 
                            onClick={step === 1 ? () => navigate('/login') : handleBack} 
                            sx={{ color: 'var(--dark-text)', textTransform: 'none' }}
                        >
                            {step === 1 ? 'Back to Login' : 'Back'}
                        </Button>
                        <RouterLink to="/"><img src={logo} alt="AgriKlima Logo" style={{ height: '40px' }} /></RouterLink>
                        <Box sx={{ width: 100 }} />
                    </Box>
                </Container>

                <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
                    <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', boxShadow: '0px 4px 16px rgba(0,0,0,0.05)' }}>
                        <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 5 }}>
                            {STEPS.map(label => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
                        </Stepper>
                        <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>{STEPS[step - 1]}</Typography>
                        <Box sx={{ minHeight: '350px' }}>{renderStepContent()}</Box>
                    </Paper>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 4 }}>
                        <Button
                            onClick={step === STEPS.length ? handleSubmit : handleNext}
                            variant="contained"
                            disabled={!isStepValid || isSubmitting || validation.isEmailLoading || validation.isMobileLoading}
                            sx={{ backgroundColor: '#2e7d32', borderRadius: '30px', px: 10, py: 1.5, textTransform: 'none', fontSize: '18px', '&:disabled': { backgroundColor: 'grey.300' } }}
                        >
                            {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (step === STEPS.length ? 'Create Account' : 'Next')}
                        </Button>
                    </Stack>
                    <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                        Already have an account? 
                        <MuiLink component={RouterLink} to="/login" variant="subtitle2" sx={{ ml: 0.5, fontWeight: 600 }}>
                            Log In
                        </MuiLink>
                    </Typography>
                </Container>
            </Box>

            <Terms open={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
        </>
    );
};

export default SignUpPage;