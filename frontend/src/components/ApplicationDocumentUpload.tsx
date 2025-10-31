import React, { useState, useEffect } from 'react';
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
  DialogActions,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Download,
  AttachFile,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
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

  useEffect(() => {
    loadDocuments();
    loadDocumentTypes();
  }, [applicationId]);

  const loadDocuments = async () => {
    const result = await applicationDocumentsService.getDocuments(applicationId);
    if (result.success && result.data) {
      setDocuments(result.data);
      onDocumentsChange?.(result.data);
    }
  };

  const loadDocumentTypes = async () => {
    const result = await applicationDocumentsService.getDocumentTypes();
    if (result.success && result.data) {
      setDocumentTypes(result.data);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
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
        setSelectedFile(null);
        setSelectedDocumentType('');
        setUploadDialogOpen(false);
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

  const handleDelete = async (documentId: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const result = await applicationDocumentsService.deleteDocument(documentId);
      if (result.success) {
        setSuccess('Document deleted successfully');
        await loadDocuments();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'Delete failed');
      }
    }
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
            onClick={() => setUploadDialogOpen(true)}
            sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}
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
                    onClick={() => handleDelete(document.id)}
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
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
          Upload Document
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Document Type</InputLabel>
              <Select
                value={selectedDocumentType}
                onChange={(e) => setSelectedDocumentType(e.target.value)}
                label="Document Type"
                sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}
              >
                {documentTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value} sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <input
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt,.csv"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}
              >
                {selectedFile ? selectedFile.name : 'Select File'}
              </Button>
            </label>

            {selectedFile && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                  Selected: {selectedFile.name} ({applicationDocumentsService.formatFileSize(selectedFile.size)})
                </Typography>
              </Box>
            )}

            {uploading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" sx={{ mt: 1, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setUploadDialogOpen(false)}
            sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || !selectedDocumentType || uploading}
            sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationDocumentUpload;
