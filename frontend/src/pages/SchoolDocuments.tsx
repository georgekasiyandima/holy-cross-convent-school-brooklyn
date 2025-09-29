import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  School,
  Description,
  PictureAsPdf,
  Download,
  Visibility,
  Search,
  Add,
  CheckCircle,
  Error
} from '@mui/icons-material';
import DocumentViewer from '../components/DocumentViewer';
import useDocumentManagement from '../hooks/useDocumentManagement';
import SEO from '../components/SEO';
import ReturnToHome from '../components/ReturnToHome';

//---------------------------------------------------------
// TYPES & INTERFACES
//---------------------------------------------------------
interface Document {
  id: string;
  title: string;
  description: string;
  type: 'logo' | 'mission' | 'vision' | 'policy' | 'form' | 'other';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  category: string;
  tags: string[];
}

//---------------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------------
const SchoolDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const { uploadDocument, loading: uploadLoading } = useDocumentManagement();

  //---------------------------------------------------------
  // SAMPLE DATA (Replace with API calls)
  //---------------------------------------------------------
  const sampleDocuments: Document[] = [
    {
      id: '1',
      title: 'Holy Cross Convent School Logo',
      description: 'Official school logo with detailed explanation of its symbolic meaning and design elements.',
      type: 'logo',
      fileUrl: '/documents/logo-explanation.pdf',
      fileName: 'logo-explanation.pdf',
      fileSize: 2048576,
      uploadedAt: '2025-01-15',
      category: 'Branding',
      tags: ['logo', 'branding', 'symbolism']
    },
    {
      id: '2',
      title: 'Mission Statement',
      description: 'Our school\'s mission statement outlining our commitment to academic excellence and character development.',
      type: 'mission',
      fileUrl: '/documents/mission-statement.pdf',
      fileName: 'mission-statement.pdf',
      fileSize: 1536000,
      uploadedAt: '2025-01-10',
      category: 'Mission',
      tags: ['mission', 'values', 'education']
    },
    {
      id: '3',
      title: 'Vision Statement',
      description: 'Our vision for the future of education and student development at Holy Cross Convent School.',
      type: 'vision',
      fileUrl: '/documents/vision-statement.pdf',
      fileName: 'vision-statement.pdf',
      fileSize: 1280000,
      uploadedAt: '2025-01-08',
      category: 'Vision',
      tags: ['vision', 'future', 'goals']
    },
    {
      id: '4',
      title: 'School Policies',
      description: 'Comprehensive school policies covering academic standards, behavior expectations, and procedures.',
      type: 'policy',
      fileUrl: '/documents/school-policies.pdf',
      fileName: 'school-policies.pdf',
      fileSize: 5120000,
      uploadedAt: '2025-01-05',
      category: 'Policies',
      tags: ['policies', 'rules', 'procedures']
    }
  ];

  //---------------------------------------------------------
  // EFFECTS
  //---------------------------------------------------------
  useEffect(() => {
    loadDocuments();
  }, []);

  //---------------------------------------------------------
  // HANDLERS
  //---------------------------------------------------------
  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDocuments(sampleDocuments);
    } catch (err) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: any) => {
    setFilterType(event.target.value);
  };

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setViewerOpen(true);
  };

  const handleViewerClose = () => {
    setViewerOpen(false);
    setSelectedDocument(null);
  };

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
  };

  const handleUploadSuccess = () => {
    setSnackbar({
      open: true,
      message: 'Document uploaded successfully!',
      severity: 'success'
    });
    setUploadDialogOpen(false);
    loadDocuments();
  };

  const handleUploadError = (error: string) => {
    setSnackbar({
      open: true,
      message: `Upload failed: ${error}`,
      severity: 'error'
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  //---------------------------------------------------------
  // FILTERED DOCUMENTS
  //---------------------------------------------------------
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  //---------------------------------------------------------
  // RENDER
  //---------------------------------------------------------
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ color: '#1a237e', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading documents...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <ReturnToHome />
      </Container>
    );
  }

  return (
    <>
      <SEO 
        title="School Documents - Holy Cross Convent School"
        description="Access important school documents including our mission statement, vision statement, school logo explanation, and policy documents."
        keywords="school documents, mission statement, vision statement, school logo, policies, Holy Cross Convent School"
      />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ReturnToHome />
        
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700, 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <School sx={{ color: '#ffca28', fontSize: 40 }} />
            School Documents
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
          >
            Access important school documents including our mission statement, vision statement, 
            and comprehensive policy documents.
          </Typography>

          {/* Search and Filter Controls */}
          <Paper sx={{ p: 3, mb: 3, maxWidth: 800, mx: 'auto' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                placeholder="Search documents..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={handleFilterChange}
                  label="Filter by Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="logo">Logo</MenuItem>
                  <MenuItem value="mission">Mission</MenuItem>
                  <MenuItem value="vision">Vision</MenuItem>
                  <MenuItem value="policy">Policy</MenuItem>
                  <MenuItem value="form">Form</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>
        </Box>

        {/* Documents Grid */}
        <Grid container spacing={3}>
          {filteredDocuments.map((document) => (
            <Grid key={document.id} item xs={12} sm={6} md={4} {...({ item: true } as any)}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PictureAsPdf sx={{ color: '#1a237e', mr: 1 }} />
                    <Chip 
                      label={document.type.toUpperCase()} 
                      size="small" 
                      sx={{ 
                        bgcolor: '#1a237e',
                        color: 'white',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Box>
                  
                  <Typography variant="h6" sx={{ mb: 1, color: '#1a237e', fontWeight: 600 }}>
                    {document.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {document.description}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    {document.fileName} • {(document.fileSize / 1024 / 1024).toFixed(1)} MB
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleDocumentClick(document)}
                    sx={{ color: '#1a237e' }}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Download />}
                    href={document.fileUrl}
                    download
                    sx={{ color: '#1a237e' }}
                  >
                    Download
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredDocuments.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No documents found matching your criteria.
            </Typography>
          </Box>
        )}
      </Container>

      {/* Document Viewer Dialog */}
      <Dialog
        open={viewerOpen}
        onClose={handleViewerClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedDocument?.title}
        </DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <DocumentViewer 
              document={selectedDocument}
              onClose={handleViewerClose}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Success/Error Snackbar */}
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
    </>
  );
};

export default SchoolDocuments;