// src/pages/PestsPage.jsx

import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Grid, Card, CardContent, CardMedia,
  Button, Fab, Chip, Skeleton, useMediaQuery, ThemeProvider, Modal, Paper, IconButton
} from '@mui/material';
import {
  BugReport, Search, CheckCircleOutline, Healing,
  Article, Warning, ChevronRight, Close
} from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';
import * as api from '../services/api';
import pestsHero from '../assets/images/pests-hero.jpg';
import PestDetailOverlay from '../components/PestDetailOverlay';
import chatbotIcon from '../assets/images/chatbot-icon.png';

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    secondary: { main: '#ffa000', light: '#ffc107', dark: '#ff8f00' },
    background: { default: '#f8f9f8' },
  },
  typography: {
    fontFamily: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '3.5rem', lineHeight: 1.2 },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '3rem', lineHeight: 1.2 },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.8rem', lineHeight: 1.2 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.2rem' },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: '1.8rem' },
    h6: { fontWeight: 600, fontSize: '1.2rem' },
    body1: { fontSize: '1.1rem', lineHeight: 1.7 },
    body2: { fontSize: '1rem', lineHeight: 1.6 },
  },
  shape: { borderRadius: 12 },
});

const ArticleCard = ({ image, title, description, loading }) => {
  if (loading) {
    return (
      <Card sx={{ borderRadius: '5px', boxShadow: 2, height: '100%', overflow: 'hidden' }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent sx={{ pb: 1 }}>
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" width="60%" height={20} />
        </CardContent>
        <Box sx={{ p: 2, pt: 0 }}>
          <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '12px' }} />
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: '5px', boxShadow: 2, height: '100%', overflow: 'hidden' }}>
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{ transition: 'transform 0.5s', '&:hover': { transform: 'scale(1.05)' } }}
      />
      <CardContent sx={{ pb: 1 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600, lineHeight: 1.3, minHeight: '48px' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description.substring(0, 100)}...
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          endIcon={<ChevronRight />}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            py: 1,
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          Read More
        </Button>
      </Box>
    </Card>
  );
};

const InfoModal = ({ open, handleClose, content }) => (
  <Modal open={open} onClose={handleClose}>
    <Paper sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: 500,
      bgcolor: 'background.paper',
      borderRadius: '16px',
      boxShadow: 24,
      p: 3,
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {content.title}
        </Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>
      <Typography sx={{ mt: 2 }}>{content.description}</Typography>
    </Paper>
  </Modal>
);

const modalInfoContent = {
  detection: {
    title: 'Early Detection',
    description: 'Early detection involves regularly scouting your fields for signs of pests and diseases. Look for unusual spots on leaves, wilting, insect eggs, or larvae. Using traps and monitoring weather conditions can help predict outbreaks before they become severe, allowing for timely and targeted intervention.'
  },
  prevention: {
    title: 'Prevention Methods',
    description: 'Preventive measures are the first line of defense. This includes crop rotation to break pest cycles, planting pest-resistant varieties, maintaining healthy soil, and encouraging natural predators like ladybugs and birds. Proper sanitation, such as removing crop debris, can also reduce pest habitats.'
  },
  treatment: {
    title: 'Treatment Options',
    description: 'If pests are present, treatment may be necessary. Options range from biological controls, like introducing beneficial insects, to using organic pesticides such as neem oil. In severe cases, chemical pesticides may be used, but always follow the instructions carefully to protect yourself, the environment, and beneficial organisms.'
  }
};

const PestsPage = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [pests, setPests] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedPest, setSelectedPest] = useState(null);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [pestsResponse, newsResponse] = await Promise.all([
          api.getPests(),
          api.getNews()
        ]);
        setPests(pestsResponse.data || []);
        setNews(newsResponse.data || []);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
        setError("Failed to load pest information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenOverlay = (pest) => {
    setSelectedPest(pest);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedPest(null);
  };

  const handleOpenInfoModal = (topic) => {
    setModalContent(modalInfoContent[topic]);
    setIsInfoModalOpen(true);
  };

  const handleCloseInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  const articles = news.length > 0 ? news.slice(0, 3) : [];

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column' }}>
        <Warning sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
      `}
      </style>
      
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        {/* --- Hero Section --- */}
        <Box sx={{
          minHeight: '100vh',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${pestsHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '0 20px',
        }}>
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
            <BugReport sx={{ fontSize: 60, mb: 2, color: theme.palette.secondary.light }} />
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Learn about Pest Controls
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Protect your crops with effective pest management strategies and early detection techniques.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mt: 4 }}>
              <Button
                startIcon={<Search />}
                variant="contained"
                onClick={() => handleOpenInfoModal('detection')}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                  borderRadius: theme.shape.borderRadius,
                  py: 1.5,
                  px: 3,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                Early Detection
              </Button>
              <Button
                startIcon={<CheckCircleOutline />}
                variant="contained"
                onClick={() => handleOpenInfoModal('prevention')}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                  borderRadius: theme.shape.borderRadius,
                  py: 1.5,
                  px: 3,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                Prevention Methods
              </Button>
              <Button
                startIcon={<Healing />}
                variant="contained"
                onClick={() => handleOpenInfoModal('treatment')}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                  borderRadius: theme.shape.borderRadius,
                  py: 1.5,
                  px: 3,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                Treatment Options
              </Button>
            </Box>
          </Container>
        </Box>

        {/* --- Featured Pests Section (NOW DYNAMIC) --- */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Warning sx={{ color: 'primary.main', fontSize: 36, mr: 2 }} />
              <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Common Pests
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Identify and manage common agricultural pests with our comprehensive guide
            </Typography>
          </Box>

          {loading ? (
            <Grid container spacing={4}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ borderRadius: theme.shape.borderRadius, boxShadow: 2, overflow: 'hidden' }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={40} />
                      <Skeleton variant="text" height={25} />
                      <Skeleton variant="text" height={25} width="80%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : pests.length > 0 ? (
            <Grid container spacing={4}>
              {pests.map(pest => (
                <Grid item xs={12} sm={6} md={4} key={pest._id}>
                  <Card
                    onClick={() => handleOpenOverlay(pest)}
                    sx={{
                      borderRadius: '10px',
                      boxShadow: 2,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 4,
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={pest.imageUrl}
                        alt={pest.name}
                        sx={{ transition: 'transform 0.5s', '&:hover': { transform: 'scale(1.05)' } }}
                      />
                      <Chip
                        label="Pest Alert"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          background: theme.palette.error.main,
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600, color: 'primary.dark' }}>
                        {pest.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {pest.overview?.description ? pest.overview.description.substring(0, 100) + '...' : 'No description available.'}
                      </Typography>
                      <Button
                        variant="outlined"
                        fullWidth
                        endIcon={<ChevronRight />}
                        sx={{
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          borderRadius: theme.shape.borderRadius,
                          '&:hover': {
                            borderColor: 'primary.dark',
                            backgroundColor: 'rgba(104, 159, 56, 0.1)'
                          }
                        }}
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <BugReport sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No pest information available at the moment
              </Typography>
            </Box>
          )}
        </Container>

        {/* --- Articles Section (NOW DYNAMIC) --- */}
        <Box sx={{
          backgroundColor: 'rgba(46, 125, 50, 0.05)',
          py: 8,
        }}>
          <Container maxWidth="lg" sx={{ position: 'relative' }}>
            <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Article sx={{ color: 'primary.main', fontSize: 36, mr: 2 }} />
                <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Related Articles
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Stay informed with the latest pest management research and techniques
              </Typography>
            </Box>

            {loading ? (
              <Grid container spacing={4}>
                {[...Array(3)].map((_, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <ArticleCard loading={true} />
                  </Grid>
                ))}
              </Grid>
            ) : articles.length > 0 ? (
              <Grid container spacing={4}>
                {articles.map(article => (
                  <Grid item xs={12} md={4} key={article._id}>
                    <ArticleCard
                      image={article.imageUrl}
                      title={article.title}
                      description={article.content || ''}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Article sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
                <Typography variant="h6" color="text.secondary">
                  No articles available at the moment
                </Typography>
              </Box>
            )}
          </Container>
        </Box>

      {/* --- Pest Detail Overlay --- */}
      {selectedPest && (
        <PestDetailOverlay open={isOverlayOpen} onClose={handleCloseOverlay} pestData={selectedPest} />
      )}

      {/* --- RENDER THE NEW INFO MODAL --- */}
      <InfoModal
        open={isInfoModalOpen}
        handleClose={handleCloseInfoModal}
        content={modalContent}
      />
      </Box>
    </ThemeProvider>
  );
};

export default PestsPage;