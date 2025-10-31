import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Card, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { pillarColors } from '../theme/branding';

const CarouselContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  maxWidth: '1000px',
  margin: '0 auto',
  overflow: 'hidden',
  borderRadius: '16px'
});

const CarouselTrack = styled(Box)<{ currentIndex: number }>(({ currentIndex }) => ({
  display: 'flex',
  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: `translateX(-${currentIndex * 100}%)`
}));

const CarouselSlide = styled(Card)({
  minWidth: '100%',
  height: '400px',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  borderRadius: '16px'
});

const SlideContent = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '2rem',
  zIndex: 2
});

const SlideOverlay = styled(Box)<{ bgImage: string; accentColor: string }>(({ bgImage, accentColor }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url('${bgImage}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, rgba(26, 35, 126, 0.85) 0%, rgba(0,0,0,0.6) 100%)`,
    zIndex: 1
  }
}));

const NavButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  color: '#ffffff',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  zIndex: 3,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    border: '2px solid #ffd700'
  },
  transition: 'all 0.3s ease'
});

const DotsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '0.5rem',
  marginTop: '1rem'
});

const Dot = styled(Box)<{ active: boolean }>(({ active }) => ({
  width: active ? '24px' : '8px',
  height: '8px',
  borderRadius: '4px',
  backgroundColor: active ? '#ffd700' : 'rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
}));

interface PillarCarouselItem {
  pillar: string;
  accentColor: string;
  description: string;
  path: string;
  heroImage: string;
}

const pillars: PillarCarouselItem[] = [
  {
    pillar: 'Academic',
    accentColor: pillarColors.academic,
    description: 'Excellence in Learning',
    path: '/academic',
    heroImage: '/acad1.jpg'
  },
  {
    pillar: 'Robotics',
    accentColor: pillarColors.robotics,
    description: 'Technology & Innovation',
    path: '/robotics',
    heroImage: '/ROBT008.jpg'
  },
  {
    pillar: 'Sport',
    accentColor: pillarColors.sport,
    description: 'Teamwork & Excellence',
    path: '/sport',
    heroImage: '/sports9.jpg'
  },
  {
    pillar: 'Cultural',
    accentColor: pillarColors.cultural,
    description: 'Creativity & Expression',
    path: '/cultural',
    heroImage: '/AC2.jpg'
  },
  {
    pillar: 'Service & Ethos',
    accentColor: pillarColors.serviceEthos,
    description: 'Faith in Action',
    path: '/service-ethos',
    heroImage: '/ethomain.png'
  }
];

const PillarCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pillars.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + pillars.length) % pillars.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pillars.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSlideClick = (path: string) => {
    navigate(path);
  };

  return (
    <CarouselContainer>
      <CarouselTrack currentIndex={currentIndex}>
        {pillars.map((pillar, index) => (
          <CarouselSlide key={index} onClick={() => handleSlideClick(pillar.path)}>
            <SlideOverlay bgImage={pillar.heroImage} accentColor={pillar.accentColor} />
            <SlideContent>
              <Fade in timeout={800}>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                      color: '#ffffff',
                      textShadow: '4px 4px 8px rgba(0,0,0,0.9)',
                      mb: 2
                    }}
                  >
                    {pillar.pillar}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
                      color: pillar.accentColor,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
                    }}
                  >
                    {pillar.description}
                  </Typography>
                </Box>
              </Fade>
            </SlideContent>
          </CarouselSlide>
        ))}
      </CarouselTrack>

      <NavButton
        onClick={handlePrevious}
        sx={{ left: '1rem' }}
        aria-label="Previous pillar"
      >
        <NavigateBefore fontSize="large" />
      </NavButton>

      <NavButton
        onClick={handleNext}
        sx={{ right: '1rem' }}
        aria-label="Next pillar"
      >
        <NavigateNext fontSize="large" />
      </NavButton>

      <DotsContainer>
        {pillars.map((_, index) => (
          <Dot
            key={index}
            active={index === currentIndex}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to ${pillars[index].pillar}`}
          />
        ))}
      </DotsContainer>
    </CarouselContainer>
  );
};

export default PillarCarousel;

