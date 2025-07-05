import React, { useState } from 'react';
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
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send, Phone, Email, LocationOn, School } from '@mui/icons-material';

const ContactCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #fffde7 0%, #e3eafc 100%)',
  border: '2px solid transparent',
  backgroundClip: 'padding-box',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: '#ffd700'
  }
}));

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof ContactFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.subject.trim() &&
      formData.message.trim() &&
      formData.inquiryType
    );
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
        Contact Us
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
        gap: 4 
      }}>
        {/* Contact Information */}
        <Box>
          <ContactCard>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 3 }}>
                Get in Touch
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <School sx={{ color: '#ffd700', mr: 2 }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Holy Cross Convent School
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Brooklyn, Cape Town
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Phone sx={{ color: '#ffd700', mr: 2 }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Phone
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      (021) 511 4337
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ color: '#ffd700', mr: 2 }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      info@holycrossbrooklyn.edu.za
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ color: '#ffd700', mr: 2 }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Address
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Brooklyn, Cape Town<br />
                      Western Cape, South Africa
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </ContactCard>
        </Box>

        {/* Contact Form */}
        <Box>
          <ContactCard>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 3 }}>
                Send us a Message
              </Typography>

              <form onSubmit={handleSubmit}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 3 
                }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleChange('firstName')}
                    required
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleChange('lastName')}
                    required
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    required
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    variant="outlined"
                  />
                  <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
                    <FormControl fullWidth required>
                      <InputLabel>Type of Inquiry</InputLabel>
                      <Select
                        value={formData.inquiryType}
                        label="Type of Inquiry"
                        onChange={handleChange('inquiryType')}
                      >
                        <MenuItem value="admission">Admission Inquiry</MenuItem>
                        <MenuItem value="general">General Information</MenuItem>
                        <MenuItem value="academic">Academic Questions</MenuItem>
                        <MenuItem value="events">Events & Activities</MenuItem>
                        <MenuItem value="feedback">Feedback</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
                    <TextField
                      fullWidth
                      label="Subject"
                      value={formData.subject}
                      onChange={handleChange('subject')}
                      required
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
                    <TextField
                      fullWidth
                      label="Message"
                      value={formData.message}
                      onChange={handleChange('message')}
                      required
                      multiline
                      rows={4}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={!isFormValid() || loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                      sx={{
                        backgroundColor: '#1a237e',
                        '&:hover': {
                          backgroundColor: '#0d47a1'
                        }
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </ContactCard>
        </Box>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Message sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactForm; 