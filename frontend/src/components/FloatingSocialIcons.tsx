import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Facebook, Instagram, YouTube, MusicNote } from '@mui/icons-material';

const FloatingContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  padding: theme.spacing(1),
  backgroundColor: 'rgba(26, 35, 126, 0.9)',
  borderTopRightRadius: theme.spacing(2),
  borderBottomRightRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(26, 35, 126, 0.95)',
    boxShadow: '0 6px 30px rgba(0,0,0,0.3)',
  },
  [theme.breakpoints.down('md')]: {
    display: 'none', // Hide on mobile
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  '&:hover': {
    backgroundColor: '#ffd700',
    color: '#1a237e',
    transform: 'scale(1.2)',
  },
  transition: 'all 0.3s ease',
}));

const FloatingSocialIcons: React.FC = () => {
  const socialLinks = [
    { icon: <Facebook />, label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61553924237049' },
    { icon: <Instagram />, label: 'Instagram', url: 'https://www.instagram.com/holycrossbrooklyn' },
    { icon: <YouTube />, label: 'YouTube', url: 'https://www.youtube.com/@holycrossbrooklyn' },
    { icon: <MusicNote />, label: 'TikTok', url: 'https://www.tiktok.com/@holycrossbrooklyn' },
  ];

  return (
    <FloatingContainer>
      {socialLinks.map((social, index) => (
        <Tooltip key={index} title={social.label} placement="right" arrow>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            style={{ textDecoration: 'none' }}
          >
            <StyledIconButton>
              {social.icon}
            </StyledIconButton>
          </a>
        </Tooltip>
      ))}
    </FloatingContainer>
  );
};

export default FloatingSocialIcons;

