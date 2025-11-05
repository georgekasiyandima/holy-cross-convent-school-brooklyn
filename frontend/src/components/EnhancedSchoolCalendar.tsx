import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  useTheme
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
  Refresh,
  CalendarToday,
  FilterList,
  Download,
  PictureAsPdf,
  TableChart,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import EnhancedCalendarService, { CalendarEvent, Term, CalendarMonth } from '../services/enhancedCalendarService';

//---------------------------------------------------------
// STYLED COMPONENTS
//---------------------------------------------------------
const CalendarContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  margin: '0 auto',
  padding: theme.spacing(2),
  backgroundColor: '#f8f9fa',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  boxSizing: 'border-box',
}));

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: '#1a237e',
  color: 'white',
  borderRadius: theme.spacing(1),
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(2),
  width: '100%',
  overflow: 'hidden',
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(0.25),
  },
}));

const DayHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  fontWeight: 600,
  color: '#1a237e',
  backgroundColor: '#e3f2fd',
  borderRadius: theme.spacing(0.5),
}));

const DayCell = styled(Paper)<{ isCurrentMonth: boolean; isToday: boolean; isWeekend: boolean }>(({ theme, isCurrentMonth, isToday, isWeekend }) => ({
  minHeight: '120px',
  padding: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: isToday ? '#e8f5e8' : isWeekend ? '#f5f5f5' : 'white',
  border: isToday ? '2px solid #4caf50' : '1px solid #e0e0e0',
  opacity: isCurrentMonth ? 1 : 0.5,
  overflow: 'hidden',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    backgroundColor: '#e3f2fd',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  [theme.breakpoints.down('md')]: {
    minHeight: '100px',
    padding: theme.spacing(0.75),
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '80px',
    padding: theme.spacing(0.5),
    fontSize: '0.75rem',
  },
}));

const EventChip = styled(Chip)<{ category: string }>(({ theme, category }) => ({
  margin: '2px',
  fontSize: '0.75rem',
  height: '20px',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const EventDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    maxWidth: '600px',
  },
}));

//---------------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------------
const EnhancedSchoolCalendar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [activeTerm, setActiveTerm] = useState<Term | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState<null | HTMLElement>(null);

  const calendarService = EnhancedCalendarService;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const [eventsData, activeTermData] = await Promise.all([
        calendarService.getEventsByMonth(year, month),
        calendarService.getActiveTerm()
      ]);

      setEvents(eventsData);
      setActiveTerm(activeTermData);
    } catch (err) {
      setError('Failed to load calendar data');
      console.error('Error loading calendar data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDate, calendarService]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleRefresh = () => {
    loadData();
  };

  const getFilteredEvents = () => {
    return events.filter(event => {
      if (filterCategory !== 'all' && event.category !== filterCategory) {
        return false;
      }
      if (filterGrade !== 'all' && event.grade !== filterGrade && event.grade !== 'all') {
        return false;
      }
      return true;
    });
  };

  const generateCalendarMonth = (): CalendarMonth => {
    return calendarService.generateCalendarMonth(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      getFilteredEvents()
    );
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'SPORTS_DAY': return <SportsSoccer />;
      case 'CULTURAL_DAY': return <Celebration />;
      case 'EXAM': return <Quiz />;
      case 'PARENT_MEETING': return <Groups />;
      case 'TERM_START':
      case 'TERM_END': return <School />;
      default: return <Event />;
    }
  };

  const getEventColor = (category?: string) => {
    if (!category) return '#757575';
    return calendarService.getEventColor(category);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long'
    });
  };

  const formatEventDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-ZA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      return `${start.toLocaleDateString('en-ZA')} - ${end.toLocaleDateString('en-ZA')}`;
    }
  };

  // Download functions
  const downloadAsCSV = () => {
    const filteredEvents = getFilteredEvents();
    const csvHeader = 'Title,Date,Start Date,End Date,Category,Type,Location,Grade,Description\n';
    const csvRows = filteredEvents.map(event => {
      const startDate = new Date(event.startDate).toLocaleDateString('en-ZA');
      const endDate = new Date(event.endDate).toLocaleDateString('en-ZA');
      const date = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
      return `"${event.title}","${date}","${startDate}","${endDate}","${event.category || ''}","${event.type}","${event.location || ''}","${event.grade}","${(event.description || '').replace(/"/g, '""')}"`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `calendar-${formatDate(currentDate).replace(/\s+/g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadMenuAnchor(null);
  };

  const downloadAsICS = () => {
    const filteredEvents = getFilteredEvents();
    let icsContent = 'BEGIN:VCALENDAR\n';
    icsContent += 'VERSION:2.0\n';
    icsContent += 'PRODID:-//Holy Cross Convent School//Calendar//EN\n';
    icsContent += 'CALSCALE:GREGORIAN\n';
    icsContent += 'METHOD:PUBLISH\n';

    filteredEvents.forEach(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      // Format dates for ICS (YYYYMMDDTHHmmss)
      const formatICSDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      icsContent += 'BEGIN:VEVENT\n';
      icsContent += `UID:${event.id}@holycrossbrooklyn.co.za\n`;
      icsContent += `DTSTART:${formatICSDate(startDate)}\n`;
      icsContent += `DTEND:${formatICSDate(endDate)}\n`;
      icsContent += `SUMMARY:${event.title}\n`;
      if (event.description) {
        icsContent += `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}\n`;
      }
      if (event.location) {
        icsContent += `LOCATION:${event.location}\n`;
      }
      icsContent += `CATEGORIES:${event.category || 'GENERAL'}\n`;
      icsContent += 'END:VEVENT\n';
    });

    icsContent += 'END:VCALENDAR\n';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `calendar-${formatDate(currentDate).replace(/\s+/g, '-')}.ics`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadMenuAnchor(null);
  };

  const downloadAsPDF = () => {
    // For PDF, we'll create a simple HTML table and use browser print
    const filteredEvents = getFilteredEvents();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>School Calendar - ${formatDate(currentDate)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1a237e; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #1a237e; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>Holy Cross Convent School Calendar</h1>
          <h2>${formatDate(currentDate)}</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Location</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              ${filteredEvents.map(event => {
                const startDate = new Date(event.startDate);
                const endDate = new Date(event.endDate);
                const date = startDate.toDateString() === endDate.toDateString() 
                  ? startDate.toLocaleDateString('en-ZA')
                  : `${startDate.toLocaleDateString('en-ZA')} - ${endDate.toLocaleDateString('en-ZA')}`;
                return `
                  <tr>
                    <td>${date}</td>
                    <td>${event.title}</td>
                    <td>${event.category || 'N/A'}</td>
                    <td>${event.type.replace('_', ' ')}</td>
                    <td>${event.location || 'N/A'}</td>
                    <td>${event.grade}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
    setDownloadMenuAnchor(null);
  };

  const handleDownloadClick = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadMenuAnchor(event.currentTarget);
  };

  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchor(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  const calendarMonth = generateCalendarMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const categories = ['all', 'academic', 'spiritual', 'cultural', 'sports', 'community'];
  const grades = ['all', '0', '1', '2', '3', '4', '5', '6', '7'];

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 }, py: 2 }}>
      <CalendarContainer>
        <CalendarHeader>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <CalendarToday />
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
              School Calendar
            </Typography>
            {activeTerm && (
              <Chip 
                label={`${activeTerm.name} ${activeTerm.year}`} 
                color="secondary" 
                size="small"
              />
            )}
          </Box>
          
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <IconButton onClick={handleRefresh} color="inherit" size={isMobile ? "small" : "medium"}>
              <Refresh />
            </IconButton>
            <IconButton onClick={() => setShowFilters(!showFilters)} color="inherit" size={isMobile ? "small" : "medium"}>
              <FilterList />
            </IconButton>
            <Button
              onClick={handleDownloadClick}
              startIcon={<Download />}
              color="inherit"
              size={isMobile ? "small" : "medium"}
              sx={{ minWidth: 'auto' }}
            >
              {!isMobile && 'Download'}
            </Button>
            <Menu
              anchorEl={downloadMenuAnchor}
              open={Boolean(downloadMenuAnchor)}
              onClose={handleDownloadMenuClose}
            >
              <MenuItem onClick={downloadAsPDF}>
                <ListItemIcon>
                  <PictureAsPdf fontSize="small" />
                </ListItemIcon>
                <ListItemText>Download as PDF</ListItemText>
              </MenuItem>
              <MenuItem onClick={downloadAsCSV}>
                <ListItemIcon>
                  <TableChart fontSize="small" />
                </ListItemIcon>
                <ListItemText>Download as CSV/Excel</ListItemText>
              </MenuItem>
              <MenuItem onClick={downloadAsICS}>
                <ListItemIcon>
                  <CalendarMonthIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Download as iCalendar (.ics)</ListItemText>
              </MenuItem>
            </Menu>
            <IconButton onClick={handlePreviousMonth} color="inherit" size={isMobile ? "small" : "medium"}>
              <ChevronLeft />
            </IconButton>
            <Button onClick={handleToday} startIcon={<Today />} color="inherit" size={isMobile ? "small" : "medium"}>
              {!isMobile && 'Today'}
            </Button>
            <IconButton onClick={handleNextMonth} color="inherit" size={isMobile ? "small" : "medium"}>
              <ChevronRight />
            </IconButton>
          </Box>
        </CalendarHeader>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {showFilters && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Filters</Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Category</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {categories.map(category => (
                    <Chip
                      key={category}
                      label={category === 'all' ? 'All Categories' : category}
                      onClick={() => setFilterCategory(category)}
                      color={filterCategory === category ? 'primary' : 'default'}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Grade</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {grades.map(grade => (
                    <Chip
                      key={grade}
                      label={grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                      onClick={() => setFilterGrade(grade)}
                      color={filterGrade === grade ? 'primary' : 'default'}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <Typography variant="h4" textAlign="center" gutterBottom sx={{ color: '#1a237e', mb: 3 }}>
        {formatDate(currentDate)}
      </Typography>

      <CalendarGrid>
        {weekDays.map(day => (
          <DayHeader key={day}>
            <Typography variant="subtitle2">{day}</Typography>
          </DayHeader>
        ))}
      </CalendarGrid>

      <CalendarGrid>
        {calendarMonth.days.map((day, index) => (
          <DayCell
            key={index}
            isCurrentMonth={day.isCurrentMonth}
            isToday={day.isToday}
            isWeekend={day.isWeekend}
            elevation={day.isToday ? 3 : 1}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography 
                variant="body2" 
                fontWeight={day.isToday ? 'bold' : 'normal'}
                color={day.isToday ? 'primary' : 'text.primary'}
              >
                {day.date.getDate()}
              </Typography>
              {day.events.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {day.events.length}
                </Typography>
              )}
            </Box>
            
            <Box>
              {day.events.slice(0, 3).map((event, eventIndex) => (
                <EventChip
                  key={eventIndex}
                  label={event.title}
                  size="small"
                  category={event.category || 'other'}
                  onClick={() => handleEventClick(event)}
                  sx={{
                    backgroundColor: getEventColor(event.category),
                    fontSize: '0.7rem',
                    height: '18px',
                    margin: '1px',
                    '&:hover': {
                      backgroundColor: getEventColor(event.category),
                      opacity: 0.8,
                    },
                  }}
                />
              ))}
              {day.events.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  +{day.events.length - 3} more
                </Typography>
              )}
            </Box>
          </DayCell>
        ))}
      </CalendarGrid>

      {/* Event Details Dialog */}
      <EventDialog
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={1}>
                {getEventIcon(selectedEvent.type)}
                <Typography variant="h6">{selectedEvent.title}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1">
                    {formatEventDate(selectedEvent.startDate, selectedEvent.endDate)}
                  </Typography>
                  {selectedEvent.time && (
                    <Typography variant="body2" color="text.secondary">
                      <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                      {selectedEvent.time}
                    </Typography>
                  )}
                </Box>

                {selectedEvent.description && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">{selectedEvent.description}</Typography>
                  </Box>
                )}

                {selectedEvent.location && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                      {selectedEvent.location}
                    </Typography>
                  </Box>
                )}

                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip 
                    label={selectedEvent.type.replace('_', ' ')} 
                    size="small" 
                    color="primary"
                  />
                  {selectedEvent.category && (
                    <Chip 
                      label={selectedEvent.category} 
                      size="small" 
                      color="secondary"
                    />
                  )}
                  <Chip 
                    label={`Grade ${selectedEvent.grade}`} 
                    size="small" 
                    variant="outlined"
                  />
                  {selectedEvent.isHoliday && (
                    <Chip label="Holiday" size="small" color="error" />
                  )}
                  {selectedEvent.isExam && (
                    <Chip label="Exam" size="small" color="warning" />
                  )}
                  {selectedEvent.isPublicHoliday && (
                    <Chip label="Public Holiday" size="small" color="info" />
                  )}
                </Box>

                {selectedEvent.facebookLink && (
                  <Box>
                    <Button
                      variant="outlined"
                      href={selectedEvent.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      View on Facebook
                    </Button>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </EventDialog>
      </CalendarContainer>
    </Container>
  );
};

export default EnhancedSchoolCalendar;
