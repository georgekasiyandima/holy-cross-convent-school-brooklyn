import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Paper,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Stack,
  Fade,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Skeleton
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
  transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(26, 35, 126, 0.1)',
  borderRadius: theme.spacing(2),
  '&:hover': {
    boxShadow: '0 8px 24px rgba(26, 35, 126, 0.15)',
    borderColor: 'rgba(26, 35, 126, 0.2)',
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
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

// Memoized FeedCard component for performance
const FeedCardComponent = React.memo<{
  item: LiveFeedItem;
  onClick: (item: LiveFeedItem) => void;
}>(({ item, onClick }) => {
  const category = item.category || 'general';
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(item);
    }
  };

  return (
    <FeedCard
      role="button"
      tabIndex={0}
      onClick={() => onClick(item)}
      onKeyDown={handleKeyDown}
      aria-label={`View ${item.type}: ${item.title}`}
      data-testid={`feed-item-${item.id || item.title}`}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: getCategoryColor(category),
              width: 40,
              height: 40
            }}
          >
            {getCategoryIcon(category)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                {item.title}
              </Typography>
              <Chip
                label={item.type}
                size="small"
                color={item.type === 'event' ? 'primary' : 'secondary'}
                sx={{ 
                  bgcolor: item.type === 'event' ? '#1a237e' : '#ffd700',
                  color: 'white'
                }}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="caption">
                  {formatRelativeDate(item.date)}
                </Typography>
              </Box>
              {item.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="caption">{item.location}</Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={category}
                size="small"
                sx={{ bgcolor: getCategoryColor(category), color: 'white' }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" aria-label="Bookmark">
                  <Bookmark />
                </IconButton>
                <IconButton size="small" aria-label="Share">
                  <Share />
                </IconButton>
                <IconButton size="small" aria-label="View details">
                  <Visibility />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </FeedCard>
  );
});

//---------------------------------------------------------
// HELPER FUNCTIONS
//---------------------------------------------------------
/**
 * Get category icon with safe fallback
 * @param category - Category string (may be undefined or empty)
 * @returns Icon component
 */
const getCategoryIcon = (category?: string) => {
  const normalizedCategory = (category || 'general').toLowerCase();
  switch (normalizedCategory) {
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

/**
 * Get category color with safe fallback
 * @param category - Category string (may be undefined or empty)
 * @returns Color hex string
 */
const getCategoryColor = (category?: string) => {
  const normalizedCategory = (category || 'general').toLowerCase();
  switch (normalizedCategory) {
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
      return '#6c757d'; // Neutral gray fallback
  }
};

/**
 * Format date to relative time (e.g., "2 hours ago", "Yesterday at 2:30 PM")
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays === 1) {
    return `Yesterday at ${dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return dateObj.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit'
    });
  }
};


//---------------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------------
const LiveFeed: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Memoize filtered items
  const filteredItems = useMemo(() => {
    if (selectedCategories.length === 0) return items;
    return items.filter(item => {
      const category = (item.category || 'general').toLowerCase();
      return selectedCategories.some(selected => selected.toLowerCase() === category);
    });
  }, [items, selectedCategories]);

  // Debounced search handler
  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(async () => {
      if (query.trim()) {
        await search(query);
      } else {
        clearSearch();
      }
    }, 300);
  }, [search, clearSearch]);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  // Handle item click with error handling
  const handleItemClick = useCallback((item: LiveFeedItem) => {
    try {
      if (!item.id) {
        console.warn('Item missing ID:', item);
        return;
      }
      
      if (item.type === 'event') {
        navigate(`/events/${item.id}`);
      } else if (item.type === 'news') {
        navigate(`/news/${item.id}`);
      } else {
        console.warn('Unknown item type:', item.type);
      }
    } catch (err) {
      console.error('Error navigating to item:', err);
      // Optionally show user-friendly error message
    }
  }, [navigate]);

  // Get unique categories for filter
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    items.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    return Array.from(categories).sort();
  }, [items]);

  // Handle filter toggle
  const handleFilterToggle = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  // Render loading state with skeleton
  if (loading && !refreshing) {
    return (
      <LiveFeedContainer>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
        </Box>
        <Stack spacing={2}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={`skeleton-${index}`}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
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
                {lastUpdated ? `Updated ${formatRelativeDate(lastUpdated)}` : 'Never updated'}
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
            onChange={handleSearchChange}
            aria-label="Search news and events"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {(isSearching || refreshing) ? <CircularProgress size={20} /> : <Search />}
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={() => {
                      setSearchQuery('');
                      clearSearch();
                    }} 
                    size="small"
                    aria-label="Clear search"
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ maxWidth: { xs: '100%', sm: 500, md: 600 } }}
            data-testid="search-input"
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ minWidth: 120 }}
            onClick={() => setFilterOpen(true)}
            aria-label="Open filters"
            data-testid="filter-button"
          >
            Filter{selectedCategories.length > 0 && ` (${selectedCategories.length})`}
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
            {filteredItems.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }} data-testid="empty-state">
                <Typography variant="body1" color="text.secondary">
                  {selectedCategories.length > 0 
                    ? 'No items match the selected filters.' 
                    : 'No updates found. Check back later!'}
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={{ xs: 2, md: 3 }} data-testid="feed-items">
                {filteredItems.map((item, index) => (
                  <Fade in key={item.id || `item-${index}`} timeout={300} appear={false}>
                    <FeedCardComponent item={item} onClick={handleItemClick} />
                  </Fade>
                ))}
              </Stack>
            )}
          </Box>
        </Box>

        {/* Sidebar */}
        <Box 
          sx={{ 
            flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 12px)' },
            position: { lg: 'sticky' },
            top: { lg: 20 },
            alignSelf: { lg: 'flex-start' }
          }}
        >
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
                  {upcomingEvents.slice(0, 3).map((event, index) => (
                    <Card 
                      key={event.id || `event-${index}`} 
                      sx={{ cursor: 'pointer' }}
                      data-testid={`upcoming-event-${event.id || index}`}
                    >
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
                  {latestNews.slice(0, 3).map((article, index) => (
                    <Card 
                      key={article.id || `news-${index}`} 
                      sx={{ cursor: 'pointer' }}
                      data-testid={`latest-news-${article.id || index}`}
                    >
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

      {/* Filter Dialog */}
      <Dialog 
        open={filterOpen} 
        onClose={() => setFilterOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="filter-dialog-title"
      >
        <DialogTitle id="filter-dialog-title">Filter by Category</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {availableCategories.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No categories available
              </Typography>
            ) : (
              availableCategories.map((category) => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleFilterToggle(category)}
                    />
                  }
                  label={category}
                />
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilters} disabled={selectedCategories.length === 0}>
            Clear All
          </Button>
          <Button onClick={() => setFilterOpen(false)} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </LiveFeedContainer>
  );
};

export default LiveFeed;