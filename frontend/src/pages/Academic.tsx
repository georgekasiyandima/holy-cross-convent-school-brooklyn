import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip, Button, Stack, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { School, MenuBook, Groups, Lightbulb, Favorite, CheckCircle } from '@mui/icons-material';
import SEO from '../components/SEO';
import ReturnToHome from '../components/ReturnToHome';

const Hero = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '600px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'url("/acad1.jpg") center/cover no-repeat',
  textAlign: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,35,126,.80), rgba(211,47,47,.60))',
    zIndex: 0
  },
  '& > *': { position: 'relative', zIndex: 1 }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderTop: '4px solid #d32f2f',
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
  background: 'linear-gradient(135deg, #1a237e 0%, #d32f2f 100%)',
  color: '#fff',
  boxShadow: '0 8px 24px rgba(26,35,126,0.3)'
}));

const Academic: React.FC = () => {
  return (
    <>
      <SEO 
        title="Academic Excellence - Holy Cross Convent School" 
        description="At Holy Cross Convent School, every child is seen, supported, and encouraged to reach their full God-given potential — academically, spiritually, and personally." 
      />
      
      {/* Hero Section */}
      <Hero>
        {/* Return to Home - positioned to avoid header clash */}
        <Box sx={{
          position: 'fixed',
          top: { xs: 80, sm: 100 },
          left: 16,
          zIndex: 1000,
          '& .MuiTypography-root': {
            color: 'white !important',
            textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(26, 35, 126, 0.7)',
            padding: '8px 16px',
            borderRadius: '8px',
            display: 'inline-block',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              transform: 'translateX(-2px)',
              backgroundColor: 'rgba(26, 35, 126, 0.9)',
            },
            transition: 'all 0.3s ease'
          }
        }}>
          <ReturnToHome />
        </Box>

        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
          <Chip 
            label="Academic Pillar" 
            sx={{ 
              backgroundColor: '#ffd700', 
              color: '#1a237e',
              fontWeight: 700,
              fontSize: '1rem',
              px: 2,
              py: 3,
              mb: 4
            }} 
          />
          
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 3,
              color: '#ffd700',
              textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9)'
            }}
          >
            Academic
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              maxWidth: '900px',
              mx: 'auto',
              mb: 4,
              fontWeight: 700,
              color: '#ffffff',
              textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8)',
              px: 2,
              lineHeight: 1.4
            }}
          >
            At Holy Cross Convent School, every child is seen, supported, and encouraged to reach their full God-given potential — academically, spiritually, and personally.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              href="/admissions"
              sx={{
                backgroundColor: '#ffd700',
                color: '#1a237e',
                fontWeight: 700,
                px: 4,
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                '&:hover': {
                  backgroundColor: '#ffed4e',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 35px rgba(255, 215, 0, 0.5)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Join Our School
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
                px: 4,
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: '#ffd700',
                  color: '#ffd700',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-3px)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Schedule a Visit
            </Button>
          </Stack>
        </Container>
      </Hero>

      {/* Mission Statement - Following Robotics Pattern */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper 
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #e3f2fd 0%, #ffebee 100%)',
            p: 6,
            borderRadius: 4,
            border: '3px solid #d32f2f',
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
            Where Every Child Can Shine
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
            With one class per grade, our learners benefit from focused attention and a strong sense of belonging. Our CAPS-aligned curriculum combines Catholic values with innovative teaching to prepare learners for success in a modern world.
          </Typography>

          <Divider sx={{ my: 4, borderWidth: 2, borderColor: '#d32f2f' }} />

          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: '1.1rem',
              mb: 3
            }}
          >
            From Foundation Phase (Grade R–3) to Intermediate and Senior Phase (Grade 4–7), we nurture curiosity, confidence, and compassion. Dedicated learner support is offered across the school, ensuring that every child is guided to grow and thrive.
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#1a237e'
            }}
          >
            At Holy Cross Convent School, we believe that every child can shine when faith and learning come together.
          </Typography>
        </Paper>
      </Container>

      {/* Features Section */}
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
            Our Academic Phases
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <IconBox>
                    <MenuBook sx={{ fontSize: 40 }} />
                  </IconBox>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                    Foundation Phase (R–3)
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Strong foundations in literacy, numeracy and faith-filled learning experiences.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <IconBox>
                    <Lightbulb sx={{ fontSize: 40 }} />
                  </IconBox>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                    Intermediate Phase (4–6)
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Expanding knowledge with inquiry, projects and collaboration.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <IconBox>
                    <School sx={{ fontSize: 40 }} />
                  </IconBox>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                    Senior Phase (7)
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Leadership, responsibility and readiness for high school pathways.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <IconBox>
                    <Groups sx={{ fontSize: 40 }} />
                  </IconBox>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                    Small Classes
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    One class per grade ensures focused attention and a strong sense of belonging.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <IconBox>
                    <Favorite sx={{ fontSize: 40 }} />
                  </IconBox>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                    Dedicated Support
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Learner support is offered across the school, ensuring every child is guided to grow and thrive.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
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
          Learning in Action
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/acad2.jpg"
              alt="Academic learning"
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                display: 'block',
                mx: 'auto'
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/academics1.jpg"
              alt="Academic support"
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                display: 'block',
                mx: 'auto'
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src="/acad1.jpg"
              alt="Academic excellence"
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                display: 'block',
                mx: 'auto'
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src="/acadms2.jpg"
              alt="Academic activities"
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                display: 'block',
                mx: 'auto'
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src="/acads1.jpg"
              alt="Academic excellence"
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                display: 'block',
                mx: 'auto'
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #d32f2f 100%)', py: 8, color: 'white' }}>
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
            Ready to Begin Your Academic Journey?
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 5,
              opacity: 0.95,
              lineHeight: 1.8
            }}
          >
            Join us at Holy Cross Convent School and experience academic excellence where every child is seen, 
            supported, and encouraged to reach their full God-given potential.
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

export default Academic;
