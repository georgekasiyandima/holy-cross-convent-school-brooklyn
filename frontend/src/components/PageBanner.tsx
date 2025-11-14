import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  /** 
   * Background image URL or imported image path.
   * For best performance, import images: `import heroImg from './path/to/image.jpg'`
   * Then pass: `backgroundImage={heroImg}`
   */
  backgroundImage: string;
  height?: string | number;
  overlay?: boolean;
}

const BannerSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'scroll', // Default to scroll for better mobile performance
  [theme.breakpoints.up('lg')]: {
    backgroundAttachment: 'fixed' // Fixed only on large screens
  },
  minHeight: '40vh',
  [theme.breakpoints.up('md')]: {
    minHeight: '60vh'
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  textAlign: 'center',
  overflow: 'hidden',
  '& > *': {
    position: 'relative',
    zIndex: 1
  }
}));

const BannerContent = styled(Box)(({ theme }) => ({
  maxWidth: '800px',
  padding: theme.spacing(3, 2) // Reduced padding for better mobile experience
}));

const PageBanner: React.FC<PageBannerProps> = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  height = '60vh',
  overlay = true 
}) => {
  // Validate and normalize height
  const normalizedHeight = typeof height === 'number' ? `${height}px` : height;
  
  return (
    <BannerSection 
      sx={{
        backgroundImage: `url('${backgroundImage}')`,
        height: normalizedHeight,
        '&::before': overlay ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.7) 0%, rgba(57, 73, 171, 0.7) 50%, rgba(92, 107, 192, 0.7) 100%)',
          zIndex: -1, // Behind content
          pointerEvents: 'none' // Allow clicks to pass through
        } : {}
      }}
    >
      <Container maxWidth="md">
        <BannerContent>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
              textShadow: '1px 1px 2px rgba(0,0,0,0.6)', // Reduced for better readability
              mb: 2,
              background: 'linear-gradient(45deg, #ffffff 30%, #ffd700 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'white', // Fallback for Safari
              '@supports not (background-clip: text)': {
                color: '#ffd700' // Fallback for browsers that don't support gradient text
              }
            }}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography 
              variant="h5" 
              component="p" 
              sx={{ 
                fontWeight: 400,
                opacity: 0.95,
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                textShadow: '1px 1px 2px rgba(0,0,0,0.6)' // Reduced for better readability
              }}
            >
              {subtitle}
            </Typography>
          )}
        </BannerContent>
      </Container>
    </BannerSection>
  );
};

export default PageBanner;
