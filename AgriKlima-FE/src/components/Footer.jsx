import React from 'react';
import { Container, Grid, Typography, Box, IconButton, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

// Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#000000ff',
        color: 'white',
        padding: '60px 5%',
        fontFamily: `'Poppins', sans-serif`,
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Column 1: Logo & Tagline */}
          <Grid item xs={12} md={4}>
            <img
              src={logo}
              alt="AgriKlima Logo"
              style={{ height: '45px', marginBottom: '15px' }}
            />
            <Typography
              sx={{
                color: 'white',
                opacity: 0.8,
                fontSize: '0.95rem',
                lineHeight: 1.6,
              }}
            >
              Smart farming for a sustainable tomorrow.
            </Typography>
            <Box mt={2}>
              {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map(
                (Icon, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      mr: 1,
                      transition: '0.3s',
                      '&:hover': {
                        backgroundColor: 'var(--primary-green)',
                        color: '#fff',
                      },
                    }}
                  >
                    <Icon />
                  </IconButton>
                )
              )}
            </Box>
          </Grid>

          {/* Column 2: Placeholder (Optional Links) */}
          <Grid item xs={12} md={4}>
            {/* Future navigation or quick links can be added here */}
          </Grid>

          {/* Column 3: Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: '1.1rem',
              }}
            >
              Contact
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <PhoneIcon sx={{ mr: 1, color: 'var(--primary-green)' }} />
              <Typography sx={{ fontSize: '0.95rem' }}>0921245546</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <EmailIcon sx={{ mr: 1, color: 'var(--primary-green)' }} />
              <Typography sx={{ fontSize: '0.95rem' }}>AgriKlima@gmail.com</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <LocationOnIcon sx={{ mr: 1, color: 'var(--primary-green)' }} />
              <Typography sx={{ fontSize: '0.95rem' }}>Mexico, Pampanga</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.1)' }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: '0.85rem', opacity: 0.8 }}>
            © 2025 AgriKlima. All rights reserved.
          </Typography>
          <Box>
            <Link
              to="/terms"
              style={{
                color: 'white',
                textDecoration: 'none',
                marginRight: '15px',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: '0.3s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-green)')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'black')}
            >
              Terms of Use
            </Link>
            <Link
              to="/privacy"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: '0.3s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-green)')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'black')}
            >
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;