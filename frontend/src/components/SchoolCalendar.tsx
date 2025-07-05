import React, { useState, useMemo } from 'react';
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
  useMediaQuery
} from '@mui/material';

import {
  Search as SearchIcon,
  Close as CloseIcon,
  Event as EventIcon,
  CalendarToday as CalendarIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { calendarManager, CalendarEvent, EventCategory } from '../utils/calendarManager';

// Styled components
const CalendarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  backgroundColor: '#f8f9fa'
}));

const EventCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}));

const EventIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}));

interface SchoolCalendarProps {
  title?: string;
  subtitle?: string;
}

const SchoolCalendar: React.FC<SchoolCalendarProps> = ({
  title = "School Calendar",
  subtitle = "Term 3 2025 Important Dates"
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get all events
  const allEvents = calendarManager.getUpcomingEvents();

  // Filter events based on search and category
  const filteredEvents = useMemo(() => {
    let filtered = allEvents;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.gradeLevel?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [allEvents, selectedCategory, searchQuery]);

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  // Get category icon
  const getCategoryIcon = (category: EventCategory) => {
    switch (category) {
      case 'academic':
        return <CalendarIcon />;
      case 'spiritual':
        return <EventIcon />;
      case 'celebration':
        return <CalendarIcon />;
      case 'sports':
        return <CalendarIcon />;
      default:
        return <EventIcon />;
    }
  };

  // Get category color
  const getCategoryColor = (category: EventCategory) => {
    switch (category) {
      case 'academic':
        return 'primary';
      case 'spiritual':
        return 'secondary';
      case 'celebration':
        return 'success';
      case 'sports':
        return 'warning';
      case 'cultural':
        return 'info';
      case 'community':
        return 'default';
      case 'extra-mural':
        return 'error';
      case 'holiday':
        return 'default';
      default:
        return 'default';
    }
  };

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <CalendarContainer>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#1a237e', fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {filteredEvents.length} upcoming events
          </Typography>
        </Box>

        {/* Search and Filter Controls */}
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
            sx={{ flexGrow: 1 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value as EventCategory | 'all')}
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

        {/* Events Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3 
        }}>
          {filteredEvents.map((event) => (
            <Box key={event.id}>
              <EventCard onClick={() => handleEventClick(event)}>
                <CardContent>
                  <EventIconContainer>
                    {getCategoryIcon(event.category)}
                    <Typography variant="h6" component="h3" noWrap>
                      {event.title}
                    </Typography>
                  </EventIconContainer>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formatEventDate(event.date)}
                  </Typography>
                  
                  {event.description && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {event.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <CategoryChip
                      label={event.category}
                      color={getCategoryColor(event.category)}
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
          ))}
        </Box>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No events found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}

        {/* Event Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedEvent && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getCategoryIcon(selectedEvent.category)}
                  {selectedEvent.title}
                </Box>
              </DialogTitle>
              <DialogContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {formatEventDate(selectedEvent.date)}
                </Typography>
                
                {selectedEvent.description && (
                  <Typography variant="body1" paragraph>
                    {selectedEvent.description}
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <CategoryChip
                    label={selectedEvent.category}
                    color={getCategoryColor(selectedEvent.category)}
                  />
                  {selectedEvent.isPublicHoliday && (
                    <CategoryChip
                      label="Public Holiday"
                      color="error"
                    />
                  )}
                  {selectedEvent.gradeLevel && (
                    <CategoryChip
                      label={selectedEvent.gradeLevel}
                      variant="outlined"
                    />
                  )}
                </Box>
                
                {selectedEvent.location && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Location:</strong> {selectedEvent.location}
                  </Typography>
                )}
                
                {selectedEvent.time && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Time:</strong> {selectedEvent.time}
                  </Typography>
                )}
                
                {selectedEvent.facebookLink && (
                  <Button
                    startIcon={<FacebookIcon />}
                    href={selectedEvent.facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 2 }}
                  >
                    View on Facebook
                  </Button>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </CalendarContainer>
  );
};

export default SchoolCalendar; 