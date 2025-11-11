import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Analytics from './components/Analytics';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import History from './pages/History';
import Spiritual from './pages/Spiritual';
import Info from './pages/Info';
import Events from './pages/Events';
import SchoolBoard from './pages/SchoolBoard';
import Staff from './pages/Staff';
import Links from './pages/Links';
import ExtraMural from './pages/ExtraMural';
import FormsFees from './pages/FormsFees';
import News from './pages/News';
import Music from './pages/Music';
import ContactForm from './components/ContactForm';
import Donate from './pages/Donate';
import AdminDocumentUpload from './pages/AdminDocumentUpload';
import AdminDocumentManagement from './pages/AdminDocumentManagement';
import AdminStaffUploadPage from './pages/AdminStaffUploadPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminApplicationManagement from './pages/AdminApplicationManagement';
import SchoolStatsManagement from './pages/SchoolStatsManagement';
import ProtectedRoute from './components/ProtectedRoute';
import SchoolDocuments from './pages/SchoolDocuments';
import LogoSymbolismPage from './pages/LogoSymbolism';
import MissionVision from './pages/MissionVision';
import FamilyStatementPage from './pages/FamilyStatement';
// import Academics from './pages/Academics'; // File doesn't exist
// import Robotics from './pages/Robotics'; // File doesn't exist  
// import ICTHub from './pages/ICTHub'; // File doesn't exist
import Calendar from './pages/Calendar';
import SchoolHub from './pages/SchoolHub';
import CalendarManagement from './pages/CalendarManagement';
import GalleryManagement from './pages/GalleryManagement';
import NewsletterManagement from './pages/NewsletterManagement';
import AdminGoverningBody from './pages/AdminGoverningBody';
import AdminAnnouncements from './pages/AdminAnnouncements';
import Academic from './pages/Academic';
import Robotics from './pages/Robotics';
import Sport from './pages/Sport';
import Cultural from './pages/Cultural';
import ServiceEthos from './pages/ServiceEthos';
import AfterSchoolProgram from './pages/AfterSchoolProgram';
import Vacancies from './pages/Vacancies';
import VacancyManagement from './pages/VacancyManagement';
import ApplicationProcess from './pages/ApplicationProcess';

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
      case '/links':
        return 'Links';
      case '/music':
        return 'Music';
      case '/extra-mural':
        return 'Extra Mural';
      case '/spiritual':
        return 'Spiritual';
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
      case '/aftercare':
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
    );
  }

  // Public routes - WITH Layout (Header/Footer)
  return (
    <Layout currentPage={getCurrentPage()} onNavigate={handleNavigation}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/school-hub" element={<SchoolHub />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/history" element={<History />} />
        <Route path="/news" element={<News />} />
        <Route path="/spiritual" element={<Spiritual />} />
        <Route path="/info" element={<Info />} />
        <Route path="/events" element={<Events />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/school-board" element={<SchoolBoard />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/links" element={<Links />} />
        <Route path="/forms" element={<FormsFees />} />
        <Route path="/extra-mural" element={<ExtraMural />} />
        <Route path="/music" element={<Music />} />
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
        <Route path="/aftercare" element={<AfterSchoolProgram />} />
        <Route path="/vacancies" element={<Vacancies />} />
        {/* Admissions Section */}
        <Route path="/admissions" element={<ApplicationProcess />} />
        {/* Add more routes as we create more pages */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
};

function App() {
  // Register service worker for offline functionality
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
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
