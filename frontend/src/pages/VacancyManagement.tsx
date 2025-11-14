import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
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
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';
import {
  Add,
  Edit,
  Delete,
  Work,
  School,
  BusinessCenter,
  Groups,
  Person,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vacancyService, { Vacancy } from '../services/vacancyService';
import SEO from '../components/SEO';

// Constants
const PRIMARY_COLOR = '#1a237e';
const PRIMARY_HOVER = '#283593';
const ERROR_COLOR = '#d32f2f';

// Department lookup object
const DEPARTMENT_MAP = {
  TEACHING: { icon: <School />, label: 'Teaching' },
  ADMIN: { icon: <BusinessCenter />, label: 'Administrative' },
  SUPPORT: { icon: <Groups />, label: 'Support Staff' },
  LEADERSHIP: { icon: <Person />, label: 'Leadership' },
} as const;

// Employment type lookup
const EMPLOYMENT_TYPE_MAP = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  TEMPORARY: 'Temporary',
} as const;

const VacancyManagement: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vacancyToDelete, setVacancyToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    department: 'TEACHING',
    employmentType: 'FULL_TIME',
    location: 'Brooklyn, Cape Town',
    description: '',
    requirements: [] as string[],
    responsibilities: [] as string[],
    qualifications: [] as string[],
    salaryRange: '',
    closingDate: null as Date | null,
    startDate: null as Date | null,
    isPublished: false,
    isUrgent: false,
    applicationEmail: '',
    applicationInstructions: '',
    order: 0,
  });

  const [tempRequirement, setTempRequirement] = useState('');
  const [tempResponsibility, setTempResponsibility] = useState('');
  const [tempQualification, setTempQualification] = useState('');

  // Memoize fetchVacancies to avoid recreating on every render
  const fetchVacancies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vacancyService.getAllVacancies();
      // Sort by order field
      const sortedData = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
      setVacancies(sortedData);
    } catch (err: any) {
      console.error('Error fetching vacancies:', err);
      const errorMessage = err?.response?.data?.message || 'Failed to load vacancies. Please check if the backend is running.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fix useEffect dependency - use fetchVacancies callback
  useEffect(() => {
    if (!isAuthenticated) {
      setError('Please log in to access vacancy management.');
      return;
    }

    fetchVacancies();
  }, [isAuthenticated, fetchVacancies]);

  // Clear temp fields when dialog closes (Critical Fix C3)
  useEffect(() => {
    if (!dialogOpen) {
      setTempRequirement('');
      setTempResponsibility('');
      setTempQualification('');
    }
  }, [dialogOpen]);

  const handleOpenDialog = (vacancy?: Vacancy) => {
    if (vacancy) {
      setEditingVacancy(vacancy);
      setFormData({
        title: vacancy.title,
        department: vacancy.department,
        employmentType: vacancy.employmentType,
        location: vacancy.location || 'Brooklyn, Cape Town',
        description: vacancy.description,
        requirements: vacancy.requirements || [],
        responsibilities: vacancy.responsibilities || [],
        qualifications: vacancy.qualifications || [],
        salaryRange: vacancy.salaryRange || '',
        closingDate: vacancy.closingDate ? new Date(vacancy.closingDate) : null,
        startDate: vacancy.startDate ? new Date(vacancy.startDate) : null,
        isPublished: vacancy.isPublished,
        isUrgent: vacancy.isUrgent,
        applicationEmail: vacancy.applicationEmail || '',
        applicationInstructions: vacancy.applicationInstructions || '',
        order: vacancy.order,
      });
    } else {
      setEditingVacancy(null);
      setFormData({
        title: '',
        department: 'TEACHING',
        employmentType: 'FULL_TIME',
        location: 'Brooklyn, Cape Town',
        description: '',
        requirements: [],
        responsibilities: [],
        qualifications: [],
        salaryRange: '',
        closingDate: null,
        startDate: null,
        isPublished: false,
        isUrgent: false,
        applicationEmail: '',
        applicationInstructions: '',
        order: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVacancy(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      // Critical Fix C2: Proper null handling for dates (use undefined for TypeScript compatibility)
      const vacancyData = {
        ...formData,
        closingDate: formData.closingDate ? formData.closingDate.toISOString() : undefined,
        startDate: formData.startDate ? formData.startDate.toISOString() : undefined,
      };

      if (editingVacancy) {
        await vacancyService.updateVacancy(editingVacancy.id, vacancyData);
        setSuccess('Vacancy updated successfully!');
      } else {
        await vacancyService.createVacancy(vacancyData);
        setSuccess('Vacancy created successfully!');
      }

      handleCloseDialog();
      fetchVacancies();
    } catch (err: any) {
      console.error('Error saving vacancy:', err);
      // Major Fix M4: Better error handling
      const errorMessage = err?.response?.data?.message || 'Failed to save vacancy. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await vacancyService.deleteVacancy(id);
      setSuccess('Vacancy deleted successfully!');
      setDeleteConfirmOpen(false);
      setVacancyToDelete(null);
      fetchVacancies();
    } catch (err: any) {
      console.error('Error deleting vacancy:', err);
      // Major Fix M4: Better error handling
      const errorMessage = err?.response?.data?.message || 'Failed to delete vacancy. Please try again.';
      setError(errorMessage);
    }
  };

  // Critical Fix C4: Use functional state updates to avoid stale closures
  const addRequirement = useCallback(() => {
    if (tempRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, tempRequirement.trim()],
      }));
      setTempRequirement('');
    }
  }, [tempRequirement]);

  const addResponsibility = useCallback(() => {
    if (tempResponsibility.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, tempResponsibility.trim()],
      }));
      setTempResponsibility('');
    }
  }, [tempResponsibility]);

  const addQualification = useCallback(() => {
    if (tempQualification.trim()) {
      setFormData((prev) => ({
        ...prev,
        qualifications: [...prev.qualifications, tempQualification.trim()],
      }));
      setTempQualification('');
    }
  }, [tempQualification]);

  const removeRequirement = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  }, []);

  const removeResponsibility = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  }, []);

  const removeQualification = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
  }, []);

  // Minor Fix m2: Use lookup object instead of switch statements
  const getDepartmentIcon = (department: string) => {
    return DEPARTMENT_MAP[department as keyof typeof DEPARTMENT_MAP]?.icon || <Work />;
  };

  const getDepartmentLabel = (department: string) => {
    return DEPARTMENT_MAP[department as keyof typeof DEPARTMENT_MAP]?.label || department;
  };

  const getEmploymentTypeLabel = (type: string) => {
    return EMPLOYMENT_TYPE_MAP[type as keyof typeof EMPLOYMENT_TYPE_MAP] || type;
  };

  // Minor Fix m3: Memoize formatDate
  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">Please log in to access vacancy management.</Alert>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO title="Vacancy Management - Admin" />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: PRIMARY_COLOR }}>
            Vacancy Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: PRIMARY_COLOR,
              '&:hover': {
                backgroundColor: PRIMARY_HOVER
              }
            }}
          >
            Add Vacancy
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Major Fix M5: Remove duplicate success Alert, keep Snackbar only */}

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ color: PRIMARY_COLOR }} />
            <Typography variant="h6" sx={{ color: '#666', mt: 2 }}>
              Loading vacancies...
            </Typography>
          </Box>
        ) : vacancies.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Work sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
              No vacancies found
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                backgroundColor: PRIMARY_COLOR,
                '&:hover': {
                  backgroundColor: PRIMARY_HOVER
                }
              }}
            >
              Create First Vacancy
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Urgent</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Closing Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vacancies.map((vacancy) => (
                  <TableRow key={vacancy.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${ERROR_COLOR} 100%)`,
                            color: 'white',
                            mr: 2
                          }}
                        >
                          {getDepartmentIcon(vacancy.department)}
                        </Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {vacancy.title}
                          </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{getDepartmentLabel(vacancy.department)}</TableCell>
                    <TableCell>{getEmploymentTypeLabel(vacancy.employmentType)}</TableCell>
                    <TableCell>
                      <Chip
                        icon={vacancy.isPublished ? <Visibility /> : <VisibilityOff />}
                        label={vacancy.isPublished ? 'Published' : 'Draft'}
                        size="small"
                        sx={{
                          backgroundColor: vacancy.isPublished ? '#4caf50' : '#ff9800',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {vacancy.isUrgent && (
                        <Chip
                          label="URGENT"
                          size="small"
                          sx={{
                            backgroundColor: ERROR_COLOR,
                            color: 'white',
                            fontWeight: 700,
                            height: 20,
                            fontSize: '0.7rem'
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(vacancy.closingDate)}</TableCell>
                    <TableCell>
                      {/* Major Fix M3: Add aria-labels for accessibility */}
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(vacancy)}
                        sx={{ color: PRIMARY_COLOR }}
                        aria-label="Edit vacancy"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setVacancyToDelete(vacancy.id);
                          setDeleteConfirmOpen(true);
                        }}
                        sx={{ color: ERROR_COLOR }}
                        aria-label="Delete vacancy"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Create/Edit Dialog */}
        {/* Minor Fix m5: Fix dialog overflow on mobile */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
          PaperProps={{ sx: { overflowY: 'auto', maxHeight: '90vh' } }}
        >
          <DialogTitle>
            {editingVacancy ? 'Edit Vacancy' : 'Create New Vacancy'}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Job Title"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    label="Department"
                  >
                    <MenuItem value="TEACHING">Teaching</MenuItem>
                    <MenuItem value="ADMIN">Administrative</MenuItem>
                    <MenuItem value="SUPPORT">Support Staff</MenuItem>
                    <MenuItem value="LEADERSHIP">Leadership</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    label="Employment Type"
                  >
                    <MenuItem value="FULL_TIME">Full Time</MenuItem>
                    <MenuItem value="PART_TIME">Part Time</MenuItem>
                    <MenuItem value="CONTRACT">Contract</MenuItem>
                    <MenuItem value="TEMPORARY">Temporary</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                label="Location"
                fullWidth
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />

              <TextField
                label="Job Description"
                fullWidth
                required
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <TextField
                label="Salary Range (optional)"
                fullWidth
                placeholder="e.g., R200,000 - R350,000 per annum"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              />

              {/* Responsibilities */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Key Responsibilities
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Add responsibility"
                    value={tempResponsibility}
                    onChange={(e) => setTempResponsibility(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addResponsibility();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={addResponsibility}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {formData.responsibilities.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      onDelete={() => removeResponsibility(index)}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Requirements */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Requirements
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Add requirement"
                    value={tempRequirement}
                    onChange={(e) => setTempRequirement(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addRequirement();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={addRequirement}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {formData.requirements.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      onDelete={() => removeRequirement(index)}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Qualifications */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Qualifications
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Add qualification"
                    value={tempQualification}
                    onChange={(e) => setTempQualification(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addQualification();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={addQualification}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {formData.qualifications.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      onDelete={() => removeQualification(index)}
                    />
                  ))}
                </Stack>
              </Box>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <DatePicker
                    label="Closing Date (optional)"
                    value={formData.closingDate}
                    onChange={(date) => setFormData({ ...formData, closingDate: date })}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                  <DatePicker
                    label="Start Date (optional)"
                    value={formData.startDate}
                    onChange={(date) => setFormData({ ...formData, startDate: date })}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Box>
              </LocalizationProvider>

              <TextField
                label="Application Email"
                fullWidth
                type="email"
                value={formData.applicationEmail}
                onChange={(e) => setFormData({ ...formData, applicationEmail: e.target.value })}
              />

              <TextField
                label="Application Instructions (optional)"
                fullWidth
                multiline
                rows={3}
                value={formData.applicationInstructions}
                onChange={(e) => setFormData({ ...formData, applicationInstructions: e.target.value })}
              />

              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    />
                  }
                  label="Published"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isUrgent}
                      onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                    />
                  }
                  label="Mark as Urgent"
                />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="outlined" startIcon={<Cancel />} disabled={saving}>
              Cancel
            </Button>
            {/* Major Fix M1: Add saving state and loading indicator */}
            <Button 
              onClick={handleSave} 
              variant="contained" 
              startIcon={saving ? <CircularProgress size={20} /> : <Save />} 
              sx={{ backgroundColor: PRIMARY_COLOR }}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this vacancy? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={() => vacancyToDelete && handleDelete(vacancyToDelete)}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
          message={success}
        />
      </Container>
    </AdminLayout>
  );
};

export default VacancyManagement;

