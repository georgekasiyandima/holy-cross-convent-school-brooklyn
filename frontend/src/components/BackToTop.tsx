import React, { useState, useEffect, memo, useCallback } from 'react';
import { 
  Fab, 
  Zoom, 
  Box, 
  Tooltip,
  useTheme,
  useMediaQuery,
  Fade,
  Slide
} from '@mui/material';
import { 
  KeyboardArrowUp, 
  Home,
  School
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// TypeScript interfaces for type safety
interface BackToTopProps {
  showHomeButton?: boolean;
  showSchoolButton?: boolean;
  homeButtonTooltip?: string;
  schoolButtonTooltip?: string;
  topButtonTooltip?: string;
  scrollThreshold?: number;
}

// Styled components
const StyledFab = styled(Fab)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

const HomeFab = styled(StyledFab)(({ theme }) => ({
  backgroundColor: '#1a237e',
  color: 'white',
  boxShadow: '0 4px 20px rgba(26, 35, 126, 0.2)',
  '&:hover': {
    backgroundColor: '#0d47a1',
    transform: 'scale(1.1) rotate(360deg)',
    boxShadow: '0 8px 25px rgba(26, 35, 126, 0.3)',
  },
}));

const SchoolFab = styled(StyledFab)(({ theme }) => ({
  backgroundColor: '#ffca28',
  color: '#1a237e',
  boxShadow: '0 4px 20px rgba(255, 193, 7, 0.2)',
  '&:hover': {
    backgroundColor: '#e6b800',
    transform: 'scale(1.1) rotate(360deg)',
    boxShadow: '0 8px 25px rgba(255, 193, 7, 0.3)',
  },
}));

const TopFab = styled(StyledFab)(({ theme }) => ({
  backgroundColor: '#ffd700',
  color: '#1a237e',
  boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)',
  '&:hover': {
    backgroundColor: '#e6c200',
    transform: 'scale(1.1) translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
  },
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

// Memoized subcomponents
const ActionButton = React.memo(React.forwardRef<HTMLButtonElement, {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
  fabComponent: typeof StyledFab;
  size: 'small' | 'medium' | 'large';
}>(({
  icon,
  onClick,
  tooltip,
  fabComponent: FabComponent,
  size,
}, ref) => (
  <Tooltip
    title={tooltip}
    placement="left"
    arrow
    enterDelay={500}
    leaveDelay={0}
  >
    <FabComponent
      ref={ref}
      size={size}
      onClick={onClick}
      aria-label={tooltip}
    >
      {icon}
    </FabComponent>
  </Tooltip>
)));

const BackToTop: React.FC<BackToTopProps> = ({ 
  showHomeButton = true,
  showSchoolButton = true,
  homeButtonTooltip = "Back to Home",
  schoolButtonTooltip = "School Information",
  topButtonTooltip = "Back to Top",
  scrollThreshold = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  // Calculate scroll progress
  const calculateScrollProgress = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    setScrollProgress(Math.min(progress, 100));
  }, []);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = useCallback(() => {
    if (window.pageYOffset > scrollThreshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
    calculateScrollProgress();
  }, [scrollThreshold, calculateScrollProgress]);

  // Set the top coordinate to 0 with smooth scrolling
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  const goToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const goToSchoolInfo = useCallback(() => {
    navigate('/info');
  }, [navigate]);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [toggleVisibility]);

  // Don't show home button if already on home page
  const shouldShowHomeButton = showHomeButton && location.pathname !== '/';
  const shouldShowSchoolButton = showSchoolButton && location.pathname !== '/info';

  return (
    <ButtonContainer role="navigation" aria-label="Page navigation buttons">
      {/* School Information Button */}
      {shouldShowSchoolButton && (
        <Slide direction="up" in={isVisible} timeout={300}>
          <span>
            <ActionButton
              icon={<School />}
              onClick={goToSchoolInfo}
              tooltip={schoolButtonTooltip}
              fabComponent={SchoolFab}
              size={isMobile ? "medium" : "large"}
            />
          </span>
        </Slide>
      )}

      {/* Back to Home Button */}
      {shouldShowHomeButton && (
        <Slide direction="up" in={isVisible} timeout={400}>
          <span>
            <ActionButton
              icon={<Home />}
              onClick={goToHome}
              tooltip={homeButtonTooltip}
              fabComponent={HomeFab}
              size={isMobile ? "medium" : "large"}
            />
          </span>
        </Slide>
      )}

      {/* Back to Top Button */}
      <Fade in={isVisible} timeout={300}>
        <span>
          <ActionButton
            icon={<KeyboardArrowUp />}
            onClick={scrollToTop}
            tooltip={`${topButtonTooltip} (${Math.round(scrollProgress)}% scrolled)`}
            fabComponent={TopFab}
            size={isMobile ? "medium" : "large"}
          />
        </span>
      </Fade>
    </ButtonContainer>
  );
};

export default memo(BackToTop);

