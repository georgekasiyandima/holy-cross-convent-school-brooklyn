import React from 'react';
import { Container, Typography, Box, Card, CardContent, Divider, Stack, Button, Chip, Link as MuiLink } from '@mui/material';
import { MusicNote, Group, School, Audiotrack, VideoLibrary, Download } from '@mui/icons-material';

const downloads = [
  {
    label: 'Sheet Music (PDF)',
    file: '', // Add file path when available
  },
  {
    label: 'Lyrics Sheet (PDF)',
    file: '', // Add file path when available
  },
  {
    label: 'Contextual Information (PDF)',
    file: '', // Add file path when available
  },
];

const Music: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          Music Department
        </Typography>
        <Divider sx={{ bgcolor: '#ffd700', height: 4, width: 80, mx: 'auto', mb: 3 }} />
        <Typography variant="h6" sx={{ color: '#555', maxWidth: 700, mx: 'auto', mb: 2 }}>
          Inspiring a love for music, creativity, and community at Holy Cross Convent School Brooklyn.
        </Typography>
      </Box>

      {/* Staff & Activities */}
      <Card sx={{ mb: 6, boxShadow: 2, background: 'linear-gradient(135deg, #f5f7fa 0%, #fffde7 100%)' }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center">
            <Box>
              <MusicNote sx={{ color: '#1a237e', fontSize: 60 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
                Mr Adolf Thelen
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', mb: 1 }}>
                <b>Music Department Head</b>
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', mb: 2 }}>
                Teaches Music Appreciation (Grades 4–7), conducts the Senior Choir and congregational singing, and manages audio-visual equipment and the computer lab.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip icon={<Audiotrack sx={{ color: '#ffd700' }} />} label="Music Appreciation" sx={{ bgcolor: '#fffde7', color: '#1a237e', fontWeight: 700 }} />
                <Chip icon={<Group sx={{ color: '#1a237e' }} />} label="Senior Choir" sx={{ bgcolor: '#e3eafc', color: '#1a237e', fontWeight: 700 }} />
                <Chip icon={<MusicNote sx={{ color: '#ffd700' }} />} label="Congregational Singing" sx={{ bgcolor: '#fffde7', color: '#1a237e', fontWeight: 700 }} />
                <Chip icon={<VideoLibrary sx={{ color: '#1a237e' }} />} label="AV & Computer Lab" sx={{ bgcolor: '#e3eafc', color: '#1a237e', fontWeight: 700 }} />
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* School Song Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 2 }}>
          The New School Song: "Holy Cross is our Salvation"
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
          Developed in 2021 by a Cape Town task team, this new composition replaces the old School Anthem "The Holy Cross My Own". The song celebrates our school’s values and community spirit.
        </Typography>
        <Typography variant="body2" sx={{ color: '#1a237e', fontStyle: 'italic', mb: 2 }}>
          “Holy Cross is our Salvation”
        </Typography>
      </Box>

      {/* Choir Video Placeholder */}
      <Card sx={{ mb: 6, boxShadow: 1, background: 'linear-gradient(135deg, #e3eafc 0%, #fffde7 100%)' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
            Holy Cross Brooklyn Senior Choir
          </Typography>
          {/* Replace with YouTube embed or video player when available */}
          <Box sx={{ width: '100%', height: 0, paddingBottom: '56.25%', position: 'relative', mb: 2 }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
              <VideoLibrary sx={{ color: '#ffd700', fontSize: 60 }} />
              <Typography variant="body2" sx={{ color: '#aaa', ml: 2 }}>
                Choir video coming soon
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Downloads Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 2 }}>
          Downloads
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {downloads.map((item) => (
            item.file ? (
              <Button
                key={item.label}
                variant="contained"
                color="primary"
                startIcon={<Download />}
                href={item.file}
                target="_blank"
                sx={{
                  bgcolor: '#ffd700',
                  color: '#1a237e',
                  fontWeight: 700,
                  minWidth: 200,
                  '&:hover': { bgcolor: '#ffed4e' },
                }}
              >
                {item.label}
              </Button>
            ) : (
              <Button
                key={item.label}
                variant="contained"
                color="primary"
                startIcon={<Download />}
                disabled
                sx={{
                  bgcolor: '#ccc',
                  color: '#666',
                  fontWeight: 700,
                  minWidth: 200,
                  '&:hover': { bgcolor: '#ccc' },
                }}
              >
                {item.label}
              </Button>
            )
          ))}
        </Stack>
        <Typography variant="body2" sx={{ color: '#aaa', mt: 2 }}>
          Sheet music, lyrics, and more will be available for download soon.
        </Typography>
      </Box>

      <Divider sx={{ my: 6 }} />
      <Box sx={{ textAlign: 'center', color: '#aaa', mt: 4 }}>
        <Typography variant="body2">
          <em>Music is at the heart of our school community. More resources and media will be added as they become available.</em>
        </Typography>
      </Box>
    </Container>
  );
};

export default Music; 