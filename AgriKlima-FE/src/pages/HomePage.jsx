// src/pages/HomePage.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import heroBg from "../assets/images/about-image-1.jpg";
import logo from "../assets/logo.png";

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundAttachment: 'fixed',
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        px: 2,
      }}
    >
      {/* Welcome Text */}
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: 300,
          letterSpacing: 2,
          fontFamily: "'Poppins', sans-serif",
          textTransform: "uppercase",
          color: "#f1f1f1",
        }}
      >
        Welcome to
      </Typography>

      {/* Logo or AgriKlima Text */}
      <Box
        component="img"
        src={logo}
        alt="AgriKlima Logo"
        sx={{
          width: { xs: "280px", md: "360px" }, // Increased sizes
          mb: 4,
          filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.6))",
        }}
      />

      {/* Discover More Button */}
      {/* Discover More Button */}
      <Button variant="contained" sx={{ px: 5, py: 1.7, fontSize: "1.1rem", fontWeight: 300, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'Poppins', sans-serif", color: "#f1f1f1", background: "linear-gradient(90deg, #2e7d32, #fbc02d)", borderRadius: "50px", boxShadow: "0px 4px 10px rgba(0,0,0,0.4)", "&:hover": { background: "linear-gradient(90deg, #1b5e20, #f9a825)" } }} onClick={() => window.location.href = '/about'}>Discover More</Button>
    </Box>
  );
};

export default HomePage;
