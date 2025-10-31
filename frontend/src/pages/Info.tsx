import React from 'react';
import { Container, Typography, Box, Divider, Card, CardContent, Button, Paper, Avatar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import MissionStatement from '../components/MissionStatement';
import ReturnToHome from '../components/ReturnToHome';

const quickFacts = [
  { icon: <AccessTimeIcon color="primary" />, label: 'School Hours', value: '07:45 – 14:30 (Mon–Fri)' },
  { icon: <SchoolIcon color="primary" />, label: 'Grades', value: 'Grade R – Grade 7' },
  { icon: <EmailIcon color="primary" />, label: 'Email', value: 'info@holycrossbrooklyn.co.za' },
  { icon: <PhoneIcon color="primary" />, label: 'Phone', value: '+27 21 123 4567' },
  { icon: <LocationOnIcon color="primary" />, label: 'Address', value: '123 Brooklyn Rd, Cape Town' },
];

const values = [
  'Faith & Compassion',
  'Academic Excellence',
  'Community Service',
  'Respect & Integrity',
  'Creativity & Growth',
];

const Info: React.FC = () => (
  <Container maxWidth="md" sx={{ py: 6 }}>
    {/* Return to Home */}
    <ReturnToHome />
    
    {/* Hero Section */}
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        mb: 5, 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, #e3eafc 0%, #ffebee 100%)',
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
      <Avatar
        src="/HCLOGO1.png"
        alt="School Logo"
        sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
      />
      <Typography variant="h3" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
        Holy Cross Convent Primary School
      </Typography>
      <Typography variant="h6" sx={{ color: '#d32f2f', mb: 2, fontWeight: 600 }}>
        Brooklyn, Cape Town
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '1.15rem', mb: 1 }}>
        Welcome to our vibrant school community, where every child is valued and inspired to grow in faith, knowledge, and service.
      </Typography>
    </Paper>

    {/* Principal's Welcome */}
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 1 }}>
        Principal’s Welcome
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        "At Holy Cross Convent, we nurture each child’s unique gifts in a caring, faith-filled environment. We invite you to discover what makes our school special."
      </Typography>
      <Typography variant="subtitle2" sx={{ color: '#3949ab' }}>
        – Mrs Du Plessis, Principal
      </Typography>
    </Box>

    {/* Quick Facts */}
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 5 }}>
      {quickFacts.map((fact) => (
        <Box
          key={fact.label}
          sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 12px)' } }}
        >
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Box sx={{ mr: 2 }}>{fact.icon}</Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {fact.label}
              </Typography>
              <Typography variant="body2">{fact.value}</Typography>
            </Box>
          </Card>
        </Box>
      ))}
    </Box>

    {/* Mission & Values */}
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 1 }}>
        Our Mission & Values
      </Typography>
      <Box sx={{ 
        width: 60, 
        height: 3, 
        background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
        mb: 2,
        borderRadius: 2
      }} />
      <Typography variant="body1" sx={{ mb: 2 }}>
        Our mission is to provide a holistic education rooted in Catholic values, fostering academic excellence, spiritual growth, and compassionate service.
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {values.map((val) => (
          <Box
            key={val}
            sx={{ flex: { xs: '1 1 calc(50% - 8px)', sm: '1 1 calc(33.333% - 12px)' } }}
          >
            <Card sx={{ 
              p: 2, 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #f5f7fa 0%, #ffebee 100%)',
              border: '1px solid #d32f2f',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)'
              },
              transition: 'all 0.3s ease'
            }}>
              <EmojiObjectsIcon sx={{ color: '#d32f2f', mb: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#1a237e' }}>{val}</Typography>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>

    {/* Gallery */}
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
        School Gallery
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {['BOOKDAY.jpg', 'Sports01.jpg', 'Garden Club 04.jpg', 'COMPUTERLAB02.jpg'].map((img, idx) => (
          <Box
            key={img}
            sx={{ flex: { xs: '1 1 calc(50% - 8px)', sm: '1 1 calc(25% - 12px)' } }}
          >
            <Card>
              <Box
                component="img"
                src={`/${img}`}
                alt={`School photo ${idx + 1}`}
                sx={{
                  borderRadius: 2,
                  objectFit: 'cover',
                  width: '100%',
                  height: 120,
                  display: 'block',
                }}
              />
            </Card>
          </Box>
        ))}
      </Box>
    </Box>

    {/* Map & Directions */}
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
        Find Us
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        123 Brooklyn Rd, Cape Town, 7405, South Africa
      </Typography>
      <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        <iframe
          title="School Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.123456789!2d18.456789!3d-33.912345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc5d123456789%3A0xabcdef123456789!2sHoly+Cross+Convent+School!5e0!3m2!1sen!2sza!4v1234567890"
          width="100%"
          height="220"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </Box>
    </Box>

    {/* Policy Documents */}
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
        School Documents & Policies
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Access our comprehensive collection of school documents including language policy, attendance policies, and other important information.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => window.location.href = '/documents'}
        sx={{ mr: 2 }}
      >
        View All Documents
      </Button>
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => window.location.href = '/logo-symbolism'}
      >
        View Logo Symbolism
      </Button>
    </Box>

    {/* Mission Statement Section */}
    <Box sx={{ my: 6 }}>
      <MissionStatement />
    </Box>
  </Container>
);

export default Info;