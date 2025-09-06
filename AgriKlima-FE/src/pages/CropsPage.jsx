// src/pages/CropsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Typography, Grid, Card, CardContent, CardMedia,
  Button, Fab, Chip, Skeleton, useMediaQuery, ThemeProvider, Divider
} from '@mui/material';
import {
  EmojiNature, Article, CalendarMonth, TrendingUp,
  Lightbulb, ChevronRight
} from '@mui/icons-material';
import * as api from '../services/api';
import PageDataLoader from '../components/PageDataLoader';
import CropDetailOverlay from '../components/CropDetailOverlay';
import chatbotIcon from '../assets/images/chatbot-icon.png';
import { createTheme } from '@mui/material/styles';

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

const SecondaryCropCard = ({ image, title, description, onClick, loading }) => {
  if (loading) {
    return (
      <Card sx={{ display: 'flex', borderRadius: '5px', boxShadow: 2, mb: 3, overflow: 'hidden' }}>
        <Skeleton variant="rectangular" width={159} height={151} />
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
        borderRadius: '10px',
        boxShadow: 2,
        mb: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        width: '180%',
        maxWidth: 900,
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
        sx={{ width: 200, objectFit: 'cover' }}
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

const ArticleCard = ({ image, title, description, loading }) => {
  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: '10px',
          boxShadow: 2,
          width: '200%',
          maxWidth: 345,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Skeleton variant="rectangular" width="200%" height={200} />
        <CardContent sx={{ flex: 1, pb: 1 }}>
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" width="60%" height={20} />
        </CardContent>
        <Box sx={{ p: 2, pt: 0 }}>
          <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '8px' }} />
        </Box>
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
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: 200,
          flexShrink: 0,
          overflow: 'hidden'
        }}
      >
        <CardMedia
          component="img"
          src={image}
          alt={title}
          sx={{
            width: '100%',
            height: '200%',
            objectFit: 'cover'
          }}
        />
      </Box>
      <CardContent
        sx={{
          flex: 1,
          pb: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              minHeight: '48px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              minHeight: '40px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          endIcon={<ChevronRight />}
          sx={{
            background: 'green)',
            borderRadius: '12px',
            textTransform: 'none',
            py: 1,
            fontWeight: 600,
            boxShadow: '0 3px 5px 2px rgba(139, 195, 74, .2)',
            '&:hover': {
              boxShadow: '0 4px 8px 2px rgba(139, 195, 74, .3)'
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
    <ThemeProvider theme={theme}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
      `}
      </style>
      <PageDataLoader loading={loading} error={error} onRetry={fetchPageData}>
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
          <Container maxWidth={false} sx={{ py: 6, px: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, mt: -2 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center', width: '100%' }}>
                Recommended Crop this season!
              </Typography>
            </Box>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
              <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center' }}>
                {featuredCrop ? (
                  <Card
                    onClick={() => handleOpenOverlay(featuredCrop)}
                    sx={{
                      borderRadius: '10px',
                      boxShadow: 3,
                      overflow: 'hidden',
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: 'linear-gradient(to bottom right, #f1f8e9, #dcedc8)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 5,
                      },
                      maxWidth: 900
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="350"
                        image={featuredCrop.imageUrl}
                        alt={featuredCrop.name}
                        sx={{ objectFit: 'cover', width: '100%' }}
                      />
                      <Chip
                        icon={<TrendingUp />}
                        label="Top Recommendation"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          left: 26,
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
                          borderRadius: '10px',
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
                  <Card sx={{ borderRadius: theme.shape.borderRadius, p: 2, height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 600 }}>
                    <Skeleton variant="rectangular" height={350} sx={{ borderRadius: '16px', mb: 2 }} />
                    <Skeleton variant="text" height={60} width="80%" sx={{ alignSelf: 'center', mb: 2 }} />
                    <Skeleton variant="text" height={25} width="90%" sx={{ alignSelf: 'center', mb: 1 }} />
                    <Skeleton variant="text" height={25} width="70%" sx={{ alignSelf: 'center', mb: 3 }} />
                    <Skeleton variant="rectangular" height={40} width={140} sx={{ borderRadius: '20px', alignSelf: 'center' }} />
                  </Card>
                )}
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    width: '200%'
                  }}
                >
                  <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} />
                  Other Seasonal Crops
                </Typography>
                {loading ? (
                  [...Array(4)].map((_, index) => (
                    <SecondaryCropCard
                      key={index}
                      loading={true}
                      sx={{ width: '200%' }}
                    />
                  ))
                ) : (
                  secondaryCrops.map(crop => (
                    <SecondaryCropCard
                      key={crop._id}
                      title={crop.name}
                      description={crop.description}
                      image={crop.imageUrl}
                      onClick={() => handleOpenOverlay(crop)}
                      sx={{ width: '200%' }}
                    />
                  ))
                )}
              </Grid>
            </Grid>
          </Container>
          <Box sx={{ backgroundColor: 'rgba(46, 125, 50, 0.05)', py: 8 }}>
            <Container maxWidth="lg">
              <Grid container spacing={5} alignItems="center" direction={isMobile ? "column-reverse" : "row"}>
                <Grid item xs={12} md={7}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Lightbulb sx={{ color: 'primary.main', fontSize: 36, mr: 2 }} />
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      Learn about Crops
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 3 }}>
                    Crops are the foundation of our global food system. They provide essential nutrients, energy, and raw materials for countless products we use daily. Understanding crops is crucial for addressing issues like food security, sustainable agriculture, and environmental conservation. Modern agriculture relies on technology to increase yields and efficiency.
                  </Typography>
                  <Button
                    variant="contained"
                    endIcon={<ChevronRight />}
                    sx={{
                      borderRadius: theme.shape.borderRadius,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    Explore Resources
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Box>
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
          <CropDetailOverlay
            open={isOverlayOpen}
            onClose={handleCloseOverlay}
            cropData={selectedCrop}
          />
        </Box>
      </PageDataLoader>
    </ThemeProvider>
  );
};

export default CropsPage;