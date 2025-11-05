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
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '1px solid #e0e0e0',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    borderColor: '#1a237e'
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
    if (album.coverImage?.fileName) {
      return GalleryService.getItemImageUrl(album.coverImage.fileName);
    }
    return null;
  };

  const imageCount = album._count?.items || album.items?.length || 0;
  const coverImageUrl = getCoverImageUrl();

  return (
    <AlbumCardContainer onClick={handleClick}>
      <Box sx={{ position: 'relative', width: '100%', height: 280, overflow: 'hidden', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {coverImageUrl ? (
          <CardMedia component="img" image={coverImageUrl} alt={album.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
        {album.albumType === 'CLASS' && album.classGrade && (
          <Chip label={album.classGrade} sx={{ position: 'absolute', bottom: 16, left: 16, bgcolor: '#1a237e', color: '#fff', fontWeight: 700 }} />
        )}
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>{album.title}</Typography>
        {album.description && <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>{album.description}</Typography>}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={album.albumType === 'CLASS' ? 'Class Photos' : 'Event Album'} size="small" sx={{ bgcolor: album.albumType === 'CLASS' ? '#1a237e' : '#d32f2f', color: '#fff', fontWeight: 600 }} />
        </Box>
      </CardContent>
    </AlbumCardContainer>
  );
};

export default AlbumCard;


