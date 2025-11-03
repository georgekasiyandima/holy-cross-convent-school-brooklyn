import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ZoomIn as ZoomInIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import OptimizedImage from './OptimizedImage';

interface LogoElement {
  id: string;
  title: string;
  description: string;
  meaning: string;
  color?: string;
}

const LogoSymbolism: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const logoElements: LogoElement[] = [
    {
      id: 'hills',
      title: 'The Three Hills (Green)',
      description: 'Symbol of the earth and universal mission',
      meaning: 'The three hills symbolize the earth. God\'s mission applies to all people on earth, representing our commitment to serve all of humanity.',
      color: '#2e7d32'
    },
    {
      id: 'background',
      title: 'Blue Background',
      description: 'God\'s presence and spirit',
      meaning: 'The blue background speaks to us of God\'s presence. Blue is believed to be the colour of God\'s spirit, surrounding and encompassing all that we do.',
      color: '#1976d2'
    },
    {
      id: 'cross',
      title: 'The Red Cross',
      description: 'Centered in salvation',
      meaning: 'The cross stands on the centre hill and symbolizes that we are centred in the cross. It stands below heaven and is a revelation of our salvation.',
      color: '#d32f2f'
    },
    {
      id: 'stars',
      title: 'The Stars (Golden/Yellow)',
      description: 'God\'s gifts and Holy Cross Sisters\' vows',
      meaning: 'The stars speak to us of the many gifts and graces which we have received from God. They also remind the Holy Cross Sisters of the three vows which they have made.',
      color: '#ffca28'
    },
    {
      id: 'sunmoon',
      title: 'Sun and Moon (Golden/Yellow)',
      description: 'Continuous mission around the world',
      meaning: 'The sun and moon on either side of the cross remind us that at all times, somewhere on earth the work of the Holy Cross Sisters is being done.',
      color: '#ffca28'
    },
    {
      id: 'motto',
      title: 'The Motto',
      description: '"In cruce salus" - In the cross is salvation',
      meaning: 'Our school motto "In cruce salus" translates to "in the cross is salvation," reminding us that through Christ\'s sacrifice on the cross, we find our ultimate salvation and purpose.',
      color: '#1a237e'
    }
  ];

  const handleImageClick = (imagePath: string) => {
    setSelectedImage(imagePath);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(null);
  };

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
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
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
            Logo Symbolism
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#666',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Understanding the deeper meaning behind our school logo and its symbolic elements
          </Typography>
        </Box>

        {/* Logo Image Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Card 
            elevation={2}
            sx={{ 
              maxWidth: 500, 
              mx: 'auto',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 8px 32px rgba(26, 35, 126, 0.15)'
              }
            }}
            onClick={() => handleImageClick('/Logo Symbolism.jpeg')}
          >
            <Box sx={{ position: 'relative' }}>
              <OptimizedImage
                src="/Logo Symbolism.jpeg"
                alt="Holy Cross Convent School Logo Symbolism"
                width={500}
                height={400}
                variant="image"
                config={{
                  width: 500,
                  height: 400,
                  quality: 90,
                  format: 'webp',
                  fit: 'contain'
                }}
                sx={{
                  borderRadius: 1,
                  width: '100%',
                  height: 'auto'
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)'
                  }
                }}
                size="small"
              >
                <ZoomInIcon color="primary" />
              </IconButton>
            </Box>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Click to view full size
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Symbolic Elements Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: 'center', 
              mb: 4, 
              color: '#1a237e',
              fontWeight: 600
            }}
          >
            Symbolic Elements
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {logoElements.map((element, index) => (
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' } }} key={element.id}>
                <Accordion 
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      margin: 0
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: `${element.color}15`,
                      borderRadius: '8px 8px 0 0',
                      '&.Mui-expanded': {
                        borderRadius: '8px 8px 0 0'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: element.color,
                          mr: 2,
                          flexShrink: 0
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: element.color }}>
                        {element.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                      {element.description}
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#666' }}>
                      {element.meaning}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Mission Connection */}
        <Box 
          sx={{ 
            mt: 6, 
            p: 4, 
            backgroundColor: 'rgba(26, 35, 126, 0.05)',
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, color: '#1a237e', fontWeight: 600 }}>
            Our Logo in Action
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#666', maxWidth: '800px', mx: 'auto' }}>
            Each element of our logo represents a core value that guides our educational mission. 
            Together, they form a powerful symbol of our commitment to nurturing faith, fostering academic excellence, 
            and developing character in every child who walks through our doors.
          </Typography>
        </Box>
      </Paper>

      {/* Full-size Image Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { backgroundColor: 'transparent', boxShadow: 'none' }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <OptimizedImage
              src={selectedImage}
              alt="Logo Symbolism - Full Size"
              width={800}
              height={600}
              variant="image"
              config={{
                width: 800,
                height: 600,
                quality: 95,
                format: 'webp',
                fit: 'contain'
              }}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default LogoSymbolism;

