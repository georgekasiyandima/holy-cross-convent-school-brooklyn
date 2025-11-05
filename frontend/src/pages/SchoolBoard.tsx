import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Grid,
  Paper
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Church as ChurchIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { boardService, BoardMember } from '../services/boardService';
import SEO from '../components/SEO';
import ReturnToHome from '../components/ReturnToHome';
import PageBanner from '../components/PageBanner';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '500px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: 'url("/schoolb.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
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

const MemberCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease',
  border: '1px solid #e0e0e0',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    borderColor: '#1a237e'
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  paddingBottom: theme.spacing(2),
  borderBottom: `3px solid #ffd700`
}));

const SchoolBoard: React.FC = () => {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBoardMembers();
  }, []);

  const fetchBoardMembers = async () => {
    try {
      setLoading(true);
      const data = await boardService.getAllBoardMembers();
      
      // Update with real names if they exist, otherwise keep placeholders
      const updatedData = data.map((member) => {
        // Update Sister Flora - Representative of Owners
        if (member.type === 'REPRESENTATIVE' && member.name.toLowerCase().includes('sister') || member.role?.toLowerCase().includes('representative')) {
          return {
            ...member,
            name: 'Sister Flora',
            role: 'Representative of Owners',
            type: 'REPRESENTATIVE' as const
          };
        }
        // Update Ms Du Plessis - Head of Board
        if (member.type === 'EXECUTIVE' && (member.name.toLowerCase().includes('principal') || member.role?.toLowerCase().includes('principal') || member.role?.toLowerCase().includes('head'))) {
          return {
            ...member,
            name: 'Ms Du Plessis',
            role: 'Head of Board / Principal',
            type: 'EXECUTIVE' as const
          };
        }
        return member;
      });
      
      setBoardMembers(updatedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching board members:', err);
      setError('Failed to load board members. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EXECUTIVE':
        return <AccountBalanceIcon sx={{ color: '#1a237e', fontSize: 32 }} />;
      case 'REPRESENTATIVE':
        return <ChurchIcon sx={{ color: '#d32f2f', fontSize: 32 }} />;
      case 'MEMBER':
        return <PeopleIcon sx={{ color: '#1a237e', fontSize: 32 }} />;
      default:
        return <PeopleIcon sx={{ color: '#1a237e', fontSize: 32 }} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'EXECUTIVE':
        return 'Executive';
      case 'REPRESENTATIVE':
        return 'Representative';
      case 'MEMBER':
        return 'Board Member';
      default:
        return 'Board Member';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EXECUTIVE':
        return '#1a237e';
      case 'REPRESENTATIVE':
        return '#d32f2f';
      case 'MEMBER':
        return '#1a237e';
      default:
        return '#1a237e';
    }
  };

  const groupedMembers = {
    executive: boardMembers.filter(m => m.type === 'EXECUTIVE'),
    // Only show one representative member (Sister Flora)
    representative: boardMembers.filter(m => m.type === 'REPRESENTATIVE').slice(0, 1),
    members: boardMembers.filter(m => m.type === 'MEMBER')
  };

  if (loading) {
    return (
      <>
        <HeroSection>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={60} sx={{ color: '#ffd700', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                Loading School Board...
              </Typography>
            </Box>
          </Container>
        </HeroSection>
      </>
    );
  }

  return (
    <>
      <SEO
        title="School Board - Holy Cross Convent School Brooklyn"
        description="Meet the dedicated members of the Holy Cross Convent School Brooklyn School Board who guide our institution with wisdom and commitment."
      />

      {/* Hero Section */}
      <HeroSection>
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
            School Board
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: '#ffffff',
              fontWeight: 600,
              textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8)',
              fontSize: { xs: '1.5rem', md: '2rem' },
              maxWidth: '900px',
              mx: 'auto'
            }}
          >
            Meet the dedicated individuals who provide leadership and governance to our school
          </Typography>
        </Container>
      </HeroSection>

      {/* Return to Home - positioned outside hero to avoid clash */}
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

      <Container maxWidth="lg" sx={{ py: 6, mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Executive Members (Head of Board) */}
        {groupedMembers.executive.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <SectionHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AccountBalanceIcon sx={{ fontSize: 40, color: '#1a237e' }} />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: '#1a237e',
                    fontSize: { xs: '1.75rem', md: '2.5rem' }
                  }}
                >
                  Executive Leadership
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
                The executive leadership team provides strategic direction and oversight for the school
              </Typography>
            </SectionHeader>
            
            <Grid container spacing={4}>
              {groupedMembers.executive.map((member) => (
                <Grid item xs={12} md={6} key={member.id}>
                  <MemberCard elevation={3}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          bgcolor: `${getTypeColor(member.type)}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getTypeIcon(member.type)}
                        </Box>
                        <Box sx={{ ml: 3, flex: 1 }}>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
                            {member.name}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2 }}>
                            {member.role}
                          </Typography>
                          <Chip
                            label={getTypeLabel(member.type)}
                            size="small"
                            sx={{
                              bgcolor: getTypeColor(member.type),
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                      </Box>
                      {member.bio && (
                        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7, color: '#555' }}>
                          {member.bio}
                        </Typography>
                      )}
                      {(member.email || member.phone) && (
                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                          {member.email && (
                            <Typography variant="body2" color="text.secondary">
                              <strong>Email:</strong> {member.email}
                            </Typography>
                          )}
                          {member.phone && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              <strong>Phone:</strong> {member.phone}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </MemberCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Representatives (Sister Flora) */}
        {groupedMembers.representative.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <SectionHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <ChurchIcon sx={{ fontSize: 40, color: '#d32f2f' }} />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: '#1a237e',
                    fontSize: { xs: '1.75rem', md: '2.5rem' }
                  }}
                >
                  Representative of Owners
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
                The Holy Cross Sisters representative who ensures our mission and values are upheld
              </Typography>
            </SectionHeader>
            
            <Grid container spacing={4}>
              {groupedMembers.representative.map((member) => (
                <Grid item xs={12} md={8} key={member.id} sx={{ mx: 'auto' }}>
                  <MemberCard elevation={3}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          bgcolor: '#d32f2f15',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getTypeIcon(member.type)}
                        </Box>
                        <Box sx={{ ml: 3, flex: 1 }}>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
                            {member.name}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2 }}>
                            {member.role}
                          </Typography>
                          <Chip
                            label={getTypeLabel(member.type)}
                            size="small"
                            sx={{
                              bgcolor: '#d32f2f',
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                      </Box>
                      {member.bio && (
                        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7, color: '#555' }}>
                          {member.bio}
                        </Typography>
                      )}
                      {(member.email || member.phone) && (
                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                          {member.email && (
                            <Typography variant="body2" color="text.secondary">
                              <strong>Email:</strong> {member.email}
                            </Typography>
                          )}
                          {member.phone && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              <strong>Phone:</strong> {member.phone}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </MemberCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Board Members */}
        {groupedMembers.members.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <SectionHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 40, color: '#1a237e' }} />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: '#1a237e',
                    fontSize: { xs: '1.75rem', md: '2.5rem' }
                  }}
                >
                  Board Members
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
                Dedicated individuals who contribute their expertise and commitment to our school community
              </Typography>
            </SectionHeader>
            
            <Grid container spacing={3}>
              {groupedMembers.members.map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member.id}>
                  <MemberCard elevation={2}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ 
                          p: 1.5, 
                          borderRadius: 2, 
                          bgcolor: '#1a237e15',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getTypeIcon(member.type)}
                        </Box>
                        <Box sx={{ ml: 2, flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e', mb: 0.5 }}>
                            {member.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                            {member.role}
                          </Typography>
                        </Box>
                      </Box>
                      {member.bio && (
                        <Typography variant="body2" sx={{ mt: 1.5, lineHeight: 1.6, color: '#555' }}>
                          {member.bio}
                        </Typography>
                      )}
                    </CardContent>
                  </MemberCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Info Box */}
        <Paper
          elevation={2}
          sx={{
            mt: 8,
            p: 4,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
            borderRadius: 3,
            borderLeft: '4px solid #ffd700',
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
            <SchoolIcon sx={{ fontSize: 40, color: '#1a237e', mr: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e' }}>
              About Our School Board
            </Typography>
          </Box>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: '#555' }}>
            The School Board of Holy Cross Convent School Brooklyn is committed to ensuring the highest standards of education while maintaining the Catholic values and traditions that define our institution.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
            Our board members bring diverse expertise and unwavering dedication to guide the school's strategic direction, oversee its operations, and support the administration in fulfilling our mission to educate and nurture the whole child.
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default SchoolBoard;
