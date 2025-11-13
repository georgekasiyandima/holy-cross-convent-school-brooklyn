import React, { memo } from 'react';
import { Box, Typography, Button, useTheme, alpha } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import type { SxProps, Theme } from '@mui/material/styles';

interface ReturnToHomeProps {
  variant?: 'text' | 'button';
  showIcon?: boolean;
  to?: string;
  sx?: SxProps<Theme>;
  'data-testid'?: string;
}

const ReturnToHome: React.FC<ReturnToHomeProps> = ({ 
  variant = 'text', 
  showIcon = false,
  to = '/',
  sx = {},
  'data-testid': testId = 'return-to-home'
}) => {
  const theme = useTheme();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Link component handles navigation, but we need to trigger it programmatically for keyboard
      const link = e.currentTarget as HTMLElement;
      link.click();
    }
  };

  const commonSx: SxProps<Theme> = {
    mb: 3,
    ...sx
  };

  if (variant === 'button') {
    return (
      <Box sx={commonSx}>
        <Button
          component={Link}
          to={to}
          startIcon={showIcon ? <HomeIcon sx={{ fontSize: '1.2em' }} /> : undefined}
          aria-label="Return to homepage"
          data-testid={testId}
          sx={{
            color: 'primary.main',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: '8px',
            padding: { xs: '10px 18px', sm: '12px 20px' },
            border: '2px solid',
            borderColor: alpha(theme.palette.primary.main, 0.3),
            transition: 'all 0.3s ease',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.15),
              marginLeft: '-2px',
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
            },
            '&:active': {
              marginLeft: '0px',
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '2px',
            }
          }}
        >
          Return to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={commonSx}>
      <Typography
        component={Link}
        to={to}
        variant="body1"
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Return to homepage"
        data-testid={testId}
        sx={{
          color: 'primary.main',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: { xs: '1rem', sm: '1.05rem' },
          textDecoration: 'underline',
          textDecorationColor: alpha(theme.palette.primary.main, 0.4),
          transition: 'all 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          '&:hover': {
            color: 'primary.dark',
            textDecorationColor: 'primary.main',
            marginLeft: '-2px',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
            borderRadius: '2px',
          }
        }}
      >
        {showIcon && <HomeIcon sx={{ fontSize: '1.2em', verticalAlign: 'middle' }} />}
        Return to Home
      </Typography>
    </Box>
  );
};

export default memo(ReturnToHome);
