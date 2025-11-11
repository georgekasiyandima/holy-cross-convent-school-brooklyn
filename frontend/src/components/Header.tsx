import React, { useState, useEffect, memo } from 'react';
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
  styled,
  Menu,
  MenuItem,
  Fade,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ExpandMore,
  ChevronRight
} from '@mui/icons-material';
// Remove EnhancedNavigation import - we'll create a simpler, cleaner menu

// TypeScript interfaces for type safety
interface NavigationItem {
  name: string;
  path?: string;
  type: 'single' | 'dropdown';
  items?: NavigationSubItem[];
}

interface NavigationSubItem {
  name: string;
  path: string;
}

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (path: string) => void;
}


// Logo path constant
const schoolLogo = '/L1.png';

// Frameless header fixed on scroll
const StyledAppBar = styled(AppBar)<{ scrolled?: boolean }>(({ theme, scrolled }) => ({
  background: scrolled 
    ? 'rgba(255, 255, 255, 0.98)' 
    : 'transparent',
  boxShadow: scrolled 
    ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
    : 'none',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.drawer + 1,
  transition: 'all 0.4s ease-in-out',
  backdropFilter: scrolled ? 'blur(10px)' : 'none',
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexGrow: 1,
});

const LogoImage = styled('img')({
  height: '80px',
  width: 'auto',
  objectFit: 'contain',
  objectPosition: 'center',
  transition: 'transform 0.3s ease',
  // Add drop shadow for depth
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  borderRadius: '8px',
  padding: '5px',
  '&:hover': {
    transform: 'scale(1.05)',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
  },
});

const LogoFallback = styled(Box)({
  height: '80px',
  width: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 193, 7, 0.1)',
  borderRadius: '8px',
  border: '2px dashed rgba(255, 193, 7, 0.3)',
  color: '#1a237e',
  fontWeight: 600,
  fontSize: '12px',
  textAlign: 'center',
  padding: '6px',
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
});

const NavButton = styled(Button)<{ scrolled?: boolean }>(({ theme, scrolled }) => ({
  color: scrolled ? '#1a237e' : '#1a237e',
  fontWeight: 600,
  fontSize: '0.9rem',
  textTransform: 'none',
  padding: '10px 16px',
  margin: '0 2px',
  borderRadius: '8px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: 'rgba(26, 35, 126, 0.08)',
    transform: 'translateY(-2px)',
    color: '#1a237e',
  },
  '&.active': {
    backgroundColor: 'rgba(26, 35, 126, 0.12)',
    color: '#1a237e',
  },
  '& .MuiButton-startIcon': {
    marginRight: '6px',
    transition: 'transform 0.3s ease',
    '& svg': {
      fontSize: '1.1rem',
    },
  },
  '&:hover .MuiButton-startIcon': {
    transform: 'scale(1.1)',
  },
}));

// Streamlined navigation with better organization
const navigationItems: NavigationItem[] = [
  { 
    name: 'Home', 
    path: '/',
    type: 'single'
  },
  {
    name: 'Our School',
    type: 'dropdown',
    items: [
      { name: 'About Us', path: '/about' },
      { name: 'Staff', path: '/staff' },
      { name: 'Board Members', path: '/school-board' },
      { name: 'History', path: '/history' },
      { name: 'School Info', path: '/info' },
      { name: 'Aftercare Programme', path: '/aftercare' },
      { name: 'Vacancies', path: '/vacancies' }
    ]
  },
  {
    name: 'School Hub',
    type: 'dropdown',
    items: [
      { name: 'Calendar & Events', path: '/school-hub' },
      { name: 'Announcements', path: '/school-hub#announcements' },
      { name: 'Gallery', path: '/gallery' }
    ]
  },
  {
    name: 'Pillars',
    type: 'dropdown',
    items: [
      { name: 'Academic', path: '/academic' },
      { name: 'Robotics', path: '/robotics' },
      { name: 'Sport', path: '/sport' },
      { name: 'Cultural', path: '/cultural' },
      { name: 'Service & Ethos', path: '/service-ethos' }
    ]
  },
  {
    name: 'Resources',
    type: 'dropdown',
    items: [
      { name: 'School Documents', path: '/forms' }
    ]
  },
  {
    name: 'Admissions',
    type: 'dropdown',
    items: [
      { name: 'Application Process', path: '/admissions' }
    ]
  },
  { 
    name: 'Contact', 
    path: '/contact',
    type: 'single'
  },
  {
    name: 'Admin',
    type: 'dropdown',
    items: [
      { name: 'Staff Upload', path: '/admin/staff-upload' },
      { name: 'Document Upload', path: '/admin/document-upload' }
    ]
  },
  { 
    name: 'SUPPORT US', 
    path: '/donate',
    type: 'single'
  }
];

// Memoized subcomponents
const LogoComponent = memo(({ logoError }: { logoError: boolean }) => (
  <LogoContainer>
    {logoError ? (
      <LogoFallback>
        Holy Cross<br />Convent School<br />Brooklyn
      </LogoFallback>
    ) : (
      <LogoImage 
        src={schoolLogo} 
        alt="Holy Cross Convent School Brooklyn"
        onError={() => console.log('Logo failed to load')}
      />
    )}
  </LogoContainer>
));

const MobileDrawer = memo(({ 
  currentPage, 
  handleNavigation, 
  mobileOpen, 
  handleDrawerToggle 
}: {
  currentPage: string;
  handleNavigation: (path: string) => void;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}) => (
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
            width: 320,
            background: '#ffffff',
            borderLeft: '2px solid #ffd700',
            boxShadow: '-4px 0 20px rgba(26, 35, 126, 0.1)',
          },
        }}
      >
      <Box sx={{ width: '100%', pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 3, pb: 2, borderBottom: '1px solid rgba(26, 35, 126, 0.1)' }}>
        <LogoImage src={schoolLogo} alt="Holy Cross Convent School" />
        <Typography variant="h6" sx={{ ml: 1, color: '#1a237e', fontWeight: 700 }}>
          Holy Cross
        </Typography>
      </Box>
      <List sx={{ px: 1 }}>
        {navigationItems.map((item, index) => (
          <Fade in timeout={300 + index * 100} key={item.name}>
            <span>
            {item.type === 'single' ? (
              <ListItem 
                onClick={() => handleNavigation(item.path!)}
                sx={{
                  backgroundColor: item.name === 'SUPPORT US' 
                    ? (currentPage === item.name ? 'rgba(211, 47, 47, 0.2)' : 'rgba(211, 47, 47, 0.1)')
                    : (currentPage === item.name ? 'rgba(26, 35, 126, 0.1)' : 'transparent'),
                  cursor: 'pointer',
                  borderRadius: '8px',
                  margin: '4px 8px',
                  transition: 'all 0.3s ease',
                  border: item.name === 'SUPPORT US' ? '2px solid #d32f2f' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: item.name === 'SUPPORT US' 
                      ? 'rgba(211, 47, 47, 0.15)' 
                      : 'rgba(26, 35, 126, 0.08)',
                    transform: 'translateX(4px)',
                    borderColor: item.name === 'SUPPORT US' ? '#d32f2f' : 'transparent',
                  },
                }}
                  aria-label={`Navigate to ${item.name}`}
              >
                <ListItemText 
                  primary={item.name} 
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: currentPage === item.name ? 600 : (item.name === 'SUPPORT US' ? 600 : 500),
                      color: '#1a237e',
                      fontSize: '0.95rem',
                    }
                  }}
                />
                {item.path && (
                  <ChevronRight sx={{ color: '#9e9e9e', fontSize: '1.2rem' }} />
                )}
              </ListItem>
            ) : (
              <>
                <ListItem 
                  sx={{
                    backgroundColor: 'rgba(26, 35, 126, 0.05)',
                    borderRadius: '8px',
                    margin: '4px 8px',
                    border: '1px solid rgba(26, 35, 126, 0.1)',
                    mb: 1,
                  }}
                >
                  <ListItemText 
                    primary={item.name} 
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: 700,
                        color: '#1a237e',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }
                    }}
                  />
                </ListItem>
                  {item.items?.map((subItem, subIndex) => (
                  <ListItem 
                    key={subItem.name}
                    onClick={() => handleNavigation(subItem.path)}
                    sx={{
                      backgroundColor: currentPage === subItem.name ? 'rgba(26, 35, 126, 0.1)' : 'transparent',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      margin: '2px 8px 2px 24px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderLeft: '3px solid transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(26, 35, 126, 0.08)',
                        transform: 'translateX(4px)',
                        borderLeftColor: '#ffd700',
                        '& .arrow-icon': {
                          transform: 'translateX(4px)',
                          color: '#ffd700',
                        },
                      },
                    }}
                      aria-label={`Navigate to ${subItem.name}`}
                  >
                    <ListItemText 
                      primary={subItem.name} 
                      sx={{
                        '& .MuiTypography-root': {
                          fontWeight: currentPage === subItem.name ? 600 : 500,
                          color: '#1a237e',
                          fontSize: '0.95rem',
                        }
                      }}
                    />
                    <ChevronRight 
                      className="arrow-icon"
                      sx={{ 
                        color: '#9e9e9e', 
                        fontSize: '1.2rem',
                        transition: 'all 0.2s ease',
                      }} 
                    />
                  </ListItem>
                ))}
              </>
            )}
          </span>
          </Fade>
        ))}
      </List>
    </Box>
  </Drawer>
));

const Header: React.FC<HeaderProps> = ({ currentPage = 'Home', onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    setMobileOpen(false);
    setAnchorEl(null);
    setActiveDropdown(null);
  };

  const handleDropdownClick = (event: React.MouseEvent<HTMLElement>, dropdownName: string) => {
    setAnchorEl(event.currentTarget);
    setActiveDropdown(dropdownName);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
    setActiveDropdown(null);
  };

  return (
    <>
      <StyledAppBar role="banner" aria-label="School navigation" scrolled={scrolled}>
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 1, sm: 1 }, py: 1 }}>
            {/* Logo and School Name */}
            <LogoComponent logoError={logoError} />

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                {navigationItems.map((item, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                  <NavButton
                      onClick={(e) => {
                        if (item.type === 'dropdown') {
                          handleDropdownClick(e, item.name);
                        } else if (item.path) {
                          handleNavigation(item.path);
                        }
                      }}
                      endIcon={item.type === 'dropdown' ? <ExpandMore /> : undefined}
                      scrolled={scrolled}
                    sx={{
                      backgroundColor: currentPage === item.name 
                        ? 'rgba(26, 35, 126, 0.1)' 
                        : (item.name === 'SUPPORT US' ? 'rgba(211, 47, 47, 0.1)' : 'transparent'),
                      color: scrolled ? '#1a237e' : '#1a237e',
                      fontWeight: 600,
                      border: item.name === 'SUPPORT US' ? '2px solid #d32f2f' : 'none',
                      '&:hover': {
                        backgroundColor: item.name === 'SUPPORT US' 
                          ? 'rgba(211, 47, 47, 0.15)' 
                          : 'rgba(26, 35, 126, 0.08)',
                        transform: 'translateY(-2px)',
                        color: '#1a237e',
                        borderColor: item.name === 'SUPPORT US' ? '#d32f2f' : 'transparent',
                      }
                    }}
                  >
                    {item.name}
                  </NavButton>
                    
                    {/* Modern Drawer-Style Dropdown Menu */}
                    {item.type === 'dropdown' && (
                      <Menu
                        anchorEl={anchorEl}
                        open={activeDropdown === item.name}
                        onClose={handleDropdownClose}
                        TransitionComponent={Fade}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        sx={{
                          '& .MuiPaper-root': {
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(26, 35, 126, 0.15)',
                            mt: 1.5,
                            minWidth: 320,
                            maxWidth: 400,
                            overflow: 'hidden',
                            border: '1px solid rgba(26, 35, 126, 0.1)',
                          },
                        }}
                      >
                        <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(26, 35, 126, 0.1)' }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700,
                              color: '#1a237e',
                              fontSize: '0.95rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Box>
                        {item.items?.map((subItem, subIndex) => (
                          <MenuItem
                            key={subIndex}
                            onClick={() => handleNavigation(subItem.path)}
                            sx={{
                              py: 1.75,
                              px: 2.5,
                              color: '#1a237e',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'all 0.2s ease',
                              borderLeft: '3px solid transparent',
                              '&:hover': {
                                backgroundColor: 'rgba(26, 35, 126, 0.05)',
                                borderLeftColor: '#ffd700',
                                '& .arrow-icon': {
                                  transform: 'translateX(4px)',
                                  color: '#ffd700',
                                },
                                '& .menu-text': {
                                  color: '#1a237e',
                                  fontWeight: 600,
                                },
                              },
                            }}
                          >
                            <Typography 
                              variant="body1" 
                              className="menu-text"
                              sx={{ 
                                fontWeight: 500,
                                color: 'inherit',
                                fontSize: '0.95rem',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {subItem.name}
                            </Typography>
                            <ChevronRight 
                              className="arrow-icon"
                              sx={{ 
                                fontSize: '1.2rem',
                                color: '#9e9e9e',
                                transition: 'all 0.2s ease',
                              }} 
                            />
                          </MenuItem>
                        ))}
                      </Menu>
                    )}
                  </Box>
                ))}
              </Box>
            )}


            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open navigation menu"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ 
                  color: '#1a237e',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(90deg)',
                    backgroundColor: 'rgba(26, 35, 126, 0.1)',
                    color: '#1a237e',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer 
        currentPage={currentPage}
        handleNavigation={handleNavigation}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
    </>
  );
};

export default memo(Header); 