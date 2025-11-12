import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close,
  NavigateBefore,
  NavigateNext,
  PhotoLibrary,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Album, GalleryItem } from '../../services/galleryService';
import GalleryService from '../../services/galleryService';
import ImageLightbox from './ImageLightbox';

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '400px',
  backgroundColor: '#fafafa',
}));

const AlbumHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  backgroundColor: '#ffffff',
  borderBottom: '2px solid #e0e0e0',
  position: 'sticky',
  top: 0,
  zIndex: 10,
}));

const ImageGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const ImageCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

interface AlbumModalProps {
  open: boolean;
  album: Album | null;
  onClose: () => void;
}

const AlbumModal: React.FC<AlbumModalProps> = ({ open, album, onClose }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open && album) {
      loadAlbumItems();
    } else {
      setItems([]);
    }
  }, [open, album]);

  const loadAlbumItems = async () => {
    if (!album) return;
    
    try {
      setLoading(true);
      const response = await GalleryService.getGalleryItems({
        albumId: album.id,
        isPublished: true,
        limit: 100,
      });
      setItems(response.items);
    } catch (error) {
      console.error('Error loading album items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (item: GalleryItem, index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
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

  if (!album) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            height: isMobile ? '100vh' : 'auto',
          },
        }}
      >
        <AlbumHeader>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
                {album.title}
              </Typography>
              {album.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {album.description}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`${items.length} ${items.length === 1 ? 'photo' : 'photos'}`}
                  size="small"
                  icon={<PhotoLibrary />}
                  sx={{ bgcolor: '#1a237e', color: '#fff' }}
                />
                {album.phase && (
                  <Chip label={album.phase} size="small" sx={{ bgcolor: '#ffd700', color: '#1a237e' }} />
                )}
              </Box>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                ml: 2,
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </AlbumHeader>

        <DialogContent sx={{ p: 0, overflow: 'auto' }}>
          <ModalContainer>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                <CircularProgress size={60} sx={{ color: '#1a237e' }} />
              </Box>
            ) : items.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <PhotoLibrary sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No photos in this album yet
                </Typography>
              </Box>
            ) : (
              <ImageGrid container spacing={2}>
                {items.map((item, index) => {
                  const imageUrl = item.type === 'IMAGE'
                    ? GalleryService.getItemImageUrl(item.fileName)
                    : null;

                  return (
                    <Grid item xs={6} sm={4} md={3} key={item.id}>
                      <ImageCard onClick={() => handleImageClick(item, index)}>
                        {imageUrl ? (
                          <CardMedia
                            component="img"
                            image={imageUrl}
                            alt={item.title}
                            sx={{
                              width: '100%',
                              height: 200,
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: 200,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: '#f5f5f5',
                            }}
                          >
                            <PhotoLibrary sx={{ fontSize: 48, color: '#ccc' }} />
                          </Box>
                        )}
                      </ImageCard>
                    </Grid>
                  );
                })}
              </ImageGrid>
            )}
          </ModalContainer>
        </DialogContent>
      </Dialog>

      {/* Lightbox for full-size image viewing */}
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

export default AlbumModal;

