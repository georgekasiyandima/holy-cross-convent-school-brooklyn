import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress, Typography } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Analytics from './components/Analytics';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Gallery = lazy(() => import('./pages/Gallery'));
const History = lazy(() => import('./pages/History'));
const Info = lazy(() => import('./pages/Info'));
const Events = lazy(() => import('./pages/Events'));
const SchoolBoard = lazy(() => import('./pages/SchoolBoard'));
const Staff = lazy(() => import('./pages/Staff'));
const ExtraMural = lazy(() => import('./pages/ExtraMural'));
const FormsFees = lazy(() => import('./pages/FormsFees'));
const News = lazy(() => import('./pages/News'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const Donate = lazy(() => import('./pages/Donate'));
const AdminDocumentUpload = lazy(() => import('./pages/AdminDocumentUpload'));
const AdminDocumentManagement = lazy(() => import('./pages/AdminDocumentManagement'));
const AdminStaffUploadPage = lazy(() => import('./pages/AdminStaffUploadPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminApplicationManagement = lazy(() => import('./pages/AdminApplicationManagement'));
const SchoolStatsManagement = lazy(() => import('./pages/SchoolStatsManagement'));
const SchoolDocuments = lazy(() => import('./pages/SchoolDocuments'));
const LogoSymbolismPage = lazy(() => import('./pages/LogoSymbolism'));
const MissionVision = lazy(() => import('./pages/MissionVision'));
const FamilyStatementPage = lazy(() => import('./pages/FamilyStatement'));
const Calendar = lazy(() => import('./pages/Calendar'));
const SchoolHub = lazy(() => import('./pages/SchoolHub'));
const CalendarManagement = lazy(() => import('./pages/CalendarManagement'));
const GalleryManagement = lazy(() => import('./pages/GalleryManagement'));
const NewsletterManagement = lazy(() => import('./pages/NewsletterManagement'));
const AdminGoverningBody = lazy(() => import('./pages/AdminGoverningBody'));
const AdminAnnouncements = lazy(() => import('./pages/AdminAnnouncements'));
const Academic = lazy(() => import('./pages/Academic'));
const Robotics = lazy(() => import('./pages/Robotics'));
const Sport = lazy(() => import('./pages/Sport'));
const Cultural = lazy(() => import('./pages/Cultural'));
const ServiceEthos = lazy(() => import('./pages/ServiceEthos'));
const AfterSchoolProgram = lazy(() => import('./pages/AfterSchoolProgram'));
const VirtualTour = lazy(() => import('./pages/VirtualTour'));
const Vacancies = lazy(() => import('./pages/Vacancies'));
const VacancyManagement = lazy(() => import('./pages/VacancyManagement'));
const ApplicationProcess = lazy(() => import('./pages/ApplicationProcess'));

// Extend Material-UI theme to include custom school colors
declare module '@mui/material/styles' {
  interface Palette {
    school: {
      navy: string;
      gold: string;
      red: string;
      lightRed: string;
      darkRed: string;
    };
  }

  interface PaletteOptions {
    school?: {
      navy: string;
      gold: string;
      red: string;
      lightRed: string;
      darkRed: string;
    };
  }
}

// Create a theme with school colors (navy blue, gold, and red)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Deep navy blue
      light: '#3949ab',
      dark: '#0d1458',
    },
    secondary: {
      main: '#ffd700', // Gold
      light: '#ffed4e',
      dark: '#e6c200',
    },
    error: {
      main: '#d32f2f', // Red
      light: '#f44336',
      dark: '#b71c1c',
    },
    warning: {
      main: '#ff9800', // Orange
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#1976d2', // Blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    success: {
      main: '#388e3c', // Green
      light: '#66bb6a',
      dark: '#2e7d32',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    // Custom school colors
    school: {
      navy: '#1a237e',
      gold: '#ffd700',
      red: '#d32f2f',
      lightRed: '#ffebee',
      darkRed: '#b71c1c',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
      color: '#1a237e',
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      color: '#1a237e',
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      color: '#1a237e',
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      color: '#1a237e',
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      color: '#1a237e',
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      color: '#1a237e',
    },
    body1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 400,
    },
  },
});

// Navigation component
const NavigationWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const getCurrentPage = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Home';
      case '/school-hub':
        return 'School Hub';
      case '/gallery':
        return 'Gallery';
      case '/history':
        return 'History';
      case '/news':
        return 'News';
      case '/school-board':
        return 'Governing Body';
      case '/admin/announcements':
        return 'Announcements';
      case '/staff':
        return 'Staff';
      case '/info':
        return 'Info';
      case '/forms':
        return 'School Documents';
      case '/extra-mural':
        return 'Extra Mural';
      case '/events':
        return 'Events';
      case '/donate':
        return 'Donate';
      case '/contact':
        return 'Contact';
      case '/documents':
        return 'School Documents';
      case '/logo-symbolism':
        return 'Logo Symbolism';
      case '/mission-vision':
        return 'Mission & Vision';
      case '/family-statement':
        return 'Family Statement';
      case '/academics':
        return 'Academics';
      case '/robotics':
        return 'Robotics';
      case '/ict-hub':
        return 'ICT Hub';
      case '/academic':
        return 'Academic';
      case '/sport':
        return 'Sport';
      case '/cultural':
        return 'Cultural';
      case '/service-ethos':
        return 'Service & Ethos';
      case '/after-school-programme':
        return 'After School Programme';
      case '/vacancies':
        return 'Vacancies';
      case '/admissions':
        return 'Application Process';
      default:
        return 'Home';
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Admin routes - NO public Layout (Header/Footer)
  if (isAdminRoute) {
    return (
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/applications" 
            element={
              <ProtectedRoute>
                <AdminApplicationManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/staff-upload" 
            element={
              <ProtectedRoute>
                <AdminStaffUploadPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/document-upload" 
            element={
              <ProtectedRoute>
                <AdminDocumentUpload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/document-management" 
            element={
              <ProtectedRoute>
                <AdminDocumentManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/school-stats" 
            element={
              <ProtectedRoute>
                <SchoolStatsManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/calendar" 
            element={
              <ProtectedRoute>
                <CalendarManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/gallery" 
            element={
              <ProtectedRoute>
                <GalleryManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/announcements" 
            element={
              <ProtectedRoute>
                <AdminAnnouncements />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/newsletters" 
            element={
              <ProtectedRoute>
                <NewsletterManagement />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin/governing-body"
            element={
              <ProtectedRoute>
                <AdminGoverningBody />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/vacancies" 
            element={
              <ProtectedRoute>
                <VacancyManagement />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Suspense>
    );
  }

  // Public routes - WITH Layout (Header/Footer)
  return (
    <Layout currentPage={getCurrentPage()} onNavigate={handleNavigation}>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/school-hub" element={<SchoolHub />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/virtual-tour" element={<VirtualTour />} />
          <Route path="/history" element={<History />} />
          <Route path="/news" element={<News />} />
          <Route path="/info" element={<Info />} />
          <Route path="/events" element={<Events />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/school-board" element={<SchoolBoard />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/forms" element={<FormsFees />} />
          <Route path="/extra-mural" element={<ExtraMural />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/documents" element={<SchoolDocuments />} />
          <Route path="/logo-symbolism" element={<LogoSymbolismPage />} />
          <Route path="/mission-vision" element={<MissionVision />} />
          <Route path="/family-statement" element={<FamilyStatementPage />} />
          {/* Pillars Section */}
          <Route path="/academic" element={<Academic />} />
          <Route path="/robotics" element={<Robotics />} />
          <Route path="/sport" element={<Sport />} />
          <Route path="/cultural" element={<Cultural />} />
          <Route path="/service-ethos" element={<ServiceEthos />} />
          {/* Our School Section */}
          <Route path="/after-school-programme" element={<AfterSchoolProgram />} />
          <Route path="/vacancies" element={<Vacancies />} />
          {/* Admissions Section */}
          <Route path="/admissions" element={<ApplicationProcess />} />
          {/* Add more routes as we create more pages */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

const SuspenseFallback: React.FC = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      background: 'linear-gradient(135deg, rgba(26,35,126,0.08), rgba(255,215,0,0.12))'
    }}
  >
    <CircularProgress size={56} sx={{ color: '#1a237e' }} />
    <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
      Loading content...
    </Typography>
  </Box>
);

function App() {
  // Register service worker for offline functionality
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleLoad = () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('SW registered: ', registration);
            }
          })
          .catch((registrationError) => {
            if (process.env.NODE_ENV === 'development') {
              console.error('SW registration failed: ', registrationError);
            }
          });
      };

      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
    return undefined;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelmetProvider>
        <AuthProvider>
          <Analytics />
          <Router>
            <NavigationWrapper />
          </Router>
        </AuthProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
