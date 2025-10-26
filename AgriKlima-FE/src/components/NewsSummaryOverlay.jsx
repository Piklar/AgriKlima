import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Paper, List, ListItem, ListItemIcon, Divider, Link as MuiLink } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinkIcon from '@mui/icons-material/Link'; // Import LinkIcon

// Reusable Quote component
const QuoteItem = ({ text }) => (
  <Paper
    elevation={0}
    sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '10px', mb: 2 }}
  >
    <Typography>"{text}"</Typography>
  </Paper>
);

// Tab Button
const TabButton = ({ label, activeTab, setActiveTab }) => {
  const isActive = activeTab === label;
  return (
    <Button
      onClick={() => setActiveTab(label)}
      sx={{
        borderRadius: '30px',
        px: 3,
        py: 1,
        textTransform: 'none',
        fontSize: '0.95rem',
        fontWeight: 600,
        backgroundColor: isActive ? 'var(--primary-green)' : '#e0e0e0',
        color: isActive ? 'white' : 'var(--dark-text)',
        '&:hover': { backgroundColor: isActive ? 'var(--light-green)' : '#d5d5d5' }
      }}
    >
      {label}
    </Button>
  );
};

const NewsSummaryOverlay = ({ open, onClose, articleData }) => {
  const [activeTab, setActiveTab] = useState('Full Article');

  useEffect(() => {
    if (open) setActiveTab('Full Article');
  }, [open]);

  if (!articleData) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'Key Points':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Key Highlights</Typography>
            <List disablePadding>
              {(articleData.summary?.keyPoints || []).map((point, i) => (
                <ListItem key={i} sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <Typography>{point}</Typography>
                </ListItem>
              ))}
            </List>
          </>
        );
      case 'Quotes':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Notable Quotes</Typography>
            {(articleData.summary?.quotes || []).map((quote, i) => (
              <QuoteItem key={i} text={quote} />
            ))}
          </>
        );
      case 'Impact':
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Expected Impact</Typography>
            <Paper elevation={0} sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: '10px' }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Agricultural Impact</Typography>
              <Typography>{articleData.summary?.impact || 'No impact analysis available.'}</Typography>
            </Paper>
          </>
        );
      case 'Full Article':
      default:
        return (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Full Article</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{articleData.content}</Typography>
          </>
        );
    }
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: '10px',
          width: '85%',
          maxWidth: '1000px',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          backgroundColor: (theme) => theme.palette.background.paper
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {articleData.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {articleData.publicationDate ? new Date(articleData.publicationDate).toLocaleDateString() : ''}
              {articleData.author ? ` • ${articleData.author}` : ''}
            </Typography>
            {/* View Source Link */}
            {articleData.sourceUrl && (
              <MuiLink href={articleData.sourceUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <LinkIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="primary">View Source</Typography>
              </MuiLink>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Tabs */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
          <TabButton label="Full Article" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton label="Key Points" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton label="Quotes" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton label="Impact" activeTab={activeTab} setActiveTab={setActiveTab} />
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
          {renderContent()}
        </Box>

        {/* Close Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ mt: 3, alignSelf: 'flex-end', textTransform: 'none', fontWeight: 600 }}
        >
          Close Article
        </Button>
      </Paper>
    </Modal>
  );
};

export default NewsSummaryOverlay;