import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Skeleton, Avatar, IconButton, Tooltip } from '@mui/material';
import { Person, Refresh } from '@mui/icons-material';
import ImageService from '../services/imageService';

const imageService = ImageService.getInstance();

// =============================
// TYPES & INTERFACES
// =============================

interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  variant?: 'avatar' | 'image' | 'thumbnail';
  fallbackText?: string;
  config?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  };
  onLoad?: () => void;
  onError?: () => void;
  showRetry?: boolean;
  priority?: boolean;
  className?: string;
  sx?: any;
}

// =============================
// OPTIMIZED IMAGE COMPONENT
// =============================

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 200,
  height = 200,
  variant = 'image',
  fallbackText,
  config,
  onLoad,
  onError,
  showRetry = true,
  priority = false,
  className,
  sx = {}
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(src || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const mountedRef = useRef(true);

  // Generate initials from alt text if no fallback text provided
  const initials = fallbackText || imageService.getInitials(alt);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadImage = useCallback(async () => {
    if (!src) {
      setLoading(false);
      setError(true);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const loadedUrl = await imageService.loadImage(src, config);
      
      if (mountedRef.current) {
        setImageUrl(loadedUrl);
        setLoading(false);
        onLoad?.();
      }
    } catch (err) {
      console.warn(`Failed to load image: ${src}`, err);
      
      if (mountedRef.current) {
        setError(true);
        setLoading(false);
        onError?.();
      }
    }
  }, [src, config, onLoad, onError]);

  useEffect(() => {
    loadImage();
  }, [loadImage, retryCount]);

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
    }
  };

  const handleImageError = () => {
    setError(true);
    setLoading(false);
    onError?.();
  };

  // Loading skeleton
  if (loading && !error) {
    if (variant === 'avatar') {
      return (
        <Skeleton 
          variant="circular" 
          width={width} 
          height={height} 
          sx={{ ...sx }}
        />
      );
    }
    
    return (
      <Skeleton 
        variant="rectangular" 
        width={width} 
        height={height}
        sx={{ borderRadius: 2, ...sx }}
      />
    );
  }

  // Error state
  if (error || !imageUrl) {
    if (variant === 'avatar') {
      return (
        <Avatar
          sx={{ 
            width, 
            height, 
            bgcolor: '#1a237e',
            color: 'white',
            fontSize: width * 0.4,
            ...sx 
          }}
          className={className}
        >
          {showRetry && retryCount < maxRetries ? (
            <Tooltip title="Retry loading image">
              <IconButton
                onClick={handleRetry}
                sx={{ color: 'white' }}
                size="small"
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            initials
          )}
        </Avatar>
      );
    }

    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          color: '#666',
          ...sx
        }}
        className={className}
      >
        <Person sx={{ fontSize: width * 0.3, mb: 1, color: '#999' }} />
        <Box sx={{ fontSize: '0.75rem', textAlign: 'center' }}>
          {showRetry && retryCount < maxRetries ? (
            <Tooltip title="Retry loading image">
              <IconButton onClick={handleRetry} size="small">
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            initials
          )}
        </Box>
      </Box>
    );
  }

  // Success state
  if (variant === 'avatar') {
  return (
    <Avatar
      src={imageUrl}
      alt={alt}
      sx={{ 
        width, 
        height, 
        '& .MuiAvatar-img': {
          objectFit: 'cover',
          objectPosition: 'center top', // Center horizontally, align to top to show face
        },
        ...sx 
      }}
      className={className}
      onError={handleImageError}
    >
      {initials}
    </Avatar>
  );
  }

  return (
    <Box
      component="img"
      src={imageUrl}
      alt={alt}
      onError={handleImageError}
      sx={{
        width,
        height,
        objectFit: 'cover',
        borderRadius: 2,
        ...sx
      }}
      className={className}
    />
  );
};

// =============================
// SPECIALIZED COMPONENTS
// =============================

export const StaffAvatar: React.FC<{
  src?: string | null;
  name: string;
  size?: number;
  category?: 'LEADERSHIP' | 'TEACHING' | 'SUPPORT';
  sx?: any;
}> = ({ src, name, size = 80, category, sx = {} }) => {
  const getCategoryColor = () => {
    switch (category) {
      case 'LEADERSHIP': return '#1a237e';
      case 'TEACHING': return '#ffd700';
      case 'SUPPORT': return '#4caf50';
      default: return '#1a237e';
    }
  };

  return (
    <OptimizedImage
      src={src}
      alt={name}
      width={size}
      height={size}
      variant="avatar"
      fallbackText={imageService.getInitials(name)}
      config={{ 
        width: size * 2, // Load higher resolution for retina displays
        quality: 90,
        format: 'webp'
      }}
      sx={{
        bgcolor: getCategoryColor(),
        color: 'white',
        fontWeight: 600,
        '& .MuiAvatar-img': {
          objectFit: 'cover',
          objectPosition: 'center 30%', // Center horizontally, focus on upper portion for faces
        },
        ...sx
      }}
    />
  );
};

export const GalleryImage: React.FC<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sx?: any;
}> = ({ src, alt, width = 300, height = 200, priority = false, sx = {} }) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      variant="image"
      config={{
        width: width * 2, // Retina resolution
        quality: 85,
        format: 'webp',
        fit: 'cover'
      }}
      priority={priority}
      sx={{
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)'
        },
        ...sx
      }}
    />
  );
};

export const NewsImage: React.FC<{
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  sx?: any;
}> = ({ src, alt, width = 400, height = 250, sx = {} }) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      variant="image"
      config={{
        width,
        quality: 80,
        format: 'webp',
        fit: 'cover'
      }}
      sx={{
        borderRadius: 1,
        ...sx
      }}
    />
  );
};

export default OptimizedImage;
