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
  PhotoLibrary,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import EnhancedSchoolCalendar from '../components/EnhancedSchoolCalendar';
import News from './News';
import Gallery from './Gallery';
import SEO from '../components/SEO';
import ReturnToHome from '../components/ReturnToHome';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("/ROBT02.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  color: 'white',
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.75) 0%, rgba(57, 73, 171, 0.65) 100%)',
    zIndex: 0,
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
    } else if (hash === '#gallery') {
      setActiveTab(2);
    } else {
      setActiveTab(0);
    }
  }, [location.hash]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Update URL hash for bookmarking/sharing
    const hashMap = ['', '#announcements', '#gallery'];
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
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  fontWeight: 800,
                  mb: 3,
                  color: '#ffffff',
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
                  fontFamily: '"Lato", "Open Sans", sans-serif'
                }}
              >
                School Hub
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  maxWidth: '700px',
                  mx: 'auto',
                  color: '#ffffff',
                  fontWeight: 500,
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  lineHeight: 1.6,
                  textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)',
                  fontFamily: '"Lato", "Open Sans", sans-serif'
                }}
              >
                Your central place for events, calendar, announcements, and school gallery
              </Typography>
            </Box>
          </Container>
        </Box>
      </HeroSection>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ReturnToHome />

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
            <Tab
              icon={<PhotoLibrary sx={{ mb: 0.5 }} />}
              label="Gallery"
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

        <CustomTabPanel value={activeTab} index={2}>
          <Gallery />
        </CustomTabPanel>
      </Container>
    </>
  );
};

export default SchoolHub;

