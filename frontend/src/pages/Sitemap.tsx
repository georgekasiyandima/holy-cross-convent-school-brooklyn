import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Link,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Home,
  PhotoLibrary,
  History,
  Newspaper,
  School,
  Info,
  Event,
  People,
  Link as LinkIcon,
  Description,
  SportsEsports,
  MusicNote,
  ContactSupport,
  Map as SitemapIcon
} from '@mui/icons-material';
import ReturnToHome from '../components/ReturnToHome';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const Sitemap: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#1a237e';
      case 'Medium':
        return '#ffd700';
      case 'Low':
        return '#666';
      default:
        return '#666';
    }
  };

  const sections = [
    {
      title: 'Main Pages',
      pages: [
        {
          name: 'Home',
          path: '/',
          description: 'Welcome to Holy Cross Convent School - Excellence in Catholic Education',
          priority: 'High'
        },
        {
          name: 'Contact Us',
          path: '/contact',
          description: 'Get in touch with our school administration and staff',
          priority: 'High'
        }
      ]
    },
    {
      title: 'School Information',
      pages: [
        {
          name: 'School Information',
          path: '/info',
          description: 'Important information about our school policies, procedures, and general information',
          priority: 'High'
        },
        {
          name: 'School History',
          path: '/history',
          description: 'Learn about our rich history and tradition of excellence since 1960',
          priority: 'Medium'
        },
        {
          name: 'School Board',
          path: '/school-board',
          description: 'Meet our dedicated school board members and leadership team',
          priority: 'Medium'
        },
        {
          name: 'Staff Directory',
          path: '/staff',
          description: 'Meet our dedicated teaching and support staff',
          priority: 'High'
        }
      ]
    },
    {
      title: 'Academic & Activities',
      pages: [
        {
          name: 'Forms & Fees',
          path: '/forms',
          description: 'Download important school documents, forms, and fee information',
          priority: 'High'
        },
        {
          name: 'Extra Mural Activities',
          path: '/extra-mural',
          description: 'Explore our diverse range of extracurricular activities and sports',
          priority: 'Medium'
        },
        {
          name: 'Music Program',
          path: '/music',
          description: 'Discover our comprehensive music education program',
          priority: 'Medium'
        }
      ]
    },
    {
      title: 'Community & Events',
      pages: [
        {
          name: 'Photo Gallery',
          path: '/photos',
          description: 'Browse through our collection of school events, activities, and memories',
          priority: 'Medium'
        },
        {
          name: 'News & Updates',
          path: '/news',
          description: 'Stay updated with the latest news, announcements, and school events',
          priority: 'High'
        },
        {
          name: 'Events',
          path: '/events',
          description: 'View upcoming school events, calendar, and important dates',
          priority: 'Medium'
        },
        {
          name: 'Spiritual Life',
          path: '/spiritual',
          description: 'Explore our Catholic faith formation and spiritual development programs',
          priority: 'Medium'
        }
      ]
    },
    {
      title: 'Resources',
      pages: [
        {
          name: 'Useful Links',
          path: '/links',
          description: 'Access helpful educational resources and external links',
          priority: 'Low'
        }
      ]
    }
  ];

  const getIconForPage = (pageName: string) => {
    switch (pageName) {
      case 'Home':
        return <Home sx={{ color: '#1a237e' }} />;
      case 'Contact Us':
        return <ContactSupport sx={{ color: '#1a237e' }} />;
      case 'School Information':
        return <Info sx={{ color: '#1a237e' }} />;
      case 'School History':
        return <History sx={{ color: '#1a237e' }} />;
      case 'School Board':
        return <People sx={{ color: '#1a237e' }} />;
      case 'Staff Directory':
        return <School sx={{ color: '#1a237e' }} />;
      case 'Forms & Fees':
        return <Description sx={{ color: '#1a237e' }} />;
      case 'Extra Mural Activities':
        return <SportsEsports sx={{ color: '#1a237e' }} />;
      case 'Music Program':
        return <MusicNote sx={{ color: '#1a237e' }} />;
      case 'Photo Gallery':
        return <PhotoLibrary sx={{ color: '#1a237e' }} />;
      case 'News & Updates':
        return <Newspaper sx={{ color: '#1a237e' }} />;
      case 'Events':
        return <Event sx={{ color: '#1a237e' }} />;
      case 'Spiritual Life':
        return <School sx={{ color: '#1a237e' }} />;
      case 'Useful Links':
        return <LinkIcon sx={{ color: '#1a237e' }} />;
      default:
        return <Info sx={{ color: '#1a237e' }} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Return to Home */}
      <ReturnToHome />
      
      <SEO
        title="Sitemap - Holy Cross Convent School Brooklyn"
        description="Complete sitemap of Holy Cross Convent School Brooklyn website. Find all pages and sections easily."
        keywords="sitemap, Holy Cross Convent School, Brooklyn, Cape Town, school website navigation"
      />
      
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <SitemapIcon sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
        <Typography variant="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 2 }}>
          Site Map
        </Typography>
        <Divider sx={{ bgcolor: '#ffd700', height: 4, width: 80, mx: 'auto', mb: 3 }} />
        <Typography variant="h6" sx={{ color: '#555', maxWidth: 800, mx: 'auto' }}>
          Navigate through all sections of our school website. Find the information you need quickly and easily.
        </Typography>
      </Box>

      {/* Site Structure */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 4 
      }}>
        {sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #fffde7 0%, #e3eafc 100%)',
            border: '2px solid transparent',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(26, 35, 126, 0.15)',
              borderColor: '#ffd700'
            }
          }}>
            <CardContent>
              <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 3, textAlign: 'center' }}>
                {section.title}
              </Typography>
              
              <List>
                {section.pages.map((page, pageIndex) => (
                  <ListItem 
                    key={pageIndex}
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: 2,
                      mb: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(26, 35, 126, 0.05)',
                        transform: 'translateX(8px)'
                      }
                    }}
                    onClick={() => handleNavigation(page.path)}
                  >
                    <ListItemIcon>
                      {getIconForPage(page.name)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
                            {page.name}
                          </Typography>
                          <Chip 
                            label={page.priority} 
                            size="small"
                            sx={{ 
                              backgroundColor: getPriorityColor(page.priority),
                              color: page.priority === 'Medium' ? '#1a237e' : 'white',
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                          {page.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Quick Navigation */}
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 3 }}>
          Quick Navigation
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
          {(() => {
            const allPages: any[] = [];
            sections.forEach((section, sectionIndex) => {
              section.pages.forEach((page, pageIndex) => {
                allPages.push({
                  ...page,
                  key: `${sectionIndex}-${pageIndex}`
                });
              });
            });
            return allPages.map((page) => (
              <Chip
                key={page.key}
                label={page.name}
                onClick={() => handleNavigation(page.path)}
                sx={{
                  backgroundColor: '#1a237e',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#ffd700',
                    color: '#1a237e',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.3s ease'
                }}
              />
            ));
          })()}
        </Box>
      </Box>

      {/* Footer Note */}
      <Box sx={{ textAlign: 'center', mt: 6, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          <strong>Need help finding something?</strong> Contact our school office at{' '}
          <Link href="tel:+27215114337" sx={{ color: '#1a237e', textDecoration: 'none' }}>
            +27 21 511 4337
          </Link>
          {' '}or email us at{' '}
          <Link href="mailto:admin@holycrossbrooklyn.co.za" sx={{ color: '#1a237e', textDecoration: 'none' }}>
            admin@holycrossbrooklyn.co.za
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Sitemap;
