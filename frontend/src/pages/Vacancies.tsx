import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Work,
  LocationOn,
  Schedule,
  Email,
  Close,
  School,
  BusinessCenter,
  Groups,
  Person,
  CheckCircle,
  CalendarToday,
  AttachMoney,
  TrendingUp,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { endOfDay, isAfter, format } from 'date-fns';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';
import vacancyService, { Vacancy } from '../services/vacancyService';

// Image path - using constant for better production handling
const heroImage = '/careers012.jpg';

const Hero = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '70vh',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url("${heroImage}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center 20%',
  backgroundRepeat: 'no-repeat',
  textAlign: 'center',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    minHeight: '600px',
    maxHeight: '800px',
  },
  [theme.breakpoints.down('sm')]: {
    backgroundPosition: 'center 15%',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,35,126,0.8), rgba(211,47,47,0.6))',
    zIndex: 0
  },
  '& > *': { position: 'relative', zIndex: 1 }
}));

const VacancyCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderTop: '4px solid #d32f2f',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(26,35,126,0.2)'
  },
  '&:focus-visible': {
    outline: '3px solid #ffd700',
    outlineOffset: '4px',
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(26,35,126,0.2)'
  }
}));

const UrgentBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  backgroundColor: '#d32f2f',
  color: 'white',
  fontWeight: 700,
  zIndex: 1
}));

const Vacancies: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Memoize breakpoint check to avoid re-renders
  const isMobileMemo = useMemo(() => isMobile, [isMobile]);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await vacancyService.getPublishedVacancies();
        setVacancies(data);
      } catch (err) {
        console.error('Error fetching vacancies:', err);
        setError('Failed to load vacancies. Please check if the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  const handleOpenDialog = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedVacancy(null);
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'TEACHING':
        return <School />;
      case 'ADMIN':
        return <BusinessCenter />;
      case 'SUPPORT':
        return <Groups />;
      case 'LEADERSHIP':
        return <Person />;
      default:
        return <Work />;
    }
  };

  const getDepartmentLabel = (department: string) => {
    switch (department) {
      case 'TEACHING':
        return 'Teaching';
      case 'ADMIN':
        return 'Administrative';
      case 'SUPPORT':
        return 'Support Staff';
      case 'LEADERSHIP':
        return 'Leadership';
      default:
        return department;
    }
  };

  const getEmploymentTypeLabel = (type: string) => {
    switch (type) {
      case 'FULL_TIME':
        return 'Full Time';
      case 'PART_TIME':
        return 'Part Time';
      case 'CONTRACT':
        return 'Contract';
      case 'TEMPORARY':
        return 'Temporary';
      default:
        return type;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
    const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const isVacancyOpen = (vacancy: Vacancy) => {
    if (!vacancy.closingDate) return true;
    try {
    const closingDate = new Date(vacancy.closingDate);
      const endOfClosingDay = endOfDay(closingDate);
      return isAfter(endOfClosingDay, new Date());
    } catch (error) {
      console.error('Error checking vacancy date:', error);
      return true; // Default to open if date parsing fails
    }
  };

  return (
    <>
      <SEO
        title="Career Opportunities - Holy Cross Convent School"
        description="Join our dedicated team of educators and support staff. Explore current job openings and career opportunities at Holy Cross Convent School Brooklyn."
        keywords="careers, job opportunities, teaching positions, employment, Holy Cross Convent School, Brooklyn"
        image="/careers012.jpg"
        type="website"
      />

      {/* Return to Home - moved outside hero to avoid blocking content */}
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

      {/* Hero Section */}
      <Hero>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
          <Chip
            label="Join Our Team"
            sx={{
              backgroundColor: '#ffd700',
              color: '#1a237e',
              fontWeight: 700,
              fontSize: '1rem',
              px: 2,
              py: 3,
              mb: 4
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 3,
              color: '#ffd700',
              textShadow: '4px 4px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9)'
            }}
          >
            Career Opportunities
          </Typography>

          <Typography
            variant="h5"
            sx={{
              maxWidth: '900px',
              mx: 'auto',
              mb: 4,
              fontWeight: 700,
              color: '#ffffff',
              textShadow: '3px 3px 6px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8)',
              px: 2,
              lineHeight: 1.4
            }}
          >
            Join our dedicated team of educators and support staff who are committed to nurturing excellence, building character, and inspiring faith.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              href="/contact"
              sx={{
                backgroundColor: '#ffd700',
                color: '#1a237e',
                fontWeight: 700,
                px: 4,
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                '&:hover': {
                  backgroundColor: '#ffed4e',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 35px rgba(255, 215, 0, 0.5)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Contact Us
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="/staff"
              sx={{
                color: 'white',
                borderColor: 'white',
                borderWidth: 2,
                fontWeight: 700,
                px: 4,
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: '#ffd700',
                  color: '#ffd700',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-3px)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Meet Our Team
            </Button>
          </Stack>
        </Container>
      </Hero>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress 
              size={60} 
              aria-label="Loading vacancies"
              sx={{ color: '#1a237e', mb: 3 }} 
            />
            <Typography variant="h6" sx={{ color: '#666' }}>
              Loading vacancies...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : vacancies.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
              borderRadius: 4,
              border: '2px solid #e3f2fd'
            }}
          >
            <Work sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
            <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 2 }}>
              No Current Vacancies
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 4, maxWidth: '600px', mx: 'auto' }}>
              We don't have any open positions at the moment, but we're always looking for passionate educators and support staff.
              Please check back regularly or contact us to express your interest in joining our team.
            </Typography>
            <Button
              variant="contained"
              href="/contact"
              sx={{
                backgroundColor: '#1a237e',
                color: '#fff',
                fontWeight: 700,
                px: 4,
                py: 2,
                '&:hover': {
                  backgroundColor: '#283593'
                }
              }}
            >
              Contact Us
            </Button>
          </Paper>
        ) : (
          <>
            {/* Info Section */}
            <Paper
              elevation={0}
              sx={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #ffebee 100%)',
                p: 4,
                borderRadius: 4,
                border: '3px solid #d32f2f',
                mb: 6,
                textAlign: 'center'
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  color: '#1a237e'
                }}
              >
                Join Our Mission
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  color: '#424242'
                }}
              >
                At Holy Cross Convent School, we believe in nurturing excellence, building character, and inspiring faith.
                We're looking for dedicated professionals who share our commitment to Catholic education and student success.
              </Typography>
            </Paper>

            {/* Vacancies Grid */}
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                fontWeight: 800,
                mb: 6,
                color: '#1a237e'
              }}
            >
              Current Openings
            </Typography>

            <Grid container spacing={3} sx={{ mb: 6 }}>
              {vacancies.filter(isVacancyOpen).map((vacancy) => (
                <Grid item xs={12} sm={6} md={4} key={vacancy.id}>
                  <VacancyCard elevation={2}>
                  {vacancy.isUrgent && <UrgentBadge label="URGENT" size="small" />}
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #1a237e 0%, #d32f2f 100%)',
                          color: 'white',
                          mr: 2
                        }}
                      >
                        {getDepartmentIcon(vacancy.department)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: '#1a237e',
                            mb: 0.5,
                            fontSize: '1.1rem'
                          }}
                        >
                          {vacancy.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {getDepartmentLabel(vacancy.department)}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Chip
                          icon={<LocationOn sx={{ fontSize: 16 }} aria-hidden="true" />}
                        label={vacancy.location || 'Brooklyn, Cape Town'}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: '#ddd' }}
                      />
                      <Chip
                          icon={<Schedule sx={{ fontSize: 16 }} aria-hidden="true" />}
                        label={getEmploymentTypeLabel(vacancy.employmentType)}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: '#ddd' }}
                      />
                    </Stack>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#666',
                        mb: 2,
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {vacancy.description}
                    </Typography>

                    {vacancy.closingDate && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          color: '#d32f2f',
                          fontWeight: 600,
                          mb: 2
                        }}
                      >
                          <CalendarToday sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} aria-hidden="true" />
                          Closes: {formatDate(vacancy.closingDate)}
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleOpenDialog(vacancy)}
                      sx={{
                        backgroundColor: '#1a237e',
                        color: '#fff',
                        fontWeight: 700,
                        '&:hover': {
                          backgroundColor: '#283593'
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </VacancyCard>
                </Grid>
              ))}
            </Grid>

            {/* Closed Vacancies Info */}
            {vacancies.filter(v => !isVacancyOpen(v)).length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: '#f5f5f5',
                  borderRadius: 2,
                  border: '1px solid #ddd'
                }}
              >
                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
                  Some positions have closed. Please contact us if you're interested in similar opportunities.
                </Typography>
              </Paper>
            )}
          </>
        )}
      </Container>

      {/* Vacancy Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobileMemo}
        aria-modal="true"
        aria-labelledby="vacancy-dialog-title"
      >
        <DialogTitle id="vacancy-dialog-title">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1a237e 0%, #d32f2f 100%)',
                    color: 'white',
                    mr: 2
                  }}
                >
                  {selectedVacancy && getDepartmentIcon(selectedVacancy.department)}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e' }}>
                    {selectedVacancy?.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {selectedVacancy && getDepartmentLabel(selectedVacancy.department)}
                  </Typography>
                </Box>
              </Box>
              {selectedVacancy?.isUrgent && (
                <Chip
                  label="URGENT"
                  size="small"
                  sx={{
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    fontWeight: 700,
                    mt: 1
                  }}
                />
              )}
            </Box>
            <IconButton onClick={handleCloseDialog} sx={{ ml: 2 }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedVacancy && (
            <>
              <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={<LocationOn aria-hidden="true" />}
                  label={selectedVacancy.location || 'Brooklyn, Cape Town'}
                  variant="outlined"
                />
                <Chip
                  icon={<Schedule aria-hidden="true" />}
                  label={getEmploymentTypeLabel(selectedVacancy.employmentType)}
                  variant="outlined"
                />
                {selectedVacancy.salaryRange && (
                  <Chip
                    icon={<AttachMoney aria-hidden="true" />}
                    label={selectedVacancy.salaryRange}
                    variant="outlined"
                  />
                )}
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                Job Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {selectedVacancy.description}
              </Typography>

              {selectedVacancy.responsibilities && selectedVacancy.responsibilities.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                    Key Responsibilities
                  </Typography>
                  <List>
                    {selectedVacancy.responsibilities.map((responsibility, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckCircle sx={{ color: '#1a237e' }} />
                        </ListItemIcon>
                        <ListItemText primary={responsibility} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {selectedVacancy.requirements && selectedVacancy.requirements.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 4, color: '#1a237e' }}>
                    Requirements
                  </Typography>
                  <List>
                    {selectedVacancy.requirements.map((requirement, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckCircle sx={{ color: '#1a237e' }} />
                        </ListItemIcon>
                        <ListItemText primary={requirement} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {selectedVacancy.qualifications && selectedVacancy.qualifications.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 4, color: '#1a237e' }}>
                    Qualifications
                  </Typography>
                  <List>
                    {selectedVacancy.qualifications.map((qualification, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <TrendingUp sx={{ color: '#1a237e' }} />
                        </ListItemIcon>
                        <ListItemText primary={qualification} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {selectedVacancy.applicationInstructions && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
                    Application Instructions
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {selectedVacancy.applicationInstructions}
                  </Typography>
                </>
              )}

              {selectedVacancy.closingDate && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    background: '#fff3e0',
                    borderRadius: 2,
                    border: '1px solid #ff9800'
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                    <CalendarToday sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} aria-hidden="true" />
                    Application closes: {formatDate(selectedVacancy.closingDate)}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Close
          </Button>
          {selectedVacancy?.applicationEmail && (
            <Button
              variant="contained"
              startIcon={<Email />}
              href={`mailto:${selectedVacancy.applicationEmail}?subject=Application for ${selectedVacancy.title}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: '#1a237e',
                '&:hover': {
                  backgroundColor: '#283593'
                }
              }}
            >
              Apply Now
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Vacancies;
