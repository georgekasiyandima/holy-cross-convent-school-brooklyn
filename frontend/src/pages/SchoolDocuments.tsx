import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Button,
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
  DialogContent
} from '@mui/material';
import {
  School,
  PictureAsPdf,
  Download,
  Visibility,
  Search
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';
import DocumentViewer from '../components/DocumentViewer';
import SEO from '../components/SEO';
import ReturnToHome from '../components/ReturnToHome';
import DocumentService, { Document } from '../services/documentService';

const documentService = DocumentService.getInstance();

const SchoolDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetched = await documentService.getAllPublishedDocuments();
      setDocuments(fetched);

      const typeSet = new Set<string>();
      fetched.forEach((doc) => {
        if (doc.type) {
          typeSet.add(doc.type.toLowerCase());
        }
      });
      setAvailableTypes(Array.from(typeSet));
    } catch (err) {
      console.error('Failed to load documents:', err);
      setError('Failed to load documents. Please try again later.');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
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

  const matchesSearch = (doc: Document) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  };

  const matchesFilter = (doc: Document) => {
    if (filterType === 'all') return true;
    return doc.type?.toLowerCase() === filterType;
  };

  const filteredDocuments = documents.filter((doc) => matchesSearch(doc) && matchesFilter(doc));

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
        description="Access important school documents including policies, admissions forms, and key resources for parents and learners."
        keywords="school documents, policies, fees, forms, Holy Cross Convent School"
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
            sx={{ mb: 3, maxWidth: 650, mx: 'auto' }}
          >
            Download the latest policies, admissions resources, fee structures, and other key documents to support your family throughout the school year.
          </Typography>

          <Paper sx={{ p: 3, mb: 3, maxWidth: 900, mx: 'auto' }}>
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
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={handleFilterChange}
                  label="Filter by Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {availableTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>
        </Box>

        {/* Documents Grid */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {filteredDocuments.map((document) => {
            const fileUrl = documentService.getDocumentDownloadUrl(document.fileUrl);
            const typeLabel = document.type ? document.type.replace(/_/g, ' ').toUpperCase() : 'DOCUMENT';

            return (
              <Box key={document.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' } }}>
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
                        label={typeLabel} 
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
                      {document.description || 'No description provided.'}
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary">
                      {document.fileName} • {documentService.formatFileSize(document.fileSize)}
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
                      href={fileUrl}
                      download={document.fileName || document.title}
                      sx={{ color: '#1a237e' }}
                    >
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            );
          })}
        </Box>

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
    </>
  );
};

export default SchoolDocuments;