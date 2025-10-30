import React, { useState, useEffect } from 'react';
import { Box, IconButton, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { KeyboardArrowUp } from '@mui/icons-material';

const BackToTopButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  backgroundColor: '#ffd700',
  color: '#1a237e',
  width: 56,
  height: 56,
  zIndex: 1000,
  boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
  '&:hover': {
    backgroundColor: '#ffed4e',
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(255, 215, 0, 0.6)',
  },
  transition: 'all 0.3s ease',
}));

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Fade in={isVisible} timeout={300}>
      <Box sx={{ display: isVisible ? 'block' : 'none' }}>
        <BackToTopButton
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <KeyboardArrowUp sx={{ fontSize: 32 }} />
        </BackToTopButton>
      </Box>
    </Fade>
  );
};

export default BackToTop;

