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
import '@fontsource/poppins'; // ✅ Import Poppins font

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
        fontFamily: 'Poppins, sans-serif', // ✅ Apply globally inside modal
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '90%',
          maxWidth: 900,
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '16px',
          position: 'relative',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          backgroundColor: '#f9fdf9',
          border: '1px solid #c8e6c9',
          fontFamily: 'Poppins, sans-serif', // ✅ Reinforced here too
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: '#2e7d32',
            backgroundColor: 'rgba(255,255,255,0.6)',
            '&:hover': {
              backgroundColor: 'rgba(200,230,201,0.9)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1b5e20, #4caf50)',
            color: 'white',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            p: 4,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ fontFamily: 'Poppins, sans-serif' }}>
            Terms of Service & Privacy Policy
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ mt: 1, opacity: 0.9, fontFamily: 'Poppins, sans-serif' }}
          >
            Effective Date: October 22, 2025
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4, fontSize: '0.95rem', lineHeight: 1.8, color: '#333', fontFamily: 'Poppins, sans-serif' }}>
          {/* Terms of Service Section */}
          <Typography
            variant="h5"
            sx={{ color: '#1b5e20', fontWeight: 700, mb: 2, fontFamily: 'Poppins, sans-serif' }}
          >
            Terms of Service
          </Typography>
          <Typography paragraph sx={{ fontFamily: 'Poppins, sans-serif' }}>
            These Terms of Service ("Terms") govern your use of the AgriKlima System ("the Service").
            By accessing or using the Service, you agree to be bound by these Terms.
          </Typography>

          <Divider sx={{ my: 2, borderColor: '#c8e6c9' }} />

          {[
            {
              title: '1. Eligibility',
              text: 'You must be at least 13 years old (or the age of digital consent in your country) to use the Service...',
            },
            {
              title: '2. User Responsibilities',
              text: 'When using the Service, you agree to provide accurate, current, and complete information...',
            },
            {
              title: '3. Agricultural Data Disclaimer',
              text: 'The AgriKlima System provides climate and agricultural data analysis tools. While we strive for accuracy...',
            },
            {
              title: '4. Intellectual Property',
              text: 'All content, software, design, algorithms, and branding of the Service are owned by AgriKlima System...',
            },
            {
              title: '5. User-Generated Content',
              text: 'If you submit data, feedback, or other content to the Service, you grant us a non-exclusive license...',
            },
            {
              title: '6. Account Termination',
              text: 'We reserve the right to suspend or terminate accounts that violate these Terms...',
            },
            {
              title: '7. Limitation of Liability',
              text: 'To the fullest extent permitted by law, the Service is provided "as is" without warranties of any kind...',
            },
            {
              title: '8. Service Modifications',
              text: 'We reserve the right to modify, suspend, or discontinue any feature of the Service...',
            },
            {
              title: '9. Governing Law',
              text: 'These Terms shall be governed by the laws of your jurisdiction, without regard to conflict of law provisions.',
            },
            {
              title: '10. Changes to Terms',
              text: 'We may update these Terms periodically and notify users of significant changes...',
            },
            {
              title: '11. Contact Us',
              text: 'For questions about these Terms, contact us at: [your-email@agriklimasystem.com]',
            },
          ].map((section, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: '#388e3c', fontFamily: 'Poppins, sans-serif' }}
              >
                {section.title}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontFamily: 'Poppins, sans-serif' }}>
                {section.text}
              </Typography>
            </Box>
          ))}

          {/* Privacy Policy Section */}
          <Divider sx={{ my: 3, borderColor: '#a5d6a7' }} />
          <Typography
            variant="h5"
            sx={{ color: '#1b5e20', fontWeight: 700, mb: 2, fontFamily: 'Poppins, sans-serif' }}
          >
            Privacy Policy
          </Typography>

          {[
            {
              title: '1. Information We Collect',
              text: 'We collect personal, agricultural, and usage data to improve your experience...',
            },
            {
              title: '2. How We Use Your Information',
              text: 'We use collected data to provide insights, forecasts, and climate-based recommendations...',
            },
            {
              title: '3. Sharing of Information',
              text: 'We do not sell your personal data. We may share anonymized or aggregated information...',
            },
            {
              title: '4. Data Security',
              text: 'We implement encryption, access controls, and audits to secure data. However, no system is 100% secure...',
            },
            {
              title: '5. Data Retention',
              text: 'We retain your data while your account is active or as required by law...',
            },
            {
              title: '6. Your Rights',
              text: 'You may request access, correction, or deletion of your data...',
            },
            {
              title: '7. International Data Transfers',
              text: 'Your data may be processed in other countries with appropriate safeguards...',
            },
            {
              title: '8. Third-Party Services',
              text: 'We are not responsible for the privacy practices of linked third-party services...',
            },
            {
              title: '9. Children’s Privacy',
              text: 'The Service is not intended for children under 13 years old...',
            },
            {
              title: '10. Changes to This Privacy Policy',
              text: 'We may update this policy periodically and inform users of major updates...',
            },
            {
              title: '11. Contact Us',
              text: 'For privacy concerns, contact: [your-email@agriklimasystem.com]',
            },
          ].map((section, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: '#388e3c', fontFamily: 'Poppins, sans-serif' }}
              >
                {section.title}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontFamily: 'Poppins, sans-serif' }}>
                {section.text}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 3, borderColor: '#c8e6c9' }} />
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: '#555', mb: 2, fontFamily: 'Poppins, sans-serif' }}
          >
            © 2025 AgriKlima System. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </Modal>
  );
};

export default Terms;
