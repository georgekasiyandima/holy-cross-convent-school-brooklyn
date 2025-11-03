import React from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Grid,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  Stack
} from '@mui/material';
import {
  Event,
  People,
  TrendingUp,
  CalendarToday,
  BarChart,
  ArrowForward,
  Assignment,
  PhotoLibrary,
  Email,
  Upload,
  School,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AdminLayout from '../components/AdminLayout';

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  borderRadius: 12,
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
    border: '1px solid #1a237e'
  }
}));

const ModuleCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
    border: '2px solid #1a237e',
    '& .module-icon': {
      transform: 'scale(1.1)',
    }
  }
}));

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Events',
      value: '24',
      change: '+12%',
      icon: <Event sx={{ fontSize: 28 }} />,
      color: '#1a237e'
    },
    {
      title: 'Staff Members',
      value: '18',
      change: '+2',
      icon: <People sx={{ fontSize: 28 }} />,
      color: '#4caf50'
    },
    {
      title: 'Documents',
      value: '156',
      change: '+8%',
      icon: <Assignment sx={{ fontSize: 28 }} />,
      color: '#ff9800'
    },
    {
      title: 'Gallery Items',
      value: '89',
      change: '+15%',
      icon: <PhotoLibrary sx={{ fontSize: 28 }} />,
      color: '#9c27b0'
    }
  ];

  const mainModules = [
    {
      title: 'Application Management',
      description: 'Review and manage student applications',
      icon: <Assignment sx={{ fontSize: 48 }} />,
      color: '#d32f2f',
      path: '/admin/applications',
      status: 'active'
    },
    {
      title: 'Calendar Management',
      description: 'Manage school calendar, terms, and events',
      icon: <CalendarToday sx={{ fontSize: 48 }} />,
      color: '#1a237e',
      path: '/admin/calendar',
      status: 'active'
    },
    {
      title: 'Gallery Management',
      description: 'Upload and organize images and videos',
      icon: <PhotoLibrary sx={{ fontSize: 48 }} />,
      color: '#9c27b0',
      path: '/admin/gallery',
      status: 'active'
    },
    {
      title: 'Newsletter System',
      description: 'Automated parent communication',
      icon: <Email sx={{ fontSize: 48 }} />,
      color: '#2196f3',
      path: '/admin/newsletters',
      status: 'active'
    },
    {
      title: 'School Statistics',
      description: 'View and manage school metrics',
      icon: <BarChart sx={{ fontSize: 48 }} />,
      color: '#4caf50',
      path: '/admin/school-stats',
      status: 'active'
    }
  ];

  const utilityModules = [
    {
      title: 'Staff Upload',
      description: 'Manage staff photos and information',
      icon: <Upload sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      path: '/admin/staff-upload',
      status: 'active'
    },
    {
      title: 'Document Upload',
      description: 'Upload school documents and policies',
      icon: <School sx={{ fontSize: 40 }} />,
      color: '#ff9800',
      path: '/admin/document-upload',
      status: 'active'
    }
  ];

  return (
    <AdminLayout>
      <Box>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280' }}>
            Manage your school's digital presence with ease
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 0.5 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {stat.title}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color, width: 48, height: 48 }}>
                      {stat.icon}
                    </Avatar>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ fontSize: 16, color: '#10b981', mr: 0.5 }} />
                    <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                      {stat.change}
                    </Typography>
                  </Box>
                </CardContent>
              </StatCard>
            </Grid>
          ))}
        </Grid>

        {/* Main Management Modules */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mb: 3 }}>
            Management Modules
          </Typography>
          <Grid container spacing={3}>
            {mainModules.map((module, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ModuleCard onClick={() => navigate(module.path)}>
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      mb: 2
                    }}>
                      <Avatar 
                        className="module-icon"
                        sx={{ 
                          bgcolor: `${module.color}15`, 
                          color: module.color, 
                          width: 64, 
                          height: 64,
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        {module.icon}
                      </Avatar>
                      <Chip 
                        label={module.status} 
                        size="small" 
                        sx={{ 
                          bgcolor: '#10b981',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
                      {module.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 2, flex: 1 }}>
                      {module.description}
                    </Typography>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForward />}
                      sx={{
                        bgcolor: module.color,
                        color: 'white',
                        '&:hover': {
                          bgcolor: module.color,
                          filter: 'brightness(0.9)'
                        },
                        mt: 'auto'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(module.path);
                      }}
                    >
                      Open Module
                    </Button>
                  </CardContent>
                </ModuleCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Utility Modules */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mb: 3 }}>
            Utility Tools
          </Typography>
          <Grid container spacing={3}>
            {utilityModules.map((module, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <ModuleCard onClick={() => navigate(module.path)}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        className="module-icon"
                        sx={{ 
                          bgcolor: `${module.color}15`, 
                          color: module.color, 
                          width: 56, 
                          height: 56,
                          mr: 2,
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        {module.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 0.5 }}>
                          {module.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          {module.description}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        endIcon={<ArrowForward />}
                        sx={{
                          borderColor: module.color,
                          color: module.color,
                          '&:hover': {
                            borderColor: module.color,
                            bgcolor: `${module.color}10`
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(module.path);
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

        {/* System Status */}
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
            System Status
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                    Server Health
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                    98%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={98} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#10b981',
                      borderRadius: 4
                    }
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                    Database
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                    100%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#10b981',
                      borderRadius: 4
                    }
                  }} 
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                    Storage
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                    75%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={75} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#f59e0b',
                      borderRadius: 4
                    }
                  }} 
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard;
