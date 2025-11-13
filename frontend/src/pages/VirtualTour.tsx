import React, { useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
} from '@mui/material';
import {
  PlayCircleOutline,
  Videocam,
  School,
  LocationOn,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';

// Image path - using constant for better production handling
const heroImage = '/edu2.jpg';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '70vh',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, rgba(26,35,126,0.95), rgba(211,47,47,0.85))',
  textAlign: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: `url("${heroImage}") center/cover no-repeat`,
    opacity: 0.3,
    zIndex: 0,
  },
  '& > *': { position: 'relative', zIndex: 1 },
}));

const VideoPlaceholder = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '56.25%', // 16:9 aspect ratio
  backgroundColor: '#000',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, rgba(26,35,126,0.3), rgba(211,47,47,0.3))',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  '&:focus-visible': {
    outline: '3px solid #ffd700',
    outlineOffset: '4px',
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const VirtualTour: React.FC = () => {
  const navigate = useNavigate();
  
  // Memoize navigate callback to prevent re-renders
  const handleNavigateToContact = useCallback(() => {
    navigate('/contact');
  }, [navigate]);

  return (
    <>
      <SEO
        title="Virtual Tour - Holy Cross Convent School Brooklyn"
        description="Take a virtual tour of Holy Cross Convent School Brooklyn. Explore our facilities, classrooms, and campus from anywhere in the world."
        keywords="virtual tour, school tour, Holy Cross Convent School, Brooklyn, Cape Town, school facilities"
        image="/edu2.jpg"
        type="website"
      />

      {/* Return to Home - moved outside hero to avoid blocking content */}
      <Box sx={{ 
        position: 'fixed', 
        top: { xs: 80, sm: 100 }, 
        left: 16, 
        zIndex: 1000,
        '& .MuiTypography-root': {
          color: 'white !important',
          textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.5)',
          backgroundColor: 'rgba(26, 35, 126, 0.7)',
          padding: '8px 16px',
          borderRadius: '8px',
          display: 'inline-block',
          backdropFilter: 'blur(4px)',
          '&:hover': {
            transform: 'translateX(-2px)',
            backgroundColor: 'rgba(26, 35, 126, 0.9)',
          },
          transition: 'all 0.3s ease'
        }
      }}>
        <ReturnToHome />
      </Box>

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4 }, py: 8 }}>
          <Videocam sx={{ fontSize: 80, mb: 3, color: '#ffd700' }} aria-hidden="true" />
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              mb: 3,
              color: '#ffd700',
              textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9)',
            }}
          >
            Virtual Tour
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#ffffff',
              fontWeight: 400,
              maxWidth: '800px',
              mx: 'auto',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            Explore Holy Cross Convent School Brooklyn from anywhere in the world
          </Typography>
        </Container>
      </HeroSection>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Video Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#1a237e',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Aerial Campus Tour
          </Typography>
          <VideoPlaceholder
            role="img"
            aria-label="Aerial campus tour video placeholder - coming soon"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: '#fff',
              }}
            >
              <PlayCircleOutline sx={{ fontSize: 100, mb: 2, opacity: 0.8 }} aria-hidden="true" />
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                Aerial Drone Video
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 400, mx: 'auto' }}>
                Coming Soon: Experience our beautiful campus from above with our comprehensive aerial tour video
              </Typography>
            </Box>
          </VideoPlaceholder>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1a237e',
              textAlign: 'center',
              mb: 4,
            }}
          >
            What You'll See
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard>
                <School sx={{ fontSize: 48, color: '#1a237e', mb: 2 }} aria-hidden="true" />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Modern Classrooms
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  State-of-the-art learning spaces designed for collaborative education
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard>
                <Videocam sx={{ fontSize: 48, color: '#d32f2f', mb: 2 }} aria-hidden="true" />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Computer Lab
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our newly completed Computer and Robotics Room
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard>
                <LocationOn sx={{ fontSize: 48, color: '#ffd700', mb: 2 }} aria-hidden="true" />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Campus Grounds
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Beautiful outdoor spaces and recreational facilities
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard>
                <PlayCircleOutline sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} aria-hidden="true" />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Sports Facilities
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Courts, fields, and spaces for physical education
                </Typography>
              </FeatureCard>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(26,35,126,0.08), rgba(255,215,0,0.12))',
            borderRadius: 3,
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: 700, color: '#1a237e', mb: 2 }}>
            Ready to Visit in Person?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            While you wait for our virtual tour video, we'd love to welcome you to our campus for a personal tour.
          </Typography>
          <Button
            type="button"
            variant="contained"
            size="large"
            onClick={handleNavigateToContact}
            sx={{
              bgcolor: '#1a237e',
              color: '#fff',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#0d47a1',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Schedule a Visit
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default VirtualTour;

