import React, { useState } from 'react';
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Avatar,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  School,
  Construction,
  MusicNote,
  SportsSoccer,
  Science,
  Book,
  People,
  AttachMoney,
  CheckCircle,
  Star,
  Diamond,
  Payment,
  Receipt
} from '@mui/icons-material';
import ReturnToHome from '../components/ReturnToHome';
import { styled } from '@mui/material/styles';
import SEO from '../components/SEO';

// Styled components
const DonationCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  border: '2px solid transparent',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  '&.selected': {
    borderColor: '#ffd700',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
}));

const ProjectCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
  '&.selected': {
    borderColor: '#1a237e',
    backgroundColor: 'rgba(26, 35, 126, 0.05)',
  },
}));

const BenefitChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(76, 175, 80, 0.1)',
  color: '#2e7d32',
  fontWeight: 500,
  border: '1px solid rgba(76, 175, 80, 0.3)',
  margin: '2px',
}));

// Donation tiers
const donationTiers = [
  {
    id: 'bronze',
    name: 'Bronze Supporter',
    amount: 25,
    icon: <Star sx={{ color: '#cd7f32' }} />,
    benefits: [
      'Thank you letter',
      'School newsletter subscription',
      'Name on supporter wall'
    ],
    color: '#cd7f32'
  },
  {
    id: 'silver',
    name: 'Silver Supporter',
    amount: 100,
    icon: <Star sx={{ color: '#c0c0c0' }} />,
    benefits: [
      'All Bronze benefits',
      'School calendar',
      'Invitation to school events',
      'Quarterly impact report'
    ],
    color: '#c0c0c0'
  },
  {
    id: 'gold',
    name: 'Gold Supporter',
    amount: 250,
    icon: <Star sx={{ color: '#ffd700' }} />,
    benefits: [
      'All Silver benefits',
      'Personal tour of the school',
      'Recognition at school assembly',
      'Annual donor appreciation event'
    ],
    color: '#ffd700'
  },
  {
    id: 'platinum',
    name: 'Platinum Supporter',
    amount: 500,
    icon: <Diamond sx={{ color: '#e5e4e2' }} />,
    benefits: [
      'All Gold benefits',
      'Naming opportunity for facilities',
      'VIP access to school events',
      'Direct communication with principal'
    ],
    color: '#e5e4e2'
  }
];

// Project donations
const projectDonations = [
  {
    id: 'computer-lab',
    name: 'Computer Lab Upgrade',
    description: 'Modernizing our computer laboratory with latest technology',
    target: 50000,
    raised: 37500,
    icon: <School />,
    color: '#2196f3'
  },
  {
    id: 'library',
    name: 'Library Renovation',
    description: 'Creating a modern learning space with digital resources',
    target: 30000,
    raised: 18000,
    icon: <Book />,
    color: '#4caf50'
  },
  {
    id: 'sports',
    name: 'Sports Equipment',
    description: 'Providing quality sports equipment for all students',
    target: 15000,
    raised: 12000,
    icon: <SportsSoccer />,
    color: '#ff9800'
  },
  {
    id: 'music',
    name: 'Music Program',
    description: 'Supporting our music education and performance programs',
    target: 20000,
    raised: 8500,
    icon: <MusicNote />,
    color: '#9c27b0'
  },
  {
    id: 'science',
    name: 'Science Lab',
    description: 'Upgrading science laboratory with modern equipment',
    target: 40000,
    raised: 22000,
    icon: <Science />,
    color: '#f44336'
  },
  {
    id: 'community',
    name: 'Community Outreach',
    description: 'Supporting our community service and outreach programs',
    target: 10000,
    raised: 6500,
    icon: <People />,
    color: '#607d8b'
  }
];

const Donate: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [donationType, setDonationType] = useState<'tier' | 'project' | 'custom'>('tier');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<number>(50);
  const [donorInfo, setDonorInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    anonymous: false,
    message: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const steps = [
    'Choose Donation Type',
    'Select Amount',
    'Donor Information',
    'Payment & Review'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDonationTypeChange = (type: 'tier' | 'project' | 'custom') => {
    setDonationType(type);
    setSelectedTier('');
    setSelectedProject('');
  };

  const getSelectedAmount = () => {
    if (donationType === 'tier' && selectedTier) {
      const tier = donationTiers.find(t => t.id === selectedTier);
      return tier ? tier.amount : 0;
    } else if (donationType === 'project' && selectedProject) {
      return 100; // Default project donation amount
    } else if (donationType === 'custom') {
      return customAmount;
    }
    return 0;
  };

  const handleSubmit = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // Reset form
    setActiveStep(0);
    setDonationType('tier');
    setSelectedTier('');
    setSelectedProject('');
    setCustomAmount(50);
    setDonorInfo({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      anonymous: false,
      message: ''
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#1a237e' }}>
              Choose Your Donation Type
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <DonationCard 
                  className={donationType === 'tier' ? 'selected' : ''}
                  onClick={() => handleDonationTypeChange('tier')}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Star sx={{ fontSize: 48, color: '#ffd700', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Donation Tiers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Choose from our predefined donation levels with exclusive benefits
                    </Typography>
                  </CardContent>
                </DonationCard>
              </Box>
              
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <DonationCard 
                  className={donationType === 'project' ? 'selected' : ''}
                  onClick={() => handleDonationTypeChange('project')}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Construction sx={{ fontSize: 48, color: '#1a237e', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Project-Specific
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Support a specific school project or initiative
                    </Typography>
                  </CardContent>
                </DonationCard>
              </Box>
              
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <DonationCard 
                  className={donationType === 'custom' ? 'selected' : ''}
                  onClick={() => handleDonationTypeChange('custom')}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <AttachMoney sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Custom Amount
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Donate any amount you choose
                    </Typography>
                  </CardContent>
                </DonationCard>
              </Box>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#1a237e' }}>
              Select Your Donation Amount
            </Typography>
            
            {donationType === 'tier' && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {donationTiers.map((tier) => (
                  <Box sx={{ flex: '1 1 250px', minWidth: 0 }} key={tier.id}>
                    <DonationCard 
                      className={selectedTier === tier.id ? 'selected' : ''}
                      onClick={() => setSelectedTier(tier.id)}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box sx={{ mb: 2 }}>
                          {tier.icon}
                        </Box>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {tier.name}
                        </Typography>
                        <Typography variant="h4" sx={{ mb: 2, color: tier.color, fontWeight: 700 }}>
                          R{tier.amount}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          {tier.benefits.map((benefit, index) => (
                            <BenefitChip key={index} label={benefit} size="small" />
                          ))}
                        </Box>
                      </CardContent>
                    </DonationCard>
                  </Box>
                ))}
              </Box>
            )}
            
            {donationType === 'project' && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {projectDonations.map((project) => (
                  <Box sx={{ flex: '1 1 300px', minWidth: 0 }} key={project.id}>
                    <ProjectCard 
                      className={selectedProject === project.id ? 'selected' : ''}
                      onClick={() => setSelectedProject(project.id)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: project.color, mr: 2 }}>
                            {project.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {project.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {project.description}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Progress</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              R{project.raised.toLocaleString()} / R{project.target.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            width: '100%', 
                            height: 8, 
                            bgcolor: 'grey.200', 
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}>
                            <Box sx={{ 
                              width: `${(project.raised / project.target) * 100}%`,
                              height: '100%',
                              bgcolor: project.color,
                              transition: 'width 0.3s ease'
                            }} />
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary">
                          {Math.round((project.raised / project.target) * 100)}% funded
                        </Typography>
                      </CardContent>
                    </ProjectCard>
                  </Box>
                ))}
              </Box>
            )}
            
            {donationType === 'custom' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Enter any amount you'd like to donate to support our school.
                </Typography>
                <TextField
                  fullWidth
                  label="Donation Amount (R)"
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>R</Typography>,
                  }}
                  sx={{ maxWidth: 300 }}
                />
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#1a237e' }}>
              Donor Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Donor Information
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={donorInfo.firstName}
                      onChange={(e) => setDonorInfo({...donorInfo, firstName: e.target.value})}
                      required
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={donorInfo.lastName}
                      onChange={(e) => setDonorInfo({...donorInfo, lastName: e.target.value})}
                      required
                    />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                    required
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Phone (Optional)"
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo({...donorInfo, phone: e.target.value})}
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={donorInfo.anonymous}
                        onChange={(e) => setDonorInfo({...donorInfo, anonymous: e.target.checked})}
                      />
                    }
                    label="Make this donation anonymous"
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Message (Optional)"
                    multiline
                    rows={3}
                    value={donorInfo.message}
                    onChange={(e) => setDonorInfo({...donorInfo, message: e.target.value})}
                    placeholder="Share why you're supporting our school..."
                  />
                </Box>
              </Box>
              
              <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Payment Method
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Payment Instructions:</strong> Please make cash deposits into the school bank account:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Bank:</strong> FNB<br />
                      <strong>Branch:</strong> 203309<br />
                      <strong>Account Number:</strong> 54450670046<br />
                      <strong>Reference:</strong> {donorInfo.firstName || '[Name]'} {donorInfo.lastName || ''} - Donation
                    </Typography>
                  </Box>
                </Alert>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Payment Method</FormLabel>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="cash"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Payment sx={{ mr: 1 }} />
                          Cash Deposit (FNB Account)
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="eft"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Receipt sx={{ mr: 1 }} />
                          EFT / Direct Deposit
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                    Donation Summary
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                      <Typography variant="body2" color="text.secondary">
                        Donation Type:
                      </Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                      <Typography variant="body2">
                        {donationType === 'tier' ? 'Donation Tier' : 
                         donationType === 'project' ? 'Project-Specific' : 'Custom Amount'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                      <Typography variant="body2" color="text.secondary">
                        Amount:
                      </Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                      <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
                        R{getSelectedAmount().toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SEO 
        title="Donate - Holy Cross Convent School"
        description="Support Holy Cross Convent School Brooklyn through donations. Choose from donation tiers, project-specific funding, or custom amounts."
        keywords="donate, school funding, Holy Cross Convent School, education support, charitable giving"
      />
      
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '400px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'url("/edu2.jpg") center/cover no-repeat',
          backgroundPosition: 'center 40%',
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
        }}
      >
        {/* Return to Home - positioned to avoid header clash */}
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

        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              mb: 2,
              color: '#ffd700',
              textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9), 0 0 60px rgba(26,35,126,0.6)',
              letterSpacing: '0.5px'
            }}
          >
            Support Our School
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#ffffff',
              fontWeight: 600,
              textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8)',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Your generosity makes a difference
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6, mt: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Your generous donations help us provide quality education, maintain our facilities, 
            and create opportunities for our students to thrive.
          </Typography>
        </Box>

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={processing || getSelectedAmount() === 0}
                  startIcon={processing ? <CircularProgress size={20} /> : <CheckCircle />}
                  sx={{
                    bgcolor: '#1a237e',
                    '&:hover': { bgcolor: '#0d47a1' }
                  }}
                >
                  {processing ? 'Processing...' : 'Complete Donation'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 1 && getSelectedAmount() === 0) ||
                    (activeStep === 2 && (!donorInfo.firstName || !donorInfo.lastName || !donorInfo.email))
                  }
                  sx={{
                    bgcolor: '#1a237e',
                    '&:hover': { bgcolor: '#0d47a1' }
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Success Dialog */}
        <Dialog open={showSuccess} onClose={handleCloseSuccess} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', color: '#4caf50' }}>
            <CheckCircle sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
            <Typography variant="h5">Thank You!</Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
              Your donation of R{getSelectedAmount().toLocaleString()} has been successfully processed.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              You will receive a confirmation email shortly. Thank you for supporting our school!
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button onClick={handleCloseSuccess} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </>
  );
};

export default Donate;
