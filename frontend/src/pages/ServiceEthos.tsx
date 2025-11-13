import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, Button, Stack, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { VolunteerActivism, Groups, EmojiEvents, Favorite, SelfImprovement, Accessible, School } from '@mui/icons-material';
import SEO from '../components/SEO';
import ReturnToHome from '../components/ReturnToHome';

// Image paths - using constants for better production handling
const heroImage = '/ethomain.png';
const img1 = '/ethos005.jpg';
const img2 = '/etho009.jpg';
const img3 = '/etho007.jpg';
const img4 = '/etho002.jpg';
const img5 = '/ETHOS1.jpg';
const img6 = '/ETHOS2.jpg';
const img7 = '/ETHOS4.jpg';
const img8 = '/ethos001.jpg';
const img9 = '/ethos003.jpg';

const Hero = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '80vh',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `url("${heroImage}") center/cover no-repeat`,
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    minHeight: '600px',
  },
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
  borderTop: '4px solid #d32f2f',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(211,47,47,0.2)'
  },
  '&:focus-visible': {
    outline: '3px solid #ffd700',
    outlineOffset: '4px',
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(211,47,47,0.2)'
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
  background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
  color: '#fff',
  boxShadow: '0 8px 24px rgba(211,47,47,0.3)'
}));

const ServiceEthos: React.FC = () => {
  const servicePrograms = [
    { name: 'Community Outreach', icon: <Groups sx={{ fontSize: 40 }} aria-hidden="true" /> },
    { name: 'Volunteer Programs', icon: <VolunteerActivism sx={{ fontSize: 40 }} aria-hidden="true" /> },
    { name: 'Religious Education', icon: <School sx={{ fontSize: 40 }} aria-hidden="true" /> },
    { name: 'Service Learning', icon: <SelfImprovement sx={{ fontSize: 40 }} aria-hidden="true" /> },
  ];

  const coreValues = [
    { 
      title: 'Compassion', 
      description: 'Developing empathy and understanding for others in our community and beyond.',
      icon: <Favorite sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} aria-hidden="true" />
    },
    { 
      title: 'Responsibility', 
      description: 'Taking ownership of our actions and their impact on the world around us.',
      icon: <EmojiEvents sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} aria-hidden="true" />
    },
    { 
      title: 'Service to Others', 
      description: 'Actively engaging in helping those in need and making a positive difference.',
      icon: <Accessible sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} aria-hidden="true" />
    },
  ];

  return (
    <>
      <SEO
        title="Service & Ethos - Holy Cross Convent School"
        description="Learn about our commitment to service learning, community outreach, and Catholic values. Building character through serving others."
        keywords="service learning, community outreach, Catholic values, volunteer programs, Holy Cross Convent School"
        image="/ethomain.png"
        type="website"
      />

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
      
      {/* Hero Section */}
      <Hero>
        <Container maxWidth="xl">
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
            Service & Ethos
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
            Faith in Action: Building Character Through Service
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
            At Holy Cross Convent School, we believe that faith in action is at the heart of every learner's journey. 
            Our comprehensive service-learning programs nurture compassion, responsibility, and a spirit of service, 
            reflecting the Catholic values that guide our school community.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
          >
            <Chip 
              label="Faith in Action"
              aria-label="Faith in Action program"
              sx={{ 
                backgroundColor: '#d32f2f', 
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                px: 2,
                py: 3,
                mb: 2
              }} 
            />
            <Chip 
              label="Service to Others" 
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
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Paper 
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
            p: 6,
            borderRadius: 4,
            border: '2px solid #d32f2f',
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
            Nurturing Compassion Through Service
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
            Learners engage in meaningful activities, from community outreach and volunteer opportunities 
            to religious education, developing empathy, leadership, and a lifelong commitment to helping others. 
            Signature events such as our Seniors Christmas Party, and support for Catholic Care provide 
            opportunities for learners to make a positive impact while celebrating community and faith.
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
            Through our service-learning programs, we prepare learners not just for academic success, 
            but for lives of purpose, compassion, and meaningful contribution to society.
          </Typography>
        </Paper>
      </Container>

      {/* Service Programs List */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="xl">
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 800,
              mb: 6,
              color: '#1a237e'
            }}
          >
            Our Service Programs
          </Typography>

          <Grid container spacing={4}>
            {servicePrograms.map((program, index) => (
              <Grid item xs={6} md={3} key={index}>
                <FeatureCard>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <IconBox>
                      {program.icon}
                    </IconBox>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                      {program.name}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Solidarity with Rural Children Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            textAlign: 'center',
            fontWeight: 800,
            mb: 6,
            color: '#1a237e'
          }}
        >
          Solidarity with Rural Children
        </Typography>

        <Paper 
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            p: 4,
            borderRadius: 4,
            border: '2px solid #ff9800',
            mb: 4
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              color: '#1a237e',
              textAlign: 'center'
            }}
          >
            Supporting Children in Need
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              lineHeight: 1.8,
              fontSize: '1.1rem',
              mb: 4
            }}
          >
            Our learners show solidarity with rural children who go to school barefoot. Through various initiatives, 
            we collect and distribute shoes, clothing, and essential supplies to support their educational journey.
          </Typography>
        </Paper>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={img1}
              alt="Learners distributing shoes to rural children in need"
              loading="lazy"
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
              src={img2}
              alt="Students organizing donations for rural school children"
              loading="lazy"
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
              src={img3}
              alt="Grade 5 learners packing food parcels for church outreach"
              loading="lazy"
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
              src={img4}
              alt="Barefoot school children receiving donated shoes and supplies"
              loading="lazy"
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

      {/* Outreach Programs Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="xl">
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 800,
              mb: 6,
              color: '#1a237e'
            }}
          >
            Church Outreach Programs
          </Typography>

          <Paper 
            elevation={0}
            sx={{
              background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
              p: 4,
              borderRadius: 4,
              border: '2px solid #4caf50',
              mb: 4
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                color: '#1a237e',
                textAlign: 'center'
              }}
            >
              Feeding the Hungry and Serving the Underprivileged
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: 'center',
                lineHeight: 1.8,
                fontSize: '1.1rem',
                mb: 4
              }}
            >
              Holy Cross Convent School actively supports the church's outreach programs, providing meals 
              and essential support to those experiencing hunger and poverty in our community.
            </Typography>
          </Paper>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={img5}
                alt="Students preparing food parcels for church community outreach program"
                loading="lazy"
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
                src={img6}
                alt="Food distribution event serving meals to community members in need"
                loading="lazy"
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
                src={img7}
                alt="Community members receiving support during church outreach event"
                loading="lazy"
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
                src={img8}
                alt="Seniors Christmas Party with elderly community members"
                loading="lazy"
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
                src={img9}
                alt="Students volunteering at church service event helping community members"
                loading="lazy"
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
      </Box>

      {/* Core Values Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
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
          {coreValues.map((value, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                {value.icon}
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                  {value.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {value.description}
                </Typography>
              </Box>
            </Grid>
          ))}
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
            Ready to Make a Difference?
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 5,
              opacity: 0.95,
              lineHeight: 1.8
            }}
          >
            Join us at Holy Cross Convent School and discover the joy of service, compassion, 
            and making a positive impact in our community through faith in action.
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

export default ServiceEthos;
