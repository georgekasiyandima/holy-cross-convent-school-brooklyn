import React from 'react';
import { Container, Typography, Box, Card, CardContent, Divider, Grid, useTheme, Stack, Button } from '@mui/material';
import { TheaterComedy, SportsSoccer, SportsHandball, SportsMartialArts, Palette, EmojiPeople, Email, Phone } from '@mui/icons-material';
import ReturnToHome from '../components/ReturnToHome';

const activities = [
  {
    name: 'Drama',
    icon: <TheaterComedy sx={{ color: '#1a237e', fontSize: 48 }} />,
    description: 'Expressive arts and performance for all ages.',
  },
  {
    name: 'Liturgical Dance',
    icon: <EmojiPeople sx={{ color: '#ffd700', fontSize: 48 }} />,
    description: 'Faith-inspired dance and movement.',
  },
  {
    name: 'Arts & Craft',
    icon: <Palette sx={{ color: '#1a237e', fontSize: 48 }} />,
    description: 'Creative projects and hands-on art activities.',
  },
  {
    name: 'Karate (Outsourced)',
    icon: <SportsMartialArts sx={{ color: '#ffd700', fontSize: 48 }} />,
    description: 'Self-discipline and fitness through martial arts.',
  },
  {
    name: 'Netball',
    icon: <SportsHandball sx={{ color: '#1a237e', fontSize: 48 }} />,
    description: 'Teamwork and skills on the netball court.',
  },
  {
    name: 'Soccer',
    icon: <SportsSoccer sx={{ color: '#ffd700', fontSize: 48 }} />,
    description: 'Fun and fitness through soccer matches.',
  },
];

const ExtraMural: React.FC = () => {
  const theme = useTheme();
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Return to Home */}
      <ReturnToHome />
      
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          Extra Mural Activities
        </Typography>
        <Divider sx={{ bgcolor: '#ffd700', height: 4, width: 80, mx: 'auto', mb: 3 }} />
        <Typography variant="h6" sx={{ color: '#555', maxWidth: 700, mx: 'auto', mb: 2 }}>
          Our extra-mural activities vary from term to term. Below are some of the activities offered at Holy Cross Convent School Brooklyn.
        </Typography>
      </Box>

      {/* Activities Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 4,
          mb: 6,
        }}
      >
        {activities.map((activity) => (
          <Card key={activity.name} sx={{
            textAlign: 'center',
            py: 4,
            px: 2,
            borderLeft: `6px solid ${activity.icon.props.sx.color}`,
            boxShadow: theme.shadows[2],
            background: 'linear-gradient(135deg, #f5f7fa 0%, #fffde7 100%)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.03)',
              boxShadow: theme.shadows[6],
            },
          }}>
            <Box sx={{ mb: 2 }}>{activity.icon}</Box>
            <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
              {activity.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#555', mb: 2 }}>
              {activity.description}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* Contact/Help Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Stack direction="column" spacing={2} alignItems="center">
          <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Want the latest activity schedule?
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', maxWidth: 600 }}>
            Please send an email to <b>admin@holycrossbrooklyn.co.za</b> or phone <b>(021) 511 4337</b> for the latest update on extra-mural activities.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Phone />}
              href="tel:0215114337"
              sx={{ borderColor: '#ffd700', color: '#1a237e', fontWeight: 700 }}
            >
              Call School
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Email />}
              href="mailto:admin@holycrossbrooklyn.co.za"
              sx={{ borderColor: '#ffd700', color: '#1a237e', fontWeight: 700 }}
            >
              Email Admin
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Divider sx={{ my: 4 }} />
      <Box sx={{ textAlign: 'center', color: '#aaa', mt: 4 }}>
        <Typography variant="body2">
          <em>More activities, schedules, and photos will be added as the program grows.</em>
        </Typography>
      </Box>
    </Container>
  );
};

export default ExtraMural; 