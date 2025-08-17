// src/pages/AboutUsPage.jsx

import React from 'react';
import { Container, Box, Typography, Grid, Button, IconButton, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import logo from '../assets/logo.png'; // Assuming your logo is in src/assets/

// --- Image Imports ---
import heroBg from '../assets/images/about-hero-bg.jpg';
import mainImg from '../assets/images/about-main-image.jpg';
import secondaryImg from '../assets/images/about-secondary-image.jpg';
import visionMissionImg from '../assets/images/about-vision-mission.jpg';
import videoBg from '../assets/images/about-video-bg.jpg';

// --- Reusable Feature Item Component ---
const FeatureItem = ({ text }) => (
    <Grid item xs={12} md={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircleIcon sx={{ color: 'var(--primary-green)', fontSize: '2rem' }} />
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{text}</Typography>
                <Typography variant="body2" color="text.secondary">
                    There are variation You need to be sure there is anything hidden in the middle of text.
                </Typography>
            </Box>
        </Box>
    </Grid>
);

// --- Main About Us Page Component ---
const AboutUsPage = () => {
    return (
        <Box>
            {/* --- 1. Hero Section --- */}
            <Box
                sx={{
                    height: '60vh',
                    background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: 'white',
                }}
            >
                <Typography variant="h5">Welcome to</Typography>
                <img src={logo} alt="AgriKlima Logo" style={{ height: '100px', margin: '1rem 0' }} />
            </Box>

            {/* --- 2. About Us Section with Overlapping Images --- */}
            <Paper elevation={0} sx={{ py: 8, bgcolor: '#faf8f4' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={5} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ position: 'relative', width: '100%', maxWidth: '500px', mx: 'auto' }}>
                                <Box component="img" src={mainImg} alt="Tractor in field" sx={{ width: '100%', borderRadius: '50%', border: '10px solid white' }}/>
                                <Box component="img" src={secondaryImg} alt="Farmer holding produce" sx={{
                                    position: 'absolute',
                                    bottom: '0%',
                                    left: '-5%',
                                    width: '45%',
                                    borderRadius: '50%',
                                    border: '10px solid white',
                                    boxShadow: 3
                                }}/>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>About Us</Typography>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                There are many variations of passages of lorem ipsum available but the majority have suffered alteration in some form by injected humor or random word which don't look even.
                            </Typography>
                            <Typography color="text.secondary">
                                There are many variations of passages of lorem ipsum available but the majority have suffered alteration in some form by injected humor or random word which don't look even.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>

            {/* --- 3. Vision & Mission Section --- */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={5} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>Vision</Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            Growing vegetables in your own garden can be a rewarding and fulfilling experience. Not only does it provide you with fresh and nutritious produce, but it also allows you to connect with nature and enjoy the satisfaction of watching your plants thrive.
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>Mission</Typography>
                        <Typography color="text.secondary">
                            Growing vegetables in your own garden can be a rewarding and fulfilling experience. Not only does it provide you with fresh and nutritious produce, but it also allows you to connect with nature and enjoy the satisfaction of watching your plants thrive.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box component="img" src={visionMissionImg} alt="Woman with basket of vegetables" sx={{ width: '100%', borderRadius: '24px', border: '2px solid var(--primary-green)', padding: '8px', boxShadow: 3 }}/>
                    </Grid>
                </Grid>
            </Container>

             {/* --- 4. Video Banner Section --- */}
            <Box sx={{ py: 10, background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${videoBg})`, backgroundSize: 'cover', backgroundPosition: 'center', textAlign: 'center', color: 'white' }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                    Agriculture Matters to the<br/>Future of Development
                </Typography>
                <Button endIcon={<PlayCircleFilledWhiteIcon sx={{fontSize: '3rem !important'}}/>} sx={{ mt: 3, color: 'white', textTransform: 'none' }}>
                    <Typography variant="h6">Watch our video</Typography>
                </Button>
            </Box>

            {/* --- 5. Our Features Section --- */}
            <Paper elevation={0} sx={{ py: 8, bgcolor: '#f0f4e8' }}>
                 <Container maxWidth="lg">
                    <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 6 }}>
                        Our <span style={{color: 'var(--primary-green)'}}>Features</span>
                    </Typography>
                    <Grid container spacing={4} rowSpacing={5}>
                        <FeatureItem text="Weather Forecast" />
                        <FeatureItem text="Recommended Crops" />
                        <FeatureItem text="Predicted Weather Conditions" />
                        <FeatureItem text="Pest Detection and Information" />
                        <FeatureItem text="Suggested Farming Actions Based on Weather" />
                        <FeatureItem text="Personalized/Specified Suggestions per Account" />
                        <FeatureItem text="Proper Farming Calendar" />
                        <FeatureItem text="AI Chatbot specialized for Farming" />
                    </Grid>
                 </Container>
            </Paper>

        </Box>
    );
};

export default AboutUsPage;