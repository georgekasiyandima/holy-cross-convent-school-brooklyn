import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Slide } from '@mui/material';

interface FeatureItem {
  icon: React.ReactElement;
  title: string;
  description: string;
  images: string[];
  color: string;
}

interface ProgressiveFeaturesCollageProps {
  features: FeatureItem[];
}

const CollageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(2),
  height: '100%',
  minHeight: '300px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.8) 0%, rgba(255, 215, 0, 0.1) 100%)',
    zIndex: 2,
  },
}));

const ImageGrid = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridTemplateRows: 'repeat(2, 1fr)',
  gap: '4px',
  zIndex: 1,
});

const ImageTile = styled(Box)<{ src: string; index: number }>(({ src, index }) => ({
  backgroundImage: `url('${src}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: index === 0 ? 1 : 0.7,
  transition: 'all 0.3s ease',
  '&:hover': {
    opacity: 1,
    transform: 'scale(1.05)',
  },
}));

const FeatureContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(3),
  zIndex: 3,
  color: 'white',
}));

const IconContainer = styled(Box)<{ color: string }>(({ theme, color }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${color} 0%, rgba(255, 255, 255, 0.2) 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
}));

const ProgressiveFeaturesCollage: React.FC<ProgressiveFeaturesCollageProps> = ({ features }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {features.map((feature, index) => (
        <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 24px)' } }}>
          <Slide direction="up" in timeout={800 + index * 200}>
            <Card
              sx={{
                height: '100%',
                minHeight: '350px',
                background: 'transparent',
                boxShadow: '0 8px 32px rgba(26, 35, 126, 0.2)',
                border: '1px solid rgba(26, 35, 126, 0.1)',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 48px rgba(26, 35, 126, 0.3)',
                },
              }}
            >
              <CollageContainer>
                <ImageGrid>
                  {feature.images.slice(0, 4).map((image, imgIndex) => (
                    <ImageTile
                      key={imgIndex}
                      src={image}
                      index={imgIndex}
                    />
                  ))}
                </ImageGrid>
                
                <FeatureContent>
                  <IconContainer color={feature.color}>
                    {React.cloneElement(feature.icon, { 
                      sx: { fontSize: 30, color: 'white' } 
                    })}
                  </IconContainer>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      fontSize: '1.1rem'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      lineHeight: 1.5,
                      opacity: 0.95,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      fontSize: '0.9rem'
                    }}
                  >
                    {feature.description}
                  </Typography>
                </FeatureContent>
              </CollageContainer>
            </Card>
          </Slide>
        </Box>
      ))}
    </Box>
  );
};

export default ProgressiveFeaturesCollage;
