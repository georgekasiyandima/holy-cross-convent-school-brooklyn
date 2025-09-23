import React, { useState } from 'react';
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  Construction,
  School,
  Home,
  People,
  TrendingUp,
  CalendarToday,
  LocationOn,
  AttachMoney,
  Visibility,
  Close,
  CheckCircle,
  Schedule,
  Star
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import SEO from '../components/SEO';

// Styled components
const ProjectCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  backgroundColor: 
    status === 'completed' ? '#4caf50' :
    status === 'in-progress' ? '#ff9800' :
    status === 'planned' ? '#2196f3' : '#f44336',
  color: 'white',
  fontWeight: 600,
  '& .MuiChip-label': {
    color: 'white',
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(135, 206, 235, 0.2)',
  color: '#1a237e',
  fontWeight: 500,
  border: '1px solid rgba(135, 206, 235, 0.3)',
}));

// Project data
const projectsData = {
  current: [
    {
      id: 1,
      title: 'Computer Lab Upgrade',
      description: 'Modernizing our computer laboratory with the latest technology to enhance digital learning experiences.',
      category: 'Infrastructure',
      status: 'in-progress',
      progress: 75,
      startDate: '2024-01-15',
      endDate: '2024-09-30',
      budget: 50000,
      image: '/COMPUTERLAB.jpg',
      details: {
        objectives: [
          'Install 30 new desktop computers',
          'Upgrade network infrastructure',
          'Implement digital learning software',
          'Train staff on new systems'
        ],
        impact: 'Will benefit 200+ students annually',
        team: ['IT Department', 'Academic Staff', 'External Contractors']
      }
    },
    {
      id: 2,
      title: 'Library Renovation',
      description: 'Transforming our library into a modern learning hub with digital resources and collaborative spaces.',
      category: 'Infrastructure',
      status: 'in-progress',
      progress: 45,
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      budget: 35000,
      image: '/BOOKDAY.jpg',
      details: {
        objectives: [
          'Create modern reading spaces',
          'Install digital catalog system',
          'Add multimedia stations',
          'Improve lighting and acoustics'
        ],
        impact: 'Enhanced learning environment for all students',
        team: ['Library Staff', 'Maintenance Team', 'Design Consultants']
      }
    },
    {
      id: 3,
      title: 'Sports Equipment Upgrade',
      description: 'Providing quality sports equipment and facilities to promote physical education and student wellness.',
      category: 'Sports',
      status: 'in-progress',
      progress: 60,
      startDate: '2024-02-15',
      endDate: '2024-10-15',
      budget: 15000,
      image: '/Sports01.jpg',
      details: {
        objectives: [
          'Purchase new sports equipment',
          'Upgrade gymnasium facilities',
          'Install outdoor fitness equipment',
          'Train PE staff on new equipment'
        ],
        impact: 'Improved physical education for 300+ students',
        team: ['PE Department', 'Sports Committee', 'Equipment Suppliers']
      }
    }
  ],
  planned: [
    {
      id: 4,
      title: 'Science Lab Expansion',
      description: 'Expanding our science facilities to accommodate growing STEM interest and modern curriculum requirements.',
      category: 'Academic',
      status: 'planned',
      progress: 0,
      startDate: '2025-01-15',
      endDate: '2025-08-31',
      budget: 80000,
      image: '/SCIENCEEXPO24.jpg',
      details: {
        objectives: [
          'Add new laboratory space',
          'Install modern science equipment',
          'Create STEM learning centers',
          'Develop science curriculum enhancements'
        ],
        impact: 'Enhanced STEM education for future students',
        team: ['Science Department', 'Curriculum Team', 'Architects']
      }
    },
    {
      id: 5,
      title: 'Music Program Enhancement',
      description: 'Enhancing our music program with new instruments, dedicated spaces, and expanded curriculum offerings.',
      category: 'Arts',
      status: 'planned',
      progress: 0,
      startDate: '2025-03-01',
      endDate: '2025-11-30',
      budget: 25000,
      image: '/MUSIC.jpg',
      details: {
        objectives: [
          'Purchase new musical instruments',
          'Create dedicated practice rooms',
          'Expand music curriculum',
          'Organize performance opportunities'
        ],
        impact: 'Enriched arts education and cultural development',
        team: ['Music Department', 'Arts Committee', 'Music Educators']
      }
    },
    {
      id: 6,
      title: 'Community Garden Project',
      description: 'Creating a community garden to teach environmental stewardship and provide hands-on learning opportunities.',
      category: 'Environmental',
      status: 'planned',
      progress: 0,
      startDate: '2025-04-01',
      endDate: '2025-12-31',
      budget: 12000,
      image: '/Garden Club 04.jpg',
      details: {
        objectives: [
          'Design and build garden spaces',
          'Install irrigation systems',
          'Create educational programs',
          'Establish maintenance protocols'
        ],
        impact: 'Environmental education and community engagement',
        team: ['Environmental Club', 'Maintenance Staff', 'Garden Experts']
      }
    }
  ],
  completed: [
    {
      id: 7,
      title: 'School Security Enhancement',
      description: 'Implemented comprehensive security measures to ensure the safety of our students and staff.',
      category: 'Safety',
      status: 'completed',
      progress: 100,
      startDate: '2023-08-01',
      endDate: '2023-12-31',
      budget: 30000,
      image: '/HCLOGO1.png',
      details: {
        objectives: [
          'Install security cameras',
          'Implement access control systems',
          'Train staff on security protocols',
          'Establish emergency response procedures'
        ],
        impact: 'Enhanced safety for all school community members',
        team: ['Security Team', 'Administration', 'Safety Consultants']
      }
    },
    {
      id: 8,
      title: 'Classroom Technology Integration',
      description: 'Successfully integrated modern technology into all classrooms to enhance teaching and learning.',
      category: 'Technology',
      status: 'completed',
      progress: 100,
      startDate: '2023-09-01',
      endDate: '2024-01-31',
      budget: 40000,
      image: '/COMPUTERLAB.jpg',
      details: {
        objectives: [
          'Install smart boards in all classrooms',
          'Provide tablets for students',
          'Implement digital learning platforms',
          'Train teachers on new technology'
        ],
        impact: 'Modernized learning environment for all students',
        team: ['IT Department', 'Teaching Staff', 'Technology Trainers']
      }
    },
    {
      id: 9,
      title: 'Playground Renovation',
      description: 'Renovated and modernized our playground facilities to provide safe and engaging outdoor spaces.',
      category: 'Infrastructure',
      status: 'completed',
      progress: 100,
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      budget: 20000,
      image: '/Sports02.jpg',
      details: {
        objectives: [
          'Install new playground equipment',
          'Improve safety surfaces',
          'Create age-appropriate play areas',
          'Add shade structures'
        ],
        impact: 'Safe and engaging outdoor play spaces',
        team: ['Maintenance Team', 'Safety Committee', 'Playground Specialists']
      }
    }
  ]
};

const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProject(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'in-progress': return '#ff9800';
      case 'planned': return '#2196f3';
      default: return '#f44336';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'in-progress': return <TrendingUp />;
      case 'planned': return <Schedule />;
      default: return <Construction />;
    }
  };

  const renderProjectCard = (project: any) => (
    <Box sx={{ flex: '1 1 350px', minWidth: 0 }} key={project.id}>
      <ProjectCard onClick={() => handleProjectClick(project)}>
        <CardMedia
          component="img"
          height="200"
          image={project.image}
          alt={project.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <StatusChip 
              label={project.status.replace('-', ' ')} 
              size="small" 
              status={project.status}
              icon={getStatusIcon(project.status)}
            />
            <CategoryChip label={project.category} size="small" sx={{ ml: 1 }} />
          </Box>
          
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
            {project.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {project.description}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {project.progress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={project.progress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'rgba(135, 206, 235, 0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getStatusColor(project.status)
                }
              }} 
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoney sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                ${project.budget.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </ProjectCard>
    </Box>
  );

  const getCurrentProjects = () => {
    switch (activeTab) {
      case 0: return projectsData.current;
      case 1: return projectsData.planned;
      case 2: return projectsData.completed;
      default: return [];
    }
  };

  return (
    <>
      <SEO 
        title="Projects - Holy Cross Convent School"
        description="Explore current, planned, and completed projects at Holy Cross Convent School Brooklyn. See how we're improving our facilities and programs."
        keywords="school projects, infrastructure, technology, education, Holy Cross Convent School"
      />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ color: '#1a237e', fontWeight: 700, mb: 2 }}>
            Our Projects
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Discover how we're continuously improving our school facilities, programs, and learning environment 
            to provide the best educational experience for our students.
          </Typography>
        </Box>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ 
              bgcolor: '#1a237e',
              '& .MuiTab-root': {
                color: 'white',
                fontWeight: 600,
                '&.Mui-selected': {
                  color: '#ffd700'
                }
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#ffd700'
              }
            }}
          >
            <Tab label="Current Projects" />
            <Tab label="Planned Projects" />
            <Tab label="Completed Projects" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {getCurrentProjects().map(renderProjectCard)}
            </Box>
          </Box>
        </Paper>

        {/* Project Details Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          {selectedProject && (
            <>
              <DialogTitle sx={{ 
                bgcolor: '#1a237e', 
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {selectedProject.title}
                </Typography>
                <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                  <Close />
                </IconButton>
              </DialogTitle>
              
              <DialogContent sx={{ pt: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.title}
                      style={{ 
                        width: '100%', 
                        height: 250, 
                        objectFit: 'cover',
                        borderRadius: 8
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <CategoryChip label={selectedProject.category} />
                        <StatusChip 
                          label={selectedProject.status.replace('-', ' ')} 
                          status={selectedProject.status}
                          icon={getStatusIcon(selectedProject.status)}
                        />
                      </Box>
                      
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {selectedProject.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarToday sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(selectedProject.startDate).toLocaleDateString()} - {new Date(selectedProject.endDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachMoney sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            Budget: ${selectedProject.budget.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Progress: {selectedProject.progress}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedProject.progress} 
                          sx={{ 
                            height: 10, 
                            borderRadius: 5,
                            backgroundColor: 'rgba(135, 206, 235, 0.2)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getStatusColor(selectedProject.status)
                            }
                          }} 
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ width: '100%' }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                    Project Objectives
                  </Typography>
                  <List dense>
                    {selectedProject.details.objectives.map((objective: string, index: number) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Star sx={{ fontSize: 16, color: '#ffd700' }} />
                        </ListItemIcon>
                        <ListItemText primary={objective} />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 3 }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                        Expected Impact
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedProject.details.impact}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                        Project Team
                      </Typography>
                      <List dense>
                        {selectedProject.details.team.map((member: string, index: number) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <People sx={{ fontSize: 16, color: '#1a237e' }} />
                            </ListItemIcon>
                            <ListItemText primary={member} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Box>
                </Box>
              </DialogContent>
              
              <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button onClick={handleCloseDialog} variant="outlined">
                  Close
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<Visibility />}
                  sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}
                >
                  View Updates
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </>
  );
};

export default Projects;
