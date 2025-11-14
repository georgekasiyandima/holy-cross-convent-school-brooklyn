import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    // In production, you could log to an error reporting service here
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Box
            sx={{
              textAlign: 'center',
              p: 4,
              borderRadius: 2,
              backgroundColor: '#fff',
              boxShadow: 3,
            }}
          >
            <ErrorOutline sx={{ fontSize: 64, color: '#d32f2f', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
              Something went wrong
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  textAlign: 'left',
                }}
              >
                <Typography variant="caption" sx={{ color: '#d32f2f', fontFamily: 'monospace' }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={this.handleReset}
              sx={{
                backgroundColor: '#1a237e',
                '&:hover': { backgroundColor: '#0d1458' },
              }}
            >
              Try Again
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


