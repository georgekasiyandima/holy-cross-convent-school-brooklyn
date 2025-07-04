import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage = 'Home', onNavigate }) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      
      {/* Footer */}
      <Paper sx={{ backgroundColor: '#1a237e', color: 'white', py: 4, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2">
                123 School Street<br />
                Brooklyn, NY 11201<br />
                Phone: (555) 123-4567<br />
                Email: info@holycrossbrooklyn.edu
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Typography variant="body2">
                • Admissions<br />
                • Academics<br />
                • Student Life<br />
                • Alumni
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Follow Us
              </Typography>
              <Typography variant="body2">
                Stay connected with our school community through social media and newsletters.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
            <Typography variant="body2">
              © 2024 Holy Cross Convent School Brooklyn. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Layout; 