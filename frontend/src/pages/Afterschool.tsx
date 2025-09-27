import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  GridLegacy as Grid,
  Chip,
  Stack,
  Button,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Schedule,
  EmojiPeople,
  School,
  SportsSoccer,
  MusicNote,
  Palette,
  Science,
  Book,
  Computer,
  TrendingUp,
  Star,
  CheckCircle,
  AccessTime,
  Group,
  LocationOn,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ReturnToHome from '../components/ReturnToHome';
import SEO from '../components/SEO';

// Styled components
const HeroCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd700 100%)',
  color: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
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
}));

const ActivityCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  border: '1px solid rgba(26, 35, 126, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(26, 35, 126, 0.15)',
    borderColor: 'rgba(26, 35, 126, 0.2)',
  },
}));

const Afterschool: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const activities = [
    {
      category: 'Academic Support',
      icon: <Book sx={{ fontSize: 40, color: '#1a237e' }} />,
      color: '#1a237e',
      items: [
        { name: 'Homework Help', time: '3:30 PM - 4:30 PM', age: 'All Grades' },
        { name: 'Math Tutoring', time: '4:30 PM - 5:30 PM', age: 'Grade 4-7' },
        { name: 'Reading Club', time: '3:30 PM - 4:15 PM', age: 'Grade R-3' },
        { name: 'Study Skills', time: '4:30 PM - 5:30 PM', age: 'Grade 5-7' },
      ],
    },
    {
      category: 'Sports & Fitness',
      icon: <SportsSoccer sx={{ fontSize: 40, color: '#ff6b35' }} />,
      color: '#ff6b35',
      items: [
        { name: 'Soccer Training', time: '3:30 PM - 5:00 PM', age: 'Grade 3-7' },
        { name: 'Netball Practice', time: '3:30 PM - 4:30 PM', age: 'Grade 4-7' },
        { name: 'Tennis Lessons', time: '4:30 PM - 5:30 PM', age: 'Grade 2-7' },
        { name: 'Karate Club', time: '4:00 PM - 5:00 PM', age: 'Grade R-7' },
      ],
    },
    {
      category: 'Creative Arts',
      icon: <Palette sx={{ fontSize: 40, color: '#2e7d32' }} />,
      color: '#2e7d32',
      items: [
        { name: 'Art & Craft', time: '3:30 PM - 4:30 PM', age: 'All Grades' },
        { name: 'Music Lessons', time: '4:00 PM - 5:00 PM', age: 'Grade 2-7' },
        { name: 'Drama Club', time: '4:30 PM - 5:30 PM', age: 'Grade 3-7' },
        { name: 'Choir Practice', time: '3:45 PM - 4:45 PM', age: 'Grade R-7' },
      ],
    },
    {
      category: 'Technology',
      icon: <Computer sx={{ fontSize: 40, color: '#d32f2f' }} />,
      color: '#d32f2f',
      items: [
        { name: 'Computer Club', time: '3:30 PM - 4:30 PM', age: 'Grade 4-7' },
        { name: 'Coding Basics', time: '4:30 PM - 5:30 PM', age: 'Grade 5-7' },
        { name: 'Robotics Club', time: '3:45 PM - 4:45 PM', age: 'Grade 6-7' },
        { name: 'Digital Art', time: '4:00 PM - 5:00 PM', age: 'Grade 3-7' },
      ],
    },
  ];

  const schedule = [
    { day: 'Monday', activities: ['Homework Help', 'Soccer Training', 'Art & Craft'] },
    { day: 'Tuesday', activities: ['Math Tutoring', 'Netball Practice', 'Music Lessons'] },
    { day: 'Wednesday', activities: ['Reading Club', 'Tennis Lessons', 'Drama Club'] },
    { day: 'Thursday', activities: ['Study Skills', 'Karate Club', 'Computer Club'] },
    { day: 'Friday', activities: ['Choir Practice', 'Coding Basics', 'Digital Art'] },
  ];

  const benefits = [
    {
      title: 'Extended Learning',
      description: 'Continue learning beyond school hours with structured activities.',
      icon: <TrendingUp sx={{ color: '#1a237e' }} />,
    },
    {
      title: 'Safe Environment',
      description: 'Supervised activities in a secure, nurturing environment.',
      icon: <School sx={{ color: '#ff6b35' }} />,
    },
    {
      title: 'Social Development',
      description: 'Build friendships and develop social skills through group activities.',
      icon: <EmojiPeople sx={{ color: '#2e7d32' }} />,
    },
    {
      title: 'Skill Building',
      description: 'Develop new talents and interests in various areas.',
      icon: <Star sx={{ color: '#d32f2f' }} />,
    },
  ];

  return (
    <>
      <SEO
        title="Afterschool Programme - Holy Cross Convent School Brooklyn"
        description="Discover our comprehensive afterschool programme with academic support, sports, arts, and technology activities. Safe, supervised environment for continued learning."
        keywords="afterschool programme, after school care, activities, Holy Cross Convent School, Brooklyn, Cape Town"
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
                <Schedule sx={{ fontSize: 30 }} />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  Afterschool Programme
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Extended Learning & Fun Activities
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, maxWidth: '80%' }}>
              Our comprehensive afterschool programme provides a safe, supervised environment 
              where students can continue learning, develop new skills, and have fun with 
              friends after regular school hours.
            </Typography>
            
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                icon={<AccessTime />}
                label="3:30 PM - 5:30 PM"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              />
              <Chip
                icon={<Group />}
                label="All Grades"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              />
              <Chip
                icon={<LocationOn />}
                label="On Campus"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              />
            </Stack>
          </CardContent>
        </HeroCard>

        {/* Programme Overview */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
            mb: 6,
          }}
        >
          <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 3, textAlign: 'center' }}>
            Programme Overview
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
                Structure & Times
              </Typography>
              <List>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <AccessTime sx={{ color: '#1a237e' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Monday to Friday"
                    secondary="3:30 PM - 5:30 PM"
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <Group sx={{ color: '#1a237e' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Supervised Activities"
                    secondary="Qualified teachers and instructors"
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#1a237e' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Flexible Attendance"
                    secondary="Choose activities that suit your child"
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
                Programme Benefits
              </Typography>
              <List>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <Star sx={{ color: '#ffd700' }} />
                  </ListItemIcon>
                  <ListItemText primary="Academic support and homework help" />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <Star sx={{ color: '#ffd700' }} />
                  </ListItemIcon>
                  <ListItemText primary="Physical fitness and sports development" />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <Star sx={{ color: '#ffd700' }} />
                  </ListItemIcon>
                  <ListItemText primary="Creative arts and cultural activities" />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <Star sx={{ color: '#ffd700' }} />
                  </ListItemIcon>
                  <ListItemText primary="Technology and digital skills" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>

        {/* Activities by Category */}
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Activities by Category
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {activities.map((category, index) => (
            <Grid item xs={12} md={6} key={index}>
              <ActivityCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    {category.icon}
                    <Typography variant="h5" sx={{ ml: 2, color: category.color, fontWeight: 600 }}>
                      {category.category}
                    </Typography>
                  </Box>
                  
                  <List dense>
                    {category.items.map((item, idx) => (
                      <ListItem key={idx} sx={{ py: 1, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                        <ListItemIcon sx={{ minWidth: '32px' }}>
                          <CheckCircle sx={{ fontSize: 16, color: category.color }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name}
                          secondary={
                            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                              <Chip
                                label={item.time}
                                size="small"
                                sx={{
                                  bgcolor: `${category.color}15`,
                                  color: category.color,
                                  fontSize: '0.7rem',
                                }}
                              />
                              <Chip
                                label={item.age}
                                size="small"
                                sx={{
                                  bgcolor: `${category.color}10`,
                                  color: category.color,
                                  fontSize: '0.7rem',
                                }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </ActivityCard>
            </Grid>
          ))}
        </Grid>

        {/* Weekly Schedule */}
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Weekly Schedule
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: '20px', mb: 6 }}>
          <Grid container spacing={2}>
            {schedule.map((day, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    border: '2px solid rgba(26, 35, 126, 0.1)',
                    borderRadius: '12px',
                    '&:hover': {
                      borderColor: '#1a237e',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
                      {day.day}
                    </Typography>
                    <List dense>
                      {day.activities.map((activity, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: '20px' }}>
                            <Star sx={{ fontSize: 12, color: '#ffd700' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={activity}
                            primaryTypographyProps={{ fontSize: '0.8rem' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Benefits */}
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Why Choose Our Programme?
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(26, 35, 126, 0.1)',
                    width: 60,
                    height: 60,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {benefit.icon}
                </Avatar>
                <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 1 }}>
                  {benefit.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  {benefit.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Registration & Fees */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #f8f9ff 100%)',
          }}
        >
          <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 3, textAlign: 'center' }}>
            Registration & Fees
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
                Monthly Fees
              </Typography>
              <List>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary="Full Programme (5 days/week)"
                    secondary="R800 per month"
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary="3 Days per week"
                    secondary="R550 per month"
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary="Individual Activities"
                    secondary="R150 per activity per month"
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
                Registration Process
              </Typography>
              <List>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#1a237e', fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText primary="Complete registration form" />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#1a237e', fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText primary="Pay registration fee (R200)" />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#1a237e', fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText primary="Select preferred activities" />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#1a237e', fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText primary="Start attending from next Monday" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#1a237e',
                borderRadius: '25px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#0d47a1',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Register Now
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Afterschool;
