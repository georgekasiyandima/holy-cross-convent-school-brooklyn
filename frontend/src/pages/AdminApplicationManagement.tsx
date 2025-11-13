import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  Tooltip,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Breadcrumbs,
  ListItemAvatar,
  Paper,
  Stack,
  Snackbar
} from '@mui/material';
import {
  Visibility,
  Edit,
  CheckCircle,
  Person,
  Download,
  Search,
  Refresh,
  Assignment,
  People,
  AttachFile,
  Warning,
  Timeline,
  Delete
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AdminLayout from '../components/AdminLayout';
import { API_BASE_URL_WITH_PREFIX } from '../services/apiConfig';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// ========================================
// TYPE DEFINITIONS
// ========================================

export enum ApplicationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ENROLLED = 'ENROLLED'
}

interface Application {
  id: number;
  // Learner Information
  surname: string;
  learnerName: string;
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
  status: ApplicationStatus;
  notes?: string;
  currentStageKey?: string;
  currentStageStatus?: string;
  currentAssigneeRole?: string | null;
  currentAssigneeId?: string | null;
  nextActionDue?: string | null;
  
  // Timestamps
  submittedAt: string;
  updatedAt: string;
  
  // Documents
  documents?: ApplicationDocument[];
  stages?: ApplicationStage[];
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
  downloadUrl?: string;
}

interface ApplicationStage {
  id: number;
  stageKey: string;
  name: string;
  assignedRole: string;
  assignedUserId?: string | null;
  sequence: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  startedAt?: string | null;
  completedAt?: string | null;
  dueDate?: string | null;
  description?: string | null;
  payload?: string | null;
}

interface ApplicationTimelineEvent {
  id: number;
  stageKey?: string | null;
  eventType: string;
  performedByName?: string | null;
  notes?: string | null;
  createdAt: string;
}

interface ApplicationCommunication {
  id: number;
  channel: string;
  recipientAddress: string;
  subject?: string | null;
  status: string;
  createdAt: string;
}

interface WorkflowSummary {
  stages: ApplicationStage[];
  timeline: ApplicationTimelineEvent[];
  communications: ApplicationCommunication[];
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

const StatusChip = styled(Chip)<{ status: ApplicationStatus }>(({ status }) => {
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING: return { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' };
      case ApplicationStatus.UNDER_REVIEW: return { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' };
      case ApplicationStatus.APPROVED: return { bg: '#d4edda', color: '#155724', border: '#c3e6cb' };
      case ApplicationStatus.REJECTED: return { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' };
      case ApplicationStatus.ENROLLED: return { bg: '#e2e3e5', color: '#383d41', border: '#d6d8db' };
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
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
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
  const [workflowSummary, setWorkflowSummary] = useState<WorkflowSummary | null>(null);
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [documentTypes, setDocumentTypes] = useState<{ value: string; label: string }[]>([]);
  const [documentUploadType, setDocumentUploadType] = useState<string>('');
  const [documentUploadFile, setDocumentUploadFile] = useState<File | null>(null);
  const [documentUploading, setDocumentUploading] = useState(false);
  const [documentUploadError, setDocumentUploadError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  // Memoized filtered applications to prevent unnecessary recalculations
  const filteredApplications = useMemo(() => {
    if (!Array.isArray(applications)) {
      return [];
    }

    let filtered = applications;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.surname.toLowerCase().includes(term) ||
        app.learnerName.toLowerCase().includes(term) ||
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

    return filtered;
  }, [applications, searchTerm, statusFilter, gradeFilter]);

  // ========================================
  // EFFECTS
  // ========================================

  useEffect(() => {
    const controller = new AbortController();
    
    const loadData = async () => {
      await fetchApplications(true, controller.signal);
      await fetchStats(controller.signal);
    };
    
    loadData();
    
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!viewDialogOpen || !selectedApplication) {
      return;
    }
    
    const controller = new AbortController();
    loadDocumentTypes();
    loadWorkflowSummary(selectedApplication.id, controller.signal);
    loadApplicationDocuments(selectedApplication.id, controller.signal);
    
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewDialogOpen, selectedApplication?.id]);

  useEffect(() => {
    if (!viewDialogOpen) {
      setWorkflowSummary(null);
      setWorkflowError(null);
      setDocumentsError(null);
      setDocumentUploadError(null);
      setDocumentUploadFile(null);
      setDocumentUploadType('');
    }
  }, [viewDialogOpen]);

  // ========================================
  // API FUNCTIONS
  // ========================================

  const fetchApplications = async (showLoader: boolean = true, signal?: AbortSignal): Promise<Application[]> => {
    try {
      if (showLoader) {
        setLoading(true);
        setError(null);
      }
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL_WITH_PREFIX}/admissions/applications`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        },
        signal
      });
      if (response.data.success && Array.isArray(response.data.applications)) {
        setApplications(response.data.applications);
        return response.data.applications;
      }
      if (Array.isArray(response.data)) {
        setApplications(response.data);
        return response.data;
      }
      console.error('Unexpected response format:', response.data);
      setApplications([]);
      setError('Invalid response format from server');
      return [];
    } catch (err: any) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return [];
      }
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.message || 'Failed to load applications. Please check your connection and try again.');
      setApplications([]);
      return [];
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const fetchStats = async (signal?: AbortSignal) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL_WITH_PREFIX}/admissions/statistics`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        },
        signal
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
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }
      console.error('Error fetching stats:', err);
      // Stats are not critical, so we don't show error to user
    }
  };

  const updateApplicationStatus = async (applicationId: number, status: string, notes?: string) => {
    // Find the original application for rollback
    const originalApplication = applications.find(app => app.id === applicationId);
    if (!originalApplication) {
      setError('Application not found');
      return;
    }

    // Optimistic update
    const optimisticApp = { ...originalApplication, status: status as ApplicationStatus, notes: notes || originalApplication.notes };
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? optimisticApp : app
    ));
    
    // Update selected application if it's the one being updated
    if (selectedApplication?.id === applicationId) {
      setSelectedApplication(optimisticApp);
    }

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
      
      setStatusDialogOpen(false);
      setSelectedApplication(null);
      setNewStatus('');
      setNotes('');
      setSnackbar({ open: true, message: 'Application status updated successfully', severity: 'success' });
    } catch (err: any) {
      console.error('Error updating application status:', err);
      // Rollback optimistic update
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? originalApplication : app
      ));
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication(originalApplication);
      }
      setError(err.response?.data?.message || 'Failed to update application status');
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update application status', severity: 'error' });
    }
  };

  const mergeApplicationWithSummary = useCallback(
    (application: Application, summary: WorkflowSummary, overrideDocs?: ApplicationDocument[]): Application => {
      // Deep clone to avoid mutation
      const merged = JSON.parse(JSON.stringify(application));
      const stages = summary.stages;
      if (!stages.length) {
        merged.stages = stages;
        merged.documents = overrideDocs ?? application.documents;
        return merged;
      }
      const activeStage = stages.find((stage) => stage.status !== 'COMPLETED');
      const referenceStage = activeStage ?? stages[stages.length - 1];
      merged.currentStageKey = referenceStage?.stageKey ?? application.currentStageKey;
      merged.currentStageStatus = referenceStage?.status ?? application.currentStageStatus;
      merged.currentAssigneeRole = activeStage ? activeStage.assignedRole : null;
      merged.nextActionDue = activeStage ? activeStage.dueDate ?? null : null;
      merged.stages = stages;
      merged.documents = overrideDocs ?? application.documents;
      return merged;
    },
    []
  );

  const loadWorkflowSummary = async (applicationId: number, signal?: AbortSignal) => {
    setWorkflowLoading(true);
    setWorkflowError(null);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${API_BASE_URL_WITH_PREFIX}/admissions/applications/${applicationId}/workflow`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          signal
        }
      );

      if (response.data.success && response.data.data) {
        const summary = response.data.data as WorkflowSummary;
        setWorkflowSummary(summary);
        setApplications((prev) =>
          prev.map((app) => (app.id === applicationId ? mergeApplicationWithSummary(app, summary) : app))
        );
        setSelectedApplication((prev) =>
          prev && prev.id === applicationId ? mergeApplicationWithSummary(prev, summary, documents) : prev
        );
        return summary;
      }
      if (response.data.data) {
        const summary = response.data.data as WorkflowSummary;
        setWorkflowSummary(summary);
        setApplications((prev) =>
          prev.map((app) => (app.id === applicationId ? mergeApplicationWithSummary(app, summary) : app))
        );
        setSelectedApplication((prev) =>
          prev && prev.id === applicationId ? mergeApplicationWithSummary(prev, summary, documents) : prev
        );
        return summary;
      }
      setWorkflowSummary(null);
      setWorkflowError('No workflow details found for this application.');
      return null;
    } catch (err: any) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return null;
      }
      console.error('Error loading workflow summary:', err);
      setWorkflowSummary(null);
      setWorkflowError(err.response?.data?.message || 'Failed to load workflow details. Please try again.');
      return null;
    } finally {
      setWorkflowLoading(false);
    }
  };

  const loadApplicationDocuments = async (applicationId: number, signal?: AbortSignal) => {
    setDocumentsLoading(true);
    setDocumentsError(null);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${API_BASE_URL_WITH_PREFIX}/application-documents/${applicationId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          signal
        }
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        setDocuments(response.data.data);
        setSelectedApplication((prev) =>
          prev && prev.id === applicationId ? { ...prev, documents: response.data.data } : prev
        );
        setApplications((prev) =>
          prev.map((app) => (app.id === applicationId ? { ...app, documents: response.data.data } : app))
        );
      } else {
        setDocuments(selectedApplication?.documents || []);
        setDocumentsError('Unexpected response while loading documents.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }
      console.error('Error loading application documents:', err);
      setDocumentsError(err.response?.data?.message || 'Failed to load documents. Please try again.');
    } finally {
      setDocumentsLoading(false);
    }
  };

  const loadDocumentTypes = async () => {
    if (documentTypes.length) return;
    try {
      const response = await axios.get(`${API_BASE_URL_WITH_PREFIX}/application-documents/types`);
      if (response.data.success && Array.isArray(response.data.data)) {
        setDocumentTypes(response.data.data);
      }
    } catch (err) {
      console.error('Error loading document types:', err);
    }
  };

  const canManageStage = useCallback(
    (stage: ApplicationStage) => {
      if (!user) return false;
      if (['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return true;
      return stage.assignedRole === user.role;
    },
    [user]
  );

  const handleStageStatusUpdate = async (
    application: Application,
    stage: ApplicationStage,
    status: ApplicationStage['status']
  ) => {
    setActionId(`stage-${stage.id}`);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${API_BASE_URL_WITH_PREFIX}/admissions/applications/${application.id}/stages/${stage.id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      const summary = await loadWorkflowSummary(application.id);
      if (!summary) return;
      if (!viewDialogOpen) {
        await fetchApplications(false);
      }
    } catch (err: any) {
      console.error('Failed to update stage status:', err);
      setWorkflowError(
        err?.response?.data?.message || 'Unable to update stage status. Please try again.'
      );
    } finally {
      setActionId(null);
    }
  };

  const handleDocumentUploadSubmit = async () => {
    if (!selectedApplication) return;
    if (!documentUploadType) {
      setDocumentUploadError('Please select a document type.');
      return;
    }
    if (!documentUploadFile) {
      setDocumentUploadError('Please choose a file to upload.');
      return;
    }

    // File size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (documentUploadFile.size > maxSize) {
      setDocumentUploadError('File size must be less than 10MB. Please choose a smaller file.');
      return;
    }

    // File type validation
    const allowedTypes = ['image/', 'application/pdf'];
    const isValidType = allowedTypes.some(type => documentUploadFile.type.startsWith(type));
    if (!isValidType) {
      setDocumentUploadError('Only images and PDF files are allowed.');
      return;
    }

    setDocumentUploadError(null);
    setDocumentUploading(true);

    try {
      const formData = new FormData();
      formData.append('applicationId', selectedApplication.id.toString());
      formData.append('documentType', documentUploadType);
      formData.append('document', documentUploadFile);
      const token = localStorage.getItem('adminToken');
      await axios.post(`${API_BASE_URL_WITH_PREFIX}/application-documents/upload`, formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'multipart/form-data',
        },
      });

      setDocumentUploadFile(null);
      setDocumentUploadType('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await loadApplicationDocuments(selectedApplication.id);
      setSnackbar({ open: true, message: 'Document uploaded successfully', severity: 'success' });
    } catch (err: any) {
      console.error('Failed to upload document:', err);
      const errorMessage = err?.response?.data?.message || 'Failed to upload document. Please try again.';
      setDocumentUploadError(errorMessage);
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setDocumentUploading(false);
    }
  };

  const handleDeleteApplicationDocument = async (documentId: number) => {
    if (!selectedApplication) return;
    const confirmed = window.confirm('Delete this document? This action cannot be undone.');
    if (!confirmed) return;

    setActionId(`doc-${documentId}`);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL_WITH_PREFIX}/application-documents/${documentId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      await loadApplicationDocuments(selectedApplication.id);
      setSnackbar({ open: true, message: 'Document deleted successfully', severity: 'success' });
    } catch (err: any) {
      console.error('Failed to delete document:', err);
      const errorMessage = err?.response?.data?.message || 'Unable to delete document. Please try again.';
      setDocumentsError(errorMessage);
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setActionId(null);
    }
  };

  const resolveDocumentDownloadUrl = (document: ApplicationDocument) => {
    if (document.downloadUrl) {
      if (document.downloadUrl.startsWith('http')) {
        return document.downloadUrl;
      }
      return `${API_BASE_URL_WITH_PREFIX}${document.downloadUrl.startsWith('/') ? document.downloadUrl : `/${document.downloadUrl}`}`;
    }
    return `${API_BASE_URL_WITH_PREFIX}/application-documents/download/${document.id}`;
  };

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setDocuments(application.documents || []);
    setWorkflowSummary(null);
    setWorkflowError(null);
    setDocumentsError(null);
    setDocumentUploadError(null);
    setDocumentUploadType('');
    setDocumentUploadFile(null);
    // Reset file input using state instead of direct DOM manipulation
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setViewDialogOpen(true);
  };

  const handleStatusChange = (application: Application) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setNotes(application.notes || '');
    setStatusDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    // Handle timezone properly - assume UTC if no timezone info
    const date = new Date(dateString);
    // Convert to local timezone for display
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  };

  const getDocumentOverview = useCallback((application: Application) => {
    const uploaded = application.documents?.length ?? 0;
    const docStage = application.stages?.find((stage) => stage.stageKey === 'DOCUMENT_VERIFICATION');
    let expected = 0;
    if (docStage?.payload) {
      try {
        const payload = JSON.parse(docStage.payload);
        if (Array.isArray(payload?.checklist)) {
          expected = payload.checklist.length;
        }
      } catch (err) {
        // ignore parse errors
      }
    }
    const outstanding = expected > 0 ? Math.max(expected - uploaded, 0) : 0;
    return { uploaded, expected, outstanding };
  }, []);

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
            onClick={() => {
              const controller = new AbortController();
              fetchApplications(true, controller.signal);
            }}
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
                <TableRow hover key={application.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {application.learnerName} {application.surname}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        DOB: {formatDate(application.dateOfBirth)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
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
                  <TableCell align="center">
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {application.motherFullName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {application.motherCellPhone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <StatusChip
                      label={application.status.replace('_', ' ')}
                      status={application.status}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {application.currentStageKey?.replace(/_/g, ' ') || '—'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {application.currentStageStatus?.replace(/_/g, ' ') || '—'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {(() => {
                      const docInfo = getDocumentOverview(application);
                      const needsDocs = docInfo.expected ? docInfo.outstanding > 0 : docInfo.uploaded === 0;
                      const chipColor = needsDocs ? '#fff3e0' : '#e8f5e9';
                      const chipTextColor = needsDocs ? '#ef6c00' : '#2e7d32';
                      const label = docInfo.expected
                        ? `${docInfo.uploaded}/${docInfo.expected}`
                        : `${docInfo.uploaded}`;
                      return (
                        <Chip
                          size="small"
                          label={label}
                          sx={{
                            bgcolor: `${chipColor} !important`,
                            color: chipTextColor,
                            fontWeight: 600,
                          }}
                        />
                      );
                    })()}
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{formatDate(application.submittedAt)}</Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                      Updated: {formatDate(application.updatedAt)}
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

    const formatDateTime = (value?: string | null) => {
      if (!value) return '—';
      return new Date(value).toLocaleString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const stageStatusStyles = (status: string) => {
      switch (status) {
        case 'COMPLETED':
          return {
            bg: '#e8f5e9',
            color: '#2e7d32',
            chipBg: '#c8e6c9',
            chipColor: '#1b5e20',
          };
        case 'IN_PROGRESS':
          return {
            bg: '#e3f2fd',
            color: '#1a237e',
            chipBg: '#bbdefb',
            chipColor: '#0d47a1',
          };
        case 'ON_HOLD':
          return {
            bg: '#fff3e0',
            color: '#ef6c00',
            chipBg: '#ffe0b2',
            chipColor: '#e65100',
          };
        default:
          return {
            bg: '#f1f5f9',
            color: '#475569',
            chipBg: '#e2e8f0',
            chipColor: '#1f2937',
          };
      }
    };

    const currentStage = workflowSummary?.stages.find(
      (stage) => stage.stageKey === selectedApplication.currentStageKey
    );

    const stageActionButtons = (stage: ApplicationStage) => {
      if (!canManageStage(stage)) return null;
      const isProcessing = actionId === `stage-${stage.id}`;

      const buttons: React.ReactNode[] = [];

      if (stage.status !== 'IN_PROGRESS' && stage.status !== 'COMPLETED') {
        buttons.push(
          <Button
            key="start"
            variant="outlined"
            size="small"
            disabled={isProcessing}
            onClick={() => handleStageStatusUpdate(selectedApplication, stage, 'IN_PROGRESS')}
          >
            Mark In Progress
          </Button>
        );
      }

      if (stage.status !== 'COMPLETED') {
        buttons.push(
          <Button
            key="complete"
            variant="contained"
            size="small"
            sx={{ bgcolor: '#1a237e' }}
            disabled={isProcessing}
            onClick={() => handleStageStatusUpdate(selectedApplication, stage, 'COMPLETED')}
          >
            Complete Stage
          </Button>
        );
      }

      if (stage.status !== 'ON_HOLD') {
        buttons.push(
          <Button
            key="hold"
            variant="outlined"
            color="warning"
            size="small"
            disabled={isProcessing}
            onClick={() => handleStageStatusUpdate(selectedApplication, stage, 'ON_HOLD')}
          >
            Put On Hold
          </Button>
        );
      } else {
        buttons.push(
          <Button
            key="resume"
            variant="outlined"
            size="small"
            disabled={isProcessing}
            onClick={() => handleStageStatusUpdate(selectedApplication, stage, 'IN_PROGRESS')}
          >
            Resume
          </Button>
        );
      }

      if (stage.status === 'COMPLETED') {
        buttons.push(
          <Button
            key="reopen"
            variant="text"
            size="small"
            disabled={isProcessing}
            onClick={() => handleStageStatusUpdate(selectedApplication, stage, 'IN_PROGRESS')}
          >
            Reopen
          </Button>
        );
      }

      return (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
          {buttons}
        </Stack>
      );
    };

    const parsedPayload = (payload?: string | null) => {
      if (!payload) return null;
      try {
        return JSON.parse(payload);
      } catch (err) {
        return null;
      }
    };

    return (
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        aria-labelledby="application-dialog-title"
      >
        <DialogTitle id="application-dialog-title">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person sx={{ color: '#1a237e' }} />
            <Box>
              <Typography variant="h6">
                {selectedApplication.learnerName} {selectedApplication.surname}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Application #{selectedApplication.id}
              </Typography>
              <Typography variant="body2" sx={{ color: '#1a237e', mt: 0.5 }}>
                Current Stage:{' '}
                {currentStage ? currentStage.name : selectedApplication.currentStageKey || 'N/A'}
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

        <DialogContent dividers sx={{ bgcolor: '#f8fafc' }}>
          {workflowLoading ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <CircularProgress sx={{ color: '#1a237e' }} />
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Loading workflow details...
              </Typography>
            </Box>
          ) : workflowError ? (
            <Alert severity="error">{workflowError}</Alert>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Stack spacing={2}>
                  <Typography variant="subtitle1" sx={{ color: '#1a237e', fontWeight: 700 }}>
                    Workflow Stages
                  </Typography>
                  {workflowSummary?.stages.map((stage) => {
                    const payload = parsedPayload(stage.payload);
                    const statusStyles = stageStatusStyles(stage.status);
                    const documentOverview =
                      selectedApplication && stage.stageKey === 'DOCUMENT_VERIFICATION'
                        ? getDocumentOverview(selectedApplication)
                        : null;
                    return (
                      <Paper
                        key={stage.id}
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          border: '1px solid #e2e8f0',
                          backgroundColor: statusStyles.bg,
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {stage.sequence}. {stage.name}
                          </Typography>
                          <Chip
                            label={stage.status.replace('_', ' ')}
                            size="small"
                            sx={{ bgcolor: statusStyles.chipBg, color: statusStyles.chipColor, fontWeight: 600 }}
                          />
                          <Chip
                            label={stage.assignedRole.replace('_', ' ')}
                            size="small"
                            sx={{ bgcolor: '#e3f2fd', color: '#1a237e', fontWeight: 600 }}
                          />
                          {stage.dueDate && (
                            <Chip
                              label={`Due: ${formatDate(stage.dueDate)}`}
                              size="small"
                              variant="outlined"
                              sx={{ borderColor: '#1a237e', color: '#1a237e' }}
                            />
                          )}
                          {documentOverview && (
                            <Chip
                              label={`Docs: ${documentOverview.expected ? `${documentOverview.uploaded}/${documentOverview.expected}` : documentOverview.uploaded}`}
                              size="small"
                              sx={{
                                bgcolor:
                                  documentOverview.expected && documentOverview.outstanding > 0
                                    ? '#fff3e0'
                                    : '#e8f5e9',
                                color:
                                  documentOverview.expected && documentOverview.outstanding > 0
                                    ? '#ef6c00'
                                    : '#2e7d32',
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Stack>
                        {stage.description && (
                          <Typography variant="body2" sx={{ color: '#475569', mb: 1 }}>
                            {stage.description}
                          </Typography>
                        )}

                        {payload?.checklist && Array.isArray(payload.checklist) && (
                          <Box sx={{ mb: 1.5 }}>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Checklist
                            </Typography>
                            <List dense>
                              {payload.checklist.map((item: string, idx: number) => (
                                <ListItem key={idx} sx={{ py: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CheckCircle sx={{ color: '#1a237e', fontSize: 18 }} />
                                  </ListItemIcon>
                                  <ListItemText primary={item} />
                                </ListItem>
                              ))}
                            </List>
                            {documentOverview && documentOverview.expected && documentOverview.outstanding > 0 && (
                              <Alert severity="warning" sx={{ mt: 1 }}>
                                {documentOverview.outstanding} checklist item
                                {documentOverview.outstanding > 1 ? 's remain outstanding.' : ' remains outstanding.'}
                              </Alert>
                            )}
                          </Box>
                        )}

                        {stageActionButtons(stage)}
                      </Paper>
                    );
                  })}
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                <Stack spacing={2}>
                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                      Upload Supporting Documents
                    </Typography>

                    {documentUploadError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {documentUploadError}
                      </Alert>
                    )}

                    <Stack spacing={2}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Document Type</InputLabel>
                        <Select
                          value={documentUploadType}
                          label="Document Type"
                          onChange={(event) => setDocumentUploadType(event.target.value)}
                        >
                          {documentTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Button
                        variant="outlined"
                        startIcon={<AttachFile />}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {documentUploadFile ? documentUploadFile.name : 'Choose file'}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        onChange={(event) => {
                          const file = event.target.files?.[0] || null;
                          setDocumentUploadFile(file);
                        }}
                      />

                      <Button
                        variant="contained"
                        onClick={handleDocumentUploadSubmit}
                        disabled={documentUploading}
                        sx={{ bgcolor: '#1a237e' }}
                      >
                        {documentUploading ? 'Uploading...' : 'Upload Document'}
                      </Button>
                    </Stack>
                  </Paper>

                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                      Documents ({documents.length})
                    </Typography>
                    {documentsError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {documentsError}
                      </Alert>
                    )}
                    {documentsLoading ? (
                      <Box sx={{ py: 2, textAlign: 'center' }}>
                        <CircularProgress size={20} />
                      </Box>
                    ) : documents.length ? (
                      <List dense>
                        {documents.map((doc) => (
                          <ListItem key={doc.id} alignItems="flex-start" sx={{ py: 1 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <AttachFile sx={{ color: '#1a237e' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={doc.originalName}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2" sx={{ color: '#64748b' }}>
                                    {doc.documentType.replace(/_/g, ' ')}
                                  </Typography>
                                  {' • '}
                                  <Typography component="span" variant="body2" sx={{ color: '#64748b' }}>
                                    {formatDateTime(doc.uploadedAt)}
                                  </Typography>
                                </>
                              }
                            />
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Download">
                                <IconButton
                                  size="small"
                                  component="a"
                                  href={resolveDocumentDownloadUrl(doc)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Download fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete document">
                                <span>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    disabled={actionId === `doc-${doc.id}`}
                                    onClick={() => handleDeleteApplicationDocument(doc.id)}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Stack>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        No supporting documents uploaded yet.
                      </Typography>
                    )}
                  </Paper>

                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                      Timeline
                    </Typography>
                    {workflowSummary?.timeline && workflowSummary.timeline.length > 0 ? (
                      <List dense>
                        {workflowSummary.timeline.map((event) => (
                          <ListItem key={event.id} alignItems="flex-start" sx={{ py: 1 }}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: '#1a237e', width: 32, height: 32 }}>
                                <Timeline fontSize="small" />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <>
                                  <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
                                    {event.eventType.replace(/_/g, ' ')}
                                  </Typography>
                                  {' • '}
                                  <Typography component="span" variant="body2" sx={{ color: '#64748b' }}>
                                    {formatDateTime(event.createdAt)}
                                  </Typography>
                                </>
                              }
                              secondary={
                                <>
                                  {event.stageKey && (
                                    <Typography component="div" variant="body2" sx={{ color: '#64748b' }}>
                                      Stage: {event.stageKey.replace(/_/g, ' ')}
                                    </Typography>
                                  )}
                                  {event.performedByName && (
                                    <Typography component="div" variant="body2" sx={{ color: '#64748b' }}>
                                      By: {event.performedByName}
                                    </Typography>
                                  )}
                                  {event.notes && (
                                    <Typography component="div" variant="body2">
                                      {event.notes}
                                    </Typography>
                                  )}
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Workflow activity will appear here as stages progress.
                      </Typography>
                    )}
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          )}
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
            Update Application Status
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

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

export default AdminApplicationManagement;
