import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Skeleton,
  Alert,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const FacebookContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: 200,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f0f2f5',
  borderRadius: theme.spacing(1),
  overflow: 'hidden'
}));

const FallbackImage = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
  borderRadius: 8
});

const EmbedWrapper = styled(Box)({
  width: '100%',
  '& .fb-post': {
    width: '100% !important',
    maxWidth: '100% !important'
  }
});

interface FacebookEmbedProps {
  facebookUrl: string;
  fallbackImage?: string;
  fallbackAlt?: string;
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  onError?: () => void;
}

const FacebookEmbed: React.FC<FacebookEmbedProps> = ({
  facebookUrl,
  fallbackImage,
  fallbackAlt,
  title,
  description,
  category,
  date,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [embedId] = useState(`fb-embed-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Load Facebook SDK if not already loaded
    if (!window.FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        // Re-parse Facebook embeds after SDK loads
        if (window.FB) {
          window.FB.XFBML.parse();
        }
      };
      script.onerror = () => {
        setHasError(true);
        setIsLoading(false);
        onError?.();
      };
      document.head.appendChild(script);
    } else {
      // SDK already loaded, parse immediately
      window.FB.XFBML.parse();
    }

    // Set loading timeout
    const timeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
        onError?.();
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [facebookUrl, isLoading, onError]);

  // Handle embed load success
  const handleEmbedLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Handle embed load error
  const handleEmbedError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  // Retry loading
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with metadata */}
      {(title || description || category || date) && (
        <CardContent sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ flex: 1 }}>
              {title && (
                <Typography variant="h6" component="h3" gutterBottom noWrap>
                  {title}
                </Typography>
              )}
              {description && (
                <Collapse in={isExpanded}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {description}
                  </Typography>
                </Collapse>
              )}
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{ ml: 1 }}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {category && (
              <Chip 
                label={category}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {date && (
              <Chip 
                label={date}
                size="small"
                variant="outlined"
              />
            )}
            <Chip 
              icon={<FacebookIcon />}
              label="Facebook Post"
              size="small"
              color="secondary"
              variant="outlined"
            />
          </Box>
        </CardContent>
      )}

      {/* Facebook Embed or Fallback */}
      <Box sx={{ flex: 1, p: 2, pt: 0 }}>
        {isLoading && (
          <FacebookContainer>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </FacebookContainer>
        )}

        {hasError && fallbackImage ? (
          <Box>
            <Alert 
              severity="warning" 
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={handleRetry}
                >
                  <RefreshIcon />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Facebook embed failed. Showing fallback image.
            </Alert>
            <FallbackImage
              src={fallbackImage}
              alt={fallbackAlt || title || 'Facebook post image'}
            />
          </Box>
        ) : hasError ? (
          <Alert severity="error">
            Failed to load Facebook post. Please check the URL.
          </Alert>
        ) : (
          <EmbedWrapper>
            <div
              id={embedId}
              className="fb-post"
              data-href={facebookUrl}
              data-width="auto"
              data-show-text="true"
              onLoad={handleEmbedLoad}
              onError={handleEmbedError}
            />
          </EmbedWrapper>
        )}
      </Box>
    </Card>
  );
};

export default FacebookEmbed; 