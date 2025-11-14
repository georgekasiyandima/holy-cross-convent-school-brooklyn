import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, Button, Paper, styled, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FaxIcon from '@mui/icons-material/Fax';
import LanguageIcon from '@mui/icons-material/Language';
import FlagIcon from '@mui/icons-material/Flag';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';
import { DocumentServiceInstance as documentService, Document } from '../services/documentService';

const Banner = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '500px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'url("/xul.jpg") center/cover no-repeat',
  backgroundPosition: 'center 40%',
  backgroundSize: 'cover',
  textAlign: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,35,126,.80), rgba(211,47,47,.60))',
    zIndex: 0
  },
  '& > *': { position: 'relative', zIndex: 1 }
}));

// Helper function to get document image URL from API response or fallback
const getDocumentImageUrl = (document: Document | null | undefined, fallback: string): string => {
  if (document && document.fileUrl) {
    return documentService.getDocumentDownloadUrl(document.fileUrl);
  }
  return fallback;
};

const quickFacts = [
  { icon: <AccessTimeIcon color="primary" />, label: 'School Hours', value: '07:45 – 14:30 (Mon–Fri)' },
  { icon: <SchoolIcon color="primary" />, label: 'Grades', value: 'Grade R – Grade 7' },
  { icon: <EmailIcon color="primary" />, label: 'Email', value: 'admin@holycrossbrooklyn.co.za' },
  { icon: <PhoneIcon color="primary" />, label: 'Phone', value: '021 5114337' },
  { icon: <FaxIcon color="primary" />, label: 'Fax', value: '021 511 9690' },
  { icon: <LocationOnIcon color="primary" />, label: 'Address', value: '162 Koeberg Road Brooklyn 7405' },
  { icon: <LanguageIcon color="primary" />, label: 'Website', value: 'http://www.holycrossbrooklyn.co.za' },
];

const galleryImages = [
  'ROBTX1.jpg',
  'ROBT7.jpg',
  'ROBT4.jpg',
  'acads1.jpg'
];

const Info: React.FC = () => {
  const navigate = useNavigate();
  const [missionDoc, setMissionDoc] = useState<Document | null>(null);
  const [visionDoc, setVisionDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback image URLs (from public folder)
  // Note: If HCCVS.jpeg doesn't exist, use HCCMS.jpeg as temporary fallback
  const missionFallback = '/HCCMS.jpeg';
  const visionFallback = '/HCCMS.jpeg'; // Using HCCMS temporarily until HCCVS.jpeg is uploaded

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchStatements = async (signal: AbortSignal) => {
      setLoading(true);
      try {
        const findImageDocument = async (categories: string[], keyword: string): Promise<Document | null> => {
          if (signal.aborted) return null;
          
          for (const category of categories) {
            if (signal.aborted) return null;
            
            try {
              const docs = await documentService.getDocumentsByCategory(category, true);
              const imageDoc = docs.find((doc) => doc.mimeType.startsWith('image/'));
              if (imageDoc) {
                return imageDoc;
              }
            } catch (error) {
              // Silently handle errors
              if (signal.aborted) return null;
            }
          }

          if (signal.aborted) return null;

          try {
            const allDocs = await documentService.getAllPublishedDocuments();
            const imageDoc = allDocs.find((doc) => {
              if (!doc.mimeType.startsWith('image/')) {
                return false;
              }
              const haystack = `${doc.title} ${doc.category} ${doc.tags.join(' ')} ${doc.fileName}`.toLowerCase();
              return haystack.includes(keyword.toLowerCase());
            });
            if (imageDoc) {
              return imageDoc;
            }
          } catch (error) {
            // Silently handle errors
            if (signal.aborted) return null;
          }

          return null;
        };

        const [vision, mission] = await Promise.all([
          findImageDocument(['vision', 'vision-statement', 'vision_statement'], 'vision'),
          findImageDocument(['mission', 'mission-statement', 'mission_statement'], 'mission'),
        ]);

        if (signal.aborted) return;

        setVisionDoc(vision);
        if (mission && vision && mission.id === vision.id) {
          setMissionDoc(null);
        } else {
          setMissionDoc(mission);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchStatements(controller.signal);
    
    return () => {
      controller.abort();
    };
  }, []);

  // Get image URLs - CRITICAL: Ensure vision and mission are never mixed
  // For mission: leave empty if not found (as per user request)
  // For vision: use document if found, otherwise show message
  // For holy cross family: use fallback if document not found
  
  // CRITICAL CHECK: Ensure visionDoc is never used for mission
  const missionImageUrl: string | null = missionDoc && missionDoc.id !== visionDoc?.id 
    ? getDocumentImageUrl(missionDoc, missionFallback) 
    : null;
  
  // CRITICAL CHECK: Ensure visionDoc is used for vision
  const visionImageUrl: string = visionDoc 
    ? getDocumentImageUrl(visionDoc, visionFallback) 
    : visionFallback;

  return (
    <>
      <SEO 
        title="School Info - Holy Cross Convent School Brooklyn" 
        description="Learn about Holy Cross Convent School Brooklyn, our mission, vision, and community values."
        image="/xul.jpg"
      />
    
    {/* Banner Section */}
    <Banner>
      <Container maxWidth="lg" sx={{ position: 'relative', px: { xs: 2, sm: 4 }, py: 8 }}>
        {/* Return to Home - positioned to avoid header/logo */}
        <Box sx={{ 
          position: 'absolute',
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 10,
          '& .MuiTypography-root': {
            color: 'white !important',
            textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(26, 35, 126, 0.7)',
            padding: '8px 16px',
            borderRadius: '8px',
            display: 'inline-block',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              transform: 'translateX(-2px)',
              backgroundColor: 'rgba(26, 35, 126, 0.9)',
            },
            transition: 'all 0.3s ease'
          }
        }}>
          <ReturnToHome />
        </Box>
        <Typography 
          component="h1"
          variant="h1" 
          sx={{ 
            fontWeight: 900,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            mb: 2,
            color: '#ffd700',
            textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9), 0 0 60px rgba(26,35,126,0.6)',
            letterSpacing: '0.5px'
          }}
        >
          Holy Cross Convent School
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#ffffff',
            fontWeight: 600,
            textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8)',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          Brooklyn, Cape Town
        </Typography>
      </Container>
    </Banner>

    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Mission Statement - as Image */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          borderRadius: 3,
          border: '1px solid #1a237e',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
            borderRadius: '12px 12px 0 0',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FlagIcon 
            sx={{ 
              fontSize: '2.5rem', 
              color: '#1a237e', 
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
            Our Mission
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : missionImageUrl ? (
            <Box
              component="img"
              src={missionImageUrl}
              alt="Holy Cross Convent School Mission Statement Document"
              loading="lazy"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                const currentSrc = target.src;
                // Prevent infinite loop - if already using fallback, stop
                if (currentSrc.includes(missionFallback) || currentSrc.endsWith(missionFallback)) {
                  target.style.display = 'none';
                  return;
                }
                target.src = missionFallback;
              }}
              sx={{
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(26, 35, 126, 0.15)',
                maxWidth: '600px',
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                mx: 'auto'
              }}
            />
          ) : (
            <Typography variant="body1" sx={{ color: 'text.secondary', py: 4, fontStyle: 'italic' }}>
              Mission statement coming soon...
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Vision Statement - as Image */}
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          borderRadius: 3,
        border: '1px solid #d32f2f',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
          borderRadius: '12px 12px 0 0',
        }
      }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <VisibilityIcon 
            sx={{ 
              fontSize: '2.5rem', 
              color: '#d32f2f', 
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
            Our Vision
      </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : visionDoc ? (
            <Box
              component="img"
              src={visionImageUrl}
              alt="Holy Cross Convent School Vision Statement Document"
              loading="lazy"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                const currentSrc = target.src;
                // Prevent infinite loop - if already using fallback, stop
                if (currentSrc.includes(visionFallback) || currentSrc.endsWith(visionFallback)) {
                  target.style.display = 'none';
                  return;
                }
                target.src = visionFallback;
              }}
              sx={{
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(26, 35, 126, 0.15)',
                maxWidth: '600px',
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                mx: 'auto'
              }}
            />
          ) : (
            <Typography variant="body1" sx={{ color: 'text.secondary', py: 4, fontStyle: 'italic' }}>
              Vision statement will be displayed here once uploaded. Please ensure the document is uploaded with category "vision" or "vision-statement" in the Admin Document Upload section.
            </Typography>
          )}
        </Box>
    </Paper>

    {/* Quick Facts */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#1a237e', 
            fontWeight: 700,
            mb: 3,
            textAlign: 'center'
          }}
        >
          School Information
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2 
        }}>
      {quickFacts.map((fact) => (
        <Box
          key={fact.label}
          sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 12px)' } }}
        >
              <Card sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2,
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(26, 35, 126, 0.15)'
                },
                '&:focus-visible': {
                  outline: '3px solid #ffd700',
                  outlineOffset: '4px',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(26, 35, 126, 0.15)'
                }
              }}>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  {fact.icon}
                </Box>
            <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                {fact.label}
              </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {fact.value}
                  </Typography>
            </Box>
          </Card>
        </Box>
      ))}
        </Box>
    </Box>

      {/* Quick Gallery */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700
            }}
          >
            School Gallery
          </Typography>
          <Button 
            variant="contained"
            onClick={() => navigate('/gallery')}
            sx={{
              backgroundColor: '#1a237e',
              color: '#fff',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#283593',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(26, 35, 126, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            View Full Gallery →
          </Button>
        </Box>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          },
          gap: 2,
          // Fallback for older browsers
          '@supports not (grid-template-columns: repeat(4, 1fr))': {
            display: 'flex',
            flexWrap: 'wrap',
            '& > *': {
              flex: '1 1 200px',
              minWidth: '200px'
            }
          }
        }}>
          {galleryImages.map((img, idx) => (
            <Card 
              key={img}
              sx={{ 
                overflow: 'hidden',
                borderRadius: 2,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(26, 35, 126, 0.25)'
                },
                '&:focus-visible': {
                  outline: '3px solid #ffd700',
                  outlineOffset: '4px',
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(26, 35, 126, 0.25)'
                }
              }}
            >
              <Box
                component="img"
                src={`/${img}`}
                alt={`School campus photo ${idx + 1} - ${img.replace('.jpg', '').replace(/\d/g, '')}`}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: { xs: 200, sm: 180, md: 160 },
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Card>
        ))}
      </Box>
    </Box>

      {/* Logo Symbolism */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Paper 
          elevation={2}
          sx={{ 
            p: 4,
            background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
            borderRadius: 3,
            border: '1px solid rgba(26, 35, 126, 0.1)'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 600, 
              mb: 2 
            }}
          >
            Discover Our Heritage
      </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Learn about the rich symbolism and meaning behind our school logo, representing our values and Catholic heritage.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/logo-symbolism')}
            sx={{
              backgroundColor: '#1a237e',
              color: '#fff',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#283593',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(26, 35, 126, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
      >
        View Logo Symbolism
      </Button>
        </Paper>
    </Box>
  </Container>
  </>
);
};

export default Info;
