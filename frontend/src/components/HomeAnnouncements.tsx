import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Stack,
} from '@mui/material';
import { Announcement, Event, CalendarToday, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AnnouncementsService, { Announcement as AnnouncementType } from '../services/announcementsService';
import { API_BASE_URL_WITH_PREFIX } from '../services/apiConfig';

const SectionContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  padding: theme.spacing(8, 0),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
  },
}));

const AnnouncementCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2.5),
  border: '1px solid rgba(26, 35, 126, 0.08)',
  boxShadow: '0 12px 30px rgba(26, 35, 126, 0.08)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  background: '#fff',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 22px 45px rgba(26, 35, 126, 0.12)',
  },
}));

const AnnouncementMedia = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  '& img': {
    width: '100%',
    height: 'auto',
    maxHeight: 360,
    objectFit: 'contain',
    borderRadius: theme.spacing(1.5),
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
  },
}));

const EventCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
  border: '2px solid #ff9800',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: '#ff6f00',
  },
}));

interface HomeAnnouncementsProps {
  announcementsLimit?: number;
  eventsLimit?: number;
}

const HomeAnnouncements: React.FC<HomeAnnouncementsProps> = ({ 
  announcementsLimit = 3,
  eventsLimit = 3 
}) => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [announcementsRes, eventsRes] = await Promise.all([
          AnnouncementsService.getLatestAnnouncements(announcementsLimit),
          fetch(`${API_BASE_URL_WITH_PREFIX}/school-hub/events/upcoming?limit=${eventsLimit}`)
            .then(res => res.json())
            .then(data => data.data || [])
            .catch(() => []),
        ]);

        setAnnouncements(announcementsRes.data || []);
        setEvents(eventsRes || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching announcements/events:', err);
        setError('Failed to load updates');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [announcementsLimit, eventsLimit]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <SectionContainer>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ color: '#1a237e' }} />
          </Box>
        </Container>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: '#1a237e',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Latest Updates & Events
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#666',
              maxWidth: '700px',
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Stay informed about what&apos;s happening at Holy Cross Convent School
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Announcements Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Announcement sx={{ color: '#1a237e', fontSize: 32 }} />
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700 }}>
                  Announcements
                </Typography>
              </Box>
              <Button
                variant="text"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/school-hub#announcements')}
                sx={{ color: '#1a237e', fontWeight: 600 }}
              >
                View All
              </Button>
            </Box>

            {announcements.length === 0 ? (
              <Paper elevation={0} sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  No announcements at this time.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {announcements.map((item) => (
                  <AnnouncementCard key={item.id}>
                    {item.imageUrl ? (
                      <AnnouncementMedia>
                        <CardMedia
                          component="img"
                          image={item.imageUrl}
                          alt={item.title}
                        />
                      </AnnouncementMedia>
                    ) : (
                      <AnnouncementMedia
                        sx={{
                          background: 'linear-gradient(135deg, rgba(26,35,126,0.08) 0%, rgba(26,35,126,0.16) 100%)',
                        }}
                      >
                        <Box
                          sx={{
                            color: '#1a237e',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                          }}
                        >
                          Holy Cross Convent School
                        </Box>
                      </AnnouncementMedia>
                    )}
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#1a237e',
                          fontWeight: 700,
                          fontSize: { xs: '1.05rem', md: '1.15rem' },
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Chip
                          label={item.type === 'newsletter' ? 'Newsletter' : 'News'}
                          size="small"
                          sx={{
                            bgcolor: item.type === 'newsletter' ? '#1a237e' : '#ffd700',
                            color: '#fff',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                          {formatDate(item.publishedAt)}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </AnnouncementCard>
                ))}
              </Stack>
            )}
          </Grid>

          {/* Upcoming Events Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ color: '#ff9800', fontSize: 32 }} />
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700 }}>
                  Upcoming Events
                </Typography>
              </Box>
              <Button
                variant="text"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/school-hub')}
                sx={{ color: '#1a237e', fontWeight: 600 }}
              >
                View Calendar
              </Button>
            </Box>

            {events.length === 0 ? (
              <Paper elevation={0} sx={{ p: 4, textAlign: 'center', backgroundColor: '#fff3e0' }}>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  No upcoming events at this time.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {events.map((event) => (
                  <EventCard key={event.id}>
                    {event.imageUrl && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={event.imageUrl}
                        alt={event.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent sx={{ flex: 1 }}>
                      <Chip
                        label={event.category || 'Event'}
                        size="small"
                        sx={{
                          bgcolor: '#ff9800',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          mb: 1,
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#1a237e',
                          fontWeight: 700,
                          mb: 1,
                          fontSize: { xs: '1rem', md: '1.1rem' },
                        }}
                      >
                        {event.title}
                      </Typography>
                      {event.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {event.description.substring(0, 100) + '...'}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Event sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {formatDate(event.startDate)}
                          </Typography>
                        </Box>
                        {event.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              📍 {event.location}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </EventCard>
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>

        {/* View All Button */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/school-hub')}
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: '#1a237e',
              color: '#fff',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#283593',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(26, 35, 126, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Visit School Hub
          </Button>
        </Box>
      </Container>
    </SectionContainer>
  );
};

export default HomeAnnouncements;


