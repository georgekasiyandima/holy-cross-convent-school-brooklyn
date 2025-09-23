import React from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import FacebookEmbed from '../components/FacebookEmbed';

const FacebookDemo: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#1a237e', fontWeight: 700, textAlign: 'center', mb: 4 }}>
        Facebook Embed Demo
      </Typography>
      
      <Alert severity="info" sx={{ mb: 4 }}>
        This page demonstrates the Facebook post embedding functionality. 
        Replace the placeholder URLs with actual Facebook post URLs from your school's page.
      </Alert>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 4 
      }}>
        {/* Sample Facebook Post 1 */}
        <FacebookEmbed
          facebookUrl="https://www.facebook.com/share/p/16ogng92kV/"
          fallbackImage="/Cardinal Visit 2023 WEB 01.jpg"
          fallbackAlt="Cardinal Visit 2023"
          title="Cardinal Visit 2023"
          description="A special visit from the Cardinal to our school community"
          category="Events"
          date="2023"
        />

        {/* Sample Facebook Post 2 */}
        <FacebookEmbed
          facebookUrl="https://www.facebook.com/holycrossbrooklyn/posts/123456790"
          fallbackImage="/Cardinal Visit 2023 WEB 05.jpg"
          fallbackAlt="Cardinal Visit 2023 Group Photo"
          title="Cardinal Visit - Group Photo"
          description="Group photo with Cardinal during his visit"
          category="Events"
          date="2023"
        />

        {/* Sample Facebook Post 3 */}
        <FacebookEmbed
          facebookUrl="https://www.facebook.com/holycrossbrooklyn/posts/123456791"
          fallbackImage="/Cardinal Visit 2023 WEB 07.jpg"
          fallbackAlt="Cardinal Visit 2023 Ceremony"
          title="Cardinal Visit - Ceremony"
          description="Ceremony during Cardinal visit"
          category="Events"
          date="2023"
        />

        {/* Sample Facebook Post 4 */}
        <FacebookEmbed
          facebookUrl="https://www.facebook.com/holycrossbrooklyn/posts/123456792"
          fallbackImage="/Cardinal Visit 2023 WEB 08.jpg"
          fallbackAlt="Cardinal Visit 2023 Celebration"
          title="Cardinal Visit - Celebration"
          description="Celebration during Cardinal visit"
          category="Events"
          date="2023"
        />
      </Box>

      <Box sx={{ mt: 6, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
          How to Use Facebook Embeds
        </Typography>
        <Typography variant="body1" paragraph>
          1. <strong>Get Facebook Post URL:</strong> Right-click on any Facebook post and select "Copy link"
        </Typography>
        <Typography variant="body1" paragraph>
          2. <strong>Add to Asset Manager:</strong> Update the facebookPostAssets array in assetManager.ts
        </Typography>
        <Typography variant="body1" paragraph>
          3. <strong>Set Fallback Image:</strong> Provide a static image path in case the embed fails
        </Typography>
        <Typography variant="body1" paragraph>
          4. <strong>Automatic Integration:</strong> Facebook posts will automatically appear in the gallery with rich context
        </Typography>
      </Box>
    </Container>
  );
};

export default FacebookDemo; 