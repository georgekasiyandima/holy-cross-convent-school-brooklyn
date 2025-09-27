import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  GridLegacy as Grid,
  Chip,
  Stack,
  Button,
  Paper,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Science,
  Computer,
  Code,
  Build,
  School,
  TrendingUp,
  EmojiPeople,
  Star,
  Launch,
  CalendarToday,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';

// Styled components
const HeroCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)',
  color: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  border: '1px solid rgba(26, 35, 126, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(26, 35, 126, 0.15)',
    borderColor: 'rgba(26, 35, 126, 0.2)',
  },
}));

const LaunchChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ff6b35 0%, #ffd700 100%)',
  color: 'white',
  fontWeight: 700,
  fontSize: '0.9rem',
  height: '32px',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' },
  },
}));

const Robotics: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Computer sx={{ fontSize: 40, color: '#1a237e' }} />,
      title: 'Computer Lab',
      description: 'State-of-the-art computer laboratory with the latest technology for hands-on learning experiences.',
      features: ['25 Workstations', 'High-Speed Internet', 'Interactive Whiteboards'],
    },
    {
      icon: <Build sx={{ fontSize: 40, color: '#ff6b35' }} />,
      title: 'Robotics Kit',
      description: 'Advanced robotics kits and components for building and programming robots from scratch.',
      features: ['LEGO Mindstorms', 'Arduino Boards', '3D Printing'],
    },
    {
      icon: <Code sx={{ fontSize: 40, color: '#2e7d32' }} />,
      title: 'Programming',
      description: 'Learn coding languages and computational thinking through fun, interactive projects.',
      features: ['Scratch', 'Python', 'Block Programming'],
    },
    {
      icon: <EmojiPeople sx={{ fontSize: 40, color: '#d32f2f' }} />,
      title: 'Team Projects',
      description: 'Collaborative learning environment where students work together on exciting challenges.',
      features: ['Group Competitions', 'Peer Learning', 'Mentorship'],
    },
  ];

  const benefits = [
    {
      title: 'Critical Thinking',
      description: 'Develop problem-solving skills through hands-on robotics challenges.',
      icon: <Science sx={{ color: '#1a237e' }} />,
    },
    {
      title: 'STEM Education',
      description: 'Integrate Science, Technology, Engineering, and Mathematics in practical applications.',
      icon: <School sx={{ color: '#ff6b35' }} />,
    },
    {
      title: 'Future Ready',
      description: 'Prepare students for the digital age with essential 21st-century skills.',
      icon: <TrendingUp sx={{ color: '#2e7d32' }} />,
    },
    {
      title: 'Creativity',
      description: 'Foster innovation and creative thinking through open-ended projects.',
      icon: <Star sx={{ color: '#d32f2f' }} />,
    },
  ];

  return (
    <>
      <SEO
        title="Robotics & Computer Room - Holy Cross Convent School"
        description="Explore our state-of-the-art Robotics and Computer Room launching September 25th. Hands-on STEM education with cutting-edge technology."
        keywords="robotics, computer lab, STEM education, programming, technology, Holy Cross Convent School"
      />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <ReturnToHome />
        
        {/* Hero Section */}
        <HeroCard sx={{ mb: 6 }}>
          <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  mr: 2,
                  width: 60,
                  height: 60,
                }}
              >
                <Science sx={{ fontSize: 30 }} />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  Robotics & Computer Room
                </Typography>
                <LaunchChip
                  icon={<Launch />}
                  label="Launching September 25th"
                  sx={{ mb: 2 }}
                />
              </Box>
            </Box>
            
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, maxWidth: '80%' }}>
              Step into the future of education with our cutting-edge Robotics and Computer Room. 
              Students will explore the exciting world of technology, programming, and engineering 
              through hands-on learning experiences.
            </Typography>
            
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                icon={<CalendarToday />}
                label="Opening: September 25, 2025"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              />
              <Chip
                icon={<EmojiPeople />}
                label="Ages 6-13"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              />
              <Chip
                icon={<School />}
                label="Grade 1-7"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              />
            </Stack>
          </CardContent>
        </HeroCard>

        {/* Features Grid */}
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
          What We Offer
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <FeatureCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {feature.icon}
                    <Typography variant="h5" sx={{ ml: 2, color: '#1a237e', fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
                    {feature.description}
                  </Typography>
                  
                  <Stack spacing={1}>
                    {feature.features.map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ fontSize: 16, color: '#ffd700', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#1a237e', fontWeight: 500 }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>

        {/* Benefits Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
            border: '1px solid rgba(26, 35, 126, 0.1)',
          }}
        >
          <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
            Learning Benefits
          </Typography>
          
          <Grid container spacing={3}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(26, 35, 126, 0.1)',
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {benefit.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 1 }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555' }}>
                    {benefit.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 3 }}>
            Ready to Join the Future of Learning?
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Contact us to learn more about our Robotics and Computer Room program. 
            Limited spots available for the launch!
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#1a237e',
                borderRadius: '25px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#0d47a1',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Learn More
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: '#1a237e',
                color: '#1a237e',
                borderRadius: '25px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#0d47a1',
                  bgcolor: 'rgba(26, 35, 126, 0.1)',
                },
              }}
            >
              Contact Us
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default Robotics;
