import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import FamilyStatement from '../components/FamilyStatement';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';

const FamilyStatementPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <SEO
        title="Family Statement - Holy Cross Convent School Brooklyn"
        description="Read the Holy Cross Convent School Brooklyn Family Statement, expressing our commitment to creating a nurturing educational community."
        keywords="family statement, Holy Cross Convent School, Brooklyn, Cape Town, school community, values"
      />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Return to Home */}
        <ReturnToHome />

        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant={isMobile ? 'h3' : 'h2'} 
            component="h1" 
            gutterBottom 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700,
              mb: 2
            }}
          >
            Our Family Statement
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: '800px', mx: 'auto' }}
          >
            The values and principles that unite our school community as one family
          </Typography>
        </Box>

        {/* Family Statement Component */}
        <Box sx={{ mb: 6 }}>
          <FamilyStatement />
        </Box>

        {/* Additional Family Values */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Favorite 
              sx={{ 
                fontSize: '2.5rem', 
                color: '#8e24aa', 
                mr: 2 
              }} 
            />
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                color: '#1a237e', 
                fontWeight: 700 
              }}
            >
              What Makes Us Family
            </Typography>
          </Box>
          
          <Box sx={{ pl: { xs: 0, md: 4 } }}>
            <Typography 
              variant="h6" 
              paragraph 
              sx={{ 
                color: '#333',
                lineHeight: 1.8,
                fontSize: '1.1rem',
                mb: 3
              }}
            >
              At Holy Cross Convent School Brooklyn, we believe that every member of our community - 
              students, parents, teachers, and staff - is part of one extended family. This family 
              bond is built on:
            </Typography>

            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1" sx={{ mb: 2, color: '#555' }}>
                <strong>Mutual Respect:</strong> We treat each other with dignity and kindness, 
                recognizing the unique value of every individual.
              </Typography>
              
              <Typography component="li" variant="body1" sx={{ mb: 2, color: '#555' }}>
                <strong>Shared Responsibility:</strong> We work together to create a safe, 
                nurturing environment where everyone can thrive.
              </Typography>
              
              <Typography component="li" variant="body1" sx={{ mb: 2, color: '#555' }}>
                <strong>Open Communication:</strong> We maintain honest, respectful dialogue 
                between all members of our school community.
              </Typography>
              
              <Typography component="li" variant="body1" sx={{ mb: 2, color: '#555' }}>
                <strong>Celebration of Diversity:</strong> We embrace and celebrate the rich 
                diversity of backgrounds, cultures, and perspectives within our family.
              </Typography>
              
              <Typography component="li" variant="body1" sx={{ mb: 2, color: '#555' }}>
                <strong>Support in Times of Need:</strong> We stand together through challenges 
                and celebrate together in times of joy.
              </Typography>
            </Box>

            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                textAlign: 'center',
                mt: 4,
                fontSize: '1rem'
              }}
            >
              "Together, we are stronger. Together, we are family."
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default FamilyStatementPage;
