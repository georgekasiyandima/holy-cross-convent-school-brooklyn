import React, { useState, useEffect } from 'react';
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
  Divider
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
  DateRange,
  Save,
  Cancel
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SEO from '../components/SEO';

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
  const { isAuthenticated, user } = useAuth();
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
      const [eventsRes, termsRes] = await Promise.all([
        fetch('/api/calendar/events'),
        fetch('/api/calendar/terms')
      ]);

      if (!eventsRes.ok || !termsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const eventsData = await eventsRes.json();
      const termsData = await termsRes.json();

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
      const url = editingEvent 
        ? `/api/calendar/events/${editingEvent.id}`
        : '/api/calendar/events';
      
      const method = editingEvent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          ...eventForm,
          startDate: eventForm.startDate.toISOString(),
          endDate: eventForm.endDate.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      setSuccess(editingEvent ? 'Event updated successfully' : 'Event created successfully');
      setEventDialogOpen(false);
      resetEventForm();
      fetchData();
    } catch (err) {
      setError('Failed to save event');
      console.error('Error saving event:', err);
    }
  };

  const handleTermSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTerm 
        ? `/api/calendar/terms/${editingTerm.id}`
        : '/api/calendar/terms';
      
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
      const response = await fetch(`/api/calendar/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setSuccess('Event deleted successfully');
      fetchData();
    } catch (err) {
      setError('Failed to delete event');
      console.error('Error deleting event:', err);
    }
  };

  const handleActivateTerm = async (id: string) => {
    try {
      const response = await fetch(`/api/calendar/terms/${id}/activate`, {
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading calendar management...</Typography>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SEO 
        title="Calendar Management - Holy Cross Convent School"
        description="Manage school calendar events and terms"
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1a237e', fontWeight: 700 }}>
            Calendar Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage school terms and calendar events
          </Typography>
        </Box>

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="Events" icon={<Event />} />
              <Tab label="Terms" icon={<CalendarToday />} />
            </Tabs>
          </Box>

          <CardContent>
            {activeTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Calendar Events</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => openEventDialog()}
                    sx={{ backgroundColor: '#1a237e' }}
                  >
                    Add Event
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Event</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Actions</TableCell>
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
                              {event.startDate !== event.endDate && (
                                <Typography variant="caption" display="block">
                                  to {new Date(event.endDate).toLocaleDateString()}
                                </Typography>
                              )}
                            </Typography>
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
                            <Chip label={event.grade} size="small" />
                          </TableCell>
                          <TableCell>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">School Terms</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => openTermDialog()}
                    sx={{ backgroundColor: '#1a237e' }}
                  >
                    Add Term
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {terms.map((term) => (
                    <Box key={term.id} sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: { xs: '100%', md: 'calc(50% - 8px)' } }}>
                      <Card sx={{ 
                        border: term.isActive ? '2px solid #1a237e' : '1px solid #e0e0e0',
                        backgroundColor: term.isActive ? '#f3f4f6' : 'white'
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ color: '#1a237e' }}>
                              {term.name} {term.year}
                            </Typography>
                            {term.isActive && (
                              <Chip label="Active" color="primary" size="small" />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}
                          </Typography>
                          {term.description && (
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              {term.description}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', gap: 1 }}>
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
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Event Dialog */}
        <Dialog open={eventDialogOpen} onClose={() => setEventDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
          <form onSubmit={handleEventSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Event Title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    required
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    multiline
                    rows={3}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <Box sx={{ flex: 1 }}>
                  <DatePicker
                    label="Start Date"
                    value={eventForm.startDate}
                    onChange={(date) => setEventForm({ ...eventForm, startDate: date || new Date() })}
                    slotProps={{ 
                      textField: { 
                        fullWidth: true,
                        variant: "outlined",
                        sx: { mb: 2 }
                      } 
                    }}
                  />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <DatePicker
                      label="End Date"
                      value={eventForm.endDate}
                      onChange={(date) => setEventForm({ ...eventForm, endDate: date || new Date() })}
                      slotProps={{ 
                        textField: { 
                          fullWidth: true,
                          variant: "outlined",
                          sx: { mb: 2 }
                        } 
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="event-type-label">Event Type</InputLabel>
                      <Select
                        labelId="event-type-label"
                        value={eventForm.type}
                        onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                        label="Event Type"
                        sx={{ mb: 2 }}
                      >
                        {eventTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type.replace('_', ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        labelId="category-label"
                        value={eventForm.category}
                        onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                        label="Category"
                        sx={{ mb: 2 }}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="grade-label">Grade</InputLabel>
                      <Select
                        labelId="grade-label"
                        value={eventForm.grade}
                        onChange={(e) => setEventForm({ ...eventForm, grade: e.target.value })}
                        label="Grade"
                        sx={{ mb: 2 }}
                      >
                        {grades.map((grade) => (
                          <MenuItem key={grade} value={grade}>
                            {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="term-label">Term</InputLabel>
                      <Select
                        labelId="term-label"
                        value={eventForm.termId}
                        onChange={(e) => setEventForm({ ...eventForm, termId: e.target.value })}
                        label="Term"
                        sx={{ mb: 2 }}
                      >
                        <MenuItem value="">No specific term</MenuItem>
                        {terms.map((term) => (
                          <MenuItem key={term.id} value={term.id}>
                            {term.name} {term.year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      placeholder="e.g., 9:00 AM - 12:00 PM"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Box>
                </Box>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Facebook Link"
                    value={eventForm.facebookLink}
                    onChange={(e) => setEventForm({ ...eventForm, facebookLink: e.target.value })}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                  </Box>
                </Box>
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
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Year"
                    type="number"
                    value={termForm.year}
                    onChange={(e) => setTermForm({ ...termForm, year: parseInt(e.target.value) })}
                    required
                  />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Term Number"
                      type="number"
                      value={termForm.termNumber}
                      onChange={(e) => setTermForm({ ...termForm, termNumber: parseInt(e.target.value) })}
                      required
                    />
                  </Box>
                </Box>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Term Name"
                    value={termForm.name}
                    onChange={(e) => setTermForm({ ...termForm, name: e.target.value })}
                    required
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <Box sx={{ flex: 1 }}>
                    <DatePicker
                      label="Start Date"
                      value={termForm.startDate}
                      onChange={(date) => setTermForm({ ...termForm, startDate: date || new Date() })}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <DatePicker
                      label="End Date"
                      value={termForm.endDate}
                      onChange={(date) => setTermForm({ ...termForm, endDate: date || new Date() })}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Box>
                </Box>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={termForm.description}
                    onChange={(e) => setTermForm({ ...termForm, description: e.target.value })}
                    multiline
                    rows={3}
                  />
                </Box>
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
      </Container>
    </LocalizationProvider>
  );
};

export default CalendarManagement;
