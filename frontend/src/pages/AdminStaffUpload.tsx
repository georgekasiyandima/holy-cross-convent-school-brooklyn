import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  TextField,
  Grid,
  Divider,
  Stack,
  MenuItem,
  Snackbar,
  useTheme,
  IconButton,
} from '@mui/material';
import {
  CloudUpload,
  Person,
  School,
  Support,
  Close,
} from '@mui/icons-material';
import ReturnToHome from '../components/ReturnToHome';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { StaffAvatar } from '../components/OptimizedImage';
import { API_BASE_URL_WITH_PREFIX } from '../services/apiConfig';

type StaffCategory = 'LEADERSHIP' | 'TEACHING' | 'SUPPORT' | 'ADMIN';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  category: StaffCategory;
  imageUrl?: string;
  email?: string;
  phone?: string;
  grade?: string;
  order?: number;
  subjects?: string[];
  favoriteQuote?: string;
  isActive?: boolean;
}

interface StaffFormState {
  name: string;
  role: string;
  email: string;
  phone: string;
  grade: string;
  category: StaffCategory;
  order: number | '';
  subjects: string;
  favoriteQuote: string;
}

const CATEGORY_OPTIONS: { value: StaffCategory; label: string }[] = [
  { value: 'LEADERSHIP', label: 'Leadership' },
  { value: 'TEACHING', label: 'Teaching' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPPORT', label: 'Support' },
];

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const AdminStaffUpload: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [createImage, setCreateImage] = useState<File | null>(null);
  const [createImagePreview, setCreateImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createFileInputRef = useRef<HTMLInputElement>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [createFileInputKey, setCreateFileInputKey] = useState(0);

  const [createForm, setCreateForm] = useState<StaffFormState>({
    name: '',
    role: '',
    email: '',
    phone: '',
    grade: '',
    category: 'TEACHING',
    order: 1,
    subjects: '',
    favoriteQuote: '',
  });

  const [editFormState, setEditFormState] = useState<StaffFormState | null>(null);

  const getErrorMessage = (error: any, fallback: string) => {
    if (error?.response?.data) {
      const data = error.response.data;
      if (Array.isArray(data.errors)) {
        return data.errors.join(', ');
      }
      if (typeof data.error === 'string') {
        return data.error;
      }
      if (typeof data.message === 'string') {
        return data.message;
      }
    }
    if (typeof error?.message === 'string') {
      return error.message;
    }
    return fallback;
  };

  const validateImage = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, or WebP).' });
      return false;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB.' });
      return false;
    }
    return true;
  };

  const parseSubjectsFromPayload = useCallback((subjects: unknown): string[] => {
    if (!subjects) return [];
    try {
      if (typeof subjects === 'string') {
        if (subjects.trim() === '') return [];
        const parsed = JSON.parse(subjects);
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
          return parsed;
        }
        return [];
      }
      if (Array.isArray(subjects) && subjects.every(item => typeof item === 'string')) {
        return subjects;
      }
      return [];
    } catch (error) {
      console.warn('Failed to parse subjects payload', error);
      return [];
    }
  }, []);

  const loadStaff = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL_WITH_PREFIX}/staff`, { signal });
      if (response.data.success) {
        const staffList: StaffMember[] = (response.data.data.staff || []).map((member: any) => ({
          id: member.id,
          name: member.name,
          role: member.role || '',
          category: member.category as StaffCategory,
          imageUrl: member.imageUrl ?? undefined,
          email: member.email ?? undefined,
          phone: member.phone ?? undefined,
          grade: member.grade ?? undefined,
          order: member.order ?? undefined,
          subjects: parseSubjectsFromPayload(member.subjects),
          favoriteQuote: member.favoriteQuote ?? undefined,
          isActive: member.isActive,
        }));

        setStaff(staffList);

        // Update selected staff if it still exists
        if (selectedStaff) {
          const updatedSelection = staffList.find((item) => item.id === selectedStaff.id) || null;
          setSelectedStaff(updatedSelection);
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        return;
      }
      console.error('Error loading staff:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load staff members. Please check if the backend server is running.';
      setMessage({ type: 'error', text: errorMessage });
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [selectedStaff, parseSubjectsFromPayload]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const controller = new AbortController();
    loadStaff(controller.signal);
    
    return () => {
      controller.abort();
    };
  }, [isAuthenticated, loadStaff]);

  useEffect(() => {
    if (selectedStaff) {
      setEditFormState({
        name: selectedStaff.name || '',
        role: selectedStaff.role || '',
        email: selectedStaff.email || '',
        phone: selectedStaff.phone || '',
        grade: selectedStaff.grade || '',
        category: selectedStaff.category,
        order: selectedStaff.order ?? '',
        subjects: Array.isArray(selectedStaff.subjects) ? selectedStaff.subjects.join(', ') : '',
        favoriteQuote: selectedStaff.favoriteQuote || '',
      });
      setEditImagePreview(null);
    } else {
      setEditFormState(null);
    }
  }, [selectedStaff]);

  const resetCreateForm = useCallback(() => {
    setCreateForm({
      name: '',
      role: '',
      email: '',
      phone: '',
      grade: '',
      category: 'TEACHING',
      order: Math.max(staff.length + 1, 1),
      subjects: '',
      favoriteQuote: '',
    });
    setCreateImage(null);
    setCreateImagePreview(null);
    setCreateFileInputKey(prev => prev + 1);
  }, [staff.length]);

  const handleCreateInputChange = useCallback(
    (field: keyof StaffFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      const mappedValue =
        field === 'order'
          ? value === '' ? '' : Number(value)
          : field === 'category'
            ? (value as StaffCategory)
            : value;

      setCreateForm((prev) => ({
        ...prev,
        [field]: mappedValue,
      }));
    },
    []
  );

  const handleEditInputChange = useCallback(
    (field: keyof StaffFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!editFormState) return;
      const { value } = event.target;
      const mappedValue =
        field === 'order'
          ? value === '' ? '' : Number(value)
          : field === 'category'
            ? (value as StaffCategory)
            : value;

      setEditFormState((prev) =>
        prev
          ? {
              ...prev,
              [field]: mappedValue,
            }
          : prev
      );
    },
    [editFormState]
  );

  const handleCreateImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!validateImage(file)) {
      setCreateFileInputKey(prev => prev + 1);
      return;
    }
    setCreateImage(file);
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setCreateImagePreview(previewUrl);
  }, []);

  const handleCreateStaff = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Form validation
    if (!createForm.name.trim()) {
      const errorMsg = 'Name is required.';
      setMessage({ type: 'error', text: errorMsg });
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      return;
    }
    if (!createForm.role.trim()) {
      const errorMsg = 'Role is required.';
      setMessage({ type: 'error', text: errorMsg });
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      return;
    }
    if (createForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email.trim())) {
      const errorMsg = 'Please enter a valid email address.';
      setMessage({ type: 'error', text: errorMsg });
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setMessage({ type: 'error', text: 'No authentication token found. Please log in again.' });
      return;
    }

    try {
      setCreating(true);
      setMessage(null);

      const formData = new FormData();
      formData.append('name', createForm.name.trim());
      formData.append('role', createForm.role.trim());
      if (createForm.email.trim()) formData.append('email', createForm.email.trim());
      if (createForm.phone.trim()) formData.append('phone', createForm.phone.trim());
      if (createForm.grade.trim()) formData.append('grade', createForm.grade.trim());
      formData.append('category', createForm.category);
      const orderValue = createForm.order === '' ? staff.length + 1 : Number(createForm.order);
      formData.append('order', String(orderValue));

      const subjectsArray = createForm.subjects
        .split(',')
        .map((subject) => subject.trim())
        .filter(Boolean);
      if (subjectsArray.length) {
        formData.append('subjects', JSON.stringify(subjectsArray));
      }

      if (createForm.favoriteQuote.trim()) {
        formData.append('favoriteQuote', createForm.favoriteQuote.trim());
      }

      if (createImage) {
        formData.append('image', createImage);
      }

      const response = await axios.post(`${API_BASE_URL_WITH_PREFIX}/staff`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const successMsg = 'Staff member created successfully.';
        setMessage({ type: 'success', text: successMsg });
        setSnackbar({ open: true, message: successMsg, severity: 'success' });
        // Clean up preview URL
        if (createImagePreview) {
          URL.revokeObjectURL(createImagePreview);
          setCreateImagePreview(null);
        }
        await loadStaff();
        resetCreateForm();
      } else {
        throw new Error(response.data.error || response.data.message || 'Staff creation failed');
      }
    } catch (error: any) {
      console.error('Create staff error:', error);
      const errorMsg = getErrorMessage(error, 'Failed to create staff member.');
      setMessage({ type: 'error', text: errorMsg });
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setCreating(false);
    }
  }, [createForm, createImage, createImagePreview, loadStaff, resetCreateForm, staff.length]);

  const handleUpdateStaff = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStaff || !editFormState) return;

    // Form validation
    if (!editFormState.name.trim()) {
      const errorMsg = 'Name is required.';
      setMessage({ type: 'error', text: errorMsg });
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      return;
    }
    if (!editFormState.role.trim()) {
      const errorMsg = 'Role is required.';
      setMessage({ type: 'error', text: errorMsg });
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      return;
    }
    if (editFormState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormState.email.trim())) {
      const errorMsg = 'Please enter a valid email address.';
      setMessage({ type: 'error', text: errorMsg });
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setMessage({ type: 'error', text: 'No authentication token found. Please log in again.' });
      return;
    }

    try {
      setUpdating(true);
      setMessage(null);

      const subjectsArray = editFormState.subjects
        .split(',')
        .map((subject) => subject.trim())
        .filter((subject) => subject.length > 0);

      const payload: any = {
        name: editFormState.name.trim(),
        role: editFormState.role.trim(),
        category: editFormState.category,
      };

      if (editFormState.email !== undefined) payload.email = editFormState.email.trim();
      if (editFormState.phone !== undefined) payload.phone = editFormState.phone.trim();
      if (editFormState.grade !== undefined) payload.grade = editFormState.grade.trim();
      if (editFormState.order !== '') payload.order = Number(editFormState.order);

      payload.subjects = subjectsArray;
      payload.favoriteQuote = editFormState.favoriteQuote.trim();

      const response = await axios.put(`${API_BASE_URL_WITH_PREFIX}/staff/${selectedStaff.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const successMsg = 'Staff details updated successfully.';
        setMessage({ type: 'success', text: successMsg });
        setSnackbar({ open: true, message: successMsg, severity: 'success' });
        await loadStaff();
      } else {
        throw new Error(response.data.error || response.data.message || 'Staff update failed');
      }
    } catch (error: any) {
      console.error('Update staff error:', error);
      const errorMsg = getErrorMessage(error, 'Failed to update staff member.');
      setMessage({ type: 'error', text: errorMsg });
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setUpdating(false);
    }
  }, [selectedStaff, editFormState, loadStaff]);

  const uploadImage = useCallback(async (file: File, staffMember: StaffMember) => {
    try {
      setUploading(true);
      setMessage(null);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', staffMember.name);
      formData.append('role', staffMember.role || '');
      formData.append('category', staffMember.category);

      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await axios.put(`${API_BASE_URL_WITH_PREFIX}/staff/${staffMember.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      if (response.data.success) {
        const successMsg = `Image uploaded successfully for ${staffMember.name}`;
        setMessage({ type: 'success', text: successMsg });
        setSnackbar({ open: true, message: successMsg, severity: 'success' });
        const updatedStaff = response.data.data?.data || response.data.data;
        const newImageUrl = updatedStaff?.imageUrl || updatedStaff?.staff?.imageUrl;
        if (newImageUrl) {
          setStaff((prev) =>
            prev.map((s) =>
              s.id === staffMember.id
                ? { ...s, imageUrl: newImageUrl }
                : s
            )
          );
          setSelectedStaff((prev) => (prev ? { ...prev, imageUrl: newImageUrl } : null));
        }
        // Clean up preview URL
        if (editImagePreview) {
          URL.revokeObjectURL(editImagePreview);
          setEditImagePreview(null);
        }
        await loadStaff();
      } else {
        throw new Error(response.data.error || response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMsg = getErrorMessage(error, 'Upload failed. Please try again.');
      setMessage({ type: 'error', text: errorMsg });
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      // Clean up preview on error
      if (editImagePreview) {
        URL.revokeObjectURL(editImagePreview);
        setEditImagePreview(null);
      }
    } finally {
      setUploading(false);
      setFileInputKey(prev => prev + 1);
    }
  }, [editImagePreview, loadStaff]);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedStaff) return;

    if (!validateImage(file)) {
      setFileInputKey(prev => prev + 1);
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setEditImagePreview(previewUrl);

    await uploadImage(file, selectedStaff);
  }, [selectedStaff, uploadImage]);

  const handleDeactivateStaff = useCallback(async () => {
    if (!selectedStaff) return;
    const confirmed = window.confirm(`Deactivate ${selectedStaff.name}? They will disappear from the website.`);
    if (!confirmed) return;

    const token = localStorage.getItem('adminToken');
    if (!token) {
      const errorMsg = 'No authentication token found. Please log in again.';
      setMessage({ type: 'error', text: errorMsg });
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      return;
    }

    try {
      setDeactivating(true);
      setMessage(null);
      await axios.delete(`${API_BASE_URL_WITH_PREFIX}/staff/${selectedStaff.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const successMsg = 'Staff member deactivated.';
      setMessage({ type: 'success', text: successMsg });
      setSnackbar({ open: true, message: successMsg, severity: 'success' });
      setSelectedStaff(null);
      await loadStaff();
    } catch (error: any) {
      console.error('Deactivate staff error:', error);
      const errorMsg = getErrorMessage(error, 'Failed to deactivate staff member.');
      setMessage({ type: 'error', text: errorMsg });
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setDeactivating(false);
    }
  }, [selectedStaff, loadStaff]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'LEADERSHIP':
        return <School sx={{ color: '#1a237e' }} />;
      case 'TEACHING':
        return <Person sx={{ color: '#ffd700' }} />;
      case 'SUPPORT':
        return <Support sx={{ color: '#1a237e' }} />;
      default:
        return <Person />;
    }
  };

  const getCategoryColor = useCallback((category: string) => {
    switch (category) {
      case 'LEADERSHIP':
        return theme.palette.primary.light;
      case 'TEACHING':
        return theme.palette.secondary.light;
      case 'SUPPORT':
        return theme.palette.grey[100];
      default:
        return theme.palette.grey[100];
    }
  }, [theme]);

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          You must be logged in to access this page.
        </Alert>
        <ReturnToHome />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ReturnToHome />

      <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4 }}>
        Staff Management
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add New Staff Member
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Capture the staff member’s core details. Adding a profile photo is optional and can be done later from the list below.
          </Typography>

          <Box component="form" onSubmit={handleCreateStaff} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full Name"
                  value={createForm.name}
                  onChange={handleCreateInputChange('name')}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Role / Title"
                  value={createForm.role}
                  onChange={handleCreateInputChange('role')}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  value={createForm.email}
                  onChange={handleCreateInputChange('email')}
                  type="email"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone"
                  value={createForm.phone}
                  onChange={handleCreateInputChange('phone')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Grade / Department"
                  value={createForm.grade}
                  onChange={handleCreateInputChange('grade')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Favourite Quote or Verse"
                  value={createForm.favoriteQuote}
                  onChange={handleCreateInputChange('favoriteQuote')}
                  fullWidth
                  multiline
                  minRows={2}
                  placeholder='e.g. "For I know the plans I have for you..."'
                  inputProps={{ maxLength: 500 }}
                  helperText={`${createForm.favoriteQuote.length}/500 characters`}
                  data-testid="create-staff-quote"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Category"
                  value={createForm.category}
                  onChange={handleCreateInputChange('category')}
                  fullWidth
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Display Order"
                  type="number"
                  value={createForm.order}
                  onChange={handleCreateInputChange('order')}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Subjects / Specialisations"
                  value={createForm.subjects}
                  onChange={handleCreateInputChange('subjects')}
                  fullWidth
                  placeholder="Separate multiple subjects with commas"
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    {createImagePreview ? (
                      <>
                        <Box
                          component="img"
                          src={createImagePreview}
                          alt="Preview"
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid',
                            borderColor: 'primary.main',
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (createImagePreview) {
                              URL.revokeObjectURL(createImagePreview);
                            }
                            setCreateImagePreview(null);
                            setCreateImage(null);
                            setCreateFileInputKey(prev => prev + 1);
                          }}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bgcolor: 'error.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'error.dark' },
                          }}
                          data-testid="remove-create-image-button"
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <StaffAvatar name={createForm.name || 'Staff'} size={100} />
                    )}
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => createFileInputRef.current?.click()}
                    startIcon={<CloudUpload />}
                    sx={{ bgcolor: '#fafafa' }}
                    data-testid="upload-create-image-button"
                  >
                    {createImagePreview ? 'Change Photo' : 'Upload Profile Photo (optional)'}
                  </Button>
                </Stack>
                <input
                  key={createFileInputKey}
                  type="file"
                  ref={createFileInputRef}
                  onChange={handleCreateImageChange}
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  data-testid="create-staff-image-input"
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                  Optional: JPEG, PNG or WebP up to 5MB. Square images display best.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={creating}
                    sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1421' } }}
                  >
                    {creating ? 'Saving...' : 'Save Staff Member'}
                  </Button>
                  <Button type="button" variant="outlined" onClick={resetCreateForm} disabled={creating}>
                    Reset Form
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 4 }} />

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select Staff Member
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2,
              }}
            >
              {staff.map((member) => (
                <Card
                  key={member.id}
                  sx={{
                    cursor: 'pointer',
                    border: selectedStaff?.id === member.id ? '2px solid #1a237e' : '1px solid #e0e0e0',
                    bgcolor: getCategoryColor(member.category),
                    opacity: member.isActive === false ? 0.6 : 1,
                  }}
                  onClick={() => setSelectedStaff(member)}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    {member.imageUrl ? (
                      <Box
                        component="img"
                        src={member.imageUrl}
                        alt={member.name}
                        loading="lazy"
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          mx: 'auto',
                          mb: 2,
                          display: 'block'
                        }}
                        data-testid={`staff-avatar-${member.id}`}
                      />
                    ) : (
                      <Box sx={{ mx: 'auto', mb: 2, display: 'flex', justifyContent: 'center' }}>
                        <StaffAvatar
                          name={member.name}
                          size={100}
                          category={member.category}
                          data-testid={`staff-avatar-${member.id}`}
                        />
                      </Box>
                    )}

                    <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 1 }}>
                      {member.name}
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#666', mb: member.favoriteQuote ? 1 : 2 }}>
                      {member.role}
                    </Typography>

                    {member.favoriteQuote && (
                      <Typography
                        variant="body2"
                        sx={{ color: '#444', fontStyle: 'italic', mb: 2 }}
                      >
                        “{member.favoriteQuote}”
                      </Typography>
                    )}

                    <Chip
                      icon={getCategoryIcon(member.category)}
                      label={member.category}
                      size="small"
                      sx={{ bgcolor: '#fff', color: '#1a237e' }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {selectedStaff && editFormState && (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Staff Details for {selectedStaff.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Update contact information, subjects, or category. Changes save immediately for the website.
              </Typography>

              <Box component="form" onSubmit={handleUpdateStaff} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Full Name"
                      value={editFormState.name}
                      onChange={handleEditInputChange('name')}
                      required
                      fullWidth
                      data-testid="edit-staff-name"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Role / Title"
                      value={editFormState.role}
                      onChange={handleEditInputChange('role')}
                      required
                      fullWidth
                      data-testid="edit-staff-role"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Email"
                      value={editFormState.email}
                      onChange={handleEditInputChange('email')}
                      type="email"
                      fullWidth
                      data-testid="edit-staff-email"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Phone"
                      value={editFormState.phone}
                      onChange={handleEditInputChange('phone')}
                      fullWidth
                      data-testid="edit-staff-phone"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Grade / Department"
                      value={editFormState.grade}
                      onChange={handleEditInputChange('grade')}
                      fullWidth
                      data-testid="edit-staff-grade"
                    />
                  </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Favourite Quote or Verse"
                    value={editFormState.favoriteQuote}
                    onChange={handleEditInputChange('favoriteQuote')}
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder='e.g. "For I know the plans I have for you..."'
                    inputProps={{ maxLength: 500 }}
                    helperText={`${editFormState.favoriteQuote.length}/500 characters`}
                    data-testid="edit-staff-quote"
                  />
                </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      select
                      label="Category"
                      value={editFormState.category}
                      onChange={handleEditInputChange('category')}
                      fullWidth
                      data-testid="edit-staff-category"
                    >
                      {CATEGORY_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Display Order"
                      type="number"
                      value={editFormState.order}
                      onChange={handleEditInputChange('order')}
                      fullWidth
                      inputProps={{ min: 0 }}
                      data-testid="edit-staff-order"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Subjects / Specialisations"
                      value={editFormState.subjects}
                      onChange={handleEditInputChange('subjects')}
                      fullWidth
                      placeholder="Separate multiple subjects with commas"
                      data-testid="edit-staff-subjects"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={updating}
                        sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1421' } }}
                      >
                        {updating ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type="button"
                        color="error"
                        variant="outlined"
                        onClick={handleDeactivateStaff}
                        disabled={deactivating}
                      >
                        {deactivating ? 'Deactivating...' : 'Deactivate Staff Member'}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Upload Image for {selectedStaff.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ position: 'relative' }}>
                  {editImagePreview ? (
                    <Box
                      component="img"
                      src={editImagePreview}
                      alt="Preview"
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid',
                        borderColor: 'primary.main',
                      }}
                    />
                  ) : (
                    <StaffAvatar
                      src={selectedStaff.imageUrl}
                      name={selectedStaff.name}
                      size={100}
                      category={selectedStaff.category}
                      data-testid={`selected-staff-avatar-${selectedStaff.id}`}
                    />
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: '#1a237e', mb: 1 }}>
                    {selectedStaff.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    {selectedStaff.role}
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1421' } }}
                    data-testid="upload-edit-image-button"
                  >
                    {uploading ? 'Uploading...' : editImagePreview ? 'Change Image' : 'Choose Image'}
                  </Button>
                </Box>
              </Box>

              <input
                key={fileInputKey}
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                data-testid="edit-staff-image-input"
              />

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Image Requirements:</strong>
                  <br />• Format: JPEG, PNG, or WebP
                  <br />• Size: Maximum 5MB
                  <br />• Recommended: Square aspect ratio (1:1)
                  <br />• Images will be automatically optimized and resized
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </>
      )}

      {/* Snackbar for toast notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        data-testid="staff-snackbar"
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminStaffUpload;
