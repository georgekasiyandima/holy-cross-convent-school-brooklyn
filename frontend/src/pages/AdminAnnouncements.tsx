import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Add,
  CloudUpload,
  Delete,
  Download,
  Edit,
  FilePresent,
  Image as ImageIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AdminLayout from '../components/AdminLayout';
import adminAnnouncementsService, {
  AdminAnnouncement,
  AdminAnnouncementPayload,
  UploadResponse,
} from '../services/adminAnnouncementsService';

const Hero = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 60%, #5c6bc0 100%)',
  color: '#fff',
  padding: theme.spacing(6, 0),
  borderBottomLeftRadius: theme.spacing(4),
  borderBottomRightRadius: theme.spacing(4),
}));

const priorityOptions = [
  { label: 'Normal', value: 'NORMAL' },
  { label: 'High', value: 'HIGH' },
  { label: 'Urgent', value: 'URGENT' },
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
];

interface FormState {
  id?: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  attachmentUrl: string;
  attachmentType: string;
  priority: string;
  isPublished: boolean;
  publishedAt: string;
}

const emptyFormState: FormState = {
  title: '',
  summary: '',
  content: '',
  imageUrl: '',
  attachmentUrl: '',
  attachmentType: '',
  priority: 'NORMAL',
  isPublished: true,
  publishedAt: '',
};

const toDateTimeLocal = (value?: string | null): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const offsetMs = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - offsetMs);
  return local.toISOString().slice(0, 16);
};

const formatDisplayDate = (value?: string | null): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState<{ status: 'all' | 'published' | 'draft'; search: string; priority: string }>({
    status: 'all',
    search: '',
    priority: 'all',
  });
  const [form, setForm] = useState<FormState>(emptyFormState);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAnnouncementsService.listAnnouncements({
        status: filters.status,
        search: filters.search || undefined,
        priority: filters.priority !== 'all' ? filters.priority : undefined,
      });
      setAnnouncements(data);
    } catch (err: any) {
      console.error('Failed to load announcements', err);
      setError('Unable to load announcements. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters.priority, filters.search, filters.status]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const handleInputChange =
    (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handlePriorityChange = (event: SelectChangeEvent<string>) => {
    setForm((prev) => ({
      ...prev,
      priority: event.target.value as string,
    }));
  };

  const handlePublishedToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      isPublished: event.target.checked,
    }));
  };

  const resetForm = () => {
    setForm(emptyFormState);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (announcement: AdminAnnouncement) => {
    setForm({
      id: announcement.id,
      title: announcement.title,
      summary: announcement.summary || '',
      content: announcement.content,
      imageUrl: announcement.imageUrl || '',
      attachmentUrl: announcement.attachmentUrl || '',
      attachmentType: announcement.attachmentType || '',
      priority: announcement.priority || 'NORMAL',
      isPublished: announcement.isPublished,
      publishedAt: toDateTimeLocal(announcement.publishedAt),
    });
    setDialogOpen(true);
  };

  const handleDelete = async (announcement: AdminAnnouncement) => {
    const confirmed = window.confirm(`Delete announcement "${announcement.title}"?`);
    if (!confirmed) return;
    try {
      await adminAnnouncementsService.deleteAnnouncement(announcement.id);
      setToast({ open: true, message: 'Announcement deleted', severity: 'success' });
      await loadAnnouncements();
    } catch (err) {
      console.error('Failed to delete announcement', err);
      setToast({ open: true, message: 'Failed to delete announcement', severity: 'error' });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const upload: UploadResponse = await adminAnnouncementsService.uploadAsset(file, {
        title: form.title || file.name,
        description: form.summary,
        category: 'announcements',
      });

      setForm((prev) => ({
        ...prev,
        attachmentUrl: upload.fileUrl,
        attachmentType: upload.mimeType || '',
        imageUrl:
          upload.mimeType && upload.mimeType.startsWith('image/')
            ? upload.fileUrl
            : prev.imageUrl,
      }));
      setToast({ open: true, message: 'Asset uploaded successfully', severity: 'success' });
    } catch (err) {
      console.error('Failed to upload asset', err);
      setToast({ open: true, message: 'Failed to upload asset', severity: 'error' });
    } finally {
      setSaving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setToast({ open: true, message: 'Title and content are required', severity: 'error' });
      return;
    }

    const payload: AdminAnnouncementPayload = {
      title: form.title.trim(),
      summary: form.summary.trim() || undefined,
      content: form.content.trim(),
      imageUrl: form.imageUrl || undefined,
      attachmentUrl: form.attachmentUrl || undefined,
      attachmentType: form.attachmentType || undefined,
      priority: form.priority || undefined,
      isPublished: form.isPublished,
      publishedAt: form.isPublished && form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
    };

    try {
      setSaving(true);
      if (form.id) {
        await adminAnnouncementsService.updateAnnouncement(form.id, payload);
        setToast({ open: true, message: 'Announcement updated', severity: 'success' });
      } else {
        await adminAnnouncementsService.createAnnouncement(payload);
        setToast({ open: true, message: 'Announcement created', severity: 'success' });
      }
      setDialogOpen(false);
      resetForm();
      await loadAnnouncements();
    } catch (err) {
      console.error('Failed to save announcement', err);
      setToast({ open: true, message: 'Failed to save announcement', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const filteredAnnouncements = useMemo(() => announcements, [announcements]);

  return (
    <AdminLayout>
      <Hero>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Announcements & Flyers
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.85, maxWidth: 720 }}>
            Publish enrollment drives, special events, and flyer-style news with visual attachments.
          </Typography>
        </Container>
      </Hero>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            border: '1px solid #e2e8f0',
            borderRadius: 3,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                label="Search"
                fullWidth
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }))
                }
                placeholder="Search announcements..."
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={filters.status}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: event.target.value as 'all' | 'published' | 'draft',
                    }))
                  }
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  label="Priority"
                  value={filters.priority}
                  onChange={(event) =>
                    setFilters((prev) => ({
                      ...prev,
                      priority: event.target.value as string,
                    }))
                  }
                >
                  <MenuItem value="all">All</MenuItem>
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
                New Announcement
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid #e2e8f0',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {loading && <LinearProgress />}
          <Table>
            <TableHead sx={{ bgcolor: '#1a237e' }}>
              <TableRow>
                {['Title', 'Status', 'Priority', 'Published', 'Attachment', 'Updated', 'Actions'].map((col) => (
                  <TableCell key={col} sx={{ color: '#fff', fontWeight: 600 }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {error && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Alert severity="error">{error}</Alert>
                  </TableCell>
                </TableRow>
              )}
              {!error && filteredAnnouncements.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                    No announcements found.
                  </TableCell>
                </TableRow>
              )}
              {filteredAnnouncements.map((announcement) => (
                <TableRow key={announcement.id} hover>
                  <TableCell sx={{ minWidth: 220 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {announcement.title}
                      </Typography>
                      {announcement.summary && (
                        <Typography variant="caption" color="text.secondary">
                          {announcement.summary}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={announcement.isPublished ? 'Published' : 'Draft'}
                      size="small"
                      sx={{
                        bgcolor: announcement.isPublished ? '#d1fae5' : '#fef3c7',
                        color: announcement.isPublished ? '#065f46' : '#92400e',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={(announcement.priority || 'NORMAL').toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor:
                          announcement.priority === 'URGENT'
                            ? '#fee2e2'
                            : announcement.priority === 'HIGH'
                            ? '#ffedd5'
                            : '#e0e7ff',
                        color:
                          announcement.priority === 'URGENT'
                            ? '#b91c1c'
                            : announcement.priority === 'HIGH'
                            ? '#b45309'
                            : '#312e81',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {formatDisplayDate(announcement.publishedAt)}
                  </TableCell>
                  <TableCell>
                    {announcement.attachmentUrl ? (
                      <IconButton
                        size="small"
                        component="a"
                        href={announcement.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FilePresent fontSize="small" />
                      </IconButton>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        None
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDisplayDate(announcement.updatedAt || announcement.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={() => handleEdit(announcement)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(announcement)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{form.id ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              label="Title"
              fullWidth
              required
              value={form.title}
              onChange={handleInputChange('title')}
            />
            <TextField
              label="Summary"
              fullWidth
              value={form.summary}
              onChange={handleInputChange('summary')}
              helperText="Short teaser displayed in lists (optional)"
            />
            <TextField
              label="Content"
              fullWidth
              required
              value={form.content}
              onChange={handleInputChange('content')}
              multiline
              minRows={6}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select label="Priority" value={form.priority} onChange={handlePriorityChange}>
                    {priorityOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Publish At"
                  type="datetime-local"
                  fullWidth
                  value={form.publishedAt}
                  onChange={handleInputChange('publishedAt')}
                  InputLabelProps={{ shrink: true }}
                  helperText={form.isPublished ? 'Optional scheduled publish time' : 'Set publish time before publishing'}
                />
              </Grid>
            </Grid>
            <FormControlLabel
              control={<Switch checked={form.isPublished} onChange={handlePublishedToggle} />}
              label="Published"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Button variant="outlined" startIcon={<CloudUpload />} onClick={handleUploadClick} disabled={saving}>
                Upload Flyer or Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*,application/pdf"
                onChange={handleFileSelected}
              />
              {(form.attachmentUrl || form.imageUrl) && (
                <Stack direction="row" spacing={1} alignItems="center">
                  {form.imageUrl && (
                    <Chip
                      icon={<ImageIcon />}
                      label="Image set"
                      color="success"
                      variant="outlined"
                    />
                  )}
                  {form.attachmentUrl && (
                    <Chip
                      icon={<FilePresent />}
                      label="Attachment added"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        attachmentUrl: '',
                        attachmentType: '',
                      }))
                    }
                  >
                    Remove Attachment
                  </Button>
                </Stack>
              )}
            </Stack>
            <TextField
              label="Image URL"
              fullWidth
              value={form.imageUrl}
              onChange={handleInputChange('imageUrl')}
              placeholder="Optional direct image URL"
            />
            <TextField
              label="Attachment URL"
              fullWidth
              value={form.attachmentUrl}
              onChange={handleInputChange('attachmentUrl')}
              placeholder="Optional PDF or media URL"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default AdminAnnouncements;

