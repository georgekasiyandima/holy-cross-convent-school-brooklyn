import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Fade
} from '@mui/material';
import {
  Schedule,
  School,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useInView } from 'react-intersection-observer';

const CTASectionContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '20%',
    right: '10%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    zIndex: 0
  }
}));


const PrimaryCTAButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffd700 0%, #ffc107 100%)',
  color: '#1a237e',
  padding: theme.spacing(2, 5),
  fontSize: '1.1rem',
  fontWeight: 700,
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(135deg, #ffc107 0%, #ffd700 100%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 35px rgba(255, 215, 0, 0.4)'
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
}));

const SecondaryCTAButton = styled(Button)(({ theme }) => ({
  borderColor: '#ffffff',
  borderWidth: 2,
  color: '#ffffff',
  padding: theme.spacing(2, 5),
  fontSize: '1.1rem',
  fontWeight: 700,
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  '&:hover': {
    borderColor: '#ffd700',
    color: '#ffd700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    transform: 'translateY(-3px)'
  },
  transition: 'all 0.3s ease'
}));

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });


  return (
    <CTASectionContainer ref={ref}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={inView} timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                color: '#ffffff',
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Ready to Join Our Community?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: '700px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.7,
                mb: 4
              }}
            >
              Take the next step in your child's educational journey. We're here to help you every step of the way.
            </Typography>

            {/* Primary CTAs */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent="center"
              sx={{ mb: 6 }}
            >
              <PrimaryCTAButton
                variant="contained"
                size="large"
                onClick={() => navigate('/admissions')}
                startIcon={<School />}
              >
                Apply Now
              </PrimaryCTAButton>
              
              <SecondaryCTAButton
                variant="outlined"
                size="large"
                onClick={() => navigate('/contact')}
                startIcon={<Schedule />}
              >
                Schedule a Visit
              </SecondaryCTAButton>
            </Stack>
          </Box>
        </Fade>


        {/* Contact Info */}
        <Fade in={inView} timeout={1400}>
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 3,
                fontWeight: 600
              }}
            >
              Get in Touch
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={4}
              justifyContent="center"
              alignItems="center"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: '#ffd700', fontSize: 20 }} />
                <Typography variant="body1" sx={{ color: '#ffffff' }}>
                  +27 21 511 4337
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: '#ffd700', fontSize: 20 }} />
                <Typography variant="body1" sx={{ color: '#ffffff' }}>
                  admin@holycrossbrooklyn.co.za
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ color: '#ffd700', fontSize: 20 }} />
                <Typography variant="body1" sx={{ color: '#ffffff' }}>
                  162 Koeberg Road, Brooklyn
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Fade>
      </Container>
    </CTASectionContainer>
  );
};

export default CTASection;

