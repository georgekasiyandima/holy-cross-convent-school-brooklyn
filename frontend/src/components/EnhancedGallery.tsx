import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
  styled
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { assetManager, Asset, AssetCategory } from '../utils/assetManager';

// Styled components
const GalleryContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  backgroundColor: '#f8f9fa'
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
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}));

const ImageCardMedia = styled(CardMedia)({
  height: 200,
  objectFit: 'cover',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
});

const LightboxDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    maxWidth: '90vw',
    maxHeight: '90vh'
  }
}));

const LightboxImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '80vh',
  objectFit: 'contain'
});

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  '&.prev': {
    left: theme.spacing(2)
  },
  '&.next': {
    right: theme.spacing(2)
  }
}));

interface EnhancedGalleryProps {
  title?: string;
  subtitle?: string;
}

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
  const allAssets = assetManager.getAllAssets();
  const collections = assetManager.getAllCollections();

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
  const handleImageClick = (asset: Asset) => {
    setSelectedImage(asset);
    setCurrentImageIndex(filteredAssets.findIndex(a => a.id === asset.id));
    setLightboxOpen(true);
  };

  // Handle lightbox navigation
  const handlePrevious = () => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredAssets.length - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredAssets[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentImageIndex < filteredAssets.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredAssets[newIndex]);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    } else if (event.key === 'Escape') {
      setLightboxOpen(false);
    }
  };

  return (
    <GalleryContainer>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#1a237e', fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {filteredAssets.length} of {allAssets.length} images
          </Typography>
        </Box>

        {/* Search and Filter Controls */}
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
            sx={{ flexGrow: 1 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value as AssetCategory | 'all')}
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

        {/* Gallery Grid */}
        <Grid container spacing={3}>
          {filteredAssets.map((asset) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={asset.id}>
              <ImageCard onClick={() => handleImageClick(asset)}>
                <ImageCardMedia
                  component="img"
                  image={asset.path}
                  alt={asset.alt}
                  title={asset.description}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {asset.description || asset.alt}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={collections.find(c => c.category === asset.category)?.title || asset.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {asset.size && (
                      <Chip 
                        label={asset.size}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
              </ImageCard>
            </Grid>
          ))}
        </Grid>

        {/* No Results */}
        {filteredAssets.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No images found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}

        {/* Lightbox Dialog */}
        <LightboxDialog
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          maxWidth={false}
          fullWidth
          onKeyDown={handleKeyDown}
        >
          <DialogContent sx={{ position: 'relative', p: 0 }}>
            <IconButton
              onClick={() => setLightboxOpen(false)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'white',
                zIndex: 1
              }}
            >
              <CloseIcon />
            </IconButton>

            {selectedImage && (
              <>
                <LightboxImage
                  src={selectedImage.path}
                  alt={selectedImage.alt}
                />
                
                <NavigationButton
                  className="prev"
                  onClick={handlePrevious}
                  disabled={filteredAssets.length <= 1}
                >
                  <NavigateBeforeIcon />
                </NavigationButton>
                
                <NavigationButton
                  className="next"
                  onClick={handleNext}
                  disabled={filteredAssets.length <= 1}
                >
                  <NavigateNextIcon />
                </NavigationButton>

                {/* Image Info */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    p: 2
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {selectedImage.description || selectedImage.alt}
                  </Typography>
                  <Typography variant="body2">
                    {currentImageIndex + 1} of {filteredAssets.length} • {selectedImage.size}
                  </Typography>
                </Box>
              </>
            )}
          </DialogContent>
        </LightboxDialog>
      </Container>
    </GalleryContainer>
  );
};

export default EnhancedGallery; 