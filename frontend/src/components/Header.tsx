import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  styled
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import schoolLogo from '../assets/Holy-Cross-500x321 logo.svg';

// Styled components for custom styling
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #87CEEB 0%, #FF6B6B 50%, #FFD700 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.drawer + 1,
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexGrow: 1,
});

const LogoImage = styled('img')({
  height: '110px',
  width: 'auto',
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  objectFit: 'contain',
  objectPosition: 'center',
});

const NavButton = styled(Button)(({ theme }) => ({
  color: '#1a237e',
  fontWeight: 600,
  fontSize: '0.9rem',
  textTransform: 'none',
  padding: '8px 16px',
  margin: '0 4px',
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  '&.active': {
    backgroundColor: 'rgba(255,255,255,0.3)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
}));

// Navigation items based on your requirements
const navigationItems = [
  { name: 'Home', path: '/' },
  { name: 'History', path: '/history' },
  { name: 'News', path: '/news' },
  { name: 'School Board', path: '/school-board' },
  { name: 'Staff', path: '/staff' },
  { name: 'Info', path: '/info' },
  { name: 'Forms', path: '/forms' },
  { name: 'Photos', path: '/photos' },
  { name: 'Links', path: '/links' },
  { name: 'Music', path: '/music' },
  { name: 'Extra Mural', path: '/extra-mural' },
  { name: 'Spiritual', path: '/spiritual' },
];

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage = 'Home', onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    setMobileOpen(false);
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 2 }}>
        <LogoImage src={schoolLogo} alt="Holy Cross Convent School" />
        <Typography variant="h6" sx={{ ml: 1, color: '#1a237e', fontWeight: 600 }}>
          Holy Cross
        </Typography>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem 
            key={item.name} 
            onClick={() => handleNavigation(item.path)}
            sx={{
              backgroundColor: currentPage === item.name ? 'rgba(135, 206, 235, 0.1)' : 'transparent',
              cursor: 'pointer',
              borderRadius: '8px',
              margin: '2px 8px',
              '&:hover': {
                backgroundColor: 'rgba(135, 206, 235, 0.2)',
              },
            }}
          >
            <ListItemText 
              primary={item.name} 
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: currentPage === item.name ? 600 : 400,
                  color: '#1a237e',
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar>
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
            {/* Logo and School Name */}
            <LogoContainer>
              <LogoImage src={schoolLogo} alt="Holy Cross Convent School Brooklyn" />
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#1a237e', 
                    fontWeight: 700,
                    fontSize: { xs: '1rem', md: '1.25rem' }
                  }}
                >
                  Holy Cross Convent School
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#1a237e', 
                    fontWeight: 500,
                    fontSize: { xs: '0.7rem', md: '0.8rem' }
                  }}
                >
                  Brooklyn
                </Typography>
              </Box>
            </LogoContainer>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {navigationItems.map((item) => (
                  <NavButton
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={currentPage === item.name ? 'active' : ''}
                  >
                    {item.name}
                  </NavButton>
                ))}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ color: '#1a237e' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header; 