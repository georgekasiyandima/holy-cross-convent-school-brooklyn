import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Button,
  Paper
} from '@mui/material';
import {
  PhotoLibrary,
  Event,
  School,
  Collections,
  Image as ImageIcon,
  ArrowForward
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Fade, Slide } from '@mui/material';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';
import GalleryService, { Album, GalleryItem } from '../services/galleryService';
import ClassPhotosSection from '../components/gallery/ClassPhotosSection';
import AlbumCard from '../components/gallery/AlbumCard';
import ImageGrid from '../components/gallery/ImageGrid';

// Hero Section - Showcasing HCC Story
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '600px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: 'url("/MUSIC03.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  textAlign: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,35,126,.85), rgba(211,47,47,.65))',
    zIndex: 0
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
    zIndex: 0
  },
  '& > *': { position: 'relative', zIndex: 1 }
}));

const GalleryContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0)
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <TabPanel role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </TabPanel>
  );
};

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: '3px solid #e0e0e0',
  marginBottom: theme.spacing(6),
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2, 2, 0, 0),
  padding: theme.spacing(0, 2),
  '& .MuiTab-root': {
    fontWeight: 700,
    fontSize: '1.1rem',
    textTransform: 'none',
    minHeight: 72,
    padding: theme.spacing(2, 3),
    '&.Mui-selected': {
      color: '#1a237e'
    }
  },
  '& .MuiTabs-indicator': {
    height: 4,
    backgroundColor: '#1a237e',
    borderRadius: '2px 2px 0 0'
  }
}));

const StatsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    backgroundColor: 'rgba(255, 255, 255, 0.25)'
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  paddingBottom: theme.spacing(3),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
    borderRadius: '2px'
  }
}));

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [eventsAlbums, setEventsAlbums] = useState<Album[]>([]);
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState({
    totalAlbums: 0,
    totalPhotos: 0,
    eventsCount: 0,
    classPhotosCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load events albums
        const albums = await GalleryService.getAlbums({
          albumType: 'GENERAL',
          isPublished: true
        });
        setEventsAlbums(albums);

        // Load class photos albums
        const classAlbums = await GalleryService.getClassPhotosAlbums();

        // Load all published items for "All Gallery" tab
        const response = await GalleryService.getGalleryItems({
          isPublished: true,
          limit: 100
        });
        setAllItems(response.items);

        // Calculate stats
        setStats({
          totalAlbums: albums.length + classAlbums.length,
          totalPhotos: response.items.length,
          eventsCount: albums.length,
          classPhotosCount: classAlbums.length
        });
      } catch (err: any) {
        console.error('Error loading gallery data:', err);
        setError(err.message || 'Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAlbumClick = (album: Album) => {
    navigate(`/gallery/album/${album.id}`);
  };

  if (loading && activeTab === 0) {
    return (
      <>
        <HeroSection>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress size={60} sx={{ color: '#ffd700', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                Loading Gallery...
              </Typography>
            </Box>
          </Container>
        </HeroSection>
      </>
    );
  }

  return (
    <>
      <SEO
        title="School Gallery - Holy Cross Convent School Brooklyn"
        description="Explore the vibrant life of Holy Cross Convent School Brooklyn through our gallery. Discover class photos, events, celebrations, and the daily moments that make our school community special."
        keywords="school gallery, class photos, school events, Holy Cross Convent School, Brooklyn, Cape Town, Catholic school gallery"
      />

      {/* Hero Section - Showcasing HCC Story */}
      <HeroSection>
        {/* Return to Home - positioned outside hero to avoid clash */}
        <Box sx={{ 
          position: 'fixed', 
          top: { xs: 80, sm: 100 }, 
          left: 16, 
          zIndex: 1000,
          '& .MuiTypography-root': {
            color: 'white !important',
            textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(26, 35, 126, 0.7)',
            padding: '8px 16px',
            borderRadius: '8px',
            display: 'inline-block',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              transform: 'translateX(-2px)',
              backgroundColor: 'rgba(26, 35, 126, 0.9)',
            },
            transition: 'all 0.3s ease'
          }
        }}>
          <ReturnToHome />
        </Box>

        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 }, py: 8 }}>
          <Fade in timeout={1000}>
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  mb: 3,
                  color: '#ffd700',
                  textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9), 0 0 60px rgba(26,35,126,0.6)',
                  letterSpacing: '0.5px'
                }}
              >
                Our School Gallery
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: '#ffffff',
                  fontWeight: 600,
                  textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8)',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  maxWidth: '900px',
                  mx: 'auto',
                  mb: 4,
                  lineHeight: 1.4
                }}
              >
                Capturing Moments That Define Our Community
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#ffffff',
                  fontWeight: 400,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  maxWidth: '800px',
                  mx: 'auto',
                  mb: 6,
                  lineHeight: 1.6
                }}
              >
                From academic achievements to spiritual celebrations, from sports triumphs to cultural expressions — 
                every image tells a story of faith, learning, and community at Holy Cross Convent School Brooklyn.
              </Typography>

              {/* Stats Section */}
              <Slide direction="up" in timeout={1500}>
                <Box>
                  <Grid container spacing={3} sx={{ maxWidth: '900px', mx: 'auto', mt: 4 }}>
                    <Grid item xs={6} sm={3}>
                      <StatsBox>
                        <Collections sx={{ fontSize: 40, mb: 1, color: '#ffd700' }} />
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mb: 0.5 }}>
                          {stats.totalAlbums}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                          Albums
                        </Typography>
                      </StatsBox>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <StatsBox>
                        <ImageIcon sx={{ fontSize: 40, mb: 1, color: '#ffd700' }} />
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mb: 0.5 }}>
                          {stats.totalPhotos}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                          Photos
                        </Typography>
                      </StatsBox>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <StatsBox>
                        <Event sx={{ fontSize: 40, mb: 1, color: '#ffd700' }} />
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mb: 0.5 }}>
                          {stats.eventsCount}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                          Events
                        </Typography>
                      </StatsBox>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <StatsBox>
                        <School sx={{ fontSize: 40, mb: 1, color: '#ffd700' }} />
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mb: 0.5 }}>
                          {stats.classPhotosCount}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                          Classes
                        </Typography>
                      </StatsBox>
                    </Grid>
                  </Grid>
                </Box>
              </Slide>
            </Box>
          </Fade>
        </Container>
      </HeroSection>

      <GalleryContainer>
        <Container maxWidth="xl" sx={{ py: 6 }}>
          {/* Tabs Navigation */}
          <Paper elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
            <StyledTabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="gallery navigation tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                icon={<Event />}
                iconPosition="start"
                label="Events & Occasions"
                sx={{ minWidth: { xs: 140, sm: 220 } }}
              />
              <Tab
                icon={<School />}
                iconPosition="start"
                label="Class Photos"
                sx={{ minWidth: { xs: 140, sm: 220 } }}
              />
              <Tab
                icon={<PhotoLibrary />}
                iconPosition="start"
                label="All Gallery"
                sx={{ minWidth: { xs: 140, sm: 220 } }}
              />
            </StyledTabs>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Events & Occasions Tab */}
          <CustomTabPanel value={activeTab} index={0}>
            <SectionHeader>
              <Fade in timeout={800}>
                <Box>
                  <Event sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                      fontWeight: 800,
                      color: '#1a237e',
                      mb: 2,
                      fontSize: { xs: '2rem', md: '2.5rem' }
                    }}
                  >
                    Events & Occasions
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#666', maxWidth: '700px', mx: 'auto' }}>
                    Celebrating our community through moments of joy, achievement, and togetherness
                  </Typography>
                  <Chip
                    icon={<PhotoLibrary />}
                    label={`${stats.eventsCount} Event Album${stats.eventsCount !== 1 ? 's' : ''}`}
                    sx={{
                      backgroundColor: '#d32f2f',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '1rem',
                      px: 2,
                      py: 2,
                      mt: 2
                    }}
                  />
                </Box>
              </Fade>
            </SectionHeader>

            {eventsAlbums.length === 0 ? (
              <Alert severity="info" sx={{ mt: 4 }}>
                No event albums available yet. Event albums will appear here once uploaded.
              </Alert>
            ) : (
              <Grid container spacing={4}>
                {eventsAlbums.map((album, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={album.id}>
                    <Fade in timeout={600 + (index * 100)}>
                      <Box>
                        <AlbumCard album={album} onClick={handleAlbumClick} />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
          </CustomTabPanel>

          {/* Class Photos Tab */}
          <CustomTabPanel value={activeTab} index={1}>
            <ClassPhotosSection onAlbumClick={handleAlbumClick} />
          </CustomTabPanel>

          {/* All Gallery Tab */}
          <CustomTabPanel value={activeTab} index={2}>
            <SectionHeader>
              <Fade in timeout={800}>
                <Box>
                  <PhotoLibrary sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                      fontWeight: 800,
                      color: '#1a237e',
                      mb: 2,
                      fontSize: { xs: '2rem', md: '2.5rem' }
                    }}
                  >
                    All Gallery
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#666', maxWidth: '700px', mx: 'auto' }}>
                    Browse our complete collection of school life moments
                  </Typography>
                  <Chip
                    label={`${stats.totalPhotos} Photo${stats.totalPhotos !== 1 ? 's' : ''}`}
                    sx={{
                      backgroundColor: '#1a237e',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '1rem',
                      px: 2,
                      py: 2,
                      mt: 2
                    }}
                  />
                </Box>
              </Fade>
            </SectionHeader>

            {allItems.length === 0 ? (
              <Alert severity="info" sx={{ mt: 4 }}>
                No photos available yet. Photos will appear here once uploaded.
              </Alert>
            ) : (
              <ImageGrid items={allItems} loading={false} />
            )}
          </CustomTabPanel>
        </Container>
      </GalleryContainer>
    </>
  );
};

export default Gallery;
