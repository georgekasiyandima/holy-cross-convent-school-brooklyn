import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import {
  History,
  People,
  CheckCircle,
  School,
  TrendingUp,
  EmojiEvents,
  Psychology,
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
import { styled } from '@mui/material/styles';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { useSchoolStats } from '../../hooks/useSchoolStats';
import { SchoolStatsDisplay } from '../../types/schoolStats';

const StatsBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
  padding: theme.spacing(4, 0),
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
    zIndex: 1
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
    zIndex: 0
  }
}));

const StatItem = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  position: 'relative',
  zIndex: 1,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)'
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5)
  }
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
  fontWeight: 900,
  color: '#ffd700',
  lineHeight: 1.2,
  marginBottom: theme.spacing(0.5),
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
  fontWeight: 600,
  color: '#ffffff',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem'
  }
}));

const StatIcon = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: 'rgba(255, 215, 0, 0.15)',
  border: '2px solid rgba(255, 215, 0, 0.3)',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': {
    fontSize: 30,
    color: '#ffd700'
  },
  '&:hover': {
    background: 'rgba(255, 215, 0, 0.25)',
    borderColor: '#ffd700',
    transform: 'scale(1.1) rotate(5deg)'
  },
  [theme.breakpoints.down('sm')]: {
    width: 50,
    height: 50,
    marginBottom: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      fontSize: 24
    }
  }
}));

interface QuickStatsBannerProps {
  animate?: boolean;
}

interface DisplayStat {
  number: string;
  label: string;
  icon: React.ReactElement;
}

// Icon mapping function
const getIconComponent = (iconName: string): React.ReactElement => {
  const iconMap: Record<string, React.ReactElement> = {
    'History': <History />,
    'People': <People />,
    'CheckCircle': <CheckCircle />,
    'School': <School />,
    'TrendingUp': <TrendingUp />,
    'EmojiEvents': <EmojiEvents />,
    'Psychology': <Psychology />,
    'Group': <Group />,
    'Sports': <Sports />,
    'Palette': <Palette />,
    'Numbers': <Numbers />,
    'AccountBalance': <AccountBalance />,
    'Book': <Book />,
    'Science': <Science />,
    'MusicNote': <MusicNote />,
    'TheaterComedy': <TheaterComedy />,
    'FitnessCenter': <FitnessCenter />,
    'VolunteerActivism': <VolunteerActivism />,
    'AutoStories': <AutoStories />,
    'Public': <Public />,
    'Language': <Language />,
    'Computer': <Computer />
  };
  
  return iconMap[iconName] || <School />; // Default to School icon
};

// Convert SchoolStatsDisplay to DisplayStat format
const convertToDisplayStat = (stat: SchoolStatsDisplay): DisplayStat => {
  return {
    number: stat.value,
    label: stat.label,
    icon: getIconComponent(stat.icon)
  };
};

const QuickStatsBanner: React.FC<QuickStatsBannerProps> = ({ animate = true }) => {
  const { stats } = useSchoolStats();
  
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  // Default stats if API fails
  const defaultStats: DisplayStat[] = [
    { number: '65+', label: 'Years of Excellence', icon: <History /> },
    { number: '250+', label: 'Learners', icon: <People /> },
    { number: '98%', label: 'Pass Rate', icon: <CheckCircle /> },
    { number: '15+', label: 'Programs', icon: <School /> }
  ];

  // Convert API stats to display format or use defaults
  const displayStats: DisplayStat[] = stats && stats.length > 0 
    ? stats.slice(0, 4).map(convertToDisplayStat)
    : defaultStats;

  const formatNumber = (value: string): number => {
    const num = parseInt(value.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const hasNumber = (value: string): boolean => {
    return /^\d/.test(value);
  };

  return (
    <StatsBanner ref={ref}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            zIndex: 1
          }}
        >
          {displayStats.map((stat, index) => {
            const IconComponent = stat.icon;
            const numericValue = hasNumber(stat.number) ? formatNumber(stat.number) : 0;
            const suffix = stat.number.includes('+') ? '+' : stat.number.includes('%') ? '%' : '';

            return (
              <StatItem key={index}>
                <StatIcon>{IconComponent}</StatIcon>
                {inView && animate && hasNumber(stat.number) ? (
                  <StatNumber>
                    <CountUp
                      end={numericValue}
                      duration={2}
                      delay={index * 0.2}
                      suffix={suffix}
                      separator=","
                    />
                  </StatNumber>
                ) : (
                  <StatNumber>{stat.number}</StatNumber>
                )}
                <StatLabel>{stat.label}</StatLabel>
              </StatItem>
            );
          })}
        </Box>
      </Container>
    </StatsBanner>
  );
};

export default QuickStatsBanner;

