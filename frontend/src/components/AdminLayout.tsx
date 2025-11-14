import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  AdminPanelSettings, 
  Logout, 
  Dashboard,
  CalendarToday,
  School,
  Upload,
  BarChart,
  Menu as MenuIcon,
  Notifications,
  Settings,
  Home,
  PhotoLibrary,
  Email,
  Assignment
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(!isMobile);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    handleMenuClose();
  };

  const handleGoHome = () => {
    navigate('/');
    handleMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/admin',
      description: 'Overview and analytics'
    },
    {
      text: 'Application Management',
      icon: <Assignment />,
      path: '/admin/applications',
      description: 'Review student applications'
    },
    {
      text: 'Calendar Management',
      icon: <CalendarToday />,
      path: '/admin/calendar',
      description: 'Manage school calendar'
    },
    {
      text: 'Gallery Management',
      icon: <PhotoLibrary />,
      path: '/admin/gallery',
      description: 'Manage images and videos'
    },
    {
      text: 'Newsletter System',
      icon: <Email />,
      path: '/admin/newsletters',
      description: 'Automated parent communication'
    },
    {
      text: 'School Statistics',
      icon: <BarChart />,
      path: '/admin/school-stats',
      description: 'View school metrics'
    },
    {
      text: 'Staff Upload',
      icon: <Upload />,
      path: '/admin/staff-upload',
      description: 'Manage staff photos'
    },
    {
      text: 'Document Upload',
      icon: <School />,
      path: '/admin/document-upload',
      description: 'Upload school documents'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc', overflow: 'hidden' }}>
      {/* Enhanced Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1a237e 0%, #283593 100%)',
            color: 'white',
            borderRight: 'none',
            boxShadow: '0 0 20px rgba(26, 35, 126, 0.15)',
            display: 'flex',
            flexDirection: 'column'
          },
        }}
      >
        {/* Sidebar Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
              p: 0.5, 
              borderRadius: 2, 
              bgcolor: 'rgba(255,255,255,0.1)', 
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              overflow: 'hidden'
            }}>
              <Box
                component="img"
                src="/L1.png"
                alt="Holy Cross School Logo"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>
                Admin Panel
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                Holy Cross School
              </Typography>
            </Box>
          </Box>
          
          {/* User Info */}
          <Paper sx={{ 
            p: 1.5, 
            bgcolor: 'rgba(255,255,255,0.1)', 
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: '#ffd700', 
                color: '#1a237e',
                mr: 1.5,
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                {user?.name?.charAt(0) || 'A'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 600, 
                    fontSize: '0.875rem', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {user?.name || 'Admin'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
                  Administrator
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Navigation Menu - Scrollable */}
        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <List sx={{ px: 1.5, py: 1 }}>
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton 
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      bgcolor: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                      border: active ? '1px solid rgba(255,215,0,0.3)' : '1px solid transparent',
                      '&:hover': {
                        bgcolor: active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                      },
                      transition: 'all 0.2s ease-in-out',
                      py: 1.5
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: active ? '#ffd700' : 'rgba(255,255,255,0.7)',
                      minWidth: 40
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      secondary={item.description}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: active ? 600 : 400,
                        color: 'white'
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.6)'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Sidebar Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
          <List sx={{ p: 0 }}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                onClick={handleGoHome}
                sx={{ 
                  borderRadius: 2,
                  py: 1,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                  <Home sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Go to Website"
                  primaryTypographyProps={{ fontSize: '0.875rem', color: 'white', fontWeight: 400 }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={handleLogout}
                sx={{ 
                  borderRadius: 2,
                  py: 1,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                  <Logout sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout"
                  primaryTypographyProps={{ fontSize: '0.875rem', color: 'white', fontWeight: 400 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden'
        }}
      >
        {/* Enhanced Top Bar */}
        <Paper 
          sx={{ 
            borderRadius: 0, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderBottom: '1px solid #e5e7eb',
            flexShrink: 0,
            zIndex: 10
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            px: { xs: 2, sm: 3 },
            py: 2,
            minHeight: 72
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
              {isMobile && (
                <IconButton onClick={toggleDrawer} sx={{ mr: 1 }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#1a237e',
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {location.pathname === '/admin' 
                    ? 'Dashboard' 
                    : menuItems.find(item => isActive(item.path))?.text || 'Admin Panel'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6b7280',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {location.pathname === '/admin' 
                    ? `Welcome back, ${user?.name?.split(' ')[0] || 'Admin'}!` 
                    : menuItems.find(item => isActive(item.path))?.description || 'Manage your school'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              <Tooltip title="Notifications">
                <IconButton size="small">
                  <Badge badgeContent={0} color="error">
                    <Notifications sx={{ color: '#6b7280', fontSize: 20 }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Settings">
                <IconButton size="small">
                  <Settings sx={{ color: '#6b7280', fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="User Menu">
                <IconButton onClick={handleMenuOpen} size="small">
                  <Avatar sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: '#1a237e',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}>
                    {user?.name?.charAt(0) || 'A'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        {/* Page Content - Scrollable with proper padding */}
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto',
          overflowX: 'hidden',
          bgcolor: '#f8fafc',
          position: 'relative',
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 8 }
        }}>
          {children}
        </Box>
      </Box>

      {/* Enhanced User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            minWidth: 200
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a237e' }}>
            {user?.name || 'Admin User'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            Administrator
          </Typography>
        </Box>
        <MenuItem onClick={handleGoHome} sx={{ px: 2, py: 1.5 }}>
          <Home sx={{ mr: 2, color: '#6b7280', fontSize: 20 }} />
          Go to Website
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ px: 2, py: 1.5 }}>
          <Logout sx={{ mr: 2, color: '#6b7280', fontSize: 20 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminLayout;
