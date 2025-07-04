import React from 'react';
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { School, Book, People, Event } from '@mui/icons-material';

const Home: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Holy Cross Convent School
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Nurturing Excellence, Building Character, Inspiring Faith
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              backgroundColor: '#ffd700',
              color: '#1a237e',
              '&:hover': {
                backgroundColor: '#ffed4e',
              },
            }}
          >
            Learn More
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose Holy Cross?
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 4, mt: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Book sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Academic Excellence
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Rigorous curriculum designed to challenge and inspire students to reach their full potential.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <People sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Community
              </Typography>
              <Typography variant="body1" color="text.secondary">
                A supportive community that values diversity, inclusion, and mutual respect.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <School sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Faith-Based Education
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Rooted in Catholic values while welcoming students of all faiths and backgrounds.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Event sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Extracurricular Activities
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Rich opportunities in sports, arts, and leadership development.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default Home; 