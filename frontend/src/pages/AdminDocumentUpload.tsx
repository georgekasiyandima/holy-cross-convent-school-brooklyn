import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Paper,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormControlLabel,
  Checkbox,
  Grid,
  Stack,
  Divider
} from '@mui/material';
import {
  CloudUpload,
  Description,
  PictureAsPdf,
  School,
  Upload,
  Info
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';
import useDocumentManagement from '../hooks/useDocumentManagement';
import { DocumentUpload } from '../services/documentService';

//---------------------------------------------------------
// TYPES & INTERFACES
//---------------------------------------------------------
interface LocalDocumentUpload extends Omit<DocumentUpload, 'type' | 'file'> {
  type: 'logo' | 'mission' | 'vision' | 'policy' | 'form' | 'attendance' | 'language' | 'other';
  uploadProgress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  file: File | null; // Explicitly type file
}


//---------------------------------------------------------
// SAMPLE DATA
//---------------------------------------------------------
const documentTypes = [
  { value: 'logo', label: 'Logo & Branding', icon: <School /> },
  { value: 'mission', label: 'Mission Statement', icon: <Description /> },
  { value: 'vision', label: 'Vision Statement', icon: <Description /> },
  { value: 'policy', label: 'Policy Documents', icon: <PictureAsPdf /> },
  { value: 'form', label: 'Forms', icon: <Description /> },
  { value: 'admissions', label: 'Admissions', icon: <Description /> },
  { value: 'fees', label: 'Fees & Finance', icon: <PictureAsPdf /> },
  { value: 'attendance', label: 'Attendance Records', icon: <Description /> },
  { value: 'language', label: 'Language Documents', icon: <Description /> },
  { value: 'other', label: 'Other Documents', icon: <Description /> }
];

const categories = [
  'policy',
  'form',
  'admissions',
  'fees',
  'resources',
  'report',
  'newsletter'
];


//---------------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------------
const AdminDocumentUpload: React.FC = () => {
  const { uploadDocument } = useDocumentManagement();

  const [currentDocument, setCurrentDocument] = useState<LocalDocumentUpload>({
    title: '',
    description: '',
    type: 'policy',
    category: 'policy',
    tags: [],
    isPublished: true,
    file: null
  });
  const [activeStep, setActiveStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [newTag, setNewTag] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  //---------------------------------------------------------
  // HANDLERS
  //---------------------------------------------------------
  const handleInputChange = (field: keyof DocumentUpload, value: any) => {
    setCurrentDocument(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setSnackbar({
        open: true,
        message: 'Invalid file type. Please select a PDF or image file.',
        severity: 'error'
      });
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: 'File size too large. Please select a file smaller than 10MB.',
        severity: 'error'
      });
      return;
    }

    handleInputChange('file', file);
    setActiveStep(2); // Move to upload step
  };

  const handleAddTag = () => {
    if (newTag.trim() && !currentDocument.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...currentDocument.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', currentDocument.tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = async () => {
    if (!currentDocument.file) {
      setSnackbar({
        open: true,
        message: 'Please select a file to upload.',
        severity: 'error'
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      if (!currentDocument.file) {
        throw new Error('No file selected');
      }

      const documentUpload: DocumentUpload = {
        ...currentDocument,
        file: currentDocument.file
      };

      await uploadDocument(currentDocument.category, documentUpload);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setSnackbar({
        open: true,
        message: 'Document uploaded successfully!',
        severity: 'success'
      });

    // Reset form
        setCurrentDocument({
          title: '',
          description: '',
          type: 'policy',
          category: 'policy',
          tags: [],
          isPublished: true,
          file: null
        });
        setActiveStep(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err: unknown) {
      // Narrow the type of err
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setSnackbar({
        open: true,
        message: `Upload failed: ${errorMessage}`,
        severity: 'error'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  //---------------------------------------------------------
  // RENDER
  //---------------------------------------------------------
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
            Document Upload Console
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 640 }}>
            Keep admissions and resource documents in sync with a guided upload flow and clear publishing controls.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, mt: { md: -6 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 16px 32px rgba(15, 23, 42, 0.08)',
                backgroundColor: '#ffffff',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mb: 0.5 }}>
                  Guided Upload Workflow
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Three quick steps to register a document, attach the file, and confirm publication.
                </Typography>
              </Box>

              <Stepper
                activeStep={activeStep}
                orientation="vertical"
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: 600,
                    color: '#1a237e',
                  },
                  '& .MuiStepContent-root': {
                    borderLeft: '2px dashed #e2e8f0',
                    ml: 1.5,
                    pl: { xs: 2, md: 3 },
                  },
                }}
              >
                {/* Step 1: Document Information */}
                <Step>
                  <StepLabel>Document Information</StepLabel>
                  <StepContent>
                    <Box sx={{ mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Document Title"
                        value={currentDocument.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        sx={{ mb: 2 }}
                      />

                      <TextField
                        fullWidth
                        label="Description"
                        value={currentDocument.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                      />

                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Document Type</InputLabel>
                            <Select
                              value={currentDocument.type}
                              onChange={(e) => handleInputChange('type', e.target.value)}
                              label="Document Type"
                            >
                              {documentTypes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    {type.icon}
                                    <Typography component="span">{type.label}</Typography>
                                  </Stack>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Document Category</InputLabel>
                            <Select
                              value={currentDocument.category}
                              onChange={(e) => handleInputChange('category', e.target.value)}
                              label="Document Category"
                            >
                              {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                  {category.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={currentDocument.isPublished}
                            onChange={(event) => handleInputChange('isPublished', event.target.checked)}
                            color="primary"
                          />
                        }
                        label="Publish immediately"
                        sx={{ mb: 2 }}
                      />

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: '#334155', fontWeight: 600 }}>
                          Tags (optional)
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 1 }}>
                          <TextField
                            size="small"
                            placeholder="Add tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            sx={{ flex: 1 }}
                          />
                          <Button onClick={handleAddTag} size="small" variant="outlined">
                            Add Tag
                          </Button>
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {currentDocument.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              onDelete={() => handleRemoveTag(tag)}
                              size="small"
                              sx={{ bgcolor: '#e3f2fd', color: '#1a237e' }}
                            />
                          ))}
                        </Stack>
                      </Box>

                      <Stack direction="row" spacing={2}>
                        <Button onClick={() => setActiveStep(1)} disabled={!currentDocument.title} variant="contained" sx={{ bgcolor: '#1a237e' }}>
                          Next: Select File
                        </Button>
                      </Stack>
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 2: File Selection */}
                <Step>
                  <StepLabel>File Selection</StepLabel>
                  <StepContent>
                    <Box sx={{ mb: 3 }}>
                      <Paper
                        sx={{
                          p: 3,
                          border: '1px dashed #cbd5f5',
                          textAlign: 'center',
                          cursor: 'pointer',
                          bgcolor: '#f8fafc',
                          '&:hover': {
                            borderColor: '#1a237e',
                            bgcolor: '#eef2ff',
                          },
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <CloudUpload sx={{ fontSize: 48, color: '#1a237e', mb: 2 }} />
                        <Typography variant="h6" sx={{ mb: 1, color: '#1e293b' }}>
                          {currentDocument.file ? currentDocument.file.name : 'Click to select a file'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          PDF, JPEG, PNG, or WebP files up to 10MB
                        </Typography>
                      </Paper>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />

                      {currentDocument.file && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 2.5,
                            borderRadius: 2,
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f8fafc',
                          }}
                        >
                          <Typography variant="body2" sx={{ color: '#1e293b' }}>
                            <strong>Selected File:</strong> {currentDocument.file.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            <strong>Size:</strong> {(currentDocument.file.size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                        </Box>
                      )}

                      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                        <Button onClick={() => setActiveStep(0)}>Back</Button>
                        <Button
                          variant="contained"
                          onClick={() => setActiveStep(2)}
                          disabled={!currentDocument.file}
                          sx={{ bgcolor: '#1a237e' }}
                        >
                          Next: Upload
                        </Button>
                      </Stack>
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 3: Upload */}
                <Step>
                  <StepLabel>Upload & Review</StepLabel>
                  <StepContent>
                    <Box sx={{ mb: 3 }}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#f8fafc',
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: '#1e293b' }}>
                          Document Summary
                        </Typography>
                        <Divider sx={{ mb: 1.5 }} />
                        <Stack spacing={1}>
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            <strong>Title:</strong> {currentDocument.title || '—'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            <strong>Type:</strong> {currentDocument.type}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            <strong>Category:</strong> {currentDocument.category}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            <strong>File:</strong> {currentDocument.file?.name || '—'}
                          </Typography>
                        </Stack>
                      </Paper>

                      {uploading && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1, color: '#1e293b' }}>
                            Uploading... {uploadProgress}%
                          </Typography>
                          <LinearProgress variant="determinate" value={uploadProgress} />
                        </Box>
                      )}

                      <Stack direction="row" spacing={2}>
                        <Button onClick={() => setActiveStep(1)}>Back</Button>
                        <Button
                          variant="contained"
                          onClick={handleUpload}
                          disabled={uploading || !currentDocument.file}
                          startIcon={uploading ? <CircularProgress size={20} /> : <Upload />}
                          sx={{ bgcolor: '#1a237e' }}
                        >
                          {uploading ? 'Uploading...' : 'Upload Document'}
                        </Button>
                      </Stack>
                    </Box>
                  </StepContent>
                </Step>
              </Stepper>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,#1a237e,#3949ab)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <Info />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                      Upload checklist
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Confirm each item before finalising an upload.
                    </Typography>
                  </Box>
                </Stack>
                <Stack spacing={1.5}>
                  <Typography variant="body2" sx={{ color: '#1e293b' }}>
                    • Title and description clearly state what the document covers.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e293b' }}>
                    • Select the right audience category to power the public listings.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e293b' }}>
                    • Use tags for quick spotlighting (e.g. “2026”, “Admissions”).
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e293b' }}>
                    • PDFs recommended for policies; use JPEG/PNG for posters or banners.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e293b' }}>
                    • Untick “Publish immediately” for drafts you plan to review later.
                  </Typography>
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a237e', mb: 1.5 }}>
                  Accepted formats
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    • PDF (preferred for policies and forms)
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    • JPEG / PNG / WebP (posters, flyers, imagery)
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    • File size up to 10MB
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default AdminDocumentUpload;