import React from 'react';
import { Container, Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Home, CalendarToday } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EnhancedSchoolCalendar from '../components/EnhancedSchoolCalendar';
import SEO from '../components/SEO';
import ReturnToHome from '../components/ReturnToHome';

const Calendar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="School Calendar - Holy Cross Convent School"
        description="View our school calendar with upcoming events, academic dates, sports activities, and important school dates."
        keywords="school calendar, events, academic calendar, sports, activities, Holy Cross Convent School"
      />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ReturnToHome />
        
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link
              color="inherit"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Home fontSize="small" />
              Home
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday fontSize="small" />
              Calendar
            </Typography>
          </Breadcrumbs>
          
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700, 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <CalendarToday sx={{ color: '#ffca28', fontSize: 40 }} />
            School Calendar
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 3, maxWidth: 800 }}
          >
            Stay updated with all school events, academic dates, sports activities, 
            and important school announcements. Our calendar helps you plan ahead 
            and never miss important school activities.
          </Typography>
        </Box>

        <EnhancedSchoolCalendar />
      </Container>
    </>
  );
};

export default Calendar;


