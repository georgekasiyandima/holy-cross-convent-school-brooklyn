import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { School, Visibility, Flag } from '@mui/icons-material';
import MissionStatement from '../components/MissionStatement';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';

const MissionVision: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <SEO
        title="Mission & Vision - Holy Cross Convent School Brooklyn"
        description="Discover the mission and vision of Holy Cross Convent School Brooklyn, guiding our educational excellence and values."
        keywords="mission, vision, Holy Cross Convent School, Brooklyn, Cape Town, education, values"
      />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Return to Home */}
        <ReturnToHome />

        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant={isMobile ? 'h3' : 'h2'} 
            component="h1" 
            gutterBottom 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700,
              mb: 2
            }}
          >
            Our Mission & Vision
          </Typography>
          <Box sx={{ 
            width: 80, 
            height: 4, 
            background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
            mx: 'auto',
            mb: 3,
            borderRadius: 2
          }} />
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: '800px', mx: 'auto' }}
          >
            Guiding principles that shape our educational excellence and community values
          </Typography>
        </Box>

        {/* Mission Statement */}
        <Box sx={{ mb: 6 }}>
          <MissionStatement />
        </Box>

        {/* Vision Statement */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            borderRadius: 3,
            border: '2px solid #d32f2f',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
              borderRadius: '12px 12px 0 0',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Visibility 
              sx={{ 
                fontSize: '2.5rem', 
                color: '#d32f2f', 
                mr: 2 
              }} 
            />
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                color: '#1a237e', 
                fontWeight: 700 
              }}
            >
              Our Vision
            </Typography>
          </Box>
          
          <Typography 
            variant="h6" 
            paragraph 
            sx={{ 
              color: '#333',
              lineHeight: 1.8,
              fontSize: '1.1rem'
            }}
          >
            To be a leading Catholic educational institution that nurtures holistic development, 
            academic excellence, and spiritual growth, preparing students to become compassionate, 
            responsible, and innovative leaders who contribute positively to society.
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              color: '#555',
              fontStyle: 'italic',
              textAlign: 'center',
              mt: 3,
              fontSize: '1rem'
            }}
          >
            "In cruce salus" - In the cross is salvation
          </Typography>
        </Paper>

        {/* Core Values */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Flag 
              sx={{ 
                fontSize: '2.5rem', 
                color: '#f57c00', 
                mr: 2 
              }} 
            />
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                color: '#1a237e', 
                fontWeight: 700 
              }}
            >
              Our Core Values
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <Card sx={{ height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
                    Faith & Spirituality
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Grounded in Catholic values and teachings, fostering spiritual growth and moral development.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <Card sx={{ height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
                    Academic Excellence
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Commitment to high-quality education that challenges and inspires students to achieve their potential.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <Card sx={{ height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
                    Community & Service
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Building strong relationships and encouraging service to others, locally and globally.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <Card sx={{ height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
                    Respect & Integrity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fostering an environment of mutual respect, honesty, and ethical behavior.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default MissionVision;















