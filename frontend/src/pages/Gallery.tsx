import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Alert,
  Grid,
  Chip,
  Paper,
  Skeleton
} from '@mui/material';
import {
  PhotoLibrary,
  Event,
  Collections,
  Image as ImageIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Fade, Slide } from '@mui/material';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';
import GalleryService, { Album, GalleryItem } from '../services/galleryService';
import AlbumCard from '../components/gallery/AlbumCard';
import ImageGrid from '../components/gallery/ImageGrid';
import AlbumModal from '../components/gallery/AlbumModal';
import { getBackgroundImageUrl } from '../utils/staticFiles';
import { Helmet } from 'react-helmet-async';

// Hero Section - Showcasing HCC Story
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '600px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: getBackgroundImageUrl('MUSIC03.jpg'),
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
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  paddingBottom: theme.spacing(8)
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
  transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
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
  const [activeTab, setActiveTab] = useState(0);
  const [allPublishedAlbums, setAllPublishedAlbums] = useState<Album[]>([]);
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // AbortController ref for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load events albums and all items in parallel for faster loading
        // TODO: Implement pagination/infinite scroll for >100 items
        const [albumsResponse, itemsResponse] = await Promise.all([
          GalleryService.getAlbums({
            isPublished: true,
          }),
          GalleryService.getGalleryItems({
            isPublished: true,
            limit: 100, // Hard-coded limit - consider pagination for production
          }),
        ]);

        // Check if request was aborted
        if (controller.signal.aborted) {
          return;
        }

        setAllPublishedAlbums(albumsResponse);
        setAllItems(itemsResponse.items);
      } catch (err: any) {
        // Don't set error if request was aborted
        if (err.name === 'AbortError' || controller.signal.aborted) {
          return;
        }
        console.error('Error loading gallery data:', err);
        setError(err.message || 'Failed to load gallery');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      controller.abort();
    };
  }, []);

  // Memoize filtered albums and stats for performance
  const eventsAlbums = useMemo(() => {
    const generalAlbums = allPublishedAlbums.filter((album) => album.albumType === 'GENERAL');
    
    // Pre-group sub-albums using Map for O(n) instead of O(n²)
    const subAlbumsMap = new Map<string, Album[]>();
    generalAlbums.forEach((album) => {
      if (album.parentAlbumId) {
        const parentId = album.parentAlbumId;
        if (!subAlbumsMap.has(parentId)) {
          subAlbumsMap.set(parentId, []);
        }
        subAlbumsMap.get(parentId)!.push(album);
      }
    });

    const generalWithChildren = generalAlbums.map((album) => ({
      ...album,
      subAlbums: subAlbumsMap.get(album.id) || [],
    }));
    
    return generalWithChildren.filter((album) => !album.parentAlbumId);
  }, [allPublishedAlbums]);

  // Memoize stats calculation
  const stats = useMemo(() => {
    const generalAlbums = allPublishedAlbums.filter((album) => album.albumType === 'GENERAL');
    // Event albums are GENERAL albums with category 'EVENTS' or title containing 'event'
    const eventAlbums = generalAlbums.filter((album) => 
      album.title.toLowerCase().includes('event') || 
      album.description?.toLowerCase().includes('event')
    );
    const classPhotos = allItems.filter((item) => item.category === 'CLASS' || item.category === 'ACADEMIC');
    
    return {
      totalAlbums: generalAlbums.length,
      totalPhotos: allItems.length,
      eventsCount: eventAlbums.length, // Fixed: count event-related albums
      classPhotosCount: classPhotos.length
    };
  }, [allPublishedAlbums, allItems]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAlbumClick = (album: Album | null) => {
    if (!album) {
      console.warn('Attempted to open modal with null album');
      return;
    }
    try {
      setSelectedAlbum(album);
      setModalOpen(true);
    } catch (err) {
      console.error('Error opening album modal:', err);
      setError('Failed to open album');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAlbum(null);
  };

  // Generate JSON-LD structured data for gallery
  const galleryStructuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Holy Cross Convent School Brooklyn Gallery',
    description: 'School gallery showcasing class photos, events, celebrations, and community moments',
    image: [
      ...allItems.slice(0, 10).map((item) => ({
        '@type': 'ImageObject',
        contentUrl: item.type === 'IMAGE' ? GalleryService.getItemImageUrl(item.fileName) : undefined,
        name: item.title,
        description: item.description
      })).filter((img) => img.contentUrl)
    ],
    numberOfItems: stats.totalPhotos
  }), [allItems, stats.totalPhotos]);

  if (loading && activeTab === 0) {
    return (
      <>
        <HeroSection>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 3, borderRadius: 2 }} />
              <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 4 }} />
              <Grid container spacing={3} sx={{ maxWidth: '900px', mx: 'auto', mt: 4 }}>
                {[1, 2, 3].map((i) => (
                  <Grid item xs={6} sm={4} key={i}>
                    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
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
      
      {/* Preload hero image and JSON-LD */}
      <Helmet>
        <link rel="preload" as="image" href="/MUSIC03.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(galleryStructuredData)}
        </script>
      </Helmet>

      {/* Hero Section - Showcasing HCC Story */}
      <HeroSection>
        {/* Return to Home - positioned outside hero to avoid clash */}
        <Box sx={{ 
          position: 'fixed', 
          top: { xs: 100, sm: 100 }, 
          left: 16, 
          zIndex: 1300,
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
          <Fade in timeout={1000} appear={false}>
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  mb: 3,
                  color: '#ffd700',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)',
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
                  textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.6)',
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
                  textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
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
              <Slide direction="up" in timeout={1500} appear={false}>
                <Box>
                  <Grid container spacing={3} sx={{ maxWidth: '900px', mx: 'auto', mt: 4 }}>
                    <Grid item xs={6} sm={4}>
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
                    <Grid item xs={6} sm={4}>
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
                    <Grid item xs={6} sm={4}>
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
              role="tablist"
              data-testid="gallery-tabs"
            >
              <Tab
                icon={<Event />}
                iconPosition="start"
                label="Events & Occasions"
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
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      fontFamily: '"Poppins", sans-serif'
                    }}
                  >
                    Events & Occasions
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#666', 
                      maxWidth: '700px', 
                      mx: 'auto',
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 400
                    }}
                  >
                    Celebrating our community through moments of joy, achievement, and togetherness
                  </Typography>
                  <Chip
                    icon={<PhotoLibrary />}
                    label={`${stats.eventsCount} Event Album${stats.eventsCount !== 1 ? 's' : ''}`}
                    sx={{
                      backgroundColor: '#d32f2f',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      px: 2,
                      py: 2,
                      mt: 2,
                      fontFamily: '"Poppins", sans-serif'
                    }}
                    data-testid="events-count-chip"
                  />
                </Box>
              </Fade>
            </SectionHeader>

            {eventsAlbums.length === 0 ? (
              <Alert severity="info" sx={{ mt: 4, fontFamily: '"Poppins", sans-serif' }}>
                No event albums available yet. Event albums will appear here once uploaded.
              </Alert>
            ) : (
              <Grid container spacing={4} data-testid="events-albums-grid">
                {eventsAlbums.map((album, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={album.id || `album-${album.title}-${index}`}>
                    <Fade in timeout={600 + Math.min(index * 100, 1000)} appear={false}>
                      <Box>
                        <AlbumCard album={album} onClick={handleAlbumClick} />
                        {album.subAlbums && album.subAlbums.length > 0 && (
                          <Box
                            sx={{
                              mt: 2,
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: 'rgba(26,35,126,0.04)',
                              border: '1px dashed rgba(26,35,126,0.2)',
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, color: '#1a237e', fontFamily: '"Poppins", sans-serif', mb: 1 }}
                            >
                              Featured Albums
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {album.subAlbums.map((sub) => (
                                <Chip
                                  key={sub.id || `sub-${sub.title}`}
                                  label={sub.title}
                                  onClick={() => handleAlbumClick(sub)}
                                  clickable
                                  sx={{
                                    bgcolor: '#ffffff',
                                    border: '1px solid rgba(26,35,126,0.2)',
                                    fontWeight: 600,
                                    fontFamily: '"Poppins", sans-serif',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      bgcolor: '#e8eaf6',
                                      transform: 'scale(1.05)',
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
          </CustomTabPanel>

          {/* All Gallery Tab */}
          <CustomTabPanel value={activeTab} index={1}>
            <SectionHeader>
              <Fade in timeout={800} appear={false}>
                <Box>
                  <PhotoLibrary sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                      fontWeight: 800,
                      color: '#1a237e',
                      mb: 2,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      fontFamily: '"Poppins", sans-serif'
                    }}
                  >
                    All Gallery
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#666', 
                      maxWidth: '700px', 
                      mx: 'auto',
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 400
                    }}
                  >
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
                      mt: 2,
                      fontFamily: '"Poppins", sans-serif'
                    }}
                  />
                </Box>
              </Fade>
            </SectionHeader>

            {allItems.length === 0 ? (
              <Alert severity="info" sx={{ mt: 4, fontFamily: '"Poppins", sans-serif' }}>
                No photos available yet. Photos will appear here once uploaded.
              </Alert>
            ) : (
              <Box data-testid="all-gallery-grid">
                <ImageGrid 
                  items={allItems} 
                  loading={false} 
                  plainMode={true}
                />
              </Box>
            )}
          </CustomTabPanel>
        </Container>
      </GalleryContainer>

      {/* Album Modal */}
      {selectedAlbum && (
        <AlbumModal
          open={modalOpen}
          album={selectedAlbum}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Gallery; 
