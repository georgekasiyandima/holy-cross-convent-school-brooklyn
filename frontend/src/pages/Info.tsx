import React from 'react';
import { Container, Typography, Box, Divider, Card, CardMedia, CardContent, Grid, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const InfoSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(8),
  padding: theme.spacing(4, 0),
}));

const InfoImage = styled(CardMedia)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  objectFit: 'cover',
  width: '100%',
  height: 220,
}));

const Info: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <InfoSection>
        <Typography variant="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 3, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          GENERAL INFORMATION
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 2 }}>
          The Holy Cross Convent Primary School is located in Brooklyn, a suburb near the harbor of Cape Town.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 2 }}>
          It is a Primary School for children, aged between 4 and 13 years (Grade 0 - Grade 7).
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 2 }}>
          All relevant subjects / learning areas according to the requirements of the Western Cape Education Department are taught plus IsiXhosa. The school has a well-equipped computer lab, a library, music facilities and a school hall.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 2 }}>
          It has a large soccer field, netball courts and pleasant play areas. Religious Education and faith sharing is a vital part of the life and outreach of the whole school. It is taught by the teachers and by Sr Eileen and Mrs McLeod.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 2 }}>
          The School Masses at Our Lady of the Assumption Church help to enrich the children's spirituality. The school's principal is Mrs Du Plessis. She is assisted by her school management team, that includes Mrs McLeod & Ms Mitchell.
        </Typography>
      </InfoSection>

      <InfoSection>
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
          School Gallery
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3,
          }}
        >
          {['HCP1.jpg', 'HCL2.jpg', 'HCWA3.jpg', 'HCCL4.jpg'].map((img, idx) => (
            <Card sx={{ boxShadow: 2 }} key={img}>
              <Box
                component="img"
                src={`/${img}`}
                alt={`School photo ${idx + 1}`}
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  objectFit: 'cover',
                  width: '100%',
                  height: 220,
                  display: 'block',
                }}
              />
            </Card>
          ))}
        </Box>
      </InfoSection>

      <InfoSection>
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
          Directions to School
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 2 }}>
          {/* Add directions here or embed a map in the future */}
          <em>Directions will be provided here.</em>
        </Typography>
      </InfoSection>

      <InfoSection>
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
          Admission & School Policy Documents
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 2 }}>
          {/* Add links to downloadable policy documents here in the future */}
          <em>Policy documents will be available for download here.</em>
        </Typography>
        {/* Example download button (disabled for now) */}
        <Button variant="outlined" color="primary" disabled sx={{ mt: 2 }}>
          Download Policy Document
        </Button>
      </InfoSection>
    </Container>
  );
};

export default Info; 