import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useSchoolStatsAdmin } from '../hooks/useSchoolStats';
import { CreateStatisticData, AVAILABLE_ICONS, STATISTIC_TYPES } from '../types/schoolStats';

interface StatisticFormData extends CreateStatisticData {
  id?: string;
}

const SchoolStatsAdmin: React.FC = () => {
  const {
    stats,
    loading,
    error,
    saving,
    saveStatistic,
    updateStatistic,
    deleteStatistic,
    initializeDefaultStats,
    refetch
  } = useSchoolStatsAdmin();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<StatisticFormData | null>(null);
  const [formData, setFormData] = useState<StatisticFormData>({
    key: '',
    value: '',
    label: '',
    icon: 'Numbers',
    type: 'text',
    order: 0,
    isVisible: true
  });

  const handleOpenDialog = (stat?: StatisticFormData) => {
    if (stat) {
      setEditingStat(stat);
      setFormData({
        key: stat.key,
        value: stat.value,
        label: stat.label,
        icon: stat.icon,
        type: stat.type,
        order: stat.order,
        isVisible: stat.isVisible
      });
    } else {
      setEditingStat(null);
      setFormData({
        key: '',
        value: '',
        label: '',
        icon: 'Numbers',
        type: 'text',
        order: stats.length,
        isVisible: true
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingStat(null);
    setFormData({
      key: '',
      value: '',
      label: '',
      icon: 'Numbers',
      type: 'text',
      order: 0,
      isVisible: true
    });
  };

  const handleSave = async () => {
    try {
      if (editingStat) {
        await updateStatistic(editingStat.key, formData);
      } else {
        await saveStatistic(formData);
      }
      handleCloseDialog();
      refetch();
    } catch (error) {
      console.error('Error saving statistic:', error);
    }
  };

  const handleDelete = async (key: string) => {
    if (window.confirm('Are you sure you want to delete this statistic?')) {
      try {
        await deleteStatistic(key);
        refetch();
      } catch (error) {
        console.error('Error deleting statistic:', error);
      }
    }
  };

  const handleToggleVisibility = async (stat: StatisticFormData) => {
    try {
      await updateStatistic(stat.key, { isVisible: !stat.isVisible });
      refetch();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const handleInitializeDefaults = async () => {
    if (window.confirm('This will create default statistics. Continue?')) {
      try {
        await initializeDefaultStats();
      } catch (error) {
        console.error('Error initializing defaults:', error);
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress sx={{ color: '#1a237e' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, mt: { md: -6 } }}>
      <Box
        sx={{
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          backgroundColor: '#fff',
          boxShadow: '0 16px 32px rgba(15,23,42,0.08)',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1a237e', fontWeight: 700 }}>
          School Statistics Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage the numbers displayed in the "Our School by the Numbers" section on the homepage.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#0d47a1' } }}
          >
            Add Statistic
          </Button>
          <Button
            variant="outlined"
            onClick={handleInitializeDefaults}
            disabled={saving}
            sx={{ borderColor: '#1a237e', color: '#1a237e' }}
          >
            Initialize Defaults
          </Button>
          <Button
            variant="outlined"
            onClick={refetch}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {stats.map((stat) => (
          <Box key={stat.id} sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                border: stat.isVisible ? '1px solid #e2e8f0' : '1px dashed #e2e8f0',
                boxShadow: stat.isVisible ? '0 12px 24px rgba(26,35,126,0.1)' : '0 6px 16px rgba(148,163,184,0.22)',
                backgroundColor: '#ffffff',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 700, color: '#1a237e' }}>
                    {stat.label}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleVisibility(stat)}
                      color={stat.isVisible ? 'primary' : 'default'}
                    >
                      {stat.isVisible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(stat)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(stat.key)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="h3" component="div" sx={{ color: '#1a237e', fontWeight: 800, mb: 1 }}>
                  {stat.value}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip label={stat.type} size="small" color="primary" />
                  <Chip label={stat.icon} size="small" variant="outlined" />
                  {!stat.isVisible && <Chip label="Hidden" size="small" color="warning" />}
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  Key: {stat.key}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Order: {stat.order}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}

        {stats.length === 0 && (
          <Box sx={{ width: '100%' }}>
            <Card
              sx={{
                borderRadius: 3,
                border: '1px dashed #cbd5f5',
                backgroundColor: '#f8fafc',
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No statistics configured yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Click "Initialize Defaults" to create starter statistics or "Add Statistic" to build your own.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                  sx={{ backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#0d47a1' } }}
                >
                  Add Your First Statistic
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingStat ? 'Edit Statistic' : 'Add New Statistic'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Key (unique identifier)"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                disabled={!!editingStat}
                helperText="Used internally - cannot be changed after creation"
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="e.g., 300+, 95%, 64+"
                  required
                />
                <TextField
                  fullWidth
                  label="Display Label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Years of Excellence"
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Icon</InputLabel>
                  <Select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    label="Icon"
                  >
                    {AVAILABLE_ICONS.map((icon) => (
                      <MenuItem key={icon} value={icon}>
                        {icon}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    label="Type"
                  >
                    {STATISTIC_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                  helperText="Display order (lower numbers appear first)"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isVisible}
                      onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    />
                  }
                  label="Visible on homepage"
                />
              </Stack>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<Cancel />}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<Save />}
            disabled={saving || !formData.key || !formData.value}
            sx={{ backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#0d47a1' } }}
          >
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SchoolStatsAdmin;

