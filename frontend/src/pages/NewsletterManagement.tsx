import React, { useState, useEffect } from 'react';
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
  Badge,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Avatar,
  List,
  ListItem,
  ListItemText as MuiListItemText,
  ListItemAvatar,
  Divider,
  Switch,
  FormControlLabel,
  Autocomplete
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
  TrendingUp,
  Drafts,
  CheckCircle,
  Error as ErrorIcon,
  AccessTime,
  PriorityHigh,
  School,
  Person
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

  useEffect(() => {
    fetchNewsletters();
    fetchParents();
  }, [filterStatus]);

  const fetchNewsletters = async () => {
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
  };

  const fetchParents = async () => {
    try {
      const response = await fetch('/api/newsletters/parents/list');
      if (!response.ok) throw new Error('Failed to fetch parents');
      
      const data = await response.json();
      setParents(data);
    } catch (err) {
      console.error('Error fetching parents:', err);
    }
  };

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

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#1a237e' }}>
          Newsletter Management
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
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 150 }}>
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

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{ ml: 'auto' }}
            >
              Create Newsletter
            </Button>
          </Box>

          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="All Newsletters" />
            <Tab label="Drafts" />
            <Tab label="Scheduled" />
            <Tab label="Sent" />
          </Tabs>
        </Paper>

        {/* Newsletters List */}
        {loading ? (
          <LinearProgress />
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {filteredNewsletters.map((newsletter) => (
              <Box key={newsletter.id} sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: { xs: '100%', md: 'calc(50% - 12px)', lg: 'calc(33.333% - 16px)' } }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
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
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
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
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {newsletter.content.substring(0, 100)}...
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <People fontSize="small" color="action" />
                      <Typography variant="caption">
                        {newsletter.recipients.length} recipients
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="caption">
                        {newsletter.targetAudience === 'ALL' ? 'All Parents' :
                         newsletter.targetAudience === 'SPECIFIC_GRADES' ? `Grades: ${newsletter.gradeLevels.join(', ')}` :
                         'Specific Parents'}
                      </Typography>
                    </Box>

                    {newsletter.scheduledFor && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Schedule fontSize="small" color="action" />
                        <Typography variant="caption">
                          Scheduled: {new Date(newsletter.scheduledFor).toLocaleString()}
                        </Typography>
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      By {newsletter.author.name} • {new Date(newsletter.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
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

              <Box sx={{ display: 'flex', gap: 2 }}>
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
              </Box>

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
                    borderRadius: 1, 
                    p: 2,
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
      </Box>
    </AdminLayout>
  );
};

export default NewsletterManagement;
