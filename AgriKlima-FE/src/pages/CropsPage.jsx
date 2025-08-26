// src/pages/CropsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, CardMedia, Button, Fab } from '@mui/material';
import * as api from '../services/api';
import PageDataLoader from '../components/PageDataLoader';

// --- IMPORT THE OVERLAY ---
import CropDetailOverlay from '../components/CropDetailOverlay';
import chatbotIcon from '../assets/images/chatbot-icon.png';

// --- Reusable Component for Secondary Crop Cards ---
const SecondaryCropCard = ({ image, title, description }) => (
  <Card sx={{ display: 'flex', borderRadius: '20px', boxShadow: 3, mb: 3 }}>
    <CardMedia
      component="img"
      sx={{ width: 151, borderRadius: '20px 0 0 20px' }}
      image={image}
      alt={title}
    />
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <CardContent>
        <Typography component="div" variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Box>
  </Card>
);

// --- Reusable Component for Article Cards ---
const ArticleCard = ({ image, title, description }) => (
  <Card sx={{ borderRadius: '20px', boxShadow: 3, height: '100%' }}>
    <CardMedia component="img" height="200" image={image} alt={title} />
    <CardContent sx={{ pb: 1 }}>
      <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
    <Box sx={{ p: 2, pt: 0 }}>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: 'var(--primary-green)',
          borderRadius: '12px',
          textTransform: 'none',
          py: 1,
          '&:hover': { backgroundColor: 'var(--light-green)' }
        }}
      >
        Read More
      </Button>
    </Box>
  </Card>
);

const CropsPage = () => {
  // --- STATE FOR LIVE DATA & OVERLAY CONTROL ---
  const [crops, setCrops] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null); // This holds the data for the overlay

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
      setError("Failed to load crops.");
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
      <Box>
        {/* --- Section 1: Recommended Crops (NOW DYNAMIC) --- */}
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
            Recommended Crop this season!
          </Typography>
          <Grid container spacing={4}>
            {/* --- Featured Crop --- */}
            <Grid item xs={12} md={7}>
              {featuredCrop && (
                <Card
                  onClick={() => handleOpenOverlay(featuredCrop)}
                  sx={{
                    borderRadius: '20px',
                    boxShadow: 3,
                    p: 2,
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)' }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="350"
                    image={featuredCrop.imageUrl}
                    alt={featuredCrop.name}
                    sx={{ borderRadius: '16px' }}
                  />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 2 }}>
                      {featuredCrop.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {featuredCrop.description}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>
            {/* Secondary Crops List */}
            <Grid item xs={12} md={5}>
              {secondaryCrops.map(crop => (
                <Box key={crop._id} onClick={() => handleOpenOverlay(crop)} sx={{ cursor: 'pointer' }}>
                  <SecondaryCropCard
                    title={crop.name}
                    description={crop.description}
                    image={crop.imageUrl}
                  />
                </Box>
              ))}
            </Grid>
          </Grid>
        </Container>

        {/* --- Section 2: Learn About Crops (static) --- */}
        <Box sx={{ backgroundColor: '#f0f4e8', py: 6 }}>
          <Container maxWidth="lg">
            <Grid container spacing={5} alignItems="center">
              <Grid item xs={12} md={5}>
                <img
                  src="/assets/images/learn-about-crops.jpg"
                  alt="Learn about crops"
                  style={{ width: '100%', borderRadius: '20px' }}
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Learn about Crops
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Crops are the foundation of our global food system. They provide essential nutrients, energy, and raw materials for countless products we use daily. Understanding crops is crucial for addressing issues like food security, sustainable agriculture, and environmental conservation. Modern agriculture relies on technology to increase yields and efficiency.
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* --- Section 3: Articles (NOW DYNAMIC) --- */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>
            Articles
          </Typography>
          <Grid container spacing={4}>
            {articles.map(article => (
              <Grid item xs={12} md={4} key={article._id}>
                <ArticleCard
                  image={article.imageUrl}
                  title={article.title}
                  description={article.content ? article.content.substring(0, 150) + '...' : ''}
                />
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* --- Floating Chatbot Icon --- */}
        <Fab
          sx={{
            position: 'fixed',
            bottom: 40,
            right: 40,
            backgroundColor: 'white',
            '&:hover': { backgroundColor: '#f0f0f0' }
          }}
        >
          <img src={chatbotIcon} alt="Chatbot" style={{ width: '100%', height: '100%' }} />
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
