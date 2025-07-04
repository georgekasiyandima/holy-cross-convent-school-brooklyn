import React from 'react';
import { Container, Typography, Box, Card, CardMedia, CardContent, Divider, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const SpiritualSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(8),
  padding: theme.spacing(4, 0),
  background: 'rgba(255, 247, 205, 0.2)', // gentle gold background
  borderRadius: theme.spacing(2),
}));

const QuoteBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(26, 35, 126, 0.05)',
  borderLeft: `4px solid #ffd700`,
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  borderRadius: theme.spacing(1),
  fontStyle: 'italic',
}));

const Spiritual: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <SpiritualSection>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            CHRISTMAS 2022
          </Typography>
          <Typography variant="h5" sx={{ color: '#ffd700', fontWeight: 600, mb: 3, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
            The Challenge
          </Typography>
        </Box>
        <Card sx={{ mb: 4, boxShadow: 0, background: 'none' }}>
          <CardMedia
            component="img"
            image="/jesus_child.jpg" // Update this if the filename is different
            alt="Child Jesus"
            sx={{ maxWidth: 350, mx: 'auto', borderRadius: 3, boxShadow: 3, mb: 2 }}
          />
          <CardContent>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', mb: 2 }}>
              One need only turn on the television to see that we live in difficult times. Growing unemployment, debt, divorce, addiction, and abuse have become widespread leaving in their wake unhappiness and heartache that touches every one of us. Too many look to politicians, corporations, or governments to fix what is broken, but history has shown these organizations are not the cure for unhappiness. Only Jesus Christ can fix what is broken, only He can bring real and lasting peace.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', mb: 2 }}>
              I have sold religious art for years, yet I am still amazed by the power it has to change our world. By surrounding ourselves with heavenly things we become better and heaven becomes a little closer. <strong>Does it Really Work?</strong>
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', mb: 2 }}>
              Faith is born from a relationship with Christ. Like any relationship, it begins by spending time together. We spend time with the Lord as we pray and study His word. But in a world filled with distractions it can become easy to forget Him unless we surround ourselves with meaningful reminders. By putting a picture of Christ in our homes we are creating a reminder to ourselves, and those we love, to spend time with.
            </Typography>
          </CardContent>
        </Card>
        <Divider sx={{ my: 4 }} />
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 1, fontSize: { xs: '1.3rem', md: '1.7rem' } }}>
            SAVIOUR
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#1a237e', fontWeight: 500, mb: 2 }}>
            by Liz Lemon
          </Typography>
        </Box>
        <QuoteBox>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#333' }}>
            “This Christmas please accept our gift of a free picture of Christ then share His love with others by giving away pictures of Christ to your family, friends, and neighbours”
          </Typography>
        </QuoteBox>
        <Divider sx={{ my: 4 }} />
        {/* Future: Catholic Church spiritual calendar/seasons section */}
        <Box sx={{ textAlign: 'center', mt: 6, color: '#aaa' }}>
          <Typography variant="body2">
            <em>In future, this page will show the Catholic Church spiritual calendar/seasons.</em>
          </Typography>
        </Box>
      </SpiritualSection>
    </Container>
  );
};

export default Spiritual; 