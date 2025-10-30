import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip, Button, Stack, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Computer, RocketLaunch, Lightbulb, Groups, Code, School } from '@mui/icons-material';
import SEO from '../components/SEO';

const Hero = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '600px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'url("/ROBT008.jpg") center/cover no-repeat',
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

const Robotics: React.FC = () => {
  return (
    <>
      <SEO 
        title="Robotics & Computer Lab - Holy Cross Convent School" 
        description="Our dedicated Robotics and Computer Room introduces learners from Grade R onwards to hands-on, innovative technology, giving them a head start in the digital world." 
      />
      
      {/* Hero Section */}
      <Hero>
        <Container maxWidth="lg">
          <Chip 
            label="Newly Launched" 
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
              textShadow: '4px 4px 8px rgba(0,0,0,0.9)'
            }}
          >
            Robotics & Technology
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
            One of the Few Schools in the Region with a Dedicated Robotics and Computer Room
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
            At Holy Cross, learning meets innovation — where curiosity, imagination, and critical thinking are celebrated every day.
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
              Join Our Program
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

      {/* Mission Statement */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper 
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #ffebee 0%, #e3f2fd 100%)',
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
            Where Innovation Begins
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
            At Holy Cross Convent School, we are proud to be one of the few schools in the region with a 
            dedicated Robotics and Computer Room. Here, learners from Grade R onwards are introduced to 
            hands-on, innovative technology, giving them a head start in the digital world.
          </Typography>

          <Divider sx={{ my: 4, borderWidth: 2, borderColor: '#d32f2f' }} />

          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: '1.1rem'
            }}
          >
            Our program follows the CAPS-aligned curriculum and is designed to stretch thinking skills, spark creativity, 
            and develop problem-solving abilities. By combining technology with our commitment to academic excellence, 
            we prepare learners to navigate and thrive in a rapidly evolving, modern world.
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
            Building Tomorrow's Problem Solvers
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6} lg={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <IconBox>
                    <School sx={{ fontSize: 40 }} />
                  </IconBox>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                    Grade R Onwards
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Early introduction to technology ensures every child has a strong foundation in digital literacy from the very start.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <IconBox>
                    <Lightbulb sx={{ fontSize: 40 }} />
                  </IconBox>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                    Critical Thinking
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Learners develop problem-solving skills through hands-on projects that challenge them to think creatively.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <IconBox>
                    <Code sx={{ fontSize: 40 }} />
                  </IconBox>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                    CAPS-Aligned
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Our curriculum meets national standards while incorporating cutting-edge technology and innovative teaching methods.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <IconBox>
                    <RocketLaunch sx={{ fontSize: 40 }} />
                  </IconBox>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                    Innovation
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We celebrate curiosity, imagination, and the courage to experiment with new technologies and ideas.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <IconBox>
                    <Groups sx={{ fontSize: 40 }} />
                  </IconBox>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                    Collaboration
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Team projects and peer learning build essential 21st-century skills for success in the modern world.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <IconBox>
                    <Computer sx={{ fontSize: 40 }} />
                  </IconBox>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                    State-of-the-Art Lab
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Our dedicated facility provides the tools and environment needed for exceptional learning experiences.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Gallery Section */}
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
          Our Learning Environment
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ overflow: 'hidden' }}>
              <CardMedia 
                component="img" 
                image="/ROBT02.jpg" 
                alt="Computer Lab"
                sx={{ height: 400, objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Interactive Learning Spaces
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Modern workstations designed for both individual focus and collaborative projects.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ overflow: 'hidden' }}>
              <CardMedia 
                component="img" 
                image="/ROBT03.jpg" 
                alt="Students Learning"
                sx={{ height: 400, objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Hands-On Experience
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Learners actively engage with technology to solve real-world problems and express their creativity.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ overflow: 'hidden' }}>
              <CardMedia 
                component="img" 
                image="/ROBT4.jpg" 
                alt="Digital Citizenship"
                sx={{ height: 300, objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Digital Citizenship
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Teaching responsible and ethical use of technology from the start.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ overflow: 'hidden' }}>
              <CardMedia 
                component="img" 
                image="/ROBT008.jpg" 
                alt="Modern Technology"
                sx={{ height: 300, objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Modern Equipment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Latest technology to ensure learners have access to the best tools.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ overflow: 'hidden' }}>
              <CardMedia 
                component="img" 
                image="/ROBTX1.jpg" 
                alt="Dedicated Room"
                sx={{ height: 300, objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Dedicated Facility
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A purpose-built space for exploration, innovation, and discovery.
                </Typography>
              </CardContent>
            </Card>
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
            Ready to Begin the Journey?
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 5,
              opacity: 0.95,
              lineHeight: 1.8
            }}
          >
            Join us at Holy Cross Convent School and give your child the advantage of early technology education 
            in one of the region's most innovative learning environments.
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

export default Robotics;


