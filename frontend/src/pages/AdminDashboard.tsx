import React from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Stack,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Event,
  People,
  TrendingUp,
  CalendarToday,
  BarChart,
  ArrowForward,
  Assignment,
  PhotoLibrary
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AdminLayout from '../components/AdminLayout';

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  borderRadius: 16,
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid #e2e8f0',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    border: '1px solid #1a237e'
  }
}));

const QuickActionCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  borderRadius: 16,
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid #e2e8f0',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
    border: '1px solid #1a237e'
  }
}));


const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Calendar Management',
      description: 'Manage school calendar and events',
      icon: <CalendarToday sx={{ fontSize: 40, color: '#1a237e' }} />,
      color: '#1a237e',
      onClick: () => navigate('/admin/calendar')
    },
    {
      title: 'School Statistics',
      description: 'View and manage school metrics',
      icon: <BarChart sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: '#4caf50',
      onClick: () => navigate('/admin/stats')
    },
    {
      title: 'Staff Upload',
      description: 'Upload and manage staff photos',
      icon: <People sx={{ fontSize: 40, color: '#9c27b0' }} />,
      color: '#9c27b0',
      onClick: () => navigate('/admin/staff-upload')
    },
    {
      title: 'Document Upload',
      description: 'Upload school documents',
      icon: <Assignment sx={{ fontSize: 40, color: '#ff9800' }} />,
      color: '#ff9800',
      onClick: () => navigate('/admin/document-upload')
    }
  ];

  const stats = [
    {
      title: 'Total Events',
      value: '24',
      change: '+12%',
      icon: <Event sx={{ fontSize: 32, color: '#1a237e' }} />,
      color: '#1a237e'
    },
    {
      title: 'Staff Members',
      value: '18',
      change: '+2',
      icon: <People sx={{ fontSize: 32, color: '#4caf50' }} />,
      color: '#4caf50'
    },
    {
      title: 'Documents',
      value: '156',
      change: '+8%',
      icon: <Assignment sx={{ fontSize: 32, color: '#ff9800' }} />,
      color: '#ff9800'
    },
    {
      title: 'Gallery Items',
      value: '89',
      change: '+15%',
      icon: <PhotoLibrary sx={{ fontSize: 32, color: '#9c27b0' }} />,
      color: '#9c27b0'
    }
  ];

  const recentActivities = [
    {
      action: 'New event added',
      description: 'Sports Day 2025',
      time: '2 hours ago',
      icon: <Event sx={{ color: '#1a237e' }} />,
      status: 'completed'
    },
    {
      action: 'Staff photo uploaded',
      description: 'Mrs. Du Plesis - Principal',
      time: '4 hours ago',
      icon: <People sx={{ color: '#4caf50' }} />,
      status: 'completed'
    },
    {
      action: 'Document updated',
      description: 'School Policy 2025',
      time: '1 day ago',
      icon: <Assignment sx={{ color: '#ff9800' }} />,
      status: 'completed'
    },
    {
      action: 'Calendar event scheduled',
      description: 'Parent Meeting - Grade 7',
      time: '2 days ago',
      icon: <CalendarToday sx={{ color: '#9c27b0' }} />,
      status: 'pending'
    }
  ];

  return (
    <AdminLayout>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
            Welcome to Admin Dashboard
            </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280' }}>
            Manage your school's digital presence with ease
            </Typography>
          </Box>

          {/* Stats Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            {stats.map((stat, index) => (
            <Box key={index} sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
                <StatCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.value}
                    </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {stat.title}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color }}>
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
            </Box>
            ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Quick Actions */}
          <Box sx={{ flex: { xs: '1', md: '2' } }}>
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
              Quick Actions
            </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {quickActions.map((action, index) => (
                  <Box key={index} sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                    <QuickActionCard onClick={action.onClick}>
                      <Box sx={{ mb: 2 }}>
                        {action.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                        {action.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowForward />}
                        sx={{ 
                          borderColor: action.color,
                          color: action.color,
                          '&:hover': {
                            borderColor: action.color,
                            bgcolor: `${action.color}10`
                          }
                        }}
                      >
                        Access
                      </Button>
                    </QuickActionCard>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Recent Activities */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
                Recent Activities
              </Typography>
              <Stack spacing={2}>
                {recentActivities.map((activity, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                    <Avatar sx={{ bgcolor: `${activity.icon.props.color}20`, color: activity.icon.props.color, mr: 2 }}>
                      {activity.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                        {activity.action}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        {activity.description}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip 
                        label={activity.status} 
                        size="small" 
                        color={activity.status === 'completed' ? 'success' : 'warning'}
                        sx={{ mb: 0.5 }}
                      />
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {activity.time}
                      </Typography>
                    </Box>
          </Box>
                ))}
              </Stack>
            </Paper>
          </Box>

          {/* Sidebar */}
          <Box sx={{ flex: { xs: '1', md: '1' } }}>
            {/* System Status */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
                System Status
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
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
                        bgcolor: '#10b981'
                      }
                    }} 
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
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
                        bgcolor: '#10b981'
                      }
                    }} 
                  />
                </Box>
          <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
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
                        bgcolor: '#f59e0b'
                      }
                    }} 
                  />
                </Box>
              </Stack>
            </Paper>

            {/* Quick Stats */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
                Quick Stats
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    This Month
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
                    12
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Active Users
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    8
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Total Views
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 600 }}>
                    1,234
            </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard;