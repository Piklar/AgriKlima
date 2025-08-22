import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Divider, Link as MuiLink, Grid, InputAdornment } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

// Import Icons and Logo
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from '../assets/logo.png';
import googleLogo from '../assets/images/google-logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // State for form inputs and loading
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Common styles for input fields and buttons
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '30px',
      backgroundColor: '#f9f9f9'
    }
  };

  const buttonStyles = {
    borderRadius: '30px',
    padding: '12px 0',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: '600'
  };

  // Handle login form submit with real API call
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call the login function from AuthContext with the user's input
      const user = await login(email, password);

      Swal.fire({
        title: 'Login Successful!',
        text: `Welcome back, ${user.firstName}!`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      // Intelligent redirect based on user role
      if (user.isAdmin) {
        navigate('/admin/crops');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.error || "An unexpected error occurred. Please try again.";
      Swal.fire('Login Failed', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header Section */}
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)}
            sx={{ color: 'var(--dark-text)', textTransform: 'none' }}
          >
            Back
          </Button>
          <img src={logo} alt="AgriKlima Logo" style={{ height: '40px' }} />
          <MuiLink href="/signup" underline="hover" sx={{ color: 'var(--dark-text)', fontWeight: 500 }}>
            Create An Account
          </MuiLink>
        </Box>
      </Container>

      {/* 2. Main Login Form Section */}
      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 5, fontWeight: 600 }}>
          Log In
        </Typography>
        <Grid container alignItems="center" spacing={4}>
          {/* Left Side: Email/Password Form */}
          <Grid item xs={12} md={5}>
            <Box component="form" noValidate autoComplete="off" onSubmit={handleLogin}>
              <TextField
                fullWidth
                required
                label="Email Address"
                margin="normal"
                sx={inputStyles}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: 'grey.500' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                required
                type="password"
                label="Password"
                margin="normal"
                sx={inputStyles}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'grey.500' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  ...buttonStyles,
                  mt: 2,
                  backgroundColor: 'var(--primary-green)',
                  '&:hover': {
                    backgroundColor: 'var(--light-green)'
                  }
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Box>
          </Grid>

          {/* Center Divider */}
          <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
            <Divider orientation="vertical" sx={{ height: '150px', display: { xs: 'none', md: 'inline-flex' } }}>
              <Typography sx={{ px: 2, color: 'grey.500' }}>OR</Typography>
            </Divider>
            <Divider sx={{ display: { xs: 'block', md: 'none' }, my: 2 }}>
              <Typography sx={{ color: 'grey.500' }}>OR</Typography>
            </Divider>
          </Grid>

          {/* Right Side: Social Login */}
          <Grid item xs={12} md={5}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<img src={googleLogo} alt="Google" style={{ height: '20px' }} />}
              sx={{
                ...buttonStyles,
                color: 'var(--dark-text)',
                borderColor: 'grey.400',
                justifyContent: 'center',
                '&:hover': {
                  borderColor: 'var(--dark-text)',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Continue with Google
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* 3. Footer Link Section */}
      <Box sx={{ padding: '40px 0', textAlign: 'center' }}>
        <Typography variant="body1">
          Don't have an Account?{' '}
          <MuiLink href="/signup" underline="always" sx={{ fontWeight: 'bold', color: 'var(--dark-text)' }}>
            Sign up
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage; 