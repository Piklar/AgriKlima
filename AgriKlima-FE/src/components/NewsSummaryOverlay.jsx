import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Paper, Chip, List, ListItem, ListItemIcon } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Reusable Quote component
const QuoteItem = ({ text }) => (
  <Paper elevation={0} sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '16px', mb: 2 }}>
    <Typography>"{text}"</Typography>
  </Paper>
);

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
        fontSize: '1rem',
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
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Key Highlights</Typography>
            <List>
              {(articleData.summary?.keyPoints || []).map((point, i) => (
                <ListItem key={i}><ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>{point}</ListItem>
              ))}
            </List>
          </>
        );
      case 'Quotes':
        return (
          <>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Notable Quotes</Typography>
            {(articleData.summary?.quotes || []).map((quote, i) => <QuoteItem key={i} text={quote} />)}
          </>
        );
      case 'Impact':
        return (
          <>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Expected Impact</Typography>
            <Paper elevation={0} sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: '16px' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Agricultural Impact</Typography>
              <Typography>{articleData.summary?.impact || 'No impact analysis available.'}</Typography>
            </Paper>
          </>
        );
      case 'Full Article':
      default:
        return (
          <>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Full Article</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{articleData.content}</Typography>
          </>
        );
    }
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ position: 'relative', width: '85%', maxWidth: '1100px', height: '85vh', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* --- Green Header Section --- */}
        <Box sx={{ bgcolor: '#81c784', p: 4, color: '#1b5e20' }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'black' }}>{articleData.title}</Typography>
          <Typography sx={{ color: '#212121' }}>
            {articleData.publicationDate ? new Date(articleData.publicationDate).toLocaleDateString() : ''}{articleData.author ? ` • ${articleData.author}` : ''}
          </Typography>
        </Box>
        {/* --- Main Content Section --- */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
          {/* Tab Navigation */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <TabButton label="Full Article" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton label="Key Points" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton label="Quotes" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton label="Impact" activeTab={activeTab} setActiveTab={setActiveTab} />
          </Box>
          {/* Tab Content */}
          {renderContent()}
        </Box>
        {/* --- Close Button --- */}
        <Button
          onClick={onClose}
          sx={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            borderRadius: '30px',
            backgroundColor: '#424242',
            color: 'white',
            textTransform: 'none',
            fontSize: '1rem',
            px: 3,
            py: 1,
            '&:hover': {
              backgroundColor: '#616161'
            }
          }}
        >
          Close Article
        </Button>
      </Paper>
    </Modal>
  );
};

export default NewsSummaryOverlay;