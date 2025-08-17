// src/pages/PestsPage.jsx

import React, { useState } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, CardMedia, Button, Paper } from '@mui/material';

// --- Component and Image Imports ---
import PestDetailOverlay from '../components/PestDetailOverlay';
import pestHeroBg from '../assets/images/pest-hero-background.jpg';
import aphidsCardImg from '../assets/images/pest-aphids-card.jpg';
import article1Img from '../assets/images/article-farm-to-table.jpg';
import article2Img from '../assets/images/article-empowering-farmers.jpg';
import article3Img from '../assets/images/article-organic-farming.jpg';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HealingIcon from '@mui/icons-material/Healing';

// Reusable Article Card (can be abstracted into its own component file)
const ArticleCard = ({ image, title, description }) => (
    <Card sx={{ borderRadius: '20px', boxShadow: 3, height: '100%' }}>
        <CardMedia component="img" height="200" image={image} alt={title} />
        <CardContent sx={{ pb: 1 }}><Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>{title}</Typography><Typography variant="body2" color="text.secondary">{description}</Typography></CardContent>
        <Box sx={{ p: 2, pt: 0 }}><Button variant="contained" fullWidth sx={{ backgroundColor: 'var(--primary-green)', borderRadius: '12px', '&:hover': { backgroundColor: 'var(--light-green)' }}}>Read More</Button></Box>
    </Card>
);

const PestsPage = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleOpenOverlay = () => setIsOverlayOpen(true);
  const handleCloseOverlay = () => setIsOverlayOpen(false);

  return (
    <Box>
      {/* --- Hero Section --- */}
      <Box sx={{ height: '50vh', background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${pestHeroBg})`, backgroundSize: 'cover', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>Learn about Pest Controls</Typography>
        <Typography>Ut dapibus ingula ex mentione ad eam familia. Ubi separati existentia es un myth.</Typography>
        <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
          <Button startIcon={<SearchIcon />} variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)'}, borderRadius: '16px', py: 1.5, px: 3 }}>Early Detection</Button>
          <Button startIcon={<CheckCircleOutlineIcon />} variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)'}, borderRadius: '16px', py: 1.5, px: 3 }}>Prevention Methods</Button>
          <Button startIcon={<HealingIcon />} variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)'}, borderRadius: '16px', py: 1.5, px: 3 }}>Treatment Options</Button>
        </Box>
      </Box>
      
      {/* --- Featured Pests Section (New) --- */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>Common Pests</Typography>
        <Grid container spacing={4}>
            {/* THIS IS THE CLICKABLE CARD */}
            <Grid item xs={12} sm={6} md={4}>
                <Card 
                    onClick={handleOpenOverlay}
                    sx={{ borderRadius: '20px', boxShadow: 3, cursor: 'pointer', '&:hover': { transform: 'scale(1.03)', transition: 'transform 0.2s' } }}
                >
                    <CardMedia component="img" height="200" image={aphidsCardImg} alt="Aphids" />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600 }}>Aphids</Typography>
                        <Typography variant="body2" color="text.secondary">Small, sap-sucking insects that are common garden pests.</Typography>
                    </CardContent>
                </Card>
            </Grid>
            {/* You can add more pest cards here */}
        </Grid>
      </Container>


      {/* --- Articles Section --- */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
         <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>Articles</Typography>
        <Grid container spacing={4}>
            <Grid item xs={12} md={4}><ArticleCard image={article1Img} title="From Farm to Table" description="Exploring the intricate process of bringing agricultural products from farms to consumers' tables." /></Grid>
            <Grid item xs={12} md={4}><ArticleCard image={article2Img} title="Technology's Role in Modern Agriculture" description="Innovations like precision farming and drones help farmers increase efficiency." /></Grid>
            <Grid item xs={12} md={4}><ArticleCard image={article3Img} title="Exploring Organic Farming" description="Organic farming offers a healthier alternative for people and the planet." /></Grid>
        </Grid>
      </Container>

      {/* --- Render the Overlay --- */}
      <PestDetailOverlay open={isOverlayOpen} onClose={handleCloseOverlay} />
    </Box>
  );
};

export default PestsPage;