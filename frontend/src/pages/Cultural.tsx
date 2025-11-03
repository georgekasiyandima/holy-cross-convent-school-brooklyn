import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip, Button, Stack, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Palette, MusicNote, TheaterComedy, LocalFlorist, EmojiEvents, Groups, SentimentVerySatisfied, MonitorHeart } from '@mui/icons-material';
import SEO from '../components/SEO';

const Hero = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '600px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'url("/MUSIC.jpg") center/cover no-repeat',
  textAlign: 'center',
  '& > *': { position: 'relative', zIndex: 1 }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderTop: '4px solid #9c27b0',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(156,39,176,0.2)'
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
  background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
  color: '#fff',
  boxShadow: '0 8px 24px rgba(156,39,176,0.3)'
}));

const Cultural: React.FC = () => {
  const activities = [
    { name: 'Art Club', icon: <Palette sx={{ fontSize: 40 }} /> },
    { name: 'Choir', icon: <MusicNote sx={{ fontSize: 40 }} /> },
    { name: 'Percussion', icon: <MonitorHeart sx={{ fontSize: 40 }} /> },
    { name: 'Liturgical Dance', icon: <Groups sx={{ fontSize: 40 }} /> },
    { name: 'Drama', icon: <TheaterComedy sx={{ fontSize: 40 }} /> },
    { name: 'Chess', icon: <EmojiEvents sx={{ fontSize: 40 }} /> },
    { name: 'Garden Club', icon: <LocalFlorist sx={{ fontSize: 40 }} /> },
  ];

  return (
    <>
      <SEO 
        title="Arts & Culture - Holy Cross Convent School" 
        description="We celebrate the joy of creativity and self-expression through Arts & Culture programs including art club, choir, percussion ensemble, liturgical dance, drama, chess, and garden club." 
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
            Arts & Culture
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
            Celebrating Creativity and Self-Expression
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
            At Holy Cross Convent School, we celebrate the joy of creativity and self-expression. 
            Our programs provide learners with opportunities to explore their talents and develop confidence 
            within a supportive, faith-filled environment.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
          >
            <Chip 
              label="Faith-Filled Environment" 
              sx={{ 
                backgroundColor: '#9c27b0', 
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                px: 2,
                py: 3,
                mb: 2
              }} 
            />
            <Chip 
              label="Rich Cultural Heritage" 
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
            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
            p: 6,
            borderRadius: 4,
            border: '3px solid #9c27b0',
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
            Nurturing Artistic Excellence
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
            Our Arts & Culture programs provide learners with opportunities to explore their talents, 
            discover new passions, and develop confidence — all within a supportive, faith-filled environment.
          </Typography>

          <Divider sx={{ my: 4, borderWidth: 2, borderColor: '#9c27b0' }} />

          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: '1.1rem'
            }}
          >
            Whether performing at choir festivals and embassy events, showcasing talent in art exhibitions, 
            competing in chess tournaments, or growing their own produce, our learners engage with the arts 
            in ways that nurture both mind and spirit.
          </Typography>
        </Paper>
      </Container>

      {/* Activities List */}
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
            Our Cultural Activities
          </Typography>

          <Grid container spacing={3}>
            {activities.map((activity, index) => (
              <Grid item xs={6} md={4} key={index}>
                <FeatureCard>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <IconBox>
                      {activity.icon}
                    </IconBox>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                      {activity.name}
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
          Arts & Culture in Action
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/ac003.jpg"
              alt="Cultural Activity"
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
              src="/cultra001.jpg"
              alt="Cultural Activity"
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
              src="/AC3.jpg"
              alt="Cultural Activity"
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
              src="/cultra002.jpg"
              alt="Cultural Activity"
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
              src="/cultra004.jpg"
              alt="Cultural Activity"
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

      {/* Values Section */}
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
            Our Core Values
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <SentimentVerySatisfied sx={{ fontSize: 60, color: '#9c27b0', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                  Self-Expression
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Allowing each child to shine in their own unique way through creative expression.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Groups sx={{ fontSize: 60, color: '#9c27b0', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                  Teamwork
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Building collaboration and mutual support through group activities and performances.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <EmojiEvents sx={{ fontSize: 60, color: '#9c27b0', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                  Cultural Heritage
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Fostering appreciation for our rich cultural heritage and diverse traditions.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #9c27b0 100%)', py: 8, color: 'white' }}>
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
            Ready to Discover Your Talents?
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 5,
              opacity: 0.95,
              lineHeight: 1.8
            }}
          >
            Join us at Holy Cross Convent School and explore the joy of creativity, self-expression, 
            and artistic growth in our diverse cultural programs.
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

export default Cultural;
