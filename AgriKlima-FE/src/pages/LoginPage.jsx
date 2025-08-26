// src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Divider, Link as MuiLink, Grid, InputAdornment } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

// Import Icons and Logo
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from '../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Prevent logged-in users from seeing the login page
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Call the login function and wait for the user object to be returned
      const user = await login(email, password);

      Swal.fire({
        title: 'Login Successful!',
        text: `Welcome back, ${user.firstName}!`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      // --- REDIRECT BASED ON ROLE ---
      if (user && user.isAdmin) {
        navigate('/admin/crops'); // Admin panel
      } else {
        navigate('/dashboard'); // Regular users
      }

    } catch (error) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred. Please try again.";
      Swal.fire('Login Failed', errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Typography sx={{ textAlign: 'center', mt: 5 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* --- Top Navigation --- */}
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
          <MuiLink
            component={RouterLink}
            to="/signup"
            underline="hover"
            sx={{ color: 'var(--dark-text)', fontWeight: 500 }}
          >
            Create An Account
          </MuiLink>
        </Box>
      </Container>

      {/* --- Main Content --- */}
      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 5, fontWeight: 600 }}>
          Log In
        </Typography>
        <Grid container alignItems="center" spacing={4}>
          <Grid item xs={12} md={5}>
            <Box component="form" noValidate autoComplete="off" onSubmit={handleLogin}>
              <TextField
                fullWidth
                required
                label="Email Address"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: 'grey.500' }} />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth
                required
                type="password"
                label="Password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'grey.500' }} />
                    </InputAdornment>
                  )
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: '30px',
                  bgcolor: 'var(--primary-green)',
                  '&:hover': { bgcolor: 'var(--light-green)' }
                }}
              >
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </Button>
            </Box>
          </Grid>

          {/* Divider */}
          <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
            <Divider orientation="vertical" sx={{ height: '150px', display: { xs: 'none', md: 'inline-flex' } }}>
              OR
            </Divider>
            <Divider sx={{ display: { xs: 'block', md: 'none' }, my: 2 }}>OR</Divider>
          </Grid>

          {/* Google Button */}
          <Grid item xs={12} md={5}>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                py: 1.5,
                borderRadius: '30px',
                color: 'var(--dark-text)',
                borderColor: 'grey.400'
              }}
            >
              Continue with Google
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* --- Footer --- */}
      <Box sx={{ padding: '40px 0', textAlign: 'center' }}>
        <Typography variant="body1">
          Don't have an Account?{' '}
          <MuiLink
            component={RouterLink}
            to="/signup"
            underline="always"
            sx={{ fontWeight: 'bold', color: 'var(--dark-text)' }}
          >
            Sign up
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
