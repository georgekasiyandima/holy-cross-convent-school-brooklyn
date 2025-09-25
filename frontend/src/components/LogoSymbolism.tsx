import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  GridLegacy as Grid,
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
      id: 'cross',
      title: 'The Cross',
      description: 'The central symbol of our faith',
      meaning: 'Represents our commitment to Christian values and the sacrifice of Jesus Christ. It serves as a constant reminder of our mission to serve God and others.',
      color: '#1a237e'
    },
    {
      id: 'flame',
      title: 'The Flame',
      description: 'The Holy Spirit and divine inspiration',
      meaning: 'Symbolizes the Holy Spirit guiding our educational mission. It represents the light of knowledge, wisdom, and the divine spark in every child.',
      color: '#ff6b35'
    },
    {
      id: 'book',
      title: 'The Open Book',
      description: 'Knowledge and learning',
      meaning: 'Represents our dedication to academic excellence and the pursuit of knowledge. It symbolizes the importance of education in developing the whole person.',
      color: '#2e7d32'
    },
    {
      id: 'shield',
      title: 'The Shield',
      description: 'Protection and strength',
      meaning: 'Represents our commitment to providing a safe, nurturing environment where children can grow and flourish. It symbolizes the protection of our values and traditions.',
      color: '#d32f2f'
    },
    {
      id: 'crown',
      title: 'The Crown',
      description: 'Excellence and dignity',
      meaning: 'Symbolizes our pursuit of excellence in all endeavors and the dignity of every person. It represents the crown of achievement and the royal nature of our calling.',
      color: '#ffca28'
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
          
          <Grid container spacing={3}>
            {logoElements.map((element, index) => (
              <Grid item xs={12} md={6} key={element.id}>
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
              </Grid>
            ))}
          </Grid>
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

