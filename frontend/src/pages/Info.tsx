import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, Button, Paper, styled, CircularProgress } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FaxIcon from '@mui/icons-material/Fax';
import LanguageIcon from '@mui/icons-material/Language';
import FlagIcon from '@mui/icons-material/Flag';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';
import DocumentsService from '../services/documentsService';

const Banner = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '500px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'url("/xul.jpg") center/cover no-repeat',
  backgroundPosition: 'center 40%',
  backgroundSize: 'cover',
  textAlign: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,35,126,.80), rgba(211,47,47,.60))',
    zIndex: 0
  },
  '& > *': { position: 'relative', zIndex: 1 }
}));

// Helper function to get document image URL from API response or fallback
const getDocumentImageUrl = (document: any, fallback: string): string => {
  if (document && document.fileUrl) {
    const url = DocumentsService.getDocumentDownloadUrl(document.fileUrl);
    console.log('Document image URL generated:', url, 'for document:', document.title || 'unknown');
    return url;
  }
  console.log('No document found, using fallback:', fallback);
  return fallback;
};

const quickFacts = [
  { icon: <AccessTimeIcon color="primary" />, label: 'School Hours', value: '07:45 – 14:30 (Mon–Fri)' },
  { icon: <SchoolIcon color="primary" />, label: 'Grades', value: 'Grade R – Grade 7' },
  { icon: <EmailIcon color="primary" />, label: 'Email', value: 'admin@holycrossbrooklyn.co.za' },
  { icon: <PhoneIcon color="primary" />, label: 'Phone', value: '021 5114337' },
  { icon: <FaxIcon color="primary" />, label: 'Fax', value: '021 511 9690' },
  { icon: <LocationOnIcon color="primary" />, label: 'Address', value: '162 Koeberg Road Brooklyn 7405' },
  { icon: <LanguageIcon color="primary" />, label: 'Website', value: 'http://www.holycrossbrooklyn.co.za' },
];

const galleryImages = [
  'ROBTX1.jpg',
  'ROBT7.jpg',
  'ROBT4.jpg',
  'acads1.jpg'
];

const Info: React.FC = () => {
  const [missionDoc, setMissionDoc] = useState<any>(null);
  const [visionDoc, setVisionDoc] = useState<any>(null);
  const [holyCrossFamilyDoc, setHolyCrossFamilyDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fallback image URLs (from public folder)
  // Note: If HCCVS.jpeg doesn't exist, use HCCMS.jpeg as temporary fallback
  const missionFallback = '/HCCMS.jpeg';
  const visionFallback = '/HCCMS.jpeg'; // Using HCCMS temporarily until HCCVS.jpeg is uploaded
  const holyCrossFamilyFallback = '/HCCFS.jpeg';

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        setLoading(true);
        
        // Try multiple possible categories for each statement
        // This allows flexibility in how documents are categorized
        const categoryVariations = {
          mission: ['mission', 'mission-statement', 'statement'],
          vision: ['vision', 'vision-statement', 'statement'],
          holyCrossFamily: ['holy-cross-family', 'holy cross family', 'family', 'statement']
        };

        // Fetch all possible categories and find matching documents
        const allCategoryPromises: Promise<any>[] = [];
        const categoryList: string[] = [];
        
        // Collect unique categories to fetch
        const uniqueCategories = new Set<string>();
        Object.values(categoryVariations).forEach(cats => cats.forEach(cat => uniqueCategories.add(cat)));
        uniqueCategories.forEach(cat => {
          categoryList.push(cat);
          allCategoryPromises.push(
            DocumentsService.getDocumentsByCategory(cat)
              .then(response => {
                console.log(`✅ Fetched documents for category "${cat}":`, response);
                return response;
              })
              .catch(error => {
                console.warn(`⚠️ Failed to fetch documents for category "${cat}":`, error);
                return { success: false, data: [] };
              })
          );
        });

        const responses = await Promise.allSettled(allCategoryPromises);
        
        // Flatten all documents with better error handling
        let allDocs: any[] = [];
        responses.forEach((response, index) => {
          const category = categoryList[index];
          if (response.status === 'fulfilled') {
            const responseData = response.value;
            if (responseData && responseData.data && Array.isArray(responseData.data)) {
              console.log(`📄 Found ${responseData.data.length} documents in category "${category}"`);
              allDocs.push(...responseData.data);
            } else if (responseData && Array.isArray(responseData)) {
              // Handle case where API returns array directly
              console.log(`📄 Found ${responseData.length} documents in category "${category}" (array format)`);
              allDocs.push(...responseData);
            } else {
              console.warn(`⚠️ Unexpected response format for category "${category}":`, responseData);
            }
          } else {
            console.error(`❌ Error fetching category "${category}":`, response.reason);
          }
        });

        // Always try fetching all published documents as fallback to catch documents with different category names
        console.log('Fetching all published documents as comprehensive fallback...');
        try {
          const allResponse = await DocumentsService.getAllPublishedDocuments();
          if (allResponse && allResponse.data && Array.isArray(allResponse.data)) {
            // Merge with existing documents, avoiding duplicates
            const existingIds = new Set(allDocs.map(d => d.id));
            const newDocs = allResponse.data.filter(d => !existingIds.has(d.id));
            allDocs = [...allDocs, ...newDocs];
            console.log(`📚 Fetched ${allResponse.data.length} total published documents (${newDocs.length} new, ${allDocs.length - newDocs.length} already found)`);
            console.log('📋 All available document categories:', [...new Set(allResponse.data.map((d: any) => d.category))]);
          }
        } catch (error: any) {
          console.error('❌ Error fetching all documents:', error);
          console.error('Error details:', {
            message: error?.message,
            response: error?.response?.data,
            status: error?.response?.status,
            url: error?.config?.url
          });
          // Continue with category-based documents even if /all fails
        }

        console.log(`📚 Total documents fetched: ${allDocs.length}`);
        if (allDocs.length > 0) {
          console.log('All fetched documents:', allDocs.map(d => ({ 
            id: d.id, 
            title: d.title, 
            category: d.category, 
            fileUrl: d.fileUrl,
            isPublished: d.isPublished
          })));
        } else {
          console.warn('⚠️ No documents found at all. Make sure documents are uploaded and published.');
        }

        // Find vision document FIRST (higher priority) - STRICT matching
        // Priority: 1) category matches 'vision' or 'vision-statement', 2) title contains 'vision' (and NOT 'mission')
        let visionDoc: any = null;
        
        // Step 1: Try exact category match first (most reliable)
        visionDoc = allDocs.find((doc: any) => {
          const categoryLower = (doc.category || '').toLowerCase().trim();
          return categoryLower === 'vision' || categoryLower === 'vision-statement';
        });

        // Step 2: If not found by category, try by title (must contain 'vision', must NOT contain 'mission')
        if (!visionDoc) {
          visionDoc = allDocs.find((doc: any) => {
            const titleLower = (doc.title || '').toLowerCase();
            const categoryLower = (doc.category || '').toLowerCase();
            const fileNameLower = (doc.fileName || '').toLowerCase();
            const fileUrlLower = (doc.fileUrl || '').toLowerCase();
            
            // Must have 'vision' AND must NOT have 'mission' anywhere
            const hasVision = titleLower.includes('vision') || 
                             categoryLower.includes('vision') || 
                             fileNameLower.includes('vision') || 
                             fileUrlLower.includes('vision');
            const hasMission = titleLower.includes('mission') || 
                              categoryLower.includes('mission') || 
                              fileNameLower.includes('mission') || 
                              fileUrlLower.includes('mission');
            
            return hasVision && !hasMission;
          });
        }

        // Step 3: Last resort - any document with 'vision' (and not 'mission') in any field
        if (!visionDoc) {
          visionDoc = allDocs.find((doc: any) => {
            const combinedText = `${doc.title || ''} ${doc.category || ''} ${doc.fileName || ''} ${doc.fileUrl || ''}`.toLowerCase();
            return combinedText.includes('vision') && !combinedText.includes('mission');
          });
        }

        // Find mission document - STRICT matching (must contain 'mission' and NOT contain 'vision')
        // CRITICAL: Exclude any document that was already matched as vision
        const visionDocId = visionDoc ? visionDoc.id : null;
        let missionDoc: any = null;
        
        missionDoc = allDocs.find((doc: any) => {
          // CRITICAL: Never match a document that was already identified as vision
          if (visionDocId && doc.id === visionDocId) {
            console.log('🚫 Excluding document from mission matching (already matched as vision):', doc.id, doc.title);
            return false;
          }
          
          const titleLower = (doc.title || '').toLowerCase();
          const categoryLower = (doc.category || '').toLowerCase();
          const fileNameLower = (doc.fileName || '').toLowerCase();
          const fileUrlLower = (doc.fileUrl || '').toLowerCase();
          
          // Must have 'mission' AND must NOT have 'vision' anywhere
          const hasMission = titleLower.includes('mission') || 
                            categoryLower.includes('mission') || 
                            fileNameLower.includes('mission') || 
                            fileUrlLower.includes('mission');
          const hasVision = titleLower.includes('vision') || 
                          categoryLower.includes('vision') || 
                          fileNameLower.includes('vision') || 
                          fileUrlLower.includes('vision');
          
          // CRITICAL: If document has any 'vision' indicator, exclude it from mission
          if (hasVision) {
            console.log('🚫 Excluding document from mission matching (contains vision):', doc.id, doc.title);
            return false;
          }
          
          return hasMission;
        });

        // Set vision document state
        if (visionDoc) {
          setVisionDoc(visionDoc);
          console.log('✅ VISION DOCUMENT FOUND:', {
            id: visionDoc.id,
            title: visionDoc.title,
            category: visionDoc.category,
            fileUrl: visionDoc.fileUrl
          });
        } else {
          setVisionDoc(null);
          console.warn('⚠️ Vision document not found. Available documents:', allDocs.map(d => ({ 
            id: d.id,
            title: d.title, 
            category: d.category,
            fileUrl: d.fileUrl
          })));
        }

        // Set mission document state - EXPLICITLY set to null if not found (as per user request)
        if (missionDoc) {
          // CRITICAL: Double-check that missionDoc is NOT the same as visionDoc
          if (visionDocId && missionDoc.id === visionDocId) {
            console.error('❌ ERROR: Mission document is the same as vision document! Setting mission to null.');
            setMissionDoc(null);
          } else {
            setMissionDoc(missionDoc);
            console.log('✅ MISSION DOCUMENT FOUND:', {
              id: missionDoc.id,
              title: missionDoc.title,
              category: missionDoc.category,
              fileUrl: missionDoc.fileUrl
            });
          }
        } else {
          // Explicitly set to null if not found - leave empty for now (as per user request)
          setMissionDoc(null);
          console.log('ℹ️ Mission document not found - leaving empty (as requested)');
        }

        // Find Holy Cross Family document
        // IMPORTANT: Exclude any document that was already matched as mission or vision
        const missionDocId = missionDoc ? missionDoc.id : null;
        const holyCrossFamilyDoc = allDocs.find((doc: any) => {
          // Exclude mission and vision documents
          if (visionDocId && doc.id === visionDocId) return false;
          if (missionDocId && doc.id === missionDocId) return false;
          
          const titleLower = doc.title.toLowerCase();
          const categoryLower = (doc.category || '').toLowerCase();
          const fileNameLower = (doc.fileName || '').toLowerCase();
          const fileUrlLower = (doc.fileUrl || '').toLowerCase();
          
          return (
            (titleLower.includes('holy cross') || 
             titleLower.includes('family') ||
             categoryLower.includes('holy-cross-family') ||
             categoryLower.includes('holy cross family') ||
             fileNameLower.includes('holy') ||
             fileUrlLower.includes('holy')) &&
            !titleLower.includes('mission') &&
            !titleLower.includes('vision') &&
            !categoryLower.includes('mission') &&
            !categoryLower.includes('vision') &&
            !fileNameLower.includes('mission') &&
            !fileNameLower.includes('vision') &&
            !fileUrlLower.includes('mission') &&
            !fileUrlLower.includes('vision')
          );
        });
        if (holyCrossFamilyDoc) {
          setHolyCrossFamilyDoc(holyCrossFamilyDoc);
          console.log('✅ Found Holy Cross Family document:', {
            id: holyCrossFamilyDoc.id,
            title: holyCrossFamilyDoc.title,
            category: holyCrossFamilyDoc.category,
            fileUrl: holyCrossFamilyDoc.fileUrl
          });
        } else {
          setHolyCrossFamilyDoc(null);
        }

        // Log summary
        console.log('📋 Document Matching Summary:', {
          vision: visionDoc ? { id: visionDoc.id, title: visionDoc.title, category: visionDoc.category } : 'NOT FOUND',
          mission: missionDoc ? { id: missionDoc.id, title: missionDoc.title, category: missionDoc.category } : 'NOT FOUND',
          holyCrossFamily: holyCrossFamilyDoc ? { id: holyCrossFamilyDoc.id, title: holyCrossFamilyDoc.title, category: holyCrossFamilyDoc.category } : 'NOT FOUND'
        });

        if (!missionDoc && !visionDoc && !holyCrossFamilyDoc) {
          console.warn('⚠️ No statement documents found. Make sure documents are uploaded with categories: mission, vision, or holy-cross-family');
        }
      } catch (error) {
        console.error('Error fetching statement documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatements();
  }, []);

  // Get image URLs - CRITICAL: Ensure vision and mission are never mixed
  // For mission: leave empty if not found (as per user request)
  // For vision: use document if found, otherwise show message
  // For holy cross family: use fallback if document not found
  
  // CRITICAL CHECK: Ensure visionDoc is never used for mission
  const missionImageUrl: string | null = missionDoc && missionDoc.id !== visionDoc?.id 
    ? getDocumentImageUrl(missionDoc, missionFallback) 
    : null;
  
  // CRITICAL CHECK: Ensure visionDoc is used for vision
  const visionImageUrl: string = visionDoc 
    ? getDocumentImageUrl(visionDoc, visionFallback) 
    : visionFallback;
  
  const holyCrossFamilyImageUrl: string = getDocumentImageUrl(holyCrossFamilyDoc, holyCrossFamilyFallback);
  
  // Debug logging with explicit verification
  console.log('🔍 DOCUMENT ASSIGNMENT VERIFICATION:', {
    visionDoc: visionDoc ? { id: visionDoc.id, title: visionDoc.title, category: visionDoc.category } : 'NULL',
    missionDoc: missionDoc ? { id: missionDoc.id, title: missionDoc.title, category: missionDoc.category } : 'NULL',
    areSame: visionDoc && missionDoc ? visionDoc.id === missionDoc.id : false,
    missionImageUrl: missionImageUrl,
    visionImageUrl: visionImageUrl
  });

  return (
    <>
      <SEO 
        title="School Info - Holy Cross Convent School Brooklyn" 
        description="Learn about Holy Cross Convent School Brooklyn, our mission, vision, and community values." 
      />
    
    {/* Return to Home - positioned outside banner to avoid clash */}
    <Box sx={{ 
      position: 'fixed', 
      top: { xs: 80, sm: 100 }, 
      left: 16, 
      zIndex: 1000,
      '& .MuiTypography-root': {
        color: 'white !important',
        textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.5)',
        backgroundColor: 'rgba(26, 35, 126, 0.7)',
        padding: '8px 16px',
        borderRadius: '8px',
        display: 'inline-block',
        backdropFilter: 'blur(4px)',
        '&:hover': {
          transform: 'translateX(-2px)',
          backgroundColor: 'rgba(26, 35, 126, 0.9)',
        },
        transition: 'all 0.3s ease'
      }
    }}>
      <ReturnToHome />
    </Box>

    {/* Banner Section */}
    <Banner>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontWeight: 900,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            mb: 2,
            color: '#ffd700',
            textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9), 0 0 60px rgba(26,35,126,0.6)',
            letterSpacing: '0.5px'
          }}
        >
          Holy Cross Convent School
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#ffffff',
            fontWeight: 600,
            textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8)',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          Brooklyn, Cape Town
        </Typography>
      </Container>
    </Banner>

    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Mission Statement - as Image */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          borderRadius: 3,
          border: '2px solid #1a237e',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
            borderRadius: '12px 12px 0 0',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FlagIcon 
            sx={{ 
              fontSize: '2.5rem', 
              color: '#1a237e', 
              mr: 2 
            }} 
          />
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700 
            }}
          >
            Our Mission
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : missionImageUrl ? (
            <Box
              component="img"
              src={missionImageUrl}
              alt="Mission Statement"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                if (target.src === missionFallback) return; // Prevent infinite loop
                target.src = missionFallback;
              }}
              sx={{
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(26, 35, 126, 0.15)',
                maxWidth: '600px',
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                mx: 'auto'
              }}
            />
          ) : (
            <Typography variant="body1" sx={{ color: 'text.secondary', py: 4, fontStyle: 'italic' }}>
              Mission statement coming soon...
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Vision Statement - as Image */}
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          borderRadius: 3,
        border: '2px solid #d32f2f',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
          borderRadius: '12px 12px 0 0',
        }
      }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <VisibilityIcon 
            sx={{ 
              fontSize: '2.5rem', 
              color: '#d32f2f', 
              mr: 2 
            }} 
          />
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700 
            }}
          >
            Our Vision
      </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : visionDoc ? (
            <Box
              component="img"
              src={visionImageUrl}
              alt="Vision Statement"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                const currentSrc = target.src;
                // Prevent infinite loop - if already using fallback, stop
                if (currentSrc.includes('HCCMS.jpeg') || currentSrc.includes('HCCMS') || currentSrc.endsWith(visionFallback)) {
                  console.error('⚠️ Both document and fallback image failed to load:', currentSrc);
                  // Hide the image element if fallback also fails
                  target.style.display = 'none';
                  return;
                }
                console.log('🔄 Vision document image failed, trying fallback:', visionFallback, 'Current src:', currentSrc);
                target.src = visionFallback;
              }}
              onLoad={() => {
                console.log('✅ Vision statement image loaded successfully from:', visionImageUrl);
              }}
              sx={{
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(26, 35, 126, 0.15)',
                maxWidth: '600px',
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                mx: 'auto'
              }}
            />
          ) : (
            <Typography variant="body1" sx={{ color: 'text.secondary', py: 4, fontStyle: 'italic' }}>
              Vision statement will be displayed here once uploaded. Please ensure the document is uploaded with category "vision" or "vision-statement" in the Admin Document Upload section.
            </Typography>
          )}
        </Box>
    </Paper>

      {/* The Holy Cross Family Brooklyn Statement - as Image */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
          borderRadius: 3,
          border: '2px solid #d32f2f',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
            borderRadius: '12px 12px 0 0',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FamilyRestroomIcon 
            sx={{ 
              fontSize: '2.5rem', 
              color: '#d32f2f', 
              mr: 2 
            }} 
          />
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700 
            }}
          >
            The Holy Cross Family, Brooklyn
      </Typography>
    </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              component="img"
              src={holyCrossFamilyImageUrl}
              alt="The Holy Cross Family, Brooklyn Statement"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                if (target.src === holyCrossFamilyFallback) return; // Prevent infinite loop
                target.src = holyCrossFamilyFallback;
              }}
              sx={{
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(26, 35, 126, 0.15)',
                maxWidth: '600px',
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                mx: 'auto'
              }}
            />
          )}
        </Box>
      </Paper>

    {/* Quick Facts */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#1a237e', 
            fontWeight: 700,
            mb: 3,
            textAlign: 'center'
          }}
        >
          School Information
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2 
        }}>
      {quickFacts.map((fact) => (
        <Box
          key={fact.label}
          sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 12px)' } }}
        >
              <Card sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2,
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(26, 35, 126, 0.15)'
                }
              }}>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  {fact.icon}
                </Box>
            <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                {fact.label}
              </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {fact.value}
                  </Typography>
            </Box>
          </Card>
        </Box>
      ))}
        </Box>
    </Box>

      {/* Quick Gallery */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700
            }}
          >
            School Gallery
          </Typography>
          <Button 
            variant="contained"
            onClick={() => window.location.href = '/gallery'}
            sx={{
              backgroundColor: '#1a237e',
              color: '#fff',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#283593',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(26, 35, 126, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            View Full Gallery →
          </Button>
        </Box>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2
        }}>
          {galleryImages.map((img, idx) => (
            <Card 
              key={img}
              sx={{ 
                overflow: 'hidden',
                borderRadius: 2,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(26, 35, 126, 0.25)'
                }
              }}
            >
              <Box
                component="img"
                src={`/${img}`}
                alt={`School photo ${idx + 1}`}
                sx={{
                  width: '100%',
                  height: { xs: 200, sm: 180, md: 160 },
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Card>
        ))}
      </Box>
    </Box>

      {/* Logo Symbolism */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Paper 
          elevation={2}
          sx={{ 
            p: 4,
            background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
            borderRadius: 3,
            border: '1px solid rgba(26, 35, 126, 0.1)'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 600, 
              mb: 2 
            }}
          >
            Discover Our Heritage
      </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Learn about the rich symbolism and meaning behind our school logo, representing our values and Catholic heritage.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => window.location.href = '/logo-symbolism'}
            sx={{
              backgroundColor: '#1a237e',
              color: '#fff',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#283593',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(26, 35, 126, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
      >
        View Logo Symbolism
      </Button>
        </Paper>
    </Box>
  </Container>
  </>
);
};

export default Info;
