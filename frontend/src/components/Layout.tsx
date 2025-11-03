import React from 'react';
import { Box, Container, Typography, Paper, Divider, IconButton, Link } from '@mui/material';
import { 
  Facebook, 
  Instagram,
  YouTube,
  MusicNote,
  Email, 
  Phone, 
  LocationOn,
  School,
  Verified
} from '@mui/icons-material';
import Header from './Header';
import BackToTop from './BackToTop';
import FloatingSocialIcons from './FloatingSocialIcons';

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
      
      {/* Enhanced Footer */}
      <Paper sx={{ 
        backgroundColor: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
        color: 'white', 
        py: 6, 
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #ffd700 0%, #d32f2f 25%, #ffd700 50%, #d32f2f 75%, #ffd700 100%)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #d32f2f 50%, transparent 100%)',
        }
      }}>
        <Container maxWidth="lg">
          {/* Main Footer Content */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, 
            gap: 4,
            mb: 4
          }}>
            {/* Contact Information */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffd700', fontWeight: 700, mb: 3 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <LocationOn sx={{ color: '#ffd700', mr: 1, mt: 0.5, fontSize: 20 }} />
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  162 Koeberg Road<br />
                  Brooklyn, Cape Town<br />
                  7405 South Africa
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ color: '#ffd700', mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  +27 21 511 4337
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ color: '#ffd700', mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  admin@holycrossbrooklyn.co.za
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Fax: (021) 511 9690
              </Typography>
            </Box>

            {/* Quick Links */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffd700', fontWeight: 700, mb: 3 }}>
                Quick Links
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                • Admissions
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                • School Board
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                • Events & Calendar
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                • Gallery
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                • History
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ffd700' } }}>
                • Spiritual Life
              </Typography>
            </Box>

            {/* School Information */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffd700', fontWeight: 700, mb: 3 }}>
                School Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ color: '#ffd700', mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  Primary School (Grade R - Grade 7)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Verified sx={{ color: '#ffd700', mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  Umalusi Accredited
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                NPO: 202-196
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                School Registration Number: 0103000810
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                PBO Number: 930011798
              </Typography>
            </Box>

            {/* Social Media & Newsletter */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffd700', fontWeight: 700, mb: 3 }}>
                Connect With Us
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
                Stay connected with our school community through social media and newsletters.
              </Typography>
              
              {/* Social Media Icons */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <IconButton 
                  sx={{ 
                    color: 'white', 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      backgroundColor: '#ffd700',
                      color: '#1a237e'
                    }
                  }}
                  component="a"
                  href="https://www.facebook.com/profile.php?id=61553924237049"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook />
                </IconButton>
                <IconButton 
                  sx={{ 
                    color: 'white', 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      backgroundColor: '#ffd700',
                      color: '#1a237e'
                    }
                  }}
                  component="a"
                  href="https://www.instagram.com/holycrossbrooklyn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram />
                </IconButton>
                <IconButton 
                  sx={{ 
                    color: 'white', 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      backgroundColor: '#ffd700',
                      color: '#1a237e'
                    }
                  }}
                  component="a"
                  href="https://www.youtube.com/@holycrossbrooklyn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YouTube />
                </IconButton>
                <IconButton 
                  sx={{ 
                    color: 'white', 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      backgroundColor: '#ffd700',
                      color: '#1a237e'
                    }
                  }}
                  component="a"
                  href="https://www.tiktok.com/@holy.cross.brookl?_r=1&_t=ZS-916BhJDoSUq"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MusicNote />
                </IconButton>
              </Box>

              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                "Nurturing Excellence, Building Character, Inspiring Faith"
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Divider sx={{ 
            borderColor: 'rgba(255,255,255,0.2)', 
            mb: 3,
            '&::before': {
              content: '""',
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, #ffd700 50%, transparent 100%)',
            }
          }} />

          {/* Bottom Section */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 2
          }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © 2025 Holy Cross Convent School Brooklyn. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link href="#" sx={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', '&:hover': { color: '#ffd700' } }}>
                Privacy Policy
              </Link>
              <Link href="#" sx={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', '&:hover': { color: '#ffd700' } }}>
                Terms of Use
              </Link>
              <Link href="/sitemap" sx={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', '&:hover': { color: '#ffd700' } }}>
                Sitemap
              </Link>
            </Box>
          </Box>
        </Container>
      </Paper>
      
      {/* Back to Top Button */}
      <BackToTop />
      
      {/* Floating Social Icons */}
      <FloatingSocialIcons />
    </Box>
  );
};

export default Layout; 