import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Grid, Card, CardContent, CardMedia,
  Button, Fab, Chip, Skeleton, useTheme, useMediaQuery
} from '@mui/material';
import {
  BugReport, Search, CheckCircleOutline, Healing,
  Article, Warning, ChevronRight
} from '@mui/icons-material';
import * as api from '../services/api';
import pestsHero from '../assets/images/pests-hero.jpg';
import PestDetailOverlay from '../components/PestDetailOverlay';
import chatbotIcon from '../assets/images/chatbot-icon.png';

// --- Reusable Article Card ---
const ArticleCard = ({ image, title, description, loading }) => {
  if (loading) {
    return (
      <Card sx={{ borderRadius: '20px', boxShadow: 2, height: '100%', overflow: 'hidden' }}>
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
    <Card sx={{ borderRadius: '20px', boxShadow: 2, height: '100%', overflow: 'hidden' }}>
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
            background: 'linear-gradient(45deg, #8BC34A 30%, #CDDC39 90%)',
            borderRadius: '12px',
            textTransform: 'none',
            py: 1,
            fontWeight: 600,
            boxShadow: '0 3px 5px 2px rgba(139, 195, 74, .2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #7CB342 30%, #C0CA33 90%)',
              boxShadow: '0 4px 8px 2px rgba(139, 195, 74, .3)',
            }
          }}
        >
          Read More
        </Button>
      </Box>
    </Card>
  );
};

const PestsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // --- STATE FOR LIVE DATA ---
  const [pests, setPests] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedPest, setSelectedPest] = useState(null);

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
    <Box sx={{ background: 'linear-gradient(to bottom, #f9fbe7 0%, #f1f8e9 100%)', minHeight: '100vh' }}>
      {/* --- Hero Section --- */}
      <Box sx={{
        height: isMobile ? '70vh' : '60vh',
        backgroundImage: `url(${pestsHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#222',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        px: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', // Increased opacity for stronger effect
          zIndex: 1,
        }
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <BugReport sx={{ fontSize: 60, mb: 2, color: '#CDDC39' }} />
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Learn about Pest Controls
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Protect your crops with effective pest management strategies and early detection techniques.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button
              startIcon={<Search />}
              variant="contained"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                borderRadius: '20px',
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
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                borderRadius: '20px',
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
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                borderRadius: '20px',
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Warning sx={{ color: 'primary.main', fontSize: 40, mr: 2 }} />
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Common Pests
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={4}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ borderRadius: '20px', boxShadow: 2, overflow: 'hidden' }}>
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
                    borderRadius: '20px',
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
                        background: 'rgba(255, 87, 34, 0.9)',
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
                      endIcon={<ChevronRight />}
                      sx={{
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        borderRadius: '20px',
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
        background: 'linear-gradient(to right, #8BC34A, #CDDC39)',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -50,
          left: -50,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Article sx={{ color: 'white', fontSize: 40, mr: 2 }} />
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'white' }}>
              Related Articles
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
            <Box sx={{ textAlign: 'center', py: 4, color: 'white' }}>
              <Article sx={{ fontSize: 48, mb: 2, opacity: 0.7 }} />
              <Typography variant="h6">
                No articles available at the moment
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* --- Floating Chatbot Icon --- */}
      <Fab
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: 'primary.main',
          color: 'white',
          width: 60,
          height: 60,
          '&:hover': {
            backgroundColor: 'primary.dark',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <img src={chatbotIcon} alt="Chatbot" style={{ width: '70%', height: '70%' }} />
      </Fab>

      {/* --- Pest Detail Overlay (dynamic) --- */}
      {selectedPest && (
        <PestDetailOverlay
          open={isOverlayOpen}
          onClose={handleCloseOverlay}
          pestData={selectedPest}
        />
      )}
    </Box>
  );
};

export default PestsPage;