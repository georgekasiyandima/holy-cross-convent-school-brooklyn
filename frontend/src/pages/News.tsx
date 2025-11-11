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
import { Error as ErrorIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AnnouncementsService, { Announcement as AnnouncementType } from '../services/announcementsService';

const AnnouncementCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  border: '1px solid rgba(26, 35, 126, 0.08)',
  boxShadow: '0 18px 45px rgba(26, 35, 126, 0.08)',
  transition: 'transform 0.35s ease, box-shadow 0.35s ease',
  background: '#fff',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 28px 55px rgba(26, 35, 126, 0.12)',
  },
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

  const getDate = (value: string) =>
    new Date(value).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

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
              <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                No Announcements Yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                Check back soon for the latest news and updates from our school.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={4}>
              {announcements.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <AnnouncementCard>
                    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                      {item.imageUrl ? (
                        <CardMedia
                          component="img"
                          image={item.imageUrl}
                          alt={item.title}
                          sx={{
                            width: '100%',
                            height: { xs: 260, md: 340 },
                            objectFit: 'cover',
                            transform: 'scale(1.02)',
                            transition: 'transform 0.5s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: { xs: 260, md: 340 },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, rgba(26,35,126,0.08) 0%, rgba(26,35,126,0.18) 100%)',
                            color: '#1a237e',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Holy Cross Convent School
                        </Box>
                      )}

                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 20,
                          left: 20,
                          right: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Chip
                          label={item.type === 'newsletter' ? 'Newsletter' : 'News'}
                          size="small"
                          sx={{
                            bgcolor: item.type === 'newsletter' ? '#1a237e' : '#ffd700',
                            color: '#fff',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            px: 1.5,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#fff',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            textShadow: '0 4px 10px rgba(0,0,0,0.25)',
                          }}
                        >
                          {getDate(item.publishedAt)}
                        </Typography>
                      </Box>
                    </Box>

                    <CardContent
                      sx={{
                        p: { xs: 3, md: 4 },
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: '#1a237e',
                          fontWeight: 700,
                          fontSize: { xs: '1.6rem', md: '1.8rem' },
                          lineHeight: 1.3,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {item.title}
                      </Typography>
                    </CardContent>
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
