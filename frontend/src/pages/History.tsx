import React from 'react';
import { Container, Typography, Box, Card, CardMedia, CardContent, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { History as HistoryIcon, School as SchoolIcon, Church as ChurchIcon } from '@mui/icons-material';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';

// Import images - fallback to public paths if imports fail
const frTheodosiusImage = '/Fr Theodosius.jpg';
const bernardaImage = '/Bernarda BG.jpg';
const philomenaImage = '/Philomena.jpg';

// Hero Section
const Hero = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '500px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url("${philomenaImage}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center 30%',
  backgroundRepeat: 'no-repeat',
  textAlign: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,35,126,.80), rgba(211,47,47,.60))',
    zIndex: 0
  },
  '& > *': { position: 'relative', zIndex: 1 }
}));

// Styled components
const HistorySection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(8),
  padding: theme.spacing(4, 0),
  position: 'relative',
  marginTop: theme.spacing(8),
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(26, 35, 126, 0.02)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
  },
}));

const HistoricalCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(26, 35, 126, 0.15)',
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '4px',
  },
}));

const QuoteBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(26, 35, 126, 0.05)',
  borderLeft: `4px solid #ffd700`,
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  borderRadius: theme.spacing(1),
  position: 'relative',
}));

const TimelineItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingLeft: theme.spacing(4),
  marginBottom: theme.spacing(3),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 8,
    width: '12px',
    height: '12px',
    backgroundColor: '#ffd700',
    borderRadius: '50%',
    border: '3px solid #1a237e',
    zIndex: 2,
  },
}));

const History: React.FC = () => {
  return (
    <>
      <SEO 
        title="School History - Holy Cross Convent School Brooklyn" 
        description="Discover the rich history of Holy Cross Convent School Brooklyn, from our founding in 1959 to today."
        image={philomenaImage}
        type="article"
      />
      
      {/* Return to Home - positioned above hero to avoid blocking content */}
      <Box sx={{ 
        position: 'absolute', 
        top: { xs: 80, sm: 100 }, 
        left: 16, 
        zIndex: 1001,
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
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
          <Typography 
            variant="h1" 
            component="h2"
            aria-label="Our Rich History"
            sx={{ 
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              mb: 2,
              color: '#ffd700',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)',
              letterSpacing: '0.5px'
            }}
            data-testid="hero-title"
          >
            Our Rich History
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#ffffff',
              fontWeight: 600,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.6)',
              fontSize: { xs: '1.5rem', md: '2rem' },
              mb: 2
            }}
            data-testid="hero-subtitle"
          >
            A Legacy of Faith, Education, and Service
          </Typography>
          <Chip 
            label="Established 1959" 
            aria-label="Established 1959"
            sx={{ 
              fontWeight: 600,
              backgroundColor: 'rgba(255, 215, 0, 0.9)',
              color: '#1a237e',
              border: '2px solid #1a237e',
              fontSize: '1rem',
              py: 2.5,
              px: 1
            }}
            data-testid="established-chip"
          />
        </Container>
      </Hero>

      <Container maxWidth="lg" sx={{ py: 6, mt: 4 }} data-testid="history-content">
        {/* Page Header - with proper spacing from hero */}
        <Box sx={{ textAlign: 'center', mb: 8, mt: 4 }}>
        <Typography 
            variant="h3" 
            component="h2" 
          gutterBottom
          sx={{ 
            color: '#1a237e', 
            fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2
          }}
        >
          <HistoryIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#ffd700' }} />
            Spanning Over 125 Years
        </Typography>
        <Typography 
            variant="body1" 
          color="text.secondary" 
          sx={{ 
            maxWidth: '800px', 
            mx: 'auto',
            mb: 3,
            fontSize: '1.2rem',
              lineHeight: 1.8
          }}
        >
            From humble beginnings in a small room to a thriving educational institution, Holy Cross Convent School Brooklyn continues to uphold the values and vision of our founders.
        </Typography>
      </Box>

      {/* Founding Figures Section */}
      <HistorySection>
        <Box sx={{ width: 60, height: 3, bgcolor: '#ffd700', borderRadius: 1, mx: 'auto', mb: 4 }} data-testid="section-divider" />
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
            }}
            data-testid="founding-figures-title"
          >
            <ChurchIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#ffd700' }} />
            Our Founding Figures
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              maxWidth: '600px', 
              mx: 'auto',
              fontSize: '1.1rem',
            }}
          >
            The visionaries who shaped our mission and values
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4 
        }}>
          {/* Fr Theodosius Fiorentini */}
          <HistoricalCard data-testid="founding-card-theodosius">
              <CardMedia
                component="img"
                loading="lazy"
                sx={{ 
                  objectFit: 'cover',
                  aspectRatio: '3/4',
                  width: '100%',
                  display: 'block'
                }}
                image={frTheodosiusImage}
                alt="Fr Theodosius Fiorentini, O.F.M. Capuchin (1808-1865)"
              />
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
                Fr Theodosius Fiorentini, O.F.M. Capuchin
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>(1808-1865)</strong> - One of the most prominent and influential men in the history of the Church in his time. He was passionate about Christ, Education and family life.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                In his vision Father Theodosius saw a new society on the way, a society that was more humane and just according to the understanding of the Gospel.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Notwithstanding the obstacles, attacks and failures, and convinced about his mission in the church, he was determined to take the wheel of time into his own hands.
              </Typography>
              <QuoteBox sx={{ mt: 3 }} data-testid="quote-box">
                <Typography variant="body1" sx={{ pl: 5, position: 'relative' }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      position: 'absolute', 
                      left: 0, 
                      top: -10, 
                      fontSize: '3rem', 
                      color: '#ffd700', 
                      fontFamily: 'serif',
                      lineHeight: 1
                    }}
                  >
                    &quot;
                  </Box>
                  The need of the time is the will of God
                  <Box 
                    component="span" 
                    sx={{ 
                      fontSize: '3rem', 
                      color: '#ffd700', 
                      fontFamily: 'serif',
                      lineHeight: 1,
                      ml: 0.5
                    }}
                  >
                    &quot;
                  </Box>
                </Typography>
              </QuoteBox>
            </CardContent>
          </HistoricalCard>

          {/* Mother Bernarda */}
          <HistoricalCard data-testid="founding-card-bernarda">
              <CardMedia
                component="img"
                loading="lazy"
                sx={{ 
                  objectFit: 'cover',
                  aspectRatio: '3/4',
                  width: '100%',
                  display: 'block'
                }}
                image={bernardaImage}
                alt="Mother Bernarda Heimgartner, Founder of the Sisters of the Holy Cross (1822-1863)"
              />
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
                Mother Bernarda Heimgartner
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>(1822-1863)</strong> - Founder of the Sisters of the Holy Cross in Menzingen, Switzerland.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Mother Bernarda&apos;s concern was for a holistic Christian education, especially for girls of working-class families. By raising the educational level of girls, the position of women in society would gradually improve and a deepening of the Christian faith would take place.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                People of her time should receive a clear orientation built on faith.
              </Typography>
              <QuoteBox sx={{ mt: 3 }} data-testid="quote-box">
                <Typography variant="body1" sx={{ pl: 5, position: 'relative' }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      position: 'absolute', 
                      left: 0, 
                      top: -10, 
                      fontSize: '3rem', 
                      color: '#ffd700', 
                      fontFamily: 'serif',
                      lineHeight: 1
                    }}
                  >
                    &quot;
                  </Box>
                  Be brave and every day begin anew to love God. Leave the worry of your school in the hands of the good Lord. Do what you can, give glory to God, be humble and ask for His blessing, without which our labours will bear no fruit.
                  <Box 
                    component="span" 
                    sx={{ 
                      fontSize: '3rem', 
                      color: '#ffd700', 
                      fontFamily: 'serif',
                      lineHeight: 1,
                      ml: 0.5
                    }}
                  >
                    &quot;
                  </Box>
                </Typography>
              </QuoteBox>
            </CardContent>
          </HistoricalCard>

          {/* Sister Philomena */}
          <HistoricalCard data-testid="founding-card-philomena">
            <CardMedia
              component="img"
              loading="lazy"
              sx={{ 
                objectFit: 'cover',
                aspectRatio: '3/4',
                width: '100%',
                display: 'block'
              }}
              image={philomenaImage}
              alt="Sister Philomena Burgess, first teacher and principal of Holy Cross Convent School Brooklyn"
            />
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
                Sister Philomena Burgess
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The first teacher and principal of Holy Cross Convent School Brooklyn, who began our educational journey in 1959.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Sister Philomena started with one class in a small room attached to the local parish church, laying the foundation for what would become a thriving educational institution.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Her dedication and vision continue to inspire our school community today.
              </Typography>
              <QuoteBox sx={{ mt: 3 }} data-testid="quote-box">
                <Typography variant="body1" sx={{ pl: 5, position: 'relative' }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      position: 'absolute', 
                      left: 0, 
                      top: -10, 
                      fontSize: '3rem', 
                      color: '#ffd700', 
                      fontFamily: 'serif',
                      lineHeight: 1
                    }}
                  >
                    &quot;
                  </Box>
                  May Jesus live in our hearts. (Mother Bernarda)
                  <Box 
                    component="span" 
                    sx={{ 
                      fontSize: '3rem', 
                      color: '#ffd700', 
                      fontFamily: 'serif',
                      lineHeight: 1,
                      ml: 0.5
                    }}
                  >
                    &quot;
                  </Box>
                </Typography>
              </QuoteBox>
            </CardContent>
          </HistoricalCard>
        </Box>
      </HistorySection>

      {/* Congregation History Section */}
      <HistorySection>
        <Box sx={{ width: 60, height: 3, bgcolor: '#ffd700', borderRadius: 1, mx: 'auto', mb: 4 }} data-testid="section-divider" />
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
            }}
            data-testid="congregation-title"
          >
            <SchoolIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#ffd700' }} />
            Our Congregation
          </Typography>
        </Box>

        <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
            The Congregation of the Sisters of the Holy Cross is a Swiss Congregation founded in Switzerland. The South African Province of the Congregation was founded from the General Motherhouse in Switzerland in 1883. This was the first time that a Catholic religious congregation had embarked upon missionary activity outside the confines of Europe.
          </Typography>
          
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4, fontWeight: 600, color: '#1a237e' }}>
            Therefore we celebrate, this year, and with great joy and thanksgiving our 125 years of loving service in a variety of apostolic works throughout our S. African Province.
          </Typography>
        </Box>
      </HistorySection>

      {/* School Timeline Section */}
      <HistorySection>
        <Box sx={{ width: 60, height: 3, bgcolor: '#ffd700', borderRadius: 1, mx: 'auto', mb: 4 }} data-testid="section-divider" />
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
            }}
            data-testid="timeline-title"
          >
            <HistoryIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#ffd700' }} />
            Our School's Journey
          </Typography>
        </Box>

        <Box sx={{ maxWidth: '800px', mx: 'auto', position: 'relative' }} data-testid="timeline-container">
          {/* Timeline line */}
          <Box
            sx={{
              position: 'absolute',
              left: '5px',
              top: '20px',
              bottom: 0,
              width: '2px',
              backgroundColor: '#1a237e',
              zIndex: 1,
            }}
          />
          <TimelineItem data-testid="timeline-item">
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
              1959 - The Beginning
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              Our school was founded with one class in a small room attached to the local parish church. Sister Philomena Burgess was the first teacher & principal.
            </Typography>
          </TimelineItem>

          <TimelineItem data-testid="timeline-item">
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
              1959 - Expansion
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              Fr Ward's double garage was turned into a second classroom. Later that year a large portion of the school was built.
            </Typography>
          </TimelineItem>

          <TimelineItem data-testid="timeline-item">
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
              April 3, 1960 - Blessing
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              Archbishop Owen McCann blessed the school and Holy Mass was introduced that same decade.
            </Typography>
          </TimelineItem>

          <TimelineItem data-testid="timeline-item">
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
              October 1961 - First Communion
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              The first group of pupils had their First Holy Communion, marking a significant milestone in our spiritual journey.
            </Typography>
          </TimelineItem>

          <TimelineItem data-testid="timeline-item">
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
              Today - Continuing the Legacy
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              Sr Eileen Kenny still teaches Religious Education at our school, continuing the tradition of faith-based education established by our founders.
            </Typography>
          </TimelineItem>
        </Box>
      </HistorySection>

      {/* Legacy Section */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 6, 
        backgroundColor: 'rgba(26, 35, 126, 0.05)',
        borderRadius: 2,
        mt: 4
      }}
      data-testid="legacy-section"
      >
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            color: '#1a237e', 
            fontWeight: 700,
            mb: 3
          }}
        >
          Our Legacy Continues
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '1.2rem',
            maxWidth: '800px', 
            mx: 'auto',
            lineHeight: 1.8,
            color: 'text.secondary'
          }}
        >
          From humble beginnings in a small room to a thriving educational institution, Holy Cross Convent School Brooklyn continues to uphold the values and vision of our founders. We remain committed to providing holistic Christian education that nurtures both the mind and the soul.
        </Typography>
      </Box>
    </Container>
    </>
  );
};

export default History; 
