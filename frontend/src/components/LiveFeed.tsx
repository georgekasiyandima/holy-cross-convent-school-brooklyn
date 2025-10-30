import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Paper,
  useTheme,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Stack,
  Fade,
  Tooltip
} from '@mui/material';
import {
  Event as EventIcon,
  School,
  Celebration,
  SportsSoccer,
  MusicNote,
  Science,
  AccessTime,
  LocationOn,
  Refresh,
  Star,
  Bookmark,
  Share,
  Visibility,
  Search,
  Clear,
  FilterList
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useLiveFeed } from '../hooks/useLiveFeed';
import { LiveFeedItem } from '../services/liveFeedService';

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

const SearchContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  flexWrap: 'wrap'
}));

//---------------------------------------------------------
// HELPER FUNCTIONS
//---------------------------------------------------------
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


//---------------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------------
const LiveFeed: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Use live feed hook for real-time data
  const {
    items,
    upcomingEvents,
    latestNews,
    loading,
    refreshing,
    error,
    refresh,
    search,
    clearSearch,
    isSearching,
    lastUpdated
  } = useLiveFeed({
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
    pageSize: 20,
    enableSearch: true
  });

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await search(query);
    } else {
      clearSearch();
    }
  }, [search, clearSearch]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  // Handle item click
  const handleItemClick = useCallback((item: LiveFeedItem) => {
    if (item.type === 'event') {
      navigate(`/events/${item.id}`);
    } else if (item.type === 'news') {
      navigate(`/news/${item.id}`);
    }
  }, [navigate]);

  // Render loading state
  if (loading && !refreshing) {
    return (
      <LiveFeedContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} />
        </Box>
      </LiveFeedContainer>
    );
  }

  // Render error state
  if (error) {
    return (
      <LiveFeedContainer>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleRefresh} startIcon={<Refresh />}>
          Try Again
        </Button>
      </LiveFeedContainer>
    );
  }

  return (
    <LiveFeedContainer>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
              Live Feed
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Stay updated with the latest school news and events
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Last updated">
              <Typography variant="caption" color="text.secondary">
                {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Never updated'}
              </Typography>
            </Tooltip>
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? <CircularProgress size={20} /> : <Refresh />}
            </IconButton>
          </Box>
        </Box>

        {/* Search Bar */}
        <SearchContainer>
          <TextField
            fullWidth
            placeholder="Search news and events..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {isSearching ? <CircularProgress size={20} /> : <Search />}
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleSearch('')} size="small">
                    <Clear />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ maxWidth: 400 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ minWidth: 120 }}
          >
            Filter
          </Button>
        </SearchContainer>
      </Box>

      {/* Content Grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Main Feed */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(66.666% - 12px)' } }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
              Latest Updates
            </Typography>
            {items.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No updates found. Check back later!
      </Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {items.map((item) => (
                  <Fade in key={item.id} timeout={300}>
                    <FeedCard onClick={() => handleItemClick(item)}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Avatar
        sx={{
                              bgcolor: getCategoryColor(item.category || ''),
                              width: 48,
                              height: 48
                            }}
                          >
                            {getCategoryIcon(item.category || '')}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                                {item.title}
                              </Typography>
                              <Chip
                                label={item.type}
                                size="small"
                                color={item.type === 'event' ? 'primary' : 'secondary'}
                              />
                              {item.priority === 'high' && (
                                <Chip
                                  icon={<Star />}
                                  label="High Priority"
                                  size="small"
                                  color="error"
                                />
                              )}
            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {item.summary || item.content}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTime fontSize="small" color="action" />
                                <Typography variant="caption">
                                  {new Date(item.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                              {item.location && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <LocationOn fontSize="small" color="action" />
                                  <Typography variant="caption">{item.location}</Typography>
                                </Box>
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Chip
                                label={item.category}
                                size="small"
                                sx={{ bgcolor: getCategoryColor(item.category || ''), color: 'white' }}
                              />
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton size="small">
                                  <Bookmark />
                                </IconButton>
                                <IconButton size="small">
                                  <Share />
                                </IconButton>
                                <IconButton size="small">
                                  <Visibility />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                </CardContent>
              </FeedCard>
                  </Fade>
                ))}
              </Stack>
            )}
          </Box>
        </Box>

        {/* Sidebar */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 12px)' } }}>
          <Stack spacing={3}>
            {/* Upcoming Events */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
                Upcoming Events
              </Typography>
              {upcomingEvents.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No upcoming events
                  </Typography>
                </Paper>
              ) : (
                <Stack spacing={2}>
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <Card key={event.id} sx={{ cursor: 'pointer' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Avatar sx={{ bgcolor: getCategoryColor(event.category), width: 32, height: 32 }}>
                            {getCategoryIcon(event.category)}
                          </Avatar>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {event.title}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(event.startDate).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Latest News */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
                Latest News
              </Typography>
              {latestNews.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No news articles
                  </Typography>
                </Paper>
              ) : (
                <Stack spacing={2}>
                  {latestNews.slice(0, 3).map((article) => (
                    <Card key={article.id} sx={{ cursor: 'pointer' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          {article.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
    </LiveFeedContainer>
  );
};

export default LiveFeed;