import React from 'react';
import { Container, Typography, Box, Card, CardMedia, CardContent, Chip, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { History as HistoryIcon, School as SchoolIcon, Church as ChurchIcon } from '@mui/icons-material';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';

// Hero Section
const Hero = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '500px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'url("/Philomena.jpg") center/cover no-repeat',
  backgroundPosition: 'center 40%',
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
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(26, 35, 126, 0.02)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '3px',
    backgroundColor: '#ffd700',
    borderRadius: '2px',
  },
}));

const HistoricalCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(26, 35, 126, 0.15)',
  },
}));

const QuoteBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(26, 35, 126, 0.05)',
  borderLeft: `4px solid #ffd700`,
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  borderRadius: theme.spacing(1),
  position: 'relative',
  '&::before': {
    content: '"""',
    fontSize: '3rem',
    color: '#ffd700',
    position: 'absolute',
    top: '-10px',
    left: '20px',
    fontFamily: 'serif',
  },
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
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '5px',
    top: '20px',
    width: '2px',
    height: 'calc(100% + 20px)',
    backgroundColor: '#1a237e',
  },
  '&:last-child::after': {
    display: 'none',
  },
}));

const History: React.FC = () => {
  const theme = useTheme();

  return (
    <>
      <SEO 
        title="School History - Holy Cross Convent School Brooklyn" 
        description="Discover the rich history of Holy Cross Convent School Brooklyn, from our founding in 1959 to today." 
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
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              mb: 2,
              color: '#ffd700',
              textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9), 0 0 60px rgba(26,35,126,0.6)',
              letterSpacing: '0.5px'
            }}
          >
            Our Rich History
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#ffffff',
              fontWeight: 600,
              textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8)',
              fontSize: { xs: '1.5rem', md: '2rem' },
              mb: 2
            }}
          >
            A Legacy of Faith, Education, and Service
          </Typography>
          <Chip 
            label="Established 1959" 
            sx={{ 
              fontWeight: 600,
              backgroundColor: 'rgba(255, 215, 0, 0.9)',
              color: '#1a237e',
              border: '2px solid #1a237e',
              fontSize: '1rem',
              py: 2.5,
              px: 1
            }}
          />
        </Container>
      </Hero>

      <Container maxWidth="xl" sx={{ py: 6, mt: 4 }}>
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
            <HistoricalCard>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400, background: 'transparent' }}>
                <CardMedia
                  component="img"
                  sx={{ objectFit: 'contain', maxHeight: 400, maxWidth: '90%' }}
                  image="/Fr Theodosius.jpg"
                  alt="Fr Theodosius Fiorentini"
                />
              </Box>
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
                <QuoteBox sx={{ mt: 3 }}>
                  <Typography variant="body1" sx={{ pl: 2 }}>
                    "The need of the time is the will of God"
                  </Typography>
                </QuoteBox>
              </CardContent>
            </HistoricalCard>

            {/* Mother Bernarda */}
            <HistoricalCard>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400, background: 'transparent' }}>
                <CardMedia
                  component="img"
                  sx={{ objectFit: 'contain', maxHeight: 400, maxWidth: '90%' }}
                  image="/Bernarda BG.jpg"
                  alt="Mother Bernarda Heimgartner"
                />
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
                  Mother Bernarda Heimgartner
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>(1822-1863)</strong> - Founder of the Sisters of the Holy Cross in Menzingen, Switzerland.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Mother Bernarda's concern was for a holistic Christian education, especially for girls of working-class families. By raising the educational level of girls, the position of women in society would gradually improve and a deepening of the Christian faith would take place.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  People of her time should receive a clear orientation built on faith.
                </Typography>
                <QuoteBox sx={{ mt: 3 }}>
                  <Typography variant="body1" sx={{ pl: 2 }}>
                    "Be brave and every day begin anew to love God. Leave the worry of your school in the hands of the good Lord. Do what you can, give glory to God, be humble and ask for His blessing, without which our labours will bear no fruit."
                  </Typography>
                </QuoteBox>
              </CardContent>
            </HistoricalCard>

            {/* Sister Philomena */}
            <HistoricalCard>
              <CardMedia
                component="img"
                sx={{ objectFit: 'cover', height: 400 }}
                image="/Philomena.jpg"
                alt="Sister Philomena Burgess"
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
                <QuoteBox sx={{ mt: 3 }}>
                  <Typography variant="body1" sx={{ pl: 2 }}>
                    "May Jesus live in our hearts." (Mother Bernarda)
                  </Typography>
                </QuoteBox>
              </CardContent>
            </HistoricalCard>
          </Box>
        </HistorySection>

        {/* Congregation History Section */}
        <HistorySection>
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
            >
              <HistoryIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#ffd700' }} />
              Our School's Journey
            </Typography>
          </Box>

          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <TimelineItem>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
                1959 - The Beginning
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                Our school was founded with one class in a small room attached to the local parish church. Sister Philomena Burgess was the first teacher & principal.
              </Typography>
            </TimelineItem>

            <TimelineItem>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
                1959 - Expansion
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                Fr Ward's double garage was turned into a second classroom. Later that year a large portion of the school was built.
              </Typography>
            </TimelineItem>

            <TimelineItem>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
                April 3, 1960 - Blessing
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                Archbishop Owen McCann blessed the school and Holy Mass was introduced that same decade.
              </Typography>
            </TimelineItem>

            <TimelineItem>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
                October 1961 - First Communion
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                The first group of pupils had their First Holy Communion, marking a significant milestone in our spiritual journey.
              </Typography>
            </TimelineItem>

            <TimelineItem>
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
          borderRadius: theme.spacing(2),
          mt: 4
        }}>
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
