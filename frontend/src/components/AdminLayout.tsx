import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Container,
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
import { useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(!isMobile);
  const [selectedItem, setSelectedItem] = React.useState('/admin');

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
    setSelectedItem(path);
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
          path: '/admin/stats',
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
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
            boxShadow: '0 0 20px rgba(26, 35, 126, 0.15)'
          },
        }}
      >
        {/* Sidebar Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
              p: 1, 
              borderRadius: 2, 
              bgcolor: 'rgba(255,255,255,0.1)', 
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AdminPanelSettings sx={{ fontSize: 28, color: '#ffd700' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                Admin Panel
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Holy Cross School
              </Typography>
            </Box>
          </Box>
          
          {/* User Info */}
          <Paper sx={{ 
            p: 2, 
            bgcolor: 'rgba(255,255,255,0.1)', 
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: '#ffd700', 
                color: '#1a237e',
                mr: 2,
                fontWeight: 600
              }}>
                {user?.name?.charAt(0) || 'A'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                  {user?.name || 'Admin'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Administrator
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <List sx={{ px: 2, py: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton 
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: selectedItem === item.path ? 'rgba(255,255,255,0.15)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: selectedItem === item.path ? '#ffd700' : 'rgba(255,255,255,0.7)',
                    minWidth: 40
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    secondary={item.description}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: selectedItem === item.path ? 600 : 400,
                      color: 'white'
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.6)'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Sidebar Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={handleGoHome}
                sx={{ 
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                  <Home />
                </ListItemIcon>
                <ListItemText 
                  primary="Go to Website"
                  primaryTypographyProps={{ fontSize: '0.9rem', color: 'white' }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={handleLogout}
                sx={{ 
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout"
                  primaryTypographyProps={{ fontSize: '0.9rem', color: 'white' }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Enhanced Top Bar */}
        <Paper sx={{ 
          borderRadius: 0, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            px: 3,
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isMobile && (
                <IconButton onClick={toggleDrawer} sx={{ mr: 2 }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e' }}>
                  Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  Manage your school's digital presence
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Notifications">
                <IconButton>
                  <Badge badgeContent={3} color="error">
                    <Notifications sx={{ color: '#6b7280' }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Settings">
                <IconButton>
                  <Settings sx={{ color: '#6b7280' }} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="User Menu">
                <IconButton onClick={handleMenuOpen}>
                  <Avatar sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: '#1a237e',
                    fontWeight: 600
                  }}>
                    {user?.name?.charAt(0) || 'A'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        {/* Page Content */}
        <Box sx={{ 
          flex: 1, 
          p: 3,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          minHeight: 'calc(100vh - 80px)',
          overflow: 'auto',
          position: 'relative',
          zIndex: 1
        }}>
          <Container maxWidth="xl" sx={{ height: '100%', pb: 4 }}>
            {children}
          </Container>
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
            border: '1px solid #e5e7eb'
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
          <Home sx={{ mr: 2, color: '#6b7280' }} />
          Go to Website
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ px: 2, py: 1.5 }}>
          <Logout sx={{ mr: 2, color: '#6b7280' }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminLayout;
