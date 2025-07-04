import React from 'react';
import { Box, Container, Typography, Paper, Divider, IconButton, Link } from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn, 
  Email, 
  Phone, 
  LocationOn,
  School,
  Verified
} from '@mui/icons-material';
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
          background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
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
                  (021) 511 4337
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ color: '#ffd700', mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  info@holycrossbrooklyn.edu
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
                  Primary School (Grade 0 - Grade 7)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Verified sx={{ color: '#ffd700', mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  Umalusi Accredited
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                PBO Number: 930011798
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                EMIS Number: 0103000810
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                School Reg No. 13/3/1/51
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
                >
                  <Twitter />
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
                >
                  <LinkedIn />
                </IconButton>
              </Box>

              <Typography variant="body2" sx={{ opacity: 0.8, fontStyle: 'italic' }}>
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
              © 2024 Holy Cross Convent School Brooklyn. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link href="#" sx={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', '&:hover': { color: '#ffd700' } }}>
                Privacy Policy
              </Link>
              <Link href="#" sx={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', '&:hover': { color: '#ffd700' } }}>
                Terms of Use
              </Link>
              <Link href="#" sx={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', '&:hover': { color: '#ffd700' } }}>
                Sitemap
              </Link>
            </Box>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Layout; 