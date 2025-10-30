import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
  Alert,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person,
  School,
  Description,
  AttachMoney,
  CheckCircle,
  ExpandMore,
  Schedule,
  Assignment,
  Payment,
  ContactMail,
  Phone,
  Email,
  LocationOn,
  Star,
  EmojiPeople,
  TrendingUp,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';

// Styled components
const HeroCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)',
  color: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  border: '3px solid #d32f2f',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
    borderRadius: '20px 20px 0 0',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  border: '2px solid #d32f2f',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e 0%, #ffd700 50%, #d32f2f 100%)',
    borderRadius: '16px 16px 0 0',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(211, 47, 47, 0.2)',
  },
}));

const Admissions: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);

  const admissionSteps = [
    {
      label: 'Inquiry & Tour',
      description: 'Contact us and schedule a school tour',
      icon: <ContactMail />,
      details: [
        'Call or email our admissions office',
        'Schedule a personalized school tour',
        'Meet with our principal and teachers',
        'Learn about our programs and facilities',
      ],
    },
    {
      label: 'Application',
      description: 'Submit your application form',
      icon: <Assignment />,
      details: [
        'Complete the application form',
        'Provide previous school records',
        'Submit required documents',
        'Pay application fee (R200)',
      ],
    },
    {
      label: 'Assessment',
      description: 'Student assessment and interview',
      icon: <School />,
      details: [
        'Academic assessment test',
        'Interview with student and parents',
        'Review of previous academic performance',
        'Assessment of character and values alignment',
      ],
    },
    {
      label: 'Acceptance',
      description: 'Receive admission decision',
      icon: <CheckCircle />,
      details: [
        'Admissions committee review',
        'Acceptance letter sent within 2 weeks',
        'Enrollment fee payment required',
        'Welcome package and orientation details',
      ],
    },
  ];

  const requirements = [
    {
      title: 'Age Requirements',
      items: [
        'Grade R: 5-6 years old by end of year',
        'Grade 1: 6-7 years old by end of year',
        'Grade 2-7: Age-appropriate for grade level',
      ],
    },
    {
      title: 'Academic Records',
      items: [
        'Previous school report cards',
        'Transfer certificate (if applicable)',
        'Birth certificate copy',
        'Immunization records',
      ],
    },
    {
      title: 'Character & Values',
      items: [
        'Alignment with Catholic values',
        'Good character references',
        'Willingness to participate in school activities',
        'Respect for school community',
      ],
    },
  ];

  const fees = [
    {
      grade: 'Grade R',
      tuition: 'R2,500',
      registration: 'R1,500',
      monthly: 'R1,200',
    },
    {
      grade: 'Grade 1-3',
      tuition: 'R3,200',
      registration: 'R1,500',
      monthly: 'R1,500',
    },
    {
      grade: 'Grade 4-7',
      tuition: 'R3,800',
      registration: 'R1,500',
      monthly: 'R1,800',
    },
  ];

  return (
    <>
      <SEO
        title="Admissions - Holy Cross Convent School Brooklyn"
        description="Join Holy Cross Convent School Brooklyn. Learn about our admission process, requirements, and fee structure. Quality Catholic education for your child."
        keywords="admissions, school enrollment, Holy Cross Convent School, Brooklyn, Cape Town, Catholic school"
      />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <ReturnToHome />
        
        {/* Hero Section */}
        <HeroCard sx={{ mb: 6 }}>
          <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  mr: 2,
                  width: 60,
                  height: 60,
                }}
              >
                <Person sx={{ fontSize: 30 }} />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  Admissions
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Join Our School Family
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, maxWidth: '80%' }}>
              Welcome to Holy Cross Convent School Brooklyn! We're excited to help you 
              join our school family. Our admissions process is designed to ensure 
              every student finds their place in our caring, values-based learning community.
            </Typography>
            
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                icon={<EmojiPeople />}
                label="Ages 5-13"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              />
              <Chip
                icon={<School />}
                label="Grade R-7"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              />
              <Chip
                icon={<Star />}
                label="Limited Spots"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              />
            </Stack>
          </CardContent>
        </HeroCard>

        {/* Admission Process */}
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Admission Process
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: '20px', mb: 6 }}>
          <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
            {admissionSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: activeStep >= index ? '#1a237e' : '#e0e0e0',
                        color: activeStep >= index ? 'white' : '#666',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {step.icon}
                    </Box>
                  )}
                  sx={{ '& .MuiStepLabel-label': { fontWeight: 600 } }}
                >
                  {step.label}
                </StepLabel>
                {isMobile && (
                  <StepContent>
                    <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                      {step.description}
                    </Typography>
                    <List dense>
                      {step.details.map((detail, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: '24px' }}>
                            <CheckCircle sx={{ fontSize: 16, color: '#1a237e' }} />
                          </ListItemIcon>
                          <ListItemText primary={detail} />
                        </ListItem>
                      ))}
                    </List>
                  </StepContent>
                )}
              </Step>
            ))}
          </Stepper>
          
          {!isMobile && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
                {admissionSteps[activeStep].label}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
                {admissionSteps[activeStep].description}
              </Typography>
              <List>
                {admissionSteps[activeStep].details.map((detail, idx) => (
                  <ListItem key={idx} sx={{ py: 0.5 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#1a237e' }} />
                    </ListItemIcon>
                    <ListItemText primary={detail} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Paper>

        {/* Requirements */}
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Admission Requirements
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
          {requirements.map((req, index) => (
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }} key={index}>
              <FeatureCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
                    {req.title}
                  </Typography>
                  <List dense>
                    {req.items.map((item, idx) => (
                      <ListItem key={idx} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: '24px' }}>
                          <CheckCircle sx={{ fontSize: 16, color: '#1a237e' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item}
                          primaryTypographyProps={{ fontSize: '0.9rem' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </FeatureCard>
            </Box>
          ))}
        </Box>

        {/* Fee Structure */}
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Fee Structure 2025
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: '20px', mb: 6 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {fees.map((fee, index) => (
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    border: '2px solid rgba(26, 35, 126, 0.1)',
                    borderRadius: '16px',
                    '&:hover': {
                      borderColor: '#1a237e',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 2 }}>
                      {fee.grade}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Annual Tuition
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700 }}>
                        {fee.tuition}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Registration Fee
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ff6b35', fontWeight: 600 }}>
                        {fee.registration}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Monthly Payment
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                        {fee.monthly}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Payment Options:</strong> Monthly, quarterly, or annual payments accepted. 
              Sibling discounts available. Contact us for payment plan options.
            </Typography>
          </Alert>
        </Paper>

        {/* Contact Information */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
          }}
        >
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 3, textAlign: 'center' }}>
            Contact Admissions
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ color: '#1a237e', mr: 2 }} />
                <Typography variant="body1">
                  <strong>Phone:</strong> +27 21 461 1234
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ color: '#1a237e', mr: 2 }} />
                <Typography variant="body1">
                  <strong>Email:</strong> admissions@holycross.co.za
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ color: '#1a237e', mr: 2 }} />
                <Typography variant="body1">
                  <strong>Address:</strong> Brooklyn, Cape Town, South Africa
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
                  Ready to Apply?
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
                  Download our application form or contact us to schedule a tour.
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                  <Button
                    variant="contained"
                    startIcon={<Description />}
                    sx={{
                      bgcolor: '#1a237e',
                      borderRadius: '25px',
                      px: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Download Form
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Schedule />}
                    sx={{
                      borderColor: '#1a237e',
                      color: '#1a237e',
                      borderRadius: '25px',
                      px: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Schedule Tour
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Admissions;
