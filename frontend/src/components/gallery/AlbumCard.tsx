import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { PhotoLibrary, Collections } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Album } from '../../services/galleryService';
import GalleryService from '../../services/galleryService';

const AlbumCardContainer = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  border: 'none',
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
    transform: 'scaleX(0)',
    transition: 'transform 0.4s ease',
    zIndex: 1
  },
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: '0 24px 48px rgba(211, 47, 47, 0.2)',
    '&::before': {
      transform: 'scaleX(1)',
    }
  }
}));

interface AlbumCardProps {
  album: Album;
  onClick?: (album: Album) => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(album);
    } else {
      navigate(`/gallery/album/${album.id}`);
    }
  };

  const getCoverImageUrl = () => {
    // First try coverImage
    if (album.coverImage?.fileName) {
      return GalleryService.getItemImageUrl(album.coverImage.fileName, album.coverImage.filePath);
    }
    // Fallback to first item in album if available
    if (album.items && album.items.length > 0) {
      const firstImage = album.items.find(item => item.type === 'IMAGE');
      if (firstImage?.fileName) {
        return GalleryService.getItemImageUrl(firstImage.fileName, firstImage.filePath);
      }
    }
    return null;
  };

  const imageCount = album._count?.items || album.items?.length || 0;
  const subAlbumCount = album._count?.subAlbums || album.subAlbums?.length || 0;
  const coverImageUrl = getCoverImageUrl();

  return (
    <AlbumCardContainer onClick={handleClick}>
      <Box sx={{ position: 'relative', width: '100%', height: 320, overflow: 'hidden', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {coverImageUrl ? (
          <CardMedia 
            component="img" 
            image={coverImageUrl} 
            alt={album.title} 
            sx={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              }
            }} 
            loading="lazy"
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#999' }}>
            <PhotoLibrary sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="body2" sx={{ opacity: 0.7 }}>No cover image</Typography>
          </Box>
        )}
        <Box sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(0,0,0,0.7)', color: '#fff', px: 1.5, py: 0.75, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Collections sx={{ fontSize: 18 }} />
          {imageCount} {imageCount === 1 ? 'photo' : 'photos'}
        </Box>
        {(album.albumType === 'CLASS' && album.classGrade) && (
          <Chip label={album.classGrade} sx={{ position: 'absolute', bottom: 16, left: 16, bgcolor: '#1a237e', color: '#fff', fontWeight: 700 }} />
        )}
        {album.albumType === 'GENERAL' && album.phase && (
          <Chip
            label={album.phase}
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              bgcolor: '#ffd700',
              color: '#1a237e',
              fontWeight: 700,
            }}
          />
        )}
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            color: '#1a237e', 
            mb: 1,
            fontFamily: '"Poppins", sans-serif',
            fontSize: '1.1rem'
          }}
        >
          {album.title}
        </Typography>
        {album.description && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666', 
              mb: 2,
              fontFamily: '"Poppins", sans-serif',
              lineHeight: 1.6
            }}
          >
            {album.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={album.albumType === 'CLASS' ? 'Class Photos' : 'Event Album'} 
            size="small" 
            sx={{ 
              bgcolor: album.albumType === 'CLASS' ? '#1a237e' : '#d32f2f', 
              color: '#fff', 
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24
            }} 
          />
          {subAlbumCount > 0 && (
            <Chip
              label={`${subAlbumCount} ${subAlbumCount === 1 ? 'sub-album' : 'sub-albums'}`}
              size="small"
              sx={{
                bgcolor: '#e8eaf6',
                color: '#1a237e',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24,
              }}
            />
          )}
        </Box>
      </CardContent>
    </AlbumCardContainer>
  );
};

export default AlbumCard;


