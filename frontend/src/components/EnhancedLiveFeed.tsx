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
  Stack,
  TextField,
  InputAdornment,
  CircularProgress
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
  Visibility,
  Search,
  Clear
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useLiveFeed } from '../hooks/useLiveFeed';
import { LiveFeedItem } from '../services/liveFeedService';

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
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)',
  maxWidth: '1200px',
  margin: '0 auto',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(26, 35, 126, 0.1)',
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
  border: '1px solid rgba(26, 35, 126, 0.1)',
  borderRadius: theme.spacing(2),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(26, 35, 126, 0.15)',
    borderColor: 'rgba(26, 35, 126, 0.2)',
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
  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
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
  border: '1px solid rgba(255, 193, 7, 0.3)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)',
  }
}));

const NewsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  border: '1px solid rgba(26, 35, 126, 0.1)',
  borderRadius: theme.spacing(2),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(26, 35, 126, 0.15)',
    borderColor: 'rgba(26, 35, 126, 0.2)',
  }
}));

const AnnouncementCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderLeft: '4px solid #1a237e',
  border: '1px solid rgba(26, 35, 126, 0.1)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.1)',
    borderColor: 'rgba(26, 35, 126, 0.2)',
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: '2px solid rgba(26, 35, 126, 0.1)',
}));

//---------------------------------------------------------
// ENHANCED LIVE FEED COMPONENT
//---------------------------------------------------------
const EnhancedLiveFeed: React.FC = memo(() => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [refreshing, setRefreshing] = useState(false);

  // Use live feed hook for real-time data
  const {
    items: liveFeedItems,
    upcomingEvents: apiEvents,
    latestNews: apiNews,
    loading,
    refreshing: isRefreshing,
    error,
    refresh,
    search,
    clearSearch,
    searchQuery,
    isSearching,
    lastUpdated
  } = useLiveFeed({
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
    pageSize: 20,
    enableSearch: true
  });

  // Transform API data to component format
  const upcomingEvents: Event[] = apiEvents.map(event => ({
    id: parseInt(event.id),
    title: event.title,
    date: event.startDate.split('T')[0],
    time: new Date(event.startDate).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    location: event.location || 'TBA',
    category: event.category,
    icon: getCategoryIcon(event.category),
    color: getCategoryColor(event.category),
    description: event.description,
    imageUrl: '/images/default-event.jpg',
    isFeatured: event.category === 'Technology' || event.category === 'Academic'
  }));

  const latestNews: News[] = apiNews.map(article => ({
    id: parseInt(article.id),
    title: article.title,
    summary: article.summary,
    category: article.category,
    priority: article.category === 'Infrastructure' ? 'high' : 'medium',
    date: article.publishedAt.split('T')[0],
    author: article.author.name,
    imageUrl: '/images/default-news.jpg',
    readTime: Math.ceil(article.content.length / 200)
  }));

  // Helper functions for category icons and colors
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology':
      case 'academic':
        return <Science />;
      case 'sports':
        return <SportsSoccer />;
      case 'infrastructure':
        return <School />;
      case 'music':
        return <MusicNote />;
      case 'celebration':
        return <Celebration />;
      default:
        return <EventIcon />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology':
      case 'academic':
        return '#9c27b0';
      case 'sports':
        return '#4caf50';
      case 'infrastructure':
        return '#2196f3';
      case 'music':
        return '#ff9800';
      case 'celebration':
        return '#e91e63';
      default:
        return '#1a237e';
    }
  };

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
    // Use the refresh function from the hook
    await refresh();
    setRefreshing(false);
  }, [refresh]);

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
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
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

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Upcoming Events */}
        <Box sx={{ flex: 1 }}>
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
        </Box>

        {/* Latest News */}
        <Box sx={{ flex: 1 }}>
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
        </Box>

        {/* Countdown to Next Event */}
        {nextEvent && (
          <Box sx={{ flex: 1 }}>
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
        </Box>
        )}

        {/* Announcements */}
        <Box sx={{ flex: 1 }}>
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
        </Box>
      </Box>
    </LiveFeedContainer>
  );
});

EnhancedLiveFeed.displayName = 'EnhancedLiveFeed';

export default EnhancedLiveFeed;
