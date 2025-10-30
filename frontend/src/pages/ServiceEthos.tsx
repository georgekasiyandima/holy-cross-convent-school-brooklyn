import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip, Button, Stack, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { VolunteerActivism, Groups, EmojiEvents, Favorite, SelfImprovement, Accessible, LocalDining, School } from '@mui/icons-material';
import SEO from '../components/SEO';

const Hero = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '600px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'url("/ethomain.png") center/cover no-repeat',
  textAlign: 'center',
  '& > *': { position: 'relative', zIndex: 1 }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderTop: '4px solid #d32f2f',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
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
  background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
  color: '#fff',
  boxShadow: '0 8px 24px rgba(211,47,47,0.3)'
}));

const ServiceEthos: React.FC = () => {
  const servicePrograms = [
    { name: 'Community Outreach', icon: <Groups sx={{ fontSize: 40 }} /> },
    { name: 'Volunteer Programs', icon: <VolunteerActivism sx={{ fontSize: 40 }} /> },
    { name: 'Religious Education', icon: <School sx={{ fontSize: 40 }} /> },
    { name: 'Service Learning', icon: <SelfImprovement sx={{ fontSize: 40 }} /> },
  ];

  const coreValues = [
    { 
      title: 'Compassion', 
      description: 'Developing empathy and understanding for others in our community and beyond.',
      icon: <Favorite sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
    },
    { 
      title: 'Responsibility', 
      description: 'Taking ownership of our actions and their impact on the world around us.',
      icon: <EmojiEvents sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
    },
    { 
      title: 'Service to Others', 
      description: 'Actively engaging in helping those in need and making a positive difference.',
      icon: <Accessible sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
    },
  ];

  return (
    <>
      <SEO
        title="Service & Ethos - Holy Cross Convent School"
        description="Learn about our commitment to service learning, community outreach, and Catholic values. Building character through serving others."
        keywords="service learning, community outreach, Catholic values, volunteer programs, Holy Cross Convent School"
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper 
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
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
            Our Service Programs
          </Typography>

          <Grid container spacing={3}>
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

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ overflow: 'hidden' }}>
              <CardMedia 
                component="img" 
                image="/ethos005.jpg" 
                alt="Supporting Rural Children"
                sx={{ height: 400, objectFit: 'cover', objectPosition: 'center' }}
              />
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Learning Together
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Building connections and understanding through shared educational experiences.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ overflow: 'hidden' }}>
              <CardMedia 
                component="img" 
                image="/etho009.jpg" 
                alt="Community Support"
                sx={{ height: 400, objectFit: 'cover', objectPosition: 'center' }}
              />
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Unity in Service
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Coming together as a community to support children facing challenges.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ overflow: 'hidden' }}>
              <CardMedia 
                component="img" 
                image="/etho007.jpg" 
                alt="Rural School Support"
                sx={{ height: 300, objectFit: 'cover', objectPosition: 'center' }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Empowering Futures
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Providing resources to help rural children access quality education.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ overflow: 'hidden' }}>
              <CardMedia 
                component="img" 
                image="/etho002.jpg" 
                alt="Barefoot School Initiative"
                sx={{ height: 300, objectFit: 'cover', objectPosition: 'center' }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Stand in Solidarity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Demonstrating compassion and understanding for children in need.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ overflow: 'hidden' }}>
              <CardMedia 
                component="img" 
                image="/etho6.jpg" 
                alt="Rural Education Support"
                sx={{ height: 300, objectFit: 'cover', objectPosition: 'center' }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                  Community Impact
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Making a lasting difference in the lives of rural learners.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Outreach Programs Section */}
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

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ overflow: 'hidden' }}>
                <CardMedia 
                  component="img" 
                  image="/ETHOS1.jpg" 
                  alt="Community Outreach"
                  sx={{ height: 400, objectFit: 'cover', objectPosition: 'center' }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                    Faith in Action
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sharing our Catholic values through community service and support.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ overflow: 'hidden' }}>
                <CardMedia 
                  component="img" 
                  image="/ETHOS2.jpg" 
                  alt="Food Distribution"
                  sx={{ height: 400, objectFit: 'cover', objectPosition: 'center' }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                    Serving Meals
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Providing nourishment to families and individuals in need.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ overflow: 'hidden' }}>
                <CardMedia 
                  component="img" 
                  image="/ETHOS4.jpg" 
                  alt="Community Support"
                  sx={{ height: 400, objectFit: 'cover', objectPosition: 'center' }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a237e' }}>
                    Catholic Care
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Working together with the church to address community needs.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Core Values Section */}
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
