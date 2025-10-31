import React from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Grid,
  useTheme
} from '@mui/material';
import {
  AutoAwesome,
  EmojiEvents,
  Groups,
  Computer
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { holyCrossBrand } from '../theme/branding';

const HighlightCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  borderTop: '4px solid',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
  }
}));

interface Highlight {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  link?: string;
  icon: React.ReactElement;
  accentColor: string;
}

const highlights: Highlight[] = [
  {
    id: '1',
    title: 'Robotics Lab Launch',
    description: 'Newly launched computer lab with cutting-edge technology',
    image: '/ROBT008.jpg',
    category: 'Technology',
    date: '2024',
    link: '/robotics',
    icon: <Computer />,
    accentColor: '#ff9800'
  },
  {
    id: '2',
    title: 'Athletic Excellence',
    description: 'Outstanding achievements in sports and physical education',
    image: '/ATHLECTICS AWARDS25.jpg',
    category: 'Sports',
    date: '2024',
    link: '/sport',
    icon: <EmojiEvents />,
    accentColor: '#4caf50'
  },
  {
    id: '3',
    title: 'Cultural Festival Success',
    description: 'Celebrating arts and creativity in our vibrant community',
    image: '/AC2.jpg',
    category: 'Culture',
    date: '2024',
    link: '/cultural',
    icon: <AutoAwesome />,
    accentColor: '#9c27b0'
  },
  {
    id: '4',
    title: 'Community Outreach',
    description: 'Making a positive impact through service and compassion',
    image: '/ETHOS1.jpg',
    category: 'Service',
    date: '2024',
    link: '/service-ethos',
    icon: <Groups />,
    accentColor: '#d32f2f'
  }
];

const SchoolHighlights: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleHighlightClick = (link?: string) => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
      py: 8,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: holyCrossBrand.primaryGradient
      }
    }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            icon={<AutoAwesome />}
            label="School Highlights"
            sx={{
              backgroundColor: holyCrossBrand.signatureBlue,
              color: 'white',
              fontWeight: 600,
              mb: 3,
              px: 2,
              py: 3,
              fontSize: '1rem'
            }}
          />
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              color: holyCrossBrand.signatureBlue, 
              fontWeight: 800, 
              mb: 2,
              fontSize: 'clamp(2rem, 5vw, 3rem)'
            }}
          >
            Recent Achievements & Milestones
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#666', 
              maxWidth: '700px', 
              mx: 'auto',
              fontWeight: 400,
              fontSize: 'clamp(1rem, 2vw, 1.2rem)'
            }}
          >
            Celebrate with us as we continue our journey of excellence, 
            innovation, and service to the community.
          </Typography>
        </Box>

        {/* Highlights Grid */}
        <Grid container spacing={3}>
          {highlights.map((highlight) => (
            <Grid item xs={12} sm={6} md={3} key={highlight.id}>
              <HighlightCard
                onClick={() => handleHighlightClick(highlight.link)}
                sx={{
                  borderTopColor: highlight.accentColor,
                  '&:hover .highlight-image': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {/* Image */}
                <Box sx={{ position: 'relative', overflow: 'hidden', height: 250 }}>
                  <CardMedia
                    component="img"
                    image={highlight.image}
                    alt={highlight.title}
                    className="highlight-image"
                    sx={{
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      objectPosition: 'center'
                    }}
                  />
                  {/* Overlay Gradient */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(to bottom, transparent 0%, ${highlight.accentColor}40 100%)`
                    }}
                  />
                  {/* Category Badge */}
                  <Chip
                    icon={highlight.icon}
                    label={highlight.category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      fontWeight: 600,
                      border: `2px solid ${highlight.accentColor}`
                    }}
                  />
                </Box>

                {/* Content */}
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      color: holyCrossBrand.signatureBlue,
                      mb: 1.5,
                      lineHeight: 1.3
                    }}
                  >
                    {highlight.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      lineHeight: 1.6,
                      minHeight: '3rem'
                    }}
                  >
                    {highlight.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: highlight.accentColor, fontWeight: 600 }}>
                      {highlight.date}
                    </Typography>
                    {highlight.link && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: highlight.accentColor,
                          fontWeight: 600,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Learn More →
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </HighlightCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SchoolHighlights;

