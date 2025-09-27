import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ReturnToHomeProps {
  variant?: 'text' | 'button';
  showIcon?: boolean;
  sx?: any;
}

const ReturnToHome: React.FC<ReturnToHomeProps> = ({ 
  variant = 'text', 
  showIcon = false,
  sx = {} 
}) => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/');
  };

  if (variant === 'button') {
    return (
      <Box sx={{ mb: 3, ...sx }}>
        <Button
          onClick={handleReturnHome}
          sx={{
            color: '#1a237e',
            backgroundColor: 'rgba(26, 35, 126, 0.1)',
            borderRadius: '8px',
            padding: '8px 16px',
            border: '2px solid rgba(26, 35, 126, 0.3)',
            transition: 'all 0.3s ease',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            '&:hover': {
              backgroundColor: 'rgba(26, 35, 126, 0.2)',
              transform: 'translateX(-2px)',
              boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)',
            },
            '&:active': {
              transform: 'translateX(0px)',
            }
          }}
        >
          {showIcon && '🏠 '}Return to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3, ...sx }}>
      <Typography
        variant="body1"
        sx={{
          color: '#1a237e',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '1rem',
          textDecoration: 'underline',
          textDecorationColor: 'rgba(26, 35, 126, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: '#0d1421',
            textDecorationColor: '#1a237e',
            transform: 'translateX(-2px)',
          }
        }}
        onClick={handleReturnHome}
      >
        {showIcon && '🏠 '}Return to Home
      </Typography>
    </Box>
  );
};

export default ReturnToHome;
