import React, { useCallback } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Grid,
  Avatar,
  alpha,
  Paper
} from '@mui/material';
import {
  CalendarToday,
  BarChart,
  ArrowForward,
  Assignment,
  PhotoLibrary,
  Email,
  Upload,
  School,
  Work,
  Description,
  Group,
  Campaign
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';
import SEO from '../components/SEO';

const ModuleCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    border: `1px solid ${theme.palette.primary.main}`
  },
  '&:focus-visible': {
    outline: '3px solid #ffd700',
    outlineOffset: '4px',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    border: `1px solid ${theme.palette.primary.main}`
  }
}));

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Memoize navigate callback to prevent re-renders
  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Get user's first name for welcome message
  const userName = user?.name?.split(' ')[0] || 'Admin';

  const mainModules = [
    {
      title: 'Application Management',
      description: 'Review and manage student applications',
      icon: <Assignment sx={{ fontSize: 40 }} aria-hidden="true" />,
      color: '#d32f2f',
      path: '/admin/applications'
    },
    {
      title: 'Calendar Management',
      description: 'Manage school calendar, terms, and events',
      icon: <CalendarToday sx={{ fontSize: 40 }} aria-hidden="true" />,
      color: '#1a237e',
      path: '/admin/calendar'
    },
    {
      title: 'Gallery Management',
      description: 'Upload and organize images and videos',
      icon: <PhotoLibrary sx={{ fontSize: 40 }} aria-hidden="true" />,
      color: '#9c27b0',
      path: '/admin/gallery'
    },
    {
      title: 'Announcements',
      description: 'Publish flyers and school announcements',
      icon: <Campaign sx={{ fontSize: 40 }} aria-hidden="true" />,
      color: '#7b1fa2',
      path: '/admin/announcements'
    },
    {
      title: 'Newsletter System',
      description: 'Automated parent communication',
      icon: <Email sx={{ fontSize: 40 }} aria-hidden="true" />,
      color: '#2196f3',
      path: '/admin/newsletters'
    },
    {
      title: 'Governing Body',
      description: 'Update governing body directory',
      icon: <Group sx={{ fontSize: 40 }} aria-hidden="true" />,
      color: '#1a237e',
      path: '/admin/governing-body'
    },
    {
      title: 'Vacancy Management',
      description: 'Post and manage job openings',
      icon: <Work sx={{ fontSize: 40 }} aria-hidden="true" />,
      color: '#ff6f00',
      path: '/admin/vacancies'
    },
    {
      title: 'School Statistics',
      description: 'View and manage school metrics',
      icon: <BarChart sx={{ fontSize: 40 }} aria-hidden="true" />,
      color: '#4caf50',
      path: '/admin/school-stats'
    }
  ];

  const utilityModules = [
    {
      title: 'Staff Upload',
      description: 'Manage staff photos and information',
      icon: <Upload sx={{ fontSize: 36 }} aria-hidden="true" />,
      color: '#9c27b0',
      path: '/admin/staff-upload'
    },
    {
      title: 'Document Upload',
      description: 'Upload school documents and policies',
      icon: <School sx={{ fontSize: 36 }} aria-hidden="true" />,
      color: '#ff9800',
      path: '/admin/document-upload'
    },
    {
      title: 'Document Management',
      description: 'Publish, organize, and download documents',
      icon: <Description sx={{ fontSize: 36 }} aria-hidden="true" />,
      color: '#1a237e',
      path: '/admin/document-management'
    }
  ];

  return (
    <AdminLayout>
      <SEO
        title="Admin Dashboard - Holy Cross Convent School"
        description="Manage applications, calendar, gallery, announcements, and more."
        type="website"
      />
      
      {/* Welcome Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          borderRadius: 3,
          border: '1px solid #e0e0e0'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
          Welcome back, {userName}!
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280', mb: 2 }}>
          Manage your school's digital presence and administrative tasks from one central dashboard.
        </Typography>
        <Typography variant="body2" sx={{ color: '#9ca3af' }}>
          Select a module below to get started or use the sidebar navigation for quick access.
        </Typography>
      </Paper>

      {/* Main Management Modules */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
          Management Modules
        </Typography>
        <Grid container spacing={3}>
          {mainModules.map((module, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ModuleCard
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNavigate(module.path);
                  }
                }}
              >
                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Avatar 
                      aria-label={`${module.title} module`}
                      sx={{ 
                        bgcolor: alpha(module.color, 0.15), 
                        color: module.color, 
                        width: 48, 
                        height: 48,
                        mr: 1.5
                      }}
                    >
                      {module.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a237e', mb: 0.5 }}>
                        {module.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.4 }}>
                        {module.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    type="button"
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForward sx={{ fontSize: 16 }} aria-hidden="true" />}
                    aria-label={`Open ${module.title}`}
                    sx={{
                      bgcolor: module.color,
                      color: 'white',
                      mt: 'auto',
                      '&:hover': {
                        bgcolor: alpha(module.color, 0.9)
                      },
                      fontSize: '0.8rem',
                      py: 0.75
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNavigate(module.path);
                    }}
                  >
                    Open
                  </Button>
                </CardContent>
              </ModuleCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Utility Modules */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
          Utility Tools
        </Typography>
        <Grid container spacing={3}>
          {utilityModules.map((module, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ModuleCard
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNavigate(module.path);
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      aria-label={`${module.title} module`}
                      sx={{ 
                        bgcolor: alpha(module.color, 0.15), 
                        color: module.color, 
                        width: 48, 
                        height: 48,
                        mr: 1.5
                      }}
                    >
                      {module.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a237e', mb: 0.5 }}>
                        {module.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.4 }}>
                        {module.description}
                      </Typography>
                    </Box>
                    <Button
                      type="button"
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowForward sx={{ fontSize: 16 }} aria-hidden="true" />}
                      aria-label={`Access ${module.title}`}
                      sx={{
                        borderColor: module.color,
                        color: module.color,
                        '&:hover': {
                          borderColor: module.color,
                          bgcolor: alpha(module.color, 0.1)
                        },
                        fontSize: '0.8rem',
                        py: 0.75,
                        px: 2
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNavigate(module.path);
                      }}
                    >
                      Access
                    </Button>
                  </Box>
                </CardContent>
              </ModuleCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard;
