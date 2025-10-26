// src/components/Footer.jsx
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  IconButton,
  Divider,
  useMediaQuery,
  Link as MuiLink, // Use MuiLink for navigation links
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Use RouterLink for internal navigation
import logo from '../assets/logo.png';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Terms from '../components/Terms'; // import your Terms modal

const Footer = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isTermsOpen, setIsTermsOpen] = useState(false); // modal state

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Weather', path: '/weather' },
    { name: 'Crops', path: '/crops' },
    { name: 'Pests', path: '/pests' },
    { name: 'News', path: '/news' },
  ];

  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a3c1a 0%, #2e7d32 100%)',
          color: '#fff',
          borderTopLeftRadius: '30px',
          borderTopRightRadius: '30px',
          mt: 5,
          pt: 6,
          pb: 3,
          boxShadow: '0 -5px 20px rgba(0,0,0,0.2)',
          fontFamily: `'Poppins', sans-serif`,
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={5}
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {/* Column 1: Logo & Tagline */}
            <Grid item xs={12} md={4}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems={isMobile ? 'center' : 'flex-start'}
              >
                <img
                  src={logo}
                  alt="AgriKlima Logo"
                  style={{ height: '55px', marginBottom: '15px', borderRadius: '8px' }}
                />
                <Typography
                  sx={{
                    opacity: 0.9,
                    fontSize: '0.95rem',
                    textAlign: isMobile ? 'center' : 'left',
                    lineHeight: 1.6,
                    mb: 2,
                  }}
                >
                  Cultivating innovation for a greener and smarter future.
                </Typography>

                <Box>
                  {[
                    { Icon: FacebookIcon, link: 'https://facebook.com' },
                    { Icon: TwitterIcon, link: 'https://twitter.com' },
                    { Icon: InstagramIcon, link: 'https://instagram.com' },
                    { Icon: LinkedInIcon, link: 'https://linkedin.com' },
                  ].map(({ Icon, link }, i) => (
                    <IconButton
                      key={i}
                      component="a"
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: '#fff',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        mr: 1,
                        transition: '0.3s',
                        '&:hover': {
                          backgroundColor: '#a5d6a7',
                          color: '#1a3c1a',
                        },
                      }}
                    >
                      <Icon />
                    </IconButton>
                  ))}
                </Box>
              </Box>
            </Grid>
            
            {/* Column 2: Quick Links */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  mb: 2,
                  textAlign: isMobile ? 'center' : 'left',
                }}
              >
                Quick Links
              </Typography>
              <Box display="flex" flexDirection="column" alignItems={isMobile ? 'center' : 'flex-start'} gap={1}>
                {quickLinks.map(link => (
                  <MuiLink
                    key={link.name}
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      textDecoration: 'none',
                      transition: '0.3s',
                      '&:hover': { color: '#a5d6a7', textDecoration: 'underline' },
                    }}
                  >
                    {link.name}
                  </MuiLink>
                ))}
              </Box>
            </Grid>

            {/* Column 3: Contact Info */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  mb: 2,
                  textAlign: isMobile ? 'center' : 'left',
                }}
              >
                Get in Touch
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                mb={1.5}
                justifyContent={isMobile ? 'center' : 'flex-start'}
              >
                <PhoneIcon sx={{ mr: 1.5, color: '#a5d6a7' }} />
                <Typography sx={{ fontSize: '0.95rem' }}>0915 815 8735</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                mb={1.5}
                justifyContent={isMobile ? 'center' : 'flex-start'}
              >
                <EmailIcon sx={{ mr: 1.5, color: '#a5d6a7' }} />
                <Typography sx={{ fontSize: '0.95rem' }}>AgriKlima@gmail.com</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent={isMobile ? 'center' : 'flex-start'}
              >
                <LocationOnIcon sx={{ mr: 1.5, color: '#a5d6a7' }} />
                <Typography sx={{ fontSize: '0.95rem' }}>Mexico, Pampanga</Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

          {/* Bottom Bar */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 2,
            }}
          >
            <Typography sx={{ fontSize: '0.85rem', opacity: 0.85, order: isMobile ? 2 : 1 }}>
              © 2025 AgriKlima. All rights reserved.
            </Typography>
            <Box sx={{ order: isMobile ? 1 : 2 }}>
              <Typography
                component="button"
                onClick={() => setIsTermsOpen(true)}
                sx={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.9)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: '0.3s',
                  cursor: 'pointer',
                  '&:hover': { color: '#a5d6a7' },
                }}
              >
                Terms of Use & Privacy Policy
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Terms Modal */}
      <Terms open={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
};

export default Footer;