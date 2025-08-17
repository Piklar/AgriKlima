import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Fab
} from '@mui/material';

// --- Component Imports ---
import CropDetailOverlay from '../components/CropDetailOverlay'; // <-- Overlay component

// --- Image Imports ---
import wheatImg from '../assets/images/crop-wheat-large.jpg';
import sugarcaneImg from '../assets/images/crop-sugarcane.jpg';
import cornImg from '../assets/images/crop-corn-small.jpg';
import onionImg from '../assets/images/crop-onions.jpg';
import taroImg from '../assets/images/crop-taro.jpg';
import learnImg from '../assets/images/learn-about-crops.jpg';
import article1Img from '../assets/images/article-farm-to-table.jpg';
import article2Img from '../assets/images/article-empowering-farmers.jpg';
import article3Img from '../assets/images/article-organic-farming.jpg';
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

// --- Main Crops Page Component ---
const CropsPage = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); // Overlay state

  const handleOpenOverlay = () => setIsOverlayOpen(true);
  const handleCloseOverlay = () => setIsOverlayOpen(false);

  const secondaryCrops = [
    { title: 'Sugarcane', description: 'A major agricultural crop in the Philippines, with a significant portion grown in Luzon.', image: sugarcaneImg },
    { title: 'Corn', description: 'The second most important staple food crop in the Philippines after rice.', image: cornImg },
    { title: 'Onions/Garlic', description: 'Onions, particularly the common bulb type, are widely grown in the Philippines.', image: onionImg },
    { title: 'Taro/Gabi', description: 'Taro, locally known as Gabi, is a widely cultivated root crop valued for its corms.', image: taroImg },
  ];

  return (
    <Box>
      {/* --- Section 1: Recommended Crops --- */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
          Recommended Crop this season!
        </Typography>
        <Grid container spacing={4}>
          {/* Main Crop Card (clickable) */}
          <Grid item xs={12} md={7}>
            <Card 
              onClick={handleOpenOverlay}
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
                image={wheatImg}
                alt="Wheat"
                sx={{ borderRadius: '16px' }}
              />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 2 }}>
                  Wheat
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Wheat is a global staple, but it is not ideally suited for cultivation in the Philippines' tropical climate. The Philippines relies heavily on imported wheat. Wheat generally thrives in temperate zones, with varieties needing either a cold period (winter wheat) or moderate temperatures (spring wheat) and well-drained, fertile loam soil.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Secondary Crops List */}
          <Grid item xs={12} md={5}>
            {secondaryCrops.map(crop => (
              <SecondaryCropCard key={crop.title} {...crop} />
            ))}
          </Grid>
        </Grid>
      </Container>

      {/* --- Section 2: Learn About Crops --- */}
      <Box sx={{ backgroundColor: '#f0f4e8', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={5}>
              <img src={learnImg} alt="Learn about crops" style={{ width: '100%', borderRadius: '20px' }} />
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

      {/* --- Section 3: Articles --- */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
         <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>
          Articles
        </Typography>
        <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
                <ArticleCard 
                    image={article1Img} 
                    title="From Farm to Table: Exploring the Journey of Agro Produce"
                    description="Exploring the Journey of Agro Produce delves into the intricate process of bringing agricultural products from farms to consumers' tables."
                />
            </Grid>
            <Grid item xs={12} md={4}>
                 <ArticleCard 
                    image={article2Img} 
                    title="Empowering Farmer's, Technology's Role in Modern Agriculture"
                    description="Innovations like precision farming and the use of drones help farmers increase efficiency and build a more sustainable future for farming."
                />
            </Grid>
            <Grid item xs={12} md={4}>
                 <ArticleCard 
                    image={article3Img} 
                    title="Exploring Organic Farming, Healthier Alternatives for a Better Future"
                    description="Organic farming offers a healthier alternative for people and the planet. This method avoids synthetic pesticides and fertilizers."
                />
            </Grid>
        </Grid>
      </Container>

      {/* --- Floating Chatbot Icon --- */}
      <Fab sx={{ position: 'fixed', bottom: 40, right: 40, backgroundColor: 'white', '&:hover': { backgroundColor: '#f0f0f0' } }}>
          <img src={chatbotIcon} alt="Chatbot" style={{ width: '100%', height: '100%' }} />
      </Fab>

      {/* --- Crop Detail Overlay --- */}
      <CropDetailOverlay open={isOverlayOpen} onClose={handleCloseOverlay} />

    </Box>
  );
};

export default CropsPage;