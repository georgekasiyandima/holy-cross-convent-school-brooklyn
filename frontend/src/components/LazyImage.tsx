import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { Box, Skeleton, Fade, Zoom, Alert, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// TypeScript interfaces for type safety
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  sx?: any;
  placeholder?: string;
  fallbackText?: string;
  showErrorAlert?: boolean;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: number | string;
  shadow?: boolean;
  hoverEffect?: boolean;
}

// Styled components
const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const LoadingSkeleton = styled(Skeleton)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 193, 7, 0.1)',
  '&::after': {
    background: 'linear-gradient(90deg, transparent, rgba(255, 193, 7, 0.2), transparent)',
  },
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 193, 7, 0.1)',
  border: '2px dashed rgba(255, 193, 7, 0.3)',
  borderRadius: theme.spacing(1),
  color: '#1a237e',
  fontSize: '0.875rem',
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  sx = {},
  placeholder = '/HCLOGO1.png',
  fallbackText = 'Image not available',
  showErrorAlert = false,
  priority = false,
  objectFit = 'cover',
  borderRadius = 0,
  shadow = false,
  hoverEffect = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px 0px', // Start loading 100px before the image comes into view
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Handle image load success
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsLoading(false);
  }, []);

  // Handle image load error
  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
    setIsLoading(false);
  }, []);

  // Preload image if priority
  useEffect(() => {
    if (priority && src) {
      const img = new Image();
      img.onload = handleLoad;
      img.onerror = handleError;
      img.src = src;
    }
  }, [priority, src, handleLoad, handleError]);

  return (
    <ImageContainer
      ref={imgRef}
      sx={{
        width,
        height,
        borderRadius,
        boxShadow: shadow ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
        ...sx
      }}
      role="img"
      aria-label={alt}
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <Fade in timeout={300}>
          <LoadingSkeleton
            variant="rectangular"
            animation="wave"
          />
        </Fade>
      )}
      
      {/* Error State */}
      {hasError && !isLoaded && (
        <Fade in timeout={500}>
          <ErrorContainer>
            <Box>
              <Box sx={{ fontSize: '2rem', mb: 1 }}>🖼️</Box>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {fallbackText}
              </Typography>
            </Box>
          </ErrorContainer>
        </Fade>
      )}

      {/* Error Alert */}
      {hasError && showErrorAlert && (
        <Alert 
          severity="warning" 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            left: 8, 
            right: 8,
            zIndex: 1,
            fontSize: '0.75rem'
          }}
        >
          Failed to load image
        </Alert>
      )}
      
      {/* Actual Image */}
      {isInView && (
        <Zoom in={isLoaded} timeout={500}>
          <StyledImage
            src={hasError ? placeholder : src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              objectFit,
              opacity: isLoaded ? 1 : 0,
              transform: hoverEffect ? 'scale(1)' : 'none',
            }}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </Zoom>
      )}
    </ImageContainer>
  );
};

export default memo(LazyImage); 