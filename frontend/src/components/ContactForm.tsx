import React, { useState, memo, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  SelectChangeEvent,
  Chip,
  Fade,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send, Phone, Email, LocationOn, School, CheckCircle, Error } from '@mui/icons-material';

// TypeScript interfaces for type safety
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  inquiryType?: string;
}

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  primary: string;
  secondary?: string;
  tertiary?: string;
}

// Styled components
const ContactCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #fff3e0 0%, #e0f7fa 100%)', // School-friendly gradient
  border: '2px solid transparent',
  backgroundClip: 'padding-box',
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: '#ffca28'
  }
}));

const ContactInfoCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: 'rgba(255, 193, 7, 0.1)',
  border: '1px solid rgba(255, 193, 7, 0.2)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    transform: 'translateX(4px)',
    boxShadow: theme.shadows[4],
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1a237e',
  color: 'white',
  padding: theme.spacing(2, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: '#0d47a1',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(26, 35, 126, 0.3)',
  },
  '&:disabled': {
    backgroundColor: '#ccc',
    color: '#666',
    transform: 'none',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

// Contact information data
const contactInfo: ContactInfo[] = [
  {
    icon: <Phone sx={{ color: '#ffca28', fontSize: 30 }} />,
    title: 'Phone',
    primary: '+27 21 511 4337',
    secondary: 'Office Hours: Mon-Fri 7:30 AM - 4:00 PM'
  },
  {
    icon: <Email sx={{ color: '#ffca28', fontSize: 30 }} />,
    title: 'Email',
    primary: 'admin@holycrossbrooklyn.co.za',
    secondary: 'admissions@holycrossbrooklyn.co.za'
  },
  {
    icon: <LocationOn sx={{ color: '#ffca28', fontSize: 30 }} />,
    title: 'Address',
    primary: '162 Koeberg Road, Brooklyn, Cape Town',
    secondary: '7405 Western Cape, South Africa',
    tertiary: 'Easily accessible from major routes'
  }
];

// Memoized subcomponents
const ContactInfoItem = memo(({ info }: { info: ContactInfo }) => (
  <Fade in timeout={500}>
    <ContactInfoCard>
      <Box sx={{ mr: 2 }}>
        {info.icon}
      </Box>
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a237e' }}>
          {info.title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          {info.primary}
        </Typography>
        {info.secondary && (
          <Typography variant="body2" sx={{ color: '#666' }}>
            {info.secondary}
          </Typography>
        )}
        {info.tertiary && (
          <Typography variant="caption" sx={{ color: '#888', fontStyle: 'italic' }}>
            {info.tertiary}
          </Typography>
        )}
      </Box>
    </ContactInfoCard>
  </Fade>
));

const ContactInfoSection = memo(() => (
  <ContactCard>
    <CardContent>
      <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 3, textAlign: 'center' }}>
        Contact Information
      </Typography>
      
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
          <School sx={{ color: '#ffca28', mr: 2, fontSize: 40 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
              Holy Cross Convent School
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Brooklyn, Cape Town
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
          Excellence in Catholic Education since 1960
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {contactInfo.map((info, index) => (
          <ContactInfoItem key={info.title} info={info} />
        ))}
      </Box>
    </CardContent>
  </ContactCard>
));

const ContactFormComponent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateField = useCallback((field: keyof ContactFormData, value: string): string | undefined => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return value.trim().length < 2 ? `${field === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters` : undefined;
      case 'email':
        return !validateEmail(value) ? 'Please enter a valid email address' : undefined;
      case 'phone':
        return !validatePhone(value) ? 'Please enter a valid phone number' : undefined;
      case 'subject':
        return value.trim().length < 5 ? 'Subject must be at least 5 characters' : undefined;
      case 'message':
        return value.trim().length < 10 ? 'Message must be at least 10 characters' : undefined;
      case 'inquiryType':
        return !value ? 'Please select an inquiry type' : undefined;
      default:
        return undefined;
    }
  }, []);

  const handleChange = useCallback((field: keyof ContactFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleBlur = useCallback((field: keyof ContactFormData) => () => {
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [validateField, formData]);

  const isFormValid = useCallback(() => {
    const requiredFields: (keyof ContactFormData)[] = ['firstName', 'lastName', 'email', 'subject', 'message', 'inquiryType'];
    return requiredFields.every(field => {
      const value = formData[field];
      return value.trim() && !validateField(field, value);
    });
  }, [formData, validateField]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const field = key as keyof ContactFormData;
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: ''
      });
      setErrors({});
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData, validateField]);

  return (
    <Box sx={{ py: 4 }} role="main" aria-label="Contact form">
      {/* Enhanced Header */}
      <Fade in timeout={500}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              color: '#1a237e', 
              fontWeight: 700, 
              mb: 2, 
              fontSize: { xs: '2rem', md: '2.5rem' } 
            }}
          >
            Get in Touch
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#555', 
              maxWidth: 800, 
              mx: 'auto', 
              mb: 4 
            }}
          >
            We'd love to hear from you! Whether you have questions about enrollment, want to schedule a visit, 
            or need information about our programs, our team is here to help.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label="Quick Response" 
              color="primary" 
              variant="outlined"
              sx={{ borderColor: '#ffca28', color: '#1a237e' }}
            />
            <Chip 
              label="Professional Staff" 
              color="primary" 
              variant="outlined"
              sx={{ borderColor: '#ffca28', color: '#1a237e' }}
            />
            <Chip 
              label="24/7 Support" 
              color="primary" 
              variant="outlined"
              sx={{ borderColor: '#ffca28', color: '#1a237e' }}
            />
          </Box>
        </Box>
      </Fade>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
        gap: 4 
      }}>
        {/* Contact Information */}
        <Slide direction="right" in timeout={600}>
          <Box>
            <ContactInfoSection />
          </Box>
        </Slide>

        {/* Contact Form */}
        <Slide direction="left" in timeout={600}>
          <Box>
            <ContactCard>
              <CardContent>
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 3, textAlign: 'center' }}>
                  Send us a Message
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 4, textAlign: 'center' }}>
                  Fill out the form below and we'll get back to you within 24 hours. 
                  All fields marked with * are required.
                </Typography>

                <form onSubmit={handleSubmit} noValidate>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 3 
                  }}>
                    <TextField
                      fullWidth
                      label="First Name *"
                      value={formData.firstName}
                      onChange={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      required
                      variant="outlined"
                      aria-label="First name"
                    />
                    <TextField
                      fullWidth
                      label="Last Name *"
                      value={formData.lastName}
                      onChange={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      required
                      variant="outlined"
                      aria-label="Last name"
                    />
                    <TextField
                      fullWidth
                      label="Email *"
                      type="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      onBlur={handleBlur('email')}
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                      variant="outlined"
                      aria-label="Email address"
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      onBlur={handleBlur('phone')}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      variant="outlined"
                      aria-label="Phone number (optional)"
                    />
                    <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
                      <FormControl fullWidth required error={!!errors.inquiryType}>
                        <InputLabel>Type of Inquiry *</InputLabel>
                        <Select
                          value={formData.inquiryType}
                          label="Type of Inquiry *"
                          onChange={handleChange('inquiryType')}
                          onBlur={handleBlur('inquiryType')}
                          aria-label="Select inquiry type"
                        >
                          <MenuItem value="admission">Admission Inquiry</MenuItem>
                          <MenuItem value="general">General Information</MenuItem>
                          <MenuItem value="academic">Academic Questions</MenuItem>
                          <MenuItem value="events">Events & Activities</MenuItem>
                          <MenuItem value="feedback">Feedback</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                        {errors.inquiryType && (
                          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                            {errors.inquiryType}
                          </Typography>
                        )}
                      </FormControl>
                    </Box>
                    <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
                      <TextField
                        fullWidth
                        label="Subject *"
                        value={formData.subject}
                        onChange={handleChange('subject')}
                        onBlur={handleBlur('subject')}
                        error={!!errors.subject}
                        helperText={errors.subject}
                        required
                        variant="outlined"
                        aria-label="Message subject"
                      />
                    </Box>
                    <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
                      <TextField
                        fullWidth
                        label="Message *"
                        value={formData.message}
                        onChange={handleChange('message')}
                        onBlur={handleBlur('message')}
                        error={!!errors.message}
                        helperText={errors.message}
                        required
                        multiline
                        rows={4}
                        variant="outlined"
                        aria-label="Your message"
                      />
                    </Box>
                    <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
                      <SubmitButton
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={!isFormValid() || loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                        aria-label={loading ? 'Sending message' : 'Send message'}
                      >
                        {loading ? 'Sending Message...' : 'Send Message'}
                      </SubmitButton>
                    </Box>
                  </Box>
                </form>
              </CardContent>
            </ContactCard>
          </Box>
        </Slide>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess(false)} 
          severity="success" 
          icon={<CheckCircle />}
          sx={{ 
            backgroundColor: '#4caf50', 
            color: 'white',
            minWidth: '300px'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Message Sent Successfully! 🎉
          </Typography>
          <Typography variant="body2">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </Typography>
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError('')} 
          severity="error" 
          icon={<Error />}
          sx={{ 
            backgroundColor: '#f44336', 
            color: 'white',
            minWidth: '300px'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default memo(ContactFormComponent); 