import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  GridLegacy as Grid,
  Paper,
  Chip,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  School, 
  Psychology, 
  Computer, 
  Science, 
  Language, 
  Calculate,
  Palette,
  MusicNote,
  SportsSoccer,
  MenuBook,
  TrendingUp
} from '@mui/icons-material';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';

const Academics: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const academicPrograms = [
    {
      title: 'Core Subjects',
      icon: <MenuBook sx={{ fontSize: '2rem', color: '#1976d2' }} />,
      subjects: ['English', 'Mathematics', 'Natural Sciences', 'Social Sciences', 'Life Skills'],
      color: '#e3f2fd'
    },
    {
      title: 'Languages',
      icon: <Language sx={{ fontSize: '2rem', color: '#388e3c' }} />,
      subjects: ['English', 'Afrikaans', 'Xhosa', 'French'],
      color: '#e8f5e8'
    },
    {
      title: 'STEM',
      icon: <Science sx={{ fontSize: '2rem', color: '#d32f2f' }} />,
      subjects: ['Mathematics', 'Natural Sciences', 'Technology', 'Robotics'],
      color: '#ffebee'
    },
    {
      title: 'Creative Arts',
      icon: <Palette sx={{ fontSize: '2rem', color: '#7b1fa2' }} />,
      subjects: ['Visual Arts', 'Music', 'Drama', 'Creative Writing'],
      color: '#f3e5f5'
    }
  ];

  const specialPrograms = [
    {
      title: 'Robotics & Computer Science',
      description: 'Cutting-edge technology education with hands-on robotics programming',
      icon: <Psychology />,
      features: ['Programming Languages', '3D Printing', 'Arduino Projects', 'AI Basics']
    },
    {
      title: 'Enhanced Mathematics',
      description: 'Advanced mathematical concepts and problem-solving strategies',
      icon: <Calculate />,
      features: ['Advanced Algebra', 'Geometry', 'Statistics', 'Problem Solving']
    },
    {
      title: 'Science Laboratory',
      description: 'Hands-on experiments and scientific discovery',
      icon: <Science />,
      features: ['Chemistry Lab', 'Physics Experiments', 'Biology Studies', 'Environmental Science']
    },
    {
      title: 'Language Arts',
      description: 'Comprehensive language development and communication skills',
      icon: <Language />,
      features: ['Reading Comprehension', 'Creative Writing', 'Public Speaking', 'Debate']
    }
  ];

  return (
    <>
      <SEO
        title="Academics - Holy Cross Convent School Brooklyn"
        description="Explore our comprehensive academic programs including core subjects, STEM, languages, and special programs at Holy Cross Convent School Brooklyn."
        keywords="academics, education, curriculum, Holy Cross Convent School, Brooklyn, Cape Town, primary school"
      />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Return to Home */}
        <ReturnToHome />

        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant={isMobile ? 'h3' : 'h2'} 
            component="h1" 
            gutterBottom 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700,
              mb: 2
            }}
          >
            Academic Excellence
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: '800px', mx: 'auto' }}
          >
            Comprehensive education programs designed to nurture curiosity, creativity, and critical thinking
          </Typography>
        </Box>

        {/* Academic Programs Overview */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 6, 
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <School 
              sx={{ 
                fontSize: '2.5rem', 
                color: '#1976d2', 
                mr: 2 
              }} 
            />
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                color: '#1a237e', 
                fontWeight: 700 
              }}
            >
              Academic Programs
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {academicPrograms.map((program, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  backgroundColor: program.color,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      {program.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
                      {program.title}
                    </Typography>
                    <Stack spacing={1} alignItems="center">
                      {program.subjects.map((subject, idx) => (
                        <Chip 
                          key={idx}
                          label={subject} 
                          size="small" 
                          sx={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            color: '#333'
                          }} 
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Special Programs */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700,
              textAlign: 'center',
              mb: 4
            }}
          >
            Special Programs
          </Typography>

          <Grid container spacing={4}>
            {specialPrograms.map((program, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        backgroundColor: '#e3f2fd',
                        borderRadius: '50%',
                        p: 1,
                        mr: 2
                      }}>
                        {program.icon}
                      </Box>
                      <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
                        {program.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {program.description}
                    </Typography>
                    
                    <Typography variant="subtitle2" sx={{ color: '#1a237e', fontWeight: 600, mb: 1 }}>
                      Key Features:
                    </Typography>
                    
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {program.features.map((feature, idx) => (
                        <Chip 
                          key={idx}
                          label={feature} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: '#1976d2',
                            color: '#1976d2'
                          }} 
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            borderRadius: 3
          }}
        >
          <TrendingUp sx={{ fontSize: '3rem', color: '#f57c00', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
            Ready to Join Our Academic Community?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '600px', mx: 'auto' }}>
            Discover how our comprehensive academic programs can help your child reach their full potential.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            Learn More About Admissions
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default Academics;
