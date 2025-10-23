// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Divider,
  Paper,
  Grid,
  CardActionArea,
  CardMedia,
  Skeleton
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'; // Added for date formatting

// FIX: Import API service and necessary components
import * as api from '../services/api';
import NewsSummaryOverlay from '../components/NewsSummaryOverlay';
import ViewAllOverlay from '../components/ViewAllOverlay'; // FIX: Retained for View All functionality

// images & icons
import heroBg from "../assets/images/about-image-1.jpg";
import videoBg from "../assets/images/about-image-2.jpg";
import visionImg from "../assets/images/mission-vision.jpg";
import logo from "../assets/logo.png";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PestControlIcon from "@mui/icons-material/PestControl";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import ChecklistIcon from "@mui/icons-material/Checklist";

const theme = createTheme({
  palette: {
    primary: { main: "#2e7d32", light: "#4caf50", dark: "#1b5e20" },
    secondary: { main: "#ffa000", light: "#ffc107", dark: "#ff8f00" },
    background: { default: "#f8f9f8" },
  },
  typography: {
    fontFamily: ['Inter', '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
  },
  shape: { borderRadius: 10 },
});

// Feature data
const leftFeatures = [
    { title: "Weather Forecast", description: "Accurate weather predictions tailored to your location and farming needs.", icon: <WbSunnyIcon sx={{ fontSize: 32 }} /> },
    { title: "Recommended Crops", description: "Personalized crop suggestions based on local conditions and soil type.", icon: <LocalFloristIcon sx={{ fontSize: 32 }} /> },
    { title: "Pest Detection and Information", description: "Early identification of potential pest problems with AI recognition.", icon: <PestControlIcon sx={{ fontSize: 32 }} /> },
];
const rightFeatures = [
    { title: "Farming Calendar", description: "Plan and organize farming activities efficiently with a personalized seasonal calendar to guide your schedule.", icon: <CalendarTodayIcon sx={{ fontSize: 32 }} /> },
    { title: "Task Manager", description: "Manage and monitor your farming activities efficiently from planting to harvest to keep crops healthy and productive.", icon: <ChecklistIcon sx={{ fontSize: 32 }} /> },
    { title: "AI Farming Assistant", description: "Get AI-powered recommendations for improving farming practices.", icon: <AgricultureIcon sx={{ fontSize: 32 }} /> },
];

const HomePage = () => {
  const navigate = useNavigate();

  // FIX: Add state for news data and both overlays
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isSummaryOverlayOpen, setIsSummaryOverlayOpen] = useState(false); // Used for single article view
  const [isViewAllOpen, setIsViewAllOpen] = useState(false); // Used for View All overlay

  // FIX: Fetch news data on component mount
  useEffect(() => {
    const fetchLatestNews = async () => {
      setLoading(true);
      try {
        const response = await api.getNews();
        setArticles(response.data || []);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestNews();
  }, []);

  // Handlers for the News Summary Overlay
  const handleOpenSummaryOverlay = (article) => {
    setSelectedArticle(article);
    setIsSummaryOverlayOpen(true);
  };

  const handleCloseSummaryOverlay = () => {
    setIsSummaryOverlayOpen(false);
    setSelectedArticle(null);
  };
  
  // Handler for clicking an item within the ViewAllOverlay
  const handleItemClickFromAllView = (article) => {
    setIsViewAllOpen(false);
    // Delay opening the summary to allow the 'View All' overlay to close smoothly
    setTimeout(() => {
        handleOpenSummaryOverlay(article);
    }, 300);
  };

  // Prepare data for the news section
  const mainArticle = !loading && articles.length > 0 ? articles[0] : null;
  const moreNews = !loading && articles.length > 1 ? articles.slice(1, 4) : [];

  return (
    <ThemeProvider theme={theme}>
      {/* HERO */}
      <Box
        id="home-hero"
        sx={{
          minHeight: "100vh",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          textAlign: "center", color: "white", px: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 300, letterSpacing: 2, fontFamily: "'Poppins', sans-serif", textTransform: "uppercase", color: "#f1f1f1" }}>
          Welcome to
        </Typography>

        <Box component="img" src={logo} alt="AgriKlima Logo" sx={{ width: { xs: "220px", md: "320px" }, mb: 4, filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.6))" }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              px: 6, py: 1.5, fontSize: "1.1rem", fontWeight: 600,
              textTransform: "uppercase",
              background: "linear-gradient(90deg, #2e7d32, #fbc02d)",
              borderRadius: "50px", boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
              "&:hover": { background: "linear-gradient(90deg, #1b5e20, #f9a825)" }
            }}
            onClick={() => navigate("/login")}
          >
            Get Started
          </Button>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Don't have an account?{' '}
            <Button
              variant="text"
              sx={{ color: 'white', fontWeight: 'bold', textDecoration: 'underline', p: 0.5, minWidth: 'auto' }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Box>

      {/* ABOUT SECTION */}
      <Container id="about-section" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: "center", maxWidth: "900px", mx: "auto" }}>
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontSize: { xs: "2rem", md: "2.8rem" },
              fontWeight: 700,
            }}
          >
            About <span style={{ color: theme.palette.primary.main }}>AgriKlima</span>
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 4, px: { xs: 2, md: 0 } }}>
            AgriKlima is a climate-smart agriculture platform designed to empower farmers with accurate weather forecasts, crop recommendations, and real-time insights to adapt to changing climate conditions.
          </Typography>
        </Box>
      </Container>

      {/* VISION / MISSION */}
      <Box sx={{ backgroundColor: "rgba(46, 125, 50, 0.05)", py: { xs: 6, md: 10 } }} id="vision-section">
        <Container>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 4, md: 6 },
            }}
          >
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Box
                component="img"
                src={visionImg}
                alt="Mission and Vision"
                sx={{
                  width: "100%",
                  maxWidth: 520,
                  borderRadius: 2,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              />
            </Box>

            <Box sx={{ flex: 1, px: { xs: 2, md: 0 } }}>
              <Typography variant="h3" sx={{ mb: 3, fontSize: { xs: "2rem", md: "2.6rem" }, fontWeight: 700 }}>
                Our Vision & <span style={{ color: theme.palette.primary.main }}>Mission</span>
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
                Our vision is to create a sustainable farming community supported by modern technology.
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Our mission is to help farmers adapt, thrive, and innovate in the face of climate change through accessible technology.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* VIDEO BANNER */}
      <Box
        id="video-section"
        sx={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${videoBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          py: { xs: 8, md: 12 },
          px: 2,
          color: "white",
          textAlign: "center",
        }}
      >
        <Container sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              maxWidth: "900px",
              mx: "auto",
              mb: 4,
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Agriculture Matters to the Future of Development
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            href="https://drive.google.com/file/d/1QW1toEbLmd4J7i8XmmcSPLdUDh-oxMR3/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              px: { xs: 4, sm: 6 },
              py: 1.4,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              backgroundColor: theme.palette.secondary.main,
              "&:hover": { backgroundColor: theme.palette.secondary.dark },
            }}
          >
            Watch Our Video
          </Button>
        </Container>
      </Box>

      {/* FEATURES */}
      <Container id="features-section" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            mb: 5,
            fontSize: { xs: "2rem", md: "2.8rem" },
            fontWeight: 700,
          }}
        >
          Our <span style={{ color: theme.palette.primary.main }}>Features</span>
        </Typography>

        <Box
          sx={{
            display: { xs: "block", md: "flex" },
            gap: { xs: 0, md: 4 },
            alignItems: "stretch",
            justifyContent: "center",
          }}
        >
          {/* Left Features */}
          <Box sx={{ flex: 1 }}>
            {leftFeatures.map((feature, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  mb: 3,
                  textAlign: "left",
                  mx: { xs: 1, sm: 0 },
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderRadius: 2,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", alignItems: "flex-start" }}>
                  <Box sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }}>{feature.icon}</Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: "1.1rem" }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.5 }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Divider for Desktop */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: "none", md: "block" },
              mx: 2,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.08)",
            }}
          />

          {/* Right Features */}
          <Box sx={{ flex: 1 }}>
            {rightFeatures.map((feature, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  mb: 3,
                  textAlign: "left",
                  mx: { xs: 1, sm: 0 },
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderRadius: 2,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", alignItems: "flex-start" }}>
                  <Box sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }}>{feature.icon}</Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: "1.1rem" }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.5 }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>

      {/* NEWS SECTION */}
      <Box id="news-section" sx={{ py: { xs: 6, md: 10 }, backgroundColor: "#fff" }}>
        <Container>
          <Typography variant="h3" sx={{ textAlign: "center", mb: 2, fontWeight: 700 }}>
            Latest <span style={{ color: theme.palette.primary.main }}>News</span>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mb: 6 }}>
            Stay updated with the most recent developments in Philippine agriculture.
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {/* Main Article */}
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid #e0e0e0", overflow: "hidden", backgroundColor: "white" }}>
                {loading || !mainArticle ? (
                    <Skeleton variant="rectangular" height={500} />
                ) : (
                    <CardActionArea onClick={() => handleOpenSummaryOverlay(mainArticle)}>
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: "bold", color: theme.palette.primary.dark, mb: 2 }}>
                                {mainArticle.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {format(new Date(mainArticle.publicationDate), 'MMMM d, yyyy')} • By {mainArticle.author}
                            </Typography>
                            <Box sx={{ mb: 3, borderRadius: 2, overflow: "hidden", height: { xs: 200, sm: 300 } }}>
                                <CardMedia component="img" image={mainArticle.imageUrl} alt={mainArticle.title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </Box>
                            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                {mainArticle.content.substring(0, 200)}...
                            </Typography>
                        </Box>
                    </CardActionArea>
                )}
              </Paper>
            </Grid>

            {/* More News */}
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid #e0e0e0", backgroundColor: "white", p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
                  More Agriculture News
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {loading ? (
                    [...Array(3)].map((_, index) => <Skeleton key={index} variant="text" height={60} sx={{ mb: 1 }} />)
                ) : (
                    moreNews.map((news, index) => (
                        <CardActionArea key={index} onClick={() => handleOpenSummaryOverlay(news)} sx={{ display: 'block', p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' }}}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.primary.dark }}>
                                {news.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                {news.author} • {format(new Date(news.publicationDate), 'MMMM d, yyyy')}
                                </Typography>
                            </Box>
                        </CardActionArea>
                    ))
                )}
                {/* FIX: Use the new View All handler */}
                <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={() => setIsViewAllOpen(true)}>
                  View All News
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* FIX: Add the Overlay components */}
      <NewsSummaryOverlay
        open={isSummaryOverlayOpen}
        onClose={handleCloseSummaryOverlay}
        articleData={selectedArticle}
      />
      <ViewAllOverlay
        open={isViewAllOpen}
        onClose={() => setIsViewAllOpen(false)}
        title="All News Articles"
        items={articles}
        onItemClick={handleItemClickFromAllView}
      />
    </ThemeProvider>
  );
};

export default HomePage;