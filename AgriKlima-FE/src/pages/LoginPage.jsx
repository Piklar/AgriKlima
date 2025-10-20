import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Link as MuiLink, Grid, InputAdornment, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from '../assets/logo.png';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const fontStyle = {
  fontWeight: 500,
  fontFamily: 'inherit',
  color: 'var(--dark-text)',
  fontSize: '16px'
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  // --- MODIFIED STATE ---
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // --- MODIFIED LOGIN CALL ---
      const user = await login(identifier, password);

      Swal.fire({
        title: 'Login Successful!',
        text: `Welcome back, ${user.firstName}!`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      if (user && user.isAdmin) {
        navigate('/admin/crops');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred. Please try again.";
      Swal.fire('Login Failed', errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Typography sx={{ textAlign: 'center', mt: 5, ...fontStyle }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ color: 'var(--dark-text)', textTransform: 'none', fontWeight: 500, fontFamily: 'inherit', fontSize: '16px' }}
            >
              Back
            </Button>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={logo} alt="AgriKlima Logo" style={{ height: '45px' }} />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <MuiLink
              component={RouterLink}
              to="/signup"
              underline="hover"
              sx={{ color: 'var(--dark-text)', fontWeight: 500, fontFamily: 'inherit', fontSize: '16px' }}
            >
              Create An Account
            </MuiLink>
          </Box>
        </Box>
      </Container>
      
      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 500, fontFamily: 'inherit', color: 'var(--dark-text)', fontSize: '16px' }}>
            Log In
          </Typography>
        </Box>
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleLogin}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: { xs: '100%', md: '480px' }
              }}
            >
              {/* --- MODIFIED INPUT FIELD --- */}
              <TextField
                fullWidth
                required
                label="Email or Mobile Number"
                margin="normal"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleOutlinedIcon sx={{ color: 'grey.500' }} />
                    </InputAdornment>
                  ),
                  style: fontStyle
                }}
                InputLabelProps={{ style: fontStyle }}
              />
              <TextField
                fullWidth
                required
                type={showPassword ? 'text' : 'password'} // ADD THIS
                label="Password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'grey.500' }} />
                    </InputAdornment>
                  ),
                  // ADD THIS END ADORNMENT:
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        aria-label={showPassword ? 'hide password' : 'show password'}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: fontStyle
                }}
                InputLabelProps={{ style: fontStyle }}
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
                  '&:hover': { bgcolor: 'var(--light-green)' },
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  fontSize: '16px'
                }}
              >
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ padding: '40px 0', textAlign: 'center' }}>
        <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'inherit', color: 'var(--dark-text)', fontSize: '16px' }}>
          Don&apos;t have an Account?{' '}
          <MuiLink
            component={RouterLink}
            to="/signup"
            underline="always"
            sx={{ fontWeight: 'bold', color: 'var(--dark-text)', fontFamily: 'inherit', fontSize: '16px' }}
          >
            Sign up
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;