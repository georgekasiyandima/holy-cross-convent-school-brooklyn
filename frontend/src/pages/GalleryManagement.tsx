import React, { useState, useEffect, useRef } from 'react';
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
  Badge,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Upload,
  Image,
  VideoFile,
  FilterList,
  Search,
  MoreVert,
  Visibility,
  Download,
  Share,
  Tag,
  Category
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AdminLayout from '../components/AdminLayout';

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: 'EVENTS' | 'SPORTS' | 'ACADEMIC' | 'CULTURAL' | 'GENERAL';
  type: 'IMAGE' | 'VIDEO';
  filePath: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'GENERAL' as GalleryItem['category'],
    tags: '',
  });

  const categories = [
    { value: 'EVENTS', label: 'Events', color: '#2196f3' },
    { value: 'SPORTS', label: 'Sports', color: '#4caf50' },
    { value: 'ACADEMIC', label: 'Academic', color: '#ff9800' },
    { value: 'CULTURAL', label: 'Cultural', color: '#9c27b0' },
    { value: 'GENERAL', label: 'General', color: '#607d8b' },
  ];

  useEffect(() => {
    fetchItems();
  }, [filterCategory, searchTerm]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/gallery?${params}`);
      if (!response.ok) throw new Error('Failed to fetch gallery items');
      
      const data = await response.json();
      setItems(data.items || []);
    } catch (err) {
      setError('Failed to load gallery items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

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
      setUploadProgress(0);
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('tags', formData.tags);

      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Upload failed');

      setSuccess('File uploaded successfully');
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setFormData({ title: '', description: '', category: 'GENERAL', tags: '' });
      fetchItems();
    } catch (err) {
      setError('Failed to upload file');
      console.error('Upload error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) throw new Error('Delete failed');

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
                        image={`/uploads/gallery/${item.fileName}`}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    label="Category"
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Tags (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., sports, awards, graduation"
                />
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
      </Box>
    </AdminLayout>
  );
};

export default GalleryManagement;
