import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import * as api from '../services/api';
import PestDetailOverlay from '../components/PestDetailOverlay';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HealingIcon from '@mui/icons-material/Healing';

// --- Reusable Article Card ---
const ArticleCard = ({ image, title, description }) => (
  <Card sx={{ borderRadius: '20px', boxShadow: 3, height: '100%' }}>
    <CardMedia component="img" height="200" image={image} alt={title} />
    <CardContent sx={{ pb: 1 }}>
      <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{description}</Typography>
    </CardContent>
    <Box sx={{ p: 2, pt: 0 }}>
      <Button variant="contained" fullWidth sx={{ backgroundColor: 'var(--primary-green)', borderRadius: '12px', '&:hover': { backgroundColor: 'var(--light-green)' }}}>Read More</Button>
    </Box>
  </Card>
);

const PestsPage = () => {
  // --- STATE FOR LIVE DATA ---
  const [pests, setPests] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedPest, setSelectedPest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pestsResponse, newsResponse] = await Promise.all([
          api.getPests(),
          api.getNews()
        ]);
        setPests(pestsResponse.data);
        setNews(newsResponse.data);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
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

  if (loading) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Loading Pest Information...</Typography>;

  return (
    <Box>
      {/* --- Hero Section (static) --- */}
      <Box sx={{
        height: '50vh',
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/assets/images/pest-hero-background.jpg)`,
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>Learn about Pest Controls</Typography>
        <Typography>Ut dapibus ingula ex mentione ad eam familia. Ubi separati existentia es un myth.</Typography>
        <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
          <Button startIcon={<SearchIcon />} variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' }, borderRadius: '16px', py: 1.5, px: 3 }}>Early Detection</Button>
          <Button startIcon={<CheckCircleOutlineIcon />} variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' }, borderRadius: '16px', py: 1.5, px: 3 }}>Prevention Methods</Button>
          <Button startIcon={<HealingIcon />} variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' }, borderRadius: '16px', py: 1.5, px: 3 }}>Treatment Options</Button>
        </Box>
      </Box>

      {/* --- Featured Pests Section (NOW DYNAMIC) --- */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>Featured Pests</Typography>
        <Grid container spacing={4}>
          {pests.map(pest => (
            <Grid item xs={12} sm={6} md={4} key={pest._id}>
              <Card
                onClick={() => handleOpenOverlay(pest)}
                sx={{ borderRadius: '20px', boxShadow: 3, cursor: 'pointer', '&:hover': { transform: 'scale(1.03)', transition: 'transform 0.2s' } }}
              >
                <CardMedia component="img" height="200" image={pest.imageUrl} alt={pest.name} />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600 }}>{pest.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{pest.overview?.description || 'No description available.'}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* --- Articles Section (NOW DYNAMIC) --- */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>Related Articles</Typography>
        <Grid container spacing={4}>
          {articles.map(article => (
            <Grid item xs={12} md={4} key={article._id}>
              <ArticleCard image={article.imageUrl} title={article.title} description={article.content ? article.content.substring(0, 150) + '...' : ''} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* --- Pest Detail Overlay (dynamic) --- */}
      {selectedPest && <PestDetailOverlay open={isOverlayOpen} onClose={handleCloseOverlay} pestData={selectedPest} />}
    </Box>
  );
};

export default PestsPage;