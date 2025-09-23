import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  School,
  Description,
  Visibility,
  PictureAsPdf,
  Add,
  Search
} from '@mui/icons-material';
import DocumentViewer from '../components/DocumentViewer';
import useDocumentManagement from '../hooks/useDocumentManagement';
import SEO from '../components/SEO';

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

//---------------------------------------------------------
// TAB PANEL COMPONENT
//---------------------------------------------------------
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`document-tabpanel-${index}`}
      aria-labelledby={`document-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

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
    fileSize: 2048576, // 2MB
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
    fileSize: 1536000, // 1.5MB
    uploadedAt: '2025-01-10',
    category: 'Governance',
    tags: ['mission', 'values', 'goals']
  },
  {
    id: '3',
    title: 'Vision Statement',
    description: 'Our vision for the future of education and the development of our students.',
    type: 'vision',
    fileUrl: '/documents/vision-statement.pdf',
    fileName: 'vision-statement.pdf',
    fileSize: 1024000, // 1MB
    uploadedAt: '2025-01-08',
    category: 'Governance',
    tags: ['vision', 'future', 'aspirations']
  },
  {
    id: '4',
    title: 'School Policies Handbook',
    description: 'Comprehensive handbook covering all school policies and procedures.',
    type: 'policy',
    fileUrl: '/documents/policies-handbook.pdf',
    fileName: 'policies-handbook.pdf',
    fileSize: 5120000, // 5MB
    uploadedAt: '2025-01-05',
    category: 'Governance',
    tags: ['policies', 'procedures', 'handbook']
  }
];

//---------------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------------
const SchoolDocuments: React.FC = () => {
  const {
    documents,
    loading,
    error,
    loadDocuments,
    clearError
  } = useDocumentManagement();

  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Load documents on component mount
  useEffect(() => {
    loadDocuments('policies', true); // Load published policy documents
  }, [loadDocuments]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: any) => {
    setFilterType(event.target.value);
  };

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
  };

  // Filter documents based on search and filter criteria
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Group documents by type
  const logoDocuments = filteredDocuments.filter(doc => doc.type === 'logo');
  const missionDocuments = filteredDocuments.filter(doc => doc.type === 'mission');
  const visionDocuments = filteredDocuments.filter(doc => doc.type === 'vision');
  const policyDocuments = filteredDocuments.filter(doc => doc.type === 'policy');

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
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
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700, 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <School sx={{ color: '#ffca28', fontSize: 40 }} />
            School Documents
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 3, maxWidth: 800 }}
          >
            Access important school documents including our mission statement, vision statement, 
            school logo explanation, and comprehensive policy documents.
          </Typography>

          {/* Search and Filter Controls */}
          <Paper sx={{ p: 2, mb: 3 }}>
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
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleUploadDialogOpen}
                sx={{ 
                  bgcolor: '#1a237e',
                  '&:hover': { bgcolor: '#0d1421' }
                }}
              >
                Upload Document
              </Button>
            </Stack>
          </Paper>
        </Box>

        {/* Document Statistics */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip 
              icon={<School />} 
              label={`${logoDocuments.length} Logo Documents`} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              icon={<Description />} 
              label={`${missionDocuments.length} Mission Documents`} 
              color="secondary" 
              variant="outlined" 
            />
            <Chip 
              icon={<Visibility />} 
              label={`${visionDocuments.length} Vision Documents`} 
              color="success" 
              variant="outlined" 
            />
            <Chip 
              icon={<PictureAsPdf />} 
              label={`${policyDocuments.length} Policy Documents`} 
              color="warning" 
              variant="outlined" 
            />
          </Stack>
        </Box>

        {/* Document Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab 
                label={`All Documents (${filteredDocuments.length})`} 
                icon={<PictureAsPdf />}
                iconPosition="start"
              />
              <Tab 
                label={`Logo (${logoDocuments.length})`} 
                icon={<School />}
                iconPosition="start"
              />
              <Tab 
                label={`Mission (${missionDocuments.length})`} 
                icon={<Description />}
                iconPosition="start"
              />
              <Tab 
                label={`Vision (${visionDocuments.length})`} 
                icon={<Visibility />}
                iconPosition="start"
              />
              <Tab 
                label={`Policies (${policyDocuments.length})`} 
                icon={<PictureAsPdf />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <DocumentViewer 
              documents={filteredDocuments}
              title="All Documents"
              showDownload={true}
              showFullscreen={true}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <DocumentViewer 
              documents={logoDocuments}
              title="Logo Documents"
              showDownload={true}
              showFullscreen={true}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <DocumentViewer 
              documents={missionDocuments}
              title="Mission Documents"
              showDownload={true}
              showFullscreen={true}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <DocumentViewer 
              documents={visionDocuments}
              title="Vision Documents"
              showDownload={true}
              showFullscreen={true}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <DocumentViewer 
              documents={policyDocuments}
              title="Policy Documents"
              showDownload={true}
              showFullscreen={true}
            />
          </TabPanel>
        </Paper>

        {/* Upload Dialog */}
        <Dialog 
          open={uploadDialogOpen} 
          onClose={handleUploadDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Upload New Document</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              This feature will be implemented in the next phase. For now, please contact the administrator to upload documents.
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Future upload functionality will include:
              <br />• PDF file validation
              <br />• Automatic categorization
              <br />• Tag management
              <br />• Version control
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUploadDialogClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default SchoolDocuments;
