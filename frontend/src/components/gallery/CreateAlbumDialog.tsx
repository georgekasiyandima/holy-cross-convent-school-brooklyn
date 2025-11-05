import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Autocomplete,
  IconButton,
  Alert,
  Divider,
  Grid,
  Paper
} from '@mui/material';
import {
  Close,
  PhotoLibrary,
  Event,
  School,
  Add,
  CheckCircle,
  Info
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import GalleryService from '../../services/galleryService';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(3),
    maxWidth: '600px',
    width: '100%'
  }
}));

const DialogHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 3),
  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
  color: '#fff',
  borderRadius: `${theme.spacing(3)} ${theme.spacing(3)} 0 0`
}));

const EventTemplateCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '2px solid transparent',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: '#1a237e'
  },
  '&.selected': {
    borderColor: '#1a237e',
    backgroundColor: '#e3f2fd'
  }
}));

// Event templates for recurring events
const EVENT_TEMPLATES = [
  { name: 'Heritage Day', category: 'CULTURAL', icon: '🏛️' },
  { name: "Valentine's Day", category: 'EVENTS', icon: '💝' },
  { name: 'Youth Day', category: 'EVENTS', icon: '👥' },
  { name: "Father's Day", category: 'EVENTS', icon: '👨' },
  { name: "Mother's Day", category: 'EVENTS', icon: '👩' },
  { name: 'High Tea', category: 'EVENTS', icon: '☕' },
  { name: 'Colour Fun Run', category: 'SPORTS', icon: '🏃' },
  { name: "Cool Dude's Day", category: 'EVENTS', icon: '😎' },
  { name: "St Patrick's Day", category: 'EVENTS', icon: '🍀' },
  { name: 'Book Week', category: 'ACADEMIC', icon: '📚' },
  { name: 'Bake Sale', category: 'EVENTS', icon: '🧁' }
];

interface CreateAlbumDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (album: { id: string; title: string }) => void;
  initialAlbumType?: 'GENERAL' | 'CLASS';
  initialCategory?: string;
}

const CreateAlbumDialog: React.FC<CreateAlbumDialogProps> = ({
  open,
  onClose,
  onSuccess,
  initialAlbumType = 'GENERAL',
  initialCategory
}) => {
  const [albumType, setAlbumType] = useState<'GENERAL' | 'CLASS'>(initialAlbumType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [category, setCategory] = useState(initialCategory || 'EVENTS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const grades = ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'];

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setTitle('');
      setDescription('');
      setClassGrade('');
      setSelectedTemplate(null);
      setYear(new Date().getFullYear().toString());
      setError(null);
      setAlbumType(initialAlbumType);
      setCategory(initialCategory || 'EVENTS');
    }
  }, [open, initialAlbumType, initialCategory]);

  const handleTemplateSelect = (template: typeof EVENT_TEMPLATES[0]) => {
    setSelectedTemplate(template.name);
    setTitle(`${template.name} ${year}`);
    setCategory(template.category);
    setDescription(`Photos from ${template.name} ${year} celebration`);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Album title is required');
      return;
    }

    if (albumType === 'CLASS' && !classGrade) {
      setError('Please select a class grade');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const album = await GalleryService.createAlbum({
        title: title.trim(),
        description: description.trim() || undefined,
        albumType,
        classGrade: albumType === 'CLASS' ? classGrade : undefined,
        isPublished: true
      });

      onSuccess(album);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create album');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogHeader>
        <PhotoLibrary sx={{ fontSize: 32 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Create New Album
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Organize your photos into albums
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <Close />
        </IconButton>
      </DialogHeader>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Album Type Selection */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Album Type</InputLabel>
          <Select
            value={albumType}
            onChange={(e) => setAlbumType(e.target.value as 'GENERAL' | 'CLASS')}
            label="Album Type"
          >
            <MenuItem value="GENERAL">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Event />
                <span>General (Events & Occasions)</span>
              </Box>
            </MenuItem>
            <MenuItem value="CLASS">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School />
                <span>Class Photos</span>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* Event Templates for General Albums */}
        {albumType === 'GENERAL' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#666' }}>
              Quick Templates (Select to auto-fill)
            </Typography>
            <Grid container spacing={2}>
              {EVENT_TEMPLATES.map((template) => (
                <Grid item xs={6} sm={4} key={template.name}>
                  <EventTemplateCard
                    className={selectedTemplate === template.name ? 'selected' : ''}
                    onClick={() => handleTemplateSelect(template)}
                    elevation={selectedTemplate === template.name ? 4 : 1}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h4">{template.icon}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                        {template.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={template.category}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                  </EventTemplateCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Album Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#666' }}>
            Album Details
          </Typography>

          <TextField
            fullWidth
            label="Album Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={albumType === 'CLASS' ? 'e.g., Grade 1 Class Photo 2025' : 'e.g., Heritage Day 2025'}
            required
            sx={{ mb: 2 }}
            helperText={
              albumType === 'GENERAL'
                ? 'Include the event name and year (e.g., "Heritage Day 2025")'
                : 'Include the grade and year (e.g., "Grade 1 Class Photo 2025")'
            }
          />

          {albumType === 'CLASS' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Class Grade</InputLabel>
              <Select
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
                label="Class Grade"
              >
                {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                    {grade}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {albumType === 'GENERAL' && (
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="EVENTS">Events</MenuItem>
                  <MenuItem value="SPORTS">Sports</MenuItem>
                  <MenuItem value="ACADEMIC">Academic</MenuItem>
                  <MenuItem value="CULTURAL">Cultural</MenuItem>
                  <MenuItem value="GENERAL">General</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Year"
                value={year}
                onChange={(e) => {
                  const newYear = e.target.value;
                  if (/^\d{0,4}$/.test(newYear)) {
                    setYear(newYear);
                    // Update title if template is selected
                    if (selectedTemplate) {
                      setTitle(`${selectedTemplate} ${newYear || new Date().getFullYear()}`);
                    }
                  }
                }}
                sx={{ width: 120 }}
                placeholder="2025"
              />
            </Box>
          )}

          <TextField
            fullWidth
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            placeholder="Add a description for this album..."
          />
        </Box>

        <Alert severity="info" icon={<Info />} sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Tip:</strong> After creating the album, you can upload photos and assign them to this album.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          startIcon={<CheckCircle />}
          disabled={loading || !title.trim()}
          sx={{
            backgroundColor: '#1a237e',
            '&:hover': { backgroundColor: '#0d1458' }
          }}
        >
          {loading ? 'Creating...' : 'Create Album'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default CreateAlbumDialog;

