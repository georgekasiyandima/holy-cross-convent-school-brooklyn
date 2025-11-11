import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Stack,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import {
  Add,
  Edit,
  Delete,
  CalendarToday,
  Event,
  School,
  Sports,
  TheaterComedy,
  Group,
  Save,
  Timeline as TimelineIcon,
  Upcoming,
  Today
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SEO from '../components/SEO';
import AdminLayout from '../components/AdminLayout';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: string;
  isHoliday: boolean;
  isExam: boolean;
  isPublicHoliday: boolean;
  grade: string;
  category?: string;
  location?: string;
  time?: string;
  facebookLink?: string;
  termId?: string;
}

interface Term {
  id: string;
  year: number;
  termNumber: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description?: string;
}

const CalendarManagement: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Dialog states
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [termDialogOpen, setTermDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      setError('Please log in to access calendar management.');
      return;
    }
    
    // Check if user has admin token
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setError('Admin access required. Please log in with admin credentials.');
      return;
    }
  }, [isAuthenticated]);

  // Form states
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    type: 'OTHER',
    isHoliday: false,
    isExam: false,
    isPublicHoliday: false,
    grade: 'all',
    category: '',
    location: '',
    time: '',
    facebookLink: '',
    termId: ''
  });

  const [termForm, setTermForm] = useState({
    year: new Date().getFullYear(),
    termNumber: 1,
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    description: ''
  });

  const eventTypes = [
    'TERM_START',
    'TERM_END',
    'HOLIDAY',
    'EXAM',
    'SPORTS_DAY',
    'CULTURAL_DAY',
    'PARENT_MEETING',
    'OTHER'
  ];

  const categories = [
    'academic',
    'spiritual',
    'cultural',
    'sports',
    'community'
  ];

  const grades = [
    'all',
    '0', '1', '2', '3', '4', '5', '6', '7'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Use unified school-hub endpoint
      const [eventsRes, termsRes] = await Promise.all([
        fetch(`${apiUrl}/api/school-hub/events`),
        fetch(`${apiUrl}/api/calendar/terms`)
      ]);

      if (!eventsRes.ok || !termsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const eventsResponse = await eventsRes.json();
      const termsData = await termsRes.json();

      // Transform unified events format to CalendarEvent format
      let eventsData: CalendarEvent[] = [];
      if (eventsResponse.success && eventsResponse.data) {
        eventsData = eventsResponse.data
          .filter((event: any) => event.source === 'academic') // Only show academic calendar events in management
          .map((event: any) => ({
            id: event.id,
            title: event.title,
            description: event.description || '',
            startDate: new Date(event.startDate).toISOString(),
            endDate: event.endDate ? new Date(event.endDate).toISOString() : new Date(event.startDate).toISOString(),
            type: event.type || 'OTHER',
            isHoliday: event.isHoliday || false,
            isExam: event.isExam || false,
            isPublicHoliday: event.isPublicHoliday || false,
            grade: event.grade || 'all',
            category: event.category || 'academic',
            location: event.location || '',
            time: event.time || '',
            facebookLink: event.facebookLink || '',
            termId: event.termId
          }));
      } else if (Array.isArray(eventsResponse)) {
        // Fallback to old format
        eventsData = eventsResponse;
      }

      setEvents(eventsData);
      setTerms(termsData);
    } catch (err) {
      setError('Failed to load calendar data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem('adminToken');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Use unified school-hub endpoint
      const url = editingEvent 
        ? `${apiUrl}/api/school-hub/events/${editingEvent.id}`
        : `${apiUrl}/api/school-hub/events`;
      
      const method = editingEvent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          ...eventForm,
          startDate: eventForm.startDate.toISOString(),
          endDate: eventForm.endDate.toISOString(),
          eventType: 'academic' // Specify we're creating academic calendar events
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save event');
      }

      setSuccess(editingEvent ? 'Event updated successfully' : 'Event created successfully');
      setEventDialogOpen(false);
      resetEventForm();
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event');
      console.error('Error saving event:', err);
    }
  };

  const handleTermSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTerm 
        ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/calendar/terms/${editingTerm.id}`
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/calendar/terms`;
      
      const method = editingTerm ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          ...termForm,
          startDate: termForm.startDate.toISOString(),
          endDate: termForm.endDate.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save term');
      }

      setSuccess(editingTerm ? 'Term updated successfully' : 'Term created successfully');
      setTermDialogOpen(false);
      resetTermForm();
      fetchData();
    } catch (err) {
      setError('Failed to save term');
      console.error('Error saving term:', err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      // Use unified school-hub endpoint
      const response = await fetch(`${apiUrl}/api/school-hub/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete event');
      }

      setSuccess('Event deleted successfully');
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      console.error('Error deleting event:', err);
    }
  };

  const handleActivateTerm = async (id: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/calendar/terms/${id}/activate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to activate term');
      }

      setSuccess('Term activated successfully');
      fetchData();
    } catch (err) {
      setError('Failed to activate term');
      console.error('Error activating term:', err);
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      type: 'OTHER',
      isHoliday: false,
      isExam: false,
      isPublicHoliday: false,
      grade: 'all',
      category: '',
      location: '',
      time: '',
      facebookLink: '',
      termId: ''
    });
    setEditingEvent(null);
  };

  const resetTermForm = () => {
    setTermForm({
      year: new Date().getFullYear(),
      termNumber: 1,
      name: '',
      startDate: new Date(),
      endDate: new Date(),
      description: ''
    });
    setEditingTerm(null);
  };

  const openEventDialog = (event?: CalendarEvent) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title,
        description: event.description || '',
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        type: event.type,
        isHoliday: event.isHoliday,
        isExam: event.isExam,
        isPublicHoliday: event.isPublicHoliday,
        grade: event.grade,
        category: event.category || '',
        location: event.location || '',
        time: event.time || '',
        facebookLink: event.facebookLink || '',
        termId: event.termId || ''
      });
    } else {
      resetEventForm();
    }
    setEventDialogOpen(true);
  };

  const openTermDialog = (term?: Term) => {
    if (term) {
      setEditingTerm(term);
      setTermForm({
        year: term.year,
        termNumber: term.termNumber,
        name: term.name,
        startDate: new Date(term.startDate),
        endDate: new Date(term.endDate),
        description: term.description || ''
      });
    } else {
      resetTermForm();
    }
    setTermDialogOpen(true);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'SPORTS_DAY': return <Sports />;
      case 'CULTURAL_DAY': return <TheaterComedy />;
      case 'PARENT_MEETING': return <Group />;
      case 'EXAM': return <School />;
      default: return <Event />;
    }
  };

  const getEventColor = (category: string) => {
    switch (category) {
      case 'academic': return 'primary';
      case 'spiritual': return 'secondary';
      case 'cultural': return 'success';
      case 'sports': return 'warning';
      case 'community': return 'info';
      default: return 'default';
    }
  };

  const upcomingCount = useMemo(() => {
    const today = new Date();
    return events.filter((event) => new Date(event.startDate) >= today).length;
  }, [events]);

  const activeTerm = useMemo(() => terms.find((term) => term.isActive), [terms]);

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" gutterBottom color="error">
              Authentication Required
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Please log in with admin credentials to access calendar management.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.href = '/admin/login'}
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Box>
        </Container>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#1a237e', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading calendar management...
          </Typography>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SEO
          title="Calendar Management - Holy Cross Convent School"
          description="Manage school calendar events and terms"
        />

        <Box
          sx={{
            background: 'linear-gradient(135deg,#1a237e 0%,#3949ab 60%,#5c6bc0 100%)',
            color: '#fff',
            py: { xs: 6, md: 8 },
            borderBottomLeftRadius: { xs: 0, md: 32 },
            borderBottomRightRadius: { xs: 0, md: 32 },
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Calendar Management
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 680 }}>
              Coordinate events, terms, and school-wide schedules in one connected hub.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, mt: { md: -6 } }}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,#42a5f5,#1a237e)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <TimelineIcon />
                  </Box>
                  <Box>
                    <Typography variant="overline" sx={{ color: '#64748b' }}>
                      Total Events
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
                      {events.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      Managed across all grades
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,#66bb6a,#1b5e20)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <Upcoming />
                  </Box>
                  <Box>
                    <Typography variant="overline" sx={{ color: '#64748b' }}>
                      Upcoming Events
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
                      {upcomingCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      Scheduled from today onwards
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,#ffb74d,#f57c00)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <Today />
                  </Box>
                  <Box>
                    <Typography variant="overline" sx={{ color: '#64748b' }}>
                      Active Term
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e' }}>
                      {activeTerm ? `${activeTerm.name} ${activeTerm.year}` : 'Not set'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      {activeTerm
                        ? `${new Date(activeTerm.startDate).toLocaleDateString()} - ${new Date(activeTerm.endDate).toLocaleDateString()}`
                        : 'Activate a term to highlight it here'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Paper
            elevation={0}
            sx={{
              border: '1px solid #e2e8f0',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 16px 32px rgba(15,23,42,0.08)',
              backgroundColor: '#fff',
            }}
          >
            <Box sx={{ borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc', px: { xs: 2, md: 3 } }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab icon={<Event />} iconPosition="start" label="Events" sx={{ fontWeight: 600 }} />
                <Tab icon={<CalendarToday />} iconPosition="start" label="Terms" sx={{ fontWeight: 600 }} />
              </Tabs>
            </Box>

            <CardContent sx={{ px: { xs: 2, md: 3 }, py: { xs: 3, md: 4 } }}>
              {activeTab === 0 && (
                <Box>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    sx={{ mb: 3 }}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                        Calendar Events
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Manage assemblies, meetings, holidays, and key milestones.
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => openEventDialog()}
                      sx={{ bgcolor: '#1a237e', ml: { md: 'auto' } }}
                    >
                      Add Event
                    </Button>
                  </Stack>

                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#1a237e' }}>
                          {['Event', 'Date', 'Type', 'Category', 'Grade', 'Actions'].map((heading) => (
                            <TableCell key={heading} sx={{ color: '#ffffff', fontWeight: 600 }}>
                              {heading}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {events.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getEventIcon(event.type)}
                                <Box>
                                  <Typography variant="body2" fontWeight="medium">
                                    {event.title}
                                  </Typography>
                                  {event.description && (
                                    <Typography variant="caption" color="text.secondary">
                                      {event.description}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(event.startDate).toLocaleDateString()}
                              </Typography>
                              {event.startDate !== event.endDate && (
                                <Typography variant="caption" display="block">
                                  to {new Date(event.endDate).toLocaleDateString()}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={event.type.replace('_', ' ')}
                                size="small"
                                color={event.isHoliday ? 'error' : 'default'}
                              />
                            </TableCell>
                            <TableCell>
                              {event.category && (
                                <Chip
                                  label={event.category}
                                  size="small"
                                  color={getEventColor(event.category) as any}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip label={event.grade === 'all' ? 'All' : event.grade} size="small" />
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <IconButton
                                  size="small"
                                  onClick={() => openEventDialog(event)}
                                  color="primary"
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteEvent(event.id)}
                                  color="error"
                                >
                                  <Delete />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    sx={{ mb: 3 }}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                        School Terms
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Define academic windows and highlight the active term.
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => openTermDialog()}
                      sx={{ bgcolor: '#1a237e', ml: { md: 'auto' } }}
                    >
                      Add Term
                    </Button>
                  </Stack>

                  <Grid container spacing={2}>
                    {terms.map((term) => (
                      <Grid item xs={12} md={6} key={term.id}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            border: term.isActive ? '2px solid #1a237e' : '1px solid #e2e8f0',
                            boxShadow: term.isActive ? '0 12px 24px rgba(26,35,126,0.16)' : '0 6px 16px rgba(15,23,42,0.1)',
                            backgroundColor: term.isActive ? '#f4f7ff' : '#ffffff',
                          }}
                        >
                          <CardContent>
                            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a237e' }}>
                                  {term.name} {term.year}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#475569' }}>
                                  {new Date(term.startDate).toLocaleDateString()} – {new Date(term.endDate).toLocaleDateString()}
                                </Typography>
                              </Box>
                              {term.isActive && <Chip label="Active" color="primary" size="small" />}
                            </Stack>

                            {term.description && (
                              <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
                                {term.description}
                              </Typography>
                            )}

                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                startIcon={<Edit />}
                                onClick={() => openTermDialog(term)}
                              >
                                Edit
                              </Button>
                              {!term.isActive && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleActivateTerm(term.id)}
                                  sx={{ color: '#1a237e', borderColor: '#1a237e' }}
                                >
                                  Activate
                                </Button>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}

                    {terms.length === 0 && (
                      <Grid item xs={12}>
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px dashed #cbd5f5' }}>
                          <Typography variant="body1" sx={{ color: '#64748b', mb: 2 }}>
                            No terms defined yet.
                          </Typography>
                          <Button variant="contained" startIcon={<Add />} onClick={() => openTermDialog()}>
                            Add Your First Term
                          </Button>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Paper>
        </Container>

        {/* Event Dialog */}
        <Dialog open={eventDialogOpen} onClose={() => setEventDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
          <form onSubmit={handleEventSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                  fullWidth
                  label="Event Title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  multiline
                  rows={3}
                  variant="outlined"
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <DatePicker
                    label="Start Date"
                    value={eventForm.startDate}
                    onChange={(date) => setEventForm({ ...eventForm, startDate: date || new Date() })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                      },
                    }}
                  />
                  <DatePicker
                    label="End Date"
                    value={eventForm.endDate}
                    onChange={(date) => setEventForm({ ...eventForm, endDate: date || new Date() })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                      },
                    }}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Event Type</InputLabel>
                    <Select
                      value={eventForm.type}
                      onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                      label="Event Type"
                    >
                      {eventTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                      label="Category"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Grade</InputLabel>
                    <Select
                      value={eventForm.grade}
                      onChange={(e) => setEventForm({ ...eventForm, grade: e.target.value })}
                      label="Grade"
                    >
                      {grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Term</InputLabel>
                    <Select
                      value={eventForm.termId}
                      onChange={(e) => setEventForm({ ...eventForm, termId: e.target.value })}
                      label="Term"
                    >
                      <MenuItem value="">No specific term</MenuItem>
                      {terms.map((term) => (
                        <MenuItem key={term.id} value={term.id}>
                          {term.name} {term.year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    label="Time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    placeholder="e.g., 9:00 AM - 12:00 PM"
                  />
                </Stack>
                <TextField
                  fullWidth
                  label="Facebook Link"
                  value={eventForm.facebookLink}
                  onChange={(e) => setEventForm({ ...eventForm, facebookLink: e.target.value })}
                />
                <Divider sx={{ my: 1 }} />
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={eventForm.isHoliday}
                        onChange={(e) => setEventForm({ ...eventForm, isHoliday: e.target.checked })}
                      />
                    }
                    label="School Holiday"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={eventForm.isExam}
                        onChange={(e) => setEventForm({ ...eventForm, isExam: e.target.checked })}
                      />
                    }
                    label="Examination"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={eventForm.isPublicHoliday}
                        onChange={(e) => setEventForm({ ...eventForm, isPublicHoliday: e.target.checked })}
                      />
                    }
                    label="Public Holiday"
                  />
                </Stack>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEventDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" startIcon={<Save />}>
                {editingEvent ? 'Update' : 'Create'} Event
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Term Dialog */}
        <Dialog open={termDialogOpen} onClose={() => setTermDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingTerm ? 'Edit Term' : 'Add New Term'}
          </DialogTitle>
          <form onSubmit={handleTermSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Year"
                    type="number"
                    value={termForm.year}
                    onChange={(e) => setTermForm({ ...termForm, year: parseInt(e.target.value, 10) })}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Term Number"
                    type="number"
                    value={termForm.termNumber}
                    onChange={(e) => setTermForm({ ...termForm, termNumber: parseInt(e.target.value, 10) })}
                    required
                  />
                </Stack>
                <TextField
                  fullWidth
                  label="Term Name"
                  value={termForm.name}
                  onChange={(e) => setTermForm({ ...termForm, name: e.target.value })}
                  required
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <DatePicker
                    label="Start Date"
                    value={termForm.startDate}
                    onChange={(date) => setTermForm({ ...termForm, startDate: date || new Date() })}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                  <DatePicker
                    label="End Date"
                    value={termForm.endDate}
                    onChange={(date) => setTermForm({ ...termForm, endDate: date || new Date() })}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Stack>
                <TextField
                  fullWidth
                  label="Description"
                  value={termForm.description}
                  onChange={(e) => setTermForm({ ...termForm, description: e.target.value })}
                  multiline
                  rows={3}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setTermDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" startIcon={<Save />}>
                {editingTerm ? 'Update' : 'Create'} Term
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Success/Error Messages */}
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
        >
          <Alert onClose={() => setSuccess(null)} severity="success">
            {success}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </LocalizationProvider>
    </AdminLayout>
  );
};

export default CalendarManagement;
