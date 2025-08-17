import React from 'react';
import { Button, Container, Grid, Typography, Box } from '@mui/material';

// Import your images
import heroBg from '../assets/images/about-image-1.jpg';
import videoBg from '../assets/images/about-image-2.jpg';
import heroImg1 from '../assets/images/hero-background.jpg';
import aboutImg2 from '../assets/images/about-image-2.jpg';
import visionImg from '../assets/images/mission-vision.jpg';
import logo from '../assets/logo.png';

// Import icons for features section
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const HomePage = () => {
  // Styles
  const heroStyles = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0, 0, 0, 0.5)), url(${heroBg})`,
    height: '90vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center'
  };

  const videoBannerStyles = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${videoBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '100px 0',
    color: 'white',
    textAlign: 'center'
  };

  return (
    <>
      {/* Hero Section */}
      <Box sx={heroStyles}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          "Without agriculture, there is no life, no growth, and no future."
        </Typography>
        <Box mt={3}>
          <Button variant="contained" size="large" sx={{ backgroundColor: 'var(--primary-green)', marginRight: 2 }}>Get Started</Button>
          <Button variant="outlined" size="large" sx={{ color: 'white', borderColor: 'white' }}>Learn More</Button>
        </Box>
      </Box>

      {/* About Section */}
      <Container className="section-padding">
        {/* Placeholder for the About section with two columns and overlapping images */}
        <Typography variant="h4" className="section-title">About <span>AgriKlima</span></Typography>
      </Container>
      
      {/* Vision/Mission Section */}
      <Container className="section-padding">
         {/* Placeholder for Vision/Mission */}
         <Typography variant="h4" className="section-title">Our Vision & <span>Mission</span></Typography>
      </Container>

      {/* Video Banner */}
      <Box sx={videoBannerStyles}>
        <Typography variant="h2" component="h2" sx={{ fontWeight: 'bold' }}>
          Agriculture Matters to the<br />Future of Development
        </Typography>
        <Button variant="text" sx={{ color: 'white', marginTop: 2 }}>
          Watch our video
        </Button>
      </Box>

      {/* Features Section */}
      <Container className="section-padding">
        <Typography variant="h4" className="section-title">Our <span>Features</span></Typography>
        <Grid container spacing={4}>
          {['Weather Forecast', 'Recommended Crops', 'Predicted Weather Conditions'].map((feature) => (
            <Grid item xs={12} md={4} key={feature}>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon sx={{ color: 'var(--primary-green)', marginRight: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: '600' }}>{feature}</Typography>
                  <Typography variant="body2">There are variations you need to be sure there is anything hidden.</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
          {/* Add the other 3 features here */}
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;