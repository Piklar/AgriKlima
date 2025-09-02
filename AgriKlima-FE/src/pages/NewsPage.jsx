import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, CardMedia, Divider, Button, 
  Paper, Card, CardContent, useMediaQuery, ThemeProvider
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import * as api from '../services/api';
import NewsSummaryOverlay from '../components/NewsSummaryOverlay';
import mainNewsImage from '../assets/images/news-main.jpg';

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
  shape: { borderRadius: 5 },
});

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

const SectionHeader = styled(Typography)(({ theme }) => ({
  position: 'relative',
  paddingBottom: '12px',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '60px',
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '2px',
  },
}));

const MoreNewsCard = ({ title, author, image, date }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <AgricultureCard 
      sx={{ 
        mb: 2, 
        backgroundColor: '#fffde7',
        border: '1px solid #f0f4c3'
      }}
    >
      <Box display="flex" p={1.5}>
        <CardMedia
          component="img"
          sx={{ 
            width: 100, 
            height: 80, 
            marginRight: 2, 
            borderRadius: '8px',
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
};

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
  { 
    title: 'Umarangkada ang Agrikultura!', 
    author: "DA Communications", 
    imageUrl: "",
    publicationDate: "2023-10-15T20:00:00Z"
  },
  { 
    title: 'Murang bigas, hinila pababa ang inflation!', 
    author: "DA Economics Bureau", 
    imageUrl: "",
    publicationDate: "2023-10-10T20:00:00Z"
  },
  { 
    title: 'FPA to celebrate 48th anniversary with focus on smarter regulations', 
    author: "Fertilizer Authority", 
    imageUrl: "",
    publicationDate: "2023-10-05T20:00:00Z"
  },
  { 
    title: 'BAI confirms first case of HPAI H5N1 in Camarines Sur', 
    author: "Bureau of Animal Industry", 
    imageUrl: "",
    publicationDate: "2023-09-28T20:00:00Z"
  },
  { 
    title: 'Bohol tilapia farmer maps success through BFAR-PBS-TBI program', 
    author: "BFAR Regional Office", 
    imageUrl: "",
    publicationDate: "2023-09-25T20:00:00Z"
  },
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
  const handleCloseSummary = () => setIsSummaryOpen(false);

  const mainArticle =
    !loading && articles.length > 0
      ? articles[0]
      : fallbackMainArticle;
  const moreNewsData =
    !loading && articles.length > 1
      ? articles.slice(1, 6)
      : fallbackMoreNews;

  if (loading)
    return (
      <ThemeProvider theme={theme}>
        <style>
          {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        `}
        </style>
        <Container sx={{ padding: '40px 0', textAlign: 'center' }}>
          <Typography variant="h5" color="primary">
            Loading Agricultural News...
          </Typography>
        </Container>
      </ThemeProvider>
    );

  return (
    <ThemeProvider theme={theme}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
      `}
      </style>
      
      <Box sx={{ 
        backgroundColor: 'background.default',
        minHeight: '100vh',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center', 
            maxWidth: '800px', 
            mx: 'auto',
            mb: 6,
            padding: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(46, 125, 50, 0.05)'
          }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 1
              }}
            >
              Agriculture News
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Latest updates from the Department of Agriculture
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Main News Article Column */}
            <Grid item xs={12} lg={8}>
              <Paper 
                elevation={0} 
                sx={{ 
                  borderRadius: theme.shape.borderRadius, 
                  overflow: 'hidden', 
                  border: '1px solid #e0e0e0',
                  backgroundColor: 'white'
                }}
              >
                <Box sx={{ p: 4 }}>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'primary.dark',
                      mb: 2
                    }}
                  >
                    {mainArticle.title}
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    flexWrap: 'wrap'
                  }}>
                    <Box sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      mr: 2,
                      mb: 1
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        FEATURED
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      {mainArticle.publicationDate
                        ? new Date(mainArticle.publicationDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : "Recent"}{mainArticle.author ? ` • By ${mainArticle.author}` : ""}
                    </Typography>
                  </Box>

                  <Box sx={{ position: 'relative', mb: 4, borderRadius: 2, overflow: 'hidden' }}>
                    <img
                      src={mainArticle.imageUrl || mainNewsImage}
                      alt={mainArticle.title}
                      style={{ width: '100%', display: 'block' }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleOpenSummary(mainArticle)}
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        backgroundColor: 'secondary.main',
                        color: 'rgba(0, 0, 0, 0.87)',
                        borderRadius: theme.shape.borderRadius,
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
                      <Box sx={{ mr: 1, display: 'flex' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </Box>
                      Get Summary
                    </Button>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{ 
                      lineHeight: 1.8, 
                      whiteSpace: 'pre-wrap',
                      color: 'text.primary',
                      fontSize: '1.1rem'
                    }}
                    component="div"
                  >
                    {mainArticle.content}
                  </Typography>
                  
                  {mainArticle.source && (
                    <Box sx={{ 
                      mt: 4, 
                      p: 2, 
                      backgroundColor: '#f1f8e9',
                      borderRadius: 2,
                      borderLeft: '4px solid',
                      borderColor: 'secondary.main'
                    }}>
                      <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                        Source: {mainArticle.source}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* More News Sidebar Column */}
            <Grid item xs={12} lg={4}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
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
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'rgba(46, 125, 50, 0.04)'
                    }
                  }}
                >
                  View All News
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* --- RENDER THE OVERLAY COMPONENT --- */}
        <NewsSummaryOverlay
          open={isSummaryOpen}
          onClose={handleCloseSummary}
          articleData={selectedArticle || mainArticle}
        />
      </Box>
    </ThemeProvider>
  );
};

export default NewsPage;