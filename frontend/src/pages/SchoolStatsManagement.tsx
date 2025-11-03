import React from 'react';
import { Box } from '@mui/material';
import SchoolStatsAdmin from '../components/SchoolStatsAdmin';
import SEO from '../components/SEO';

const SchoolStatsManagement: React.FC = () => {
  return (
    <>
      <SEO
        title="School Statistics Management - Holy Cross Convent School Brooklyn"
        description="Manage school statistics and numbers displayed on the homepage"
        keywords="school statistics, admin, management, numbers, homepage"
      />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
        <SchoolStatsAdmin />
      </Box>
    </>
  );
};

export default SchoolStatsManagement;













