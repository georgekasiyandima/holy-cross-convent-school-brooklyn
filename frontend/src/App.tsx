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
import AdminStaffUploadPage from './pages/AdminStaffUploadPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminApplicationManagement from './pages/AdminApplicationManagement';
import SchoolStatsManagement from './pages/SchoolStatsManagement';
import SchoolDocuments from './pages/SchoolDocuments';
import LogoSymbolismPage from './pages/LogoSymbolism';
import MissionVision from './pages/MissionVision';
import FamilyStatementPage from './pages/FamilyStatement';
// import Academics from './pages/Academics'; // File doesn't exist
// import Robotics from './pages/Robotics'; // File doesn't exist  
// import ICTHub from './pages/ICTHub'; // File doesn't exist
import Calendar from './pages/Calendar';
import CalendarManagement from './pages/CalendarManagement';
import GalleryManagement from './pages/GalleryManagement';
import NewsletterManagement from './pages/NewsletterManagement';
import Academic from './pages/Academic';
import Robotics from './pages/Robotics';
import Sport from './pages/Sport';
import Cultural from './pages/Cultural';
import ServiceEthos from './pages/ServiceEthos';
import Aftercare from './pages/Aftercare';
import Vacancies from './pages/Vacancies';
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
          fontFamily: '"Lato", "Open Sans", "Inter", "Source Sans Pro", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Lato", "Open Sans", sans-serif',
      fontWeight: 700,
      color: '#1a237e',
    },
    h2: {
      fontFamily: '"Lato", "Open Sans", sans-serif',
      fontWeight: 600,
      color: '#1a237e',
    },
    h3: {
      fontFamily: '"Lato", "Open Sans", sans-serif',
      fontWeight: 600,
      color: '#1a237e',
    },
    h4: {
      fontFamily: '"Lato", "Open Sans", sans-serif',
      fontWeight: 500,
      color: '#1a237e',
    },
    h5: {
      fontFamily: '"Lato", "Open Sans", sans-serif',
      fontWeight: 500,
      color: '#1a237e',
    },
    h6: {
      fontFamily: '"Lato", "Open Sans", sans-serif',
      fontWeight: 500,
      color: '#1a237e',
    },
    body1: {
      fontFamily: '"Lato", "Open Sans", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Lato", "Open Sans", sans-serif',
      fontWeight: 400,
    },
  },
});

// Navigation component
const NavigationWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentPage = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Home';
      case '/gallery':
        return 'Gallery';
      case '/history':
        return 'History';
      case '/news':
        return 'News';
      case '/school-board':
        return 'School Board';
      case '/staff':
        return 'Staff';
      case '/info':
        return 'Info';
      case '/forms':
        return 'Forms & Fees';
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
      case '/admin/staff-upload':
        return 'Staff Upload';
      case '/admin/document-upload':
        return 'Document Upload';
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
      case '/aftercare':
        return 'Aftercare Programme';
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

  return (
    <Layout currentPage={getCurrentPage()} onNavigate={handleNavigation}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/history" element={<History />} />
        <Route path="/news" element={<News />} />
        <Route path="/spiritual" element={<Spiritual />} />
        <Route path="/info" element={<Info />} />
        <Route path="/events" element={<Events />} />
        <Route path="/school-board" element={<SchoolBoard />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/links" element={<Links />} />
        <Route path="/forms" element={<FormsFees />} />
        <Route path="/extra-mural" element={<ExtraMural />} />
        <Route path="/music" element={<Music />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/applications" element={<AdminApplicationManagement />} />
        <Route path="/admin/staff-upload" element={<AdminStaffUploadPage />} />
        <Route path="/admin/document-upload" element={<AdminDocumentUpload />} />
        <Route path="/admin/school-stats" element={<SchoolStatsManagement />} />
                <Route path="/admin/calendar" element={<CalendarManagement />} />
                <Route path="/admin/gallery" element={<GalleryManagement />} />
                <Route path="/admin/newsletters" element={<NewsletterManagement />} />
        <Route path="/documents" element={<SchoolDocuments />} />
        <Route path="/logo-symbolism" element={<LogoSymbolismPage />} />
        <Route path="/mission-vision" element={<MissionVision />} />
        <Route path="/family-statement" element={<FamilyStatementPage />} />
        {/* 
        <Route path="/academics" element={<Academics />} /> // File doesn't exist
        <Route path="/robotics" element={<Robotics />} /> // File doesn't exist
        <Route path="/ict-hub" element={<ICTHub />} /> // File doesn't exist
        */}
        <Route path="/calendar" element={<Calendar />} />
        {/* Pillars Section */}
        <Route path="/academic" element={<Academic />} />
        <Route path="/robotics" element={<Robotics />} />
        <Route path="/sport" element={<Sport />} />
        <Route path="/cultural" element={<Cultural />} />
        <Route path="/service-ethos" element={<ServiceEthos />} />
        {/* Our School Section */}
        <Route path="/aftercare" element={<Aftercare />} />
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
