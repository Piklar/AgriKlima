// src/components/LatestNewsSection.jsx

import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardActionArea, CardMedia, CardContent, Box, Skeleton } from '@mui/material';
import { Article } from '@mui/icons-material';
import * as api from '../services/api';
import NewsSummaryOverlay from './NewsSummaryOverlay'; // We'll open this overlay

const NewsArticleCard = ({ article, onArticleClick, loading }) => {
  if (loading) {
    return (
      <Card sx={{ borderRadius: '16px', boxShadow: 2 }}>
        <Skeleton variant="rectangular" height={180} />
        <CardContent>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={25} width="80%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        borderRadius: '16px', 
        boxShadow: 2, 
        height: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4,
        }
      }}
    >
      <CardActionArea onClick={() => onArticleClick(article)}>
        <CardMedia
          component="img"
          height="180"
          image={article.imageUrl || 'https://via.placeholder.com/300x180?text=News'}
          alt={article.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600, lineHeight: 1.3, height: 50, overflow: 'hidden' }}>
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            By {article.author || 'AgriKlima News'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const LatestNewsSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    const fetchLatestNews = async () => {
      setLoading(true);
      try {
        const response = await api.getNews();
        // Get the top 3 latest articles
        setArticles((response.data || []).slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch latest news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestNews();
  }, []);

  const handleOpenOverlay = (article) => {
    setSelectedArticle(article);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedArticle(null);
  };

  return (
    <>
      <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Article sx={{ color: 'primary.main', fontSize: 40, mr: 2 }} />
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold' }}>
              Latest Articles
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {loading ? (
              [...Array(3)].map((_, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <NewsArticleCard loading={true} />
                </Grid>
              ))
            ) : (
              articles.map(article => (
                <Grid item xs={12} md={4} key={article._id}>
                  <NewsArticleCard article={article} onArticleClick={handleOpenOverlay} />
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      {/* Render the overlay */}
      {selectedArticle && (
        <NewsSummaryOverlay
          open={isOverlayOpen}
          onClose={handleCloseOverlay}
          articleData={selectedArticle}
        />
      )}
    </>
  );
};

export default LatestNewsSection;