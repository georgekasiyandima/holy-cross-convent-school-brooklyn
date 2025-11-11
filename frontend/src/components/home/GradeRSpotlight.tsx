import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  Chip,
  Grid,
  Stack,
  Fade,
  Slide
} from '@mui/material';
import {
  ChildCare,
  Star,
  Group,
  Schedule,
  School,
  Favorite,
  AutoAwesome,
  CheckCircle,
  ArrowForward
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const GradeRSpotlightSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 50%, #fff3e0 100%)',
  padding: theme.spacing(10, 0),
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #d32f2f 0%, #ffd700 50%, #d32f2f 100%)',
    zIndex: 1
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #d32f2f 0%, #ffd700 50%, #d32f2f 100%)',
    zIndex: 1
  },
  // Decorative elements
  backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(211, 47, 47, 0.1) 0%, transparent 50%)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
  border: '2px solid #d32f2f',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #d32f2f 0%, #ffd700 100%)',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease'
  },
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: '0 16px 48px rgba(211, 47, 47, 0.25)',
    borderColor: '#ffd700',
    '&::before': {
      transform: 'scaleX(1)'
    },
    '& .feature-icon': {
      transform: 'scale(1.1) rotate(5deg)',
      color: '#ffd700'
    }
  }
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)',
  border: '3px solid #d32f2f',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': {
    fontSize: 40,
    color: '#d32f2f',
    transition: 'all 0.3s ease'
  }
}));

const CTAButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
  color: 'white',
  padding: theme.spacing(2, 5),
  fontSize: '1.1rem',
  fontWeight: 700,
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 25px rgba(211, 47, 47, 0.3)',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 35px rgba(211, 47, 47, 0.4)'
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
}));

const HighlightBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(211, 47, 47, 0.1) 100%)',
  border: '2px dashed #d32f2f',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  textAlign: 'center'
}));

interface GradeRSpotlightProps {
  // Optional props for customization
  variant?: 'default' | 'compact';
}

const GradeRSpotlight: React.FC<GradeRSpotlightProps> = ({ variant = 'default' }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Star />,
      title: 'Holistic Development',
      description: 'Focus on cognitive, emotional, social, and physical development through play-based learning and structured activities designed for young learners.',
      color: '#ffd700'
    },
    {
      icon: <Group />,
      title: 'Small Class Sizes',
      description: 'Individual attention and personalized learning with experienced early childhood educators who understand each child\'s unique needs.',
      color: '#1a237e'
    },
    {
      icon: <Schedule />,
      title: 'Flexible Schedule',
      description: 'Half-day and full-day options available to accommodate different family needs, ensuring your child gets the best start.',
      color: '#d32f2f'
    },
    {
      icon: <Favorite />,
      title: 'Nurturing Environment',
      description: 'A caring, faith-based environment where children feel safe, valued, and excited to learn every single day.',
      color: '#ff9800'
    },
    {
      icon: <AutoAwesome />,
      title: 'Foundation for Success',
      description: 'Designed to prepare learners for success in Grade 1 and beyond, building confidence and foundational skills.',
      color: '#9c27b0'
    },
    {
      icon: <CheckCircle />,
      title: 'CAPS-Aligned Curriculum',
      description: 'Following the national curriculum with innovative teaching methods that make learning fun and engaging for young minds.',
      color: '#4caf50'
    }
  ];

  const displayFeatures = variant === 'compact' ? features.slice(0, 3) : features;

  return (
    <GradeRSpotlightSection>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Slide direction="down" in timeout={800}>
              <Chip
                icon={<ChildCare sx={{ color: 'white !important' }} />}
                label="Special Focus: Grade R Learners"
                sx={{
                  background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                  color: 'white',
                  fontWeight: 700,
                  mb: 3,
                  px: 3,
                  py: 2,
                  fontSize: { xs: '0.9rem', sm: '1.1rem' },
                  boxShadow: '0 4px 15px rgba(211, 47, 47, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              />
            </Slide>

            <Typography
              variant="h2"
              component="h2"
              sx={{
                color: '#d32f2f',
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                lineHeight: 1.1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              We're Actively Seeking Grade R Learners!
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: '#666',
                mb: 4,
                maxWidth: '900px',
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                lineHeight: 1.7,
                fontWeight: 400
              }}
            >
              Join our nurturing early childhood education program designed to provide the perfect foundation 
              for your child's educational journey. Our Grade R program focuses on{' '}
              <Box component="span" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                holistic development
              </Box>{' '}
              in a caring, faith-based environment where every child can thrive.
            </Typography>
          </Box>
        </Fade>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {displayFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Slide direction="up" in timeout={600 + index * 100}>
                <FeatureCard>
                  <IconBox className="feature-icon">
                    <Box sx={{ color: feature.color }}>
                      {feature.icon}
                    </Box>
                  </IconBox>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#d32f2f',
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: '1.2rem', md: '1.4rem' }
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#666',
                      lineHeight: 1.7,
                      fontSize: { xs: '0.95rem', md: '1rem' }
                    }}
                  >
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Slide>
            </Grid>
          ))}
        </Grid>

        {/* Highlight Box */}
        <Fade in timeout={1200}>
          <HighlightBox>
            <Stack spacing={3} alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                <School sx={{ fontSize: 40, color: '#d32f2f' }} />
                <Typography
                  variant="h4"
                  sx={{
                    color: '#d32f2f',
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  Ready to Start Your Child's Educational Journey?
                </Typography>
              </Box>
              
              <Typography
                variant="h6"
                sx={{
                  color: '#666',
                  maxWidth: '700px',
                  mx: 'auto',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.7,
                  fontWeight: 400
                }}
              >
                Apply now and give your child the best start to their educational journey. 
                Our Grade R program is designed to prepare them for success in Grade 1 and beyond, 
                building confidence, skills, and a love for learning.
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                sx={{ mt: 2 }}
              >
                <CTAButton
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/admissions')}
                  startIcon={<School />}
                  endIcon={<ArrowForward />}
                >
                  Apply for Grade R
                </CTAButton>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/contact')}
                  sx={{
                    borderColor: '#d32f2f',
                    borderWidth: 2,
                    color: '#d32f2f',
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: '#b71c1c',
                      backgroundColor: 'rgba(211, 47, 47, 0.05)',
                      transform: 'translateY(-3px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Schedule a Visit
                </Button>
              </Stack>
            </Stack>
          </HighlightBox>
        </Fade>
      </Container>
    </GradeRSpotlightSection>
  );
};

export default GradeRSpotlight;


