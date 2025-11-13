import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  PhotoLibrary,
  PlayArrow
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { GalleryItem } from '../../services/galleryService';
import GalleryService from '../../services/galleryService';
import ImageLightbox from './ImageLightbox';

const ImageCard = styled(Card)<{ plain?: boolean }>(({ theme, plain }) => ({
  height: 'auto',
  minHeight: '100%',
  cursor: 'pointer',
  background: plain ? 'transparent' : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  border: 'none',
  borderRadius: theme.spacing(plain ? 2 : 3),
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  boxShadow: plain ? '0 4px 16px rgba(0, 0, 0, 0.1)' : '0 8px 32px rgba(0, 0, 0, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
    transform: 'scaleX(0)',
    transition: 'transform 0.4s ease',
    zIndex: 1,
    borderRadius: theme.spacing(plain ? 2 : 3, plain ? 2 : 3, 0, 0),
    display: plain ? 'none' : 'block'
  },
  '&:hover': {
    transform: plain ? 'translateY(-4px) scale(1.02)' : 'translateY(-12px) scale(1.02)',
    boxShadow: plain ? '0 8px 24px rgba(0, 0, 0, 0.15)' : '0 24px 48px rgba(211, 47, 47, 0.2)',
    '&::before': {
      transform: 'scaleX(1)',
    },
    '& .image-overlay': {
      opacity: 1
    }
  }
}));

const ImageContainer = styled(Box)<{ plain?: boolean }>(({ theme, plain }) => ({
  position: 'relative',
  width: '100%',
  minHeight: 200,
  padding: plain ? 0 : theme.spacing(2),
  overflow: 'hidden',
  backgroundColor: plain ? 'transparent' : '#fafafa',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    minHeight: 180,
    padding: plain ? 0 : theme.spacing(1.5)
  }
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  right: theme.spacing(2),
  bottom: theme.spacing(2),
  background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.85) 0%, rgba(211, 47, 47, 0.75) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.4s ease',
  zIndex: 1,
  backdropFilter: 'blur(2px)',
  borderRadius: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    top: theme.spacing(1.5),
    left: theme.spacing(1.5),
    right: theme.spacing(1.5),
    bottom: theme.spacing(1.5)
  }
}));

interface ImageGridProps {
  items: GalleryItem[];
  loading?: boolean;
  onImageClick?: (item: GalleryItem, index: number) => void;
  plainMode?: boolean; // If true, hide titles and tags for clean display
}

const ImageGrid: React.FC<ImageGridProps> = ({ items, loading = false, onImageClick, plainMode = false }) => {
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

          // Debug: Log image URLs to help troubleshoot (dev only)
          if (process.env.NODE_ENV === 'development' && item.type === 'IMAGE' && imageUrl) {
            console.log('Gallery Image URL:', {
              fileName: item.fileName,
              imageUrl,
              itemId: item.id
            });
          }

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <ImageCard plain={plainMode} onClick={() => handleImageClick(item, index)}>
                <ImageContainer plain={plainMode}>
                  {item.type === 'IMAGE' && imageUrl ? (
                    <>
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={item.title}
                        loading="lazy"
                        onError={(e) => {
                          console.error('Image failed to load:', {
                            imageUrl,
                            fileName: item.fileName,
                            itemId: item.id
                          });
                          // Set a fallback or show error state
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        onLoad={() => {
                          if (process.env.NODE_ENV === 'development') {
                            console.log('Image loaded successfully:', imageUrl);
                          }
                        }}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '500px',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                          backgroundColor: 'transparent',
                          borderRadius: plainMode ? 0 : 1
                        }}
                      />
                      {!plainMode && (
                        <ImageOverlay className="image-overlay">
                          <PhotoLibrary sx={{ fontSize: 48, color: '#ffffff' }} />
                        </ImageOverlay>
                      )}
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
                {!plainMode && (
                  <CardContent sx={{ p: 3, pt: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: '#1a237e',
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontFamily: '"Poppins", sans-serif',
                        fontSize: '1rem'
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
                          height: 26,
                          fontWeight: 600,
                          backgroundColor: item.category === 'SPORTS' ? '#4caf50' :
                                          item.category === 'ACADEMIC' ? '#ff9800' :
                                          item.category === 'CULTURAL' ? '#9c27b0' :
                                          item.category === 'EVENTS' ? '#2196f3' :
                                          '#607d8b',
                          color: '#ffffff'
                        }}
                      />
                    )}
                  </CardContent>
                )}
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


