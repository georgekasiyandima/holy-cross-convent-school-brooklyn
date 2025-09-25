import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import OptimizedImage from './OptimizedImage';

interface MissionStatementProps {
  imageUrl?: string;
  title?: string;
  content?: string;
  showImage?: boolean;
}

const MissionStatement: React.FC<MissionStatementProps> = ({
  imageUrl = '/HCCMS.jpeg', // Mission Statement image
  title = "The Holy Cross Family, Brooklyn",
  content = `To make a positive difference in the world.

We strive in our daily lives and encounters to continue the work of Jesus who said, 'I have come that you may have a life and have it to the full.'

In union with the Risen Lord, we prayerfully endeavour to interpret present realities in our world.

This challenges us to develop and deepen our personal and corporate faith and to keep our eyes, hearts and minds open. Through interpersonal relationships in our Apostolate and the rich interactions that this affords us we find reason to:

• Give Thanks
• To hope
• To be open to joy
• To laugh
• To sing

And to live through love in His presence

Glory be to Him, whose Power working in us, can do infinitely more than we can ever imagine.
Ephesians 3:20`,
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
              alt="Holy Cross Family Mission Statement"
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

export default MissionStatement;