import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Psychology,
  Computer,
  Build,
  Science,
  School,
  Code,
  SmartToy,
  Memory,
  Speed,
  Lightbulb,
  TrendingUp,
  Group,
  Timeline,
  EmojiEvents,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';

// Styled components for enhanced visual appeal
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(26, 35, 126, 0.2)',
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
  color: '#1a237e',
  fontWeight: 600,
}));

const Robotics: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <SmartToy sx={{ fontSize: '3rem', color: '#1a237e' }} />,
      title: 'Hands-On Learning',
      description: 'Students build and program robots from scratch, developing critical thinking and problem-solving skills.',
    },
    {
      icon: <Code sx={{ fontSize: '3rem', color: '#ffd700' }} />,
      title: 'Programming Skills',
      description: 'Learn coding languages like Python, Scratch, and Arduino to control robotic systems.',
    },
    {
      icon: <Science sx={{ fontSize: '3rem', color: '#1a237e' }} />,
      title: 'STEM Integration',
      description: 'Combines Science, Technology, Engineering, and Mathematics in practical applications.',
    },
    {
      icon: <Group sx={{ fontSize: '3rem', color: '#ffd700' }} />,
      title: 'Team Collaboration',
      description: 'Work in teams to solve complex challenges and develop leadership skills.',
    },
  ];

  const programAreas = [
    {
      icon: <Build />,
      title: 'Robot Construction',
      description: 'Building robots using LEGO Mindstorms, Arduino, and other platforms',
    },
    {
      icon: <Computer />,
      title: 'Programming',
      description: 'Coding robots to perform tasks and solve problems autonomously',
    },
    {
      icon: <Memory />,
      title: 'Artificial Intelligence',
      description: 'Introduction to AI concepts and machine learning applications',
    },
    {
      icon: <Science />,
      title: 'Sensor Technology',
      description: 'Understanding and implementing various sensors and actuators',
    },
    {
      icon: <Speed />,
      title: 'Competition Prep',
      description: 'Preparing for robotics competitions and challenges',
    },
    {
      icon: <Lightbulb />,
      title: 'Innovation Projects',
      description: 'Designing solutions for real-world problems using robotics',
    },
  ];

  const benefits = [
    'Enhanced problem-solving and critical thinking skills',
    'Improved mathematical and scientific understanding',
    'Development of programming and coding abilities',
    'Increased creativity and innovation mindset',
    'Better teamwork and communication skills',
    'Preparation for future STEM careers',
    'Hands-on experience with cutting-edge technology',
    'Confidence building through project completion',
  ];

  return (
    <>
      <SEO
        title="Robotics Program - Holy Cross Convent School Brooklyn"
        description="Discover our cutting-edge robotics program that combines hands-on learning with STEM education. Students build, program, and innovate with the latest technology."
        keywords="robotics, STEM, programming, technology, innovation, education, Cape Town, Holy Cross"
      />

      <Container maxWidth="xl" sx={{ py: 0 }}>
        {/* Hero Section */}
        <HeroSection>
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, mb: 3 }}
            >
              🤖 Robotics & Innovation Hub
                </Typography>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{ mb: 4, opacity: 0.9, maxWidth: '800px', mx: 'auto' }}
            >
              Empowering the next generation of innovators through hands-on robotics education
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<TrendingUp />}
                label="Newly Launched"
                sx={{ 
                  bgcolor: '#ffd700', 
                  color: '#1a237e', 
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 2,
                  py: 1,
                }}
              />
              <Chip
                icon={<EmojiEvents />}
                label="Competition Ready"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 2,
                  py: 1,
                }}
              />
            </Box>
          </Container>
        </HeroSection>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Return to Home */}
          <ReturnToHome />

          {/* Program Overview */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ 
                color: '#1a237e', 
                fontWeight: 700, 
                mb: 4, 
                textAlign: 'center' 
              }}
            >
              Our Robotics Journey
            </Typography>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                borderRadius: 3,
                mb: 6,
              }}
            >
              <Typography
                variant="h6"
                sx={{ 
                  color: '#1a237e', 
                  fontWeight: 600, 
                  mb: 3,
                  fontSize: '1.3rem'
                }}
              >
                🚀 Launching Innovation at Holy Cross
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  color: '#333', 
                  lineHeight: 1.8, 
                  fontSize: '1.1rem',
                  mb: 3
                }}
              >
                We are thrilled to announce the launch of our comprehensive Robotics Program, 
                designed to prepare our students for the digital future. This cutting-edge initiative 
                combines hands-on learning with advanced technology, fostering creativity, 
                critical thinking, and innovation.
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  color: '#333', 
                  lineHeight: 1.8, 
                  fontSize: '1.1rem'
                }}
              >
                Our robotics program is more than just building robots - it's about empowering 
                students to become problem-solvers, innovators, and future leaders in technology. 
                Through project-based learning and real-world applications, students develop 
                essential 21st-century skills that will serve them throughout their lives.
        </Typography>
            </Paper>
          </Box>

          {/* Key Features */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ 
                color: '#1a237e', 
                fontWeight: 700, 
                mb: 5, 
                textAlign: 'center' 
              }}
            >
              Program Highlights
            </Typography>
            <Grid container spacing={4}>
          {features.map((feature, index) => (
                <Grid key={index} item xs={12} md={6} {...({ item: true } as any)}>
                  <FeatureCard elevation={3}>
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <Box sx={{ mb: 2 }}>
                    {feature.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{ 
                          color: '#1a237e', 
                          fontWeight: 600, 
                          mb: 2 
                        }}
                      >
                      {feature.title}
                    </Typography>
                      <Typography
                        variant="body1"
                        sx={{ 
                          color: '#666', 
                          lineHeight: 1.6,
                          fontSize: '1rem'
                        }}
                      >
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
          </Box>

          {/* Program Areas */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              component="h2"
          sx={{
                color: '#1a237e', 
                fontWeight: 700, 
                mb: 5, 
                textAlign: 'center' 
              }}
            >
              What Students Learn
          </Typography>
          <Grid container spacing={3}>
              {programAreas.map((area, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} {...({ item: true } as any)}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(26, 35, 126, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#1a237e',
                          mr: 2,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {area.icon}
                      </Avatar>
                      <Typography
                        variant="h6"
                        sx={{ 
                          color: '#1a237e', 
                          fontWeight: 600,
                          fontSize: '1.1rem'
                        }}
                      >
                        {area.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ 
                        color: '#666', 
                        lineHeight: 1.5,
                        fontSize: '0.95rem'
                      }}
                    >
                      {area.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Benefits Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ 
                color: '#1a237e', 
                fontWeight: 700, 
                mb: 4, 
                textAlign: 'center' 
              }}
            >
              Student Benefits
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8} {...({ item: true } as any)}>
                <List>
                  {benefits.map((benefit, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: '#ffd700',
                            width: 32,
                            height: 32,
                          }}
                        >
                          <Timeline sx={{ color: '#1a237e', fontSize: '1.2rem' }} />
                  </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={benefit}
                        sx={{
                          '& .MuiTypography-root': {
                            color: '#333',
                            fontSize: '1rem',
                            fontWeight: 500,
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={4} {...({ item: true } as any)}>
                <StatsCard elevation={3}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    100%
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Hands-On Learning
                  </Typography>
                  <Typography variant="body2">
                    Every student gets to build, program, and test their own robots
                  </Typography>
                </StatsCard>
              </Grid>
          </Grid>
          </Box>

        {/* Call to Action */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Paper
              elevation={3}
              sx={{
                p: 6,
                background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                color: 'white',
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{ fontWeight: 700, mb: 3 }}
              >
                Ready to Start Your Robotics Journey?
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.9 }}
              >
                Join our innovative robotics program and become part of the future of technology
              </Typography>
            <Button
                variant="contained"
              size="large"
              sx={{
                  bgcolor: '#ffd700',
                color: '#1a237e',
                  fontWeight: 600,
                px: 4,
                py: 1.5,
                  fontSize: '1.1rem',
                '&:hover': {
                    bgcolor: '#ffed4e',
                },
              }}
            >
                Learn More About Our Programs
            </Button>
            </Paper>
        </Box>
        </Container>
      </Container>
    </>
  );
};

export default Robotics;