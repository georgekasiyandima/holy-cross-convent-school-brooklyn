import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  height?: string | number;
  overlay?: boolean;
}

const BannerSection = styled(Box)<{ backgroundImage: string; overlay?: boolean }>(({ theme, backgroundImage, overlay }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  backgroundImage: `url('${backgroundImage}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  height: '60vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  textAlign: 'center',
  overflow: 'hidden',
  zIndex: 1000,
  '&::before': overlay ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.8) 0%, rgba(57, 73, 171, 0.8) 50%, rgba(92, 107, 192, 0.8) 100%)',
    zIndex: 1
  } : {},
  '& > *': {
    position: 'relative',
    zIndex: 2
  }
}));

const BannerContent = styled(Box)(({ theme }) => ({
  maxWidth: '800px',
  padding: theme.spacing(4, 2)
}));

const PageBanner: React.FC<PageBannerProps> = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  height = '60vh',
  overlay = true 
}) => {
  return (
    <>
      <BannerSection 
        backgroundImage={backgroundImage} 
        overlay={overlay}
        sx={{ height: height }}
      >
        <Container maxWidth="lg">
          <BannerContent>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                mb: 2,
                background: 'linear-gradient(45deg, #ffffff 30%, #ffd700 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {title}
            </Typography>
            
            {subtitle && (
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  fontWeight: 400,
                  opacity: 0.95,
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </BannerContent>
        </Container>
      </BannerSection>
      {/* Spacer to push content below the fixed banner */}
      <Box sx={{ height: height, width: '100%' }} />
    </>
  );
};

export default PageBanner;
