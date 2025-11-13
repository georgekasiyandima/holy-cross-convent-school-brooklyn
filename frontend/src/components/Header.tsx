import React, { useState, useEffect, memo, useMemo } from 'react';
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
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ExpandMore,
  ChevronRight,
  Login,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
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
  '@media (hover: hover)': {
    '&:hover': {
      transform: 'scale(1.05)',
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
    },
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
  minWidth: '64px',
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
      { name: 'Aftercare Programme', path: '/after-school-programme' },
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
  // Admin menu will be conditionally added based on auth state
  { 
    name: 'SUPPORT US', 
    path: '/donate',
    type: 'single'
  }
];

// Memoized subcomponents
const LogoComponent = memo(({ logoError, setLogoError }: { logoError: boolean; setLogoError: (value: boolean) => void }) => (
  <LogoContainer>
    {logoError ? (
      <LogoFallback>
        Holy Cross<br />Convent School<br />Brooklyn
      </LogoFallback>
    ) : (
      <LogoImage 
        src={schoolLogo} 
        alt="Holy Cross Convent School Brooklyn"
        onError={() => setLogoError(true)}
        width="auto"
        height="80"
      />
    )}
  </LogoContainer>
));

const MobileDrawer = memo(({ 
  currentPath, 
  handleNavigation, 
  mobileOpen, 
  handleDrawerToggle,
  navigationItems: items,
  handleLogout,
  isAuthenticated
}: {
  currentPath: string;
  handleNavigation: (path: string) => void;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  navigationItems: NavigationItem[];
  handleLogout: () => void;
  isAuthenticated: boolean;
}) => {
  // Filter out Admin items if not authenticated
  const filteredItems = isAuthenticated 
    ? items 
    : items.filter(item => item.name !== 'Admin');
  
  return (
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
        {filteredItems.map((item, index) => (
          <Fade in timeout={300 + Math.min(index, 5) * 100} key={item.name}>
            <span>
            {item.type === 'single' ? (
              <ListItem 
                onClick={() => handleNavigation(item.path!)}
                sx={{
                  backgroundColor: item.name === 'SUPPORT US' 
                    ? (currentPath === item.path ? 'rgba(211, 47, 47, 0.2)' : 'rgba(211, 47, 47, 0.1)')
                    : (item.name === 'Login' 
                      ? (currentPath === item.path ? 'rgba(26, 35, 126, 0.15)' : 'rgba(26, 35, 126, 0.08)')
                      : (item.path && currentPath.startsWith(item.path) ? 'rgba(26, 35, 126, 0.1)' : 'transparent')),
                  cursor: 'pointer',
                  borderRadius: '8px',
                  margin: '4px 8px',
                  transition: 'all 0.3s ease',
                  border: item.name === 'SUPPORT US' ? '2px solid #d32f2f' 
                    : (item.name === 'Login' ? '1px solid #1a237e' : 'none'),
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: item.name === 'SUPPORT US' 
                      ? 'rgba(211, 47, 47, 0.15)' 
                      : (item.name === 'Login' ? 'rgba(26, 35, 126, 0.12)' : 'rgba(26, 35, 126, 0.08)'),
                    transform: 'translateX(4px)',
                    borderColor: item.name === 'SUPPORT US' ? '#d32f2f' 
                      : (item.name === 'Login' ? '#1a237e' : 'transparent'),
                  },
                }}
                  aria-label={`Navigate to ${item.name}`}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.name === 'Login' && <Login sx={{ fontSize: '1.2rem', color: '#1a237e' }} />}
                  <ListItemText 
                    primary={item.name} 
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: (item.path && currentPath.startsWith(item.path)) || (item.name === 'SUPPORT US' || item.name === 'Login') ? 600 : 500,
                        color: '#1a237e',
                        fontSize: '0.95rem',
                      }
                    }}
                  />
                </Box>
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
                      backgroundColor: currentPath.startsWith(subItem.path) ? 'rgba(26, 35, 126, 0.1)' : 'transparent',
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
                          fontWeight: currentPath.startsWith(subItem.path) ? 600 : 500,
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
                {item.name === 'Admin' && (
                  <>
                    <Divider sx={{ my: 1, mx: 2 }} />
                    <ListItem 
                      onClick={handleLogout}
                      sx={{
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        margin: '2px 8px 2px 24px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        borderLeft: '3px solid transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.08)',
                          transform: 'translateX(4px)',
                          borderLeftColor: '#d32f2f',
                        },
                      }}
                      aria-label="Logout"
                    >
                      <Logout sx={{ fontSize: '1.2rem', color: '#d32f2f' }} />
                      <ListItemText 
                        primary="Logout" 
                        sx={{
                          '& .MuiTypography-root': {
                            fontWeight: 600,
                            color: '#d32f2f',
                            fontSize: '0.95rem',
                          }
                        }}
                      />
                    </ListItem>
                  </>
                )}
              </>
            )}
          </span>
          </Fade>
        ))}
      </List>
    </Box>
  </Drawer>
  );
});

const Header: React.FC<HeaderProps> = ({ currentPage = 'Home', onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [dropdownAnchors, setDropdownAnchors] = useState<Record<string, HTMLElement | null>>({});
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Build navigation items based on authentication state - properly clone to avoid mutation
  const filteredNavigationItems = useMemo(() => {
    const baseItems = [...navigationItems]; // Clone base array
    const items = [...baseItems]; // Clone again for mutations
    
    // Add admin menu for authenticated users
    if (isAuthenticated) {
      const adminMenuIndex = items.findIndex(item => item.name === 'SUPPORT US');
      const adminMenu: NavigationItem = {
        name: 'Admin',
        type: 'dropdown',
        items: [
          { name: 'Dashboard', path: '/admin/dashboard' },
          { name: 'Applications', path: '/admin/applications' },
          { name: 'Staff Management', path: '/admin/staff' },
          { name: 'Documents', path: '/admin/documents' },
          { name: 'Gallery', path: '/admin/gallery' },
          { name: 'Announcements', path: '/admin/announcements' },
          { name: 'Newsletters', path: '/admin/newsletters' },
          { name: 'Calendar & Events', path: '/admin/calendar' },
          { name: 'Governing Body', path: '/admin/governing-body' },
          { name: 'Vacancies', path: '/admin/vacancies' },
          { name: 'School Stats', path: '/admin/stats' },
        ]
      };
      items.splice(adminMenuIndex, 0, adminMenu);
    } else {
      // Add login link for non-authenticated users
      const loginItem: NavigationItem = {
        name: 'Login',
        path: '/admin/login',
        type: 'single'
      };
      const supportUsIndex = items.findIndex(item => item.name === 'SUPPORT US');
      items.splice(supportUsIndex, 0, loginItem);
    }
    
    return items;
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileOpen(false);
    setDropdownAnchors({});
  };

  // Handle scroll effect with ref to avoid re-creating listener
  const scrollHandlerRef = React.useRef<() => void>();
  useEffect(() => {
    scrollHandlerRef.current = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    // Set initial scroll state
    scrollHandlerRef.current();

    const handler = () => scrollHandlerRef.current?.();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
    setMobileOpen(false);
    setDropdownAnchors({});
  };

  const handleDropdownClick = (event: React.MouseEvent<HTMLElement>, dropdownName: string) => {
    // Close other dropdowns when opening a new one
    setDropdownAnchors({ [dropdownName]: event.currentTarget });
  };

  const handleDropdownClose = (dropdownName?: string) => {
    if (dropdownName) {
      setDropdownAnchors(prev => ({ ...prev, [dropdownName]: null }));
    } else {
      setDropdownAnchors({});
    }
  };

  // Preload logo for better performance
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = schoolLogo;
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <>
      <StyledAppBar role="banner" aria-label="School navigation" scrolled={scrolled}>
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 1, sm: 1 }, py: 1 }}>
            {/* Logo and School Name */}
            <LogoComponent logoError={logoError} setLogoError={setLogoError} />

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                {filteredNavigationItems.map((item, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                  {item.type === 'dropdown' ? (
                    <NavButton
                      onClick={(e) => handleDropdownClick(e, item.name)}
                      endIcon={<ExpandMore />}
                      scrolled={scrolled}
                      aria-haspopup="menu"
                      aria-expanded={!!dropdownAnchors[item.name]}
                      sx={{
                        backgroundColor: 'transparent',
                        color: scrolled ? '#1a237e' : '#1a237e',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(26, 35, 126, 0.08)',
                          transform: 'translateY(-2px)',
                          color: '#1a237e',
                        }
                      }}
                    >
                      {item.name}
                    </NavButton>
                  ) : item.path ? (
                    <Box component={RouterLink} to={item.path} sx={{ textDecoration: 'none' }}>
                      <NavButton
                        startIcon={item.name === 'Login' ? <Login sx={{ fontSize: '1rem' }} /> : undefined}
                        scrolled={scrolled}
                        sx={{
                          backgroundColor: (item.path && currentPath.startsWith(item.path))
                            ? 'rgba(26, 35, 126, 0.1)' 
                            : (item.name === 'SUPPORT US' ? 'rgba(211, 47, 47, 0.1)' 
                            : (item.name === 'Login' ? 'rgba(26, 35, 126, 0.08)' : 'transparent')),
                          color: scrolled ? '#1a237e' : '#1a237e',
                          fontWeight: 600,
                          border: item.name === 'SUPPORT US' ? '2px solid #d32f2f' 
                            : (item.name === 'Login' ? '1px solid #1a237e' : 'none'),
                          '&:hover': {
                            backgroundColor: item.name === 'SUPPORT US' 
                              ? 'rgba(211, 47, 47, 0.15)' 
                              : (item.name === 'Login' ? 'rgba(26, 35, 126, 0.12)' : 'rgba(26, 35, 126, 0.08)'),
                            transform: 'translateY(-2px)',
                            color: '#1a237e',
                            borderColor: item.name === 'SUPPORT US' ? '#d32f2f' 
                              : (item.name === 'Login' ? '#1a237e' : 'transparent'),
                          }
                        }}
                      >
                        {item.name}
                      </NavButton>
                    </Box>
                  ) : null}
                    
                    {/* Modern Drawer-Style Dropdown Menu */}
                    {item.type === 'dropdown' && (
                      <Menu
                        anchorEl={dropdownAnchors[item.name] || null}
                        open={!!dropdownAnchors[item.name]}
                        onClose={() => handleDropdownClose(item.name)}
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
                            component={RouterLink}
                            to={subItem.path}
                            onClick={() => handleDropdownClose(item.name)}
                            data-testid={`nav-${item.name}-${subItem.name.toLowerCase().replace(/\s+/g, '-')}`}
                              sx={{
                              py: 1.75,
                              px: 2.5,
                              color: currentPath.startsWith(subItem.path) ? '#1a237e' : '#1a237e',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'all 0.2s ease',
                              borderLeft: currentPath.startsWith(subItem.path) ? '3px solid #ffd700' : '3px solid transparent',
                              backgroundColor: currentPath.startsWith(subItem.path) ? 'rgba(26, 35, 126, 0.05)' : 'transparent',
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
                                fontWeight: currentPath.startsWith(subItem.path) ? 600 : 500,
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
                        {item.name === 'Admin' && (
                          <>
                            <Divider sx={{ my: 0.5 }} />
                            <MenuItem
                              onClick={handleLogout}
                              sx={{
                                py: 1.75,
                                px: 2.5,
                                color: '#d32f2f',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                transition: 'all 0.2s ease',
                                borderLeft: '3px solid transparent',
                                '&:hover': {
                                  backgroundColor: 'rgba(211, 47, 47, 0.05)',
                                  borderLeftColor: '#d32f2f',
                                },
                              }}
                            >
                              <Logout sx={{ fontSize: '1rem' }} />
                              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                Logout
                              </Typography>
                            </MenuItem>
                          </>
                        )}
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
        currentPath={currentPath}
        handleNavigation={handleNavigation}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        navigationItems={filteredNavigationItems}
        handleLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
};

export default memo(Header); 