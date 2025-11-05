import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Avatar,
  Divider,
  Stack,
  Grid,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Link,
  Breadcrumbs
} from '@mui/material';
import {
  Visibility,
  Edit,
  CheckCircle,
  Cancel,
  Person,
  Email,
  Phone,
  Home,
  School,
  Work,
  Group,
  Church,
  Description,
  Download,
  Upload,
  FilterList,
  Search,
  Refresh,
  Assignment,
  TrendingUp,
  People,
  Grade,
  CalendarToday,
  ExpandMore,
  AttachFile,
  CheckCircleOutline,
  Warning,
  Info
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AdminLayout from '../components/AdminLayout';
import { API_BASE_URL_WITH_PREFIX } from '../services/apiConfig';
import axios from 'axios';

// ========================================
// TYPE DEFINITIONS
// ========================================

interface Application {
  id: number;
  // Learner Information
  surname: string;
  christianName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gradeApplying: string;
  year: string;
  lastGradePassed?: string;
  hasRepeated: boolean;
  repeatedGrade?: string;
  
  // Mother's Information
  motherFullName: string;
  motherAddress: string;
  motherHomePhone?: string;
  motherWorkPhone?: string;
  motherCellPhone: string;
  
  // Father's Information
  fatherFullName: string;
  fatherAddress: string;
  fatherHomePhone?: string;
  fatherWorkPhone?: string;
  fatherCellPhone: string;
  
  // Responsible Party
  responsiblePartyName?: string;
  responsiblePartyAddress?: string;
  responsiblePartyRelationship?: string;
  responsiblePartyHomePhone?: string;
  responsiblePartyWorkPhone?: string;
  responsiblePartyCellPhone?: string;
  
  // Learner Address
  learnerAddress?: string;
  
  // Religious Information
  religiousDenomination?: string;
  isBaptised: boolean;
  parishChurch?: string;
  refugeeStatus: boolean;
  homeLanguage?: string;
  
  // Family Information
  numberOfChildren?: string;
  childrenAges?: string;
  siblingsAtHolyCross: boolean;
  siblingName?: string;
  siblingGrade?: string;
  
  // Employment Details
  motherOccupation?: string;
  motherPlaceOfEmployment?: string;
  motherWorkTel?: string;
  motherWorkCell?: string;
  motherEmail?: string;
  
  fatherOccupation?: string;
  fatherPlaceOfEmployment?: string;
  fatherWorkTel?: string;
  fatherWorkCell?: string;
  fatherEmail?: string;
  
  responsiblePartyOccupation?: string;
  responsiblePartyPlaceOfEmployment?: string;
  responsiblePartyWorkTel?: string;
  responsiblePartyWorkCell?: string;
  responsiblePartyEmail?: string;
  
  selfEmployedDetails?: string;
  maritalStatus?: string;
  
  // Current School Information
  currentSchool?: string;
  currentSchoolAddress?: string;
  currentSchoolTel?: string;
  currentSchoolContact?: string;
  
  // Payment Method
  paymentMethod?: string;
  
  // Application Status
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ENROLLED';
  notes?: string;
  
  // Timestamps
  submittedAt: string;
  updatedAt: string;
  
  // Documents
  documents?: ApplicationDocument[];
}

interface ApplicationDocument {
  id: number;
  fileName: string;
  originalName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  uploadedAt: string;
}

interface ApplicationStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  enrolledApplications: number;
  gradeDistribution: Array<{
    gradeApplying: string;
    _count: { gradeApplying: number };
  }>;
}

// ========================================
// STYLED COMPONENTS
// ========================================

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  borderRadius: 16,
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid #e2e8f0',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  }
}));

const ApplicationCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    borderColor: '#1a237e'
  }
}));

const StatusChip = styled(Chip)<{ status: string }>(({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' };
      case 'UNDER_REVIEW': return { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' };
      case 'APPROVED': return { bg: '#d4edda', color: '#155724', border: '#c3e6cb' };
      case 'REJECTED': return { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' };
      case 'ENROLLED': return { bg: '#e2e3e5', color: '#383d41', border: '#d6d8db' };
      default: return { bg: '#f8f9fa', color: '#6c757d', border: '#dee2e6' };
    }
  };
  
  const colors = getStatusColor(status);
  
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    border: `1px solid ${colors.border}`,
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 28
  };
});

// ========================================
// MAIN COMPONENT
// ========================================

const AdminApplicationManagement: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [tabValue, setTabValue] = useState(0);

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  const filterApplications = useCallback(() => {
    if (!Array.isArray(applications)) {
      setFilteredApplications([]);
      return;
    }

    let filtered = applications;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.surname.toLowerCase().includes(term) ||
        app.christianName.toLowerCase().includes(term) ||
        app.motherFullName.toLowerCase().includes(term) ||
        app.fatherFullName.toLowerCase().includes(term) ||
        app.gradeApplying.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Grade filter
    if (gradeFilter !== 'ALL') {
      filtered = filtered.filter(app => app.gradeApplying === gradeFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, gradeFilter]);

  // ========================================
  // EFFECTS
  // ========================================

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [filterApplications]);

  // ========================================
  // API FUNCTIONS
  // ========================================

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL_WITH_PREFIX}/admissions/applications`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });
      
      // Backend returns { success: true, applications: [...] }
      if (response.data.success && Array.isArray(response.data.applications)) {
        setApplications(response.data.applications);
      } else if (Array.isArray(response.data)) {
        // Fallback if response is directly an array
        setApplications(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setApplications([]);
        setError('Invalid response format from server');
      }
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.message || 'Failed to load applications. Please check your connection and try again.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL_WITH_PREFIX}/admissions/statistics`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });
      
      // Backend returns { success: true, statistics: {...} }
      if (response.data.success && response.data.statistics) {
        setStats(response.data.statistics);
      } else if (response.data.statistics) {
        setStats(response.data.statistics);
      } else {
        console.error('Unexpected stats response format:', response.data);
      }
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      // Stats are not critical, so we don't show error to user
    }
  };

  const updateApplicationStatus = async (applicationId: number, status: string, notes?: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${API_BASE_URL_WITH_PREFIX}/admissions/applications/${applicationId}`, {
        status,
        notes
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: status as any, notes: notes || app.notes }
          : app
      ));
      
      setStatusDialogOpen(false);
      setSelectedApplication(null);
      setNewStatus('');
      setNotes('');
    } catch (err) {
      console.error('Error updating application status:', err);
      setError('Failed to update application status');
    }
  };

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };

  const handleStatusChange = (application: Application) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setNotes(application.notes || '');
    setStatusDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Warning color="warning" />;
      case 'UNDER_REVIEW': return <Info color="info" />;
      case 'APPROVED': return <CheckCircle color="success" />;
      case 'REJECTED': return <Cancel color="error" />;
      case 'ENROLLED': return <CheckCircleOutline color="action" />;
      default: return <Info color="action" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ========================================
  // RENDER FUNCTIONS
  // ========================================

  const renderStatsCards = () => {
    if (!stats) return null;

    const statItems = [
      {
        title: 'Total Applications',
        value: stats.totalApplications,
        icon: <Assignment sx={{ fontSize: 32, color: '#1a237e' }} />,
        color: '#1a237e'
      },
      {
        title: 'Pending Review',
        value: stats.pendingApplications,
        icon: <Warning sx={{ fontSize: 32, color: '#f59e0b' }} />,
        color: '#f59e0b'
      },
      {
        title: 'Approved',
        value: stats.approvedApplications,
        icon: <CheckCircle sx={{ fontSize: 32, color: '#10b981' }} />,
        color: '#10b981'
      },
      {
        title: 'Enrolled',
        value: stats.enrolledApplications,
        icon: <People sx={{ fontSize: 32, color: '#8b5cf6' }} />,
        color: '#8b5cf6'
      }
    ];

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statItems.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {stat.title}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderFilters = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: '#6b7280' }} />
            }}
            sx={{ minWidth: 250 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="ALL">All Status</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
              <MenuItem value="ENROLLED">Enrolled</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Grade</InputLabel>
            <Select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              label="Grade"
            >
              <MenuItem value="ALL">All Grades</MenuItem>
              <MenuItem value="Grade R">Grade R</MenuItem>
              <MenuItem value="Grade 1">Grade 1</MenuItem>
              <MenuItem value="Grade 2">Grade 2</MenuItem>
              <MenuItem value="Grade 3">Grade 3</MenuItem>
              <MenuItem value="Grade 4">Grade 4</MenuItem>
              <MenuItem value="Grade 5">Grade 5</MenuItem>
              <MenuItem value="Grade 6">Grade 6</MenuItem>
              <MenuItem value="Grade 7">Grade 7</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchApplications}
            sx={{ ml: 'auto' }}
          >
            Refresh
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderApplicationsTable = () => (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Grade</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Parents</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Submitted</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredApplications) && filteredApplications.map((application) => (
                <TableRow key={application.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {application.christianName} {application.surname}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        DOB: {formatDate(application.dateOfBirth)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={application.gradeApplying}
                      size="small"
                      sx={{ 
                        bgcolor: '#d32f2f',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {application.motherFullName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {application.motherCellPhone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      label={application.status.replace('_', ' ')}
                      status={application.status}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(application.submittedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewApplication(application)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Update Status">
                        <IconButton
                          size="small"
                          onClick={() => handleStatusChange(application)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {(!Array.isArray(filteredApplications) || filteredApplications.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ color: '#6b7280' }}>
                      {loading ? 'Loading applications...' : 'No applications found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderApplicationDetails = () => {
    if (!selectedApplication) return null;

    return (
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person sx={{ color: '#1a237e' }} />
            <Box>
              <Typography variant="h6">
                {selectedApplication.christianName} {selectedApplication.surname}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Application #{selectedApplication.id}
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <StatusChip
                label={selectedApplication.status.replace('_', ' ')}
                status={selectedApplication.status}
              />
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Learner Info" />
            <Tab label="Parent Info" />
            <Tab label="Family & Religious" />
            <Tab label="School & Employment" />
            <Tab label="Documents" />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>Learner Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Full Name:</Typography>
                    <Typography variant="body2">{selectedApplication.christianName} {selectedApplication.surname}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Date of Birth:</Typography>
                    <Typography variant="body2">{formatDate(selectedApplication.dateOfBirth)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Place of Birth:</Typography>
                    <Typography variant="body2">{selectedApplication.placeOfBirth}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Grade Applying:</Typography>
                    <Typography variant="body2">{selectedApplication.gradeApplying}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Year:</Typography>
                    <Typography variant="body2">{selectedApplication.year}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Last Grade Passed:</Typography>
                    <Typography variant="body2">{selectedApplication.lastGradePassed || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>Parent Information</Typography>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Mother's Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Full Name:</Typography>
                        <Typography variant="body2">{selectedApplication.motherFullName}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Cell Phone:</Typography>
                        <Typography variant="body2">{selectedApplication.motherCellPhone}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Address:</Typography>
                        <Typography variant="body2">{selectedApplication.motherAddress}</Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Father's Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Full Name:</Typography>
                        <Typography variant="body2">{selectedApplication.fatherFullName}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Cell Phone:</Typography>
                        <Typography variant="body2">{selectedApplication.fatherCellPhone}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Address:</Typography>
                        <Typography variant="body2">{selectedApplication.fatherAddress}</Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>Family & Religious Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Religious Denomination:</Typography>
                    <Typography variant="body2">{selectedApplication.religiousDenomination || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Baptised:</Typography>
                    <Typography variant="body2">{selectedApplication.isBaptised ? 'Yes' : 'No'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Home Language:</Typography>
                    <Typography variant="body2">{selectedApplication.homeLanguage || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Siblings at Holy Cross:</Typography>
                    <Typography variant="body2">{selectedApplication.siblingsAtHolyCross ? 'Yes' : 'No'}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>School & Employment Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Current School:</Typography>
                    <Typography variant="body2">{selectedApplication.currentSchool || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Payment Method:</Typography>
                    <Typography variant="body2">{selectedApplication.paymentMethod || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {tabValue === 4 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>Supporting Documents</Typography>
                {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                  <List>
                    {selectedApplication.documents.map((doc) => (
                      <ListItem key={doc.id}>
                        <ListItemIcon>
                          <AttachFile />
                        </ListItemIcon>
                        <ListItemText
                          primary={doc.originalName}
                          secondary={`${doc.documentType} - ${formatDate(doc.uploadedAt)}`}
                        />
                        <ListItemSecondaryAction>
                          <Button
                            size="small"
                            startIcon={<Download />}
                            href={`${API_BASE_URL_WITH_PREFIX}/application-documents/download/${doc.id}`}
                            target="_blank"
                            onClick={(e) => {
                              e.preventDefault();
                              const token = localStorage.getItem('adminToken');
                              window.open(
                                `${API_BASE_URL_WITH_PREFIX}/application-documents/download/${doc.id}`,
                                '_blank'
                              );
                            }}
                          >
                            Download
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    No documents uploaded yet.
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setViewDialogOpen(false);
              handleStatusChange(selectedApplication);
            }}
            sx={{ bgcolor: '#1a237e' }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderStatusDialog = () => (
    <Dialog
      open={statusDialogOpen}
      onClose={() => setStatusDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Update Application Status</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
              <MenuItem value="ENROLLED">Enrolled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this application..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => selectedApplication && updateApplicationStatus(selectedApplication.id, newStatus, notes)}
          sx={{ bgcolor: '#1a237e' }}
        >
          Update Status
        </Button>
      </DialogActions>
    </Dialog>
  );

  // ========================================
  // MAIN RENDER
  // ========================================

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} sx={{ color: '#1a237e' }} />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ minHeight: '100vh' }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Typography color="text.primary">Admin</Typography>
          <Typography color="text.primary">Application Management</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
            Application Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280' }}>
            Review and manage student applications
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Filters */}
        {renderFilters()}

        {/* Applications Table */}
        {renderApplicationsTable()}

        {/* Dialogs */}
        {renderApplicationDetails()}
        {renderStatusDialog()}
      </Box>
    </AdminLayout>
  );
};

export default AdminApplicationManagement;
