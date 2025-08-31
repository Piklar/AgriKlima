// src/pages/CropsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Typography, Grid, Card, CardContent, CardMedia,
  Button, Fab, Chip, Skeleton, useTheme, useMediaQuery
} from '@mui/material';
import {
  EmojiNature, Article, CalendarMonth, TrendingUp,
  Lightbulb, ChevronRight
} from '@mui/icons-material';
import * as api from '../services/api';
import PageDataLoader from '../components/PageDataLoader';
import CropDetailOverlay from '../components/CropDetailOverlay';
import chatbotIcon from '../assets/images/chatbot-icon.png';

// --- Reusable Component for Secondary Crop Cards ---
const SecondaryCropCard = ({ image, title, description, onClick, loading }) => {
  if (loading) {
    return (
      <Card sx={{ display: 'flex', borderRadius: '20px', boxShadow: 2, mb: 3, overflow: 'hidden' }}>
        <Skeleton variant="rectangular" width={151} height={151} />
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2 }}>
          <Skeleton variant="text" width="60%" height={30} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
        </Box>
      </Card>
    );
  }

  return (
    <Card 
      onClick={onClick}
      sx={{ 
        display: 'flex', 
        borderRadius: '20px', 
        boxShadow: 2, 
        mb: 3, 
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          borderLeft: '4px solid',
          borderColor: 'primary.main'
        }
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 151, objectFit: 'cover' }}
        image={image}
        alt={title}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2 }}>
        <Typography component="div" variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description.substring(0, 80)}...
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
            Learn more
          </Typography>
          <ChevronRight sx={{ fontSize: 18, color: 'primary.main' }} />
        </Box>
      </Box>
    </Card>
  );
};

// --- Reusable Component for Article Cards ---
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

const CropsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // --- STATE FOR LIVE DATA & OVERLAY CONTROL ---
  const [crops, setCrops] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const fetchPageData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cropsResponse, newsResponse] = await Promise.all([
        api.getCrops(),
        api.getNews()
      ]);
      setCrops(cropsResponse.data || []);
      setNews(newsResponse.data || []);
    } catch (err) {
      console.error("Failed to fetch page data:", err);
      setError("Failed to load crops. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  // --- HANDLER FUNCTIONS FOR THE OVERLAY ---
  const handleOpenOverlay = (crop) => {
    setSelectedCrop(crop);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedCrop(null);
  };

  const featuredCrop = crops.length > 0 ? crops[0] : null;
  const secondaryCrops = crops.length > 1 ? crops.slice(1, 5) : [];
  const articles = news.length > 0 ? news.slice(0, 3) : [];

  return (
    <PageDataLoader loading={loading} error={error} onRetry={fetchPageData}>
      <Box sx={{ background: 'linear-gradient(to bottom, #ffffffff 0%, #ffffffff 100%)', minHeight: '100vh' }}>
        {/* --- Section 1: Recommended Crops (NOW DYNAMIC) --- */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <EmojiNature sx={{ color: 'primary.main', fontSize: 40, mr: 2 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Recommended Crop this season!
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {/* --- Featured Crop --- */}
            <Grid item xs={12} md={7}>
              {featuredCrop ? (
                <Card
                  onClick={() => handleOpenOverlay(featuredCrop)}
                  sx={{
                    borderRadius: '20px',
                    boxShadow: 3,
                    overflow: 'hidden',
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(to bottom right, #f1f8e9, #dcedc8)',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: 5,
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="350"
                      image={featuredCrop.imageUrl}
                      alt={featuredCrop.name}
                    />
                    <Chip 
                      icon={<TrendingUp />} 
                      label="Top Recommendation" 
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        left: 16, 
                        background: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 2, color: 'primary.dark' }}>
                      {featuredCrop.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {featuredCrop.description.substring(0, 120)}...
                    </Typography>
                    <Button
                      variant="outlined"
                      endIcon={<ChevronRight />}
                      sx={{
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        borderRadius: '20px',
                        px: 3,
                        '&:hover': {
                          borderColor: 'primary.dark',
                          backgroundColor: 'rgba(104, 159, 56, 0.1)'
                        }
                      }}
                    >
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card sx={{ borderRadius: '20px', p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="rectangular" height={350} sx={{ borderRadius: '16px', mb: 2 }} />
                  <Skeleton variant="text" height={60} width="80%" sx={{ alignSelf: 'center', mb: 2 }} />
                  <Skeleton variant="text" height={25} width="90%" sx={{ alignSelf: 'center', mb: 1 }} />
                  <Skeleton variant="text" height={25} width="70%" sx={{ alignSelf: 'center', mb: 3 }} />
                  <Skeleton variant="rectangular" height={40} width={140} sx={{ borderRadius: '20px', alignSelf: 'center' }} />
                </Card>
              )}
            </Grid>
            
            {/* Secondary Crops List */}
            <Grid item xs={12} md={5}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} /> 
                Other Seasonal Crops
              </Typography>
              
              {loading ? (
                [...Array(4)].map((_, index) => (
                  <SecondaryCropCard key={index} loading={true} />
                ))
              ) : (
                secondaryCrops.map(crop => (
                  <SecondaryCropCard
                    key={crop._id}
                    title={crop.name}
                    description={crop.description}
                    image={crop.imageUrl}
                    onClick={() => handleOpenOverlay(crop)}
                  />
                ))
              )}
            </Grid>
          </Grid>
        </Container>

        {/* --- Section 2: Learn About Crops --- */}
        <Box sx={{ 
          background: 'linear-gradient(to right, #7ed957a2, #ffcc0074)', 
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
            <Grid container spacing={5} alignItems="center" direction={isMobile ? "column-reverse" : "row"}>
              <Grid item xs={12} md={5}>
                
              </Grid>
              <Grid item xs={12} md={7}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Lightbulb sx={{ color: 'white', fontSize: 36, mr: 2 }} />
                  <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'black' }}>
                    Learn about Crops
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.9)', lineHeight: 1.7, mb: 3 }}>
                  Crops are the foundation of our global food system. They provide essential nutrients, energy, and raw materials for countless products we use daily. Understanding crops is crucial for addressing issues like food security, sustainable agriculture, and environmental conservation. Modern agriculture relies on technology to increase yields and efficiency.
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ChevronRight />}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    borderRadius: '20px',
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      boxShadow: 3
                    }
                  }}
                >
                  Explore Resources
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* --- Section 3: Articles (NOW DYNAMIC) --- */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Article sx={{ color: 'primary.main', fontSize: 36, mr: 2 }} />
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Latest Articles
            </Typography>
          </Box>
          
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
                    image={article.imageUrl}
                    title={article.title}
                    description={article.content || ''}
                  />
                </Grid>
              ))
            )}
          </Grid>
          
          {!loading && articles.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No articles available at the moment
              </Typography>
            </Box>
          )}
        </Container>

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

        {/* --- Crop Detail Overlay --- */}
        <CropDetailOverlay
          open={isOverlayOpen}
          onClose={handleCloseOverlay}
          cropData={selectedCrop}
        />
      </Box>
    </PageDataLoader>
  );
};

export default CropsPage;