import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import PerformanceMonitor from './components/PerformanceMonitor';
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
import AdminStaffUpload from './pages/AdminStaffUpload';
import AdminDocumentUpload from './pages/AdminDocumentUpload';
import SchoolDocuments from './pages/SchoolDocuments';
import LogoSymbolismPage from './pages/LogoSymbolism';
import MissionVision from './pages/MissionVision';
import FamilyStatementPage from './pages/FamilyStatement';
import Academics from './pages/Academics';
import Robotics from './pages/Robotics';
import ICTHub from './pages/ICTHub';

// Create a theme with school colors (navy blue and gold)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Deep navy blue
    },
    secondary: {
      main: '#ffd700', // Gold
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
      color: '#1a237e',
    },
    h4: {
      fontWeight: 500,
      color: '#1a237e',
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
        <Route path="/admin/staff-upload" element={<AdminStaffUpload />} />
        <Route path="/admin/document-upload" element={<AdminDocumentUpload />} />
        <Route path="/documents" element={<SchoolDocuments />} />
        <Route path="/logo-symbolism" element={<LogoSymbolismPage />} />
        <Route path="/mission-vision" element={<MissionVision />} />
        <Route path="/family-statement" element={<FamilyStatementPage />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/robotics" element={<Robotics />} />
        <Route path="/ict-hub" element={<ICTHub />} />
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
        <PerformanceMonitor />
        <Analytics />
        <Router>
          <NavigationWrapper />
        </Router>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
