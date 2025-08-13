import React, { useState, useEffect } from 'react';
import { 
  Fab, 
  Zoom, 
  Box, 
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  KeyboardArrowUp, 
  Home 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface BackToTopProps {
  showHomeButton?: boolean;
  homeButtonTooltip?: string;
  topButtonTooltip?: string;
}

const BackToTop: React.FC<BackToTopProps> = ({ 
  showHomeButton = true,
  homeButtonTooltip = "Back to Home",
  topButtonTooltip = "Back to Top"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const goToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: isMobile ? 16 : 24,
        right: isMobile ? 16 : 24,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      {/* Back to Home Button */}
      {showHomeButton && (
        <Zoom in={true}>
          <Tooltip title={homeButtonTooltip} placement="left">
            <Fab
              color="primary"
              size={isMobile ? "medium" : "large"}
              onClick={goToHome}
              sx={{
                backgroundColor: '#1a237e',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#0d47a1',
                  transform: 'scale(1.1)',
                  boxShadow: '0 8px 25px rgba(26, 35, 126, 0.3)'
                },
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(26, 35, 126, 0.2)'
              }}
            >
              <Home />
            </Fab>
          </Tooltip>
        </Zoom>
      )}

      {/* Back to Top Button */}
      <Zoom in={isVisible}>
        <Tooltip title={topButtonTooltip} placement="left">
          <Fab
            color="secondary"
            size={isMobile ? "medium" : "large"}
            onClick={scrollToTop}
            sx={{
              backgroundColor: '#ffd700',
              color: '#1a237e',
              '&:hover': {
                backgroundColor: '#e6c200',
                transform: 'scale(1.1)',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
              },
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)'
            }}
          >
            <KeyboardArrowUp />
          </Fab>
        </Tooltip>
      </Zoom>
    </Box>
  );
};

export default BackToTop;
