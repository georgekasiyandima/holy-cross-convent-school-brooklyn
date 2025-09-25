import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import OptimizedImage from './OptimizedImage';

interface FamilyStatementProps {
  imageUrl?: string;
  title?: string;
  content?: string;
  showImage?: boolean;
}

const FamilyStatement: React.FC<FamilyStatementProps> = ({
  imageUrl = '/HCCFS.jpeg', // Family Statement image
  title = "Holy Cross Convent Family Statement",
  content = `Welcome to the Holy Cross Convent Family!

We are a community of faith, learning, and growth, united in our commitment to providing exceptional Catholic education for our children.

Our family values:
• Faith-based education that nurtures spiritual growth
• Academic excellence and character development
• A supportive community for students and parents
• Traditional Catholic values with modern educational approaches
• Partnership between school and home

Together, we create an environment where every child can flourish academically, spiritually, and personally.`,
  showImage = true
}) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
          border: '1px solid rgba(26, 35, 126, 0.1)'
        }}
      >
        {showImage && imageUrl && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <OptimizedImage
              src={imageUrl}
              alt="Holy Cross Convent Family Statement"
              width={600}
              height={400}
              variant="image"
              config={{
                width: 600,
                height: 400,
                quality: 90,
                format: 'webp',
                fit: 'contain'
              }}
              sx={{
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(26, 35, 126, 0.15)',
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </Box>
        )}
        
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              fontFamily: '"Dancing Script", cursive',
              fontWeight: 600,
              color: '#1a237e',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Typography 
            variant="body1" 
            sx={{
              lineHeight: 1.8,
              fontSize: '1.1rem',
              color: '#333',
              whiteSpace: 'pre-line',
              textAlign: 'left'
            }}
          >
            {content}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default FamilyStatement;

