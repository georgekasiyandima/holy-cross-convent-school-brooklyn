import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close,
  NavigateBefore,
  NavigateNext,
  Download,
  Fullscreen
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { GalleryItem } from '../../services/galleryService';
import GalleryService from '../../services/galleryService';

const LightboxContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000000'
}));

const LightboxImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '90vh',
  objectFit: 'contain',
  [theme.breakpoints.down('sm')]: {
    maxHeight: '70vh'
  }
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  zIndex: 2
}));

const InfoOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
  padding: theme.spacing(3),
  color: '#ffffff'
}));

interface ImageLightboxProps {
  open: boolean;
  item: GalleryItem | null;
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  open,
  item,
  items,
  currentIndex,
  onClose,
  onNext,
  onPrevious
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const hasNext = currentIndex < items.length - 1;
  const hasPrevious = currentIndex > 0;

  if (!item) return null;

  const imageUrl = item.type === 'IMAGE' 
    ? GalleryService.getItemImageUrl(item.fileName)
    : null;

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = item.originalName || item.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          backgroundColor: '#000000',
          m: 0,
          maxHeight: '100vh',
          height: '100vh'
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', height: '100%', overflow: 'hidden' }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }
          }}
        >
          <Close />
        </IconButton>

        {/* Previous Button */}
        {hasPrevious && (
          <NavigationButton
            onClick={onPrevious}
            sx={{ left: 16 }}
            aria-label="Previous image"
          >
            <NavigateBefore sx={{ fontSize: 40 }} />
          </NavigationButton>
        )}

        {/* Next Button */}
        {hasNext && (
          <NavigationButton
            onClick={onNext}
            sx={{ right: 16 }}
            aria-label="Next image"
          >
            <NavigateNext sx={{ fontSize: 40 }} />
          </NavigationButton>
        )}

        {/* Image Container */}
        <LightboxContainer>
          {item.type === 'IMAGE' && imageUrl ? (
            <LightboxImage
              src={imageUrl}
              alt={item.title}
              loading="lazy"
            />
          ) : (
            <Box sx={{ textAlign: 'center', color: '#ffffff', p: 4 }}>
              <Fullscreen sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">
                Video preview not available in lightbox
              </Typography>
            </Box>
          )}
        </LightboxContainer>

        {/* Info Overlay */}
        <InfoOverlay>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
                {item.title}
              </Typography>
              {item.description && (
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                  {item.description}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {item.category && (
                  <Chip
                    label={item.category}
                    size="small"
                    sx={{
                      backgroundColor: '#1a237e',
                      color: '#ffffff',
                      fontWeight: 600
                    }}
                  />
                )}
                {item.tags && item.tags.length > 0 && (
                  item.tags.map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#ffffff',
                        color: '#ffffff'
                      }}
                    />
                  ))
                )}
              </Box>
            </Box>
            {item.type === 'IMAGE' && (
              <IconButton
                onClick={handleDownload}
                sx={{
                  ml: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                <Download />
              </IconButton>
            )}
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {currentIndex + 1} of {items.length}
          </Typography>
        </InfoOverlay>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;


