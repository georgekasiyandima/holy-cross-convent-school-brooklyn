import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Paper, styled } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';

const Banner = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '500px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'url("/xul.jpg") center/cover no-repeat',
  backgroundPosition: 'center center',
  backgroundSize: '150%',
  backgroundAttachment: 'fixed',
  textAlign: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,35,126,.70), rgba(211,47,47,.55))',
    zIndex: 0
  },
  '& > *': { position: 'relative', zIndex: 1 }
}));

const quickFacts = [
  { icon: <AccessTimeIcon color="primary" />, label: 'School Hours', value: '07:45 – 14:30 (Mon–Fri)' },
  { icon: <SchoolIcon color="primary" />, label: 'Grades', value: 'Grade R – Grade 7' },
  { icon: <EmailIcon color="primary" />, label: 'Email', value: 'info@holycrossbrooklyn.co.za' },
  { icon: <PhoneIcon color="primary" />, label: 'Phone', value: '+27 21 123 4567' },
  { icon: <LocationOnIcon color="primary" />, label: 'Address', value: '123 Brooklyn Rd, Cape Town' },
];

const galleryImages = [
  'BOOKDAY.jpg',
  'Sports01.jpg',
  'Garden Club 04.jpg',
  'COMPUTERLAB02.jpg'
];

const Info: React.FC = () => (
  <>
    <SEO 
      title="School Info - Holy Cross Convent School Brooklyn" 
      description="Learn about Holy Cross Convent School Brooklyn, our mission, vision, and community values." 
    />
    
    {/* Return to Home */}
    <Box sx={{ 
      position: 'absolute', 
      top: 16, 
      left: 16, 
      zIndex: 10,
      '& .MuiTypography-root': {
        color: 'white !important',
        textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
        display: 'inline-block',
        '&:hover': {
          transform: 'translateX(-2px)',
        }
      }
    }}>
    <ReturnToHome />
    </Box>

    {/* Banner Section */}
    <Banner>
      <Container maxWidth="lg">
        <Typography 
          variant="h1" 
          sx={{ 
            fontWeight: 900,
            fontSize: { xs: '2.5rem', md: '4rem' },
            mb: 2,
            color: '#ffd700',
            textShadow: '4px 4px 8px rgba(0,0,0,0.9)'
          }}
        >
          Holy Cross Convent School
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#ffffff',
            fontWeight: 600,
            textShadow: '3px 3px 6px rgba(0,0,0,0.9)'
          }}
        >
          Brooklyn, Cape Town
        </Typography>
      </Container>
    </Banner>

    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Mission Statement */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          borderRadius: 3,
          border: '2px solid #1a237e',
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
          <FlagIcon 
            sx={{ 
              fontSize: '2.5rem', 
              color: '#1a237e', 
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
            Our Mission
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
          To provide a holistic education rooted in Catholic values, fostering academic excellence, 
          spiritual growth, and compassionate service. We are committed to nurturing each child's unique 
          gifts in a caring, faith-filled environment that prepares them to make a positive difference in the world.
        </Typography>
      </Paper>

      {/* The Holy Cross Family Brooklyn Statement */}
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
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
          <FamilyRestroomIcon 
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
            The Holy Cross Family, Brooklyn
      </Typography>
        </Box>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#333',
            lineHeight: 1.8,
            fontSize: '1.1rem',
            whiteSpace: 'pre-line',
            mb: 2
          }}
        >
          To make a positive difference in the world.{'\n\n'}
          We strive in our daily lives and encounters to continue the work of Jesus who said, 'I have come that you may have a life and have it to the full.'{'\n\n'}
          In union with the Risen Lord, we prayerfully endeavour to interpret present realities in our world.{'\n\n'}
          This challenges us to develop and deepen our personal and corporate faith and to keep our eyes, hearts and minds open. Through interpersonal relationships in our Apostolate and the rich interactions that this affords us we find reason to:{'\n\n'}
          • Give Thanks{'\n'}
          • To hope{'\n'}
          • To be open to joy{'\n'}
          • To laugh{'\n'}
          • To sing{'\n\n'}
          And to live through love in His presence{'\n\n'}
          <Typography component="span" sx={{ fontStyle: 'italic', fontSize: '1rem' }}>
            Glory be to Him, whose Power working in us, can do infinitely more than we can ever imagine.{'\n'}
            Ephesians 3:20
      </Typography>
      </Typography>
    </Paper>

      {/* Quick Facts */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#1a237e', 
            fontWeight: 700,
            mb: 3,
            textAlign: 'center'
          }}
        >
          School Information
      </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2 
        }}>
          {quickFacts.map((fact) => (
        <Box
          key={fact.label}
          sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 12px)' } }}
        >
              <Card sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2,
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(26, 35, 126, 0.15)'
                }
              }}>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  {fact.icon}
                </Box>
            <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                {fact.label}
              </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {fact.value}
                  </Typography>
            </Box>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>

      {/* Quick Gallery */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#1a237e', 
            fontWeight: 700,
            mb: 3,
            textAlign: 'center'
          }}
        >
        School Gallery
      </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2
        }}>
          {galleryImages.map((img, idx) => (
            <Card 
            key={img}
              sx={{ 
                overflow: 'hidden',
                borderRadius: 2,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(26, 35, 126, 0.25)'
                }
              }}
            >
              <Box
                component="img"
                src={`/${img}`}
                alt={`School photo ${idx + 1}`}
                sx={{
                  width: '100%',
                  height: { xs: 200, sm: 180, md: 160 },
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Card>
        ))}
      </Box>
    </Box>

      {/* Logo Symbolism */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Paper 
          elevation={2}
          sx={{ 
            p: 4,
            background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
            borderRadius: 3,
            border: '1px solid rgba(26, 35, 126, 0.1)'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 600, 
              mb: 2 
            }}
          >
            Discover Our Heritage
      </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Learn about the rich symbolism and meaning behind our school logo, representing our values and Catholic heritage.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => window.location.href = '/logo-symbolism'}
            sx={{
              backgroundColor: '#1a237e',
              color: '#fff',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#283593',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(26, 35, 126, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
      >
        View Logo Symbolism
      </Button>
        </Paper>
    </Box>
  </Container>
  </>
);

export default Info;