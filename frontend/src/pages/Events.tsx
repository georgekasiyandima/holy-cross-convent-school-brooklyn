import React, { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Divider, useTheme, Chip, Stack, ButtonGroup, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ChurchIcon from '@mui/icons-material/Church';
import EventIcon from '@mui/icons-material/Event';

const EventSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(8),
  padding: theme.spacing(4, 0),
}));

const EventCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderLeft: `6px solid #ffd700`,
  boxShadow: theme.shadows[2],
  background: 'white',
}));

const events = [
  {
    date: '13 Feb',
    month: 'February',
    title: "Valentine's Day Fun",
    type: 'fun',
    icon: <FavoriteIcon sx={{ color: '#e53935' }} />,
    description: '',
  },
  {
    date: '14 Feb - 9:30h',
    month: 'February',
    title: 'Ash Wednesday Mass',
    type: 'mass',
    icon: <ChurchIcon sx={{ color: '#1a237e' }} />,
    description: 'Season of Lent starts',
  },
  {
    date: '23 Feb',
    month: 'February',
    title: 'Sports Day',
    type: 'sports',
    icon: <SportsSoccerIcon sx={{ color: '#ffd700' }} />,
    description: '',
  },
  // Add more events as needed
];

const eventTypes = [
  { label: 'All', value: 'all' },
  { label: 'Mass', value: 'mass' },
  { label: 'Sports', value: 'sports' },
  { label: 'Fun', value: 'fun' },
];

const Events: React.FC = () => {
  const theme = useTheme();
  const [filter, setFilter] = useState('all');

  // Group events by month
  const months = Array.from(new Set(events.map(e => e.month)));
  const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <EventSection>
        <Typography variant="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 3, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          School Events 2024
        </Typography>
        <Divider sx={{ mb: 4 }} />
        {/* Filter Chips */}
        <ButtonGroup sx={{ mb: 4 }}>
          {eventTypes.map(type => (
            <Button
              key={type.value}
              variant={filter === type.value ? 'contained' : 'outlined'}
              color={filter === type.value ? 'primary' : 'inherit'}
              onClick={() => setFilter(type.value)}
              sx={{
                fontWeight: 600,
                color: filter === type.value ? '#fff' : '#1a237e',
                backgroundColor: filter === type.value ? '#1a237e' : 'white',
                borderColor: '#ffd700',
                '&:hover': {
                  backgroundColor: '#ffd700',
                  color: '#1a237e',
                },
              }}
            >
              {type.label}
            </Button>
          ))}
        </ButtonGroup>
        {/* Grouped Events by Month */}
        {months.map(month => {
          const monthEvents = filteredEvents.filter(e => e.month === month);
          if (monthEvents.length === 0) return null;
          return (
            <Box key={month} sx={{ mb: 5 }}>
              <Typography variant="h4" sx={{ color: '#ffd700', fontWeight: 700, mb: 2, mt: 4 }}>
                {month}
              </Typography>
              <Stack spacing={3}>
                {monthEvents.map((event, idx) => (
                  <EventCard key={idx}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ minWidth: 48, minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {event.icon || <EventIcon sx={{ color: '#ffd700' }} />}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                          {event.description}
                        </Typography>
                        <Chip label={event.date} color="primary" variant="outlined" sx={{ color: '#1a237e', borderColor: '#ffd700', fontWeight: 600 }} />
                      </Box>
                    </CardContent>
                  </EventCard>
                ))}
              </Stack>
            </Box>
          );
        })}
        <Divider sx={{ my: 4 }} />
        <Box sx={{ textAlign: 'center', mt: 6, color: '#aaa' }}>
          <Typography variant="body2">
            <em>More events and a full calendar will be available as we integrate with the backend.</em>
          </Typography>
        </Box>
      </EventSection>
    </Container>
  );
};

export default Events; 