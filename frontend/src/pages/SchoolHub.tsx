import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CalendarToday,
  Announcement,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import EnhancedSchoolCalendar from '../components/EnhancedSchoolCalendar';
import News from './News';
import SEO from '../components/SEO';
import ReturnToHome from '../components/ReturnToHome';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("/edu2.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
  backgroundRepeat: 'no-repeat',
  color: 'white',
  minHeight: '500px',
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.80), rgba(211, 47, 47, 0.60))',
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`school-hub-tabpanel-${index}`}
      aria-labelledby={`school-hub-tab-${index}`}
      {...other}
    >
      {value === index && <TabPanel>{children}</TabPanel>}
    </div>
  );
}

const SchoolHub: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Determine initial tab from URL hash
  useEffect(() => {
    const hash = location.hash;
    if (hash === '#announcements') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [location.hash]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Update URL hash for bookmarking/sharing
    const hashMap = ['', '#announcements'];
    navigate(`/school-hub${hashMap[newValue]}`, { replace: true });
  };

  return (
    <>
      <SEO
        title="School Hub - Holy Cross Convent School"
        description="Stay updated with school events, calendar, announcements, and gallery. Find all important school information in one place."
        keywords="school events, calendar, announcements, gallery, Holy Cross Convent School"
      />

      {/* Hero Section */}
      <HeroSection>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  fontWeight: 900,
                  mb: 2,
                  color: '#ffd700',
                  textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9), 0 0 60px rgba(26,35,126,0.6)',
                  letterSpacing: '0.5px'
                }}
              >
                School Hub
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  maxWidth: '800px',
                  mx: 'auto',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  lineHeight: 1.6,
                  textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8)',
                  mb: 3
                }}
              >
                Your Central Hub for School Life
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: '700px',
                  mx: 'auto',
                  color: '#ffffff',
                  fontWeight: 400,
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  lineHeight: 1.6,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                Stay connected with events, announcements, and everything happening at Holy Cross
              </Typography>
            </Box>
          </Container>
        </Box>
      </HeroSection>

      <Container maxWidth="xl" sx={{ py: 6, mt: 4 }}>
        {/* Return to Home - positioned to avoid header clash */}
        <Box sx={{ 
          position: 'fixed', 
          top: { xs: 80, sm: 100 }, 
          left: 16, 
          zIndex: 1000,
          '& .MuiTypography-root': {
            color: 'white !important',
            textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(26, 35, 126, 0.7)',
            padding: '8px 16px',
            borderRadius: '8px',
            display: 'inline-block',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              transform: 'translateX(-2px)',
              backgroundColor: 'rgba(26, 35, 126, 0.9)',
            },
            transition: 'all 0.3s ease'
          }
        }}>
          <ReturnToHome />
        </Box>

        {/* Tabs Navigation */}
        <Paper sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="School Hub tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 72,
                fontSize: '1rem',
                fontWeight: 600,
                color: '#666',
                '&.Mui-selected': {
                  color: '#1a237e',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1a237e',
                height: 3,
              },
            }}
          >
            <Tab
              icon={<CalendarToday sx={{ mb: 0.5 }} />}
              label="Calendar & Events"
              iconPosition="start"
            />
            <Tab
              icon={<Announcement sx={{ mb: 0.5 }} />}
              label="Announcements"
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <CustomTabPanel value={activeTab} index={0}>
          <EnhancedSchoolCalendar />
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={1}>
          <News />
        </CustomTabPanel>
      </Container>
    </>
  );
};

export default SchoolHub;

