import React, { useState, useMemo, memo, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Zoom,
  Alert
} from '@mui/material';

import {
  Search as SearchIcon,
  Close as CloseIcon,
  Facebook as FacebookIcon,
  School as SchoolIcon,
  Celebration as CelebrationIcon,
  SportsSoccer as SportsIcon,
  SelfImprovement as SpiritualIcon,
  MusicNote as CulturalIcon,
  People as CommunityIcon,
  FitnessCenter as ExtraMuralIcon,
  BeachAccess as HolidayIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { calendarManager, CalendarEvent, EventCategory } from '../utils/calendarManager';

// =============================
// TypeScript interfaces
// =============================
interface SchoolCalendarProps {
  title?: string;
  subtitle?: string;
}

interface EventCardProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
}

interface EventDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onClose: () => void;
}

// =============================
// Styled components (theme aware)
// =============================
const CalendarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  background: 'linear-gradient(135deg, #fff3e0 0%, #e0f7fa 100%)',
  minHeight: '100vh',
  overflow: 'hidden'
}));

const EventCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: theme.shadows[12],
    borderColor: '#ffca28'
  }
}));

const EventIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  minWidth: 0
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(135deg, #fff3e0 0%, #e0f7fa 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }
}));

// =============================
// Category mapping (icons + colors)
// =============================
const categoryIcons: Record<EventCategory, React.ReactNode> = {
  academic: <SchoolIcon />,
  spiritual: <SpiritualIcon />,
  celebration: <CelebrationIcon />,
  sports: <SportsIcon />,
  cultural: <CulturalIcon />,
  community: <CommunityIcon />,
  'extra-mural': <ExtraMuralIcon />,
  holiday: <HolidayIcon />
};

const categoryColors: Record<EventCategory, 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' | 'default'> = {
  academic: 'primary',
  spiritual: 'secondary',
  celebration: 'success',
  sports: 'warning',
  cultural: 'info',
  community: 'default',
  'extra-mural': 'error',
  holiday: 'default'
};

// =============================
// Event Card Component
// =============================
const EventCardComponent = memo(({ event, onClick }: EventCardProps) => {
  // Format date for readability
  const formatEventDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  return (
    <Zoom in timeout={500}>
      <Box sx={{ minWidth: 0 }}>
        <EventCard 
          onClick={() => onClick(event)}
          role="button"
          tabIndex={0}
          aria-label={`View details for ${event.title}`}
          // Keyboard accessibility: Enter/Space triggers click
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick(event);
            }
          }}
        >
          <CardContent sx={{ p: 2 }}>
            {/* Title + Icon */}
            <EventIconContainer>
              {categoryIcons[event.category]}
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  color: '#1a237e',
                  fontWeight: 600
                }}
              >
                {event.title}
              </Typography>
            </EventIconContainer>

            {/* Date */}
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {formatEventDate(event.date)}
            </Typography>

            {/* Optional description */}
            {event.description && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.4,
                  color: '#666'
                }}
              >
                {event.description}
              </Typography>
            )}

            {/* Category Chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <CategoryChip
                label={event.category}
                color={categoryColors[event.category]}
                size="small"
              />
              {event.isPublicHoliday && (
                <CategoryChip
                  label="Public Holiday"
                  color="error"
                  size="small"
                />
              )}
              {event.gradeLevel && (
                <CategoryChip
                  label={event.gradeLevel}
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>
          </CardContent>
        </EventCard>
      </Box>
    </Zoom>
  );
});

// =============================
// Event Dialog (details modal)
// =============================
const EventDialogComponent = memo(({ event, open, onClose }: EventDialogProps) => {
  const formatEventDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  if (!event) return null;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Slide}
      transitionDuration={300}
      aria-labelledby="event-dialog-title"
      aria-describedby="event-dialog-description"
    >
      <DialogTitle id="event-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Title + Icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {categoryIcons[event.category]}
            <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
              {event.title}
            </Typography>
          </Box>

          {/* Close Button */}
          <IconButton
            onClick={onClose}
            aria-label="Close dialog"
            sx={{ color: '#1a237e' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent id="event-dialog-description">
        {/* Date */}
        <Typography variant="h6" color="primary" gutterBottom>
          {formatEventDate(event.date)}
        </Typography>

        {/* Description */}
        {event.description && (
          <Typography variant="body1" paragraph sx={{ color: '#666' }}>
            {event.description}
          </Typography>
        )}

        {/* Chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <CategoryChip label={event.category} color={categoryColors[event.category]} />
          {event.isPublicHoliday && <CategoryChip label="Public Holiday" color="error" />}
          {event.gradeLevel && (
            <CategoryChip label={event.gradeLevel} variant="outlined" />
          )}
        </Box>

        {/* Optional fields */}
        {event.location && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Location:</strong> {event.location}
          </Typography>
        )}

        {event.time && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Time:</strong> {event.time}
          </Typography>
        )}

        {/* External Link */}
        {event.facebookLink && (
          <Button
            startIcon={<FacebookIcon />}
            href={event.facebookLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            sx={{
              mt: 2,
              borderColor: '#1877f2',
              color: '#1877f2',
              '&:hover': {
                backgroundColor: '#1877f2',
                color: 'white'
              }
            }}
          >
            View on Facebook
          </Button>
        )}
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{ backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#0d47a1' } }}
        >
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
});

// =============================
// Main Calendar Component
// =============================
const SchoolCalendar: React.FC<SchoolCalendarProps> = ({
  title = "School Calendar",
  subtitle = "Term 3 2025 Important Dates"
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // -----------------
  // State Management
  // -----------------
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // -----------------
  // Event Data
  // -----------------
  const allEvents = calendarManager.getUpcomingEvents();

  // Memoized filtering (performance optimization)
  const filteredEvents = useMemo(() => {
    let filtered = allEvents;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.gradeLevel?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [allEvents, selectedCategory, searchQuery]);

  // -----------------
  // Handlers
  // -----------------
  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setSelectedEvent(null);
  }, []);

  // -----------------
  // Render
  // -----------------
  return (
    <CalendarContainer role="main" aria-label="School calendar">
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header Section */}
        <Fade in timeout={500}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                color: '#1a237e',
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              {subtitle}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {filteredEvents.length} upcoming events
            </Typography>
          </Box>
        </Fade>

        {/* Search + Filter Controls */}
        <Slide direction="up" in timeout={600}>
          <SearchContainer>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{
                flexGrow: 1,
                minWidth: 0,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }
              }}
              aria-label="Search events"
            />

            <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value as EventCategory | 'all')}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}
                aria-label="Filter by category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="academic">Academic</MenuItem>
                <MenuItem value="spiritual">Spiritual</MenuItem>
                <MenuItem value="celebration">Celebration</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
                <MenuItem value="cultural">Cultural</MenuItem>
                <MenuItem value="community">Community</MenuItem>
                <MenuItem value="extra-mural">Extra-Mural</MenuItem>
                <MenuItem value="holiday">Holiday</MenuItem>
              </Select>
            </FormControl>
          </SearchContainer>
        </Slide>

        {/* Results Section */}
        <Slide direction="up" in timeout={700}>
          <Box>
            {/* No Results Alert */}
            {filteredEvents.length === 0 && (
              <Fade in timeout={800}>
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  No events found matching your search criteria. Try adjusting your filters.
                </Alert>
              </Fade>
            )}

            {/* Events Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(auto-fill, minmax(300px, 1fr))',
                  md: 'repeat(auto-fill, minmax(350px, 1fr))',
                  lg: 'repeat(auto-fill, minmax(400px, 1fr))'
                },
                gap: 3,
                justifyContent: 'center'
              }}
            >
              {filteredEvents.map((event, index) => (
                <Fade in timeout={800 + index * 100} key={event.id}>
                  <Box>
                    <EventCardComponent 
                      event={event} 
                      onClick={handleEventClick}
                    />
                  </Box>
                </Fade>
              ))}
            </Box>
          </Box>
        </Slide>

        {/* Event Dialog */}
        <EventDialogComponent
          event={selectedEvent}
          open={dialogOpen}
          onClose={handleDialogClose}
        />
      </Container>
    </CalendarContainer>
  );
};

export default memo(SchoolCalendar); 