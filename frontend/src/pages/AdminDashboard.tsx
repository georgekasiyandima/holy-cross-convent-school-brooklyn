import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Stack } from '@mui/material';
import {
  Dashboard,
  Event,
  Article,
  Announcement,
  People,
  School,
  Settings,
  Analytics,
  Upload,
  Image,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AdminLayout from '../components/AdminLayout';
import ContentManagement from '../components/ContentManagement';

const DashboardContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  minHeight: '100vh',
  padding: theme.spacing(4)
}));

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(26, 35, 126, 0.15)',
  }
}));

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Content Management',
      description: 'Manage events, news, and announcements',
      icon: <Article />,
      color: '#2196f3',
      onClick: () => navigate('/admin/content')
    },
    {
      title: 'Staff Management',
      description: 'Upload and manage staff photos',
      icon: <People />,
      color: '#9c27b0',
      onClick: () => navigate('/admin/staff-upload')
    },
    {
      title: 'Document Management',
      description: 'Upload and organize school documents',
      icon: <Upload />,
      color: '#4caf50',
      onClick: () => navigate('/admin/documents')
    },
    {
      title: 'Gallery Management',
      description: 'Manage school gallery and images',
      icon: <Image />,
      color: '#ff9800',
      onClick: () => navigate('/admin/gallery')
    },
    {
      title: 'School Statistics',
      description: 'Manage "Our School by the Numbers" section',
      icon: <TrendingUp />,
      color: '#e91e63',
      onClick: () => navigate('/admin/school-stats')
    }
  ];

  const stats = [
    { title: 'Total Events', value: '12', color: '#2196f3' },
    { title: 'News Articles', value: '8', color: '#4caf50' },
    { title: 'Staff Members', value: '25', color: '#9c27b0' },
    { title: 'Documents', value: '15', color: '#ff9800' }
  ];

  return (
    <AdminLayout>
      <DashboardContainer>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your school's content and resources
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} {...({ item: true } as any)} key={index}>
                <StatCard>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </CardContent>
                </StatCard>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} {...({ item: true } as any)} key={index}>
                  <StatCard onClick={action.onClick}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          bgcolor: action.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          color: 'white'
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </CardContent>
                  </StatCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Content Management Section */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
              Content Management
            </Typography>
            <ContentManagement />
          </Box>
        </Container>
      </DashboardContainer>
    </AdminLayout>
  );
};

export default AdminDashboard;
