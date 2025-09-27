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
  AdminPanelSettings,
  History,
  Image,
  Book,
  Psychology,
  Receipt,
  ContactMail,
  VolunteerActivism,
  AccessTime
} from '@mui/icons-material';
// Remove EnhancedNavigation import - we'll create a simpler, cleaner menu

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
const schoolLogo = '/HCLOGO1.png';

// Modern styled components with improved design
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)',
  boxShadow: '0 8px 32px rgba(26, 35, 126, 0.3)',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.drawer + 1,
  backdropFilter: 'blur(20px)',
  borderBottom: '3px solid #ffd700',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, #ffd700 50%, transparent 100%)',
  },
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


const NavButton = styled(Button)(({ theme }) => ({
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '0.85rem',
  textTransform: 'none',
  padding: '8px 12px',
  margin: '0 1px',
  borderRadius: '20px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
    color: '#ffd700',
  },
  '&.active': {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    color: '#ffd700',
    border: '1px solid rgba(255, 215, 0, 0.5)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover::before': {
    left: '100%',
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
    icon: <Home />,
    type: 'single'
  },
  {
    name: 'About Us',
    icon: <Info />,
    type: 'dropdown',
    items: [
      { name: 'History', path: '/history', icon: <History /> },
      { name: 'Board Members', path: '/school-board', icon: <AdminPanelSettings /> },
      { name: 'Staff Members', path: '/staff', icon: <People /> },
      { name: 'Logo Symbolism', path: '/logo-symbolism', icon: <Image /> }
    ]
  },
  {
    name: 'School Hub',
    icon: <School />,
    type: 'dropdown',
    items: [
      { name: 'Events', path: '/events', icon: <Event /> },
      { name: 'Gallery', path: '/gallery', icon: <PhotoLibrary /> },
      { name: 'School Announcements', path: '/news', icon: <Newspaper /> },
      { name: 'Music', path: '/music', icon: <MusicNote /> },
      { name: 'Extra Murals', path: '/extra-mural', icon: <SportsSoccer /> }
    ]
  },
  {
    name: 'Programs',
    icon: <Book />,
    type: 'dropdown',
    items: [
      { name: 'Academics', path: '/academics', icon: <Book /> },
      { name: 'Robotics', path: '/robotics', icon: <Psychology /> },
      { name: 'Spiritual', path: '/spiritual', icon: <SelfImprovement /> }
    ]
  },
  {
    name: 'Resources',
    icon: <Description />,
    type: 'dropdown',
    items: [
      { name: 'Documents', path: '/documents', icon: <Description /> },
      { name: 'Forms & Fees', path: '/forms', icon: <Receipt /> },
      { name: 'School Info', path: '/info', icon: <Info /> },
      { name: 'Mission & Vision', path: '/mission-vision', icon: <School /> },
      { name: 'Family Statement', path: '/family-statement', icon: <People /> }
    ]
  },
  {
    name: 'Admissions',
    icon: <School />,
    type: 'dropdown',
    items: [
      { name: 'Application Process', path: '/admissions', icon: <School /> },
      { name: 'Afterschool Programs', path: '/afterschool', icon: <AccessTime /> }
    ]
  },
  { 
    name: 'Contact', 
    path: '/contact',
    icon: <ContactMail />,
    type: 'single'
  },
  { 
    name: 'Donate', 
    path: '/donate',
    icon: <VolunteerActivism />,
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
        width: 280,
        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)',
        backdropFilter: 'blur(20px)',
        borderLeft: '3px solid #ffd700',
      },
    }}
  >
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 2 }}>
        <LogoImage src={schoolLogo} alt="Holy Cross Convent School" />
        <Typography variant="h6" sx={{ ml: 1, color: '#ffffff', fontWeight: 600, textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
          Holy Cross
        </Typography>
      </Box>
      <List>
        {navigationItems.map((item, index) => (
          <Fade in timeout={300 + index * 100} key={item.name}>
            <span>
            {item.type === 'single' ? (
              <ListItem 
                onClick={() => handleNavigation(item.path!)}
                sx={{
                  backgroundColor: currentPage === item.name ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  margin: '2px 8px',
                    transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.15)',
                      transform: 'translateX(4px)',
                  },
                }}
                  aria-label={`Navigate to ${item.name}`}
              >
                <ListItemIcon sx={{ color: '#ffffff', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.name} 
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: currentPage === item.name ? 600 : 400,
                      color: '#ffffff',
                    }
                  }}
                />
              </ListItem>
            ) : (
              <>
                <ListItem 
                  sx={{
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderRadius: '12px',
                    margin: '2px 8px',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                  }}
                >
                  <ListItemIcon sx={{ color: '#ffffff', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.name} 
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: 600,
                        color: '#ffffff',
                      }
                    }}
                  />
                </ListItem>
                  {item.items?.map((subItem, subIndex) => (
                  <ListItem 
                    key={subItem.name}
                    onClick={() => handleNavigation(subItem.path)}
                    sx={{
                      backgroundColor: currentPage === subItem.name ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                      cursor: 'pointer',
                      borderRadius: '12px',
                      margin: '2px 8px 2px 32px',
                        transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 215, 0, 0.15)',
                          transform: 'translateX(4px)',
                      },
                    }}
                      aria-label={`Navigate to ${subItem.name}`}
                  >
                    <ListItemIcon sx={{ color: '#ffffff', minWidth: 40 }}>
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={subItem.name} 
                      sx={{
                        '& .MuiTypography-root': {
                          fontWeight: currentPage === subItem.name ? 600 : 400,
                          color: '#ffffff',
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
                    startIcon={item.icon}
                      endIcon={item.type === 'dropdown' ? <ExpandMore /> : undefined}
                    sx={{
                      backgroundColor: currentPage === item.name ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                      color: currentPage === item.name ? '#ffffff' : '#1a1a1a',
                    }}
                  >
                    {item.name}
                  </NavButton>
                    
                    {/* Dropdown Menu */}
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
                            backgroundColor: 'rgba(26, 35, 126, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            borderRadius: '16px',
                            boxShadow: '0 12px 40px rgba(26, 35, 126, 0.3)',
                            mt: 2,
                            minWidth: 220,
                            overflow: 'hidden',
                          },
                        }}
                      >
                        {item.items?.map((subItem, subIndex) => (
                          <MenuItem
                            key={subIndex}
                            onClick={() => handleNavigation(subItem.path)}
                            sx={{
                              py: 1.5,
                              px: 2,
                              color: '#ffffff',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 215, 0, 0.15)',
                                color: '#ffd700',
                              },
                              '&:first-of-type': {
                                borderTopLeftRadius: '16px',
                                borderTopRightRadius: '16px',
                              },
                              '&:last-of-type': {
                                borderBottomLeftRadius: '16px',
                                borderBottomRightRadius: '16px',
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 32, color: 'inherit', '& svg': { fontSize: '1.1rem' } }}>
                              {subItem.icon}
                            </ListItemIcon>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 500,
                                color: 'inherit',
                              }}
                            >
                              {subItem.name}
                            </Typography>
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
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(90deg)',
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    color: '#ffd700',
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