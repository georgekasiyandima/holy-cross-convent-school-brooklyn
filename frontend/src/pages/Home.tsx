import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import { 
  School, 
  Book, 
  People, 
  Event, 
  PlayArrow,
  Close,
  Facebook,
  Celebration,
  Star
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { videoManager, SchoolVideo } from '../utils/videoManager';

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

const Home: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<SchoolVideo | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

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

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Holy Cross Convent School
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Nurturing Excellence, Building Character, Inspiring Faith
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              backgroundColor: '#ffd700',
              color: '#1a237e',
              '&:hover': {
                backgroundColor: '#ffed4e',
              },
            }}
          >
            Learn More
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose Holy Cross?
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 4, mt: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Book sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Academic Excellence
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Rigorous curriculum designed to challenge and inspire students to reach their full potential.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <People sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Community
              </Typography>
              <Typography variant="body1" color="text.secondary">
                A supportive community that values diversity, inclusion, and mutual respect.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <School sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Faith-Based Education
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Rooted in Catholic values while welcoming students of all faiths and backgrounds.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Event sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Extracurricular Activities
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Rich opportunities in sports, arts, and leadership development.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Student Showcase Section */}
      {studentVideos.length > 0 && (
        <Box sx={{ py: 8, background: 'linear-gradient(135deg, #fffde7 0%, #e3eafc 100%)' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ color: '#1a237e', fontWeight: 700 }}>
                Student Achievements
              </Typography>
              <Typography variant="h6" sx={{ color: '#555', mb: 2 }}>
                Celebrating the Success and Growth of Our Students
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                <Star sx={{ color: '#ffd700', fontSize: 30 }} />
                <Typography variant="body1" sx={{ color: '#1a237e', fontWeight: 500 }}>
                  Proud Moments at Holy Cross Brooklyn
                </Typography>
                <Star sx={{ color: '#ffd700', fontSize: 30 }} />
              </Box>
            </Box>

            {/* Featured Student Video */}
            <Card sx={{ mb: 6, boxShadow: 4, background: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Celebration sx={{ color: '#ffd700', fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700 }}>
                      {studentVideos[0].title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#555' }}>
                      {studentVideos[0].description}
                    </Typography>
                  </Box>
                </Box>
                
                <VideoContainer>
                  <div dangerouslySetInnerHTML={{ __html: studentVideos[0].embedCode }} />
                </VideoContainer>
                
                <Box sx={{ textAlign: 'center', mt: 3 }}>
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

            {/* Additional Student Videos */}
            {studentVideos.length > 1 && (
              <>
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
                  More Student Highlights
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 3 
                }}>
                  {studentVideos.slice(1).map((video) => (
                    <Box key={video.id}>
                      <VideoCard onClick={() => handleVideoClick(video)}>
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
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Container>
        </Box>
      )}

      {/* Video Dialog */}
      <Dialog
        open={videoDialogOpen}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
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
              <Typography variant="body2" sx={{ color: '#555', mb: 3 }}>
                {selectedVideo.description}
              </Typography>
              
              <VideoContainer>
                <div dangerouslySetInnerHTML={{ __html: selectedVideo.embedCode }} />
              </VideoContainer>
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
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
    </>
  );
};

export default Home; 