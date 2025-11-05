import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, CircularProgress, Alert, Chip } from '@mui/material';
import { School, PhotoLibrary } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useInView } from 'react-intersection-observer';
import { Fade, Slide } from '@mui/material';
import { Album } from '../../services/galleryService';
import GalleryService from '../../services/galleryService';
import AlbumCard from './AlbumCard';

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
  }
}));

interface ClassPhotosSectionProps {
  onAlbumClick?: (album: Album) => void;
}

const ClassPhotosSection: React.FC<ClassPhotosSectionProps> = ({ onAlbumClick }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const fetchClassPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const classAlbums = await GalleryService.getClassPhotosAlbums();
        setAlbums(classAlbums);
      } catch (err: any) {
        console.error('Error fetching class photos:', err);
        setError(err.message || 'Failed to load class photos');
      } finally {
        setLoading(false);
      }
    };
    fetchClassPhotos();
  }, []);

  const gradeOrder = ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'];
  const groupedAlbums = albums.reduce((acc, album) => {
    const grade = album.classGrade || 'Other';
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(album);
    return acc;
  }, {} as Record<string, Album[]>);

  const sortedGrades = Object.keys(groupedAlbums).sort((a, b) => {
    const aIndex = gradeOrder.indexOf(a);
    const bIndex = gradeOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  if (loading) {
    return (
      <SectionContainer>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        </Container>
      </SectionContainer>
    );
  }

  if (error) {
    return (
      <SectionContainer>
        <Container maxWidth="xl">
          <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        </Container>
      </SectionContainer>
    );
  }

  if (albums.length === 0) {
    return (
      <SectionContainer>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Fade in={inView} timeout={1000}>
              <Box>
                <School sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                <Typography variant="h3" component="h2" sx={{ fontWeight: 800, color: '#1a237e', mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                  Class Photos
                </Typography>
                <Typography variant="h6" sx={{ color: '#666', maxWidth: '700px', mx: 'auto' }}>
                  View photos from each grade level
                </Typography>
              </Box>
            </Fade>
          </Box>
          <Alert severity="info" sx={{ mt: 4 }}>
            No class photos available yet. Class photos will appear here once uploaded.
          </Alert>
        </Container>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer ref={ref}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Fade in={inView} timeout={1000}>
            <Box>
              <School sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, color: '#1a237e', mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                Class Photos 2025
              </Typography>
              <Typography variant="h6" sx={{ color: '#666', maxWidth: '700px', mx: 'auto', mb: 3 }}>
                View class photos from Grade R to Grade 7. Each album contains the official class photos for 2025.
              </Typography>
              <Chip icon={<PhotoLibrary />} label={`${albums.length} Class Album${albums.length !== 1 ? 's' : ''}`} sx={{ bgcolor: '#1a237e', color: '#fff', fontWeight: 600, fontSize: '1rem', px: 2, py: 2 }} />
            </Box>
          </Fade>
        </Box>
        {sortedGrades.map((grade, gradeIndex) => (
          <Box key={grade} sx={{ mb: 6 }}>
            <Slide direction="up" in={inView} timeout={600 + gradeIndex * 200}>
              <Box>
                <Typography variant="h4" component="h3" sx={{ fontWeight: 700, color: '#1a237e', mb: 3, fontSize: { xs: '1.5rem', md: '2rem' }, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 4, height: 40, background: 'linear-gradient(135deg, #1a237e 0%, #ffd700 100%)', borderRadius: 2 }} />
                  {grade}
                </Typography>
                <Grid container spacing={3}>
                  {groupedAlbums[grade].map((album: Album, index: number) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={album.id}>
                      <Fade in={inView} timeout={800 + (gradeIndex * 200) + (index * 100)}>
                        <Box><AlbumCard album={album} onClick={onAlbumClick} /></Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Slide>
          </Box>
        ))}
      </Container>
    </SectionContainer>
  );
};

export default ClassPhotosSection;

