import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PhotoLibrary,
  PlayArrow
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { GalleryItem } from '../../services/galleryService';
import GalleryService from '../../services/galleryService';
import ImageLightbox from './ImageLightbox';

const ImageCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  border: '1px solid #e0e0e0',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    borderColor: '#1a237e',
    '& .image-overlay': {
      opacity: 1
    }
  }
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 250,
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    height: 200
  }
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(26, 35, 126, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 1
}));

interface ImageGridProps {
  items: GalleryItem[];
  loading?: boolean;
  onImageClick?: (item: GalleryItem, index: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ items, loading = false, onImageClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageClick = (item: GalleryItem, index: number) => {
    if (onImageClick) {
      onImageClick(item, index);
    } else {
      setSelectedIndex(index);
      setLightboxOpen(true);
    }
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  const handleNext = () => {
    if (selectedIndex < items.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <PhotoLibrary sx={{ fontSize: 64, color: '#999', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" sx={{ color: '#666' }}>
          No images found
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {items.map((item, index) => {
          const imageUrl = item.type === 'IMAGE' 
            ? GalleryService.getItemImageUrl(item.fileName)
            : null;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <ImageCard onClick={() => handleImageClick(item, index)}>
                <ImageContainer>
                  {item.type === 'IMAGE' && imageUrl ? (
                    <>
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={item.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <ImageOverlay className="image-overlay">
                        <PhotoLibrary sx={{ fontSize: 48, color: '#ffffff' }} />
                      </ImageOverlay>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#999' }}>
                      <PlayArrow sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Video
                      </Typography>
                    </Box>
                  )}
                </ImageContainer>
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#1a237e',
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.title}
                  </Typography>
                  {item.category && (
                    <Chip
                      label={item.category}
                      size="small"
                      sx={{
                        fontSize: '0.75rem',
                        height: 24
                      }}
                    />
                  )}
                </CardContent>
              </ImageCard>
            </Grid>
          );
        })}
      </Grid>

      {/* Lightbox */}
      <ImageLightbox
        open={lightboxOpen}
        item={items[selectedIndex] || null}
        items={items}
        currentIndex={selectedIndex}
        onClose={handleCloseLightbox}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </>
  );
};

export default ImageGrid;


