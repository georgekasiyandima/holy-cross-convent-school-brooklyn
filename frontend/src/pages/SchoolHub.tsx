import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  useTheme,
  useMediaQuery,
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

// Import hero image for better performance and bundling
const heroImagePath = '/edu2.jpg';
const heroImageUrl = `${process.env.PUBLIC_URL || ''}${heroImagePath}`;

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("/edu2.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
  backgroundRepeat: 'no-repeat',
  color: 'white',
  minHeight: '60vh',
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    minHeight: '70vh',
  },
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

// Extracted SchoolHubTab component for reusability and cleaner code
interface SchoolHubTabProps {
  icon: React.ElementType;
  label: string;
  index: number;
}

const SchoolHubTab: React.FC<SchoolHubTabProps> = ({ icon: Icon, label, index }) => (
  <Tab
    icon={<Icon sx={{ mb: 0.5 }} aria-hidden="true" />}
    label={label}
    iconPosition="start"
    id={`school-hub-tab-${index}`}
    aria-controls={`school-hub-tabpanel-${index}`}
    data-testid={`school-hub-tab-${index}`}
  />
);

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      aria-label={`School Hub tab panel ${index + 1}`}
      hidden={value !== index}
      id={`school-hub-tabpanel-${index}`}
      aria-labelledby={`school-hub-tab-${index}`}
      aria-live="polite"
      data-testid={`school-hub-tabpanel-${index}`}
      {...other}
    >
      {value === index && <TabPanel role="region">{children}</TabPanel>}
    </div>
  );
}

const SchoolHub: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);

  // Determine initial tab from URL hash
  useEffect(() => {
    const hash = location.hash;
    if (hash === '#announcements') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
    return () => {
      // Cleanup function
    };
  }, [location.hash]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Update URL hash for bookmarking/sharing
    const hashMap = ['', '#announcements'];
    navigate(`/school-hub${hashMap[newValue]}`, { replace: false });
  };

  return (
    <>
      <SEO
        title="School Hub - Holy Cross Convent School"
        description="Stay updated with school events, calendar, announcements, and gallery. Find all important school information in one place."
        keywords="school events, calendar, announcements, gallery, Holy Cross Convent School"
        image={heroImageUrl}
        type="website"
      />

      {/* Hero Section */}
      <HeroSection data-testid="school-hub-hero">
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Container maxWidth="lg" sx={{ position: 'relative', py: 8 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                component="h1"
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  fontWeight: 900,
                  mb: 2,
                  color: '#ffd700',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.6)',
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
                  textShadow: '1px 1px 3px rgba(0,0,0,0.7), 0 0 10px rgba(0,0,0,0.5)',
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
                  textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
                }}
              >
                Stay connected with events, announcements, and everything happening at Holy Cross
              </Typography>
            </Box>
          </Container>
        </Box>
      </HeroSection>

      <Container maxWidth="lg" sx={{ position: 'relative', py: 6, mt: 4 }} data-testid="school-hub-content">
        {/* Return to Home - moved outside hero to avoid blocking content */}
        <Box sx={{ 
          position: 'absolute',
          top: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 24 },
          zIndex: 10,
        }}>
          <ReturnToHome data-testid="return-to-home-school-hub" />
        </Box>

        {/* Tabs Navigation */}
        <Paper sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }} data-testid="school-hub-tabs-paper">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="School Hub tabs"
            variant={isMobile ? 'fullWidth' : 'scrollable'}
            scrollButtons="auto"
            data-testid="school-hub-tabs"
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
            <SchoolHubTab icon={CalendarToday} label="Calendar & Events" index={0} />
            <SchoolHubTab icon={Announcement} label="Announcements" index={1} />
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

