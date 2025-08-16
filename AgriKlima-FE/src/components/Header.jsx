import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import logo from '../assets/logo.png'; // Make sure your logo is in src/assets/

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={1} 
      sx={{ 
        backgroundColor: 'white', 
        padding: '10px 5%' 
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Link to="/">
            <img src={logo} alt="AgriKlima Logo" style={{ height: '45px', marginRight: '15px' }} />
          </Link>
        </Box>

        {/* Navigation Links */}
        <Box>
          <Button 
            component={Link} 
            to="/" 
            sx={{ color: 'var(--dark-text)', fontWeight: 500, textTransform: 'none', fontSize: '16px', margin: '0 10px' }}
          >
            Home
          </Button>
          <Button 
            component={Link} 
            to="/about" 
            sx={{ color: 'var(--dark-text)', fontWeight: 500, textTransform: 'none', fontSize: '16px', margin: '0 10px' }}
          >
            About Us
          </Button>
          <Button 
            component={Link} 
            to="/news" 
            sx={{ color: 'var(--dark-text)', fontWeight: 500, textTransform: 'none', fontSize: '16px', margin: '0 10px' }}
          >
            News
          </Button>
        </Box>

        {/* Log In Button */}
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
          sx={{ 
            backgroundColor: 'var(--primary-green)', 
            borderRadius: '20px',
            textTransform: 'none',
            fontSize: '16px',
            padding: '5px 25px',
            marginLeft: '20px',
            '&:hover': {
              backgroundColor: 'var(--light-green)'
            } 
          }}
        >
          Log In
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;