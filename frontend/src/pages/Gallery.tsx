import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  Fade,
  Skeleton,
  Fab,
  Zoom,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PhotoCamera as PhotoIcon,
  Close as CloseIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  KeyboardArrowUp as ArrowUpIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// TypeScript interfaces for better type safety
interface BaseImage {
  src: string;
  title: string;
}

interface CardinalPhoto extends BaseImage {
  description: string;
}

interface GradePhoto extends BaseImage {
  grade: string;
  description: string;
}

interface StaffPhoto extends BaseImage {
  description: string;
}

type GalleryImage = CardinalPhoto | GradePhoto | StaffPhoto;

// Enhanced styled components
const GallerySection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(8),
  padding: theme.spacing(4, 0),
  position: 'relative',
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(26, 35, 126, 0.02)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '3px',
    backgroundColor: '#ffd700',
    borderRadius: '2px',
  },
}));

const ImageCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 12px 24px rgba(26, 35, 126, 0.3)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.1)',
    },
    '& .image-overlay': {
      opacity: 1,
    },
  },
  '& .MuiCardMedia-root': {
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}));

const ImageOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(26, 35, 126, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 1,
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderRadius: theme.spacing(2),
    maxWidth: '95vw',
    maxHeight: '95vh',
  },
}));

const BackToTopButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  backgroundColor: '#1a237e',
  color: 'white',
  zIndex: 1000,
  '&:hover': {
    backgroundColor: '#0d47a1',
    transform: 'scale(1.1)',
  },
}));

const LoadingSkeleton = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
}));

// Photo data
const cardinalPhotos: CardinalPhoto[] = [
  {
    src: '/Cardinal Visit 2023 WEB 01.jpg',
    title: 'Cardinal Stephen Brislin Visit',
    description: 'His Eminence Cardinal Stephen Brislin visiting our school community',
  },
  {
    src: '/Cardinal Visit 2023 WEB 05.jpg',
    title: 'Cardinal with Students',
    description: 'Cardinal Stephen Brislin interacting with our students',
  },
  {
    src: '/Cardinal Visit 2023 WEB 07.jpg',
    title: 'Cardinal with Staff',
    description: 'Cardinal Stephen Brislin meeting with our dedicated staff',
  },
  {
    src: '/Cardinal Visit 2023 WEB 08.jpg',
    title: 'Cardinal Visit Group Photo',
    description: 'Group photo with Cardinal Stephen Brislin',
  },
];

const gradePhotos: GradePhoto[] = [
  { src: '/GradeO.jpg', grade: 'Grade 0', title: 'Grade 0 Class Photo 2023', description: 'Our youngest learners in Grade 0' },
  { src: '/GradeR.jpg', grade: 'Grade R', title: 'Grade R Class Photo 2023', description: 'Grade R students beginning their educational journey' },
  { src: '/Grade1.jpg', grade: 'Grade 1', title: 'Grade 1 Class Photo 2023', description: 'Grade 1 students showing their enthusiasm for learning' },
  { src: '/Grade2.jpg', grade: 'Grade 2', title: 'Grade 2 Class Photo 2023', description: 'Grade 2 students growing in knowledge and friendship' },
  { src: '/Grade3.jpg', grade: 'Grade 3', title: 'Grade 3 Class Photo 2023', description: 'Grade 3 students developing their academic skills' },
  { src: '/Grade4.jpg', grade: 'Grade 4', title: 'Grade 4 Class Photo 2023', description: 'Grade 4 students building strong foundations' },
  { src: '/Grade5.jpg', grade: 'Grade 5', title: 'Grade 5 Class Photo 2023', description: 'Grade 5 students preparing for middle school' },
  { src: '/Grade6.jpg', grade: 'Grade 6', title: 'Grade 6 Class Photo 2023', description: 'Grade 6 students becoming confident learners' },
  { src: '/Grade7.jpg', grade: 'Grade 7', title: 'Grade 7 Class Photo 2023', description: 'Grade 7 students ready for their next chapter' },
];

const staffPhoto: StaffPhoto = {
  src: '/Staff.jpg',
  title: 'Faculty & Staff 2023',
  description: 'Our dedicated team of educators and staff members who make Holy Cross Convent School Brooklyn a wonderful place to learn and grow.',
};

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const allImages: GalleryImage[] = [...cardinalPhotos, ...gradePhotos, staffPhoto];

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageClick = (imageSrc: string, imageIndex: number) => {
    setSelectedImage(imageSrc);
    setCurrentImageIndex(imageIndex);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handlePrevious = () => {
    const newIndex = currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex].src);
  };

  const handleNext = () => {
    const newIndex = currentImageIndex === allImages.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex].src);
  };

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => new Set(prev).add(src));
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedImage) return;
      
      switch (event.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentImageIndex]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header with enhanced styling */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: '#1a237e', 
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem' },
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            mb: 2,
          }}
        >
          School Gallery
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ 
            mb: 3,
            fontWeight: 400,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          Capturing precious moments and memories of our school community
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`${allImages.length} Photos`}
            color="primary" 
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip 
            label="2023 Collection" 
            color="secondary" 
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Box>

      {/* Cardinal Visit Section */}
      <GallerySection>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              color: '#1a237e', 
              fontWeight: 600,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
            }}
          >
            <PhotoIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#ffd700' }} />
            Cardinal Stephen Brislin Visit
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 3, 
              maxWidth: '600px', 
              mx: 'auto',
              fontSize: '1.1rem',
            }}
          >
            A special visit from His Eminence Cardinal Stephen Brislin to our school community
          </Typography>
          <Chip 
            label="Special Visit" 
            color="primary" 
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
          gap: 3,
          '& > *:nth-of-type(4)': {
            gridColumn: { md: '2 / 3' },
            justifySelf: 'center',
          }
        }}>
          {cardinalPhotos.map((photo, index) => (
            <ImageCard key={photo.src} onClick={() => handleImageClick(photo.src, index)}>
              {!loadedImages.has(photo.src) && (
                <LoadingSkeleton variant="rectangular" height={300} />
              )}
              <CardMedia
                component="img"
                height="300"
                image={photo.src}
                alt={photo.title}
                sx={{ 
                  objectFit: 'cover',
                  display: loadedImages.has(photo.src) ? 'block' : 'none',
                }}
                onLoad={() => handleImageLoad(photo.src)}
              />
              <ImageOverlay className="image-overlay">
                <Typography variant="h6" color="white" textAlign="center">
                  Click to view
                </Typography>
              </ImageOverlay>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
                  {photo.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {photo.description}
                </Typography>
              </CardContent>
            </ImageCard>
          ))}
        </Box>
      </GallerySection>

      {/* Grade Class Photos Section */}
      <GallerySection>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
            }}
          >
            <PhotoIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#ffd700' }} />
            Grade Class Photos 2023
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              maxWidth: '600px', 
              mx: 'auto',
              fontSize: '1.1rem',
            }}
          >
            Our wonderful students from Grade 0 to Grade 7 - the heart of our school community
          </Typography>
          <Chip 
            label="Class Photos" 
            color="primary" 
            variant="outlined"
            sx={{ 
              fontWeight: 600,
              backgroundColor: 'white',
              color: '#1a237e',
              borderColor: '#ffd700',
              borderWidth: '2px',
              '&:hover': {
                backgroundColor: '#ffd700',
                color: '#1a237e',
              }
            }}
          />
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, 
          gap: 3 
        }}>
          {gradePhotos.map((photo, index) => (
            <ImageCard key={photo.src} onClick={() => handleImageClick(photo.src, cardinalPhotos.length + index)}>
              {!loadedImages.has(photo.src) && (
                <LoadingSkeleton variant="rectangular" height={300} />
              )}
              <CardMedia
                component="img"
                height="300"
                image={photo.src}
                alt={photo.title}
                sx={{ 
                  objectFit: 'cover',
                  display: loadedImages.has(photo.src) ? 'block' : 'none',
                }}
                onLoad={() => handleImageLoad(photo.src)}
              />
              <ImageOverlay className="image-overlay">
                <Typography variant="h6" color="white" textAlign="center">
                  Click to view
                </Typography>
              </ImageOverlay>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
                  {photo.grade}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Class Photo 2023
                </Typography>
              </CardContent>
            </ImageCard>
          ))}
        </Box>
      </GallerySection>

      {/* Staff Photo Section */}
      <GallerySection>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              color: '#1a237e', 
              fontWeight: 600,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
            }}
          >
            <PhotoIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#ffd700' }} />
            Faculty & Staff 2023
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              maxWidth: '600px', 
              mx: 'auto',
              fontSize: '1.1rem',
            }}
          >
            Our dedicated team of educators and staff members who inspire excellence every day
          </Typography>
          <Chip 
            label="Staff Photo" 
            color="primary" 
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ maxWidth: 800, width: '100%' }}>
            <ImageCard onClick={() => handleImageClick(staffPhoto.src, cardinalPhotos.length + gradePhotos.length)}>
              {!loadedImages.has(staffPhoto.src) && (
                <LoadingSkeleton variant="rectangular" height={600} />
              )}
              <CardMedia
                component="img"
                height="600"
                image={staffPhoto.src}
                alt={staffPhoto.title}
                sx={{ 
                  objectFit: 'contain',
                  display: loadedImages.has(staffPhoto.src) ? 'block' : 'none',
                }}
                onLoad={() => handleImageLoad(staffPhoto.src)}
              />
              <ImageOverlay className="image-overlay">
                <Typography variant="h6" color="white" textAlign="center">
                  Click to view
                </Typography>
              </ImageOverlay>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" component="h3" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
                  Faculty & Staff
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                  {staffPhoto.description}
                </Typography>
              </CardContent>
            </ImageCard>
          </Box>
        </Box>
      </GallerySection>

      {/* Enhanced Lightbox Dialog */}
      <StyledDialog
        open={!!selectedImage}
        onClose={handleClose}
        maxWidth={false}
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogContent sx={{ p: 0, position: 'relative', overflow: 'hidden' }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'white',
              zIndex: 2,
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.8)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '80vh',
            position: 'relative',
          }}>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: 24,
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
                zIndex: 2,
              }}
            >
              <PrevIcon />
            </IconButton>

            <img
              src={selectedImage || ''}
              alt="Gallery"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            />

            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 24,
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
                zIndex: 2,
              }}
            >
              <NextIcon />
            </IconButton>
          </Box>

          {selectedImage && allImages[currentImageIndex] && (
            <Box sx={{ 
              position: 'absolute', 
              bottom: 24, 
              left: '50%', 
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              px: 4,
              py: 2,
              borderRadius: 3,
              textAlign: 'center',
              maxWidth: '80%',
              zIndex: 2,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {allImages[currentImageIndex].title}
              </Typography>
              {allImages[currentImageIndex].description && (
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {allImages[currentImageIndex].description}
                </Typography>
              )}
              <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                {currentImageIndex + 1} of {allImages.length}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </StyledDialog>

      {/* Back to Top Button */}
      <Zoom in={showBackToTop}>
        <BackToTopButton
          color="primary"
          size="large"
          onClick={handleBackToTop}
          aria-label="Back to top"
        >
          <ArrowUpIcon />
        </BackToTopButton>
      </Zoom>
    </Container>
  );
};

export default Gallery; 