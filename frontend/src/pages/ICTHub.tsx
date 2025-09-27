import React, { useState } from 'react';
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
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  Computer,
  Wifi,
  Security,
  Storage,
  Monitor,
  Headphones,
  Print,
  Code,
  NetworkCheck,
  Build,
  Science,
  People,
  TrendingUp,
  Close,
  Videocam,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';

// Styled components
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

const ImageCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
}));

const ICTHub: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const labImages = [
    'COMPUTERLAB.jpg',
    'COMPUTERLAB01.jpg',
    'COMPUTERLAB02.jpg',
    'COMPUTERLAB03.jpg',
    'COMPUTERLAB04.jpg',
    'COMPUTERLAB05.jpg',
    'COMPUTERLAB06.jpg',
    'COMPUTERLAB07.jpg',
    'COMPUTERLAB08.jpg',
  ];

  const features = [
    {
      icon: <Computer sx={{ fontSize: '3rem', color: '#1a237e' }} />,
      title: 'Modern Workstations',
      description: 'High-performance computers equipped with the latest software for educational excellence.',
    },
    {
      icon: <Wifi sx={{ fontSize: '3rem', color: '#ffd700' }} />,
      title: 'High-Speed Internet',
      description: 'Reliable, fast internet connection supporting online learning and research.',
    },
    {
      icon: <Security sx={{ fontSize: '3rem', color: '#1a237e' }} />,
      title: 'Secure Environment',
      description: 'Protected network with content filtering and cybersecurity measures.',
    },
    {
      icon: <People sx={{ fontSize: '3rem', color: '#ffd700' }} />,
      title: 'Collaborative Learning',
      description: 'Interactive spaces designed for group projects and peer learning.',
    },
  ];

  const facilities = [
    {
      icon: <Monitor />,
      title: 'Computer Workstations',
      description: '40+ modern desktop computers with dual monitors',
      count: '40+',
    },
    {
      icon: <Print />,
      title: 'Printing Facilities',
      description: 'High-quality color and black & white printers',
      count: '8',
    },
    {
      icon: <Wifi />,
      title: 'Wi-Fi Coverage',
      description: 'Full wireless internet coverage throughout the lab',
      count: '100%',
    },
    {
      icon: <Videocam />,
      title: 'Interactive Displays',
      description: 'Smart boards and projectors for presentations',
      count: '6',
    },
    {
      icon: <Headphones />,
      title: 'Audio Equipment',
      description: 'Professional headphones and microphones',
      count: '40+',
    },
    {
      icon: <Storage />,
      title: 'Cloud Storage',
      description: 'Secure cloud storage for student projects',
      count: 'Unlimited',
    },
  ];

  const programs = [
    {
      icon: <Code />,
      title: 'Programming & Coding',
      description: 'Learn various programming languages including Python, JavaScript, and Scratch',
    },
    {
      icon: <Computer />,
      title: 'Computer Literacy',
      description: 'Essential computer skills for academic and professional success',
    },
    {
      icon: <Science />,
      title: 'Digital Research',
      description: 'Online research skills and information literacy',
    },
    {
      icon: <Build />,
      title: 'Project Development',
      description: 'Create digital projects, presentations, and portfolios',
    },
  ];

  const handleImageClick = (imageName: string) => {
    setSelectedImage(imageName);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <SEO
        title="ICT Hub - Holy Cross Convent School Brooklyn"
        description="Explore our state-of-the-art ICT Hub featuring a modern computer lab with cutting-edge technology and comprehensive digital learning programs."
        keywords="ICT, computer lab, technology, digital learning, programming, Cape Town, Holy Cross"
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
              💻 ICT Hub & Computer Lab
            </Typography>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{ mb: 4, opacity: 0.9, maxWidth: '800px', mx: 'auto' }}
            >
              State-of-the-art technology center empowering digital learning and innovation
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<TrendingUp />}
                label="Fully Equipped"
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
                icon={<NetworkCheck />}
                label="High-Speed Internet"
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

          {/* Overview */}
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
              Our Digital Learning Environment
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
                🏫 Modern Technology for Modern Learning
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
                Our ICT Hub represents the pinnacle of educational technology, providing students 
                with access to cutting-edge computing resources and digital learning tools. 
                This comprehensive facility supports all aspects of digital literacy and 
                technological innovation.
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  color: '#333', 
                  lineHeight: 1.8, 
                  fontSize: '1.1rem'
                }}
              >
                From basic computer skills to advanced programming and digital project development, 
                our ICT Hub offers an environment where students can explore, create, and innovate 
                using the latest technology. The facility is designed to support collaborative 
                learning and individual exploration.
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
              Hub Features
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

          {/* Facilities */}
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
              Lab Facilities
            </Typography>
            <Grid container spacing={3}>
              {facilities.map((facility, index) => (
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
                        {facility.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ 
                            color: '#1a237e', 
                            fontWeight: 600,
                            fontSize: '1.1rem'
                          }}
                        >
                          {facility.title}
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ 
                            color: '#ffd700', 
                            fontWeight: 700,
                            fontSize: '1.5rem'
                          }}
                        >
                          {facility.count}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ 
                        color: '#666', 
                        lineHeight: 1.5,
                        fontSize: '0.95rem'
                      }}
                    >
                      {facility.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Computer Lab Gallery */}
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
              Computer Lab Gallery
            </Typography>
            <Grid container spacing={3}>
              {labImages.map((imageName, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} {...({ item: true } as any)}>
                  <ImageCard
                    elevation={3}
                    onClick={() => handleImageClick(imageName)}
                  >
                    <Box
                      component="img"
                      src={`/${imageName}`}
                      alt={`Computer Lab ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ 
                          color: '#1a237e', 
                          fontWeight: 600,
                          textAlign: 'center'
                        }}
                      >
                        Computer Lab View {index + 1}
                      </Typography>
                    </CardContent>
                  </ImageCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Programs */}
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
              Digital Learning Programs
            </Typography>
            <Grid container spacing={3}>
              {programs.map((program, index) => (
                <Grid key={index} item xs={12} md={6} {...({ item: true } as any)}>
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
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#ffd700',
                          mr: 2,
                          width: 50,
                          height: 50,
                        }}
                      >
                        {program.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ 
                            color: '#1a237e', 
                            fontWeight: 600,
                            fontSize: '1.2rem',
                            mb: 1
                          }}
                        >
                          {program.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ 
                            color: '#666', 
                            lineHeight: 1.5,
                            fontSize: '1rem'
                          }}
                        >
                          {program.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
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
                Experience Our ICT Hub
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.9 }}
              >
                Book a visit to see our state-of-the-art computer lab in action
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
                Schedule a Lab Visit
              </Button>
            </Paper>
          </Box>
        </Container>
      </Container>

      {/* Image Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <Close />
          </IconButton>
          {selectedImage && (
            <Box
              component="img"
              src={`/${selectedImage}`}
              alt="Computer Lab"
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ICTHub;
