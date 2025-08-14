import React, { useState, useMemo, memo, useCallback, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Zoom,
  Skeleton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  ZoomIn as ZoomInIcon,
  Fullscreen as FullscreenIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { assetManager, Asset, AssetCategory } from '../utils/assetManager';

// TypeScript interfaces for type safety
interface EnhancedGalleryProps {
  title?: string;
  subtitle?: string;
}

interface ImageCardProps {
  asset: Asset;
  onClick: (asset: Asset) => void;
  index: number;
}

interface LightboxProps {
  open: boolean;
  onClose: () => void;
  selectedImage: Asset | null;
  currentIndex: number;
  totalImages: number;
  onPrevious: () => void;
  onNext: () => void;
  assets: Asset[];
}

// Styled components
const GalleryContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  background: 'linear-gradient(135deg, #fff3e0 0%, #e0f7fa 100%)', // School-friendly gradient
  minHeight: '100vh',
  width: '100%',
  overflow: 'hidden'
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}));

const ImageCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: theme.shadows[12],
    borderColor: '#ffca28',
    '& .image-overlay': {
      opacity: 1,
    },
    '& .zoom-icon': {
      transform: 'scale(1.1)',
    }
  }
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(26, 35, 126, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 1,
}));

const LightboxDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(10px)',
    maxWidth: '95vw',
    maxHeight: '95vh',
    borderRadius: theme.spacing(2),
    border: '1px solid rgba(255, 255, 255, 0.1)',
  }
}));

const LightboxImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '85vh',
  objectFit: 'contain',
  borderRadius: '8px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  }
});

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-50%) scale(1.1)',
  },
  '&.prev': {
    left: theme.spacing(2)
  },
  '&.next': {
    right: theme.spacing(2)
  }
}));

const LoadingSkeleton = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
}));

// Memoized subcomponents
const ImageCardComponent = memo(({ asset, onClick, index }: ImageCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleClick = useCallback(() => {
    onClick(asset);
  }, [asset, onClick]);

  return (
    <Zoom in timeout={300 + index * 100}>
      <Box sx={{ 
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <ImageCard 
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label={`View ${asset.description || asset.alt}`}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <Box sx={{ position: 'relative' }}>
            {!imageLoaded && !imageError && (
              <LoadingSkeleton 
                variant="rectangular" 
                width="100%" 
                height={200} 
                animation="wave"
              />
            )}
            <CardMedia
              component="img"
              image={asset.path}
              alt={asset.alt}
              onLoad={handleImageLoad}
              onError={handleImageError}
              sx={{
                height: 200,
                objectFit: 'cover',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: imageLoaded ? 'block' : 'none',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
            <ImageOverlay className="image-overlay">
              <ZoomInIcon 
                className="zoom-icon"
                sx={{ 
                  color: 'white', 
                  fontSize: 48,
                  transition: 'transform 0.3s ease',
                }} 
              />
            </ImageOverlay>
          </Box>
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom 
              noWrap
              sx={{ color: '#1a237e', fontWeight: 600 }}
            >
              {asset.description || asset.alt}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
              <Chip 
                label={asset.category}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ 
                  borderColor: '#ffca28',
                  color: '#1a237e',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                  }
                }}
              />
              {asset.size && (
                <Chip 
                  label={asset.size}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderColor: '#1a237e',
                    color: '#1a237e',
                  }}
                />
              )}
            </Box>
          </CardContent>
        </ImageCard>
      </Box>
    </Zoom>
  );
});

const LightboxComponent = memo(({ 
  open, 
  onClose, 
  selectedImage, 
  currentIndex, 
  totalImages, 
  onPrevious, 
  onNext, 
  assets 
}: LightboxProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [selectedImage]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      onPrevious();
    } else if (event.key === 'ArrowRight') {
      onNext();
    } else if (event.key === 'Escape') {
      onClose();
    }
  }, [onPrevious, onNext, onClose]);

  if (!selectedImage) return null;

  return (
    <LightboxDialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      onKeyDown={handleKeyDown}
      TransitionComponent={Slide}
      transitionDuration={300}
      aria-labelledby="lightbox-title"
      aria-describedby="lightbox-description"
    >
      <DialogContent sx={{ position: 'relative', p: 0 }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }
          }}
          aria-label="Close lightbox"
        >
          <CloseIcon />
        </IconButton>

        <Fade in={imageLoaded} timeout={300}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <LightboxImage
              src={selectedImage.path}
              alt={selectedImage.alt}
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
            {!imageLoaded && (
              <CircularProgress size={60} sx={{ color: 'white' }} />
            )}
          </Box>
        </Fade>
        
        <NavigationButton
          className="prev"
          onClick={onPrevious}
          disabled={totalImages <= 1}
          aria-label="Previous image"
        >
          <NavigateBeforeIcon />
        </NavigationButton>
        
        <NavigationButton
          className="next"
          onClick={onNext}
          disabled={totalImages <= 1}
          aria-label="Next image"
        >
          <NavigateNextIcon />
        </NavigationButton>

        {/* Image Info */}
        <Fade in timeout={500}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
              color: 'white',
              p: 3,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h6" gutterBottom id="lightbox-title">
              {selectedImage.description || selectedImage.alt}
            </Typography>
            <Typography variant="body2" id="lightbox-description">
              {currentIndex + 1} of {totalImages} • {selectedImage.size}
            </Typography>
          </Box>
        </Fade>
      </DialogContent>
    </LightboxDialog>
  );
});

const EnhancedGallery: React.FC<EnhancedGalleryProps> = ({
  title = "School Gallery",
  subtitle = "Explore our school life through photos"
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all assets and collections
  const allAssets = assetManager.getGalleryAssets();
  const collections = assetManager.getAllCollections().filter(collection => 
    collection.category !== 'logo' && 
    collection.category !== 'staff' && 
    collection.category !== 'system'
  );

  // Filter assets based on search and category
  const filteredAssets = useMemo(() => {
    let filtered = allAssets;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(asset => asset.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(asset =>
        asset.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.alt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [allAssets, selectedCategory, searchQuery]);

  // Handle image click
  const handleImageClick = useCallback((asset: Asset) => {
    setSelectedImage(asset);
    setCurrentImageIndex(filteredAssets.findIndex(a => a.id === asset.id));
    setLightboxOpen(true);
  }, [filteredAssets]);

  // Handle lightbox navigation
  const handlePrevious = useCallback(() => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredAssets.length - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredAssets[newIndex]);
  }, [currentImageIndex, filteredAssets]);

  const handleNext = useCallback(() => {
    const newIndex = currentImageIndex < filteredAssets.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredAssets[newIndex]);
  }, [currentImageIndex, filteredAssets]);

  // Handle lightbox close
  const handleLightboxClose = useCallback(() => {
    setLightboxOpen(false);
    setSelectedImage(null);
  }, []);

  return (
    <GalleryContainer role="main" aria-label="School gallery">
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Fade in timeout={500}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                color: '#1a237e', 
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ mb: 2 }}
            >
              {subtitle}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {filteredAssets.length} of {allAssets.length} images
            </Typography>
          </Box>
        </Fade>

        {/* Search and Filter Controls */}
        <Slide direction="up" in timeout={600}>
          <SearchContainer>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{ 
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                }
              }}
              aria-label="Search images"
            />
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value as AssetCategory | 'all')}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                }}
                aria-label="Filter by category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {collections.map((collection) => (
                  <MenuItem key={collection.category} value={collection.category}>
                    {collection.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </SearchContainer>
        </Slide>

        {/* Gallery Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: { xs: 2, sm: 3 },
          width: '100%',
          maxWidth: '100%'
        }}>
          {filteredAssets.map((asset, index) => (
            <ImageCardComponent 
              key={asset.id} 
              asset={asset} 
              onClick={handleImageClick}
              index={index}
            />
          ))}
        </Box>

        {/* No Results */}
        {filteredAssets.length === 0 && (
          <Fade in timeout={500}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  No images found
                </Typography>
                <Typography variant="body2">
                  Try adjusting your search or filter criteria
                </Typography>
              </Alert>
            </Box>
          </Fade>
        )}

        {/* Lightbox Dialog */}
        <LightboxComponent
          open={lightboxOpen}
          onClose={handleLightboxClose}
          selectedImage={selectedImage}
          currentIndex={currentImageIndex}
          totalImages={filteredAssets.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          assets={filteredAssets}
        />
      </Container>
    </GalleryContainer>
  );
};

export default memo(EnhancedGallery); 