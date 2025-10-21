// src/pages/AboutUsPage.jsx
import React from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Import images
import heroBg from '../assets/images/about-image-1.jpg';
import videoBg from '../assets/images/about-image-2.jpg';
import visionImg from '../assets/images/mission-vision.jpg';

// Icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PestControlIcon from '@mui/icons-material/PestControl';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ChecklistIcon from '@mui/icons-material/Checklist';

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    secondary: { main: '#ffa000', light: '#ffc107', dark: '#ff8f00' },
    background: { default: '#f8f9f8' },
  },
  typography: {
    fontFamily: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
});

const AboutUsPage = () => {
  const heroStyles = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroBg})`,
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    px: 2,
  };

  const videoBannerStyles = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${videoBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    py: { xs: 8, md: 12 },
    px: 2,
    color: 'white',
    textAlign: 'center',
  };

  const leftFeatures = [
    {
      title: 'Weather Forecast',
      description: 'Accurate weather predictions tailored to your location and farming needs.',
      icon: <WbSunnyIcon sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Recommended Crops',
      description: 'Personalized crop suggestions based on soil type and climate conditions.',
      icon: <LocalFloristIcon sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Pest Detection and Information',
      description: 'Early identification of potential pest problems with AI recognition.',
      icon: <PestControlIcon sx={{ fontSize: 32 }} />,
    },
  ];

  const rightFeatures = [
    {
      title: 'Farming Calendar',
      description: 'Plan and organize farming activities efficiently with a personalized seasonal calendar to guide your schedule.',
      icon: <CalendarTodayIcon sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Task Manager',
      description: 'Manage and monitor your farming activities efficiently from planting to harvest to keep crops healthy and productive.',
      icon: <ChecklistIcon sx={{ fontSize: 32 }} />,
    },
    {
      title: 'AI Farming Assistant',
      description: 'Get AI-powered recommendations for improving farming practices.',
      icon: <AgricultureIcon sx={{ fontSize: 32 }} />,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      {/* Hero Section */}
      <Box sx={heroStyles}>
        <Typography
          variant="h1"
          sx={{
            maxWidth: '900px',
            mb: 4,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            fontStyle: 'italic',
            fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
            lineHeight: 1.3,
            px: { xs: 2, sm: 4 },
          }}
        >
          "Without agriculture, there is no life, no growth, and no future."
        </Typography>

        <Box mt={4} display="flex" gap={2} flexWrap="wrap" justifyContent="center">
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: 'white',
              borderColor: 'white',
              borderWidth: 2,
              px: { xs: 4, sm: 5 },
              py: 1.4,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              '&:hover': {
                borderWidth: 2,
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
            onClick={() =>
              document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' })
            }
          >
            Learn More
          </Button>
        </Box>
      </Box>

      {/* About Section */}
      <Container id="about-section" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
          <Typography variant="h3" sx={{ mb: 3, fontSize: { xs: '2rem', md: '2.8rem' } }}>
            About <span style={{ color: theme.palette.primary.main }}>AgriKlima</span>
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, px: { xs: 2, md: 0 } }}>
            AgriKlima is a climate-smart agriculture platform designed to empower farmers with accurate weather forecasts, crop recommendations, and real-time insights to adapt to changing climate conditions.
          </Typography>
        </Box>
      </Container>

      {/* Vision/Mission Section */}
      <Box sx={{ backgroundColor: 'rgba(46, 125, 50, 0.05)', py: { xs: 6, md: 10 } }}>
        <Container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 4, md: 6 },
            }}
          >
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <img
                src={visionImg}
                alt="Mission and Vision"
                style={{
                  width: '100%',
                  maxWidth: 500,
                  borderRadius: 10,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }}
              />
            </Box>

            <Box sx={{ flex: 1, px: { xs: 2, md: 0 } }}>
              <Typography variant="h3" sx={{ mb: 3, fontSize: { xs: '2rem', md: '2.6rem' } }}>
                Our Vision & <span style={{ color: theme.palette.primary.main }}>Mission</span>
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                Our vision is to create a sustainable farming community supported by modern technology.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Our mission is to help farmers adapt, thrive, and innovate in the face of climate change through accessible technology.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Video Banner */}
      <Box sx={videoBannerStyles}>
        <Typography
          variant="h2"
          sx={{
            maxWidth: '900px',
            mx: 'auto',
            mb: 4,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            fontSize: { xs: '2rem', md: '3rem' },
            px: { xs: 2, md: 0 },
          }}
        >
          Agriculture Matters to the Future of Development
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrowIcon />}
          href="https://drive.google.com/file/d/1QW1toEbLmd4J7i8XmmcSPLdUDh-oxMR3/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            px: { xs: 4, sm: 6 },
            py: 1.4,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            backgroundColor: theme.palette.secondary.main,
            '&:hover': { backgroundColor: theme.palette.secondary.dark },
          }}
        >
          Watch Our Video
        </Button>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            mb: 5,
            fontSize: { xs: '2rem', md: '2.8rem' },
            fontWeight: 700,
          }}
        >
          Our <span style={{ color: theme.palette.primary.main }}>Features</span>
        </Typography>

        <Box
          sx={{
            display: { xs: 'block', md: 'flex' },
            gap: { xs: 0, md: 4 },
            alignItems: 'stretch',
            justifyContent: 'center',
          }}
        >
          {/* Left Features */}
          <Box sx={{ flex: 1 }}>
            {leftFeatures.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  mb: 3,
                  textAlign: 'left',
                  mx: { xs: 1, sm: 0 },
                  minHeight: 160,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRadius: 3,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  },
                }}
                elevation={0}
              >
                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }}>
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Divider for Desktop */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: 'none', md: 'block' },
              mx: 2,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.1)',
            }}
          />

          {/* Right Features */}
          <Box sx={{ flex: 1 }}>
            {rightFeatures.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  mb: 3,
                  textAlign: 'left',
                  mx: { xs: 1, sm: 0 },
                  minHeight: 160,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRadius: 3,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  },
                }}
                elevation={0}
              >
                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }}>
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AboutUsPage;
