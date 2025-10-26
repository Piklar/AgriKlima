import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Box, Typography, Link as MuiLink, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

const ContactInfoItem = ({ icon, text, link }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    {icon}
    <MuiLink href={link} underline="hover" sx={{ ml: 2, fontSize: '1.1rem', color: 'text.primary' }}>
      {text}
    </MuiLink>
  </Box>
);

const ContactUsModal = ({ open, onClose }) => {
  const email = "agriklimaua@gmail.com";
  const phone = "09158158735";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ position: 'relative' }}>
        <Typography variant="h5" component="span" sx={{ fontWeight: 'bold' }}>
          Contact Us
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Have questions or need support? We're here to help!
        </Typography>
        <ContactInfoItem
          icon={<EmailOutlinedIcon color="primary" />}
          text={email}
          link={`mailto:${email}`}
        />
        <ContactInfoItem
          icon={<PhoneOutlinedIcon color="primary" />}
          text={phone}
          link={`tel:${phone}`}
        />
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px', justifyContent: 'space-between' }}>
        <Button onClick={onClose}>Close</Button>
        <Button 
          variant="contained" 
          href={`mailto:${email}`}
          startIcon={<EmailOutlinedIcon />}
        >
          Send an Email
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactUsModal;