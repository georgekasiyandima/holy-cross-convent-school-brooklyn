import React, { Suspense, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Paper,
  useTheme,
  useMediaQuery,
  Grid,
  Skeleton,
} from '@mui/material';
import { Visibility, Flag } from '@mui/icons-material';
import MissionStatement from '../components/MissionStatement';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';

// Custom hook for efficient breakpoint detection
const useBreakpoint = (breakpoint: 'sm' | 'md' | 'lg' | 'xl') => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
};

// ValueCard component for reusability
const ValueCard: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const theme = useTheme();
  return (
    <Card 
      sx={{ 
        height: '100%', 
        backgroundColor: `${theme.palette.background.paper}CC` // 80% opacity
      }}
      data-testid={`value-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: theme.palette.primary.main, 
            fontWeight: 600 
          }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Loading skeleton for MissionStatement
const MissionStatementSkeleton = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
    <Skeleton variant="text" width="60%" height={40} />
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="75%" />
  </Box>
);

const MissionVision: React.FC = () => {
  const theme = useTheme();
  const isMobile = useBreakpoint('md');

  // Core values data
  const coreValues = useMemo(() => [
    {
      title: 'Faith & Spirituality',
      description: 'Grounded in Catholic values and teachings, fostering spiritual growth and moral development.',
    },
    {
      title: 'Academic Excellence',
      description: 'Commitment to high-quality education that challenges and inspires students to achieve their potential.',
    },
    {
      title: 'Community & Service',
      description: 'Building strong relationships and encouraging service to others, locally and globally.',
    },
    {
      title: 'Respect & Integrity',
      description: 'Fostering an environment of mutual respect, honesty, and ethical behavior.',
    },
  ], []);

  return (
    <>
      <SEO
        title="Mission & Vision - Holy Cross Convent School Brooklyn"
        description="Discover the mission and vision of Holy Cross Convent School Brooklyn, guiding our educational excellence and values."
      />
      
      <Container maxWidth="xl" sx={{ py: 6 }} data-testid="mission-vision-container">
        {/* Return to Home */}
        <ReturnToHome />

        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }} data-testid="page-header">
          <Typography 
            variant={isMobile ? 'h3' : 'h2'} 
            component="h1" 
            gutterBottom 
            sx={{ 
              color: theme.palette.primary.main, 
              fontWeight: 700,
              mb: 2
            }}
            data-testid="page-title"
          >
            Our Mission & Vision
          </Typography>
          <Box 
            sx={{ 
              width: 80, 
              height: 4, 
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 50%, ${theme.palette.error.main} 100%)`,
              mx: 'auto',
              mb: 3,
              borderRadius: 2
            }}
            aria-hidden="true"
            data-testid="header-divider"
          />
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: '800px', mx: 'auto' }}
          >
            Guiding principles that shape our educational excellence and community values
          </Typography>
        </Box>

        {/* Mission Statement */}
        <Box sx={{ mb: 6 }} data-testid="mission-statement-section">
          <Suspense fallback={<MissionStatementSkeleton />}>
            <MissionStatement />
          </Suspense>
        </Box>

        {/* Vision Statement */}
        <Paper 
          elevation={isMobile ? 1 : 3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.light}CC 100%)`,
            borderRadius: 3,
            border: `1px solid ${theme.palette.error.main}`,
            position: 'relative',
          }}
          data-testid="vision-paper"
        >
          {/* Gradient bar - replaced ::before with Box */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 50%, ${theme.palette.error.main} 100%)`,
              borderRadius: '12px 12px 0 0',
            }}
            aria-hidden="true"
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Visibility 
              sx={{ 
                fontSize: '2.5rem', 
                color: theme.palette.error.main, 
                mr: 2 
              }}
              aria-hidden="true"
            />
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                color: theme.palette.primary.main, 
                fontWeight: 700 
              }}
              data-testid="vision-title"
            >
              Our Vision
            </Typography>
          </Box>
          
          <Typography 
            variant="h6" 
            paragraph 
            sx={{ 
              color: 'text.primary',
              lineHeight: 1.8,
              fontSize: '1.1rem'
            }}
            data-testid="vision-description"
          >
            To be a leading Catholic educational institution that nurtures holistic development, 
            academic excellence, and spiritual growth, preparing students to become compassionate, 
            responsible, and innovative leaders who contribute positively to society.
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              textAlign: 'center',
              mt: 3,
              fontSize: '1rem',
              fontStyle: 'italic'
            }}
            data-testid="vision-quote"
          >
            &quot;In cruce salus&quot; - In the cross is salvation
          </Typography>
        </Paper>

        {/* Core Values */}
        <Paper 
          elevation={isMobile ? 1 : 3} 
          sx={{ 
            p: 4, 
            background: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.light}CC 100%)`,
            borderRadius: 3
          }}
          data-testid="core-values-paper"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Flag 
              sx={{ 
                fontSize: '2.5rem', 
                color: theme.palette.warning.main, 
                mr: 2 
              }}
              aria-hidden="true"
            />
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                color: theme.palette.primary.main, 
                fontWeight: 700 
              }}
              data-testid="core-values-title"
            >
              Our Core Values
            </Typography>
          </Box>

          <Grid container spacing={3} data-testid="core-values-grid">
            {coreValues.map((value) => (
              <Grid item xs={12} md={6} key={value.title}>
                <ValueCard title={value.title} description={value.description} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default MissionVision;















