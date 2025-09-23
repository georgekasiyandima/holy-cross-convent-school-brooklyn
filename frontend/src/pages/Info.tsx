import React from 'react';
import { Container, Typography, Box, Divider, Card, CardContent, Grid, Button, Paper, Avatar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const quickFacts = [
  { icon: <AccessTimeIcon color="primary" />, label: 'School Hours', value: '07:45 – 14:30 (Mon–Fri)' },
  { icon: <SchoolIcon color="primary" />, label: 'Grades', value: 'Grade 0 – Grade 7' },
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
    {/* Hero Section */}
    <Paper elevation={3} sx={{ p: 4, mb: 5, textAlign: 'center', background: '#e3eafc' }}>
      <Avatar
        src="/HCLOGO1.png"
        alt="School Logo"
        sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
      />
      <Typography variant="h3" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
        Holy Cross Convent Primary School
      </Typography>
      <Typography variant="h6" sx={{ color: '#3949ab', mb: 2 }}>
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
      <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
        "At Holy Cross Convent, we nurture each child’s unique gifts in a caring, faith-filled environment. We invite you to discover what makes our school special."
      </Typography>
      <Typography variant="subtitle2" sx={{ color: '#3949ab' }}>
        – Mrs Du Plessis, Principal
      </Typography>
    </Box>

    {/* Quick Facts */}
    <Grid container spacing={2} sx={{ mb: 5 }}>
      {quickFacts.map((fact) => (
        <Grid
          component="div"
          item
          xs={12}
          sm={6}
          md={4}
          key={fact.label}
          {...({ item: true } as any)}
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
        </Grid>
      ))}
    </Grid>

    {/* Mission & Values */}
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 1 }}>
        Our Mission & Values
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body1" sx={{ mb: 2 }}>
        Our mission is to provide a holistic education rooted in Catholic values, fostering academic excellence, spiritual growth, and compassionate service.
      </Typography>
      <Grid container spacing={2}>
        {values.map((val) => (
          <Grid
            component="div"
            item
            xs={6}
            sm={4}
            key={val}
            {...({ item: true } as any)}
          >
            <Card sx={{ p: 2, textAlign: 'center', background: '#f5f7fa' }}>
              <EmojiObjectsIcon color="primary" sx={{ mb: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{val}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>

    {/* Gallery */}
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
        School Gallery
      </Typography>
      <Grid container spacing={2}>
        {['BOOKDAY.jpg', 'Sports01.jpg', 'Garden Club 04.jpg', 'COMPUTERLAB02.jpg'].map((img, idx) => (
          <Grid
            component="div"
            item
            xs={6}
            sm={3}
            key={img}
            {...({ item: true } as any)}
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
          </Grid>
        ))}
      </Grid>
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
        Admission & Policy Documents
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Download our latest admission forms and school policies below.
      </Typography>
      <Button variant="contained" color="primary" disabled>
        Download Policy Document
      </Button>
    </Box>
  </Container>
);

export default Info;