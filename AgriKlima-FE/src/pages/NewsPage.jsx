// src/pages/NewsPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, CardMedia, Divider, Button } from '@mui/material';
import * as api from '../services/api';
import NewsSummaryOverlay from '../components/NewsSummaryOverlay';
import mainNewsImage from '../assets/images/news-main.jpg';

// --- Sidebar Card Component (MODIFIED) ---
const MoreNewsCard = ({ title, author, image, onClick }) => (
  // The outer Box is now a button-like element
  <Box 
    onClick={onClick}
    sx={{ 
      display: 'flex', 
      mb: 2, 
      p: 1, // Add some padding
      borderRadius: '8px', // Add rounded corners
      cursor: 'pointer', // Make it look clickable
      transition: 'background-color 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: '#f5f5f5' // Add a hover effect
      }
    }}
  >
    <CardMedia
      component="img"
      sx={{ width: 100, height: 80, marginRight: 2, borderRadius: '4px' }}
      image={image || "https://via.placeholder.com/100x80"}
      alt={title}
    />
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {/* Added a safe check for publicationDate */}
        {author ? `${author}` : "Author"} - {new Date().toLocaleDateString()}
      </Typography>
    </Box>
  </Box>
);

const fallbackMainArticle = {
  title: "Sec. Francisco Tiu Laurel Jr.: leading PH agriculture to a new, bold direction",
  content: `On November 3, 2023, Francisco P Tiu Laurel, Jr. took his oath as Secretary of the Department of Agriculture, officially accepting the role and its struggles.

Before entering public service, Sec. Tiu Laurel built a successful career in business for over 30 years. He led projects in many industries like fisheries, marine services, and cold storage—all while championing sustainable business practices that protect the environment while helping the economy grow.

His roadmap includes:
- Modern mechanization and farming tools
- More irrigation and better farm-to-market roads
- Stronger transport and storage systems

With his bold vision, the Department of Agriculture is preparing for a stronger future. One that is modern, competitive, and ready to face new challenges.`,
  publicationDate: "2023-09-20T20:00:00Z",
  author: "Department of Agriculture",
  imageUrl: mainNewsImage,
  _id: "static-main",
};
const fallbackMoreNews = [
  { title: 'Umarangkada ang Agrikultura!', author: "Author", imageUrl: "" },
  { title: 'Murang bigas, hinila pababa ang inflation!', author: "Author", imageUrl: "" },
  { title: 'FPA to celebrate 48th anniversary with focus on smarter regulations', author: "Author", imageUrl: "" },
  { title: 'BAI confirms first case of HPAI H5N1 in Camarines Sur', author: "Author", imageUrl: "" },
  { title: 'Bohol tilapia farmer maps success through BFAR-PBS-TBI program', author: "Author", imageUrl: "" },
];

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.getNews();
        setArticles(response.data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenSummary = (article) => {
    setSelectedArticle(article);
    setIsSummaryOpen(true);
  };
  const handleCloseSummary = () => {
      setIsSummaryOpen(false);
      // It's good practice to clear the selected article on close
      setSelectedArticle(null); 
  };

  const mainArticle = !loading && articles.length > 0 ? articles[0] : fallbackMainArticle;
  const moreNewsData = !loading && articles.length > 1 ? articles.slice(1, 6) : fallbackMoreNews;

  if (loading) {
    return (
      <Container sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h5">Loading News...</Typography>
      </Container>
    );
  }
    
  if (articles.length === 0 && !loading) {
     return (
        <Container sx={{ py: 5, textAlign: 'center' }}>
            <Typography variant="h5">No News Articles Found</Typography>
            <Typography color="text.secondary">Please check back later for the latest updates.</Typography>
        </Container>
     );
  }

  return (
    <>
      <Container sx={{ padding: { xs: '20px', md: '40px 0' } }}>
        <Grid container spacing={5}>
          {/* Main News Article Column */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              {mainArticle.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ margin: '10px 0 20px 0' }}>
              {mainArticle.publicationDate
                ? new Date(mainArticle.publicationDate).toLocaleDateString()
                : "Date"}{mainArticle.author ? ` • ${mainArticle.author}` : ""}
            </Typography>

            <Box sx={{ position: 'relative', mb: 4 }}>
              <img
                src={mainArticle.imageUrl || mainNewsImage}
                alt={mainArticle.title}
                style={{ width: '100%', borderRadius: '8px' }}
              />
              <Button
                variant="contained"
                onClick={() => handleOpenSummary(mainArticle)}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  backgroundColor: 'var(--primary-green)',
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': { backgroundColor: 'var(--light-green)' },
                }}
              >
                Get Summary
              </Button>
            </Box>

            <Typography
              variant="body1"
              sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}
              component="div"
            >
              {mainArticle.content}
            </Typography>
            {mainArticle.source && (
              <Typography variant="subtitle1" sx={{ marginTop: '40px', fontStyle: 'italic' }}>
                Source: {mainArticle.source}
              </Typography>
            )}
          </Grid>

          {/* More News Sidebar Column */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
              More News
            </Typography>
            <Divider sx={{ marginBottom: '20px' }}/>
            {/* --- THIS IS THE FIX --- */}
            {moreNewsData.map((item, index) => (
              <MoreNewsCard
                key={item._id || index}
                title={item.title}
                author={item.author}
                image={item.imageUrl}
                // Pass the handler function to make the card clickable
                onClick={() => handleOpenSummary(item)}
              />
            ))}
          </Grid>
        </Grid>
      </Container>

      {/* RENDER THE OVERLAY COMPONENT */}
      {/* Pass the selected article if it exists, otherwise pass the main article as a fallback */}
      <NewsSummaryOverlay
        open={isSummaryOpen}
        onClose={handleCloseSummary}
        articleData={selectedArticle || mainArticle}
      />
    </>
  );
};

export default NewsPage;