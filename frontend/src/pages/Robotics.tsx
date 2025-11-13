import React, { useMemo } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, Button, Stack, Paper, Divider, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Computer, RocketLaunch, Lightbulb, Groups, Code, School } from '@mui/icons-material';
import SEO from '../components/SEO';

// Image paths - ready for import if needed
const heroImage = '/ROBT008.jpg';
const labImage1 = '/ROBT02.jpg';
const labImage2 = '/ROBT03.jpg';
const labImage3 = '/ROBT4.jpg';
const labImage4 = '/ROBTX1.jpg';

const Hero = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '600px',
  [theme.breakpoints.down('md')]: {
    minHeight: '80vh',
  },
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url("${heroImage}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  textAlign: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,35,126,0.8), rgba(211,47,47,0.6))',
    zIndex: 0
  },
  '& > *': { position: 'relative', zIndex: 1 }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderTop: `2px solid ${theme.palette.error.main}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(26,35,126,0.2)'
  },
  '&:focus-visible': {
    outline: `3px solid ${theme.palette.warning.main}`,
    outlineOffset: '4px',
    transform: 'translateY(-8px)'
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
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.error.main} 100%)`,
  color: '#fff',
  boxShadow: `0 8px 24px ${theme.palette.primary.main}4D`
}));

// FeatureItem component for reusability
interface FeatureItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, title, description }) => {
  const theme = useTheme();
  return (
    <FeatureCard data-testid={`feature-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent sx={{ textAlign: 'center', py: 4 }}>
        <IconBox aria-hidden="true">
          <Icon sx={{ fontSize: 40 }} aria-hidden="true" />
        </IconBox>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            mb: 2, 
            color: theme.palette.primary.main 
          }}
        >
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </FeatureCard>
  );
};

const Robotics: React.FC = () => {
  const theme = useTheme();

  // Features data
  const features = useMemo(() => [
    {
      icon: School,
      title: 'Grade R Onwards',
      description: 'Early introduction to technology ensures every child has a strong foundation in digital literacy from the very start.',
    },
    {
      icon: Lightbulb,
      title: 'Critical Thinking',
      description: 'Learners develop problem-solving skills through hands-on projects that challenge them to think creatively.',
    },
    {
      icon: Code,
      title: 'CAPS-Aligned',
      description: 'Our curriculum meets national standards while incorporating cutting-edge technology and innovative teaching methods.',
    },
    {
      icon: RocketLaunch,
      title: 'Innovation',
      description: 'We celebrate curiosity, imagination, and the courage to experiment with new technologies and ideas.',
    },
    {
      icon: Groups,
      title: 'Collaboration',
      description: 'Team projects and peer learning build essential 21st-century skills for success in the modern world.',
    },
    {
      icon: Computer,
      title: 'State-of-the-Art Lab',
      description: 'Our dedicated facility provides the tools and environment needed for exceptional learning experiences.',
    },
  ], []);

  return (
    <>
      <SEO 
        title="Robotics & Computer Lab - Holy Cross Convent School" 
        description="Our dedicated Robotics and Computer Room introduces learners from Grade R onwards to hands-on, innovative technology, giving them a head start in the digital world."
        image={heroImage}
        type="website"
      />
      
      {/* Hero Section */}
      <Hero aria-label="Robotics and Computer Lab hero section" data-testid="robotics-hero">
        <Container maxWidth="xl">
          <Chip 
            label="Newly Launched" 
            aria-label="Newly Launched"
            sx={{ 
              backgroundColor: theme.palette.warning.main, 
              color: theme.palette.primary.main,
              fontWeight: 700,
              fontSize: '1rem',
              px: 2,
              py: 3,
              mb: 4
            }}
            data-testid="newly-launched-chip"
          />
          
          <Typography 
            variant="h1" 
            component="h1"
            sx={{ 
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 3,
              color: theme.palette.warning.main,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
            data-testid="hero-title"
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
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              px: 2,
              lineHeight: 1.4
            }}
            data-testid="hero-subtitle"
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
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
            data-testid="hero-description"
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
                backgroundColor: theme.palette.warning.main,
                color: theme.palette.primary.main,
                fontWeight: 700,
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                boxShadow: `0 8px 25px ${theme.palette.warning.main}66`,
                '&:hover': {
                  backgroundColor: theme.palette.warning.light,
                  transform: 'translateY(-3px)',
                  boxShadow: `0 12px 35px ${theme.palette.warning.main}80`
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              data-testid="cta-join-button"
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
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                '&:hover': {
                  borderColor: theme.palette.warning.main,
                  color: theme.palette.warning.main,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-3px)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              data-testid="cta-visit-button"
            >
              Schedule a Visit
            </Button>
          </Stack>
        </Container>
      </Hero>

      {/* Mission Statement */}
      <Container maxWidth="xl" sx={{ py: 8 }} data-testid="mission-section">
        <Paper 
          elevation={0}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.error.light} 0%, ${theme.palette.primary.light} 100%)`,
            p: { xs: 4, sm: 6 },
            borderRadius: 4,
            border: `1px solid ${theme.palette.error.main}`,
            textAlign: 'center'
          }}
          data-testid="mission-paper"
        >
          <Typography 
            variant="h3" 
            component="h2"
            sx={{ 
              fontWeight: 800,
              mb: 3,
              color: theme.palette.primary.main
            }}
            data-testid="mission-title"
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
              color: 'text.primary'
            }}
            data-testid="mission-description"
          >
            At Holy Cross Convent School, we are proud to be one of the few schools in the region with a 
            dedicated Robotics and Computer Room. Here, learners from Grade R onwards are introduced to 
            hands-on, innovative technology, giving them a head start in the digital world.
          </Typography>

          <Divider sx={{ my: 4, borderWidth: 2, borderColor: theme.palette.error.main }} />

          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: '1.1rem',
              color: 'text.secondary'
            }}
            data-testid="mission-details"
          >
            Our program follows the CAPS-aligned curriculum and is designed to stretch thinking skills, spark creativity, 
            and develop problem-solving abilities. By combining technology with our commitment to academic excellence, 
            we prepare learners to navigate and thrive in a rapidly evolving, modern world.
          </Typography>
        </Paper>
      </Container>

      {/* Features Section */}
      <Box sx={{ backgroundColor: theme.palette.grey[50], py: 8 }} data-testid="features-section">
        <Container maxWidth="xl">
          <Typography 
            variant="h3" 
            component="h2"
            sx={{ 
              textAlign: 'center',
              fontWeight: 800,
              mb: 6,
              color: theme.palette.primary.main
            }}
            data-testid="features-title"
          >
            Building Tomorrow's Problem Solvers
          </Typography>

          <Grid container spacing={4} data-testid="features-grid">
            {features.map((feature) => (
              <Grid item xs={12} md={6} lg={4} key={feature.title}>
                <FeatureItem 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Gallery Section - Images Only */}
      <Container maxWidth="xl" sx={{ py: 8 }} data-testid="gallery-section">
        <Typography 
          variant="h3" 
          component="h2"
          sx={{ 
            textAlign: 'center',
            fontWeight: 800,
            mb: 6,
            color: theme.palette.primary.main
          }}
          data-testid="gallery-title"
        >
          Our Learning Environment
        </Typography>

        <Grid container spacing={4} data-testid="gallery-grid">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={labImage1}
              alt="Computer Lab with modern workstations and students engaged in learning"
              loading="lazy"
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: `0 4px 20px ${theme.palette.common.black}1A`
              }}
              data-testid="gallery-image-1"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={labImage2}
              alt="Students learning robotics and computer skills in the dedicated lab"
              loading="lazy"
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: `0 4px 20px ${theme.palette.common.black}1A`
              }}
              data-testid="gallery-image-2"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={labImage3}
              alt="Digital citizenship and technology education in action"
              loading="lazy"
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: `0 4px 20px ${theme.palette.common.black}1A`
              }}
              data-testid="gallery-image-3"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={heroImage}
              alt="Modern robotics and computer technology equipment"
              loading="lazy"
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: `0 4px 20px ${theme.palette.common.black}1A`
              }}
              data-testid="gallery-image-4"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={labImage4}
              alt="Dedicated robotics and computer room facility"
              loading="lazy"
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: `0 4px 20px ${theme.palette.common.black}1A`
              }}
              data-testid="gallery-image-5"
            />
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.error.main} 100%)`, 
          py: 8, 
          color: 'white' 
        }}
        data-testid="cta-section"
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h2"
            sx={{ 
              fontWeight: 800,
              mb: 3,
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
            data-testid="cta-title"
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
            data-testid="cta-description"
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
                backgroundColor: theme.palette.warning.main,
                color: theme.palette.primary.main,
                fontWeight: 700,
                px: { xs: 4, sm: 5 },
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                borderRadius: 3,
                boxShadow: `0 8px 25px ${theme.palette.warning.main}66`,
                '&:hover': {
                  backgroundColor: theme.palette.warning.light,
                  transform: 'translateY(-3px)',
                  boxShadow: `0 12px 35px ${theme.palette.warning.main}80`
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              data-testid="cta-application-button"
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
                px: { xs: 4, sm: 5 },
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                borderRadius: 3,
                '&:hover': {
                  borderColor: theme.palette.warning.main,
                  color: theme.palette.warning.main,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-3px)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              data-testid="cta-contact-button"
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


