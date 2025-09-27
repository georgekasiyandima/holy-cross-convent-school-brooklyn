import React from 'react';
import { Container, Typography, Box, Card, Divider, Link as MuiLink } from '@mui/material';
import { Language, Church, LocalHospital, Public, Radio, AccountBalance } from '@mui/icons-material';
import ReturnToHome from '../components/ReturnToHome';

const externalLinks = [
  {
    name: 'Holy Cross Switzerland',
    url: 'https://www.holycross.ch/',
    icon: <Language sx={{ color: '#1a237e', fontSize: 40 }} />,
    description: 'International Holy Cross Sisters congregation.'
  },
  {
    name: 'Our Lady of the Assumption Parish / Milnerton',
    url: 'https://www.milnertoncatholicparish.org.za/',
    icon: <Church sx={{ color: '#ffd700', fontSize: 40 }} />,
    description: 'Our local parish community.'
  },
  {
    name: 'H.O.P.E Project Tygerberg Hospital',
    url: 'https://www.tygerberghospital.org.za/hope/',
    icon: <LocalHospital sx={{ color: '#1a237e', fontSize: 40 }} />,
    description: 'H.O.P.E Project at Tygerberg Hospital.'
  },
  {
    name: 'The Vatican',
    url: 'https://www.vatican.va/',
    icon: <Public sx={{ color: '#ffd700', fontSize: 40 }} />,
    description: 'Official website of the Holy See.'
  },
  {
    name: 'Radio Veritas South Africa',
    url: 'https://www.radioveritas.co.za/',
    icon: <Radio sx={{ color: '#1a237e', fontSize: 40 }} />,
    description: 'Catholic radio station for South Africa.'
  },
  {
    name: 'Archdiocese of Cape Town',
    url: 'https://adct.org.za/',
    icon: <AccountBalance sx={{ color: '#ffd700', fontSize: 40 }} />,
    description: 'Catholic Archdiocese of Cape Town.'
  },
];

const Links: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Return to Home */}
      <ReturnToHome />
      
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          Catholic & Community Links
        </Typography>
        <Divider sx={{ bgcolor: '#ffd700', height: 4, width: 80, mx: 'auto', mb: 3 }} />
        <Typography variant="h6" sx={{ color: '#555', maxWidth: 700, mx: 'auto', mb: 2 }}>
          Explore our wider Catholic and community network. These links connect you to our parish, the international Holy Cross community, and other Catholic resources.
        </Typography>
      </Box>

      {/* Links Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 4,
          mb: 6,
        }}
      >
        {externalLinks.map((link) => (
          <Card key={link.name} sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: 4,
            px: 2,
            borderLeft: `6px solid ${link.icon.props.sx.color}`,
            boxShadow: 2,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #fffde7 100%)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.03)',
              boxShadow: 6,
            },
          }}>
            <Box sx={{ mb: 2 }}>{link.icon}</Box>
            <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
              {link.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#555', mb: 2 }}>
              {link.description}
            </Typography>
            <MuiLink
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={{
                mt: 1,
                fontWeight: 700,
                color: '#ffd700',
                fontSize: '1.1rem',
                '&:hover': { color: '#1a237e', textDecoration: 'underline' },
              }}
            >
              Visit Site
            </MuiLink>
          </Card>
        ))}
      </Box>

      <Divider sx={{ my: 4 }} />
      <Box sx={{ textAlign: 'center', color: '#aaa', mt: 4 }}>
        <Typography variant="body2">
          <em>More links and resources will be added as our network grows.</em>
        </Typography>
      </Box>
    </Container>
  );
};

export default Links; 