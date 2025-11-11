import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Fab,
  LinearProgress,
  Alert,
  Paper,
  Tabs,
  Tab,
  Menu,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Upload,
  VideoFile,
  Search,
  MoreVert,
  Visibility,
  Download,
  Share,
  Facebook,
  Instagram,
  Twitter,
  MusicNote
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AdminLayout from '../components/AdminLayout';
import GalleryService, { GalleryItem, Album } from '../services/galleryService';
import CreateAlbumDialog from '../components/gallery/CreateAlbumDialog';

const UploadArea = styled(Box)(({ theme }) => ({
  border: '2px dashed #ccc',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '10',
  },
  '&.drag-active': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '20',
  }
}));

const GalleryCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  }
}));

const GalleryManagement: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createAlbumDialogOpen, setCreateAlbumDialogOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'GENERAL' as GalleryItem['category'],
    tags: '',
    albumId: '',
    postToSocial: false,
  });
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumType, setAlbumType] = useState<'GENERAL' | 'CLASS'>('GENERAL');
  const [classGrade, setClassGrade] = useState<string>('');

  const categories = [
    { value: 'EVENTS', label: 'Events', color: '#2196f3' },
    { value: 'SPORTS', label: 'Sports', color: '#4caf50' },
    { value: 'ACADEMIC', label: 'Academic', color: '#ff9800' },
    { value: 'CULTURAL', label: 'Cultural', color: '#9c27b0' },
    { value: 'GENERAL', label: 'General', color: '#607d8b' },
  ];

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await GalleryService.getGalleryItems({
        category: filterCategory !== 'all' ? filterCategory : undefined,
        isPublished: undefined, // Get all items for admin
        limit: 100
      });
      // Filter by search term on client side
      let filteredItems = response.items;
      if (searchTerm) {
        filteredItems = filteredItems.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      setItems(filteredItems);
    } catch (err: any) {
      setError(err.message || 'Failed to load gallery items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, [filterCategory, searchTerm]);

  const fetchAlbums = useCallback(async () => {
    try {
      const allAlbums = await GalleryService.getAlbums({
        isPublished: undefined,
      });
      setAlbums(allAlbums);
    } catch (err) {
      console.error('Error fetching albums:', err);
    }
  }, []);

  useEffect(() => {
    fetchItems();
    fetchAlbums();
  }, [fetchItems, fetchAlbums]);
  const filteredAlbums = useMemo(() => {
    let list = albums;
    if (albumType) {
      list = list.filter((album) => album.albumType === albumType);
    }
    if (albumType === 'CLASS' && classGrade) {
      list = list.filter((album) =>
        album.classGrade?.toLowerCase().includes(classGrade.toLowerCase())
      );
    }
    return list;
  }, [albums, albumType, classGrade]);

  const buildAlbumLabel = useCallback(
    (album: Album) => {
      const titleParts = [album.title];
      const visited = new Set<string>([album.id]);
      let current: Album | undefined = album;

      while (current?.parentAlbumId) {
        if (visited.has(current.parentAlbumId)) {
          break;
        }
        visited.add(current.parentAlbumId);
        current = albums.find((a) => a.id === current?.parentAlbumId);
        if (current) {
          titleParts.unshift(current.title);
        }
      }

      const meta: string[] = [];
      if (album.phase) meta.push(album.phase);
      if (album.classGrade) meta.push(album.classGrade);

      return `${titleParts.join(' › ')}${meta.length ? ` (${meta.join(' • ')})` : ''}`;
    },
    [albums]
  );

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    setSelectedFile(file);
    setFormData(prev => ({
      ...prev,
      title: file.name.split('.')[0] || '',
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setError(null);
      
      const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
      
      await GalleryService.uploadGalleryItem(selectedFile, {
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        albumId: formData.albumId || undefined,
        isPublished: true,
        postToSocial: formData.postToSocial
      });

      setSuccess('File uploaded successfully' + (formData.postToSocial ? ' and posted to social media!' : ''));
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setFormData({ title: '', description: '', category: 'GENERAL', tags: '', albumId: '', postToSocial: false });
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      console.error('Upload error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await GalleryService.deleteGalleryItem(id);
      setSuccess('Item deleted successfully');
      fetchItems();
    } catch (err) {
      setError('Failed to delete item');
      console.error('Delete error:', err);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || '#607d8b';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#1a237e' }}>
          Gallery Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Controls */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search gallery..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
              }}
              sx={{ minWidth: 200 }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setUploadDialogOpen(true)}
              sx={{ ml: 'auto' }}
            >
              Upload Media
            </Button>
          </Box>

          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="All Media" />
            <Tab label="Images" />
            <Tab label="Videos" />
          </Tabs>
        </Paper>

        {/* Gallery Grid */}
        {loading ? (
          <LinearProgress />
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {filteredItems.map((item) => (
              <Box key={item.id} sx={{ flex: '1 1 250px', minWidth: '250px', maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)', lg: 'calc(25% - 18px)' } }}>
                <GalleryCard>
                  <Box sx={{ position: 'relative' }}>
                    {item.type === 'IMAGE' ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={GalleryService.getItemImageUrl(item.fileName)}
                        alt={item.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{ height: 200, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <VideoFile sx={{ fontSize: 48, color: '#666' }} />
                      </Box>
                    )}
                    
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setSelectedItem(item);
                        }}
                        sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    <Chip
                      label={item.category}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: getCategoryColor(item.category),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>

                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                      {item.tags.length > 3 && (
                        <Chip label={`+${item.tags.length - 3}`} size="small" variant="outlined" />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(item.fileSize)} • {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </GalleryCard>
              </Box>
            ))}
          </Box>
        )}

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogContent>
            <UploadArea
              className={dragActive ? 'drag-active' : ''}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload sx={{ fontSize: 48, color: 'action.active', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                {selectedFile ? selectedFile.name : 'Drag & drop files here or click to browse'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supports images and videos up to 10MB
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*,video/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
            </UploadArea>

            {selectedFile && (
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                      onChange={(e) => {
                      const newCategory = e.target.value as any;
                      setFormData(prev => ({ ...prev, category: newCategory }));
                    }}
                    label="Category"
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel>Album Type</InputLabel>
                    <Select
                      value={albumType}
                      label="Album Type"
                      onChange={(e) => setAlbumType(e.target.value as any)}
                    >
                      <MenuItem value="GENERAL">General</MenuItem>
                      <MenuItem value="CLASS">Class</MenuItem>
                    </Select>
                  </FormControl>
                  {albumType === 'CLASS' && (
                    <TextField
                      label="Class/Grade"
                      value={classGrade}
                      onChange={(e) => setClassGrade(e.target.value)}
                      placeholder="e.g., Grade 1"
                    />
                  )}
                  <FormControl sx={{ minWidth: 220 }}>
                    <InputLabel>Album</InputLabel>
                    <Select
                      value={formData.albumId}
                      label="Album"
                      onChange={(e) => setFormData(prev => ({ ...prev, albumId: e.target.value }))}
                    >
                      <MenuItem value="">No album</MenuItem>
                      {filteredAlbums.map(a => (
                        <MenuItem key={a.id} value={a.id}>
                          {buildAlbumLabel(a)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setCreateAlbumDialogOpen(true)}
                  >
                    New Album
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  label="Tags (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., sports, awards, graduation"
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.postToSocial}
                      onChange={(e) => setFormData(prev => ({ ...prev, postToSocial: e.target.checked }))}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Share sx={{ fontSize: 20 }} />
                      <Typography variant="body1">
                        Post to Social Media
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                        <Facebook sx={{ fontSize: 18, color: '#1877F2' }} />
                        <Instagram sx={{ fontSize: 18, color: '#E4405F' }} />
                        <Twitter sx={{ fontSize: 18, color: '#1DA1F2' }} />
                        <MusicNote sx={{ fontSize: 18, color: '#000000' }} />
                      </Box>
                    </Box>
                  }
                  sx={{ mb: 2 }}
                />
                {formData.postToSocial && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Image will be posted to configured social media platforms after upload.
                  </Alert>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFile || !formData.title}
            >
              Upload
            </Button>
          </DialogActions>
        </Dialog>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><Visibility /></ListItemIcon>
            <ListItemText>View</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><Edit /></ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><Download /></ListItemIcon>
            <ListItemText>Download</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><Share /></ListItemIcon>
            <ListItemText>Share</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => {
              if (selectedItem) handleDelete(selectedItem.id);
              setAnchorEl(null);
            }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon><Delete color="error" /></ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setUploadDialogOpen(true)}
        >
          <Add />
        </Fab>

        {/* Create Album Dialog */}
        <CreateAlbumDialog
          open={createAlbumDialogOpen}
          onClose={() => setCreateAlbumDialogOpen(false)}
          onSuccess={async (album) => {
            setSuccess(`Album "${album.title}" created successfully!`);
            await fetchAlbums();
            // Auto-select the newly created album
            setFormData(prev => ({ ...prev, albumId: album.id }));
          }}
          initialAlbumType={albumType}
          initialCategory={formData.category}
        />
      </Box>
    </AdminLayout>
  );
};

export default GalleryManagement;
