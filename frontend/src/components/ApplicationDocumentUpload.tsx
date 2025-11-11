import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider,
} from '@mui/material';
import { CloudUpload, Delete, Download, AttachFile, Description } from '@mui/icons-material';
import applicationDocumentsService, { ApplicationDocument, DocumentType } from '../services/applicationDocumentsService';

interface ApplicationDocumentUploadProps {
  applicationId: number;
  onDocumentsChange?: (documents: ApplicationDocument[]) => void;
}

const ApplicationDocumentUpload: React.FC<ApplicationDocumentUploadProps> = ({
  applicationId,
  onDocumentsChange,
}) => {
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [documentSubmissionMethod, setDocumentSubmissionMethod] = useState<'upload' | 'hardcopy'>('upload');
  const [loadingDocumentTypes, setLoadingDocumentTypes] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);

  const loadDocuments = useCallback(async () => {
    if (!applicationId) {
      return;
    }
    const result = await applicationDocumentsService.getDocuments(applicationId);
    if (result.success && result.data) {
      setDocuments(result.data);
      onDocumentsChange?.(result.data);
    }
  }, [applicationId, onDocumentsChange]);

  const loadDocumentTypes = useCallback(async () => {
    try {
      setLoadingDocumentTypes(true);
      const result = await applicationDocumentsService.getDocumentTypes();
      if (result.success && result.data) {
        setDocumentTypes(result.data);
        setError(null);
      } else {
        console.error('Failed to load document types:', result.error);
        setError(result.error || 'Failed to load document types');
        // Fallback to default document types if API fails
        setDocumentTypes([
          { value: 'BIRTH_CERTIFICATE', label: 'Birth Certificate' },
          { value: 'BAPTISM_CERTIFICATE', label: 'Baptism Certificate' },
          { value: 'SCHOOL_REPORT', label: 'School Report' },
          { value: 'ID_COPY_MOTHER', label: 'ID Copy - Mother' },
          { value: 'ID_COPY_FATHER', label: 'ID Copy - Father' },
          { value: 'PROOF_OF_RESIDENCE', label: 'Proof of Residence' },
          { value: 'IMMUNIZATION_CERTIFICATE', label: 'Immunization Certificate' },
          { value: 'SALARY_SLIP_MOTHER', label: 'Salary Slip - Mother' },
          { value: 'SALARY_SLIP_FATHER', label: 'Salary Slip - Father' },
          { value: 'BANK_STATEMENT', label: 'Bank Statement' },
          { value: 'TAX_CLEARANCE', label: 'Tax Clearance' },
          { value: 'VISA_DOCUMENT', label: 'Visa Document' },
          { value: 'OTHER', label: 'Other' },
        ]);
      }
    } catch (err: any) {
      console.error('Error loading document types:', err);
      setError('Failed to load document types. Please refresh the page.');
      // Fallback to default document types
      setDocumentTypes([
        { value: 'BIRTH_CERTIFICATE', label: 'Birth Certificate' },
        { value: 'BAPTISM_CERTIFICATE', label: 'Baptism Certificate' },
        { value: 'SCHOOL_REPORT', label: 'School Report' },
        { value: 'ID_COPY_MOTHER', label: 'ID Copy - Mother' },
        { value: 'ID_COPY_FATHER', label: 'ID Copy - Father' },
        { value: 'PROOF_OF_RESIDENCE', label: 'Proof of Residence' },
        { value: 'IMMUNIZATION_CERTIFICATE', label: 'Immunization Certificate' },
        { value: 'SALARY_SLIP_MOTHER', label: 'Salary Slip - Mother' },
        { value: 'SALARY_SLIP_FATHER', label: 'Salary Slip - Father' },
        { value: 'BANK_STATEMENT', label: 'Bank Statement' },
        { value: 'TAX_CLEARANCE', label: 'Tax Clearance' },
        { value: 'VISA_DOCUMENT', label: 'Visa Document' },
        { value: 'OTHER', label: 'Other' },
      ]);
    } finally {
      setLoadingDocumentTypes(false);
    }
  }, []);

  useEffect(() => {
    if (applicationId) {
      loadDocuments();
      loadDocumentTypes();
    }
  }, [applicationId, loadDocuments, loadDocumentTypes]);

  // Reload document types when dialog opens if they're not loaded
  useEffect(() => {
    if (uploadDialogOpen && documentTypes.length === 0 && !loadingDocumentTypes) {
      loadDocumentTypes();
    }
  }, [uploadDialogOpen, documentTypes.length, loadingDocumentTypes, loadDocumentTypes]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      // Reset file input to allow selecting the same file again
      event.target.value = '';
    }
  };

  const handleDialogClose = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setSelectedDocumentType('');
    setDocumentSubmissionMethod('upload');
    setError(null);
    // Reload document types when dialog opens again
    if (documentTypes.length === 0 && !loadingDocumentTypes) {
      loadDocumentTypes();
    }
  };

  const handleDialogOpen = () => {
    setUploadDialogOpen(true);
    // Ensure document types are loaded
    if (documentTypes.length === 0 && !loadingDocumentTypes) {
      loadDocumentTypes();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      setError('Please select a file and document type');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

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

    try {
      const result = await applicationDocumentsService.uploadDocument({
        applicationId,
        documentType: selectedDocumentType,
        file: selectedFile,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setSuccess('Document uploaded successfully');
        handleDialogClose();
        await loadDocuments();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteClick = (documentId: number) => {
    setDocumentToDelete(documentId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    const result = await applicationDocumentsService.deleteDocument(documentToDelete);
    if (result.success) {
      setSuccess('Document deleted successfully');
      await loadDocuments();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error || 'Delete failed');
    }
    
    setDeleteConfirmOpen(false);
    setDocumentToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDocumentToDelete(null);
  };

  const handleDownload = (doc: ApplicationDocument) => {
    const link = document.createElement('a');
    link.href = applicationDocumentsService.getDownloadUrl(doc.id);
    link.download = doc.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDocumentTypeColor = (documentType: string) => {
    const colors: { [key: string]: string } = {
      'BIRTH_CERTIFICATE': '#4caf50',
      'BAPTISM_CERTIFICATE': '#2196f3',
      'SCHOOL_REPORT': '#ff9800',
      'ID_COPY_MOTHER': '#9c27b0',
      'ID_COPY_FATHER': '#9c27b0',
      'PROOF_OF_RESIDENCE': '#607d8b',
      'IMMUNIZATION_CERTIFICATE': '#795548',
      'SALARY_SLIP_MOTHER': '#ff5722',
      'SALARY_SLIP_FATHER': '#ff5722',
      'BANK_STATEMENT': '#3f51b5',
      'TAX_CLEARANCE': '#009688',
      'VISA_DOCUMENT': '#e91e63',
      'OTHER': '#9e9e9e',
    };
    return colors[documentType] || '#9e9e9e';
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif', fontWeight: 600 }}>
            Supporting Documents
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={handleDialogOpen}
            sx={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Upload Document
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, fontFamily: '"Lato", "Open Sans", sans-serif', color: '#666' }}>
          Please upload all required supporting documents for your application. 
          Required documents include: Birth certificate, Baptism certificate (if applicable), 
          School report, ID copies, Proof of residence, and other relevant documents.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
            {success}
          </Alert>
        )}

        {documents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <AttachFile sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
            <Typography variant="body1" sx={{ color: '#666', fontFamily: '"Lato", "Open Sans", sans-serif' }}>
              No documents uploaded yet
            </Typography>
          </Box>
        ) : (
          <List>
            {documents.map((document) => (
              <ListItem key={document.id} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                        {document.originalName}
                      </Typography>
                      <Chip
                        label={documentTypes.find(t => t.value === document.documentType)?.label || document.documentType}
                        size="small"
                        sx={{
                          backgroundColor: getDocumentTypeColor(document.documentType),
                          color: 'white',
                          fontFamily: '"Lato", "Open Sans", sans-serif',
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Typography variant="caption" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                        {applicationDocumentsService.formatFileSize(document.fileSize)}
                      </Typography>
                      <Typography variant="caption" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleDownload(document)}
                    sx={{ mr: 1 }}
                  >
                    <Download />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteClick(document.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600 }}>
          Submit Supporting Document
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Submission Method Selection */}
            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
              <FormLabel component="legend" sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600, mb: 1 }}>
                How would you like to submit this document?
              </FormLabel>
              <RadioGroup
                value={documentSubmissionMethod}
                onChange={(e) => {
                  setDocumentSubmissionMethod(e.target.value as 'upload' | 'hardcopy');
                  setSelectedFile(null);
                  setSelectedDocumentType('');
                  setError(null);
                }}
              >
                <FormControlLabel
                  value="upload"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CloudUpload />
                      <Typography sx={{ fontFamily: '"Poppins", sans-serif' }}>
                        Upload digital copy
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="hardcopy"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description />
                      <Typography sx={{ fontFamily: '"Poppins", sans-serif' }}>
                        Bring hard copy to school
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            {documentSubmissionMethod === 'upload' ? (
              <>
                {/* Document Type Selection */}
                <FormControl fullWidth sx={{ mb: 3 }} required>
                  <InputLabel id="document-type-label" sx={{ fontFamily: '"Poppins", sans-serif' }}>
                    Document Type *
                  </InputLabel>
                  <Select
                    labelId="document-type-label"
                    value={selectedDocumentType}
                    onChange={(e) => {
                      setSelectedDocumentType(e.target.value);
                      setError(null);
                    }}
                    label="Document Type *"
                    sx={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {loadingDocumentTypes ? (
                      <MenuItem value="" disabled>
                        Loading document types...
                      </MenuItem>
                    ) : documentTypes.length === 0 ? (
                      <MenuItem value="" disabled>
                        No document types available
                      </MenuItem>
                    ) : (
                      documentTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value} sx={{ fontFamily: '"Poppins", sans-serif' }}>
                          {type.label}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                {/* File Selection */}
                <input
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt,.csv"
                  style={{ display: 'none' }}
                  id="file-upload-input"
                  type="file"
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ 
                      fontFamily: '"Poppins", sans-serif',
                      mb: 2,
                      borderStyle: selectedFile ? 'solid' : 'dashed',
                      borderWidth: selectedFile ? 2 : 1,
                      borderColor: selectedFile ? '#4caf50' : 'primary.main',
                      backgroundColor: selectedFile ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: selectedFile ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                  >
                    {selectedFile ? `Selected: ${selectedFile.name}` : 'Select File to Upload'}
                  </Button>
                </label>

                {selectedFile && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600, mb: 0.5 }}>
                      File Selected:
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: '"Poppins", sans-serif', color: '#666' }}>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: '"Poppins", sans-serif', color: '#666' }}>
                      Size: {applicationDocumentsService.formatFileSize(selectedFile.size)}
                    </Typography>
                  </Box>
                )}

                {uploading && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: '"Poppins", sans-serif' }}>
                      Uploading... {uploadProgress}%
                    </Typography>
                  </Box>
                )}

                {error && (
                  <Alert severity="error" sx={{ mt: 2, fontFamily: '"Poppins", sans-serif' }}>
                    {error}
                  </Alert>
                )}
              </>
            ) : (
              <Box>
                <Alert severity="info" sx={{ fontFamily: '"Poppins", sans-serif', mb: 2 }}>
                  <Typography variant="body2" sx={{ fontFamily: '"Poppins", sans-serif', mb: 1 }}>
                    <strong>Hard Copy Submission</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: '"Poppins", sans-serif' }}>
                    You have chosen to bring hard copies of your documents to the school. 
                    Please ensure you bring all required documents when you visit the school for your interview.
                  </Typography>
                </Alert>
                <Typography variant="body2" sx={{ fontFamily: '"Poppins", sans-serif', color: '#666', mt: 2 }}>
                  <strong>School Address:</strong> 162 Koeberg Road, Brooklyn<br />
                  <strong>Phone:</strong> +27 21 511 4337<br />
                  <strong>Email:</strong> admin@holycrossbrooklyn.co.za
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleDialogClose}
            sx={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Cancel
          </Button>
          {documentSubmissionMethod === 'upload' ? (
            <Button
              onClick={handleUpload}
              variant="contained"
              disabled={!selectedFile || !selectedDocumentType || uploading}
              sx={{ 
                fontFamily: '"Poppins", sans-serif',
                backgroundColor: (!selectedFile || !selectedDocumentType || uploading) ? 'rgba(0, 0, 0, 0.26)' : '#1a237e',
                '&:hover': {
                  backgroundColor: (!selectedFile || !selectedDocumentType || uploading) ? 'rgba(0, 0, 0, 0.26)' : '#0d1458',
                }
              }}
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          ) : (
            <Button
              onClick={handleDialogClose}
              variant="contained"
              sx={{ 
                fontFamily: '"Poppins", sans-serif',
                backgroundColor: '#1a237e',
                '&:hover': {
                  backgroundColor: '#0d1458',
                }
              }}
            >
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600, color: '#d32f2f' }}>
          Delete Document
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: '"Poppins", sans-serif' }}>
            Are you sure you want to delete this document? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationDocumentUpload;
