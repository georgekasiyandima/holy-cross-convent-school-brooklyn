import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  Divider, 
  useTheme,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Chip,
  Stack
} from '@mui/material';
import { 
  PlayArrow,
  Close,
  Facebook,
  VideoLibrary
} from '@mui/icons-material';
import ReturnToHome from '../components/ReturnToHome';
import { styled } from '@mui/material/styles';
import { videoManager, SchoolVideo } from '../utils/videoManager';

const SpiritualSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(8),
  padding: theme.spacing(4, 0),
  background: 'linear-gradient(135deg, rgba(255, 247, 205, 0.2) 0%, rgba(255, 235, 238, 0.2) 100%)', // gentle gold to red background
  borderRadius: theme.spacing(2),
  border: '2px solid #d32f2f',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
    borderRadius: '8px 8px 0 0',
  }
}));

const QuoteBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'linear-gradient(135deg, rgba(26, 35, 126, 0.05) 0%, rgba(255, 235, 238, 0.1) 100%)',
  borderLeft: `4px solid #d32f2f`,
  borderRight: `2px solid #ffd700`,
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  borderRadius: theme.spacing(1),
  fontStyle: 'italic',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
    borderRadius: '4px 4px 0 0',
  }
}));

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

const Spiritual: React.FC = () => {
  const theme = useTheme();
  const [selectedVideo, setSelectedVideo] = useState<SchoolVideo | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  // Get spiritual videos
  const spiritualVideos = videoManager.getVideosByCategory('spiritual');

  const handleVideoClick = (video: SchoolVideo) => {
    setSelectedVideo(video);
    setVideoDialogOpen(true);
  };

  const handleCloseVideo = () => {
    setVideoDialogOpen(false);
    setSelectedVideo(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Return to Home */}
      <ReturnToHome />
      
      <SpiritualSection>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            CHRISTMAS 2022
          </Typography>
          <Typography variant="h5" sx={{ color: '#ffd700', fontWeight: 600, mb: 3, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
            The Challenge
          </Typography>
        </Box>
        
        <Card sx={{ mb: 4, boxShadow: 0, background: 'none' }}>
          <CardMedia
            component="img"
            image="/jesus_child.jpg" // Update this if the filename is different
            alt="Child Jesus"
            sx={{ maxWidth: 350, mx: 'auto', borderRadius: 3, boxShadow: 3, mb: 2 }}
          />
          <CardContent>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', mb: 2 }}>
              One need only turn on the television to see that we live in difficult times. Growing unemployment, debt, divorce, addiction, and abuse have become widespread leaving in their wake unhappiness and heartache that touches every one of us. Too many look to politicians, corporations, or governments to fix what is broken, but history has shown these organizations are not the cure for unhappiness. Only Jesus Christ can fix what is broken, only He can bring real and lasting peace.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', mb: 2 }}>
              I have sold religious art for years, yet I am still amazed by the power it has to change our world. By surrounding ourselves with heavenly things we become better and heaven becomes a little closer. <strong>Does it Really Work?</strong>
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', mb: 2 }}>
              Faith is born from a relationship with Christ. Like any relationship, it begins by spending time together. We spend time with the Lord as we pray and study His word. But in a world filled with distractions it can become easy to forget Him unless we surround ourselves with meaningful reminders. By putting a picture of Christ in our homes we are creating a reminder to ourselves, and those we love, to spend time with.
            </Typography>
          </CardContent>
        </Card>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 1, fontSize: { xs: '1.3rem', md: '1.7rem' } }}>
            SAVIOUR
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#1a237e', fontWeight: 500, mb: 2 }}>
            by Liz Lemon
          </Typography>
        </Box>
        
        <QuoteBox>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#333' }}>
            "This Christmas please accept our gift of a free picture of Christ then share His love with others by giving away pictures of Christ to your family, friends, and neighbours"
          </Typography>
        </QuoteBox>
        
        <Divider sx={{ my: 4 }} />

        {/* Spiritual Videos Section */}
        {spiritualVideos.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 3, textAlign: 'center' }}>
              Spiritual Moments
            </Typography>
            <Typography variant="body1" sx={{ color: '#555', mb: 4, textAlign: 'center' }}>
              Experience the spiritual life of our school community through these beautiful moments captured on video.
            </Typography>
            
            {/* Featured Spiritual Video */}
            <Card sx={{ mb: 4, boxShadow: 3, background: 'linear-gradient(135deg, #e3eafc 0%, #fffde7 100%)' }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 2, textAlign: 'center' }}>
                  {spiritualVideos[0].title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', mb: 3, textAlign: 'center' }}>
                  {spiritualVideos[0].description}
                </Typography>
                
                <VideoContainer>
                  <div dangerouslySetInnerHTML={{ __html: spiritualVideos[0].embedCode }} />
                </VideoContainer>
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Facebook />}
                    href={spiritualVideos[0].facebookUrl}
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
            {spiritualVideos.length > 1 && (
              <>
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 3 }}>
                  More Spiritual Videos
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 3 
                }}>
                  {spiritualVideos.slice(1).map((video) => (
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
                              label="Spiritual" 
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

        <Divider sx={{ my: 4 }} />
        
        {/* Future: Catholic Church spiritual calendar/seasons section */}
        <Box sx={{ textAlign: 'center', mt: 6, color: '#aaa' }}>
          <Typography variant="body2">
            <em>In future, this page will show the Catholic Church spiritual calendar/seasons.</em>
          </Typography>
        </Box>
      </SpiritualSection>
    </Container>
  );
};

export default Spiritual; 