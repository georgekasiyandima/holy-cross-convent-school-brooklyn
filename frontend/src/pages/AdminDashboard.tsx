import React from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Grid,
  Paper,
  Avatar
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
  Work
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AdminLayout from '../components/AdminLayout';

const ModuleCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    border: '1px solid #1a237e'
  }
}));

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const mainModules = [
    {
      title: 'Application Management',
      description: 'Review and manage student applications',
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      path: '/admin/applications'
    },
    {
      title: 'Calendar Management',
      description: 'Manage school calendar, terms, and events',
      icon: <CalendarToday sx={{ fontSize: 40 }} />,
      color: '#1a237e',
      path: '/admin/calendar'
    },
    {
      title: 'Gallery Management',
      description: 'Upload and organize images and videos',
      icon: <PhotoLibrary sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      path: '/admin/gallery'
    },
    {
      title: 'Newsletter System',
      description: 'Automated parent communication',
      icon: <Email sx={{ fontSize: 40 }} />,
      color: '#2196f3',
      path: '/admin/newsletters'
    },
    {
      title: 'Vacancy Management',
      description: 'Post and manage job openings',
      icon: <Work sx={{ fontSize: 40 }} />,
      color: '#ff6f00',
      path: '/admin/vacancies'
    },
    {
      title: 'School Statistics',
      description: 'View and manage school metrics',
      icon: <BarChart sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      path: '/admin/school-stats'
    }
  ];

  const utilityModules = [
    {
      title: 'Staff Upload',
      description: 'Manage staff photos and information',
      icon: <Upload sx={{ fontSize: 36 }} />,
      color: '#9c27b0',
      path: '/admin/staff-upload'
    },
    {
      title: 'Document Upload',
      description: 'Upload school documents and policies',
      icon: <School sx={{ fontSize: 36 }} />,
      color: '#ff9800',
      path: '/admin/document-upload'
    }
  ];

  return (
    <AdminLayout>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          Manage your school's digital presence
        </Typography>
      </Box>

      {/* Main Management Modules */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 2, fontSize: '1rem' }}>
          Management Modules
        </Typography>
        <Grid container spacing={2}>
          {mainModules.map((module, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ModuleCard onClick={() => navigate(module.path)}>
                <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: `${module.color}15`, 
                        color: module.color, 
                        width: 48, 
                        height: 48,
                        mr: 1.5
                      }}
                    >
                      {module.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a237e', mb: 0.5, fontSize: '0.95rem' }}>
                        {module.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: 1.4 }}>
                        {module.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                    sx={{
                      bgcolor: module.color,
                      color: 'white',
                      mt: 'auto',
                      '&:hover': {
                        bgcolor: module.color,
                        filter: 'brightness(0.9)'
                      },
                      fontSize: '0.8rem',
                      py: 0.75
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(module.path);
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
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 2, fontSize: '1rem' }}>
          Utility Tools
        </Typography>
        <Grid container spacing={2}>
          {utilityModules.map((module, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <ModuleCard onClick={() => navigate(module.path)}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: `${module.color}15`, 
                        color: module.color, 
                        width: 44, 
                        height: 44,
                        mr: 1.5
                      }}
                    >
                      {module.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a237e', mb: 0.5, fontSize: '0.95rem' }}>
                        {module.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: 1.4 }}>
                        {module.description}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                      sx={{
                        borderColor: module.color,
                        color: module.color,
                        '&:hover': {
                          borderColor: module.color,
                          bgcolor: `${module.color}10`
                        },
                        fontSize: '0.8rem',
                        py: 0.75,
                        px: 2
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
    </AdminLayout>
  );
};

export default AdminDashboard;
