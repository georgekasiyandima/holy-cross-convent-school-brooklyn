import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Stack,
  IconButton,
  Alert
} from '@mui/material';
import {
  Download,
  Close,
  PictureAsPdf,
  Description,
  School
} from '@mui/icons-material';
import DocumentService, { Document } from '../services/documentService';

const documentService = DocumentService.getInstance();

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'logo':
      return <School />;
    case 'mission':
    case 'vision':
      return <Description />;
    default:
      return <PictureAsPdf />;
  }
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'logo':
      return '#ffca28';
    case 'mission':
      return '#4caf50';
    case 'vision':
      return '#2196f3';
    case 'policy':
      return '#ff9800';
    case 'form':
      return '#9c27b0';
    default:
      return '#1a237e';
  }
};

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
  const downloadUrl = documentService.getDocumentDownloadUrl(document.fileUrl);

  return (
    <Box sx={{ p: 2 }}>
      {/* Document Header */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5', position: 'relative' }}>
        <IconButton
          onClick={onClose}
          aria-label="Close document viewer"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: '#1a237e'
          }}
        >
          <Close />
        </IconButton>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, pr: 4 }}>
          <Box sx={{ color: getTypeColor(document.type) }}>
            {getTypeIcon(document.type)}
          </Box>
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600 }}>
            {document.title}
          </Typography>
          <Chip 
            label={document.type.toUpperCase()} 
            sx={{ 
              bgcolor: getTypeColor(document.type),
              color: 'white',
              fontWeight: 'bold'
            }} 
          />
        </Stack>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          {document.description || 'No description provided.'}
        </Typography>
        
        {document.tags.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {document.tags.map((tag, index) => (
              <Chip 
                key={index}
                label={tag} 
                size="small" 
                variant="outlined"
                sx={{ borderColor: '#1a237e', color: '#1a237e' }}
              />
            ))}
          </Stack>
        )}
      </Paper>

      {/* Document Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
          Document Information
        </Typography>
        
        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>File Name:</strong> {document.fileName}
          </Typography>
          <Typography variant="body2">
            <strong>File Size:</strong> {documentService.formatFileSize(document.fileSize)}
          </Typography>
          <Typography variant="body2">
            <strong>Category:</strong> {document.category}
          </Typography>
          <Typography variant="body2">
            <strong>Uploaded:</strong> {new Date(document.createdAt).toLocaleDateString()}
          </Typography>
        </Stack>
      </Paper>

      {/* Document Preview/Download */}
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Click the download button below to view or download this document.
        </Alert>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<Download />}
          href={downloadUrl}
          download={document.fileName || document.title}
          sx={{ 
            bgcolor: '#1a237e',
            '&:hover': { bgcolor: '#0d1421' },
            px: 4,
            py: 1.5
          }}
        >
          Download Document
        </Button>
      </Paper>
    </Box>
  );
};

export default DocumentViewer;