import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import SEO from '../components/SEO';

const Hero = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: 520,
  display: 'flex',
  alignItems: 'center',
  color: '#fff',
  background: 'url("/acad1.jpg") center/cover no-repeat',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,35,126,.80), rgba(211,47,47,.50))'
  },
  '& > *': { position: 'relative', zIndex: 1 }
}));

const Ribbon = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg,#d32f2f,#ffd700) ',
  color: '#1a237e',
  fontWeight: 700,
  padding: theme.spacing(1, 2),
  borderRadius: 12,
  display: 'inline-block'
}));

const Academic: React.FC = () => {
  return (
    <>
      <SEO title="Academic Excellence" description="CAPS-aligned academics with Catholic values and dedicated learner support." />

      <Hero>
        <Container maxWidth="lg">
          <Ribbon>Academic Pillar</Ribbon>
          <Typography variant="h2" sx={{ fontWeight: 800, mt: 2, mb: 1 }}>Every child can shine</Typography>
          <Typography variant="h6" sx={{ maxWidth: 900 }}>
            At Holy Cross Convent School, every child is seen, supported, and encouraged to reach their full God-given potential — academically, spiritually, and personally.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <Chip label="CAPS-aligned" color="default" />
            <Chip label="Small classes (1 per grade)" />
            <Chip label="Learner Support" />
            <Chip label="Values-based education" />
          </Stack>
        </Container>
      </Hero>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={1}>
              <CardMedia component="img" image="/acad2.jpg" alt="Focused attention" />
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Focused attention & belonging</Typography>
                <Typography>
                  With one class per grade, our learners benefit from individual attention and a strong sense of belonging.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={1}>
              <CardMedia component="img" image="/acad04.jpg" alt="Learner support" />
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Dedicated learner support</Typography>
                <Typography>
                  Support is offered across the school to nurture curiosity, confidence and compassion from Grade R–7.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Foundation Phase (R–3)</Typography>
                <Typography>Strong foundations in literacy, numeracy and faith-filled learning experiences.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Intermediate Phase (4–6)</Typography>
                <Typography>Expanding knowledge with inquiry, projects and collaboration.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Senior Phase (7)</Typography>
                <Typography>Leadership, responsibility and readiness for high school pathways.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Where faith and learning come together</Typography>
          <Typography sx={{ maxWidth: 900, mx: 'auto', mb: 3 }}>
            Our CAPS-aligned curriculum combines Catholic values with innovative teaching to prepare learners for success in a modern world.
          </Typography>
          <Button variant="contained" href="/admissions">Explore Admissions</Button>
        </Box>
      </Container>
    </>
  );
};

export default Academic;
