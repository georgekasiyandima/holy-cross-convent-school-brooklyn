import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Avatar,
  InputAdornment,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, School } from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL_WITH_PREFIX } from '../services/apiConfig';

interface AdminLoginProps {
  onLogin: (token: string, user: any) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL_WITH_PREFIX}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        
        // Set default axios authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        onLogin(token, user);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      
      // Show detailed error message
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Login failed. Please try again.';
      
      setError(errorMessage);
      
      // If no admin user exists, show setup instructions
      if (error.response?.data?.needsSetup) {
        setError(
          'No admin user found. Please create an admin user first. ' +
          'Contact your system administrator or use the /api/auth/setup endpoint.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(211, 47, 47, 0.1) 0%, transparent 50%)',
          zIndex: 0
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            component="img"
            src="/L1.png"
            alt="Holy Cross School Logo"
            sx={{
              width: { xs: 80, sm: 100 },
              height: 'auto',
              mx: 'auto',
              mb: 2,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }}
          />
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              color: '#ffd700', 
              fontWeight: 700,
              mb: 1,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Admin Portal
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Holy Cross Convent School Brooklyn
          </Typography>
        </Box>

        <Card 
          elevation={24} 
          sx={{ 
            width: '100%',
            maxWidth: 450,
            mx: 'auto',
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
              py: 2,
              px: 3,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" sx={{ color: '#ffd700', fontWeight: 600 }}>
              Sign In to Continue
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    alignItems: 'center'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                sx={{ mb: 2.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#1a237e' }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#1a237e' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: '#6b7280' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || !formData.email || !formData.password}
                sx={{
                  bgcolor: '#1a237e',
                  color: '#fff',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#0d47a1',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(26, 35, 126, 0.3)'
                  },
                  '&:disabled': {
                    bgcolor: '#9e9e9e'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <Divider sx={{ my: 3 }} />

            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: '#f8f9fa', 
                borderRadius: 2,
                border: '1px solid #e9ecef'
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#6b7280', 
                  display: 'block', 
                  textAlign: 'center',
                  fontWeight: 600,
                  mb: 1
                }}
              >
                Need Help?
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#6b7280', 
                  display: 'block', 
                  textAlign: 'center',
                  fontSize: '0.75rem'
                }}
              >
                Contact your system administrator for access credentials
              </Typography>
            </Paper>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="text"
            onClick={() => window.location.href = '/'}
            sx={{
              color: 'rgba(255,255,255,0.9)',
              textTransform: 'none',
              '&:hover': {
                color: '#ffd700',
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            ← Back to Website
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminLogin;
