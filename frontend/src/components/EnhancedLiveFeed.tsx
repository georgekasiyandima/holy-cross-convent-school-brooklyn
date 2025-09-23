import React, { useState, useEffect, memo, useRef, useCallback } from 'react';
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
  LinearProgress,
  Grid,
  Button,
  Badge,
  Tooltip,
  Skeleton,
  Alert,
  Stack
} from '@mui/material';
import {
  Event as EventIcon,
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
  Timer,
  Refresh,
  MoreVert,
  Star,
  Bookmark,
  Share,
  Visibility
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

//---------------------------------------------------------
// TYPES & INTERFACES
//---------------------------------------------------------
interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  registrationRequired?: boolean;
  maxAttendees?: number;
  currentAttendees?: number;
}

interface News {
  id: number;
  title: string;
  summary: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
  author?: string;
  imageUrl?: string;
  readTime?: number;
  isBreaking?: boolean;
}

interface Announcement {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  isRead?: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

//---------------------------------------------------------
// STYLED COMPONENTS
//---------------------------------------------------------
const LiveFeedContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #fff3e0 0%, #e0f7fa 100%)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  maxWidth: '1200px',
  margin: '0 auto',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #1a237e 100%)',
  }
}));

const FeedCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 100%)',
  }
}));

const CountdownCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ff7043 0%, #f50057 100%)',
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'pulse 2s infinite',
  }
}));

const NewsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  }
}));

const AnnouncementCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderLeft: '4px solid',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: theme.shadows[4],
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: '2px solid #e0e0e0',
}));

//---------------------------------------------------------
// ENHANCED LIVE FEED COMPONENT
//---------------------------------------------------------
const EnhancedLiveFeed: React.FC = memo(() => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Sample data - in production, this would come from APIs
  const upcomingEvents: Event[] = [
    {
      id: 1,
      title: 'Robotics Program Launch',
      date: '2025-02-15',
      time: '10:00 AM',
      location: 'New Computer Lab',
      category: 'Technology',
      icon: <Science />,
      color: '#9c27b0',
      description: 'Launch of our new robotics program for students',
      imageUrl: '/images/robotics-lab.jpg',
      isFeatured: true,
      registrationRequired: true,
      maxAttendees: 30,
      currentAttendees: 15
    },
    {
      id: 2,
      title: 'Computer Lab Unveiling',
      date: '2025-02-20',
      time: '02:00 PM',
      location: 'Main Building',
      category: 'Infrastructure',
      icon: <School />,
      color: '#2196f3',
      description: 'Official unveiling of our new computer lab',
      imageUrl: '/images/computer-lab.jpg',
      isFeatured: true
    },
    {
      id: 3,
      title: 'Sports Day',
      date: '2025-02-25',
      time: '09:00 AM',
      location: 'Sports Field',
      category: 'Sports',
      icon: <SportsSoccer />,
      color: '#4caf50',
      description: 'Annual sports day with various competitions',
      imageUrl: '/images/sports-day.jpg'
    }
  ];

  const latestNews: News[] = [
    {
      id: 1,
      title: 'New Computer Lab Opens',
      summary: 'State-of-the-art computer lab with latest technology',
      category: 'Infrastructure',
      priority: 'high',
      date: '2025-01-15',
      author: 'Principal',
      imageUrl: '/images/computer-lab.jpg',
      readTime: 3,
      isBreaking: true
    },
    {
      id: 2,
      title: 'Robotics Program Success',
      summary: 'Students excel in robotics competitions',
      category: 'Academic',
      priority: 'medium',
      date: '2025-01-10',
      author: 'Science Department',
      imageUrl: '/images/robotics-success.jpg',
      readTime: 5
    }
  ];

  const announcements: Announcement[] = [
    {
      id: 1,
      title: 'New Robotics Program',
      message: 'Registration is now open for our new robotics program. Limited spots available!',
      type: 'success',
      date: '2025-01-20',
      actionUrl: '/forms',
      actionText: 'Register Now'
    },
    {
      id: 2,
      title: 'Computer Lab Access',
      message: 'The new computer lab is now available for student use during break times.',
      type: 'info',
      date: '2025-01-18'
    }
  ];

  //---------------------------------------------------------
  // COUNTDOWN LOGIC
  //---------------------------------------------------------
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const nextEvent = upcomingEvents[0];

  useEffect(() => {
    const updateCountdown = () => {
      if (!nextEvent) return;
      
      const eventDate = new Date(nextEvent.date + ' ' + nextEvent.time);
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextEvent]);

  //---------------------------------------------------------
  // REFRESH FUNCTIONALITY
  //---------------------------------------------------------
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setRefreshing(false);
  }, []);

  //---------------------------------------------------------
  // EVENT HANDLERS
  //---------------------------------------------------------
  const handleEventClick = (event: Event) => {
    navigate('/events', { state: { event } });
  };

  const handleNewsClick = (news: News) => {
    navigate('/news', { state: { news } });
  };

  const handleAnnouncementClick = (announcement: Announcement) => {
    if (announcement.actionUrl) {
      navigate(announcement.actionUrl);
    }
  };

  //---------------------------------------------------------
  // RENDER FUNCTIONS
  //---------------------------------------------------------
  const renderEventCard = (event: Event) => (
    <FeedCard key={event.id} onClick={() => handleEventClick(event)}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar sx={{ bgcolor: event.color, width: 48, height: 48 }}>
            {event.icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                {event.title}
              </Typography>
              {event.isFeatured && (
                <Chip
                  icon={<Star />}
                  label="Featured"
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {event.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2">{event.date} at {event.time}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body2">{event.location}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Chip
                label={event.category}
                size="small"
                sx={{ bgcolor: event.color, color: 'white' }}
              />
              {event.registrationRequired && (
                <Chip
                  label={`${event.currentAttendees}/${event.maxAttendees} registered`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </FeedCard>
  );

  const renderNewsCard = (news: News) => (
    <NewsCard key={news.id} onClick={() => handleNewsClick(news)}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {news.imageUrl && (
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 1,
                backgroundImage: `url(${news.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0
              }}
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                {news.title}
              </Typography>
              {news.isBreaking && (
                <Chip
                  label="Breaking"
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {news.summary}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={news.category}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                {news.author} • {news.readTime} min read
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </NewsCard>
  );

  const renderAnnouncement = (announcement: Announcement) => (
    <AnnouncementCard
      key={announcement.id}
      onClick={() => handleAnnouncementClick(announcement)}
      sx={{
        borderLeftColor: announcement.type === 'success' ? '#4caf50' :
                       announcement.type === 'warning' ? '#ff9800' :
                       announcement.type === 'error' ? '#f44336' : '#2196f3'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar sx={{ bgcolor: announcement.type === 'success' ? '#4caf50' :
                              announcement.type === 'warning' ? '#ff9800' :
                              announcement.type === 'error' ? '#f44336' : '#2196f3',
                    width: 32, height: 32 }}>
          <Notifications fontSize="small" />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {announcement.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {announcement.message}
          </Typography>
          {announcement.actionText && (
            <Button
              size="small"
              variant="outlined"
              sx={{ mt: 1 }}
            >
              {announcement.actionText}
            </Button>
          )}
        </Box>
      </Box>
    </AnnouncementCard>
  );

  //---------------------------------------------------------
  // MAIN RENDER
  //---------------------------------------------------------
  return (
    <LiveFeedContainer>
      {/* Header */}
      <SectionHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
            Live Feed
          </Typography>
          <Chip
            icon={<TrendingUp />}
            label="Live Updates"
            color="primary"
            variant="outlined"
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
          <Tooltip title="Refresh">
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              size="small"
            >
              <Refresh sx={{ 
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
            </IconButton>
          </Tooltip>
        </Box>
      </SectionHeader>

      <Grid container spacing={3}>
        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
              Upcoming Events
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Don't miss these exciting events
            </Typography>
          </Box>
          <Stack spacing={2}>
            {upcomingEvents.map(renderEventCard)}
          </Stack>
        </Grid>

        {/* Latest News */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
              Latest News
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stay updated with school news
            </Typography>
          </Box>
          <Stack spacing={2}>
            {latestNews.map(renderNewsCard)}
          </Stack>
        </Grid>

        {/* Countdown to Next Event */}
        {nextEvent && (
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
                Countdown to {nextEvent.title}
              </Typography>
            </Box>
            <CountdownCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {countdown.days}
                  </Typography>
                  <Typography variant="caption">Days</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {countdown.hours}
                  </Typography>
                  <Typography variant="caption">Hours</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {countdown.minutes}
                  </Typography>
                  <Typography variant="caption">Minutes</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {countdown.seconds}
                  </Typography>
                  <Typography variant="caption">Seconds</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {nextEvent.date} at {nextEvent.time}
              </Typography>
            </CountdownCard>
          </Grid>
        )}

        {/* Announcements */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
              Announcements
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Important updates and notices
            </Typography>
          </Box>
          <Box>
            {announcements.map(renderAnnouncement)}
          </Box>
        </Grid>
      </Grid>
    </LiveFeedContainer>
  );
});

EnhancedLiveFeed.displayName = 'EnhancedLiveFeed';

export default EnhancedLiveFeed;
