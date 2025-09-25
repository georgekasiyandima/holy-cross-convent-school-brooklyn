import React, { useState, memo } from 'react';
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
  ListItemIcon,
  Fade,
  Slide
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  School,
  Info,
  Folder,
  Favorite,
  ExpandMore,
  Event,
  Newspaper,
  PhotoLibrary,
  MusicNote,
  SportsSoccer,
  SelfImprovement,
  People,
  Description,
  Link,
  AdminPanelSettings
} from '@mui/icons-material';

// TypeScript interfaces for type safety
interface NavigationItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  type: 'single' | 'dropdown';
  items?: NavigationSubItem[];
}

interface NavigationSubItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (path: string) => void;
}

// Logo path constant
const schoolLogo = '/Logo(1).svg';

// Styled components for custom styling
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #d32f2f 0%, #f57c00 20%, #ffca28 40%, #ffb74d 50%, #90caf9 70%, #64b5f6 85%, #1a237e 100%)', // School colors with dark blue on far right
  boxShadow: '0 4px 20px rgba(211, 47, 47, 0.3)',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.drawer + 1,
  backdropFilter: 'blur(10px)',
  borderBottom: '2px solid rgba(255, 193, 7, 0.5)', // Enhanced gold accent border
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
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const LogoFallback = styled(Box)({
  height: '110px',
  width: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 193, 7, 0.1)',
  borderRadius: '8px',
  border: '2px dashed rgba(255, 193, 7, 0.3)',
  color: '#1a237e',
  fontWeight: 600,
  fontSize: '14px',
  textAlign: 'center',
  padding: '8px',
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
});

const NavButton = styled(Button)(({ theme }) => ({
  color: '#1a1a1a',
  fontWeight: 700,
  fontSize: '0.9rem',
  textTransform: 'none',
  padding: '8px 16px',
  margin: '0 4px',
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  '&.active': {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

// Restructured navigation items with dropdowns
const navigationItems: NavigationItem[] = [
  { 
    name: 'Home', 
    path: '/',
    icon: <Home />,
    type: 'single'
  },
  { 
    name: 'History', 
    path: '/history',
    icon: <Info />,
    type: 'single'
  },
  {
    name: 'School Life',
    icon: <School />,
    type: 'dropdown',
    items: [
      { name: 'Events', path: '/events', icon: <Event /> },
      { name: 'News', path: '/news', icon: <Newspaper /> },
      { name: 'Gallery', path: '/gallery', icon: <PhotoLibrary /> },
      { name: 'Music', path: '/music', icon: <MusicNote /> },
      { name: 'Extra Mural', path: '/extra-mural', icon: <SportsSoccer /> },
      { name: 'Spiritual', path: '/spiritual', icon: <SelfImprovement /> }
    ]
  },
  {
    name: 'About Us',
    icon: <People />,
    type: 'dropdown',
    items: [
      { name: 'School Info', path: '/info', icon: <Info /> },
      { name: 'School Board', path: '/school-board', icon: <People /> },
      { name: 'Staff', path: '/staff', icon: <People /> },
      { name: 'Logo Symbolism', path: '/logo-symbolism', icon: <Info /> }
    ]
  },
  {
    name: 'Resources',
    icon: <Folder />,
    type: 'dropdown',
    items: [
      { name: 'Documents', path: '/documents', icon: <Description /> },
      { name: 'Forms & Fees', path: '/forms', icon: <Description /> },
      { name: 'Links', path: '/links', icon: <Link /> }
    ]
  },
  {
    name: 'Donate',
    path: '/donate',
    icon: <Favorite />,
    type: 'single'
  },
  {
    name: 'Admin',
    icon: <AdminPanelSettings />,
    type: 'dropdown',
    items: [
      { name: 'Staff Upload', path: '/admin/staff-upload', icon: <People /> },
      { name: 'Document Upload', path: '/admin/document-upload', icon: <Description /> }
    ]
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
    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#1a1a1a', 
          fontWeight: 700,
          fontSize: { xs: '1rem', md: '1.25rem' },
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
        }}
      >
        Holy Cross Convent School
      </Typography>
      <Typography 
        variant="caption" 
        sx={{ 
          color: '#8b0000', 
          fontWeight: 600,
          fontSize: { xs: '0.7rem', md: '0.8rem' },
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
        }}
      >
        Brooklyn
      </Typography>
    </Box>
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
        width: 250,
        background: 'linear-gradient(135deg, #d32f2f 0%, #f57c00 25%, #ffca28 45%, #ffb74d 55%, #90caf9 75%, #64b5f6 100%)',
        backdropFilter: 'blur(10px)',
        borderLeft: '2px solid rgba(255, 193, 7, 0.5)',
      },
    }}
  >
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 2 }}>
        <LogoImage src={schoolLogo} alt="Holy Cross Convent School" />
        <Typography variant="h6" sx={{ ml: 1, color: '#1a1a1a', fontWeight: 600, textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>
          Holy Cross
        </Typography>
      </Box>
      <List>
        {/* Back to Home Button (only show on non-home pages) */}
        {currentPage !== 'Home' && (
          <Slide direction="left" in={currentPage !== 'Home'} timeout={300}>
            <span>
              <ListItem 
                onClick={() => handleNavigation('/')}
                sx={{
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  margin: '2px 8px',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    transition: 'all 0.3s ease',
                  '&:hover': {
                      backgroundColor: 'rgba(255, 193, 7, 0.2)',
                      transform: 'translateX(4px)',
                  },
                }}
                  aria-label="Back to home page"
              >
                <ListItemText 
                  primary="🏠 Back to Home" 
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: 600,
                      color: '#1a237e',
                    }
                  }}
                />
              </ListItem>
            </span>
          </Slide>
        )}
        
        {navigationItems.map((item, index) => (
          <Fade in timeout={300 + index * 100} key={item.name}>
            <span>
            {item.type === 'single' ? (
              <ListItem 
                onClick={() => handleNavigation(item.path!)}
                sx={{
                  backgroundColor: currentPage === item.name ? 'rgba(135, 206, 235, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  margin: '2px 8px',
                    transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(135, 206, 235, 0.2)',
                      transform: 'translateX(4px)',
                  },
                }}
                  aria-label={`Navigate to ${item.name}`}
              >
                <ListItemIcon sx={{ color: '#1a237e', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
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
            ) : (
              <>
                <ListItem 
                  sx={{
                      backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    borderRadius: '8px',
                    margin: '2px 8px',
                      border: '1px solid rgba(255, 193, 7, 0.3)',
                  }}
                >
                  <ListItemIcon sx={{ color: '#1a237e', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.name} 
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: 600,
                        color: '#1a237e',
                      }
                    }}
                  />
                </ListItem>
                  {item.items?.map((subItem, subIndex) => (
                  <ListItem 
                    key={subItem.name}
                    onClick={() => handleNavigation(subItem.path)}
                    sx={{
                      backgroundColor: currentPage === subItem.name ? 'rgba(135, 206, 235, 0.1)' : 'transparent',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      margin: '2px 8px 2px 32px',
                        transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(135, 206, 235, 0.2)',
                          transform: 'translateX(4px)',
                      },
                    }}
                      aria-label={`Navigate to ${subItem.name}`}
                  >
                    <ListItemIcon sx={{ color: '#1a237e', minWidth: 40 }}>
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={subItem.name} 
                      sx={{
                        '& .MuiTypography-root': {
                          fontWeight: currentPage === subItem.name ? 600 : 400,
                          color: '#1a237e',
                          fontSize: '0.9rem',
                        }
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
      <StyledAppBar role="banner" aria-label="School navigation">
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
            {/* Logo and School Name */}
            <LogoComponent logoError={logoError} />

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Back to Home Button (only show on non-home pages) */}
                {currentPage !== 'Home' && (
                  <Fade in timeout={300}>
                    <span>
                      <IconButton
                        onClick={() => handleNavigation('/')}
                        sx={{
                          color: '#1a1a1a',
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            transform: 'scale(1.1) rotate(360deg)',
                          },
                          mr: 1
                        }}
                        title="Back to Home"
                        aria-label="Back to home page"
                      >
                        <Home />
                      </IconButton>
                    </span>
                  </Fade>
                )}
                
                {navigationItems.map((item, index) => (
                  <Fade in timeout={300 + index * 100} key={item.name}>
                    <span>
                    {item.type === 'single' ? (
                      <NavButton
                        onClick={() => handleNavigation(item.path!)}
                        className={currentPage === item.name ? 'active' : ''}
                        startIcon={item.icon}
                          aria-label={`Navigate to ${item.name}`}
                      >
                        {item.name}
                      </NavButton>
                    ) : (
                      <NavButton
                        onClick={(e) => handleDropdownClick(e, item.name)}
                        className={activeDropdown === item.name ? 'active' : ''}
                        startIcon={item.icon}
                        endIcon={<ExpandMore />}
                          aria-label={`Open ${item.name} menu`}
                          aria-expanded={activeDropdown === item.name}
                          aria-haspopup="true"
                      >
                        {item.name}
                      </NavButton>
                    )}
                  </span>
                  </Fade>
                ))}
              </Box>
            )}

            {/* Dropdown Menus */}
            {navigationItems.map((item) => (
              item.type === 'dropdown' && (
                <Menu
                  key={item.name}
                  anchorEl={anchorEl}
                  open={activeDropdown === item.name}
                  onClose={handleDropdownClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  PaperProps={{
                    sx: {
                      background: 'linear-gradient(135deg, #d32f2f 0%, #f57c00 25%, #ffca28 45%, #ffb74d 55%, #90caf9 75%, #64b5f6 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 193, 7, 0.5)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(211, 47, 47, 0.3)',
                      mt: 1,
                    }
                  }}
                  TransitionComponent={Fade}
                  transitionDuration={200}
                >
                  {item.items?.map((subItem, index) => (
                    <MenuItem
                      key={subItem.name}
                      onClick={() => handleNavigation(subItem.path)}
                      sx={{
                        minWidth: 200,
                        py: 1.5,
                        px: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          transform: 'translateX(4px)',
                        },
                      }}
                      aria-label={`Navigate to ${subItem.name}`}
                    >
                      <ListItemIcon sx={{ color: '#8b0000', minWidth: 40 }}>
                        {subItem.icon}
                      </ListItemIcon>
                      <Typography sx={{ color: '#1a1a1a', fontWeight: 600, textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>
                        {subItem.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              )
            ))}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open navigation menu"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ 
                  color: '#1a1a1a',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(90deg)',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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