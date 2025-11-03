import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip, Button, Stack, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SportsSoccer, Groups, EmojiEvents, DirectionsRun, SentimentVerySatisfied, LocalPlay } from '@mui/icons-material';
import SEO from '../components/SEO';

const Hero = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '600px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'url("/sports9.jpg") center/cover no-repeat',
  textAlign: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backdropFilter: 'blur(8px)',
    zIndex: 0
  },
  '& > *': { position: 'relative', zIndex: 1 }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderTop: '4px solid #4caf50',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(26,35,126,0.2)'
  }
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
  color: '#fff',
  boxShadow: '0 8px 24px rgba(76,175,80,0.3)'
}));

const Sport: React.FC = () => {
  const sports = [
    { name: 'Soccer', icon: <SportsSoccer sx={{ fontSize: 40 }} /> },
    { name: 'Netball', icon: <Groups sx={{ fontSize: 40 }} /> },
    { name: 'Tennis', icon: <LocalPlay sx={{ fontSize: 40 }} /> },
    { name: 'Mini-Tennis', icon: <LocalPlay sx={{ fontSize: 40 }} /> },
    { name: 'Ball Skills', icon: <SportsSoccer sx={{ fontSize: 40 }} /> },
    { name: 'Karate', icon: <DirectionsRun sx={{ fontSize: 40 }} /> },
    { name: 'Athletics', icon: <EmojiEvents sx={{ fontSize: 40 }} /> },
    { name: 'Dance', icon: <SentimentVerySatisfied sx={{ fontSize: 40 }} /> },
  ];

  return (
    <>
      <SEO 
        title="Sport - Holy Cross Convent School" 
        description="Our learners discover their strengths through a wide range of sporting activities including soccer, netball, tennis, mini-tennis, ball skills, karate, athletics, and dance." 
      />
      
      {/* Hero Section */}
      <Hero>
        <Container maxWidth="lg">
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 3,
              color: '#ffffff',
              textShadow: '4px 4px 8px rgba(0,0,0,0.9)'
            }}
          >
            Sport
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              maxWidth: '900px',
              mx: 'auto',
              mb: 4,
              fontWeight: 700,
              color: '#ffffff',
              textShadow: '3px 3px 6px rgba(0,0,0,0.9)',
              px: 2,
              lineHeight: 1.4
            }}
          >
            Building Character Through Sport and Teamwork
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              mb: 4,
              color: '#ffffff',
              fontWeight: 600,
              lineHeight: 1.8,
              textShadow: '2px 2px 4px rgba(0,0,0,0.9)'
            }}
          >
            Our learners are encouraged to discover their strengths through a wide range of sporting activities. 
            Every afternoon from 14:30 to 15:15, there's something active and exciting happening.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
          >
            <Chip 
              label="Daily Activities" 
              sx={{ 
                backgroundColor: '#4caf50', 
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                px: 2,
                py: 3,
                mb: 2
              }} 
            />
            <Chip 
              label="14:30 - 15:15" 
              sx={{ 
                backgroundColor: '#ffd700', 
                color: '#1a237e',
                fontWeight: 700,
                fontSize: '1rem',
                px: 2,
                py: 3,
                mb: 2
              }} 
            />
          </Stack>
        </Container>
      </Hero>

      {/* Mission Statement */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper 
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
            p: 6,
            borderRadius: 4,
            border: '3px solid #4caf50',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              mb: 3,
              color: '#1a237e'
            }}
          >
            Discovering Strengths Through Sport
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              maxWidth: '900px',
              mx: 'auto',
              mb: 4,
              lineHeight: 1.8,
              color: '#424242'
            }}
          >
            Our learners are encouraged to discover their strengths through a wide range of sporting activities, 
            including soccer, netball, tennis, mini-tennis, ball skills, karate, athletics, and dance. Every afternoon 
            from 14:30 to 15:15, there's something active and exciting happening — ensuring that sport and movement 
            are a joyful part of daily life.
          </Typography>

          <Divider sx={{ my: 4, borderWidth: 2, borderColor: '#4caf50' }} />

          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: '1.1rem'
            }}
          >
            Whether playing fixtures with neighbouring schools or joining local clubs, our learners live out the values 
            of commitment, courage, and community.
          </Typography>
        </Paper>
      </Container>

      {/* Sports List */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 800,
              mb: 6,
              color: '#1a237e'
            }}
          >
            Our Sporting Activities
          </Typography>

          <Grid container spacing={3}>
            {sports.map((sport, index) => (
              <Grid item xs={6} md={3} key={index}>
                <FeatureCard>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <IconBox>
                      {sport.icon}
                    </IconBox>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                      {sport.name}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Gallery Section - Images Only */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            textAlign: 'center',
            fontWeight: 800,
            mb: 6,
            color: '#1a237e'
          }}
        >
          Sport in Action
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/sports1.jpg"
              alt="Sports Activity"
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/sports2.jpg"
              alt="Sports Activity"
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src="/sports3.jpg"
              alt="Sports Activity"
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src="/sports6.jpg"
              alt="Sports Activity"
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src="/sports8.jpg"
              alt="Sports Activity"
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #4caf50 100%)', py: 8, color: 'white' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              mb: 3,
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Ready to Get Active?
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 5,
              opacity: 0.95,
              lineHeight: 1.8
            }}
          >
            Join us at Holy Cross Convent School and discover the joy of sport, movement, 
            and teamwork in our daily afternoon activities.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              href="/admissions"
              sx={{
                backgroundColor: '#ffd700',
                color: '#1a237e',
                fontWeight: 700,
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                borderRadius: 3,
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                '&:hover': {
                  backgroundColor: '#ffed4e',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 35px rgba(255, 215, 0, 0.5)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Start Application
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              href="/contact"
              sx={{
                color: 'white',
                borderColor: 'white',
                borderWidth: 2,
                fontWeight: 700,
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                borderRadius: 3,
                '&:hover': {
                  borderColor: '#ffd700',
                  color: '#ffd700',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-3px)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Contact Us
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Sport;
