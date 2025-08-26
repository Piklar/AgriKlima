import React from 'react';
import { Button, Container, Grid, Typography, Box } from '@mui/material';

// Import your images
import heroBg from '../assets/images/about-image-1.jpg';
import videoBg from '../assets/images/about-image-2.jpg';
import visionImg from '../assets/images/mission-vision.jpg';
import logo from '../assets/logo.png';

// Import icons for features section
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const HomePage = () => {
  // Styles
  const heroStyles = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroBg})`,
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    padding: '0 20px'
  };

  const videoBannerStyles = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${videoBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '120px 20px',
    color: 'white',
    textAlign: 'center'
  };

  return (
    <>
      {/* Hero Section */}
      <Box sx={heroStyles}>
        <img src={logo} alt="AgriKlima Logo" style={{ width: '180px', marginBottom: '20px' }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', maxWidth: '900px' }}>
          "Without agriculture, there is no life, no growth, and no future."
        </Typography>
        <Box mt={4} display="flex" gap={2} flexWrap="wrap" justifyContent="center">
          <Button variant="contained" size="large" sx={{ backgroundColor: 'var(--primary-green)', px: 4, py: 1.5 }}>
            Get Started
          </Button>
          <Button variant="outlined" size="large" sx={{ color: 'white', borderColor: 'white', px: 4, py: 1.5 }}>
            Learn More
          </Button>
        </Box>
      </Box>

      {/* About Section */}
      <Container sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 6 }}>
          About <span style={{ color: 'var(--primary-green)' }}>AgriKlima</span>
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.8 }}>
          AgriKlima is a climate-smart agriculture platform designed to empower farmers with accurate weather
          forecasts, crop recommendations, and real-time insights to adapt to changing climate conditions.
        </Typography>
      </Container>

      {/* Vision/Mission Section */}
      <Container sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 6 }}>
          Our Vision & <span style={{ color: 'var(--primary-green)' }}>Mission</span>
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.8 }}>
          Our vision is to create a sustainable farming community supported by modern technology.
          Our mission is to help farmers adapt, thrive, and innovate in the face of climate change.
        </Typography>
      </Container>

      {/* Video Banner */}
      <Box sx={videoBannerStyles}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', maxWidth: '900px', mx: 'auto', mb: 3 }}>
          Agriculture Matters to the<br />Future of Development
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: 'var(--primary-green)', px: 4, py: 1.5 }}>
          Watch Our Video
        </Button>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 12 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 8 }}>
          Our <span style={{ color: 'var(--primary-green)' }}>Features</span>
        </Typography>
        <Grid container spacing={6}>
          {[
            'Weather Forecast',
            'Recommended Crops',
            'Predicted Weather Conditions',
            'Pest Detection',
            'Farming Calendar',
            'AI Farming'
          ].map((feature) => (
            <Grid item xs={12} md={4} key={feature}>
              <Box display="flex" alignItems="flex-start">
                <CheckCircleIcon sx={{ color: 'var(--primary-green)', fontSize: 32, mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: '600' }}>{feature}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    Empowering farmers with reliable tools and insights for better decision-making.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;