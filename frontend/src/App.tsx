import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
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
import FacebookDemo from './pages/FacebookDemo';

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
      case '/photos':
        return 'Photos';
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
        return 'Forms';
      case '/links':
        return 'Links';
      case '/music':
        return 'Music';
      case '/extra-mural':
        return 'Extra Mural';
      case '/spiritual':
        return 'Spiritual';
      case '/facebook-demo':
        return 'Facebook Demo';
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
        <Route path="/photos" element={<Gallery />} />
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
        <Route path="/facebook-demo" element={<FacebookDemo />} />
        {/* Add more routes as we create more pages */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavigationWrapper />
      </Router>
    </ThemeProvider>
  );
}

export default App;
