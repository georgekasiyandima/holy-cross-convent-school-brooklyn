import React, { useState, useRef } from 'react';
import {
  Container,
  Card,
  CardContent,
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
  StepContent
} from '@mui/material';
import {
  CloudUpload,
  Description,
  PictureAsPdf,
  School,
  Upload
} from '@mui/icons-material';
import ReturnToHome from '../components/ReturnToHome';
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
  { value: 'attendance', label: 'Attendance Records', icon: <Description /> },
  { value: 'language', label: 'Language Documents', icon: <Description /> },
  { value: 'other', label: 'Other Documents', icon: <Description /> }
];

const categories = [
  'policy',
  'form', 
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
    isPublished: false,
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
          isPublished: false,
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ReturnToHome />
      
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 2 }}>
          Document Upload
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload and manage school documents including policies, forms, and other important files.
      </Typography>
      </Box>

        {/* Upload Form */}
      <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stepper activeStep={activeStep} orientation="vertical">
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
                    
                  <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Document Type</InputLabel>
                        <Select
                          value={currentDocument.type}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          label="Document Type"
                        >
                          {documentTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {type.icon}
                                {type.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                  <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={currentDocument.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          label="Category"
                        >
                          {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    
                  {/* Tags */}
                  <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Tags (optional)
                      </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField
                          size="small"
                          placeholder="Add tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <Button onClick={handleAddTag} size="small">
                          Add
                        </Button>
                      </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {currentDocument.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(1)}
                    disabled={!currentDocument.title}
                    sx={{ bgcolor: '#1a237e' }}
                  >
                    Next: Select File
                    </Button>
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
                        border: '2px dashed #ccc',
                        textAlign: 'center',
                        cursor: 'pointer',
                      '&:hover': { borderColor: '#1a237e' }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                    <CloudUpload sx={{ fontSize: 48, color: '#1a237e', mb: 2 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {currentDocument.file ? currentDocument.file.name : 'Click to select file'}
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
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>Selected File:</strong> {currentDocument.file.name}
                      </Typography>
                        <Typography variant="body2">
                        <strong>Size:</strong> {(currentDocument.file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                    </Box>
                    )}
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button onClick={() => setActiveStep(0)}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(2)}
                      disabled={!currentDocument.file}
                      sx={{ bgcolor: '#1a237e' }}
                    >
                      Next: Upload
                    </Button>
                  </Box>
                  </Box>
                </StepContent>
              </Step>

            {/* Step 3: Upload */}
              <Step>
                <StepLabel>Upload & Review</StepLabel>
                <StepContent>
                <Box sx={{ mb: 3 }}>
                  <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Document Summary
                      </Typography>
                    <Typography variant="body2">
                        <strong>Title:</strong> {currentDocument.title}
                      </Typography>
                    <Typography variant="body2">
                      <strong>Type:</strong> {currentDocument.type}
                      </Typography>
                    <Typography variant="body2">
                        <strong>Category:</strong> {currentDocument.category}
                      </Typography>
                    <Typography variant="body2">
                      <strong>File:</strong> {currentDocument.file?.name}
                    </Typography>
                  </Paper>
                  
                  {uploading && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Uploading... {uploadProgress}%
                      </Typography>
                      <LinearProgress variant="determinate" value={uploadProgress} />
                      </Box>
                    )}
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button onClick={() => setActiveStep(1)}>
                      Back
                    </Button>
                    <Button 
                      variant="contained"
                      onClick={handleUpload}
                      disabled={uploading || !currentDocument.file}
                      startIcon={uploading ? <CircularProgress size={20} /> : <Upload />}
                      sx={{ bgcolor: '#1a237e' }}
                    >
                      {uploading ? 'Uploading...' : 'Upload Document'}
                    </Button>
                  </Box>
                    </Box>
                </StepContent>
              </Step>
            </Stepper>
          </CardContent>
        </Card>

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
    </Container>
  );
};

export default AdminDocumentUpload;