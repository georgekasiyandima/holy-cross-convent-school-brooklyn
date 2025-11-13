import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import governingBodyService, { GoverningBodyMember } from '../services/governingBodyService';
import SEO from '../components/SEO';
import ReturnToHome from '../components/ReturnToHome';

// Image path - using constant for better production handling
const heroImage = '/schoolb.jpg';

const HeroSection = styled(Box)(() => ({
  position: 'relative',
  minHeight: '70vh',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url("${heroImage}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  textAlign: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,35,126,0.8), rgba(211,47,47,0.6))',
    zIndex: 0,
  },
  '& > *': { position: 'relative', zIndex: 1 },
}));

const MemberCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  border: '1px solid #e0e0e0',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 32px rgba(26, 35, 126, 0.12)',
    borderColor: '#1a237e',
  },
  '&:focus-visible': {
    outline: '3px solid #ffd700',
    outlineOffset: '4px',
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 32px rgba(26, 35, 126, 0.12)',
    borderColor: '#1a237e',
  },
}));

const SectionHeader = styled(Box)(() => ({
  marginBottom: 32,
  paddingBottom: 16,
  borderBottom: `2px solid #ffd700`,
}));

const SchoolBoard: React.FC = () => {
  const [members, setMembers] = useState<GoverningBodyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoized sorting function
  const sortMembers = useMemo(() => {
    return (data: GoverningBodyMember[]) => {
      return [...data].sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.name.localeCompare(b.name);
      });
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchMembers = async () => {
      try {
        setLoading(true);
        // Note: governingBodyService.getMembers may not support signal, but we track it for cleanup
        const data = await governingBodyService.getMembers();
        
        if (isMounted && !controller.signal.aborted) {
          const sortedData = sortMembers(data);
          setMembers(sortedData);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted && !controller.signal.aborted) {
          console.error('Error fetching governing body members:', err);
          setError('Failed to load governing body members. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMembers();

    return () => {
      isMounted = false;
      controller.abort();
      abortControllerRef.current = null;
    };
  }, [sortMembers]);


  return (
    <>
      <SEO
        title="Governing Body - Holy Cross Convent School Brooklyn"
        description="Meet the dedicated members of the Governing Body who provide governance, accountability, and strategic guidance for our school."
        image="/schoolb.jpg"
        type="website"
      />

      {/* Return to Home - moved outside hero to avoid blocking content */}
      <Box
        sx={{
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
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateX(-2px)',
              backgroundColor: 'rgba(26, 35, 126, 0.9)',
            },
          },
        }}
      >
        <ReturnToHome />
      </Box>

      <HeroSection>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4 } }}>
          {loading ? (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress 
                size={60} 
                aria-label="Loading governing body members"
                sx={{ color: '#ffd700', mb: 2 }} 
              />
              <Typography variant="h6" sx={{ color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                Loading Governing Body...
              </Typography>
            </Box>
          ) : (
            <>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  mb: 2,
                  color: '#ffd700',
                  textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9), 0 0 60px rgba(26,35,126,0.6)',
                }}
              >
                Governing Body
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: '#ffffff',
                  fontWeight: 600,
                  textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8)',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  maxWidth: '900px',
                  mx: 'auto',
                }}
              >
                Meet the dedicated individuals who provide oversight, direction, and support to our school community.
              </Typography>
            </>
          )}
        </Container>
      </HeroSection>

      <Container maxWidth="xl" sx={{ py: 6, mt: 4, position: 'relative' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {!loading && (
          <>
            <Box sx={{ mb: 8 }}>
              <SectionHeader>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <PeopleIcon sx={{ fontSize: 40, color: '#1a237e' }} />
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: '#1a237e',
                      fontSize: { xs: '1.75rem', md: '2.5rem' },
                    }}
                  >
                    Governing Body Members
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
                  Our Governing Body provides accountable leadership, supports the principal and staff, and ensures the school remains faithful to its mission.
                </Typography>
              </SectionHeader>

              <Grid container spacing={3}>
                {members.map((member) => (
                  <Grid item xs={12} sm={6} md={4} key={member.id}>
                    <MemberCard elevation={3}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
                          {member.name}
                        </Typography>
                        {member.designation && (
                          <Typography variant="subtitle1" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                            {member.designation}
                          </Typography>
                        )}
                        {member.sector && (
                          <Chip
                            label={member.sector}
                            aria-label={`Sector: ${member.sector}`}
                            size="small"
                            sx={{
                              bgcolor: '#1a237e15',
                              color: '#1a237e',
                              fontWeight: 600,
                              mt: 1,
                            }}
                          />
                        )}

                        <Box sx={{ mt: 3, display: 'grid', gap: 1.5 }}>
                          {member.address && (
                            <Typography variant="body2" color="text.secondary">
                              <strong>Address:</strong> {member.address}
                            </Typography>
                          )}
                          <Box>
                            {member.phone && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Tel:</strong> {member.phone}
                              </Typography>
                            )}
                            {member.email && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: member.phone ? 0.5 : 0 }}>
                                <strong>Email:</strong> {member.email}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </MemberCard>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
                  Our Commitment
                </Typography>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>
                  The Governing Body remains committed to transparency, responsible stewardship, and fostering a vibrant school community where every learner can flourish academically, spiritually, and personally.
                </Typography>
              </Box>
            </Paper>
          </>
        )}
      </Container>
    </>
  );
};

export default SchoolBoard;



