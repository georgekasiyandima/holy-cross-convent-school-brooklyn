import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
  Avatar,
  Paper,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Event,
  School,
  SportsSoccer,
  Celebration,
  Quiz,
  Groups,
  LocationOn,
  AccessTime,
  ViewModule,
  ViewWeek,
  ViewDay,
  Refresh
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useCalendar } from '../hooks/useCalendar';
import { CalendarEvent } from '../services/calendarService';

//---------------------------------------------------------
// STYLED COMPONENTS
//---------------------------------------------------------
const CalendarContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)',
  maxWidth: '1200px',
  margin: '0 auto',
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

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: '2px solid rgba(26, 35, 126, 0.1)',
}));

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

const CalendarDay = styled(Paper)<{ isToday?: boolean; isCurrentMonth?: boolean; isWeekend?: boolean }>(({ theme, isToday, isCurrentMonth, isWeekend }) => ({
  minHeight: '120px',
  padding: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: isToday ? '2px solid #1a237e' : '1px solid rgba(26, 35, 126, 0.1)',
  backgroundColor: isToday ? 'rgba(26, 35, 126, 0.05)' : 'white',
  opacity: isCurrentMonth ? 1 : 0.5,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.15)',
  },
  '&.weekend': {
    backgroundColor: isWeekend ? 'rgba(26, 35, 126, 0.02)' : 'white',
  }
}));

const EventChip = styled(Chip)(({ theme }) => ({
  margin: '2px',
  fontSize: '0.75rem',
  height: '20px',
  '& .MuiChip-label': {
    padding: '0 8px',
  }
}));

//---------------------------------------------------------
// HELPER FUNCTIONS
//---------------------------------------------------------
const getEventIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'academic':
      return <School />;
    case 'sports':
      return <SportsSoccer />;
    case 'cultural':
      return <Celebration />;
    case 'exam':
      return <Quiz />;
    case 'meeting':
      return <Groups />;
    default:
      return <Event />;
  }
};

const getEventColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'academic':
      return '#2196f3';
    case 'sports':
      return '#4caf50';
    case 'cultural':
      return '#9c27b0';
    case 'holiday':
      return '#ff9800';
    case 'exam':
      return '#f44336';
    case 'meeting':
      return '#607d8b';
    default:
      return '#1a237e';
  }
};

const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
    year: 'numeric',
      month: 'long',
    day: 'numeric'
  });
};

//---------------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------------
const SchoolCalendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

  // Use calendar hook
  const {
    currentMonth,
    todayEvents,
    upcomingEvents,
    loading,
    error,
    viewType,
    changeView,
    refresh,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    getEventsForDate
  } = useCalendar({
    autoRefresh: true,
    refreshInterval: 60000, // 1 minute
    initialView: 'month'
  });

  // Handle date selection
  const handleDateClick = useCallback((date: Date) => {
    const events = getEventsForDate(date);
    if (events.length > 0) {
      setSelectedEvent(events[0]);
      setShowEventDialog(true);
    }
  }, [getEventsForDate]);

  // Handle event click
  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  }, []);

  // Handle view change
  const handleViewChange = useCallback((view: 'month' | 'week' | 'day') => {
    changeView(view);
  }, [changeView]);

  // Use all upcoming events
  const filteredEvents = upcomingEvents;

  // Get month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading && !currentMonth) {
  return (
      <CalendarContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} />
        </Box>
      </CalendarContainer>
    );
  }

  if (error) {
    return (
      <CalendarContainer>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={refresh} startIcon={<Refresh />}>
          Try Again
        </Button>
      </CalendarContainer>
    );
  }

  return (
    <CalendarContainer>
      {/* Header */}
      <CalendarHeader>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
            School Calendar
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {currentMonth && `${monthNames[currentMonth.month]} ${currentMonth.year}`}
            </Typography>
          </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant={viewType === 'month' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleViewChange('month')}
              startIcon={<ViewModule />}
            >
              Month
            </Button>
            <Button
              variant={viewType === 'week' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleViewChange('week')}
              startIcon={<ViewWeek />}
            >
              Week
            </Button>
            <Button
              variant={viewType === 'day' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleViewChange('day')}
              startIcon={<ViewDay />}
            >
              Day
            </Button>
          </Stack>
          <IconButton onClick={refresh}>
            <Refresh />
          </IconButton>
        </Box>
      </CalendarHeader>

      {/* Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={goToPreviousMonth}>
            <ChevronLeft />
          </IconButton>
          <Button
            variant="outlined"
            startIcon={<Today />}
            onClick={goToToday}
          >
            Today
          </Button>
          <IconButton onClick={goToNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {currentMonth && `${monthNames[currentMonth.month]} ${currentMonth.year}`}
        </Typography>
      </Box>

      {/* Calendar Grid */}
      {currentMonth && (
        <Box>
          {/* Week day headers */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1 }}>
            {weekDays.map((day) => (
              <Box key={day} sx={{ textAlign: 'center', py: 1, fontWeight: 600, color: '#1a237e' }}>
                {day}
              </Box>
            ))}
          </Box>

          {/* Calendar days */}
          <CalendarGrid>
            {currentMonth.days.map((day, index) => (
              <Fade in key={index} timeout={300}>
                <CalendarDay
                  isToday={day.isToday}
                  isCurrentMonth={day.isCurrentMonth}
                  isWeekend={day.isWeekend}
                  className={day.isWeekend ? 'weekend' : ''}
                  onClick={() => handleDateClick(day.date)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography 
                      variant="body2"
              sx={{ 
                        fontWeight: day.isToday ? 700 : 500,
                        color: day.isToday ? '#1a237e' : 'text.primary'
              }}
            >
                      {day.date.getDate()}
            </Typography>
                    {day.events.length > 0 && (
                      <Chip
                        label={day.events.length}
                        size="small"
                        color="primary"
                        sx={{ height: '16px', fontSize: '0.7rem' }}
                      />
                    )}
          </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {day.events.slice(0, 2).map((event) => (
                      <EventChip
                        key={event.id}
                        label={event.title}
                        size="small"
              sx={{
                          bgcolor: getEventColor(event.category),
                          color: 'white',
                          fontSize: '0.7rem',
                          height: '18px',
                          '&:hover': {
                            bgcolor: getEventColor(event.category),
                            opacity: 0.8
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      />
                    ))}
                    {day.events.length > 2 && (
                      <Typography variant="caption" color="text.secondary">
                        +{day.events.length - 2} more
                      </Typography>
                    )}
                  </Box>
                </CalendarDay>
              </Fade>
            ))}
          </CalendarGrid>
        </Box>
      )}

      {/* Upcoming Events Sidebar */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
          Upcoming Events
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8} {...({ item: true } as any)}>
            <Stack spacing={2}>
              {filteredEvents.slice(0, 5).map((event) => (
                <Card key={event.id} sx={{ cursor: 'pointer' }} onClick={() => handleEventClick(event)}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: getEventColor(event.category), width: 40, height: 40 }}>
                        {getEventIcon(event.type)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {event.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="caption">
                            {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                        {event.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="caption">{event.location}</Typography>
                          </Box>
                        )}
                      </Box>
                      <Chip
                        label={event.category}
                        size="small"
                        sx={{ bgcolor: getEventColor(event.category), color: 'white' }}
                    />
                  </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={4} {...({ item: true } as any)}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Today's Events
              </Typography>
              {todayEvents.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No events today
                </Typography>
              ) : (
                <List dense>
                  {todayEvents.map((event) => (
                    <ListItem key={event.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: getEventColor(event.category), width: 24, height: 24 }}>
                          {getEventIcon(event.type)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={event.title}
                        secondary={new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onClose={() => setShowEventDialog(false)} maxWidth="sm" fullWidth>
        {selectedEvent && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: getEventColor(selectedEvent.category) }}>
                  {getEventIcon(selectedEvent.type)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedEvent.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(new Date(selectedEvent.startDate))}
                  </Typography>
            </Box>
          </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedEvent.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2">
                    {new Date(selectedEvent.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {selectedEvent.endDate && ` - ${new Date(selectedEvent.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </Typography>
                </Box>
                {selectedEvent.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{selectedEvent.location}</Typography>
                  </Box>
                )}
                <Chip
                  label={selectedEvent.category}
                  sx={{ bgcolor: getEventColor(selectedEvent.category), color: 'white' }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowEventDialog(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </CalendarContainer>
  );
};

export default SchoolCalendar;