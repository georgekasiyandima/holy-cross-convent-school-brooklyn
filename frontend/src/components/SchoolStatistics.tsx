import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Fade,
  Skeleton,
  Alert
} from '@mui/material';
import {
  TrendingUp,
  People,
  EmojiEvents,
  Psychology,
  School,
  Group,
  Sports,
  Palette,
  Numbers,
  AccountBalance,
  Book,
  Science,
  MusicNote,
  TheaterComedy,
  FitnessCenter,
  VolunteerActivism,
  AutoStories,
  Public,
  Language,
  Computer
} from '@mui/icons-material';
import { useSchoolStats } from '../hooks/useSchoolStats';
import { ICON_MAP } from '../types/schoolStats';

// Icon component mapping
const iconComponents: Record<string, React.ComponentType<any>> = {
  TrendingUp,
  People,
  EmojiEvents,
  Psychology,
  School,
  Group,
  Sports,
  Palette,
  Numbers,
  AccountBalance,
  Book,
  Science,
  MusicNote,
  TheaterComedy,
  FitnessCenter,
  VolunteerActivism,
  AutoStories,
  Public,
  Language,
  Computer
};

interface StatCardProps {
  stat: {
    id: string;
    label: string;
    value: string;
    icon: string;
    type: 'number' | 'percentage' | 'text';
  };
  index: number;
  animate: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, animate }) => {
  const IconComponent = iconComponents[stat.icon] || Numbers;

  return (
    <Fade in={animate} timeout={800 + (index * 200)}>
      <Card
        sx={{
          textAlign: 'center',
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(26, 35, 126, 0.1)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(26, 35, 126, 0.15)',
          },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <IconComponent
            sx={{
              fontSize: 60,
              color: '#1a237e',
              mb: 2,
              transition: 'transform 0.3s ease',
            }}
          />
          <Typography
            variant="h3"
            component="h3"
            sx={{
              color: '#1a237e',
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '2rem', md: '2.5rem' },
              lineHeight: 1.2,
            }}
          >
            {stat.value}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              fontSize: { xs: '1rem', md: '1.1rem' },
            }}
          >
            {stat.label}
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );
};

interface SchoolStatisticsProps {
  animate?: boolean;
}

const SchoolStatistics: React.FC<SchoolStatisticsProps> = ({ animate = true }) => {
  const { stats, loading, error, refetch } = useSchoolStats();

  if (error) {
    return (
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #fffde7 0%, #e3eafc 100%)' }}>
        <Container maxWidth="lg">
          <Alert 
            severity="error" 
            sx={{ mb: 4 }}
            action={
              <Typography
                component="span"
                onClick={refetch}
                sx={{ 
                  cursor: 'pointer', 
                  textDecoration: 'underline',
                  '&:hover': { color: 'primary.dark' }
                }}
              >
                Retry
              </Typography>
            }
          >
            Failed to load school statistics. Click retry to try again.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, background: 'linear-gradient(135deg, #fffde7 0%, #e3eafc 100%)' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{
            color: '#1a237e',
            fontWeight: 700,
            mb: 6,
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          Our School by the Numbers
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
            {[...Array(4)].map((_, index) => (
              <Card key={index} sx={{ p: 3, textAlign: 'center' }}>
                <Skeleton variant="circular" width={60} height={60} sx={{ mx: 'auto', mb: 2 }} />
                <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto' }} />
              </Card>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: stats.length > 4 ? 'repeat(auto-fit, minmax(250px, 1fr))' : 'repeat(4, 1fr)'
              },
              gap: 4,
            }}
          >
            {stats.map((stat, index) => (
              <StatCard
                key={stat.id}
                stat={stat}
                index={index}
                animate={animate}
              />
            ))}
          </Box>
        )}
        
        {!loading && stats.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No statistics available at the moment.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SchoolStatistics;


