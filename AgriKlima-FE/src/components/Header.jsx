// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../assets/logo.png';

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // 🔹 Smooth scroll helper
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      handleClose();
    }
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={2}
      sx={{
        backgroundColor: 'white',
        padding: { xs: '8px 3%', md: '10px 6%' },
        fontFamily: `'Poppins', sans-serif`,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: `'Poppins', sans-serif`,
        }}
      >
        {/* ===== Logo ===== */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logo}
            alt="AgriKlima Logo"
            style={{
              height: '38px',
              marginRight: '10px',
              cursor: 'pointer',
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </Box>

        {/* ===== Desktop Nav Buttons ===== */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: '20px',
            fontFamily: `'Poppins', sans-serif`,
          }}
        >
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{
              color: '#333',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '16px',
              fontFamily: `'Poppins', sans-serif`,
            }}
          >
            Home
          </Button>
          <Button
            onClick={() => window.scrollTo({ top: 930, behavior: 'smooth' })}
            sx={{
              color: '#333',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '16px',
              fontFamily: `'Poppins', sans-serif`,
            }}
          >
            About Us
          </Button>
          <Button
            onClick={() => window.scrollTo({ top: 2940, behavior: 'smooth' })}
            sx={{
              color: '#333',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '16px',
              fontFamily: `'Poppins', sans-serif`,
            }}
          >
            News
          </Button>
        </Box>

        {/* ===== Log In Button + Mobile Menu ===== */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Button
            variant="contained"
            onClick={() => (window.location.href = '/login')}
            sx={{
              backgroundColor: 'var(--primary-green)',
              borderRadius: '20px',
              textTransform: 'none',
              fontSize: { xs: '14px', sm: '16px' },
              padding: { xs: '4px 15px', sm: '5px 25px' },
              '&:hover': { backgroundColor: 'var(--light-green)' },
              whiteSpace: 'nowrap',
              fontFamily: `'Poppins', sans-serif`,
            }}
          >
            Log In
          </Button>

          {/* ===== Mobile Menu Icon ===== */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}>
            <IconButton onClick={handleMenu} size="large">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{ fontFamily: `'Poppins', sans-serif` }}
            >
              <MenuItem
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                sx={{ fontFamily: `'Poppins', sans-serif` }}
              >
                Home
              </MenuItem>
              <MenuItem
                onClick={() => window.scrollTo({ top: 870, behavior: 'smooth' })}
                sx={{ fontFamily: `'Poppins', sans-serif` }}
              >
                About Us
              </MenuItem>
              <MenuItem
                onClick={() => window.scrollTo({ top: 3350, behavior: 'smooth' })}
                sx={{ fontFamily: `'Poppins', sans-serif` }}
              >
                News
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
