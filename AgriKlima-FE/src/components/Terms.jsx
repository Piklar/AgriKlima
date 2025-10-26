import React from 'react';
import {
  Modal,
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '@fontsource/poppins';

const Section = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" sx={{ color: '#1b5e20', fontWeight: 600, mb: 1, fontFamily: 'Poppins, sans-serif' }}>
      {title}
    </Typography>
    <Typography variant="body2" component="div" sx={{ mt: 0.5, fontFamily: 'Poppins, sans-serif', lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Box>
);

const Terms = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '90%',
          maxWidth: 900,
          maxHeight: '90vh',
          display: 'flex', // Use flexbox for layout
          flexDirection: 'column', // Stack children vertically
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          backgroundColor: '#f9fdf9',
          border: '1px solid #c8e6c9',
          fontFamily: 'Poppins, sans-serif',
          overflow: 'hidden', // Hide overflow on the main paper
        }}
      >
        {/* --- THIS IS THE FIX: Close button is now part of the header flow --- */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1b5e20, #4caf50)',
            color: 'white',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            p: { xs: 2, md: 4 },
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ fontFamily: 'Poppins, sans-serif' }}>
              Terms of Service & Privacy Policy
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ mt: 1, opacity: 0.9, fontFamily: 'Poppins, sans-serif' }}
            >
              Effective Date: October 26, 2025
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* --- THIS IS THE FIX: Make the content area scrollable --- */}
        <Box sx={{ overflowY: 'auto', p: { xs: 3, md: 4 }, color: '#333' }}>
          <Typography variant="h5" sx={{ color: '#1b5e20', fontWeight: 700, mb: 2, fontFamily: 'Poppins, sans-serif' }}>
            Terms of Service
          </Typography>
          
          <Section title="1. Acceptance of Terms">
            <p>By registering for and using the AgriKlima application ("Service"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Service.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>AgriKlima provides agricultural information services including location-based weather forecasts, crop and pest information libraries, and tools for tracking personal farm activities ("My Farm").</p>
          </Section>

          <Section title="3. Agricultural Data Disclaimer">
            <p>The information provided by AgriKlima, including weather data, farming advice, and crop recommendations, is intended for informational purposes only. It is not a substitute for professional agricultural advice, diagnosis, or treatment. Weather and farming condition scores are generated based on data from third-party sources and predefined rules, and AgriKlima is not liable for any inaccuracies or for crop outcomes based on this information. Always consult with a local agricultural expert for specific advice.</p>
          </Section>

          <Section title="4. User Responsibilities">
            <p>You are responsible for the accuracy of the information you provide, such as your location and the planting dates of your crops. You agree not to use the Service for any unlawful purpose or to engage in any activity that disrupts the Service.</p>
          </Section>

          <Section title="5. Account Termination">
            <p>We reserve the right to suspend or terminate your account at our discretion if you violate these Terms.</p>
          </Section>
          
          <Divider sx={{ my: 4, borderColor: '#a5d6a7' }} />

          <Typography variant="h5" sx={{ color: '#1b5e20', fontWeight: 700, mb: 2, fontFamily: 'Poppins, sans-serif' }}>
            Privacy Policy
          </Typography>
          
          <Section title="1. Information We Collect">
            <ul>
              <li><strong>Personal Information:</strong> When you register, we collect your name, email address, mobile number, date of birth, gender, and location. Your location is used to provide tailored weather forecasts and regional recommendations.</li>
              <li><strong>Agricultural Data:</strong> We collect information about the crops you add to "My Farm," including the type of crop and its planting date. This is used to provide you with growth tracking and task management features.</li>
              <li><strong>Usage Data:</strong> We may collect anonymous data about how you interact with our Service to help us improve its functionality.</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>Your data is used to:</p>
            <ul>
              <li>Provide, personalize, and improve the Service.</li>
              <li>Deliver location-specific weather data and farming advice.</li>
              <li>Enable you to track your crop progress and manage tasks.</li>
              <li>Communicate with you about your account or our services.</li>
            </ul>
          </Section>

          <Section title="3. Data Sharing and Security">
            <p>We do not sell, rent, or trade your personal information with third parties for marketing purposes. Your password is encrypted and we take reasonable measures to protect your data. We may share anonymized and aggregated agricultural data (e.g., "50% of users in Pampanga plant rice in June") for research purposes to improve local farming insights, but this data will not be personally identifiable.</p>
          </Section>
          
          <Section title="4. Your Rights">
            <p>You have the right to access and update your personal information through your profile page. You may also request the deletion of your account and associated data by contacting us.</p>
          </Section>

          <Section title="5. Contact Us">
            <p>If you have any questions about these Terms or our Privacy Policy, please contact us at <strong>AgriKlima@gmail.com</strong>.</p>
          </Section>

          <Divider sx={{ my: 3, borderColor: '#c8e6c9' }} />
          <Typography variant="body2" sx={{ textAlign: 'center', color: '#555', mb: 2, fontFamily: 'Poppins, sans-serif' }}>
            © 2025 AgriKlima. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </Modal>
  );
};

export default Terms;