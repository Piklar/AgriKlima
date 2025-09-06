import React from 'react';
import { Container, Grid, Typography, Box, IconButton, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

// Import icons
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#000000ff', color: 'white', padding: '60px 5%', fontFamily: 'inherit' }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>

          {/* Column 1: Logo and Text */}
          <Grid item xs={12} md={4}>
            <img src={logo} alt="AgriKlima Logo" style={{ height: '45px', marginBottom: '15px' }} />
            <Typography sx={{ color: 'lightgray', fontFamily: 'inherit' }}>
              There are many variations of passages offered which are available, but the majority suffered.
            </Typography>
            <Box mt={2}>
              <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', mr: 1 }}><FacebookIcon /></IconButton>
              <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', mr: 1 }}><TwitterIcon /></IconButton>
              <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', mr: 1 }}><InstagramIcon /></IconButton>
              <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}><LinkedInIcon /></IconButton>
            </Box>
          </Grid>

          {/* Column 2: Placeholder for additional links if needed */}
          <Grid item xs={12} md={4}>
             {/* You can add more navigation links here if you want */}
          </Grid>

          {/* Column 3: Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontFamily: 'inherit', fontWeight: 'bold', mb: 2 }}>Contact</Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <PhoneIcon sx={{ mr: 1, color: 'var(--primary-green)' }} />
              <Typography sx={{ fontFamily: 'inherit' }}>0921245546</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <EmailIcon sx={{ mr: 1, color: 'var(--primary-green)' }} />
              <Typography sx={{ fontFamily: 'inherit' }}>AgriKlima@gmail.com</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <LocationOnIcon sx={{ mr: 1, color: 'var(--primary-green)' }} />
              <Typography sx={{ fontFamily: 'inherit' }}>Mexico, Pampanga</Typography>
            </Box>
          </Grid>

        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography sx={{ color: 'lightgray', fontFamily: 'inherit' }}>
            © All Copyright 2025
          </Typography>
          <Box>
            <Link to="/terms" style={{ color: 'lightgray', textDecoration: 'none', marginRight: '15px', fontFamily: 'inherit' }}>Terms of Use</Link>
            <Link to="/privacy" style={{ color: 'lightgray', textDecoration: 'none', fontFamily: 'inherit' }}>Privacy Policy</Link>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default Footer;
