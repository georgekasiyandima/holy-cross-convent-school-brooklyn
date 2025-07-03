import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper
} from '@mui/material';
import { School, Book, People, Event } from '@mui/icons-material';

// Create a theme with school colors (navy blue and gold)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Deep navy blue
    },
    secondary: {
      main: '#ffd700', // Gold
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
      color: '#1a237e',
    },
    h4: {
      fontWeight: 500,
      color: '#1a237e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <AppBar position="static" sx={{ backgroundColor: '#1a237e' }}>
          <Toolbar>
            <School sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Holy Cross Convent School Brooklyn
            </Typography>
            <Button color="inherit">Home</Button>
            <Button color="inherit">About</Button>
            <Button color="inherit">Contact</Button>
          </Toolbar>
        </AppBar>

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
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={3}>
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
            </Grid>
            <Grid item xs={12} md={3}>
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
            </Grid>
            <Grid item xs={12} md={3}>
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
            </Grid>
            <Grid item xs={12} md={3}>
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
            </Grid>
          </Grid>
        </Container>

        {/* Footer */}
        <Paper sx={{ backgroundColor: '#1a237e', color: 'white', py: 4, mt: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Contact Us
                </Typography>
                <Typography variant="body2">
                  123 School Street<br />
                  Brooklyn, NY 11201<br />
                  Phone: (555) 123-4567<br />
                  Email: info@holycrossbrooklyn.edu
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Quick Links
                </Typography>
                <Typography variant="body2">
                  • Admissions<br />
                  • Academics<br />
                  • Student Life<br />
                  • Alumni
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Follow Us
                </Typography>
                <Typography variant="body2">
                  Stay connected with our school community through social media and newsletters.
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
              <Typography variant="body2">
                © 2024 Holy Cross Convent School Brooklyn. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
