// src/pages/PestsPage.jsx

import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Grid, Card, CardContent, CardMedia,
  Button, CardActionArea, Chip, Skeleton, useMediaQuery, ThemeProvider, Modal, Paper, IconButton
} from '@mui/material';
import {
  BugReport, Search, CheckCircleOutline, Healing,
  Article, Warning, ChevronRight, Close
} from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';
import * as api from '../services/api';
import pestsHero from '../assets/images/pests-hero.jpg';
import PestDetailOverlay from '../components/PestDetailOverlay';
import NewsSummaryOverlay from '../components/NewsSummaryOverlay';
import ViewAllOverlay from '../components/ViewAllOverlay'; 

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
  shape: { borderRadius: '10px' },
});

// --- MODIFIED ARTICLE CARD (Updated to match Crops page style) ---
const ArticleCard = ({ article, onClick, loading }) => {
  if (loading) {
    return (
      <Card sx={{ 
        borderRadius: '10px', 
        boxShadow: 2, 
        width: '100%', 
        maxWidth: 345, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <CardContent sx={{ flex: 1 }}>
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={20} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: '10px', 
        boxShadow: 2, 
        width: '100%', 
        maxWidth: 345, 
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-5px)', 
          boxShadow: 4 
        }
      }}
    >
      <CardActionArea 
        onClick={() => onClick(article)} 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%' 
        }}
      >
        <CardMedia 
          component="img" 
          height="200" 
          image={article.imageUrl} 
          alt={article.title} 
        />
        <CardContent sx={{ 
          flex: 1, 
          pb: 1, 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600, 
              lineHeight: 1.3, 
              flexGrow: 1 
            }}
          >
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {article.content.substring(0, 100)}...
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const InfoModal = ({ open, handleClose, content }) => (
  <Modal open={open} onClose={handleClose}>
    <Paper sx={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: '90%', maxWidth: 500, bgcolor: 'background.paper', borderRadius: theme.shape.borderRadius,
      boxShadow: 24, p: 3,
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {content.title}
        </Typography>
        <IconButton onClick={handleClose}><Close /></IconButton>
      </Box>
      <Typography sx={{ mt: 2 }}>{content.description}</Typography>
    </Paper>
  </Modal>
);

const modalInfoContent = {
  detection: { title: 'Early Detection', description: 'Early detection involves regularly scouting your fields...' },
  prevention: { title: 'Prevention Methods', description: 'Preventive measures are the first line of defense...' },
  treatment: { title: 'Treatment Options', description: 'If pests are present, treatment may be necessary...' }
};

const PestsPage = () => {
  const [pests, setPests] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for Pest Details Overlay
  const [isPestOverlayOpen, setIsPestOverlayOpen] = useState(false);
  const [selectedPest, setSelectedPest] = useState(null);

  // State for News Overlay
  const [isNewsOverlayOpen, setIsNewsOverlayOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // State for View All overlay (pests)
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [pestsResponse, newsResponse] = await Promise.all([api.getPests(), api.getNews()]);
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

  const handleOpenPestOverlay = (pest) => {
    setSelectedPest(pest);
    setIsPestOverlayOpen(true);
  };
  const handleClosePestOverlay = () => {
    setIsPestOverlayOpen(false);
    setSelectedPest(null);
  };

  // Handlers for News Overlay
  const handleOpenNewsOverlay = (article) => {
    setSelectedArticle(article);
    setIsNewsOverlayOpen(true);
  };
  const handleCloseNewsOverlay = () => {
    setIsNewsOverlayOpen(false);
    setSelectedArticle(null);
  };

  const handleOpenInfoModal = (topic) => {
    setModalContent(modalInfoContent[topic]);
    setIsInfoModalOpen(true);
  };
  const handleCloseInfoModal = () => setIsInfoModalOpen(false);

  // Calculate displayed pests and remaining pests for "View All"
  const displayedPests = pests.slice(0, 6); // Show first 6 pests
  const remainingPests = pests.length > 6 ? pests.slice(6) : []; // Pests beyond the first 6
  const articles = news.length > 0 ? news.slice(0, 3) : [];

  if (error) { 
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '50vh',
          textAlign: 'center',
          p: 3
        }}>
          <Warning sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>
            Error Loading Content
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ borderRadius: theme.shape.borderRadius }}
          >
            Try Again
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');`}</style>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
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

        {/* Common Pests Section */}
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
            <Grid container spacing={4} justifyContent="center">
              {[...Array(6)].map((_, index) => ( 
                <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card sx={{ borderRadius: theme.shape.borderRadius, boxShadow: 2, overflow: 'hidden', width: '100%', maxWidth: '350px' }}>
                    <Skeleton variant="rectangular" height={250} />
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
            <>
              <Grid container spacing={4} justifyContent="center">
                {displayedPests.map(pest => ( 
                  <Grid item xs={12} sm={6} md={4} key={pest._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card 
                      onClick={() => handleOpenPestOverlay(pest)} 
                      sx={{ 
                        borderRadius: theme.shape.borderRadius, 
                        boxShadow: 2, 
                        cursor: 'pointer', 
                        overflow: 'hidden', 
                        transition: 'all 0.3s ease', 
                        width: '100%', 
                        maxWidth: '350px', 
                        '&:hover': { 
                          transform: 'translateY(-5px)', 
                          boxShadow: '0 8px 20px rgba(0,0,0,0.12)', 
                        } 
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia 
                          component="img" 
                          height="250" 
                          image={pest.imageUrl} 
                          alt={pest.name} 
                          sx={{ 
                            transition: 'transform 0.5s', 
                            '&:hover': { transform: 'scale(1.05)' }, 
                            width: '100%', 
                            objectFit: 'cover' 
                          }} 
                        />
                        <Chip 
                          label="Pest Alert" 
                          sx={{ 
                            position: 'absolute', 
                            top: 16, 
                            right: 16, 
                            background: theme.palette.error.main, 
                            color: 'white', 
                            fontWeight: 600, 
                            borderRadius: theme.shape.borderRadius 
                          }} 
                        />
                      </Box>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600, color: 'primary.dark', mb: 2 }}>
                          {pest.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: '60px' }}>
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
                              backgroundColor: 'rgba(46, 125, 50, 0.1)' 
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
              
              {/* View All Button for pests (shows when 7 or more pests exist) */}
              {pests.length >= 7 && (
                <Box sx={{ textAlign: 'center', mt: 6 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => setIsViewAllOpen(true)}
                    endIcon={<ChevronRight />}
                    sx={{ 
                      borderColor: 'primary.main', 
                      color: 'primary.main',
                      borderRadius: theme.shape.borderRadius,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: 'primary.dark', 
                        backgroundColor: 'rgba(46, 125, 50, 0.1)'
                      }
                    }}
                  >
                    View All Pests ({pests.length})
                  </Button>
                </Box>
              )}
            </>
          ) : ( 
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <BugReport sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No pest information available at the moment
              </Typography>
            </Box>
          )}
        </Container>

        {/* --- UPDATED NEWS SECTION (3-horizontal layout like Crops page) --- */}
        <Box sx={{ backgroundColor: 'rgba(46, 125, 50, 0.05)', py: 8 }}>
          <Container maxWidth="lg">
            {/* Header aligned to left like Crops page */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Article sx={{ color: 'primary.main', fontSize: 36, mr: 2 }} />
              <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Latest Articles
              </Typography>
            </Box>
            
            {/* 3-horizontal grid layout */}
            <Grid container spacing={4}>
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <ArticleCard loading={true} />
                  </Grid>
                ))
              ) : (
                articles.map(article => (
                  <Grid item xs={12} md={4} key={article._id}>
                    <ArticleCard
                      article={article}
                      onClick={handleOpenNewsOverlay}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          </Container>
        </Box>
        
        {/* Overlays */}
        <PestDetailOverlay open={isPestOverlayOpen} onClose={handleClosePestOverlay} pestData={selectedPest} />
        <NewsSummaryOverlay open={isNewsOverlayOpen} onClose={handleCloseNewsOverlay} articleData={selectedArticle} />
        <InfoModal open={isInfoModalOpen} handleClose={handleCloseInfoModal} content={modalContent} />
        
        {/* View All Overlay for Pests */}
        <ViewAllOverlay
          open={isViewAllOpen}
          onClose={() => setIsViewAllOpen(false)}
          title="All Available Pests"
          items={pests}
          onItemClick={(item) => {
            setIsViewAllOpen(false);
            setTimeout(() => handleOpenPestOverlay(item), 300);
          }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default PestsPage;