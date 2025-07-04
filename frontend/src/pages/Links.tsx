import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Divider, List, ListItem, ListItemIcon, ListItemText, useTheme, Paper, Stack } from '@mui/material';
import { PictureAsPdf, Download, HelpOutline, Email, Phone } from '@mui/icons-material';

const resources = [
  {
    title: 'Indemnity Form',
    file: '', // Add file path when available
    description: 'Required for all students. Download, sign, and return to the school office.',
  },
  {
    title: 'School Fees 2023',
    file: '',
    description: 'Current fee structure for the academic year.',
  },
  {
    title: 'Code of Conduct',
    file: '',
    description: 'Guidelines and expectations for student behavior.',
  },
  {
    title: 'School Uniform',
    file: '',
    description: 'Uniform requirements and guidelines.',
  },
  {
    title: 'General School Policy',
    file: '',
    description: 'Comprehensive school policies and procedures.',
  },
  {
    title: 'Admissions Policy',
    file: '',
    description: 'Criteria and process for student admissions.',
  },
  {
    title: 'School Transport',
    file: '',
    description: 'Information about school transport options.',
  },
];

const Links: React.FC = () => {
  const theme = useTheme();
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          Documents, Forms & School Fees
        </Typography>
        <Divider sx={{ bgcolor: '#ffd700', height: 4, width: 80, mx: 'auto', mb: 3 }} />
        <Typography variant="h6" sx={{ color: '#555', maxWidth: 700, mx: 'auto', mb: 2 }}>
          Download important school documents and forms. All files are in PDF format. If you need help, please contact the school office.
        </Typography>
      </Box>

      {/* Resource List */}
      <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, mb: 6, background: 'linear-gradient(135deg, #f5f7fa 0%, #fffde7 100%)' }}>
        <List>
          {resources.map((res, idx) => (
            <ListItem key={res.title} sx={{ mb: 2, borderRadius: 2, boxShadow: 1, background: 'white', flexWrap: 'wrap' }}>
              <ListItemIcon>
                <PictureAsPdf sx={{ color: '#e53935', fontSize: 36 }} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>{res.title}</Typography>}
                secondary={<Typography variant="body2" sx={{ color: '#555' }}>{res.description}</Typography>}
              />
              {res.file ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Download />}
                  href={res.file}
                  target="_blank"
                  sx={{
                    backgroundColor: '#ffd700',
                    color: '#1a237e',
                    fontWeight: 700,
                    ml: 2,
                    '&:hover': { backgroundColor: '#ffed4e' },
                  }}
                >
                  Download
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Download />}
                  disabled
                  sx={{
                    backgroundColor: '#ccc',
                    color: '#666',
                    fontWeight: 700,
                    ml: 2,
                    '&:hover': { backgroundColor: '#ccc' },
                  }}
                >
                  Download
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Contact/Help Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Stack direction="column" spacing={2} alignItems="center">
          <HelpOutline sx={{ color: '#ffd700', fontSize: 40 }} />
          <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Need Assistance?
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', maxWidth: 600 }}>
            If you have any queries, please phone the school at <b>(021) 511 4337</b> and ask for assistance or a meeting with the school's management team.
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', maxWidth: 600 }}>
            To apply for your child, please send an email to: <b>admin@holycrossbrooklyn.co.za</b><br/>
            The application forms will then be emailed to you.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Phone />}
              href="tel:0215114337"
              sx={{ borderColor: '#ffd700', color: '#1a237e', fontWeight: 700 }}
            >
              Call School
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Email />}
              href="mailto:admin@holycrossbrooklyn.co.za"
              sx={{ borderColor: '#ffd700', color: '#1a237e', fontWeight: 700 }}
            >
              Email Admin
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Divider sx={{ my: 4 }} />
      <Box sx={{ textAlign: 'center', color: '#aaa', mt: 4 }}>
        <Typography variant="body2">
          <em>More resources and downloadable documents will be added as they become available.</em>
        </Typography>
      </Box>
    </Container>
  );
};

export default Links; 