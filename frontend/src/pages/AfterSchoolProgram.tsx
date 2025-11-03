import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip, Stack, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AccessTime, School, Groups, EmojiEvents, Favorite, Lightbulb } from '@mui/icons-material';
import SEO from '../components/SEO';
import ReturnToHome from '../components/ReturnToHome';

const Hero = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '600px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'url("/edu2.jpg") center/cover no-repeat',
  textAlign: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,35,126,.65), rgba(211,47,47,.40))',
    zIndex: 0
  },
  '& > *': { position: 'relative', zIndex: 1 }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)'
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
  color: '#fff',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)'
  }
}));

const AfterSchoolProgram: React.FC = () => {
  return (
    <>
      <SEO 
        title="After School Programme - Holy Cross Convent School" 
        description="Our After School Programme provides learners with a safe, engaging, and enriching environment from 14:30 to 17:15, completely free of charge." 
      />
      
      {/* Hero Section */}
      <Hero>
        <Container maxWidth="lg">
          {/* Return to Home */}
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

          <Chip 
            label="Free Programme" 
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
          
          <Box sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            padding: { xs: 3, md: 4 },
            borderRadius: 3,
            border: '2px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
          }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 900,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                mb: 3,
                color: '#ffd700',
                textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(26,35,126,0.5)',
                letterSpacing: '0.5px'
              }}
            >
              After School Programme
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                maxWidth: '900px',
                mx: 'auto',
                mb: 4,
                fontWeight: 700,
                color: '#ffffff',
                textShadow: '2px 2px 4px rgba(0,0,0,1), 0 0 15px rgba(0,0,0,0.6)',
                px: 2,
                lineHeight: 1.4,
                fontSize: { xs: '1.3rem', md: '1.5rem' }
              }}
            >
              Learning Doesn't Stop When the Bell Rings
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
                textShadow: '2px 2px 4px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,0.5)',
                fontSize: { xs: '1rem', md: '1.2rem' }
              }}
            >
              A safe, engaging, and enriching environment where learners can grow, explore, and thrive after school hours.
            </Typography>
          </Box>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Chip
              icon={<AccessTime />}
              label="14:30 - 17:15"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                px: 2,
                py: 3,
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            />
            <Chip
              icon={<Favorite />}
              label="100% Free"
              sx={{
                backgroundColor: 'rgba(255, 215, 0, 0.3)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                px: 2,
                py: 3,
                border: '2px solid rgba(255, 215, 0, 0.5)'
              }}
            />
            <Chip
              icon={<Groups />}
              label="Daily Programme"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                px: 2,
                py: 3,
                border: '2px solid rgba(255, 255, 255, 0.3)'
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
            background: 'linear-gradient(135deg, #e3f2fd 0%, #ffebee 100%)',
            p: 6,
            borderRadius: 4,
            border: '3px solid #1a237e',
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
              color: '#555',
              fontWeight: 500,
              lineHeight: 1.8
            }}
          >
            At Holy Cross Convent School, we believe that every child deserves the chance to learn, play, and shine — even after the school day ends. Our After School Programme provides learners with a safe, engaging, and enriching environment weekdays from 14:30 to 17:15, completely free of charge.
          </Typography>
        </Paper>
      </Container>

      {/* Main Features with Images */}
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
          What We Offer
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {/* Row 1 - Full Width */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ overflow: 'hidden', height: '100%' }}>
                  <CardMedia 
                    component="img" 
                    image="/edu2.jpg" 
                    alt="After School Learning"
                    sx={{ height: 400, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                      Safe & Nurturing Environment
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      Children receive support with homework and projects, guided study sessions, and educational games, all within a nurturing and supervised space. It's a place where learners can grow, explore, and thrive while enjoying every moment after school.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ overflow: 'hidden', height: '100%' }}>
                  <CardMedia 
                    component="img" 
                    image="/Acare.jpg" 
                    alt="Supervised Activities"
                    sx={{ height: 400, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                      Comprehensive Support
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      From homework assistance to structured learning activities, our programme ensures that every child has the support they need to succeed academically while developing confidence and social skills.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Key Features Grid */}
        <Box sx={{ 
          mb: 6,
          textAlign: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120px',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #d32f2f, transparent)',
            zIndex: 0
          }
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 900,
              mb: 5,
              color: '#d32f2f',
              position: 'relative',
              zIndex: 1,
              fontSize: { xs: '2rem', md: '2.5rem' },
              textShadow: '2px 2px 4px rgba(211, 47, 47, 0.2)',
              letterSpacing: '0.5px'
            }}
          >
            Programme Highlights
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard sx={{ 
              borderTop: '4px solid #d32f2f',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <IconBox sx={{ 
                  background: 'linear-gradient(135deg, #d32f2f 0%, #ff6b6b 100%)',
                  boxShadow: '0 8px 24px rgba(211, 47, 47, 0.4)'
                }}>
                  <School sx={{ fontSize: 40 }} />
                </IconBox>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#d32f2f' }}>
                  Homework Support
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Dedicated time and assistance for completing homework and assignments with guidance from qualified staff.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard sx={{ 
              borderTop: '4px solid #d32f2f',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <IconBox sx={{ 
                  background: 'linear-gradient(135deg, #d32f2f 0%, #ff6b6b 100%)',
                  boxShadow: '0 8px 24px rgba(211, 47, 47, 0.4)'
                }}>
                  <Lightbulb sx={{ fontSize: 40 }} />
                </IconBox>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#d32f2f' }}>
                  Guided Study Sessions
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Structured learning activities that reinforce classroom lessons and encourage independent thinking.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard sx={{ 
              borderTop: '4px solid #d32f2f',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <IconBox sx={{ 
                  background: 'linear-gradient(135deg, #d32f2f 0%, #ff6b6b 100%)',
                  boxShadow: '0 8px 24px rgba(211, 47, 47, 0.4)'
                }}>
                  <EmojiEvents sx={{ fontSize: 40 }} />
                </IconBox>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#d32f2f' }}>
                  Educational Games
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Fun, interactive activities that make learning enjoyable while developing critical skills.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: '#1a237e', py: 8, color: 'white' }}>
        <Container maxWidth="md">
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 800,
              mb: 3,
              color: '#ffd700'
            }}
          >
            Ready to Join?
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center',
              mb: 5,
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.8
            }}
          >
            At Holy Cross, we believe that every child deserves the chance to learn, play, and shine — even after the school day ends. Our After School Programme is available to all learners, completely free of charge.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent="center"
          >
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
              Learn More
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
              Contact Us
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default AfterSchoolProgram;


