import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import SchoolStatsAdmin from '../components/SchoolStatsAdmin';
import SEO from '../components/SEO';
import AdminLayout from '../components/AdminLayout';

const SchoolStatsManagement: React.FC = () => {
  return (
    <AdminLayout>
      <SEO
        title="School Statistics Management - Holy Cross Convent School Brooklyn"
        description="Manage school statistics and numbers displayed on the homepage"
        keywords="school statistics, admin, management, numbers, homepage"
      />

      <Box
        sx={{
          background: 'linear-gradient(135deg,#1a237e 0%,#3949ab 60%,#5c6bc0 100%)',
          color: '#fff',
          py: { xs: 6, md: 8 },
          borderBottomLeftRadius: { xs: 0, md: 32 },
          borderBottomRightRadius: { xs: 0, md: 32 },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            School Statistics
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 680 }}>
            Curate the numbers showcased on the homepage and align them with current achievements.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh', pb: 6 }}>
        <SchoolStatsAdmin />
      </Box>
    </AdminLayout>
  );
};

export default SchoolStatsManagement;


















