import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  useTheme, 
  Chip, 
  Avatar, 
  Tabs, 
  Tab,
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  School, 
  Person, 
  Support, 
  AdminPanelSettings,
  Grade,
  MusicNote,
  Computer,
  LibraryBooks,
  ChildCare,
  Business,
  Email,
  Phone,
  PlayArrow,
  Close,
  Facebook,
  School as SchoolIcon,
  VideoLibrary
} from '@mui/icons-material';
import { videoManager, SchoolVideo } from '../utils/videoManager';

// Staff data organized by categories
const staffData = {
  leadership: [
    {
      name: 'Mrs Du Plessis',
      role: 'School Principal',
      grade: 'Grade 7',
      icon: <School sx={{ color: '#1a237e' }} />,
      email: 'principal@holycrossbrooklyn.edu',
      phone: '(021) 511 4337',
      bio: 'Leading our school with dedication and vision.',
    }
  ],
  teaching: [
    {
      name: 'Sr Eileen',
      role: 'Religious Education Junior School',
      icon: <Person sx={{ color: '#1a237e' }} />,
      email: 're@holycrossbrooklyn.edu',
      bio: 'Nurturing faith and spiritual development.',
      phone: undefined,
    },
    {
      name: 'Mrs Petersen',
      role: 'Pre-Grade R',
      icon: <ChildCare sx={{ color: '#ffd700' }} />,
      email: 'petersen@holycrossbrooklyn.edu',
      bio: 'Laying the foundation for early learning.',
      phone: undefined,
    },
    {
      name: 'Mrs Perumal',
      role: 'Grade R',
      icon: <Grade sx={{ color: '#ffd700' }} />,
      email: 'perumal@holycrossbrooklyn.edu',
      bio: 'Preparing students for primary education.',
      phone: undefined,
    },
    {
      name: 'Ms Du Preez',
      role: 'Grade 1',
      icon: <Grade sx={{ color: '#1a237e' }} />,
      email: 'dupreez@holycrossbrooklyn.edu',
      bio: 'Building strong academic foundations.',
      phone: undefined,
    },
    {
      name: 'Ms Daniels',
      role: 'Grade 2',
      icon: <Grade sx={{ color: '#1a237e' }} />,
      email: 'daniels@holycrossbrooklyn.edu',
      bio: 'Developing critical thinking skills.',
      phone: undefined,
    },
    {
      name: 'Mrs Kendall',
      role: 'Grade 3',
      icon: <Grade sx={{ color: '#1a237e' }} />,
      email: 'kendall@holycrossbrooklyn.edu',
      bio: 'Encouraging independent learning.',
      phone: undefined,
    },
    {
      name: 'Mrs Manjengwa',
      role: 'Grade 4',
      icon: <Grade sx={{ color: '#1a237e' }} />,
      email: 'manjengwa@holycrossbrooklyn.edu',
      bio: 'Preparing for intermediate phase.',
      phone: undefined,
    },
    {
      name: 'Mr Goldman',
      role: 'Grade 5',
      icon: <Grade sx={{ color: '#1a237e' }} />,
      email: 'goldman@holycrossbrooklyn.edu',
      bio: 'Building advanced academic skills.',
      phone: undefined,
    },
    {
      name: 'Mr Saidi',
      role: 'Grade 6',
      icon: <Grade sx={{ color: '#1a237e' }} />,
      email: 'saidi@holycrossbrooklyn.edu',
      bio: 'Preparing for senior primary.',
      phone: undefined,
    },
    {
      name: 'Mrs McLeod',
      role: 'RE Coordinator / Learner Support',
      icon: <Support sx={{ color: '#1a237e' }} />,
      email: 'mcleod@holycrossbrooklyn.edu',
      bio: 'Supporting students\' spiritual and academic growth.',
      phone: undefined,
    },
    {
      name: 'Mrs Eriksen',
      role: 'IsiXhosa',
      icon: <Person sx={{ color: '#ffd700' }} />,
      email: 'eriksen@holycrossbrooklyn.edu',
      bio: 'Teaching our indigenous language with passion.',
      phone: undefined,
    },
    {
      name: 'Ms Mitchell',
      role: 'English / Afrikaans',
      icon: <Person sx={{ color: '#ffd700' }} />,
      email: 'mitchell@holycrossbrooklyn.edu',
      bio: 'Developing language skills in multiple languages.',
      phone: undefined,
    },
    {
      name: 'Mrs Malander',
      role: 'Afrikaans',
      icon: <Person sx={{ color: '#ffd700' }} />,
      email: 'malander@holycrossbrooklyn.edu',
      bio: 'Teaching Afrikaans language and culture.',
      phone: undefined,
    },
    {
      name: 'Mr Thelen',
      role: 'Computer Studies Senior Primary / Music Senior Primary',
      icon: <Computer sx={{ color: '#ffd700' }} />,
      email: 'thelen@holycrossbrooklyn.edu',
      bio: 'Integrating technology and music education.',
      phone: undefined,
    },
    {
      name: 'Mrs De Sousa',
      role: 'Computer Studies Junior Primary',
      icon: <Computer sx={{ color: '#ffd700' }} />,
      email: 'desousa@holycrossbrooklyn.edu',
      bio: 'Introducing technology to young learners.',
      phone: undefined,
    }
  ],
  support: [
    {
      name: 'Mrs Peters',
      role: 'Librarian & Fundraising Coordinator',
      icon: <LibraryBooks sx={{ color: '#1a237e' }} />,
      email: 'peters@holycrossbrooklyn.edu',
      bio: 'Managing our library and fundraising initiatives.',
      phone: undefined,
    },
    {
      name: 'Mrs Faulmann',
      role: 'Aftercare Supervisor',
      icon: <ChildCare sx={{ color: '#1a237e' }} />,
      email: 'faulmann@holycrossbrooklyn.edu',
      bio: 'Providing safe and engaging aftercare services.',
      phone: undefined,
    },
    {
      name: 'Mrs Slabbert',
      role: 'School Secretary',
      icon: <AdminPanelSettings sx={{ color: '#1a237e' }} />,
      email: 'slabbert@holycrossbrooklyn.edu',
      bio: 'Managing school administration and communications.',
      phone: undefined,
    },
    {
      name: 'Mrs Afonso',
      role: 'Bursar',
      icon: <Business sx={{ color: '#1a237e' }} />,
      email: 'afonso@holycrossbrooklyn.edu',
      bio: 'Managing school finances and budgeting.',
      phone: undefined,
    },
    {
      name: 'Mrs Lennox',
      role: 'Assistant Bursar',
      icon: <Business sx={{ color: '#1a237e' }} />,
      email: 'lennox@holycrossbrooklyn.edu',
      bio: 'Supporting financial management and administration.',
      phone: undefined,
    }
  ]
};

const StaffCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
  border: '1px solid #e0e0e0',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}));

const VideoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 0,
  paddingBottom: '56.25%', // 16:9 aspect ratio
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  boxShadow: theme.shadows[4],
  '& iframe': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none'
  }
}));

const VideoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}));

const VideoThumbnail = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 0,
  paddingBottom: '56.25%',
  backgroundColor: '#f5f5f5',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  '& .play-button': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(26, 35, 126, 0.9)',
    color: 'white',
    borderRadius: '50%',
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#ffd700',
      color: '#1a237e',
      transform: 'translate(-50%, -50%) scale(1.1)'
    }
  }
}));

const LeadershipCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
  borderLeft: `6px solid #ffd700`,
  boxShadow: theme.shadows[3],
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[10],
    borderLeftColor: '#1a237e',
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`staff-tabpanel-${index}`}
      aria-labelledby={`staff-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Staff: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<SchoolVideo | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  // Get professional development videos
  const professionalDevVideos = videoManager.getVideosByCategory('professional-development');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleVideoClick = (video: SchoolVideo) => {
    setSelectedVideo(video);
    setVideoDialogOpen(true);
  };

  const handleCloseVideo = () => {
    setVideoDialogOpen(false);
    setSelectedVideo(null);
  };

  const renderStaffGrid = (staffList: typeof staffData.teaching) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 3,
      }}
    >
      {staffList.map((staff, index) => (
        <StaffCard key={index}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                bgcolor: '#1a237e',
                fontSize: '2rem',
              }}
            >
              {staff.icon}
            </Avatar>
            <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
              {staff.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 2, fontWeight: 500 }}>
              {staff.role}
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', mb: 2, fontSize: '0.875rem' }}>
              {staff.bio}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<Email sx={{ fontSize: 16 }} />}
                label="Email"
                size="small"
                variant="outlined"
                sx={{ borderColor: '#ffd700', color: '#1a237e' }}
              />
              {staff.phone && (
                <Chip
                  icon={<Phone sx={{ fontSize: 16 }} />}
                  label="Phone"
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: '#ffd700', color: '#1a237e' }}
                />
              )}
            </Box>
          </CardContent>
        </StaffCard>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" sx={{ color: '#1a237e', fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          Our Staff
        </Typography>
        <Divider sx={{ bgcolor: '#ffd700', height: 4, width: 80, mx: 'auto', mb: 3 }} />
        <Typography variant="h6" sx={{ color: '#555', maxWidth: 800, mx: 'auto', mb: 4 }}>
          Meet our dedicated team of educators and support staff who are committed to nurturing excellence, 
          building character, and inspiring faith in our students.
        </Typography>
        <Chip 
          label="2023 Academic Year" 
          color="primary" 
          variant="outlined"
          sx={{ fontWeight: 600, borderColor: '#ffd700' }}
        />
      </Box>

      {/* Leadership Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ color: '#1a237e', fontWeight: 700, mb: 3, textAlign: 'center' }}>
          School Leadership
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(300px, 1fr))' },
            gap: 3,
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          {staffData.leadership.map((staff, index) => (
            <LeadershipCard key={index}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mx: 'auto',
                    mb: 3,
                    bgcolor: '#ffd700',
                    fontSize: '2.5rem',
                    color: '#1a237e',
                  }}
                >
                  {staff.icon}
                </Avatar>
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
                  {staff.name}
                </Typography>
                <Typography variant="h6" sx={{ color: '#ffd700', fontWeight: 600, mb: 2 }}>
                  {staff.role}
                </Typography>
                {staff.grade && (
                  <Chip 
                    label={staff.grade} 
                    color="secondary" 
                    variant="outlined"
                    sx={{ mb: 2, borderColor: '#1a237e' }}
                  />
                )}
                <Typography variant="body1" sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
                  {staff.bio}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<Email sx={{ fontSize: 16 }} />}
                    label="Email"
                    variant="outlined"
                    sx={{ borderColor: '#ffd700', color: '#1a237e' }}
                  />
                  <Chip
                    icon={<Phone sx={{ fontSize: 16 }} />}
                    label="Phone"
                    variant="outlined"
                    sx={{ borderColor: '#ffd700', color: '#1a237e' }}
                  />
                </Box>
              </CardContent>
            </LeadershipCard>
          ))}
        </Box>
      </Box>

      {/* Tabs for Teaching and Support Staff */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="staff tabs"
            sx={{
              '& .MuiTab-root': {
                color: '#666',
                fontWeight: 600,
                fontSize: '1.1rem',
                '&.Mui-selected': {
                  color: '#1a237e',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#ffd700',
                height: 3,
              },
            }}
          >
            <Tab label="Teaching Staff" />
            <Tab label="Support Staff" />
            <Tab label="Professional Development" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
            Teaching Staff
          </Typography>
          {renderStaffGrid(staffData.teaching)}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
            Support Staff
          </Typography>
          {renderStaffGrid(staffData.support)}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
            Professional Development
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', mb: 6, textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            Our staff continuously engage in professional development to enhance their teaching skills and stay current with educational best practices. 
            Here are some highlights from our training sessions and workshops.
          </Typography>
          
          {professionalDevVideos.length > 0 ? (
            <Box>
              {/* Featured Professional Development Video */}
              <Card sx={{ mb: 6, boxShadow: 4, background: 'linear-gradient(135deg, #e3eafc 0%, #fffde7 100%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SchoolIcon sx={{ color: '#ffd700', fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700 }}>
                        {professionalDevVideos[0].title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#555' }}>
                        {professionalDevVideos[0].description}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <VideoContainer>
                    <div dangerouslySetInnerHTML={{ __html: professionalDevVideos[0].embedCode }} />
                  </VideoContainer>
                  
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Facebook />}
                      href={professionalDevVideos[0].facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        borderColor: '#1a237e',
                        color: '#1a237e',
                        '&:hover': {
                          borderColor: '#ffd700',
                          backgroundColor: '#fffde7'
                        }
                      }}
                    >
                      View on Facebook
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Additional Professional Development Videos */}
              {professionalDevVideos.length > 1 && (
                <>
                  <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 4, textAlign: 'center' }}>
                    More Training Sessions
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                    gap: 3 
                  }}>
                    {professionalDevVideos.slice(1).map((video) => (
                      <Box key={video.id}>
                        <VideoCard onClick={() => handleVideoClick(video)}>
                          <CardContent>
                            <VideoThumbnail>
                              <div className="play-button">
                                <PlayArrow sx={{ fontSize: 30 }} />
                              </div>
                            </VideoThumbnail>
                            <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mt: 2, mb: 1 }}>
                              {video.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555', mb: 2 }}>
                              {video.description}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Chip 
                                label="Professional Development" 
                                size="small" 
                                color="secondary" 
                                variant="outlined"
                              />
                              {video.date && (
                                <Chip 
                                  label={video.date} 
                                  size="small" 
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          </CardContent>
                        </VideoCard>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <VideoLibrary sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                No Professional Development Videos Available
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Professional development videos will be added as they become available.
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Box>

      {/* Footer Note */}
      <Box sx={{ textAlign: 'center', mt: 8, color: '#aaa' }}>
        <Typography variant="body2">
          <em>Staff photos and detailed biographies will be added as they become available. 
          For contact information, please use the email addresses provided or contact the school office.</em>
        </Typography>
      </Box>

      {/* Video Dialog */}
      <Dialog
        open={videoDialogOpen}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
              {selectedVideo?.title}
            </Typography>
            <IconButton onClick={handleCloseVideo}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedVideo && (
            <>
              <Typography variant="body2" sx={{ color: '#555', mb: 3 }}>
                {selectedVideo.description}
              </Typography>
              
              <VideoContainer>
                <div dangerouslySetInnerHTML={{ __html: selectedVideo.embedCode }} />
              </VideoContainer>
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<Facebook />}
                  href={selectedVideo.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderColor: '#1a237e',
                    color: '#1a237e',
                    '&:hover': {
                      borderColor: '#ffd700',
                      backgroundColor: '#fffde7'
                    }
                  }}
                >
                  View on Facebook
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Staff; 