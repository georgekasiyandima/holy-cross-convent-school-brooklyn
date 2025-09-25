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
  Avatar,
  Fade,
  Slide
} from '@mui/material';
import { 
  School, 
  Book, 
  People, 
  Event, 
  PlayArrow,
  Close,
  Facebook,
  TrendingUp,
  EmojiEvents,
  Psychology,
  LocationOn,
  Phone,
  Email
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { videoManager, SchoolVideo } from '../utils/videoManager';
import SEO from '../components/SEO';
import EnhancedLiveFeed from '../components/EnhancedLiveFeed';
import DynamicLiveChat from '../components/DynamicLiveChat';

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
  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)',
  color: 'white',
  padding: theme.spacing(12, 0),
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
    background: 'url("/Logo(1).svg") no-repeat center',
    backgroundSize: 'contain',
    opacity: 0.1,
    animation: 'float 6s ease-in-out infinite'
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' }
  }
}));

const StatCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #fffde7 0%, #e3eafc 100%)',
  border: '2px solid transparent',
  backgroundClip: 'padding-box',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
    borderColor: '#ffd700'
  }
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  borderLeft: '4px solid #1a237e',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[8]
  }
}));

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<SchoolVideo | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  // Get student videos
  const studentVideos = videoManager.getVideosByCategory('students');

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

  // Trigger stats animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEO
        title="Holy Cross Convent School - Brooklyn, Cape Town"
        description="Holy Cross Convent School is a prestigious Catholic school in Brooklyn, Cape Town, offering quality education, character development, and spiritual growth."
        keywords="Holy Cross Convent School, Brooklyn, Cape Town, Catholic school, education, character development, spiritual growth"
      />
      {/* Enhanced Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box>
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mb: 2
                }}
              >
                Welcome to Holy Cross Convent School
              </Typography>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 300,
                  mb: 4,
                  opacity: 0.9
                }}
              >
                Nurturing Excellence, Building Character, Inspiring Faith
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4,
                  opacity: 0.8,
                  maxWidth: '600px',
                  mx: 'auto'
                }}
              >
                Since 1959, we've been providing quality Catholic education in Brooklyn, 
                fostering academic excellence and spiritual growth in a nurturing environment.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#ffd700',
                    color: '#1a237e',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#ffed4e',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Explore Our School
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleContactClick}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#ffd700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Contact Us
                </Button>
              </Stack>
            </Box>
          </Fade>
        </Container>
      </HeroSection>

      {/* Live Feed Section */}
      <Box sx={{ py: 6, background: 'white' }}>
        <Container maxWidth="xl">
          <EnhancedLiveFeed />
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #fffde7 0%, #e3eafc 100%)' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ color: '#1a237e', fontWeight: 700, mb: 6 }}>
            Our School by the Numbers
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
            <Fade in={animateStats} timeout={800}>
              <StatCard>
                <TrendingUp sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                <Typography variant="h3" component="h3" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
                  64+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Years of Excellence
                </Typography>
              </StatCard>
            </Fade>
            <Fade in={animateStats} timeout={1000}>
              <StatCard>
                <People sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                <Typography variant="h3" component="h3" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
                  300+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Students
                </Typography>
              </StatCard>
            </Fade>
            <Fade in={animateStats} timeout={1200}>
              <StatCard>
                <EmojiEvents sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                <Typography variant="h3" component="h3" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
                  95%
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Academic Success
                </Typography>
              </StatCard>
            </Fade>
            <Fade in={animateStats} timeout={1400}>
              <StatCard>
                <Psychology sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                <Typography variant="h3" component="h3" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
                  100%
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Character Development
                </Typography>
              </StatCard>
            </Fade>
          </Box>
        </Container>
      </Box>

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
                  Rigorous curriculum designed to challenge and inspire students to reach their full potential.
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
                  Rooted in Catholic values while welcoming students of all faiths and backgrounds.
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

      {/* Testimonials Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ color: '#1a237e', fontWeight: 700, mb: 6 }}>
            What Parents Say
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            <TestimonialCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#1a237e', mr: 2 }}>M</Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Mrs. Johnson</Typography>
                  <Typography variant="body2" color="text.secondary">Parent of Grade 5 Student</Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                "Holy Cross has provided my child with an excellent education and strong moral foundation. The teachers are dedicated and caring."
              </Typography>
            </TestimonialCard>
            <TestimonialCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#1a237e', mr: 2 }}>D</Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Mr. Davis</Typography>
                  <Typography variant="body2" color="text.secondary">Parent of Grade 3 Student</Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                "The school's commitment to academic excellence and character development is outstanding. My child loves coming to school every day."
              </Typography>
            </TestimonialCard>
            <TestimonialCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#1a237e', mr: 2 }}>S</Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Mr. Kasiyandima</Typography>
                  <Typography variant="body2" color="text.secondary">Parent of Grade 2 Student</Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                "The spiritual guidance and academic preparation my child has received will serve them well in high school and beyond."
              </Typography>
            </TestimonialCard>
          </Box>
        </Container>
      </Box>

      {/* Student Showcase Section */}
      {studentVideos.length > 0 && (
        <Box sx={{ py: 8, background: 'linear-gradient(135deg, #fffde7 0%, #e3eafc 100%)' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ color: '#1a237e', fontWeight: 700 }}>
                Student Achievements
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Watch our students showcase their talents and achievements
              </Typography>
            </Box>

            {/* Featured Video */}
            <Card sx={{ mb: 6, boxShadow: 3, background: 'linear-gradient(135deg, #e3eafc 0%, #fffde7 100%)' }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 2, textAlign: 'center' }}>
                  {studentVideos[0].title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 3, textAlign: 'center' }}>
                  {studentVideos[0].description}
                </Typography>
                
                <VideoContainer>
                  <div dangerouslySetInnerHTML={{ __html: studentVideos[0].embedCode }} />
                </VideoContainer>
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Facebook />}
                    href={studentVideos[0].facebookUrl}
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
              {studentVideos.slice(1).map((video) => (
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
                        label="Student Achievement" 
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
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Visit Us
              </Typography>
              <Typography variant="body1">
                162 Koeberg Road<br />
                Brooklyn, Cape Town<br />
                South Africa
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Phone sx={{ fontSize: 60, mb: 2, color: '#ffd700' }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Call Us
              </Typography>
              <Typography variant="body1">
                +27 21 511 9690
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Email sx={{ fontSize: 60, mb: 2, color: '#ffd700' }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Email Us
              </Typography>
              <Typography variant="body1">
                info@holycrossbrooklyn.co.za<br />
                admissions@holycrossbrooklyn.co.za
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleContactClick}
              sx={{
                backgroundColor: '#ffd700',
                color: '#1a237e',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#e6c200',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
                },
                transition: 'all 0.3s ease'
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

      {/* Dynamic Live Chat */}
      <DynamicLiveChat />
    </>
  );
};

export default Home; 