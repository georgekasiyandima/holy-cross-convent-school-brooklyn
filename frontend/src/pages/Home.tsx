import React, { useState, useEffect, useRef, useMemo, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Fade,
} from '@mui/material';
import { 
  Facebook,
  AutoAwesome,
  Groups,
  Security,
  Favorite,
  History,
  Visibility,
  Church,
  Schedule,
  ExpandMore
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { videoManager } from '../utils/videoManager';
import SEO from '../components/SEO';
import SchoolHighlights from '../components/SchoolHighlights';
import FloatingSocialIcons from '../components/FloatingSocialIcons';
import BackToTop from '../components/BackToTop';
import PillarCarousel from '../components/PillarCarousel';
import HomeAnnouncements from '../components/HomeAnnouncements';
import GradeRSpotlight from '../components/home/GradeRSpotlight';
import QuickStatsBanner from '../components/home/QuickStatsBanner';
import WhyChooseSection from '../components/home/WhyChooseSection';
import CTASection from '../components/home/CTASection';
import ErrorBoundary from '../components/ErrorBoundary';
import { holyCrossBrand } from '../theme/branding';
import { getBackgroundImageUrl, getStaticFileUrl } from '../utils/staticFiles';

const VideoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9', // Modern CSS aspect-ratio instead of padding-bottom hack
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  boxShadow: theme.shadows[4],
  '& iframe': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none'
  }
}));

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  textAlign: 'center',
  paddingTop: '80px', // Add padding to account for fixed header
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.4) 0%, rgba(57, 73, 171, 0.4) 50%, rgba(92, 107, 192, 0.4) 100%)',
    zIndex: 1 // Overlay layer
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 4s ease-in-out infinite',
    zIndex: 1 // Decorative element layer
  },
  '@keyframes pulse': {
    '0%, 100%': { transform: 'scale(1)', opacity: 0.3 },
    '50%': { transform: 'scale(1.1)', opacity: 0.6 }
  },
  '@keyframes textPulse': {
    '0%': {
      transform: 'scale(1)',
      textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
    },
    '100%': {
      transform: 'scale(1.02)',
      textShadow: '3px 3px 6px rgba(0,0,0,0.8)'
    }
  }
}));

const HeroBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  transition: 'opacity 1s ease-in-out',
  zIndex: 0,
  filter: 'none' // Ensure no blur is applied
});

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2, // Content layer above overlay and decorative elements
  padding: theme.spacing(8, 0),
  maxWidth: '1200px',
  margin: '0 auto',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3)
}));

const HeritageSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  padding: theme.spacing(8, 0),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${holyCrossBrand.signatureBlue} 0%, ${holyCrossBrand.signatureGold} 50%, ${holyCrossBrand.signatureBlue} 100%)`
  }
}));

const TimelineCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  border: '1px solid #e3f2fd',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    marginLeft: 0, // Remove left margin on mobile
  },
  [theme.breakpoints.up('md')]: {
    marginLeft: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '12px',
    height: '12px',
    background: holyCrossBrand.signatureGold,
    borderRadius: '50%',
    border: `3px solid ${holyCrossBrand.signatureBlue}`,
    zIndex: 1,
    [theme.breakpoints.down('md')]: {
      left: '50%',
      top: '-12px',
      transform: 'translateX(-50%)',
    },
    [theme.breakpoints.up('md')]: {
      left: '-20px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '2px',
    background: `linear-gradient(180deg, ${holyCrossBrand.signatureBlue} 0%, ${holyCrossBrand.signatureGold} 100%)`,
    display: 'block',
    [theme.breakpoints.down('md')]: {
      left: '50%',
      top: 0,
      height: '12px',
      transform: 'translateX(-50%)',
    },
    [theme.breakpoints.up('md')]: {
      left: '-14px',
      top: '50%',
      bottom: '50%',
      height: 'auto',
    },
  },
  '&:first-of-type::after': {
    [theme.breakpoints.down('md')]: {
      top: 0,
      height: '12px',
    },
    [theme.breakpoints.up('md')]: {
      top: '50%',
      bottom: '50%',
      height: 'auto',
    },
  },
  '&:last-of-type::after': {
    [theme.breakpoints.down('md')]: {
      top: 0,
      height: '12px',
    },
    [theme.breakpoints.up('md')]: {
      bottom: '50%',
      top: '50%',
      height: 'auto',
    },
  },
  '&:not(:first-of-type):not(:last-of-type)::after': {
    [theme.breakpoints.down('md')]: {
      top: 0,
      bottom: 'auto',
      height: '12px',
    },
    [theme.breakpoints.up('md')]: {
      top: 0,
      bottom: 0,
      height: 'auto',
    },
  },
}));



// Hero images - including Robotics showcase
// Using getStaticFileUrl for consistent path handling and URL encoding
const heroImages = [
  {
    src: getStaticFileUrl('HCCS25.jpeg'),
    title: 'Welcome to Holy Cross',
    description: 'Where faith, learning, and community unite'
  },
  {
    src: getStaticFileUrl('ROBTX1.jpg'),
    title: 'Robotics Excellence',
    description: 'Innovation, creativity, and future-ready learning'
  },
  {
    src: getStaticFileUrl('SCIENCEEXPO24.jpg'),
    title: 'Excellence in Education',
    description: 'Nurturing minds and hearts for tomorrow'
  },
  {
    src: getStaticFileUrl('sports1.jpg'),
    title: 'Holistic Development',
    description: 'Academics, sports, arts, and service'
  }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [animateStats, setAnimateStats] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [, startTransition] = useTransition(); // Use transition for smooth image changes

  // Get learner videos
  const learnerVideos = videoManager.getVideosByCategory('students');

  // Hero image carousel effect - using ref for proper cleanup and transition for smooth fade
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      startTransition(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % heroImages.length
        );
      });
    }, 5000); // Change image every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [startTransition]);

  // Preload first hero image for better LCP
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = heroImages[0].src;
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleScheduleVisit = () => {
    navigate('/contact');
  };

  const handleVirtualTour = () => {
    navigate('/virtual-tour');
  };

  // Removed unused handleDownloadProspectus function

  // Trigger stats animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Heritage timeline data - memoized for performance
  const heritageTimeline = useMemo(() => [
    { year: '1959', title: 'Foundation', description: 'Holy Cross Convent School established in Brooklyn' },
    { year: '1980s', title: 'Expansion', description: 'New facilities and programs added' },
    { year: '2000s', title: 'Modernization', description: 'Digital learning and technology integration' },
    { year: '2025', title: 'Today', description: 'Continuing legacy of excellence and innovation' }
  ], []);


  return (
    <>
      <SEO
        title="Holy Cross Convent School - Brooklyn, Cape Town"
        description="Holy Cross Convent School is a prestigious Catholic school in Brooklyn, Cape Town, offering quality education, character development, and spiritual growth."
      />
      {/* Enhanced Hero Section with Dynamic Images */}
      <HeroSection>
        {/* Dynamic Background Images */}
        {heroImages.map((image, index) => (
          <HeroBackground
            key={index}
            sx={{
              backgroundImage: `url('${image.src}')`,
              opacity: index === currentImageIndex ? 1 : 0,
              zIndex: index === currentImageIndex ? 0 : -1
            }}
            role="img"
            aria-label={`${image.title}: ${image.description}`}
          />
        ))}
        
        <Container maxWidth="lg">
          <HeroContent>
          <Fade in timeout={1000}>
            <Box>
                {/* Image Story Indicator */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
                  {heroImages.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: index === currentImageIndex ? holyCrossBrand.signatureGold : 'rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Box>

                {/* Current Image Story */}
                <Fade in key={currentImageIndex} timeout={800}>
                  <Box sx={{ mb: 4 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 1,
                        color: '#ffffff',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                        fontSize: 'clamp(1.5rem, 3vw, 2rem)'
                      }}
                    >
                      {heroImages[currentImageIndex].title}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#ffffff',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
                        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                        fontWeight: 500
                      }}
                    >
                      {heroImages[currentImageIndex].description}
                    </Typography>
                  </Box>
                </Fade>
              {/* Catholic Heritage Badge */}
              <Chip
                icon={<Church />}
                label="Catholic Education Since 1959"
                sx={{
                  backgroundColor: 'rgba(255, 215, 0, 0.9)',
                  color: holyCrossBrand.signatureBlue,
                  fontWeight: 600,
                  mb: 3,
                  px: 2,
                  py: 1
                }}
              />
              
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 900,
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  textShadow: holyCrossBrand.textShadowUltra,
                  mb: 2,
                  color: holyCrossBrand.signatureGold,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  animation: 'fadeInUp 1.5s ease-out forwards',
                  '@keyframes fadeInUp': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(30px)'
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  }
                }}
              >
                Holy Cross Convent School
              </Typography>
              
              {/* School Mantra - "Small School with a Big Heart" */}
              <Box sx={{ mb: 4 }}>
              <Typography 
                  variant="h2" 
                component="h2" 
                sx={{ 
                    fontWeight: 700,
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontFamily: '"Kalam", cursive',
                    color: holyCrossBrand.signatureRed,
                    textShadow: holyCrossBrand.textShadowUltra,
                    mb: 2,
                    animation: 'textPulse 2s ease-in-out infinite alternate'
                  }}
                >
                  "Small School with a Big Heart"
                </Typography>
                
                <Typography 
                  variant="h4" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                    fontFamily: '"Inter", sans-serif',
                    color: 'white',
                    textShadow: holyCrossBrand.textShadowHeavy,
                    maxWidth: '800px',
                    margin: '0 auto',
                    lineHeight: 1.3
                }}
              >
                Where Catholic Heritage Meets Progressive Education
              </Typography>
              </Box>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 5,
                  maxWidth: '700px',
                  mx: 'auto',
                  lineHeight: 1.8,
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  color: 'white',
                  fontWeight: 500,
                  textShadow: holyCrossBrand.textShadowHeavy
                }}
              >
                For over 65 years, we've been nurturing young minds and hearts in Brooklyn, 
                Cape Town. Our commitment to academic excellence, spiritual growth, and 
                character development creates leaders for tomorrow's world.
              </Typography>
              
              {/* Primary CTAs */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                justifyContent="center"
                sx={{ mb: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleScheduleVisit}
                  startIcon={<Schedule />}
                  aria-label="Schedule a visit to Holy Cross Convent School"
                  sx={{
                    background: holyCrossBrand.primaryGradient,
                    color: '#ffffff',
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: holyCrossBrand.buttonStyles.primary.hoverBoxShadow
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Schedule a Visit
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleVirtualTour}
                  startIcon={<Visibility />}
                  aria-label="Take a virtual tour of Holy Cross Convent School"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    borderWidth: 2,
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: holyCrossBrand.signatureGold,
                      color: holyCrossBrand.signatureGold,
                      backgroundColor: holyCrossBrand.wisdomGold,
                      transform: 'translateY(-3px)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Virtual Tour
                </Button>
              </Stack>
              
              {/* Scroll Indicator */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
                  Scroll to explore
                    </Typography>
                <Box sx={{ 
                  mt: 1,
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(8px)' }
                  },
                  animation: 'bounce 2s ease-in-out infinite'
                }}>
                  <ExpandMore sx={{ color: 'white', opacity: 0.8, fontSize: 32 }} />
                  </Box>
              </Box>
            </Box>
          </Fade>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* Quick Stats Banner */}
      <QuickStatsBanner animate={animateStats} />

      {/* Latest Announcements & Events Section */}
      <HomeAnnouncements announcementsLimit={3} eventsLimit={3} />

      {/* Grade R Spotlight - Prominent Section */}
      <GradeRSpotlight />

      {/* Five Pillars of Excellence Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              icon={<AutoAwesome />}
              label="Five Pillars of Excellence"
              variant="outlined"
              sx={{
                borderColor: holyCrossBrand.signatureBlue,
                color: holyCrossBrand.signatureBlue,
                backgroundColor: 'transparent',
                fontWeight: 600,
                mb: 3,
                px: 2,
                py: 3,
                fontSize: { xs: '0.875rem', md: '1rem' }
              }}
            />
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                color: holyCrossBrand.signatureBlue, 
                fontWeight: 800, 
                mb: 2,
                fontSize: 'clamp(2rem, 5vw, 3rem)'
              }}
            >
              Our Pillars of Excellence
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666', 
                maxWidth: '700px', 
                mx: 'auto',
                fontWeight: 400
              }}
            >
              Discover the five foundational pillars that shape every learner's journey at Holy Cross
            </Typography>
          </Box>
          
          <PillarCarousel />
        </Container>
      </Box>

      {/* Why Choose Holy Cross Section - Merged Features */}
      <WhyChooseSection />

      {/* School Highlights Section */}
      <SchoolHighlights />

      {/* Learner Showcase Section - Single Featured Video */}
      {learnerVideos.length > 0 && (
        <ErrorBoundary>
          <Box sx={{ py: 8, background: 'linear-gradient(135deg, #fffde7 0%, #e3eafc 100%)' }}>
            <Container maxWidth="lg">
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" component="h2" gutterBottom sx={{ color: holyCrossBrand.signatureBlue, fontWeight: 700 }}>
                  Learner Achievements
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  Watch our learners showcase their talents and achievements
                </Typography>
              </Box>

              {/* Featured Video - Single Video Only */}
              {/* Note: videoManager returns trusted Facebook embed codes, but sanitization recommended for production */}
              {learnerVideos.length > 0 && learnerVideos[0] && (
                <Card sx={{ maxWidth: '900px', mx: 'auto', boxShadow: 3, background: 'linear-gradient(135deg, #e3eafc 0%, #fffde7 100%)' }}>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: holyCrossBrand.signatureBlue, fontWeight: 600, mb: 2, textAlign: 'center' }}>
                      {learnerVideos[0].title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', mb: 3, textAlign: 'center' }}>
                      {learnerVideos[0].description}
                    </Typography>
                    
                    <VideoContainer>
                      {/* videoManager returns trusted Facebook embed codes - consider adding DOMPurify.sanitize() for production */}
                      <div dangerouslySetInnerHTML={{ __html: learnerVideos[0].embedCode }} />
                    </VideoContainer>
                    
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Facebook />}
                        href={learnerVideos[0].facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderColor: holyCrossBrand.signatureBlue,
                          color: holyCrossBrand.signatureBlue,
                          '&:hover': {
                            borderColor: holyCrossBrand.signatureGold,
                            backgroundColor: '#fffde7'
                          }
                        }}
                      >
                        View on Facebook
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Container>
          </Box>
        </ErrorBoundary>
      )}

      {/* Heritage Section - Condensed */}
      <HeritageSection>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              icon={<History />}
              label="Our Heritage"
              sx={{
                backgroundColor: holyCrossBrand.signatureBlue,
                color: 'white',
                fontWeight: 600,
                mb: 3,
                px: 2,
                py: 1
              }}
            />
            <Typography variant="h3" component="h2" sx={{ color: holyCrossBrand.signatureBlue, fontWeight: 700, mb: 2 }}>
              A Legacy of Excellence Since 1959
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', maxWidth: '700px', mx: 'auto', lineHeight: 1.7 }}>
              From our founding to today, we've maintained our commitment to Catholic values 
              while embracing educational innovation. Our rich history shapes our future.
            </Typography>
          </Box>

          {/* Then & Now: Simple Side-by-Side Comparison */}
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h4" 
              component="h3" 
              sx={{ 
                color: holyCrossBrand.signatureBlue, 
                fontWeight: 700, 
                mb: 3, 
                textAlign: 'center' 
              }}
            >
              Then & Now: Our Journey
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666', 
                mb: 4, 
                textAlign: 'center',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              From our founding to today, we've grown while staying true to our mission
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {/* Then - Early Years */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    border: `2px solid ${holyCrossBrand.signatureBlue}`,
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(26, 35, 126, 0.2)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: 300,
                      backgroundImage: getBackgroundImageUrl('Philomena.jpg'),
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      role: 'img',
                      'aria-label': 'Holy Cross Convent School foundation photo from 1959',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.7) 0%, rgba(26, 35, 126, 0.3) 100%)',
                      }
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#1a237e', 
                        fontWeight: 700, 
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      1959 - Our Foundation
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', lineHeight: 1.6 }}>
                      Established with a vision to provide quality Catholic education 
                      in Brooklyn, Cape Town. Our founding principles of faith, 
                      excellence, and community service remain our cornerstone today.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Now - Today */}
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                    border: `2px solid ${holyCrossBrand.signatureGold}`,
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 40px ${holyCrossBrand.wisdomGold.replace('0.15', '0.3')}`,
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: 300,
                      backgroundImage: getBackgroundImageUrl('HCTEACHERS 34.jpg'),
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      role: 'img',
                      'aria-label': 'Holy Cross Convent School teachers and staff in 2025',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.7) 0%, rgba(255, 215, 0, 0.3) 100%)',
                      }
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#1a237e', 
                        fontWeight: 700, 
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      2025 - Today's Excellence
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', lineHeight: 1.6 }}>
                      A modern, progressive Catholic school that embraces technology 
                      while maintaining our rich traditions. We continue to nurture 
                      young minds and hearts with the same dedication and love.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: holyCrossBrand.signatureBlue, fontWeight: 600, mb: 2 }}>
                Our Unchanging Commitment
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', maxWidth: '800px', mx: 'auto' }}>
                "While our facilities and methods have modernized, our commitment to Catholic education 
                and learner excellence remains unchanged since 1959. Every learner who walks through our doors 
                becomes part of our extended family, carrying forward our legacy of faith, learning, and service."
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
              <Box sx={{ pr: { md: 4 } }}>
                <Typography variant="h5" sx={{ color: holyCrossBrand.signatureBlue, fontWeight: 600, mb: 3 }}>
                  Our Catholic Foundation
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                  Rooted in Catholic tradition, we provide a values-based education that 
                  nurtures both academic excellence and spiritual growth. Our learners 
                  learn to serve others and make a positive impact in their communities.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip icon={<Favorite />} label="Faith-Based Learning" color="primary" />
                  <Chip icon={<Groups />} label="Community Service" color="secondary" />
                  <Chip icon={<Security />} label="Moral Development" color="primary" />
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
              <Box>
                <Typography variant="h5" sx={{ color: holyCrossBrand.signatureBlue, fontWeight: 600, mb: 3 }}>
                  Our Journey Through Time
                </Typography>
                {heritageTimeline.map((item, index) => (
                  <TimelineCard key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ color: holyCrossBrand.signatureGold, fontWeight: 600 }}>
                        {item.year}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: holyCrossBrand.signatureBlue, fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {item.description}
                    </Typography>
                  </TimelineCard>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </HeritageSection>

      {/* Unified CTA Section */}
      <CTASection />

      {/* Floating Social Icons */}
      <FloatingSocialIcons />
      
      {/* Back to Top Button */}
      <BackToTop />
    </>
  );
};

export default Home; 