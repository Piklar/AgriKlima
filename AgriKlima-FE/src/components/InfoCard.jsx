// src/components/InfoCard.jsx
import React from "react";
import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";

const InfoCard = ({ image, title, description, buttonText, onButtonClick }) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
      }}
    >
      {image && (
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={title}
          sx={{ objectFit: "cover" }}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        {buttonText && (
          <Button
            variant="contained"
            size="small"
            onClick={onButtonClick}
            sx={{ borderRadius: 2 }}
          >
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
