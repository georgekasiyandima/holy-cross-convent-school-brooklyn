import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  Slide,
  Fade
} from '@mui/material';
import {
  Book,
  People,
  School,
  Event,
  Favorite,
  Security,
  Groups,
  AutoAwesome
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useInView } from 'react-intersection-observer';

const SectionContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  padding: theme.spacing(10, 0),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  textAlign: 'center',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: '1px solid #e0e0e0',
  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
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
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 100%)',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease'
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(26, 35, 126, 0.15)',
    borderColor: '#1a237e',
    '&::before': {
      transform: 'scaleX(1)'
    },
    '& .feature-icon': {
      transform: 'scale(1.1) rotate(5deg)',
      color: '#1a237e'
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
  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
  border: '3px solid #1a237e',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': {
    fontSize: 40,
    color: '#1a237e',
    transition: 'all 0.3s ease'
  },
  [theme.breakpoints.down('sm')]: {
    width: 60,
    height: 60,
    '& .MuiSvgIcon-root': {
      fontSize: 30
    }
  }
}));

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Book />,
    title: 'Academic Excellence',
    description: 'Rigorous CAPS-aligned curriculum designed to challenge and inspire learners to reach their full potential with innovative teaching methods.'
  },
  {
    icon: <People />,
    title: 'Community & Belonging',
    description: 'A supportive community that values diversity, inclusion, and mutual respect. One class per grade ensures every child is seen and known.'
  },
  {
    icon: <School />,
    title: 'Faith-Based Education',
    description: 'Rooted in Catholic values while welcoming learners of all faiths and backgrounds. Spiritual growth integrated with academic learning.'
  },
  {
    icon: <Event />,
    title: 'Rich Opportunities',
    description: 'Comprehensive extracurricular activities in sports, arts, robotics, music, and leadership development to nurture well-rounded individuals.'
  },
  {
    icon: <Favorite />,
    title: 'Individual Attention',
    description: 'Small class sizes mean personalized learning experiences. Teachers know each child and can provide targeted support and encouragement.'
  },
  {
    icon: <Security />,
    title: 'Safe & Nurturing',
    description: 'A secure environment where children feel safe to learn, grow, and express themselves. Our values-based approach builds character and confidence.'
  },
  {
    icon: <Groups />,
    title: 'Parent Partnership',
    description: 'Strong communication and collaboration with parents. Regular updates, parent meetings, and open dialogue ensure every child\'s success.'
  },
  {
    icon: <AutoAwesome />,
    title: 'Future-Ready Skills',
    description: 'Technology integration, critical thinking, and problem-solving skills prepare learners for success in a rapidly changing world.'
  }
];

const WhyChooseSection: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <SectionContainer ref={ref}>
      <Container maxWidth="lg">
        <Fade in={inView} timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                color: '#1a237e',
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Why Choose Holy Cross?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#666',
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.7,
                fontWeight: 400
              }}
            >
              Discover what makes Holy Cross Convent School a special place for your child's education.
              We combine tradition with innovation, faith with excellence, and community with individual care.
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Slide direction="up" in={inView} timeout={600 + index * 100}>
                <FeatureCard>
                  <IconBox className="feature-icon">
                    {feature.icon}
                  </IconBox>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: '#1a237e',
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
      </Container>
    </SectionContainer>
  );
};

export default WhyChooseSection;


