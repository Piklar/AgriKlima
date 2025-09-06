// src/pages/NewsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, CardMedia, Divider, Button, 
  Paper, Card, useMediaQuery, ThemeProvider
} from '@mui/material';
import { createTheme, styled } from '@mui/material/styles';
import * as api from '../services/api';
import NewsSummaryOverlay from '../components/NewsSummaryOverlay';
import mainNewsImage from '../assets/images/news-main.jpg';

// --- THEME (USING MyFarmPage FONTS) ---
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
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.2rem', lineHeight: 1.2 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: '1.8rem', lineHeight: 1.3 },
    h6: { fontWeight: 600, fontSize: '1.2rem', lineHeight: 1.3 },
    body1: { fontSize: '1.1rem', lineHeight: 1.7 },
    body2: { fontSize: '1rem', lineHeight: 1.6 },
  },
  shape: { borderRadius: '10px' },
});

// Import fonts
const Fonts = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
    `}
  </style>
);

// --- STYLED COMPONENTS ---
const AgricultureCard = styled(Card)(({ theme }) => ({
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
  },
}));

const GradientDivider = styled(Divider)(({ theme }) => ({
  height: '4px',
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  margin: '20px 0',
  borderRadius: '2px',
}));

// --- MORE NEWS CARD ---
const MoreNewsCard = ({ title, author, image, date, onClick }) => (
  <AgricultureCard 
    onClick={onClick}
    sx={{ 
      mb: 2, 
      backgroundColor: '#fffde7',
      border: '1px solid #f0f4c3',
      cursor: 'pointer'
    }}
  >
    <Box display="flex" p={1.5}>
      <CardMedia
        component="img"
        sx={{ 
          width: 100, 
          height: 80, 
          marginRight: 2, 
          borderRadius: '10px',
          objectFit: 'cover'
        }}
        image={image || "https://via.placeholder.com/100x80?text=Agriculture"}
        alt={title}
      />
      <Box sx={{ overflow: 'hidden' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600, 
            lineHeight: 1.4,
            color: theme.palette.text.primary,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {author || "Department of Agriculture"} • {date ? new Date(date).toLocaleDateString() : "Recent"}
        </Typography>
      </Box>
    </Box>
  </AgricultureCard>
);

// --- MAIN COMPONENT ---
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
    setSelectedArticle(null); 
  };

  const mainArticle = !loading && articles.length > 0 ? articles[0] : {
    title: "Sec. Francisco Tiu Laurel Jr.: leading PH agriculture to a new, bold direction",
    content: `On November 3, 2023, Francisco P Tiu Laurel, Jr. took his oath as Secretary of the Department of Agriculture, officially accepting the role and its struggles.`,
    publicationDate: "2024-09-20T20:00:00Z",
    author: "Department of Agriculture",
    imageUrl: mainNewsImage,
    _id: "static-main",
  };

  const moreNewsData = !loading && articles.length > 1 ? articles.slice(1, 6) : [
    {
      _id: "more-1",
      title: "Agriculture Summit Highlights Climate-Smart Techniques",
      author: "DA Newsroom",
      imageUrl: "",
      publicationDate: "2024-09-18T08:00:00Z",
    },
    {
      _id: "more-2",
      title: "Pampanga Farmers Embrace Modern Irrigation Methods",
      author: "DA Newsroom",
      imageUrl: "",
      publicationDate: "2024-09-15T09:00:00Z",
    },
  ];

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Fonts />
        <Container sx={{ padding: '40px 0', textAlign: 'center' }}>
          <Typography variant="h5" color="primary">
            Loading Agricultural News...
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Fonts />
      <Container maxWidth="lg" sx={{ py: 4, backgroundColor: 'background.default' }}>
        {/* HEADER */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
            Agriculture News
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Latest updates from the Department of Agriculture
          </Typography>
        </Box>

        {/* MAIN CONTENT */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
           {/* MAIN ARTICLE */}
              <Paper 
                elevation={0} 
                sx={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e0e0e0', backgroundColor: 'white' }}
              >
                <Box sx={{ p: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
                    {mainArticle.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {mainArticle.publicationDate
                      ? new Date(mainArticle.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : "Recent"}{mainArticle.author ? ` • By ${mainArticle.author}` : ""}
                  </Typography>
                  
                  {/* Updated height */}
                  <Box sx={{ position: 'relative', mb: 4, borderRadius: '10px', overflow: 'hidden', maxHeight: 350 }}>
                    <img
                      src={mainArticle.imageUrl || mainNewsImage}
                      alt={mainArticle.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleOpenSummary(mainArticle)}
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        backgroundColor: 'secondary.main',
                        color: 'rgba(0,0,0,0.87)',
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontSize: '1rem',
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        '&:hover': { 
                          backgroundColor: 'secondary.dark',
                          transform: 'translateY(-2px)'
                        },
                      }}
                    >
                      Get Summary
                    </Button>
                  </Box>

                  <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'text.primary', fontSize: '1.1rem' }}>
                    {mainArticle.content}
                  </Typography>
                </Box>
              </Paper>

            {/* MORE NEWS */}
            <Box sx={{ mt: 4 }}>
              <Paper sx={{ p: 3, borderRadius: theme.shape.borderRadius, backgroundColor: 'white', border: '1px solid #e0e0e0' }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    More Agriculture News
                  </Typography>
                </Box>
                <GradientDivider />
                {moreNewsData.map((item, index) => (
                  <MoreNewsCard
                    key={item._id || index}
                    title={item.title}
                    author={item.author}
                    image={item.imageUrl}
                    date={item.publicationDate}
                    onClick={() => handleOpenSummary(item)}
                  />
                ))}
                <Button 
                  fullWidth 
                  variant="outlined" 
                  sx={{ 
                    mt: 2, 
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    borderRadius: theme.shape.borderRadius,
                    '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(46,125,50,0.04)' }
                  }}
                >
                  View All News
                </Button>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* NEWS SUMMARY OVERLAY */}
        <NewsSummaryOverlay
          open={isSummaryOpen}
          onClose={handleCloseSummary}
          articleData={selectedArticle || mainArticle}
        />
      </Container>
    </ThemeProvider>
  );
};

export default NewsPage;
