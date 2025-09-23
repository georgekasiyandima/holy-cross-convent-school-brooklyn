import React from 'react';
import { Container, Typography, Box, Card, CardContent, Divider, Chip, Stack } from '@mui/material';
import { Announcement, Event, School } from '@mui/icons-material';

const newsItems = [
  {
    title: 'Welcome Back to School!',
    date: '2025-07-01',
    summary: 'We are excited to welcome all students and staff to the new academic year. Let’s make it a year of growth, learning, and community spirit!',
    icon: <School sx={{ color: '#1a237e', fontSize: 40 }} />,
  },
  {
    title: 'Cardinal Stephen Brislin Visits Our School',
    date: '2025-06-15',
    summary: 'A special thank you to His Eminence Cardinal Stephen Brislin for visiting our school and inspiring our learners and staff.',
    icon: <Event sx={{ color: '#ffd700', fontSize: 40 }} />,
  },
  {
    title: 'New Library Books Arrived',
    date: '2025-06-10',
    summary: 'Our library has received a new collection of books for all grades. Encourage your child to explore and read!',
    icon: <Announcement sx={{ color: '#1a237e', fontSize: 40 }} />,
  },
];

const News: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          School News & Announcements
        </Typography>
        <Divider sx={{ bgcolor: '#ffd700', height: 4, width: 80, mx: 'auto', mb: 3 }} />
        <Typography variant="h6" sx={{ color: '#555', maxWidth: 700, mx: 'auto', mb: 2 }}>
          Stay up to date with the latest news, events, and announcements from Holy Cross Convent School Brooklyn.
        </Typography>
      </Box>

      {/* News List */}
      <Stack spacing={4}>
        {newsItems.map((item, idx) => (
          <Card key={item.title + item.date} sx={{
            display: 'flex',
            alignItems: 'flex-start',
            boxShadow: 2,
            borderLeft: `6px solid ${item.icon.props.sx.color}`,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #fffde7 100%)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-2px) scale(1.01)',
              boxShadow: 6,
            },
          }}>
            <Box sx={{ p: 3, pr: 0, display: { xs: 'none', sm: 'block' } }}>{item.icon}</Box>
            <CardContent sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700 }}>
                  {item.title}
                </Typography>
                <Chip label={new Date(item.date).toLocaleDateString()} size="small" sx={{ bgcolor: '#ffd700', color: '#1a237e', fontWeight: 700 }} />
              </Box>
              <Typography variant="body1" sx={{ color: '#555', mb: 1 }}>
                {item.summary}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Divider sx={{ my: 6 }} />
      <Box sx={{ textAlign: 'center', color: '#aaa', mt: 4 }}>
        <Typography variant="body2">
          <em>More news and updates will be posted here throughout the year.</em>
        </Typography>
      </Box>
    </Container>
  );
};

export default News; 