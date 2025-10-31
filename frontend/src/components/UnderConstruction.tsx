import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

interface UnderConstructionProps {
  title: string;
  subtitle?: string;
  description?: string;
  estimatedCompletion?: string;
}

const ConstructionCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e3f2fd',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 100%)',
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
  boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
    },
    '50%': {
      transform: 'scale(1.05)',
      boxShadow: '0 12px 32px rgba(255, 215, 0, 0.5)',
    },
    '100%': {
      transform: 'scale(1)',
      boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
    },
  },
}));

const UnderConstruction: React.FC<UnderConstructionProps> = ({
  title,
  subtitle = "This page is currently under construction",
  description = "We're working hard to bring you something amazing. Please check back soon!",
  estimatedCompletion
}) => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e3eafc 100%)',
      py: 8
    }}>
      <Container maxWidth="lg">
        {/* Return to Home Link */}
        <Box sx={{ mb: 4 }}>
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
            Return to Home
          </Typography>
        </Box>

        {/* Main Construction Card */}
        <ConstructionCard>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            {/* Construction Icon */}
            <IconContainer>
              <ConstructionIcon 
                sx={{ 
                  fontSize: 60, 
                  color: '#1a237e',
                  animation: 'rotate 3s linear infinite',
                  '@keyframes rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }} 
              />
            </IconContainer>

            {/* Title */}
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: '#1a237e',
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              {title}
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h5"
              component="h2"
              sx={{
                color: '#666',
                fontWeight: 500,
                mb: 3,
                fontSize: { xs: '1.2rem', sm: '1.4rem' }
              }}
            >
              {subtitle}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                lineHeight: 1.7,
                mb: 4,
                fontSize: '1.1rem',
                maxWidth: '500px',
                mx: 'auto'
              }}
            >
              {description}
            </Typography>

            {/* Estimated Completion */}
            {estimatedCompletion && (
              <Box sx={{ mb: 4 }}>
                <Chip
                  icon={<ScheduleIcon />}
                  label={`Expected: ${estimatedCompletion}`}
                  sx={{
                    backgroundColor: 'rgba(26, 35, 126, 0.1)',
                    color: '#1a237e',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    py: 2,
                    '& .MuiChip-icon': {
                      color: '#1a237e',
                    }
                  }}
                />
              </Box>
            )}

            {/* Return to Home Link */}
            <Typography
              variant="body1"
              sx={{
                color: '#1a237e',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1.1rem',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(26, 35, 126, 0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                '&:hover': {
                  color: '#0d1421',
                  textDecorationColor: '#1a237e',
                  transform: 'translateX(-2px)',
                }
              }}
              onClick={handleReturnHome}
            >
              Return to Home
            </Typography>
          </CardContent>
        </ConstructionCard>

        {/* Additional Info */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: '#999',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            We appreciate your patience as we work to improve your experience. 
            For immediate assistance, please contact us or visit our main pages.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default UnderConstruction;
