import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AboutUsPage = () => {
  return (
    <Container sx={{ padding: '80px 0', textAlign: 'center' }}>
      <Box>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          About <span style={{ color: 'var(--primary-green)'}}>AgriKlima</span>
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ marginTop: '20px', maxWidth: '700px', margin: 'auto' }}
        >
          AgriKlima is a localized farming support system designed to strengthen climate resilience, 
          improve agricultural decision-making, and increase productivity among farmers in District 3 of Pampanga.
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ marginTop: '30px', maxWidth: '700px', margin: '30px auto' }}
        >
          This page is currently under construction. Check back soon for more information about our vision, 
          mission, and the team dedicated to empowering local farmers through technology.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUsPage;