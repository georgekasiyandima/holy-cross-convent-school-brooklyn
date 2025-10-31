import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip,
  Stack,
  Fade,
  Slide,
} from '@mui/material';
import { 
  School, 
  Book, 
  People, 
  Event, 
  PlayArrow,
  Close,
  Facebook,
  LocationOn,
  Phone,
  Email,
  AutoAwesome,
  Groups,
  Security,
  Favorite,
  History,
  Visibility,
  CheckCircle,
  Church,
  Science,
  MusicNote,
  SportsSoccer,
  Computer,
  Schedule,
  ChildCare,
  Star,
  Group,
  School as SchoolIcon,
  AutoAwesome as Sparkles,
  KeyboardArrowDown
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { videoManager, SchoolVideo } from '../utils/videoManager';
import SEO from '../components/SEO';
import SchoolHighlights from '../components/SchoolHighlights';
import SchoolStatistics from '../components/SchoolStatistics';
import FloatingSocialIcons from '../components/FloatingSocialIcons';
import BackToTop from '../components/BackToTop';
import PillarCarousel from '../components/PillarCarousel';
import { holyCrossBrand, pillarColors } from '../theme/branding';

const VideoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 0,
  paddingBottom: '56.25%', // 16:9 aspect ratio
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

const VideoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}));

const VideoThumbnail = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 0,
  paddingBottom: '56.25%',
  backgroundColor: '#f5f5f5',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  '& .play-button': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(26, 35, 126, 0.9)',
    color: 'white',
    borderRadius: '50%',
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#ffd700',
      color: '#1a237e',
      transform: 'translate(-50%, -50%) scale(1.1)'
    }
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
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.85) 0%, rgba(57, 73, 171, 0.85) 50%, rgba(92, 107, 192, 0.85) 100%)',
    zIndex: 1
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
    zIndex: 1
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
  zIndex: 0
});

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
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
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #1a237e 100%)'
  }
}));

const GradeRSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)',
  padding: theme.spacing(8, 0),
  position: 'relative',
  borderTop: '4px solid #d32f2f',
  borderBottom: '4px solid #d32f2f',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #d32f2f 0%, #ffd700 50%, #d32f2f 100%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #d32f2f 0%, #ffd700 50%, #d32f2f 100%)',
  }
}));

const TimelineCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  border: '1px solid #e3f2fd',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  position: 'relative',
  marginLeft: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-20px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '12px',
    height: '12px',
    background: '#ffd700',
    borderRadius: '50%',
    border: '3px solid #1a237e'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '-14px',
    top: '0',
    bottom: '0',
    width: '2px',
    background: 'linear-gradient(180deg, #1a237e 0%, #ffd700 100%)'
  }
}));



// Hero images - reduced to 3 strongest visuals
const heroImages = [
  {
    src: '/HCCS25.jpeg',
    title: 'Welcome to Holy Cross',
    description: 'Where faith, learning, and community unite'
  },
  {
    src: '/SCIENCEEXPO24.jpg',
    title: 'Excellence in Education',
    description: 'Nurturing minds and hearts for tomorrow'
  },
  {
    src: '/sports1.jpg',
    title: 'Holistic Development',
    description: 'Academics, sports, arts, and service'
  }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<SchoolVideo | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get learner videos
  const learnerVideos = videoManager.getVideosByCategory('students');

  // Hero image carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleVideoClick = (video: SchoolVideo) => {
    setSelectedVideo(video);
    setVideoDialogOpen(true);
  };

  const handleCloseVideo = () => {
    setVideoDialogOpen(false);
    setSelectedVideo(null);
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handleScheduleVisit = () => {
    navigate('/contact');
  };

  const handleVirtualTour = () => {
    navigate('/gallery');
  };

  // Removed unused handleDownloadProspectus function

  // Trigger stats animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // School statistics data
  const schoolStats = [
    { number: '65+', label: 'Years of Excellence', icon: <History /> },
    { number: '500+', label: 'Learners', icon: <People /> },
    { number: '98%', label: 'Pass Rate', icon: <CheckCircle /> },
    { number: '15+', label: 'Programs', icon: <School /> }
  ];

  // Heritage timeline data
  const heritageTimeline = [
    { year: '1959', title: 'Foundation', description: 'Holy Cross Convent School established in Brooklyn' },
    { year: '1980s', title: 'Expansion', description: 'New facilities and programs added' },
    { year: '2000s', title: 'Modernization', description: 'Digital learning and technology integration' },
    { year: '2024', title: 'Today', description: 'Continuing legacy of excellence and innovation' }
  ];


  return (
    <>
      <SEO
        title="Holy Cross Convent School - Brooklyn, Cape Town"
        description="Holy Cross Convent School is a prestigious Catholic school in Brooklyn, Cape Town, offering quality education, character development, and spiritual growth."
        keywords="Holy Cross Convent School, Brooklyn, Cape Town, Catholic school, education, character development, spiritual growth"
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
                        backgroundColor: index === currentImageIndex ? '#ffd700' : 'rgba(255, 255, 255, 0.3)',
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
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      {heroImages[currentImageIndex].title}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        opacity: 0.9,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
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
                  color: '#1a237e',
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
                    color: holyCrossBrand.signatureGold,
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
              
              {/* Single Primary CTA */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleScheduleVisit}
                  startIcon={<Schedule />}
                  sx={{
                    background: holyCrossBrand.primaryGradient,
                    color: '#ffffff',
                    px: 8,
                    py: 3,
                    fontSize: '1.2rem',
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
              </Box>
              
              {/* Scroll Indicator */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
                  Scroll to explore
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <KeyboardArrowDown sx={{ color: 'white', opacity: 0.8, fontSize: 32 }} />
                </Box>
              </Box>
            </Box>
          </Fade>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* Heritage Section */}
      <HeritageSection>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              icon={<History />}
              label="Our Heritage"
              sx={{
                backgroundColor: '#1a237e',
                color: 'white',
                fontWeight: 600,
                mb: 3,
                px: 2,
                py: 1
              }}
            />
            <Typography variant="h3" component="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 2 }}>
              A Legacy of Excellence
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', maxWidth: '600px', mx: 'auto' }}>
              From our founding in 1959 to today, we've maintained our commitment to 
              Catholic values while embracing educational innovation.
            </Typography>
          </Box>

          {/* Then & Now: Simple Side-by-Side Comparison */}
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h4" 
              component="h3" 
              sx={{ 
                color: '#1a237e', 
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
                    border: '2px solid #1a237e',
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
                      backgroundImage: 'url("/Philomena.jpg")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
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
                    border: '2px solid #ffd700',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(255, 215, 0, 0.3)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: 300,
                      backgroundImage: 'url("/HCTEACHERS 34.jpg")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
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
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
                Our Unchanging Commitment
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', fontStyle: 'italic', maxWidth: '800px', mx: 'auto' }}>
                "While our facilities and methods have modernized, our commitment to Catholic education 
                and learner excellence remains unchanged since 1959. Every learner who walks through our doors 
                becomes part of our extended family, carrying forward our legacy of faith, learning, and service."
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
              <Box sx={{ pr: { md: 4 } }}>
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 3 }}>
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
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 3 }}>
                  Our Journey Through Time
                </Typography>
                {heritageTimeline.map((item, index) => (
                  <TimelineCard key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ color: '#ffd700', fontWeight: 600 }}>
                        {item.year}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: '#1a237e', fontWeight: 600 }}>
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

      {/* Grade R Promotion Section */}
      <GradeRSection>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              icon={<ChildCare />}
              label="Special Focus: Grade R Learners"
              sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                fontWeight: 600,
                mb: 3,
                px: 2,
                py: 1,
                fontSize: '1.1rem'
              }}
            />
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                color: '#d32f2f', 
                fontWeight: 700, 
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              We're Actively Seeking Grade R Learners!
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666', 
                mb: 4, 
                maxWidth: '800px', 
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.6
              }}
            >
              Join our nurturing early childhood education program designed to provide the perfect foundation 
              for your child's educational journey. Our Grade R program focuses on holistic development 
              in a caring, faith-based environment.
            </Typography>
          </Box>

          {/* Grade R Features Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gap: 4, 
            mb: 6 
          }}>
            {/* Feature 1 */}
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '2px solid #d32f2f',
              borderRadius: 3,
              p: 3,
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(211, 47, 47, 0.2)',
              }
            }}>
              <Star sx={{ fontSize: 60, color: '#ffd700', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2 }}>
                Holistic Development
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                Focus on cognitive, emotional, social, and physical development through 
                play-based learning and structured activities.
              </Typography>
            </Card>

            {/* Feature 2 */}
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '2px solid #d32f2f',
              borderRadius: 3,
              p: 3,
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(211, 47, 47, 0.2)',
              }
            }}>
              <Group sx={{ fontSize: 60, color: '#ffd700', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2 }}>
                Small Class Sizes
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                Individual attention and personalized learning with experienced teachers 
                who understand early childhood development.
              </Typography>
            </Card>

            {/* Feature 3 */}
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '2px solid #d32f2f',
              borderRadius: 3,
              p: 3,
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(211, 47, 47, 0.2)',
              }
            }}>
              <Schedule sx={{ fontSize: 60, color: '#ffd700', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2 }}>
                Flexible Schedule
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                Half-day and full-day options available to accommodate different 
                family needs and preferences.
              </Typography>
            </Card>
          </Box>

          {/* Call to Action */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#d32f2f', 
                fontWeight: 600, 
                mb: 3 
              }}
            >
              Ready to Start Your Child's Educational Journey?
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666', 
                mb: 4, 
                maxWidth: '600px', 
                mx: 'auto' 
              }}
            >
              Apply now and give your child the best start to their educational journey. 
              Our Grade R program is designed to prepare them for success in Grade 1 and beyond.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/admissions')}
              startIcon={<SchoolIcon />}
              sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: '0 8px 25px rgba(211, 47, 47, 0.3)',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 35px rgba(211, 47, 47, 0.4)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Apply for Grade R
            </Button>
          </Box>
        </Container>
      </GradeRSection>

      {/* School Statistics Section */}
      <SchoolStatistics animate={animateStats} />

      {/* Five Pillars of Excellence Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              icon={<AutoAwesome />}
              label="Five Pillars of Excellence"
              sx={{
                backgroundColor: holyCrossBrand.signatureBlue,
                color: 'white',
                fontWeight: 600,
                mb: 3,
                px: 2,
                py: 3,
                fontSize: '1rem'
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

      {/* School Highlights Section */}
      <SchoolHighlights />

      {/* Enhanced Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ color: '#1a237e', fontWeight: 700, mb: 6 }}>
          Why Choose Holy Cross?
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 4 }}>
          <Slide direction="up" in timeout={800}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <CardContent>
                <Book sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Academic Excellence
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Rigorous curriculum designed to challenge and inspire learners to reach their full potential.
                </Typography>
              </CardContent>
            </Card>
          </Slide>
          <Slide direction="up" in timeout={1000}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <CardContent>
                <People sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Community
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  A supportive community that values diversity, inclusion, and mutual respect.
                </Typography>
              </CardContent>
            </Card>
          </Slide>
          <Slide direction="up" in timeout={1200}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <CardContent>
                <School sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Faith-Based Education
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Rooted in Catholic values while welcoming learners of all faiths and backgrounds.
                </Typography>
              </CardContent>
            </Card>
          </Slide>
          <Slide direction="up" in timeout={1400}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <CardContent>
                <Event sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Extracurricular Activities
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Rich opportunities in sports, arts, and leadership development.
                </Typography>
              </CardContent>
            </Card>
          </Slide>
        </Box>
      </Container>


      {/* Learner Showcase Section */}
      {learnerVideos.length > 0 && (
        <Box sx={{ py: 8, background: 'linear-gradient(135deg, #fffde7 0%, #e3eafc 100%)' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ color: '#1a237e', fontWeight: 700 }}>
                Learner Achievements
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Watch our learners showcase their talents and achievements
              </Typography>
            </Box>

            {/* Featured Video */}
            <Card sx={{ mb: 6, boxShadow: 3, background: 'linear-gradient(135deg, #e3eafc 0%, #fffde7 100%)' }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 2, textAlign: 'center' }}>
                  {learnerVideos[0].title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 3, textAlign: 'center' }}>
                  {learnerVideos[0].description}
                </Typography>
                
                <VideoContainer>
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
                      borderColor: '#1a237e',
                      color: '#1a237e',
                      '&:hover': {
                        borderColor: '#ffd700',
                        backgroundColor: '#fffde7'
                      }
                    }}
                  >
                    View on Facebook
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Video Gallery */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {learnerVideos.slice(1).map((video) => (
                <VideoCard key={video.id} onClick={() => handleVideoClick(video)}>
                  <CardContent>
                    <VideoThumbnail>
                      <div className="play-button">
                        <PlayArrow sx={{ fontSize: 30 }} />
                      </div>
                    </VideoThumbnail>
                    <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mt: 2, mb: 1 }}>
                      {video.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555', mb: 2 }}>
                      {video.description}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip 
                        label="Learner Achievement" 
                        size="small" 
                        color="secondary" 
                        variant="outlined"
                      />
                      {video.date && (
                        <Chip 
                          label={video.date} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </CardContent>
                </VideoCard>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {/* Contact Information Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)', color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 700, mb: 6, color: '#ffd700' }}>
            Get in Touch
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4, justifyContent: 'center', mb: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <LocationOn sx={{ fontSize: 60, mb: 2, color: '#ffd700' }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                Visit Us
              </Typography>
              <Typography variant="body1" sx={{ color: 'white' }}>
                162 Koeberg Road<br />
                Brooklyn, Cape Town<br />
                7405 South Africa
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Phone sx={{ fontSize: 60, mb: 2, color: '#ffd700' }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                Call Us
              </Typography>
              <Typography variant="body1" sx={{ color: 'white' }}>
                +27 21 511 4337
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Email sx={{ fontSize: 60, mb: 2, color: '#ffd700' }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                Email Us
              </Typography>
              <Typography variant="body1" sx={{ color: 'white' }}>
                admin@holycrossbrooklyn.co.za
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleContactClick}
              sx={{
                background: holyCrossBrand.primaryGradient,
                color: '#ffffff',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: holyCrossBrand.buttonStyles.primary.hoverBoxShadow
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Send Us a Message
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Video Dialog */}
      <Dialog
        open={videoDialogOpen}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {selectedVideo?.title}
            </Typography>
            <IconButton onClick={handleCloseVideo}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedVideo && (
            <>
              <VideoContainer sx={{ mb: 2 }}>
                <div dangerouslySetInnerHTML={{ __html: selectedVideo.embedCode }} />
              </VideoContainer>
              <Typography variant="body1" gutterBottom>
                {selectedVideo.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Facebook />}
                  href={selectedVideo.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderColor: '#1a237e',
                    color: '#1a237e',
                    '&:hover': {
                      borderColor: '#ffd700',
                      backgroundColor: '#fffde7'
                    }
                  }}
                >
                  View on Facebook
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Social Icons */}
      <FloatingSocialIcons />
      
      {/* Back to Top Button */}
      <BackToTop />
    </>
  );
};

export default Home; 