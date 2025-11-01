import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Fade,
  Slide,
} from '@mui/material';
import {
  PictureAsPdf,
  Download,
  HelpOutline,
  Email,
  Phone,
  Description,
  School,
  Policy,
  Security,
  AccessTime,
  Language,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ReturnToHome from '../components/ReturnToHome';
import documentsService, { Document } from '../services/documentsService';
import SEO from '../components/SEO';

// Document categories and their expected titles
const POLICY_DOCUMENTS = [
  { title: 'General School Policy', icon: <Policy />, category: 'policy' },
  { title: 'Code of Conduct', icon: <Security />, category: 'policy' },
  { title: 'Admission Policy', icon: <School />, category: 'policy' },
  { title: 'Cellphone Policy', icon: <Phone />, category: 'policy' },
  { title: 'Learner Attendance Policy', icon: <AccessTime />, category: 'policy' },
  { title: 'Language Policy', icon: <Language />, category: 'policy' },
];

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("/ROBT02.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  color: 'white',
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
  filter: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.75) 0%, rgba(57, 73, 171, 0.65) 100%)',
    zIndex: 0,
  },
}));

const DocumentCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(26, 35, 126, 0.1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: '#ffd700',
  },
}));

const DownloadButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1a237e',
  color: 'white',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.spacing(1),
  '&:hover': {
    backgroundColor: '#0d47a1',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)',
  },
  '&:disabled': {
    backgroundColor: '#ccc',
    color: '#666',
  },
}));

const FormsFees: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const policyDocs = await documentsService.getPolicyDocuments();
      console.log('Fetched documents:', policyDocs);
      console.log('Documents count:', policyDocs.length);
      policyDocs.forEach(doc => {
        console.log(`- ${doc.title} (category: ${doc.category}, published: ${doc.isPublished})`);
      });
      setDocuments(policyDocs);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      setDownloading(doc.id);
      const downloadUrl = documentsService.getDocumentDownloadUrl(doc.fileUrl);
      
      // Create a temporary anchor element to trigger download
      const link = window.document.createElement('a');
      link.href = downloadUrl;
      link.download = doc.fileName || `${doc.title}.pdf`;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      // Small delay to show loading state
      setTimeout(() => {
        setDownloading(null);
      }, 1000);
    } catch (err) {
      console.error('Error downloading document:', err);
      setError('Failed to download document. Please try again.');
      setDownloading(null);
    }
  };

  // Match backend documents with expected policy documents
  const getDocumentForPolicy = (policyTitle: string): Document | null => {
    // Normalize titles for matching
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedPolicyTitle = normalize(policyTitle);
    
    // Create a mapping of expected titles to document titles for better matching
    const titleMappings: Record<string, string[]> = {
      'General School Policy': ['generalschoolpolicy', 'general school policy'],
      'Code of Conduct': ['codeofconduct', 'code of conduct'],
      'Admission Policy': ['admissionpolicy', 'admission policy'],
      'Cellphone Policy': ['cellphonepolicy', 'cellphone policy'],
      'Learner Attendance Policy': ['learnerattendance', 'learner attendance', 'learnerattendancepolicy'],
      'Language Policy': ['languagepolicy', 'language policy'],
    };
    
    const match = documents.find(doc => {
      // Only match published documents
      if (!doc.isPublished) return false;
      
      const normalizedDocTitle = normalize(doc.title);
      
      // First try exact normalized match
      if (normalizedDocTitle === normalizedPolicyTitle) {
        return true;
      }
      
      // Try title mappings for more precise matching
      const expectedVariations = titleMappings[policyTitle] || [];
      for (const variation of expectedVariations) {
        if (normalizedDocTitle === variation || normalizedDocTitle.includes(variation) || variation.includes(normalizedDocTitle)) {
          return true;
        }
      }
      
      // Specific keyword matching (more precise)
      if (policyTitle === 'Code of Conduct') {
        return normalizedDocTitle.includes('code') && normalizedDocTitle.includes('conduct');
      }
      if (policyTitle === 'General School Policy') {
        return normalizedDocTitle.includes('general') && normalizedDocTitle.includes('school') && normalizedDocTitle.includes('policy');
      }
      if (policyTitle === 'Admission Policy') {
        return normalizedDocTitle.includes('admission') && normalizedDocTitle.includes('policy');
      }
      if (policyTitle === 'Cellphone Policy') {
        return normalizedDocTitle.includes('cellphone') && normalizedDocTitle.includes('policy');
      }
      if (policyTitle === 'Learner Attendance Policy') {
        return normalizedDocTitle.includes('learner') && normalizedDocTitle.includes('attendance');
      }
      if (policyTitle === 'Language Policy') {
        return normalizedDocTitle.includes('language') && normalizedDocTitle.includes('policy');
      }
      
      return false;
    });
    
    if (!match && documents.length > 0) {
      console.log(`No match found for "${policyTitle}". Available documents:`, documents.map(d => `${d.title} (id: ${d.id})`));
    }
    
    return match || null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      <SEO
        title="School Documents - Holy Cross Convent School"
        description="Download important school documents, policies, and forms. Access admission policies, code of conduct, and more."
        keywords="school documents, policies, admission, forms, Holy Cross Convent School"
      />
      
      {/* Hero Section */}
      <HeroSection>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  fontWeight: 800,
                  mb: 3,
                  color: '#ffffff',
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
                  fontFamily: '"Lato", "Open Sans", sans-serif'
                }}
              >
          School Documents
        </Typography>
              <Typography
                variant="h5"
                sx={{
                  maxWidth: '700px',
                  mx: 'auto',
                  color: '#ffffff',
                  fontWeight: 500,
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  lineHeight: 1.6,
                  textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)',
                  fontFamily: '"Lato", "Open Sans", sans-serif'
                }}
              >
                Access important school documents, policies, and fee information. All documents are available in PDF format.
              </Typography>
            </Box>
          </Container>
        </Box>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ color: '#1a237e' }} />
          </Box>
        ) : (
          <>
            {/* Documents Grid */}
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  color: '#1a237e',
                  fontWeight: 700,
                  mb: 4,
                  textAlign: 'center',
                  fontFamily: '"Lato", "Open Sans", sans-serif'
                }}
              >
                School Policies & Documents
              </Typography>

              <Grid container spacing={3}>
                {POLICY_DOCUMENTS.map((policy, index) => {
                  const document = getDocumentForPolicy(policy.title);
                  const isDownloading = downloading === document?.id;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={policy.title}>
                      <Fade in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                        <DocumentCard>
                          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Box
                                sx={{
                                  backgroundColor: 'rgba(26, 35, 126, 0.1)',
                                  borderRadius: 2,
                                  p: 1.5,
                                  mr: 2,
                                  color: '#1a237e',
                                }}
                              >
                                {policy.icon}
                              </Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: '#1a237e',
                                  fontWeight: 600,
                                  fontFamily: '"Lato", "Open Sans", sans-serif',
                                  flex: 1,
                                }}
                              >
                                {policy.title}
        </Typography>
      </Box>

                            {document ? (
                              <>
                                {document.description && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: '#666',
                                      mb: 2,
                                      flexGrow: 1,
                                      fontFamily: '"Lato", "Open Sans", sans-serif',
                                    }}
                                  >
                                    {document.description}
                                  </Typography>
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Chip
                                    icon={<PictureAsPdf sx={{ color: '#e53935' }} />}
                                    label={formatFileSize(document.fileSize)}
                                    size="small"
                                    sx={{ backgroundColor: 'rgba(229, 57, 53, 0.1)' }}
                                  />
                                </Box>
                                <DownloadButton
                                  fullWidth
                                  variant="contained"
                                  startIcon={
                                    isDownloading ? (
                                      <CircularProgress size={16} sx={{ color: 'white' }} />
                                    ) : (
                                      <Download />
                                    )
                                  }
                                  onClick={() => handleDownload(document)}
                                  disabled={isDownloading}
                                >
                                  {isDownloading ? 'Downloading...' : 'Download PDF'}
                                </DownloadButton>
                              </>
                            ) : (
                              <>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#999',
                                    mb: 2,
                                    flexGrow: 1,
                                    fontStyle: 'italic',
                                    fontFamily: '"Lato", "Open Sans", sans-serif',
                                  }}
                                >
                                  Document will be available soon
                                </Typography>
                                <DownloadButton
                                  fullWidth
                  variant="contained"
                                  disabled
                  startIcon={<Download />}
                                >
                                  Coming Soon
                                </DownloadButton>
                              </>
                            )}
                          </CardContent>
                        </DocumentCard>
                      </Fade>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            {/* Additional Documents Section */}
            {(() => {
              const additionalDocs = documents.filter(doc => {
                // Only show published documents
                if (!doc.isPublished) return false;
                
                const isPolicyDoc = POLICY_DOCUMENTS.some(p => getDocumentForPolicy(p.title)?.id === doc.id);
                const isCodeOfConduct = doc.title.toLowerCase().includes('code') && doc.title.toLowerCase().includes('conduct');
                
                // Show Mission Statement, Logo Symbolism, and other non-policy documents
                const isMissionOrLogo = doc.title.toLowerCase().includes('mission') || 
                                        doc.title.toLowerCase().includes('logo') || 
                                        doc.title.toLowerCase().includes('symbolism');
                
                // Exclude policy documents that are already shown in the main list, but include Mission/Logo even if category is policy
                const shouldShow = !isPolicyDoc && !isCodeOfConduct && (isMissionOrLogo || doc.category !== 'policy');
                
                return shouldShow;
              });
              
              console.log('Additional documents count:', additionalDocs.length);
              console.log('Additional documents:', additionalDocs.map(d => ({ title: d.title, category: d.category, isPublished: d.isPublished })));
              console.log('All documents:', documents.map(d => ({ title: d.title, category: d.category, isPublished: d.isPublished })));
              
              if (additionalDocs.length === 0) {
                console.log('No additional documents to show. Filter criteria:');
                console.log('- Must be published:', documents.filter(d => d.isPublished).map(d => d.title));
                console.log('- Must not be in POLICY_DOCUMENTS list');
                console.log('- Must not be Code of Conduct');
                console.log('- Must be Mission/Logo/Symbolism OR category != "policy"');
              }
              
              return additionalDocs.length > 0;
            })() && (
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#1a237e',
                    fontWeight: 700,
                    mb: 3,
                    fontFamily: '"Lato", "Open Sans", sans-serif'
                  }}
                >
                  Additional Documents
                </Typography>
                <Grid container spacing={2}>
                  {documents
                    .filter(doc => {
                      // Only show published documents
                      if (!doc.isPublished) return false;
                      
                      const isPolicyDoc = POLICY_DOCUMENTS.some(p => getDocumentForPolicy(p.title)?.id === doc.id);
                      const isCodeOfConduct = doc.title.toLowerCase().includes('code') && doc.title.toLowerCase().includes('conduct');
                      const isMissionOrLogo = doc.title.toLowerCase().includes('mission') || 
                                              doc.title.toLowerCase().includes('logo') || 
                                              doc.title.toLowerCase().includes('symbolism');
                      
                      // Exclude policy documents that are already shown in the main list, but include Mission/Logo even if category is policy
                      return !isPolicyDoc && !isCodeOfConduct && (isMissionOrLogo || doc.category !== 'policy');
                    })
                    .map((document, index) => (
                      <Grid item xs={12} sm={6} md={4} key={document.id}>
                        <Slide direction="up" in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                          <Paper sx={{ p: 2, border: '1px solid rgba(26, 35, 126, 0.1)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <PictureAsPdf sx={{ color: '#e53935', mr: 1 }} />
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  color: '#1a237e',
                                  fontFamily: '"Lato", "Open Sans", sans-serif',
                                }}
                              >
                                {document.title}
                              </Typography>
                            </Box>
                            {document.description && (
                              <Typography
                                variant="body2"
                                sx={{ color: '#666', mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}
                              >
                                {document.description}
                              </Typography>
                            )}
                            <DownloadButton
                              size="small"
                              startIcon={<Download />}
                              onClick={() => handleDownload(document)}
                              disabled={downloading === document.id}
                >
                  Download
                            </DownloadButton>
                          </Paper>
                        </Slide>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            )}

            {/* Contact/Help Section */}
            <Divider sx={{ my: 6 }} />
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Stack direction="column" spacing={3} alignItems="center">
                <Box
                  sx={{
                    backgroundColor: 'rgba(26, 35, 126, 0.1)',
                    borderRadius: '50%',
                    p: 2,
                    display: 'inline-flex',
                  }}
                >
                  <HelpOutline sx={{ color: '#1a237e', fontSize: 40 }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#1a237e',
                    fontWeight: 700,
                    fontFamily: '"Lato", "Open Sans", sans-serif',
                  }}
                >
            Need Assistance?
          </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#555',
                    maxWidth: 700,
                    mx: 'auto',
                    fontFamily: '"Lato", "Open Sans", sans-serif',
                    lineHeight: 1.8,
                  }}
                >
                  If you have any queries about documents, forms, or fees, please contact the school office.
                  Our team is ready to help you with any questions or assistance you may need.
          </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  justifyContent="center"
                  sx={{ mt: 2 }}
                >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Phone />}
              href="tel:0215114337"
                    sx={{
                      borderColor: '#1a237e',
                      color: '#1a237e',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#3949ab',
                        backgroundColor: 'rgba(26, 35, 126, 0.05)',
                      },
                    }}
            >
              Call School
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Email />}
              href="mailto:admin@holycrossbrooklyn.co.za"
                    sx={{
                      borderColor: '#1a237e',
                      color: '#1a237e',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#3949ab',
                        backgroundColor: 'rgba(26, 35, 126, 0.05)',
                      },
                    }}
            >
              Email Admin
            </Button>
          </Stack>
        </Stack>
      </Box>

            {/* Return to Home - moved to bottom */}
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ReturnToHome />
      </Box>
          </>
        )}
    </Container>
    </>
  );
};

export default FormsFees; 
