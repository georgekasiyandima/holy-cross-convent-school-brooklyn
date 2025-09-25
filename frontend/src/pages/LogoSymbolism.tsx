import React from 'react';
import { Container } from '@mui/material';
import LogoSymbolism from '../components/LogoSymbolism';

const LogoSymbolismPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <LogoSymbolism />
    </Container>
  );
};

export default LogoSymbolismPage;

