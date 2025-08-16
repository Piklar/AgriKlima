import React from 'react';
import { Container, Grid, Typography, Box, Card, CardContent, CardMedia, Divider } from '@mui/material';
import mainNewsImage from '../assets/images/news-main.jpg'; // Add the main news image to assets

// A small, reusable component for the sidebar news items
const MoreNewsCard = ({ title, image }) => (
  <Box display="flex" mb={2}>
    <CardMedia
      component="img"
      sx={{ width: 100, height: 80, marginRight: 2, borderRadius: '4px' }}
      image={image || "https://via.placeholder.com/100x80"} // Placeholder image
      alt={title}
    />
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Author - Date
      </Typography>
    </Box>
  </Box>
);

const NewsPage = () => {
  // Dummy data for the "More News" section
  const moreNewsData = [
    { title: 'Umarangkada ang Agrikultura!' },
    { title: 'Murang bigas, hinila pababa ang inflation!' },
    { title: 'FPA to celebrate 48th anniversary with focus on smarter regulations' },
    { title: 'BAI confirms first case of HPAI H5N1 in Camarines Sur' },
    { title: 'Bohol tilapia farmer maps success through BFAR-PBS-TBI program' },
  ];

  return (
    <Container sx={{ padding: '40px 0' }}>
      <Grid container spacing={5}>
        
        {/* Main News Article Column */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Sec. Francisco Tiu Laurel Jr.: leading PH agriculture to a new, bold direction
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ margin: '10px 0 20px 0' }}>
            20 Sep 2023, 8:00pm
          </Typography>
          
          <img src={mainNewsImage} alt="Secretary Francisco Tiu Laurel Jr." style={{ width: '100%', borderRadius: '8px' }} />

          <Typography variant="body1" sx={{ marginTop: '30px', lineHeight: 1.8 }}>
            On November 3, 2023, Francisco P Tiu Laurel, Jr. took his oath as Secretary of the Department of Agriculture, officially accepting the role and its struggles.
            <br /><br />
            Before entering public service, Sec. Tiu Laurel built a successful career in business for over 30 years. He led projects in many industries like fisheries, marine services, and cold storage—all while championing sustainable business practices that protect the environment while helping the economy grow.
            <br /><br />
            His roadmap includes:
            <ul>
              <li>Modern mechanization and farming tools</li>
              <li>More irrigation and better farm-to-market roads</li>
              <li>Stronger transport and storage systems</li>
            </ul>
            With his bold vision, the Department of Agriculture is preparing for a stronger future. One that is modern, competitive, and ready to face new challenges.
          </Typography>
          <Typography variant="subtitle1" sx={{ marginTop: '40px', fontStyle: 'italic' }}>
            Source: Department of Agriculture
          </Typography>
        </Grid>

        {/* More News Sidebar Column */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            More News
          </Typography>
          <Divider sx={{ marginBottom: '20px' }}/>
          {moreNewsData.map((item, index) => (
            <MoreNewsCard key={index} title={item.title} />
          ))}
        </Grid>
        
      </Grid>
    </Container>
  );
};

export default NewsPage;