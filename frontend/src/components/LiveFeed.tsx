import React, { useState, useEffect, memo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Fade,
  useTheme,
  useMediaQuery,
  LinearProgress
} from '@mui/material';
import {
  Event,
  TrendingUp,
  Notifications,
  School,
  Celebration,
  SportsSoccer,
  MusicNote,
  Science,
  AccessTime,
  LocationOn,
  ArrowForward,
  WbSunny,
  Opacity,
  Cloud,
  Timer
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Interfaces for type safety
interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  icon: React.ReactNode;
  color: string;
}

interface News {
  id: number;
  title: string;
  summary: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Styled components
const LiveFeedContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #fff3e0 0%, #e0f7fa 100%)', // School-friendly gradient
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  maxWidth: '1200px',
  margin: '0 auto', // Center the container
}));

const FeedCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const WeatherCardStyled = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)', // Brighter blue
  color: 'white',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const CountdownCardStyled = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ff7043 0%, #f50057 100%)', // Vibrant red-orange
  color: 'white',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const TickerContainer = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  background: 'rgba(255, 193, 7, 0.1)', // Yellowish tint
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  border: '1px solid rgba(255, 193, 7, 0.2)',
  '&:hover': {
    '& .ticker': {
      animationPlayState: 'paused', // Pause on hover
    },
  },
}));

const TickerText = styled(Typography)(({ theme }) => ({
  display: 'inline-block',
  animation: 'ticker 30s linear infinite',
  '@keyframes ticker': {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(-100%)' },
  },
}));

// Sample data
const upcomingEvents: Event[] = [
  {
    id: 1,
    title: 'Annual Sports Day',
    date: '2025-08-20', // Updated to future date for testing
    time: '09:00 AM',
    location: 'School Grounds',
    category: 'Sports',
    icon: <SportsSoccer />,
    color: '#4caf50',
  },
  {
    id: 2,
    title: 'Music Concert',
    date: '2025-08-25',
    time: '06:00 PM',
    location: 'School Auditorium',
    category: 'Music',
    icon: <MusicNote />,
    color: '#2196f3',
  },
  {
    id: 3,
    title: 'Science Fair',
    date: '2025-08-30',
    time: '10:00 AM',
    location: 'School Hall',
    category: 'Science',
    icon: <Science />,
    color: '#ff9800',
  },
];

const latestNews: News[] = [
  {
    id: 1,
    title: 'New Computer Lab Opening',
    summary: 'Our state-of-the-art computer laboratory is now open for students.',
    category: 'Infrastructure',
    priority: 'high',
    date: '2025-08-10',
  },
  {
    id: 2,
    title: 'Academic Excellence Awards',
    summary: 'Congratulations to our top-performing students for their outstanding achievements.',
    category: 'Academic',
    priority: 'medium',
    date: '2025-08-08',
  },
  {
    id: 3,
    title: 'Community Outreach Program',
    summary: 'Students participate in local community service initiatives.',
    category: 'Community',
    priority: 'low',
    date: '2025-08-05',
  },
];

const announcements = [
  'Parent-teacher meetings scheduled for next week',
  'School library extended hours during exam period',
  'Sports equipment donation drive is now live',
  'Donation drive for school projects is now live. Visit our donate page to contribute.',
  'New after-school programs starting this month',
];

const weatherData = {
  temperature: 22,
  condition: 'Sunny',
  icon: <WbSunny sx={{ fontSize: 32 }} />,
  humidity: 65,
  windSpeed: 12,
};

// Helper function for countdown
const parseEventDateTime = (dateStr: string, timeStr: string) => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const isoDate = `${dateStr}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  return new Date(isoDate).getTime();
};

// Subcomponents
const EventCard = memo(({ event, index, total }: { event: Event; index: number; total: number }) => {
  const theme = useTheme();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <FeedCard>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Event sx={{ color: '#1a237e', mr: 1 }} aria-hidden="true" />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
            Upcoming Events
          </Typography>
        </Box>
        <Fade in key={index} timeout={500}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: event.color, width: 32, height: 32, mr: 1 }}>
                {event.icon}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {event.title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} aria-hidden="true" />
              <Typography variant="body2" color="text.secondary">
                {formatDate(event.date)} at {event.time}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} aria-hidden="true" />
              <Typography variant="body2" color="text.secondary">
                {event.location}
              </Typography>
            </Box>
            <Chip
              label={event.category}
              size="small"
              sx={{ backgroundColor: event.color, color: 'white', fontWeight: 500 }}
            />
          </Box>
        </Fade>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {index + 1} of {total}
          </Typography>
          <IconButton size="small" sx={{ color: '#1a237e' }} aria-label="Next event">
            <ArrowForward />
          </IconButton>
        </Box>
      </CardContent>
    </FeedCard>
  );
});

const NewsCard = memo(({ news, index, total }: { news: News; index: number; total: number }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#2196f3';
    }
  };

  return (
    <FeedCard>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Notifications sx={{ color: '#1a237e', mr: 1 }} aria-hidden="true" />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
            Latest News
          </Typography>
        </Box>
        <Fade in key={index} timeout={500}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {news.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {news.summary}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip
                label={news.category}
                size="small"
                sx={{
                  backgroundColor: getPriorityColor(news.priority),
                  color: 'white',
                  fontWeight: 500,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(news.date)}
              </Typography>
            </Box>
          </Box>
        </Fade>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {index + 1} of {total}
          </Typography>
          <IconButton size="small" sx={{ color: '#1a237e' }} aria-label="Next news">
            <ArrowForward />
          </IconButton>
        </Box>
      </CardContent>
    </FeedCard>
  );
});

const WeatherCard = memo(() => (
  <WeatherCardStyled>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
      {weatherData.icon}
    </Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
      {weatherData.temperature}°C
    </Typography>
    <Typography variant="body1" sx={{ mb: 2 }}>
      {weatherData.condition}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.875rem' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Opacity sx={{ fontSize: 16, mr: 0.5 }} aria-hidden="true" />
        {weatherData.humidity}%
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Cloud sx={{ fontSize: 16, mr: 0.5 }} aria-hidden="true" />
        {weatherData.windSpeed} km/h
      </Box>
    </Box>
  </WeatherCardStyled>
));

const CountdownCardComponent = memo(({ event, countdown }: { event: Event; countdown: Countdown }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate progress (assuming 30 days max for simplicity)
  const maxSeconds = 30 * 24 * 60 * 60;
  const currentSeconds =
    countdown.days * 24 * 60 * 60 +
    countdown.hours * 60 * 60 +
    countdown.minutes * 60 +
    countdown.seconds;
  const progress = (currentSeconds / maxSeconds) * 100;

  return (
    <CountdownCardStyled>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Timer sx={{ fontSize: 32, mr: 1 }} aria-hidden="true" />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Next Event
        </Typography>
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        {event.title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
        {formatDate(event.date)} at {event.time}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {countdown.days}
          </Typography>
          <Typography variant="caption">Days</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {countdown.hours}
          </Typography>
          <Typography variant="caption">Hours</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {countdown.minutes}
          </Typography>
          <Typography variant="caption">Mins</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {countdown.seconds}
          </Typography>
          <Typography variant="caption">Secs</Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 2, px: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' }}
          aria-label="Countdown progress"
        />
      </Box>
      <Chip
        label={event.category}
        size="small"
        sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500, mt: 2 }}
      />
    </CountdownCardStyled>
  );
});

// Main component
const LiveFeed: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const eventInterval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
    }, 5000);

    const newsInterval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % latestNews.length);
    }, 4000);

    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const nextEventTime = parseEventDateTime(upcomingEvents[0].date, upcomingEvents[0].time);
      const distance = nextEventTime - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => {
      clearInterval(eventInterval);
      clearInterval(newsInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <LiveFeedContainer role="region" aria-label="School Live Feed">
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          color: '#1a237e',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TrendingUp sx={{ color: '#ffca28' }} aria-hidden="true" />
        Live School Feed
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive grid
          },
          gap: 3,
          mb: 4,
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        <CountdownCardComponent event={upcomingEvents[0]} countdown={countdown} />
        <WeatherCard />
        <EventCard event={upcomingEvents[currentEventIndex]} index={currentEventIndex} total={upcomingEvents.length} />
        <NewsCard news={latestNews[currentNewsIndex]} index={currentNewsIndex} total={latestNews.length} />
      </Box>

      <FeedCard>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <School sx={{ color: '#1a237e', mr: 1 }} aria-hidden="true" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
              School Announcements
            </Typography>
          </Box>
          <TickerContainer>
            <TickerText variant="body2" className="ticker">
              {announcements.join(' • ')}
            </TickerText>
          </TickerContainer>
          <List dense sx={{ mt: 2 }}>
            {announcements.slice(0, 3).map((announcement, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Celebration sx={{ fontSize: 16, color: '#ffca28' }} aria-hidden="true" />
                </ListItemIcon>
                <ListItemText
                  primary={announcement}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </FeedCard>
    </LiveFeedContainer>
  );
};

export default memo(LiveFeed);
