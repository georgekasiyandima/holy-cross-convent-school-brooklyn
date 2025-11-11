import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
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
  LinearProgress,
  Alert,
  Paper,
  Tabs,
  Tab,
  Menu,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Autocomplete,
  Container,
  Grid,
  Stack
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Send,
  Schedule,
  Visibility,
  MoreVert,
  Email,
  People,
  Drafts,
  CheckCircle,
  Error as ErrorIcon,
  AccessTime,
  PriorityHigh
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AdminLayout from '../components/AdminLayout';

interface Newsletter {
  id: string;
  title: string;
  content: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';
  scheduledFor?: string;
  sentAt?: string;
  targetAudience: string;
  gradeLevels: string[];
  author: {
    name: string;
    email: string;
  };
  recipients: Array<{
    id: string;
    status: string;
    sentAt?: string;
    parent: {
      name: string;
      email: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

interface Parent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  students: Array<{
    name: string;
    grade: string;
  }>;
}

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  backgroundColor: 
    status === 'DRAFT' ? theme.palette.grey[300] :
    status === 'SCHEDULED' ? '#90caf9' :
    status === 'SENDING' ? '#ffb74d' :
    status === 'SENT' ? '#81c784' :
    '#ef5350',
  color: 'white',
  fontWeight: 600
}));

const PriorityChip = styled(Chip)<{ priority: string }>(({ theme, priority }) => ({
  backgroundColor: 
    priority === 'LOW' ? '#81c784' :
    priority === 'NORMAL' ? '#90caf9' :
    priority === 'HIGH' ? '#ffb74d' :
    '#ef5350',
  color: 'white',
  fontWeight: 600
}));

const NewsletterManagement: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'NORMAL' as Newsletter['priority'],
    targetAudience: 'ALL',
    gradeLevels: [] as string[],
    selectedParents: [] as string[],
    scheduledFor: '',
    isScheduled: false
  });

  const priorities = [
    { value: 'LOW', label: 'Low', color: '#4caf50' },
    { value: 'NORMAL', label: 'Normal', color: '#2196f3' },
    { value: 'HIGH', label: 'High', color: '#ff9800' },
    { value: 'URGENT', label: 'Urgent', color: '#f44336' }
  ];

  const statuses = [
    { value: 'DRAFT', label: 'Draft', color: '#9e9e9e' },
    { value: 'SCHEDULED', label: 'Scheduled', color: '#2196f3' },
    { value: 'SENDING', label: 'Sending', color: '#ff9800' },
    { value: 'SENT', label: 'Sent', color: '#4caf50' },
    { value: 'FAILED', label: 'Failed', color: '#f44336' }
  ];

  const grades = ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'];

  const fetchNewsletters = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await fetch(`/api/newsletters?${params}`);
      if (!response.ok) throw new Error('Failed to fetch newsletters');
      
      const data = await response.json();
      setNewsletters(data.newsletters || []);
    } catch (err) {
      setError('Failed to load newsletters');
      console.error('Error fetching newsletters:', err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const fetchParents = useCallback(async () => {
    try {
      const response = await fetch('/api/newsletters/parents/list');
      if (!response.ok) throw new Error('Failed to fetch parents');
      
      const data = await response.json();
      setParents(data);
    } catch (err) {
      console.error('Error fetching parents:', err);
    }
  }, []);

  useEffect(() => {
    fetchNewsletters();
    fetchParents();
  }, [fetchNewsletters, fetchParents]);

  const handleCreateNewsletter = async () => {
    try {
      const response = await fetch('/api/newsletters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          ...formData,
          scheduledFor: formData.isScheduled ? formData.scheduledFor : null,
          parentIds: formData.targetAudience === 'SPECIFIC_PARENTS' ? formData.selectedParents : []
        })
      });

      if (!response.ok) throw new Error('Failed to create newsletter');

      setSuccess('Newsletter created successfully');
      setCreateDialogOpen(false);
      setFormData({
        title: '',
        content: '',
        priority: 'NORMAL',
        targetAudience: 'ALL',
        gradeLevels: [],
        selectedParents: [],
        scheduledFor: '',
        isScheduled: false
      });
      fetchNewsletters();
    } catch (err) {
      setError('Failed to create newsletter');
      console.error('Create error:', err);
    }
  };

  const handleSendNewsletter = async (id: string) => {
    try {
      const response = await fetch(`/api/newsletters/${id}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) throw new Error('Failed to send newsletter');

      setSuccess('Newsletter sent successfully');
      fetchNewsletters();
    } catch (err) {
      setError('Failed to send newsletter');
      console.error('Send error:', err);
    }
  };

  const handleDeleteNewsletter = async (id: string) => {
    try {
      const response = await fetch(`/api/newsletters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete newsletter');

      setSuccess('Newsletter deleted successfully');
      fetchNewsletters();
    } catch (err) {
      setError('Failed to delete newsletter');
      console.error('Delete error:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <Drafts />;
      case 'SCHEDULED': return <Schedule />;
      case 'SENDING': return <AccessTime />;
      case 'SENT': return <CheckCircle />;
      case 'FAILED': return <ErrorIcon />;
      default: return <Drafts />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'URGENT' || priority === 'HIGH') return <PriorityHigh />;
    return null;
  };

  const filteredNewsletters = newsletters.filter(newsletter => {
    if (activeTab === 1) return newsletter.status === 'DRAFT';
    if (activeTab === 2) return newsletter.status === 'SCHEDULED';
    if (activeTab === 3) return newsletter.status === 'SENT';
    return true;
  });

  const stats = useMemo(() => {
    const totals = {
      total: newsletters.length,
      drafts: newsletters.filter((n) => n.status === 'DRAFT').length,
      scheduled: newsletters.filter((n) => n.status === 'SCHEDULED').length,
      sent: newsletters.filter((n) => n.status === 'SENT').length,
    };
    return totals;
  }, [newsletters]);

  return (
    <AdminLayout>
      <Box
        sx={{
          background: 'linear-gradient(135deg,#1a237e 0%,#3949ab 60%,#5c6bc0 100%)',
          color: '#fff',
          py: { xs: 6, md: 8 },
          borderBottomLeftRadius: { xs: 0, md: 32 },
          borderBottomRightRadius: { xs: 0, md: 32 },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Newsletter Management
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 720 }}>
            Craft announcements, schedule parent communications, and track delivery performance.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, mt: { md: -6 } }}>
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

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[
            { label: 'Total Messages', value: stats.total, color: '#1a237e' },
            { label: 'Drafts', value: stats.drafts, color: '#ef6c00' },
            { label: 'Scheduled', value: stats.scheduled, color: '#3949ab' },
            { label: 'Sent', value: stats.sent, color: '#2e7d32' },
          ].map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
                }}
              >
                <Typography variant="overline" sx={{ color: '#64748b' }}>
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 4,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            boxShadow: '0 16px 32px rgba(15,23,42,0.08)',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
            sx={{ mb: 3 }}
          >
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                {statuses.map(status => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ flex: 1 }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All Newsletters" sx={{ fontWeight: 600 }} />
              <Tab label="Drafts" sx={{ fontWeight: 600 }} />
              <Tab label="Scheduled" sx={{ fontWeight: 600 }} />
              <Tab label="Sent" sx={{ fontWeight: 600 }} />
            </Tabs>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{ bgcolor: '#1a237e', ml: { md: 'auto' } }}
            >
              Create Newsletter
            </Button>
          </Stack>
        </Paper>

        {loading ? (
          <LinearProgress />
        ) : (
          <Grid container spacing={3}>
            {filteredNewsletters.map((newsletter) => (
              <Grid item xs={12} md={6} lg={4} key={newsletter.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 12px 28px rgba(15,23,42,0.08)',
                  }}
                >
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e', pr: 2 }}>
                        {newsletter.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setSelectedNewsletter(newsletter);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <StatusChip
                        icon={getStatusIcon(newsletter.status)}
                        label={newsletter.status}
                        size="small"
                        status={newsletter.status}
                      />
                      <PriorityChip
                        icon={getPriorityIcon(newsletter.priority) || undefined}
                        label={newsletter.priority}
                        size="small"
                        priority={newsletter.priority}
                      />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {newsletter.content.substring(0, 120)}...
                    </Typography>

                    <Stack spacing={1} sx={{ color: '#64748b', flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <People fontSize="small" color="action" />
                        <Typography variant="caption">
                          {newsletter.recipients.length} recipients
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Email fontSize="small" color="action" />
                        <Typography variant="caption">
                          {newsletter.targetAudience === 'ALL' ? 'All Parents'
                            : newsletter.targetAudience === 'SPECIFIC_GRADES' ? `Grades: ${newsletter.gradeLevels.join(', ')}`
                            : 'Specific Parents'}
                        </Typography>
                      </Stack>
                      {newsletter.scheduledFor && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Schedule fontSize="small" color="action" />
                          <Typography variant="caption">
                            Scheduled: {new Date(newsletter.scheduledFor).toLocaleString()}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                      By {newsletter.author.name} • {new Date(newsletter.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {!loading && filteredNewsletters.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed #cbd5f5' }}>
                  <Typography variant="h6" sx={{ color: '#1a237e', mb: 1 }}>
                    No newsletters found for the selected filters.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                    Adjust the filters or create a new message.
                  </Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialogOpen(true)}>
                    Create Newsletter
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}

        {/* Create Newsletter Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create Newsletter</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />

              <TextField
                fullWidth
                label="Content"
                multiline
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your newsletter content here..."
                required
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                    label="Priority"
                  >
                    {priorities.map(priority => (
                      <MenuItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    label="Target Audience"
                  >
                    <MenuItem value="ALL">All Parents</MenuItem>
                    <MenuItem value="SPECIFIC_GRADES">Specific Grades</MenuItem>
                    <MenuItem value="SPECIFIC_PARENTS">Specific Parents</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              {formData.targetAudience === 'SPECIFIC_GRADES' && (
                <Autocomplete
                  multiple
                  options={grades}
                  value={formData.gradeLevels}
                  onChange={(e, newValue) => setFormData(prev => ({ ...prev, gradeLevels: newValue }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Grades" placeholder="Choose grades" />
                  )}
                />
              )}

              {formData.targetAudience === 'SPECIFIC_PARENTS' && (
                <Autocomplete
                  multiple
                  options={parents}
                  value={parents.filter(p => formData.selectedParents.includes(p.id))}
                  onChange={(e, newValue) => setFormData(prev => ({
                    ...prev,
                    selectedParents: newValue.map(p => p.id)
                  }))}
                  getOptionLabel={(option) => `${option.name} (${option.email})`}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Parents" placeholder="Choose parents" />
                  )}
                />
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isScheduled}
                    onChange={(e) => setFormData(prev => ({ ...prev, isScheduled: e.target.checked }))}
                  />
                }
                label="Schedule for later"
              />

              {formData.isScheduled && (
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Schedule Date & Time"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateNewsletter}>
              Create Newsletter
            </Button>
          </DialogActions>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Newsletter Preview</DialogTitle>
          <DialogContent>
            {selectedNewsletter && (
              <Box>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  {selectedNewsletter.title}
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 3,
                    backgroundColor: '#f9f9f9'
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedNewsletter.content }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => {
            setPreviewDialogOpen(true);
            setAnchorEl(null);
          }}>
            <ListItemIcon><Visibility /></ListItemIcon>
            <ListItemText>Preview</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><Edit /></ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          {selectedNewsletter?.status === 'DRAFT' && (
            <MenuItem onClick={() => {
              if (selectedNewsletter) handleSendNewsletter(selectedNewsletter.id);
              setAnchorEl(null);
            }}>
              <ListItemIcon><Send /></ListItemIcon>
              <ListItemText>Send Now</ListItemText>
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              if (selectedNewsletter) handleDeleteNewsletter(selectedNewsletter.id);
              setAnchorEl(null);
            }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon><Delete color="error" /></ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Container>
    </AdminLayout>
  );
};

export default NewsletterManagement;
