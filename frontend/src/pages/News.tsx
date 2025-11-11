import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardMedia,
  Divider, 
  Chip, 
  CircularProgress,
  Alert,
  Button,
  Paper,
  Grid
} from '@mui/material';
import { 
  Announcement, 
  Email,
  Newspaper,
  Error as ErrorIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AnnouncementsService, { Announcement as AnnouncementType } from '../services/announcementsService';

const AnnouncementCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  borderRadius: theme.spacing(2),
  border: '1px solid #e0e0e0',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: '#1a237e',
  },
}));

// PriorityChip styled component with proper typing
const PriorityChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'priority',
})<{ priority?: string }>(({ theme, priority }) => ({
  fontWeight: 600,
  ...(priority === 'URGENT' && {
    backgroundColor: '#d32f2f',
    color: '#fff',
  }),
  ...(priority === 'HIGH' && {
    backgroundColor: '#ff9800',
    color: '#fff',
  }),
  ...(priority === 'NORMAL' && {
    backgroundColor: '#1a237e',
    color: '#fff',
  }),
  ...(priority === 'LOW' && {
    backgroundColor: '#9e9e9e',
    color: '#fff',
  }),
}));

const News: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await AnnouncementsService.getAnnouncements({ 
          limit: 20,
          published: true 
        });
        setAnnouncements(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'newsletter':
        return <Email sx={{ color: '#1a237e', fontSize: 40 }} />;
      case 'news':
        return <Newspaper sx={{ color: '#ffd700', fontSize: 40 }} />;
      default:
        return <Announcement sx={{ color: '#1a237e', fontSize: 40 }} />;
    }
  };

  const getBorderColor = (type: string, priority: string) => {
    if (priority === 'URGENT') return '#d32f2f';
    if (priority === 'HIGH') return '#ff9800';
    if (type === 'newsletter') return '#1a237e';
    if (type === 'news') return '#ffd700';
    return '#1a237e';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            color: '#1a237e', 
            fontWeight: 700, 
            mb: 2, 
            fontSize: { xs: '2rem', md: '2.5rem' } 
          }}
        >
          School Announcements
        </Typography>
        <Divider sx={{ bgcolor: '#ffd700', height: 4, width: 80, mx: 'auto', mb: 3 }} />
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#555', 
            maxWidth: 700, 
            mx: 'auto', 
            mb: 2,
            fontSize: { xs: '1rem', md: '1.1rem' }
          }}
        >
          Stay up to date with the latest news, newsletters, and announcements from Holy Cross Convent School Brooklyn.
        </Typography>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ color: '#1a237e' }} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert 
          severity="error" 
          icon={<ErrorIcon />}
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Announcements List */}
      {!loading && !error && (
        <>
          {announcements.length === 0 ? (
            <Paper 
              elevation={0}
              sx={{ 
                p: 6, 
                textAlign: 'center',
                backgroundColor: 'rgba(26, 35, 126, 0.02)',
                borderRadius: 3
              }}
            >
              <Announcement sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                No Announcements Yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                Check back soon for the latest news and updates from our school.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {announcements.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <AnnouncementCard
                    sx={{
                      borderLeft: `6px solid ${getBorderColor(item.type, item.priority)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                      {/* Icon - hidden on mobile */}
                      <Box 
                        sx={{ 
                          p: 3, 
                          pr: { xs: 3, sm: 0 },
                          display: { xs: 'none', sm: 'flex' },
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {getIcon(item.type)}
                      </Box>

                      {/* Image if available */}
                      {item.imageUrl && (
                        <CardMedia
                          component="img"
                          sx={{
                            width: { xs: '100%', sm: 200 },
                            height: { xs: 200, sm: 'auto' },
                            objectFit: 'cover',
                          }}
                          image={item.imageUrl}
                          alt={item.title}
                        />
                      )}

                      <CardContent sx={{ flex: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                          <Box sx={{ flex: 1, minWidth: '200px' }}>
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                color: '#1a237e', 
                                fontWeight: 700,
                                mb: 1,
                                fontSize: { xs: '1.25rem', md: '1.5rem' }
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                              <Chip 
                                label={item.type === 'newsletter' ? 'Newsletter' : 'News'} 
                                size="small" 
                                sx={{ 
                                  bgcolor: item.type === 'newsletter' ? '#1a237e' : '#ffd700',
                                  color: '#fff',
                                  fontWeight: 600,
                                  fontSize: '0.75rem'
                                }} 
                              />
                              {item.priority && item.priority !== 'NORMAL' && (
                                <PriorityChip 
                                  label={item.priority} 
                                  size="small"
                                  priority={item.priority}
                                />
                              )}
                              <Chip 
                                label={new Date(item.publishedAt).toLocaleDateString('en-ZA', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })} 
                                size="small" 
                                sx={{ 
                                  bgcolor: '#f5f5f5',
                                  color: '#666',
                                  fontWeight: 500,
                                  fontSize: '0.75rem'
                                }} 
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#555', 
                            mb: 2,
                            lineHeight: 1.7,
                            fontSize: { xs: '0.95rem', md: '1rem' }
                          }}
                        >
                          {item.summary || item.content.substring(0, 200) + '...'}
                        </Typography>
                        {item.author && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#999',
                              fontStyle: 'italic'
                            }}
                          >
                            By {item.author.name}
                          </Typography>
                        )}
                      </CardContent>
                    </Box>
                  </AnnouncementCard>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      <Divider sx={{ my: 6 }} />
      <Box sx={{ textAlign: 'center', color: '#aaa', mt: 4 }}>
        <Typography variant="body2">
          <em>More announcements and updates will be posted here throughout the year.</em>
        </Typography>
      </Box>
    </Container>
  );
};

export default News;
