import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Event,
  Article,
  Announcement,
  Upload,
  Image,
  AttachFile
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

//---------------------------------------------------------
// STYLED COMPONENTS
//---------------------------------------------------------
const ManagementContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)',
  maxWidth: '1200px',
  margin: '0 auto',
  border: '1px solid rgba(26, 35, 126, 0.1)',
}));

const ActionCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(26, 35, 126, 0.15)',
  }
}));

//---------------------------------------------------------
// TYPES
//---------------------------------------------------------
interface ContentItem {
  id: string;
  type: 'event' | 'news' | 'announcement';
  title: string;
  content: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

//---------------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------------
const ContentManagement: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'event' | 'news' | 'announcement'>('event');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    isPublished: false,
    startDate: '',
    endDate: '',
    location: '',
    imageUrl: ''
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Here you would make API calls to create/update content
      console.log('Submitting content:', { type: selectedType, ...formData });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`${selectedType} ${isEditing ? 'updated' : 'created'} successfully!`);
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      isPublished: false,
      startDate: '',
      endDate: '',
      location: '',
      imageUrl: ''
    });
    setIsEditing(false);
    setEditingItem(null);
  };

  // Handle dialog open
  const handleDialogOpen = (type: 'event' | 'news' | 'announcement') => {
    setSelectedType(type);
    setIsDialogOpen(true);
    resetForm();
  };

  // Handle edit
  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setSelectedType(item.type);
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      isPublished: item.isPublished,
      startDate: '',
      endDate: '',
      location: '',
      imageUrl: ''
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);
      try {
        // API call to delete
        console.log('Deleting item:', id);
        await new Promise(resolve => setTimeout(resolve, 500));
        setSuccess('Item deleted successfully!');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete item');
      } finally {
        setLoading(false);
      }
    }
  };

  // Get category options based on type
  const getCategoryOptions = (type: string) => {
    switch (type) {
      case 'event':
        return ['Academic', 'Sports', 'Cultural', 'Technology', 'Celebration'];
      case 'news':
        return ['General', 'Academic', 'Sports', 'Infrastructure', 'Achievements'];
      case 'announcement':
        return ['Important', 'General', 'Reminder', 'Update'];
      default:
        return [];
    }
  };

  return (
    <ManagementContainer>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
          Content Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage school events, news, and announcements
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Action Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: { xs: '100%', md: 'calc(33.333% - 16px)' } }}>
          <ActionCard onClick={() => handleDialogOpen('event')}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Event sx={{ fontSize: 48, color: '#9c27b0', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Create Event
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add new school events and activities
              </Typography>
            </CardContent>
          </ActionCard>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: { xs: '100%', md: 'calc(33.333% - 16px)' } }}>
          <ActionCard onClick={() => handleDialogOpen('news')}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Article sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Write News
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Publish news articles and updates
              </Typography>
            </CardContent>
          </ActionCard>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: { xs: '100%', md: 'calc(33.333% - 16px)' } }}>
          <ActionCard onClick={() => handleDialogOpen('announcement')}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Announcement sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Post Announcement
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create important announcements
              </Typography>
            </CardContent>
          </ActionCard>
        </Box>
      </Box>

      {/* Content List */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
          Recent Content
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No content available. Create your first item using the buttons above.
          </Typography>
        </Paper>
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit' : 'Create'} {selectedType}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {getCategoryOptions(selectedType).map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {selectedType === 'event' && (
                <>
                  <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="End Date"
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </Box>
                </>
              )}
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Content"
                  multiline
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    />
                  }
                  label="Publish immediately"
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </ManagementContainer>
  );
};

export default ContentManagement;
