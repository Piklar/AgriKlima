// src/pages/AboutUsPage.jsx

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import logo from '../assets/logo.png';

// --- Image Imports ---
import heroBg from '../assets/images/about-hero-bg.jpg';
import mainImg from '../assets/images/about-main-image.jpg';
import secondaryImg from '../assets/images/about-secondary-image.jpg';
import visionMissionImg from '../assets/images/about-vision-mission.jpg';
import videoBg from '../assets/images/about-video-bg.jpg';

// --- Reusable Feature Item ---
const FeatureItem = ({ text }) => (
  <Grid item xs={12} md={6}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <CheckCircleIcon
        sx={{ color: 'var(--primary-green)', fontSize: '2rem', flexShrink: 0 }}
      />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          {text}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Our system ensures reliable and professional support to farmers for
          better outcomes.
        </Typography>
      </Box>
    </Box>
  </Grid>
);

// --- Main Component ---
const AboutUsPage = () => {
  return (
    <Box>
      {/* --- 1. Hero Section --- */}
      <Box
        sx={{
          height: '65vh',
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
          px: 2
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Welcome to
        </Typography>
        <img
          src={logo}
          alt="AgriKlima Logo"
          style={{ height: '110px', marginBottom: '1rem' }}
        />
        <Typography variant="h4" sx={{ fontWeight: 500, maxWidth: 700 }}>
          Empowering Farmers with Data-Driven Agricultural Solutions
        </Typography>
      </Box>

      {/* --- 2. About Us Section --- */}
      <Paper elevation={0} sx={{ py: 10, bgcolor: '#faf8f4' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left: Images */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 500,
                  mx: 'auto'
                }}
              >
                <Box
                  component="img"
                  src={mainImg}
                  alt="Tractor in field"
                  sx={{
                    width: '100%',
                    borderRadius: '50%',
                    border: '10px solid white',
                    boxShadow: 3
                  }}
                />
                <Box
                  component="img"
                  src={secondaryImg}
                  alt="Farmer holding produce"
                  sx={{
                    position: 'absolute',
                    bottom: '-5%',
                    left: '-8%',
                    width: '45%',
                    borderRadius: '50%',
                    border: '10px solid white',
                    boxShadow: 4
                  }}
                />
              </Box>
            </Grid>

            {/* Right: Text */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 'bold', mb: 3, color: 'var(--primary-green)' }}
              >
                About Us
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mb: 2, lineHeight: 1.7 }}
              >
                AgriKlima is dedicated to providing smart, data-driven tools to
                help farmers adapt to climate challenges. Through innovative
                technology, we support sustainable farming practices that
                enhance productivity and resilience.
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Our mission is to empower every farmer with accurate weather
                forecasts, crop recommendations, and AI-assisted insights to
                achieve better harvests and a stronger agricultural community.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* --- 3. Vision & Mission Section --- */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 'bold', mb: 2, color: 'var(--primary-green)' }}
            >
              Vision
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 5, lineHeight: 1.7 }}>
              To create a sustainable and climate-resilient agricultural
              community where farmers thrive through technology-driven insights
              and solutions.
            </Typography>

            <Typography
              variant="h3"
              sx={{ fontWeight: 'bold', mb: 2, color: 'var(--primary-green)' }}
            >
              Mission
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              To empower local farmers with accurate data, AI support, and
              farming tools that enhance decision-making, optimize productivity,
              and promote environmental stewardship.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={visionMissionImg}
              alt="Woman with basket of vegetables"
              sx={{
                width: '100%',
                borderRadius: '24px',
                border: '3px solid var(--primary-green)',
                p: '8px',
                boxShadow: 4
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* --- 4. Video Banner --- */}
      <Box
        sx={{
          py: 12,
          px: 2,
          background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${videoBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center',
          color: 'white'
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontWeight: 'bold', maxWidth: 900, mx: 'auto', mb: 4 }}
        >
          Agriculture Matters to the Future of Development
        </Typography>
        <Button
          endIcon={
            <PlayCircleFilledWhiteIcon sx={{ fontSize: '2.5rem !important' }} />
          }
          sx={{
            mt: 2,
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            border: '2px solid white',
            borderRadius: '50px',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <Typography variant="h6">Watch our video</Typography>
        </Button>
      </Box>

      {/* --- 5. Features Section --- */}
      <Paper elevation={0} sx={{ py: 10, bgcolor: '#f0f4e8' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 8,
              color: 'var(--primary-green)'
            }}
          >
            Our Features
          </Typography>

          <Grid container spacing={4} rowSpacing={6}>
            <FeatureItem text="Weather Forecast" />
            <FeatureItem text="Recommended Crops" />
            <FeatureItem text="Predicted Weather Conditions" />
            <FeatureItem text="Pest Detection and Information" />
            <FeatureItem text="Suggested Farming Actions" />
            <FeatureItem text="Personalized Suggestions per Account" />
            <FeatureItem text="Farming Calendar" />
            <FeatureItem text="AI Chatbot for Farming Support" />
          </Grid>
        </Container>
      </Paper>
    </Box>
  );
};

export default AboutUsPage;