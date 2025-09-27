import React from 'react';
import { Container, Typography, Box, Card, CardContent, Divider, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import ReturnToHome from '../components/ReturnToHome';

const boardRoles = [
  {
    title: 'Chairperson',
    name: 'Mr. E Jaravaza',
  },
  {
    title: 'Treasurer',
    name: 'Mr JC Merven',
  },
  {
    title: 'Principal',
    name: 'Mrs C Du Plessis',
  },
  {
    title: 
      "Owner's Representative",
    name: 'Sr. Flora Mativire',
  },
];

const boardMembers = [
  'Sr. Eileen Kenny',
  'Mrs N Will',
  'Mr G Levine',
  'Mr C Adonis',
  'Mrs R Green',
  'Mrs N Sacks',
];

const RoleCard = styled(Card)(({ theme }) => ({
  minWidth: 220,
  background: '#f5f7fa',
  borderLeft: `6px solid #1a237e`,
  boxShadow: theme.shadows[2],
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.03)',
    boxShadow: theme.shadows[6],
  },
}));

const MemberCard = styled(Card)(({ theme }) => ({
  minWidth: 180,
  background: '#fffde7',
  borderLeft: `4px solid #ffd700`,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: theme.shadows[4],
  },
}));

const SchoolBoard: React.FC = () => {
  const theme = useTheme();
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Return to Home */}
      <ReturnToHome />
      
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          School Board
        </Typography>
        <Divider sx={{ bgcolor: '#ffd700', height: 4, width: 80, mx: 'auto', mb: 2 }} />
        <Typography variant="subtitle1" sx={{ color: '#555', maxWidth: 600, mx: 'auto' }}>
          The School Board provides strategic direction and oversight for Holy Cross Convent School Brooklyn. Meet our dedicated board members:
        </Typography>
      </Box>
      {/* Key Roles */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 6,
          justifyContent: 'center'
        }}
      >
        {boardRoles.map((role) => (
          <RoleCard key={role.title}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
                {role.title}
              </Typography>
              <Typography variant="body1" sx={{ color: '#333', fontWeight: 500 }}>
                {role.name}
              </Typography>
              {/* Future: Add image, bio, or contact here */}
            </CardContent>
          </RoleCard>
        ))}
      </Box>
      {/* Members */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ color: '#ffd700', fontWeight: 700, mb: 2 }}>
          Members
        </Typography>
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2
          }}
        >
          {boardMembers.map((member) => (
            <MemberCard key={member}>
              <CardContent>
                <Typography variant="body1" sx={{ color: '#1a237e', fontWeight: 600 }}>
                  {member}
                </Typography>
                {/* Future: Add image, bio, or contact here */}
              </CardContent>
            </MemberCard>
          ))}
        </Box>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box sx={{ textAlign: 'center', color: '#aaa', mt: 4 }}>
        <Typography variant="body2">
          <em>More information, photos, and biographies will be added as the board evolves.</em>
        </Typography>
      </Box>
    </Container>
  );
};

export default SchoolBoard; 