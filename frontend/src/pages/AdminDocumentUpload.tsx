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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Save,
  Description,
  PictureAsPdf,
  School,
  Visibility,
  Info,
  CheckCircle,
  Error,
  Upload,
  Add,
  Edit
} from '@mui/icons-material';
import ReturnToHome from '../components/ReturnToHome';
import useDocumentManagement from '../hooks/useDocumentManagement';
import { DocumentUpload } from '../services/documentService';

//---------------------------------------------------------
// TYPES & INTERFACES
//---------------------------------------------------------
interface LocalDocumentUpload extends DocumentUpload {
  uploadProgress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface UploadStep {
  label: string;
  description: string;
  completed: boolean;
}

//---------------------------------------------------------
// SAMPLE DATA
//---------------------------------------------------------
const documentTypes = [
  { value: 'logo', label: 'Logo & Branding', icon: <School /> },
  { value: 'mission', label: 'Mission Statement', icon: <Description /> },
  { value: 'vision', label: 'Vision Statement', icon: <Visibility /> },
  { value: 'policy', label: 'Policy Documents', icon: <PictureAsPdf /> },
  { value: 'other', label: 'Other Documents', icon: <Description /> }
];

const categories = [
  'policy',
  'form', 
  'report',
  'newsletter'
];

const uploadSteps: UploadStep[] = [
  {
    label: 'Document Information',
    description: 'Provide document details and metadata',
    completed: false
  },
  {
    label: 'File Selection',
    description: 'Choose and validate the document file',
    completed: false
  },
  {
    label: 'Upload & Review',
    description: 'Upload document and review before publishing',
    completed: false
  }
];

//---------------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------------
const AdminDocumentUpload: React.FC = () => {
  const {
    documents,
    loading,
    error,
    uploading,
    uploadProgress,
    loadDocuments,
    uploadDocument,
    deleteDocument,
    togglePublishStatus,
    clearError,
    resetUploadProgress
  } = useDocumentManagement();

  const [currentDocument, setCurrentDocument] = useState<LocalDocumentUpload>({
    title: '',
    description: '',
    type: 'policy',
    category: 'policy',
    tags: [],
    isPublished: false,
    file: null as any
  });
  const [activeStep, setActiveStep] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setMessage({ type: 'error', text: 'Please select a valid PDF or image file' });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 10MB' });
      return;
    }

    setCurrentDocument(prev => ({
      ...prev,
      file,
      status: 'pending'
    }));

    setMessage(null);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !currentDocument.tags.includes(newTag.trim())) {
      setCurrentDocument(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentDocument(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate document information
      if (!currentDocument.title.trim()) {
        setMessage({ type: 'error', text: 'Please enter a document title' });
        return;
      }
      if (!currentDocument.description.trim()) {
        setMessage({ type: 'error', text: 'Please enter a document description' });
        return;
      }
      if (!currentDocument.category) {
        setMessage({ type: 'error', text: 'Please select a category' });
        return;
      }
    } else if (activeStep === 1) {
      // Validate file selection
      if (!currentDocument.file) {
        setMessage({ type: 'error', text: 'Please select a file to upload' });
        return;
      }
    }

    setMessage(null);
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleUpload = async () => {
    if (!currentDocument.file) return;

    try {
      setMessage(null);
      clearError();
      
      // Set uploading state
      setCurrentDocument(prev => ({
        ...prev,
        status: 'uploading',
        uploadProgress: 0
      }));

      // Check if file is selected
      if (!currentDocument.file) {
        setMessage({ type: 'error', text: 'Please select a file to upload' });
        return;
      }

      // Upload document using unified service
      const documentData: DocumentUpload = {
        title: currentDocument.title,
        description: currentDocument.description,
        type: currentDocument.type,
        category: currentDocument.category,
        tags: currentDocument.tags,
        isPublished: currentDocument.isPublished,
        file: currentDocument.file as File
      };
      const uploadedDocument = await uploadDocument(currentDocument.category, documentData);
      
      // Enhanced success message with document details
      setMessage({ 
        type: 'success', 
        text: `Document "${uploadedDocument.title}" uploaded successfully! File: ${uploadedDocument.fileName}` 
      });
      
      // Update document status to success
      setCurrentDocument(prev => ({
        ...prev,
        status: 'success',
        uploadProgress: 100
      }));
      
      // Reset form after a short delay to show success state
      setTimeout(() => {
        setCurrentDocument({
          title: '',
          description: '',
          type: 'policy',
          category: 'policy',
          tags: [],
          isPublished: false,
          file: null as any
        });
        setActiveStep(0);
        resetUploadProgress();
        setMessage(null);
      }, 3000);
      
    } catch (error) {
      let errorMessage = 'Upload failed. Please try again.';
      try {
        if (error && typeof error === 'object' && 'message' in error) {
          errorMessage = (error as Error).message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
      } catch (e) {
        console.error('Error processing error message:', e);
        errorMessage = 'Upload failed. Please try again.';
      }
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle sx={{ color: '#4caf50' }} />;
      case 'error':
        return <Error sx={{ color: '#f44336' }} />;
      case 'uploading':
        return <CircularProgress size={20} />;
      default:
        return <Upload sx={{ color: '#9e9e9e' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      case 'uploading':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Return to Home */}
      <ReturnToHome />
      
      <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4 }}>
        Document Upload Management
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        {/* Upload Form */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: '#1a237e' }}>
              Upload New Document
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
              {/* Step 1: Document Information */}
              <Step>
                <StepLabel>Document Information</StepLabel>
                <StepContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Document Title"
                      value={currentDocument.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., School Mission Statement 2025"
                    />
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={currentDocument.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief description of the document content and purpose"
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <FormControl fullWidth>
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
                      
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={currentDocument.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          label="Category"
                        >
                          {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Tags
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        {currentDocument.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            onDelete={() => handleRemoveTag(tag)}
                            size="small"
                            color="primary"
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          placeholder="Add tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <Button onClick={handleAddTag} size="small">
                          Add
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={handleNext} variant="contained">
                      Next
                    </Button>
                  </Box>
                </StepContent>
              </Step>

              {/* Step 2: File Selection */}
              <Step>
                <StepLabel>File Selection</StepLabel>
                <StepContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <Paper
                      sx={{
                        p: 3,
                        border: '2px dashed #ccc',
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: '#1a237e',
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <CloudUpload sx={{ fontSize: 48, color: '#1a237e', mb: 1 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {currentDocument.file ? currentDocument.file.name : 'Click to select file'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Supported formats: PDF, JPEG, PNG, WebP (Max 10MB)
                      </Typography>
                    </Paper>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      style={{ display: 'none' }}
                    />
                    
                    {currentDocument.file && (
                      <Alert severity="info">
                        <Typography variant="body2">
                          <strong>Selected File:</strong> {currentDocument.file.name}<br />
                          <strong>Size:</strong> {(currentDocument.file.size / 1024 / 1024).toFixed(2)} MB<br />
                          <strong>Type:</strong> {currentDocument.file.type}
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={handleBack}>
                      Back
                    </Button>
                    <Button onClick={handleNext} variant="contained">
                      Next
                    </Button>
                  </Box>
                </StepContent>
              </Step>

              {/* Step 3: Upload & Review */}
              <Step>
                <StepLabel>Upload & Review</StepLabel>
                <StepContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Document Preview
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Title:</strong> {currentDocument.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Type:</strong> {documentTypes.find(t => t.value === currentDocument.type)?.label}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Category:</strong> {currentDocument.category}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>File:</strong> {currentDocument.file?.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Tags:</strong> {currentDocument.tags.join(', ')}
                      </Typography>
                    </Paper>
                    
                    {currentDocument.status === 'uploading' && (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Uploading... {currentDocument.uploadProgress}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={currentDocument.uploadProgress} 
                        />
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={handleBack}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleUpload} 
                      variant="contained"
                      disabled={uploading || !currentDocument.file || currentDocument.status === 'uploading'}
                      startIcon={
                        currentDocument.status === 'uploading' ? <CircularProgress size={20} /> :
                        currentDocument.status === 'success' ? <CheckCircle /> :
                        uploading ? <CircularProgress size={20} /> : <CloudUpload />
                      }
                      color={
                        currentDocument.status === 'success' ? 'success' :
                        currentDocument.status === 'error' ? 'error' : 'primary'
                      }
                    >
                      {currentDocument.status === 'uploading' ? 'Uploading...' :
                       currentDocument.status === 'success' ? 'Upload Complete!' :
                       uploading ? 'Uploading...' : 'Upload Document'}
                    </Button>
                  </Box>
                  
                  {/* Upload Progress and Status */}
                  {currentDocument.status === 'uploading' && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={currentDocument.uploadProgress || 0} 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Uploading... {currentDocument.uploadProgress || 0}%
                      </Typography>
                    </Box>
                  )}
                  
                  {currentDocument.status === 'success' && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="body2" color="success.dark">
                        ✅ Document uploaded successfully!
                      </Typography>
                    </Box>
                  )}
                </StepContent>
              </Step>
            </Stepper>
          </CardContent>
        </Card>

        {/* Uploaded Documents List */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: '#1a237e' }}>
              Uploaded Documents
            </Typography>
            
            {documents.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No documents uploaded yet
              </Typography>
            ) : (
              <List>
                {documents.map((doc) => (
                  <ListItem key={doc.id} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      {getStatusIcon(doc.isPublished ? 'published' : 'draft')}
                    </ListItemIcon>
                    <ListItemText
                      primary={doc.title}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {doc.type.toUpperCase()} • {doc.category}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {doc.fileName}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={doc.isPublished ? 'PUBLISHED' : 'DRAFT'}
                      size="small"
                      sx={{ 
                        backgroundColor: getStatusColor(doc.isPublished ? 'published' : 'draft'),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AdminDocumentUpload;
