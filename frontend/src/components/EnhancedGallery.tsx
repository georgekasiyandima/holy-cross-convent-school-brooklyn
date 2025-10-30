// src/components/EnhancedGallery.tsx

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  memo
} from 'react';
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
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { assetManager } from '../utils/assetManager';

// ================================
// Types
// ================================
interface Asset {
  id: string;
  title: string;
  description?: string;
  category?: string;
  thumbnail?: string;
}

interface EnhancedGalleryProps {
  title?: string;
  subtitle?: string;
  category?: string;
}

// ================================
// Styled Components
// ================================
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2 || 12,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6]
  }
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  width: '100%'
}));

const AssetGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2)
}));

// ================================
// Component
// ================================
const EnhancedGallery: React.FC<EnhancedGalleryProps> = memo(
  ({ title = 'Gallery', subtitle = '', category }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState<Asset[]>([]);

    useEffect(() => {
      const loadAssets = async () => {
        setLoading(true);
        try {
          // adapt to your assetManager interface
          const data = assetManager.getAllAssets
            ? assetManager.getAllAssets()
            : [];

          // ensure uniform shape
          const normalized = data.map((item: any, idx: number) => ({
            id: item.id || idx.toString(),
            title: item.title || item.name || 'Untitled',
            description: item.description || '',
            category: item.category || 'Uncategorized',
            thumbnail: item.thumbnail || item.image || ''
          }));
          setAssets(normalized);
        } catch (err) {
          console.error('Error loading assets:', err);
        } finally {
          setLoading(false);
        }
      };
      loadAssets();
    }, []);

    const filteredAssets = useMemo(() => {
      return assets.filter(asset => {
        const matchesCategory =
          selectedCategory === 'all' || asset.category === selectedCategory;
        const matchesSearch = asset.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    }, [assets, searchTerm, selectedCategory]);

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
      },
      []
    );

    const handleCategoryChange = useCallback(
      (e: any) => {
        setSelectedCategory(e.target.value);
      },
      []
    );

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {subtitle}
          </Typography>
        )}

        {/* Search + Filter */}
        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'stretch' : 'center'}
          gap={2}
        >
          <SearchBar
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
          />

          <FormControl variant="outlined" sx={{ minWidth: 180 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <MenuItem value="all">All</MenuItem>
              {[...new Set(assets.map(a => a.category))].map(cat => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Grid */}
        {filteredAssets.length > 0 ? (
          <AssetGrid>
            {filteredAssets.map(asset => (
              <Fade in key={asset.id} timeout={400}>
                <StyledCard>
                  {asset.thumbnail && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={asset.thumbnail}
                      alt={asset.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {asset.title}
                    </Typography>
                    {asset.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {asset.description}
                      </Typography>
                    )}
                    <Chip label={asset.category} color="primary" size="small" />
                  </CardContent>
                </StyledCard>
              </Fade>
            ))}
          </AssetGrid>
        ) : (
          <Alert severity="info" sx={{ mt: 4 }}>
            No assets found. Try adjusting your filters.
          </Alert>
        )}
      </Container>
    );
  }
);

export default EnhancedGallery;

// Make sure this file is treated as a module for isolatedModules
export {};
