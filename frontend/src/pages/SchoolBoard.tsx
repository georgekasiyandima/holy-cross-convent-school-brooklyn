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
  Chip
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Church as ChurchIcon
} from '@mui/icons-material';
import { boardService, BoardMember } from '../services/boardService';
import SEO from '../components/SEO';

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
      setBoardMembers(data);
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
        return <SchoolIcon sx={{ color: '#1a237e', fontSize: 40 }} />;
      case 'REPRESENTATIVE':
        return <ChurchIcon sx={{ color: '#1a237e', fontSize: 40 }} />;
      case 'MEMBER':
        return <PeopleIcon sx={{ color: '#1a237e', fontSize: 40 }} />;
      default:
        return <PeopleIcon sx={{ color: '#1a237e', fontSize: 40 }} />;
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

  const groupedMembers = {
    executive: boardMembers.filter(m => m.type === 'EXECUTIVE'),
    representative: boardMembers.filter(m => m.type === 'REPRESENTATIVE'),
    members: boardMembers.filter(m => m.type === 'MEMBER')
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ color: '#1a237e' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading School Board...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title="School Board"
        description="Meet the dedicated members of the Holy Cross Convent School Brooklyn School Board who guide our institution with wisdom and commitment."
        type="website"
      />

      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              School Board
            </Typography>
            <Typography
              variant="h5"
              sx={{
                maxWidth: '800px',
                mx: 'auto',
                opacity: 0.95,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Meet the dedicated individuals who provide leadership and governance to Holy Cross Convent School Brooklyn
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Executive Members */}
        {groupedMembers.executive.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: '#1a237e',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <SchoolIcon /> Executive Leadership
            </Typography>
            <Divider sx={{ mb: 4, borderColor: '#ffc107', borderWidth: 2 }} />
            
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'center'
              }}
            >
              {groupedMembers.executive.map((member) => (
                <Card
                  key={member.id}
                  elevation={3}
                  sx={{
                    flex: '1 1 400px',
                    maxWidth: { xs: '100%', md: 'calc(50% - 12px)' },
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getTypeIcon(member.type)}
                      <Box sx={{ ml: 2, flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                          {member.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {member.role}
                        </Typography>
                      </Box>
                      <Chip
                        label={getTypeLabel(member.type)}
                        sx={{
                          bgcolor: '#1a237e',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    {member.bio && (
                      <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
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
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Representatives */}
        {groupedMembers.representative.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: '#1a237e',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <ChurchIcon /> Holy Cross Sisters Representative
            </Typography>
            <Divider sx={{ mb: 4, borderColor: '#ffc107', borderWidth: 2 }} />
            
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'center'
              }}
            >
              {groupedMembers.representative.map((member) => (
                <Card
                  key={member.id}
                  elevation={3}
                  sx={{
                    flex: '1 1 400px',
                    maxWidth: { xs: '100%', md: 'calc(50% - 12px)' },
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getTypeIcon(member.type)}
                      <Box sx={{ ml: 2, flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                          {member.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {member.role}
                        </Typography>
                      </Box>
                      <Chip
                        label={getTypeLabel(member.type)}
                        sx={{
                          bgcolor: '#1a237e',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    {member.bio && (
                      <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
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
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Board Members */}
        {groupedMembers.members.length > 0 && (
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: '#1a237e',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <PeopleIcon /> Board Members
            </Typography>
            <Divider sx={{ mb: 4, borderColor: '#ffc107', borderWidth: 2 }} />
            
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3
              }}
            >
              {groupedMembers.members.map((member) => (
                <Card
                  key={member.id}
                  elevation={2}
                  sx={{
                    flex: '1 1 300px',
                    minWidth: '300px',
                    maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getTypeIcon(member.type)}
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                          {member.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.role}
                        </Typography>
                      </Box>
                    </Box>
                    {member.bio && (
                      <Typography variant="body2" sx={{ mt: 1.5, lineHeight: 1.6 }}>
                        {member.bio}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Info Box */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            bgcolor: '#f5f5f5',
            borderRadius: 2,
            borderLeft: '4px solid #ffc107'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
            About Our School Board
          </Typography>
          <Typography variant="body1" paragraph>
            The School Board of Holy Cross Convent School Brooklyn is committed to ensuring the highest standards of education while maintaining the Catholic values and traditions that define our institution.
          </Typography>
          <Typography variant="body1">
            Our board members bring diverse expertise and unwavering dedication to guide the school's strategic direction, oversee its operations, and support the administration in fulfilling our mission to educate and nurture the whole child.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default SchoolBoard;