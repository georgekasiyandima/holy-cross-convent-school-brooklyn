import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Alert,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PictureAsPdf,
  Download,
  Close,
  School,
  Visibility,
  Description,
  Info
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

//---------------------------------------------------------
// TYPES & INTERFACES
//---------------------------------------------------------
interface Document {
  id: string;
  title: string;
  description: string;
  type: 'logo' | 'mission' | 'vision' | 'policy' | 'other';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  category: string;
  tags: string[];
}

interface DocumentViewerProps {
  documents: Document[];
  title?: string;
  showDownload?: boolean;
  showFullscreen?: boolean;
  maxHeight?: number;
}

//---------------------------------------------------------
// STYLED COMPONENTS
//---------------------------------------------------------
const DocumentCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const DocumentGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  [theme.breakpoints.up('xs')]: {
    gridTemplateColumns: '1fr',
  },
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

//---------------------------------------------------------
// UTILITY FUNCTIONS
//---------------------------------------------------------
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'logo':
      return <School sx={{ color: '#1a237e' }} />;
    case 'mission':
      return <Description sx={{ color: '#ff9800' }} />;
    case 'vision':
      return <Visibility sx={{ color: '#4caf50' }} />;
    default:
      return <PictureAsPdf sx={{ color: '#f44336' }} />;
  }
};

const getDocumentColor = (type: string) => {
  switch (type) {
    case 'logo':
      return '#e3f2fd';
    case 'mission':
      return '#fff3e0';
    case 'vision':
      return '#e8f5e8';
    default:
      return '#f5f5f5';
  }
};

//---------------------------------------------------------
// PDF VIEWER COMPONENT
//---------------------------------------------------------
const PDFViewer: React.FC<{ 
  fileUrl: string; 
  title: string; 
  onClose: () => void;
  showDownload?: boolean;
}> = ({ fileUrl, title, onClose, showDownload = true }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = () => setLoading(false);
      iframe.onerror = () => {
        setError('Failed to load PDF');
        setLoading(false);
      };
    }
  }, [fileUrl]);

  const handleDownload = () => {
    const link = window.document.createElement('a');
    link.href = fileUrl;
    link.download = title;
    link.target = '_blank';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      {loading && (
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 1 
        }}>
          <LinearProgress sx={{ width: 200 }} />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Loading PDF...
          </Typography>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      
      <iframe
        ref={iframeRef}
        src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        title={title}
      />
      
      {showDownload && (
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          display: 'flex', 
          gap: 1 
        }}>
          <Tooltip title="Download PDF">
            <IconButton 
              onClick={handleDownload}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'white' }
              }}
            >
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton 
              onClick={onClose}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'white' }
              }}
            >
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

//---------------------------------------------------------
// DOCUMENT CARD COMPONENT
//---------------------------------------------------------
const DocumentCardComponent: React.FC<{
  document: Document;
  onView: (document: Document) => void;
  onDownload: (document: Document) => void;
  showDownload?: boolean;
}> = ({ document, onView, onDownload, showDownload = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <DocumentCard onClick={() => onView(document)}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          minHeight: 48 
        }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: 1, 
            backgroundColor: getDocumentColor(document.type),
            mr: 2 
          }}>
            {getDocumentIcon(document.type)}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: '#1a237e',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {document.title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {document.fileName}
            </Typography>
          </Box>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, minHeight: 40 }}
        >
          {document.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          <Chip 
            label={document.type.toUpperCase()} 
            size="small" 
            sx={{ 
              backgroundColor: getDocumentColor(document.type),
              color: '#1a237e',
              fontWeight: 500
            }} 
          />
          {document.tags.slice(0, 2).map((tag, index) => (
            <Chip 
              key={index}
              label={tag} 
              size="small" 
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          ))}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography variant="caption" color="text.secondary">
            {formatFileSize(document.fileSize)}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="View Document">
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  onView(document);
                }}
                sx={{ color: '#1a237e' }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            
            {showDownload && (
              <Tooltip title="Download">
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(document);
                  }}
                  sx={{ color: '#1a237e' }}
                >
                  <Download />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </DocumentCard>
  );
};

//---------------------------------------------------------
// MAIN DOCUMENT VIEWER COMPONENT
//---------------------------------------------------------
const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documents,
  title = "School Documents",
  showDownload = true,
  showFullscreen = true,
  maxHeight = 600
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    if (showFullscreen) {
      setFullscreenOpen(true);
    }
  };

  const handleDownloadDocument = (document: Document) => {
    const link = window.document.createElement('a');
    link.href = document.fileUrl;
    link.download = document.fileName;
    link.target = '_blank';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleCloseFullscreen = () => {
    setFullscreenOpen(false);
    setSelectedDocument(null);
  };

  // Group documents by type for better organization
  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.type]) {
      acc[doc.type] = [];
    }
    acc[doc.type].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <Box>
      <Typography 
        variant="h4" 
        sx={{ 
          color: '#1a237e', 
          fontWeight: 700, 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Info sx={{ color: '#ffca28' }} />
        {title}
      </Typography>

      {Object.entries(groupedDocuments).map(([type, docs]) => (
        <Box key={type} sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 600, 
              mb: 2,
              textTransform: 'capitalize'
            }}
          >
            {type} Documents ({docs.length})
          </Typography>
          
          <DocumentGrid>
            {docs.map((document) => (
              <DocumentCardComponent
                key={document.id}
                document={document}
                onView={handleViewDocument}
                onDownload={handleDownloadDocument}
                showDownload={showDownload}
              />
            ))}
          </DocumentGrid>
        </Box>
      ))}

      {/* Fullscreen PDF Viewer Dialog */}
      <Dialog
        open={fullscreenOpen}
        onClose={handleCloseFullscreen}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            height: isMobile ? '100vh' : '90vh',
            maxHeight: isMobile ? '100vh' : '90vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#1a237e',
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedDocument?.title}
          </Typography>
          <IconButton 
            onClick={handleCloseFullscreen}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, height: '100%' }}>
          {selectedDocument && (
            <PDFViewer
              fileUrl={selectedDocument.fileUrl}
              title={selectedDocument.title}
              onClose={handleCloseFullscreen}
              showDownload={showDownload}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DocumentViewer;
