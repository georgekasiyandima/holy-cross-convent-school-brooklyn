import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  Stack, 
  Button, 
  Chip, 
  Link as MuiLink,
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  MusicNote, 
  Group, 
  School, 
  Audiotrack, 
  VideoLibrary, 
  Download,
  PlayArrow,
  Close,
  Facebook
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { videoManager, SchoolVideo } from '../utils/videoManager';

// Styled components for video integration
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

// Video data structure
interface SchoolVideo {
  id: string;
  title: string;
  description: string;
  facebookUrl: string;
  embedCode: string;
  thumbnail?: string;
  category: 'choir' | 'performance' | 'event' | 'general';
  date?: string;
}

// School videos from Facebook
const schoolVideos: SchoolVideo[] = [
  {
    id: 'choir-performance-1',
    title: 'Holy Cross Brooklyn Senior Choir Performance',
    description: 'Beautiful performance by our Senior Choir showcasing the musical talent at Holy Cross Convent School Brooklyn.',
    facebookUrl: 'https://www.facebook.com/61553924237049/videos/1803835803880820/',
    embedCode: '<iframe src="https://www.facebook.com/plugins/video.php?height=420&href=https%3A%2F%2Fwww.facebook.com%2F61553924237049%2Fvideos%2F1803835803880820%2F&show_text=false&width=560&t=0" width="560" height="420" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>',
    category: 'choir',
    date: '2025'
  }
];

const downloads = [
  {
    label: 'Sheet Music (PDF)',
    file: '', // Add file path when available
  },
  {
    label: 'Lyrics Sheet (PDF)',
    file: '', // Add file path when available
  },
  {
    label: 'Contextual Information (PDF)',
    file: '', // Add file path when available
  },
];

const Music: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedVideo, setSelectedVideo] = useState<SchoolVideo | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  const handleVideoClick = (video: SchoolVideo) => {
    setSelectedVideo(video);
    setVideoDialogOpen(true);
  };

  const handleCloseVideo = () => {
    setVideoDialogOpen(false);
    setSelectedVideo(null);
  };

  const getVideosByCategory = (category: SchoolVideo['category']) => {
    return schoolVideos.filter(video => video.category === category);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          Music Department
        </Typography>
        <Divider sx={{ bgcolor: '#ffd700', height: 4, width: 80, mx: 'auto', mb: 3 }} />
        <Typography variant="h6" sx={{ color: '#555', maxWidth: 700, mx: 'auto', mb: 2 }}>
          Inspiring a love for music, creativity, and community at Holy Cross Convent School Brooklyn.
        </Typography>
      </Box>

      {/* Staff & Activities */}
      <Card sx={{ mb: 6, boxShadow: 2, background: 'linear-gradient(135deg, #f5f7fa 0%, #fffde7 100%)' }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center">
            <Box>
              <MusicNote sx={{ color: '#1a237e', fontSize: 60 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
                Mr Adolf Thelen
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', mb: 1 }}>
                <b>Music Department Head</b>
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', mb: 2 }}>
                Teaches Music Appreciation (Grades 4–7), conducts the Senior Choir and congregational singing, and manages audio-visual equipment and the computer lab.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip icon={<Audiotrack sx={{ color: '#ffd700' }} />} label="Music Appreciation" sx={{ bgcolor: '#fffde7', color: '#1a237e', fontWeight: 700 }} />
                <Chip icon={<Group sx={{ color: '#1a237e' }} />} label="Senior Choir" sx={{ bgcolor: '#e3eafc', color: '#1a237e', fontWeight: 700 }} />
                <Chip icon={<MusicNote sx={{ color: '#ffd700' }} />} label="Congregational Singing" sx={{ bgcolor: '#fffde7', color: '#1a237e', fontWeight: 700 }} />
                <Chip icon={<VideoLibrary sx={{ color: '#1a237e' }} />} label="AV & Computer Lab" sx={{ bgcolor: '#e3eafc', color: '#1a237e', fontWeight: 700 }} />
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* School Song Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 2 }}>
          The New School Song: "Holy Cross is our Salvation"
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
          Developed in 2021 by a Cape Town task team, this new composition replaces the old School Anthem "The Holy Cross My Own". The song celebrates our school's values and community spirit.
        </Typography>
        <Typography variant="body2" sx={{ color: '#1a237e', fontStyle: 'italic', mb: 2 }}>
          "Holy Cross is our Salvation"
        </Typography>
      </Box>

      {/* Featured Video Section */}
      {schoolVideos.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 3 }}>
            Featured Performances
          </Typography>
          
          {/* Featured Video */}
          <Card sx={{ mb: 4, boxShadow: 3, background: 'linear-gradient(135deg, #e3eafc 0%, #fffde7 100%)' }}>
            <CardContent>
              <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 2, textAlign: 'center' }}>
                {schoolVideos[0].title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', mb: 3, textAlign: 'center' }}>
                {schoolVideos[0].description}
              </Typography>
              
              <VideoContainer>
                <div dangerouslySetInnerHTML={{ __html: schoolVideos[0].embedCode }} />
              </VideoContainer>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Facebook />}
                  href={schoolVideos[0].facebookUrl}
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
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 3 }}>
            More Videos
          </Typography>
          
          <Grid container spacing={3}>
            {schoolVideos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id}>
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
                        label={video.category.charAt(0).toUpperCase() + video.category.slice(1)} 
                        size="small" 
                        color="primary" 
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
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Downloads Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 2 }}>
          Downloads
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {downloads.map((item) => (
            item.file ? (
              <Button
                key={item.label}
                variant="contained"
                color="primary"
                startIcon={<Download />}
                href={item.file}
                target="_blank"
                sx={{
                  bgcolor: '#ffd700',
                  color: '#1a237e',
                  fontWeight: 700,
                  minWidth: 200,
                  '&:hover': { bgcolor: '#ffed4e' },
                }}
              >
                {item.label}
              </Button>
            ) : (
              <Button
                key={item.label}
                variant="contained"
                color="primary"
                startIcon={<Download />}
                disabled
                sx={{
                  bgcolor: '#ccc',
                  color: '#666',
                  fontWeight: 700,
                  minWidth: 200,
                  '&:hover': { bgcolor: '#ccc' },
                }}
              >
                {item.label}
              </Button>
            )
          ))}
        </Stack>
        <Typography variant="body2" sx={{ color: '#aaa', mt: 2 }}>
          Sheet music, lyrics, and more will be available for download soon.
        </Typography>
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

      <Divider sx={{ my: 6 }} />
      <Box sx={{ textAlign: 'center', color: '#aaa', mt: 4 }}>
        <Typography variant="body2">
          <em>Music is at the heart of our school community. More videos and resources will be added as they become available.</em>
        </Typography>
      </Box>
    </Container>
  );
};

export default Music; 