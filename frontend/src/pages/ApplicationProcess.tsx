import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  School,
  Person,
  ContactPhone,
  Email,
  LocationOn,
  Description,
  CheckCircle,
  ExpandMore,
  Info,
  Warning,
  Star,
  ChildCare,
  Group,
  Schedule,
  Phone,
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material';
import { Skeleton } from '@mui/material';
import InputMask from 'react-input-mask';
import SEO from '../components/SEO';
import admissionsService, { ApplicationData } from '../services/admissionsService';
import ApplicationDocumentUpload from '../components/ApplicationDocumentUpload';
import DocumentService, { Document as ResourceDocument } from '../services/documentService';
import { ApplicationDocument } from '../services/applicationDocumentsService';

// Phone Input Component with mask for SA numbers
interface PhoneInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ 
  value, 
  onChange, 
  label, 
  required, 
  error, 
  helperText,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid
}) => {
  // SA phone format: +27 XX XXX XXXX or 0XX XXX XXXX
  // Use flexible mask that accepts both formats
  // Default to local format, switch to international if user types +
  const mask = value && value.startsWith('+27') 
    ? '+27 99 999 9999' 
    : value && value.startsWith('+')
    ? '+99 999 999 9999' // Flexible international format
    : '099 999 9999'; // Default SA local format

  return (
    <InputMask
      mask={mask}
      value={value}
      onChange={onChange}
      maskChar={null}
    >
      {(inputProps: any) => (
        <TextField
          {...inputProps}
          fullWidth
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          id={id}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          placeholder="+27 12 345 6789 or 012 345 6789"
        />
      )}
    </InputMask>
  );
};

// Required Asterisk Component
const RequiredAsterisk: React.FC = () => (
  <span style={{ color: '#d32f2f' }} aria-label="required">*</span>
);

// Styled components for better visual appeal
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("/ROBT02.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  color: '#1a237e',
  padding: theme.spacing(8, 0),
  position: 'relative',
  minHeight: '400px',
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));


const GradeRCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)',
  border: '2px solid #d32f2f',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #d32f2f 0%, #ffd700 50%, #d32f2f 100%)',
    borderRadius: `${theme.spacing(2)}px ${theme.spacing(2)}px 0 0`,
  }
}));

const ApplicationProcess: React.FC = () => {
  const theme = useTheme();
  // Use 'sm' breakpoint (600px) for mobile vertical stepper orientation (<768px requirement)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [feesDocument, setFeesDocument] = useState<ResourceDocument | null>(null);
  const [agreementDocument, setAgreementDocument] = useState<ResourceDocument | null>(null);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [uploadedDocuments, setUploadedDocuments] = useState<ApplicationDocument[]>([]);
  const [isApplicationCompleted, setIsApplicationCompleted] = useState(false);
  
  // Move documentService instantiation inside component
  const documentService = DocumentService.getInstance();
  const [formData, setFormData] = useState({
    // Learner Information
    surname: '',
    learnerName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gradeApplying: '',
    year: '',
    lastGradePassed: '',
    hasRepeated: false,
    repeatedGrade: '',
    
    // Mother's Information
    motherFullName: '',
    motherAddress: '',
    motherHomePhone: '',
    motherWorkPhone: '',
    motherCellPhone: '',
    
    // Father's Information
    fatherFullName: '',
    fatherAddress: '',
    fatherHomePhone: '',
    fatherWorkPhone: '',
    fatherCellPhone: '',
    
    // Responsible Party (if not parents)
    isNotParents: false, // Progressive disclosure checkbox
    responsiblePartyName: '',
    responsiblePartyAddress: '',
    responsiblePartyRelationship: '',
    responsiblePartyHomePhone: '',
    responsiblePartyWorkPhone: '',
    responsiblePartyCellPhone: '',
    
    // Learner Address (if different from parents)
    learnerAddress: '',
    
    // Religious Information
    religiousDenomination: '',
    isBaptised: false,
    parishChurch: '',
    refugeeStatus: false,
    homeLanguage: '',
    
    // Family Information
    numberOfChildren: '',
    childrenAges: '',
    siblingsAtHolyCross: false,
    siblingName: '',
    siblingGrade: '',
    
    // Employment Details
    motherOccupation: '',
    motherPlaceOfEmployment: '',
    motherWorkTel: '',
    motherWorkCell: '',
    motherEmail: '',
    
    fatherOccupation: '',
    fatherPlaceOfEmployment: '',
    fatherWorkTel: '',
    fatherWorkCell: '',
    fatherEmail: '',
    
    responsiblePartyOccupation: '',
    responsiblePartyPlaceOfEmployment: '',
    responsiblePartyWorkTel: '',
    responsiblePartyWorkCell: '',
    responsiblePartyEmail: '',
    
    selfEmployedDetails: '',
    maritalStatus: '',
    
    // Current School Information
    currentSchool: '',
    currentSchoolAddress: '',
    currentSchoolTel: '',
    currentSchoolContact: '',
    
    // Payment Method
    paymentMethod: '',
    
    // Terms and Conditions
    agreeToTerms: false,
    agreeToPrivacy: false,
  });

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchSupportingDocuments = async () => {
      try {
        if (!isMounted) return;
        setLoadingDocuments(true);
        const [admissionsDocs, formsDocs, feesDocs] = await Promise.all([
          documentService.getDocumentsByCategory('admissions', true).catch(() => []),
          documentService.getDocumentsByCategory('form', true).catch(() => []),
          documentService.getDocumentsByCategory('fees', true).catch(() => []),
        ]);

        if (controller.signal.aborted || !isMounted) return;

        const allDocs = [...admissionsDocs, ...formsDocs, ...feesDocs];

        const feesDoc = allDocs.find((doc) =>
          doc.title.toLowerCase().includes('2026') &&
          (doc.title.toLowerCase().includes('fee') || doc.title.toLowerCase().includes('charges'))
        );

        const agreementDoc = allDocs.find((doc) =>
          doc.title.toLowerCase().includes('memorandum') ||
          doc.title.toLowerCase().includes('agreement')
        );

        if (!isMounted) return;

        if (feesDoc && isMounted) setFeesDocument(feesDoc);
        if (agreementDoc && isMounted) setAgreementDocument(agreementDoc);
      } catch (error) {
        if (!controller.signal.aborted && isMounted && process.env.NODE_ENV === 'development') {
          console.error('Failed to load admissions resources:', error);
        }
      } finally {
        if (!controller.signal.aborted && isMounted) {
          setLoadingDocuments(false);
        }
      }
    };

    fetchSupportingDocuments();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [documentService]);

  // Ensure proper URL handling for document downloads
  const feesDocumentUrl = feesDocument ? documentService.getDocumentDownloadUrl(feesDocument.fileUrl || '') : null;
  const agreementDocumentUrl = agreementDocument ? documentService.getDocumentDownloadUrl(agreementDocument.fileUrl || '') : null;

  const steps = [
    'Learner Information',
    'Parent/Guardian Details',
    'Religious & Family Info',
    'Employment Details',
    'Current School Info',
    'Payment & Documents',
    'Upload Documents',
    'Review & Submit'
  ];

  // Get field names for each step (for error clearing)
  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 0:
        return ['surname', 'learnerName', 'dateOfBirth', 'placeOfBirth', 'gradeApplying', 'year', 'repeatedGrade'];
      case 1:
        return ['motherFullName', 'motherAddress', 'motherHomePhone', 'motherWorkPhone', 'motherCellPhone', 
                'fatherFullName', 'fatherAddress', 'fatherHomePhone', 'fatherWorkPhone', 'fatherCellPhone',
                'responsiblePartyName', 'responsiblePartyAddress', 'responsiblePartyHomePhone', 
                'responsiblePartyWorkPhone', 'responsiblePartyCellPhone', 'learnerAddress'];
      case 2:
        return ['religiousDenomination', 'isBaptised', 'parishChurch', 'refugeeStatus', 'homeLanguage',
                'numberOfChildren', 'childrenAges', 'siblingsAtHolyCross', 'siblingName', 'siblingGrade'];
      case 3:
        return ['motherOccupation', 'motherPlaceOfEmployment', 'motherWorkTel', 'motherWorkCell', 'motherEmail',
                'fatherOccupation', 'fatherPlaceOfEmployment', 'fatherWorkTel', 'fatherWorkCell', 'fatherEmail',
                'responsiblePartyOccupation', 'responsiblePartyPlaceOfEmployment', 'responsiblePartyWorkTel',
                'responsiblePartyWorkCell', 'responsiblePartyEmail', 'selfEmployedDetails', 'maritalStatus'];
      case 4:
        return ['currentSchool', 'currentSchoolAddress', 'currentSchoolTel', 'currentSchoolContact'];
      case 5:
        return ['paymentMethod', 'agreeToTerms', 'agreeToPrivacy'];
      case 6:
        return ['documents'];
      default:
        return [];
    }
  };

  // Clear errors for a specific step
  const clearStepErrors = (step: number) => {
    const stepFields = getStepFields(step);
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      stepFields.forEach(field => {
        delete newErrors[field];
      });
      return newErrors;
    });
  };

  // Validate all form steps (0-5) before creating application
  const validateFormSteps = (): boolean => {
    const allErrors: Record<string, string> = {};
    const allMissing: string[] = [];

    // Clear previous errors
    setFieldErrors({});

    // Validate all form steps (0-5) - aggregate errors properly
    for (let i = 0; i < steps.length - 2; i++) {
      const stepErrors: Record<string, string> = {};
      const stepMissing: string[] = [];
      const stepValid = validateStep(i, stepErrors, stepMissing);
      
      // Aggregate errors and missing fields
      Object.assign(allErrors, stepErrors);
      allMissing.push(...stepMissing);
      
      if (!stepValid) {
        // Continue collecting errors from all steps
      }
    }

    setFieldErrors(allErrors);

    if (allMissing.length > 0) {
      setValidationError(`Please complete the following before submitting: ${allMissing.join(', ')}`);
      return false;
    }

    setValidationError(null);
    return true;
  };

  // Validate all steps including documents before final submission
  const validateAllSteps = (): boolean => {
    const allErrors: Record<string, string> = {};
    const allMissing: string[] = [];

    // Clear previous errors
    setFieldErrors({});

    // Validate all form steps (0-5) - aggregate errors properly
    for (let i = 0; i < steps.length - 2; i++) {
      const stepErrors: Record<string, string> = {};
      const stepMissing: string[] = [];
      const stepValid = validateStep(i, stepErrors, stepMissing);
      
      // Aggregate errors and missing fields
      Object.assign(allErrors, stepErrors);
      allMissing.push(...stepMissing);
      
      if (!stepValid) {
        // Continue collecting errors from all steps
      }
    }

    // Validate step 6 (Upload Documents) - require at least one document
    if (applicationId && uploadedDocuments.length === 0) {
      allErrors.documents = 'At least one supporting document is required';
      allMissing.push('Supporting Documents');
    }

    setFieldErrors(allErrors);

    if (allMissing.length > 0) {
      setValidationError(`Please complete the following before submitting: ${allMissing.join(', ')}`);
      return false;
    }

    setValidationError(null);
    return true;
  };

  const validateStep = (step: number, errors?: Record<string, string>, missing?: string[]): boolean => {
    // Clone objects to prevent mutation issues when called from validateAllSteps
    const stepErrors: Record<string, string> = errors ? { ...errors } : {};
    const stepMissing: string[] = missing ? [...missing] : [];

    const isEmpty = (v: any) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
    
    // Phone number validation helper - flexible for international numbers
    const isValidPhone = (phone: string, required: boolean = false): boolean => {
      if (isEmpty(phone)) return !required; // Empty is valid if not required
      // Allow various formats: international (+country), SA format (0XXXXXXXXX), or basic digits
      const cleaned = phone.replace(/\s+/g, '').replace(/[-()]/g, '');
      // South African format: +27XXXXXXXXX or 0XXXXXXXXX (10 digits after country code or 0)
      if (/^(\+27|0)[1-9]\d{8}$/.test(cleaned)) return true;
      // International format: + followed by country code and number (at least 7 digits total)
      if (/^\+\d{1,3}\d{7,}$/.test(cleaned)) return true;
      // Basic format: at least 7 digits (for flexibility)
      if (/^\d{7,}$/.test(cleaned)) return true;
      return false;
    };

    if (step === 0) {
      if (isEmpty(formData.surname)) {
        stepErrors.surname = 'Surname is required';
        stepMissing.push('Surname');
      }
      if (isEmpty(formData.learnerName)) {
        stepErrors.learnerName = 'Name is required';
        stepMissing.push('Name');
      }
      if (isEmpty(formData.dateOfBirth)) {
        stepErrors.dateOfBirth = 'Date of Birth is required';
        stepMissing.push('Date of Birth');
      }
      if (isEmpty(formData.placeOfBirth)) {
        stepErrors.placeOfBirth = 'Place of Birth is required';
        stepMissing.push('Place of Birth');
      }
      if (isEmpty(formData.gradeApplying)) {
        stepErrors.gradeApplying = 'Grade Applying is required';
        stepMissing.push('Grade Applying');
      }
      if (isEmpty(formData.year)) {
        stepErrors.year = 'Year is required';
        stepMissing.push('Year');
      }
      if (formData.hasRepeated && isEmpty(formData.repeatedGrade)) {
        stepErrors.repeatedGrade = 'Repeated Grade is required when learner has repeated';
        stepMissing.push('Repeated Grade');
      }
    } else if (step === 1) {
      // Require at least one primary contact reachable by cell phone
      const motherOk = !isEmpty(formData.motherFullName) && !isEmpty(formData.motherCellPhone);
      const fatherOk = !isEmpty(formData.fatherFullName) && !isEmpty(formData.fatherCellPhone);
      const responsibleOk = !isEmpty(formData.responsiblePartyName) && !isEmpty(formData.responsiblePartyCellPhone);
      
      if (!motherOk && !fatherOk && !responsibleOk) {
        if (isEmpty(formData.motherFullName)) stepErrors.motherFullName = 'Mother\'s Full Name is required';
        if (isEmpty(formData.motherCellPhone)) stepErrors.motherCellPhone = 'Mother\'s Cell Phone is required';
        if (isEmpty(formData.fatherFullName)) stepErrors.fatherFullName = 'Father\'s Full Name is required';
        if (isEmpty(formData.fatherCellPhone)) stepErrors.fatherCellPhone = 'Father\'s Cell Phone is required';
        if (isEmpty(formData.responsiblePartyName)) stepErrors.responsiblePartyName = 'Responsible Party Name is required';
        if (isEmpty(formData.responsiblePartyCellPhone)) stepErrors.responsiblePartyCellPhone = 'Responsible Party Cell Phone is required';
        stepMissing.push('At least one contact with Full Name and Cell Phone (Mother/Father/Responsible Party)');
      }
      
      if (isEmpty(formData.motherAddress) && isEmpty(formData.fatherAddress) && isEmpty(formData.responsiblePartyAddress)) {
        stepErrors.motherAddress = 'At least one address is required';
        stepErrors.fatherAddress = 'At least one address is required';
        stepErrors.responsiblePartyAddress = 'At least one address is required';
        stepMissing.push('An address for at least one contact (Mother/Father/Responsible Party)');
      }
    } else if (step === 4) {
      // Enforce contact number and name for previous school/creche for background checks
      if (isEmpty(formData.currentSchoolTel)) {
        stepErrors.currentSchoolTel = 'Telephone number is required for background checks';
        stepMissing.push('Telephone Number of School/Creche');
      }
      if (isEmpty(formData.currentSchoolContact)) {
        stepErrors.currentSchoolContact = 'Contact name is required for background checks';
        stepMissing.push('Contact Name of School/Creche');
      }
    } else if (step === 5) {
      if (isEmpty(formData.paymentMethod)) {
        stepErrors.paymentMethod = 'Payment Method is required';
        stepMissing.push('Payment Method');
      }
      if (!formData.agreeToTerms) {
        stepErrors.agreeToTerms = 'You must agree to the terms and conditions';
        stepMissing.push('Agreement to Terms');
      }
      if (!formData.agreeToPrivacy) {
        stepErrors.agreeToPrivacy = 'You must agree to the privacy policy';
        stepMissing.push('Privacy Policy Consent');
      }
    }

    setFieldErrors(stepErrors);

    if (stepMissing.length > 0) {
      setValidationError(`Please complete the following before continuing: ${stepMissing.join(', ')}`);
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear field error when user makes selection
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setFormData({
      ...formData,
      [field]: newValue,
    });
    // Clear field error when user checks/unchecks
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    // For conditional fields, clear related step errors
    // e.g., if hasRepeated changes, clear repeatedGrade error
    if (field === 'hasRepeated' && !newValue) {
      // If hasRepeated is unchecked, clear repeatedGrade error
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.repeatedGrade;
        return newErrors;
      });
    }
    // Clear step errors for the step containing this field
    const stepIndex = steps.findIndex((_, idx) => {
      const stepFields = getStepFields(idx);
      return stepFields.includes(field);
    });
    if (stepIndex >= 0) {
      clearStepErrors(stepIndex);
    }
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) return;
    // Clear errors for the current step after successful validation
    clearStepErrors(activeStep);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Extract submit logic to avoid duplicate setSubmitting calls
  const submitApplication = async (): Promise<{ success: boolean; applicationId?: number; error?: string }> => {
    // Validate all form steps before submit (0-5, no documents yet)
    if (!validateFormSteps()) {
      return { success: false, error: 'Validation failed' };
    }
    
    try {
      setSubmitting(true);
      const applicationData: ApplicationData = {
        // Learner Information
        surname: formData.surname,
        learnerName: formData.learnerName,
        dateOfBirth: formData.dateOfBirth,
        placeOfBirth: formData.placeOfBirth,
        gradeApplying: formData.gradeApplying,
        year: formData.year,
        lastGradePassed: formData.lastGradePassed,
        hasRepeated: formData.hasRepeated,
        repeatedGrade: formData.repeatedGrade,
        
        // Mother's Information
        motherFullName: formData.motherFullName,
        motherAddress: formData.motherAddress,
        motherHomePhone: formData.motherHomePhone,
        motherWorkPhone: formData.motherWorkPhone,
        motherCellPhone: formData.motherCellPhone,
        
        // Father's Information
        fatherFullName: formData.fatherFullName,
        fatherAddress: formData.fatherAddress,
        fatherHomePhone: formData.fatherHomePhone,
        fatherWorkPhone: formData.fatherWorkPhone,
        fatherCellPhone: formData.fatherCellPhone,
        
        // Responsible Party (if not parents)
        responsiblePartyName: formData.responsiblePartyName,
        responsiblePartyAddress: formData.responsiblePartyAddress,
        responsiblePartyRelationship: formData.responsiblePartyRelationship,
        responsiblePartyHomePhone: formData.responsiblePartyHomePhone,
        responsiblePartyWorkPhone: formData.responsiblePartyWorkPhone,
        responsiblePartyCellPhone: formData.responsiblePartyCellPhone,
        
        // Learner Address (if different from parents)
        learnerAddress: formData.learnerAddress,
        
        // Religious Information
        religiousDenomination: formData.religiousDenomination,
        isBaptised: formData.isBaptised,
        parishChurch: formData.parishChurch,
        refugeeStatus: formData.refugeeStatus,
        homeLanguage: formData.homeLanguage,
        
        // Family Information
        numberOfChildren: formData.numberOfChildren,
        childrenAges: formData.childrenAges,
        siblingsAtHolyCross: formData.siblingsAtHolyCross,
        siblingName: formData.siblingName,
        siblingGrade: formData.siblingGrade,
        
        // Employment Details
        motherOccupation: formData.motherOccupation,
        motherPlaceOfEmployment: formData.motherPlaceOfEmployment,
        motherWorkTel: formData.motherWorkTel,
        motherWorkCell: formData.motherWorkCell,
        motherEmail: formData.motherEmail,
        
        fatherOccupation: formData.fatherOccupation,
        fatherPlaceOfEmployment: formData.fatherPlaceOfEmployment,
        fatherWorkTel: formData.fatherWorkTel,
        fatherWorkCell: formData.fatherWorkCell,
        fatherEmail: formData.fatherEmail,
        
        responsiblePartyOccupation: formData.responsiblePartyOccupation,
        responsiblePartyPlaceOfEmployment: formData.responsiblePartyPlaceOfEmployment,
        responsiblePartyWorkTel: formData.responsiblePartyWorkTel,
        responsiblePartyWorkCell: formData.responsiblePartyWorkCell,
        responsiblePartyEmail: formData.responsiblePartyEmail,
        
        selfEmployedDetails: formData.selfEmployedDetails,
        maritalStatus: formData.maritalStatus,
        
        // Current School Information
        currentSchool: formData.currentSchool,
        currentSchoolAddress: formData.currentSchoolAddress,
        currentSchoolTel: formData.currentSchoolTel,
        currentSchoolContact: formData.currentSchoolContact,
        
        // Payment Method
        paymentMethod: formData.paymentMethod,
        
        // Terms and Conditions
        agreeToTerms: formData.agreeToTerms,
        agreeToPrivacy: formData.agreeToPrivacy,
      };

      const response = await admissionsService.submitApplication(applicationData);
      
      if (response.success) {
        const newApplicationId = response.applicationId || null;
        setApplicationId(newApplicationId);
        // Move to document upload step only after successful API call
        setActiveStep(6);
        setSuccessMessage(
          `Application created successfully!\n\n` +
          `Application ID: ${newApplicationId}\n\n` +
          `Please upload your supporting documents on the next step. You can upload multiple documents of different types.\n\n` +
          `After uploading documents, you can review and finalize your application.`
        );
        setSuccessDialogOpen(true);
        setValidationError(null);
        return { success: true, applicationId: newApplicationId || undefined };
      } else {
        const errorMsg = response.errors?.map((e: any) => e.message).join(', ') || 'Failed to create application.';
        setValidationError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      const errorMsg = error?.response?.data?.message || error.message || 'Unexpected error submitting application';
      setValidationError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (applicationId) {
      // Validate all steps including documents before final submission
      if (!validateAllSteps()) {
        return;
      }
      
      // Mark application as completed - form will reset after dialog closes
      setIsApplicationCompleted(true);
      
      // Application already created, just show success message
      setSuccessMessage(
        `Application submitted successfully!\n\n` +
        `Application ID: ${applicationId}\n\n` +
        `Our admissions team will review your application and contact you within 2-3 business days.\n\n` +
        `You will receive a phone call regarding the outcome of your application.`
      );
      setSuccessDialogOpen(true);
      // Note: Form reset will happen after user closes the success dialog
    } else {
      // Create application first using extracted submit logic
      await submitApplication();
    }
  };

  // Reset form after successful submission (called when dialog closes)
  const resetFormAfterSuccess = () => {
    setIsApplicationCompleted(false);
    setFormData({
      // Learner Information
      surname: '',
      learnerName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      gradeApplying: '',
      year: '',
      lastGradePassed: '',
      hasRepeated: false,
      repeatedGrade: '',
      
      // Mother's Information
      motherFullName: '',
      motherAddress: '',
      motherHomePhone: '',
      motherWorkPhone: '',
      motherCellPhone: '',
      
      // Father's Information
      fatherFullName: '',
      fatherAddress: '',
      fatherHomePhone: '',
      fatherWorkPhone: '',
      fatherCellPhone: '',
      
        // Responsible Party (if not parents)
        isNotParents: false,
        responsiblePartyName: '',
        responsiblePartyAddress: '',
        responsiblePartyRelationship: '',
        responsiblePartyHomePhone: '',
        responsiblePartyWorkPhone: '',
        responsiblePartyCellPhone: '',
      
      // Learner Address (if different from parents)
      learnerAddress: '',
      
      // Religious Information
      religiousDenomination: '',
      isBaptised: false,
      parishChurch: '',
      refugeeStatus: false,
      homeLanguage: '',
      
      // Family Information
      numberOfChildren: '',
      childrenAges: '',
      siblingsAtHolyCross: false,
      siblingName: '',
      siblingGrade: '',
      
      // Employment Details
      motherOccupation: '',
      motherPlaceOfEmployment: '',
      motherWorkTel: '',
      motherWorkCell: '',
      motherEmail: '',
      
      fatherOccupation: '',
      fatherPlaceOfEmployment: '',
      fatherWorkTel: '',
      fatherWorkCell: '',
      fatherEmail: '',
      
      responsiblePartyOccupation: '',
      responsiblePartyPlaceOfEmployment: '',
      responsiblePartyWorkTel: '',
      responsiblePartyWorkCell: '',
      responsiblePartyEmail: '',
      
      selfEmployedDetails: '',
      maritalStatus: '',
      
      // Current School Information
      currentSchool: '',
      currentSchoolAddress: '',
      currentSchoolTel: '',
      currentSchoolContact: '',
      
      // Payment Method
      paymentMethod: '',
      
      // Terms and Conditions
      agreeToTerms: false,
      agreeToPrivacy: false,
    });
    setApplicationId(null);
    setUploadedDocuments([]);
    setActiveStep(0);
    setFieldErrors({});
    setValidationError(null);
  };

  const handleSubmit = async () => {
    // Use extracted submit logic
    await submitApplication();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
              Learner Information
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Surname"
                  value={formData.surname}
                  onChange={handleInputChange('surname')}
                  required
                  error={!!fieldErrors.surname}
                  helperText={fieldErrors.surname}
                  id="surname"
                  aria-describedby={fieldErrors.surname ? 'surname-error' : undefined}
                  aria-invalid={!!fieldErrors.surname}
                />
                {fieldErrors.surname && (
                  <Typography id="surname-error" role="alert" variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {fieldErrors.surname}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Name of Learner"
                  value={formData.learnerName}
                  onChange={handleInputChange('learnerName')}
                  required
                  error={!!fieldErrors.learnerName}
                  helperText={fieldErrors.learnerName}
                  id="learnerName"
                  aria-describedby={fieldErrors.learnerName ? 'learnerName-error' : undefined}
                  aria-invalid={!!fieldErrors.learnerName}
                />
                {fieldErrors.learnerName && (
                  <Typography id="learnerName-error" role="alert" variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {fieldErrors.learnerName}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange('dateOfBirth')}
                  InputLabelProps={{ shrink: true }}
                  required
                  error={!!fieldErrors.dateOfBirth}
                  helperText={fieldErrors.dateOfBirth}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Place of Birth"
                  value={formData.placeOfBirth}
                  onChange={handleInputChange('placeOfBirth')}
                  required
                  error={!!fieldErrors.placeOfBirth}
                  helperText={fieldErrors.placeOfBirth}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <FormControl fullWidth required error={!!fieldErrors.gradeApplying}>
                  <InputLabel>Grade for which Application is made</InputLabel>
                  <Select
                    value={formData.gradeApplying}
                    onChange={handleSelectChange('gradeApplying')}
                    label="Grade for which Application is made"
                  >
                    <MenuItem value="Grade R">Grade R</MenuItem>
                    <MenuItem value="Grade 1">Grade 1</MenuItem>
                    <MenuItem value="Grade 2">Grade 2</MenuItem>
                    <MenuItem value="Grade 3">Grade 3</MenuItem>
                    <MenuItem value="Grade 4">Grade 4</MenuItem>
                    <MenuItem value="Grade 5">Grade 5</MenuItem>
                    <MenuItem value="Grade 6">Grade 6</MenuItem>
                    <MenuItem value="Grade 7">Grade 7</MenuItem>
                  </Select>
                  {fieldErrors.gradeApplying && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {fieldErrors.gradeApplying}
                    </Typography>
                  )}
                </FormControl>
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="For Year"
                  value={formData.year}
                  onChange={handleInputChange('year')}
                  placeholder="2026"
                  required
                  error={!!fieldErrors.year}
                  helperText={fieldErrors.year}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Last Grade Passed"
                  value={formData.lastGradePassed}
                  onChange={handleInputChange('lastGradePassed')}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.hasRepeated}
                      onChange={handleCheckboxChange('hasRepeated')}
                    />
                  }
                  label="Has Learner repeated a Grade?"
                />
              </Box>
              {formData.hasRepeated && (
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="If yes above, which Grade?"
                    value={formData.repeatedGrade}
                    onChange={handleInputChange('repeatedGrade')}
                    error={!!fieldErrors.repeatedGrade}
                    helperText={fieldErrors.repeatedGrade}
                  />
                </Box>
              )}
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
              Parent/Guardian Details
            </Typography>
            
            {/* Mother's Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Mother's Information
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Mother's Full Name"
                    value={formData.motherFullName}
                    onChange={handleInputChange('motherFullName')}
                    required
                    error={!!fieldErrors.motherFullName}
                    helperText={fieldErrors.motherFullName}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Mother's Address"
                    value={formData.motherAddress}
                    onChange={handleInputChange('motherAddress')}
                    required
                    error={!!fieldErrors.motherAddress}
                    helperText={fieldErrors.motherAddress}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Home Phone"
                    value={formData.motherHomePhone}
                    onChange={handleInputChange('motherHomePhone')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Work Phone"
                    value={formData.motherWorkPhone}
                    onChange={handleInputChange('motherWorkPhone')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Cell Phone"
                    value={formData.motherCellPhone}
                    onChange={handleInputChange('motherCellPhone')}
                    required
                    error={!!fieldErrors.motherCellPhone}
                    helperText={fieldErrors.motherCellPhone}
                    id="motherCellPhone"
                    aria-describedby={fieldErrors.motherCellPhone ? 'motherCellPhone-error' : undefined}
                    aria-invalid={!!fieldErrors.motherCellPhone}
                  />
                  {fieldErrors.motherCellPhone && (
                    <Typography id="motherCellPhone-error" role="alert" variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {fieldErrors.motherCellPhone}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Father's Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Father's Information
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Father's Full Name"
                    value={formData.fatherFullName}
                    onChange={handleInputChange('fatherFullName')}
                    required
                    error={!!fieldErrors.fatherFullName}
                    helperText={fieldErrors.fatherFullName}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Father's Address"
                    value={formData.fatherAddress}
                    onChange={handleInputChange('fatherAddress')}
                    required
                    error={!!fieldErrors.fatherAddress}
                    helperText={fieldErrors.fatherAddress}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Home Phone"
                    value={formData.fatherHomePhone}
                    onChange={handleInputChange('fatherHomePhone')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Work Phone"
                    value={formData.fatherWorkPhone}
                    onChange={handleInputChange('fatherWorkPhone')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Cell Phone"
                    value={formData.fatherCellPhone}
                    onChange={handleInputChange('fatherCellPhone')}
                    required
                    error={!!fieldErrors.fatherCellPhone}
                    helperText={fieldErrors.fatherCellPhone}
                    id="fatherCellPhone"
                    aria-describedby={fieldErrors.fatherCellPhone ? 'fatherCellPhone-error' : undefined}
                    aria-invalid={!!fieldErrors.fatherCellPhone}
                  />
                  {fieldErrors.fatherCellPhone && (
                    <Typography id="fatherCellPhone-error" role="alert" variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {fieldErrors.fatherCellPhone}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Responsible Party (if not parents) - Progressive Disclosure */}
            <Box sx={{ mb: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isNotParents}
                    onChange={handleCheckboxChange('isNotParents')}
                    aria-label="Responsible party is not the parents"
                  />
                }
                label={
                  <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                    Responsible party is not the parents
                  </Typography>
                }
                sx={{ mb: 2 }}
              />
              {formData.isNotParents && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Responsible party Full Name"
                    value={formData.responsiblePartyName}
                    onChange={handleInputChange('responsiblePartyName')}
                    error={!!fieldErrors.responsiblePartyName}
                    helperText={fieldErrors.responsiblePartyName}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={formData.responsiblePartyAddress}
                    onChange={handleInputChange('responsiblePartyAddress')}
                    error={!!fieldErrors.responsiblePartyAddress}
                    helperText={fieldErrors.responsiblePartyAddress}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Relationship"
                    value={formData.responsiblePartyRelationship}
                    onChange={handleInputChange('responsiblePartyRelationship')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Home Phone"
                    value={formData.responsiblePartyHomePhone}
                    onChange={handleInputChange('responsiblePartyHomePhone')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Work Phone"
                    value={formData.responsiblePartyWorkPhone}
                    onChange={handleInputChange('responsiblePartyWorkPhone')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Cell Phone"
                    value={formData.responsiblePartyCellPhone}
                    onChange={handleInputChange('responsiblePartyCellPhone')}
                    error={!!fieldErrors.responsiblePartyCellPhone}
                    helperText={fieldErrors.responsiblePartyCellPhone}
                    id="responsiblePartyCellPhone"
                    aria-describedby={fieldErrors.responsiblePartyCellPhone ? 'responsiblePartyCellPhone-error' : undefined}
                    aria-invalid={!!fieldErrors.responsiblePartyCellPhone}
                  />
                  {fieldErrors.responsiblePartyCellPhone && (
                    <Typography id="responsiblePartyCellPhone-error" role="alert" variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {fieldErrors.responsiblePartyCellPhone}
                    </Typography>
                  )}
                </Box>
                </Box>
              )}
            </Box>

            {/* Learner Address (if different from parents) */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Address - Learner (If not same as parents)
              </Typography>
              <TextField
                fullWidth
                label="Learner Address"
                value={formData.learnerAddress}
                onChange={handleInputChange('learnerAddress')}
                multiline
                rows={2}
              />
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
              Religious & Family Information
            </Typography>
            
            {/* Religious Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Religious Information
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Religious Denomination"
                    value={formData.religiousDenomination}
                    onChange={handleInputChange('religiousDenomination')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isBaptised}
                        onChange={handleCheckboxChange('isBaptised')}
                      />
                    }
                    label="Is child Baptised/Christened?"
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Name of Parish/Church you attend"
                    value={formData.parishChurch}
                    onChange={handleInputChange('parishChurch')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.refugeeStatus}
                        onChange={handleCheckboxChange('refugeeStatus')}
                      />
                    }
                    label="Refugee Status?"
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Home Language"
                    value={formData.homeLanguage}
                    onChange={handleInputChange('homeLanguage')}
                    helperText="Language heard most by the child and the language spoken to the child"
                  />
                </Box>
              </Box>
            </Box>

            {/* Family Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Family Information
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="No. of Children in Family"
                    value={formData.numberOfChildren}
                    onChange={handleInputChange('numberOfChildren')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Ages"
                    value={formData.childrenAges}
                    onChange={handleInputChange('childrenAges')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.siblingsAtHolyCross}
                        onChange={handleCheckboxChange('siblingsAtHolyCross')}
                      />
                    }
                    label="Any siblings at Holy Cross Primary?"
                  />
                </Box>
                {formData.siblingsAtHolyCross && (
                  <>
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                      <TextField
                        fullWidth
                        label="Sibling Name"
                        value={formData.siblingName}
                        onChange={handleInputChange('siblingName')}
                      />
                    </Box>
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                      <TextField
                        fullWidth
                        label="Sibling Grade"
                        value={formData.siblingGrade}
                        onChange={handleInputChange('siblingGrade')}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
              Employment Details
            </Typography>
            
            {/* Mother's Employment */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Mother's Employment Details
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Occupation: Mother"
                    value={formData.motherOccupation}
                    onChange={handleInputChange('motherOccupation')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Place of employment"
                    value={formData.motherPlaceOfEmployment}
                    onChange={handleInputChange('motherPlaceOfEmployment')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Tel"
                    value={formData.motherWorkTel}
                    onChange={handleInputChange('motherWorkTel')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Cell"
                    value={formData.motherWorkCell}
                    onChange={handleInputChange('motherWorkCell')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <TextField
                    fullWidth
                    label="Email address"
                    type="email"
                    value={formData.motherEmail}
                    onChange={handleInputChange('motherEmail')}
                  />
                </Box>
              </Box>
            </Box>

            {/* Father's Employment */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Father's Employment Details
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Occupation: Father"
                    value={formData.fatherOccupation}
                    onChange={handleInputChange('fatherOccupation')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Place of employment"
                    value={formData.fatherPlaceOfEmployment}
                    onChange={handleInputChange('fatherPlaceOfEmployment')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Tel"
                    value={formData.fatherWorkTel}
                    onChange={handleInputChange('fatherWorkTel')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Cell"
                    value={formData.fatherWorkCell}
                    onChange={handleInputChange('fatherWorkCell')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <TextField
                    fullWidth
                    label="Email address"
                    type="email"
                    value={formData.fatherEmail}
                    onChange={handleInputChange('fatherEmail')}
                  />
                </Box>
              </Box>
            </Box>

            {/* Responsible Party Employment */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                If responsible party not parent - Employment Details
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Occupation: Responsible Party"
                    value={formData.responsiblePartyOccupation}
                    onChange={handleInputChange('responsiblePartyOccupation')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="Place of employment"
                    value={formData.responsiblePartyPlaceOfEmployment}
                    onChange={handleInputChange('responsiblePartyPlaceOfEmployment')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Tel"
                    value={formData.responsiblePartyWorkTel}
                    onChange={handleInputChange('responsiblePartyWorkTel')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <PhoneInput
                    label="Cell"
                    value={formData.responsiblePartyWorkCell}
                    onChange={handleInputChange('responsiblePartyWorkCell')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                  <TextField
                    fullWidth
                    label="Email address"
                    type="email"
                    value={formData.responsiblePartyEmail}
                    onChange={handleInputChange('responsiblePartyEmail')}
                  />
                </Box>
              </Box>
            </Box>

            {/* Self-employed and Marital Status */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Additional Information
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <TextField
                    fullWidth
                    label="If self-employed please state nature of employment/business"
                    multiline
                    rows={2}
                    value={formData.selfEmployedDetails}
                    onChange={handleInputChange('selfEmployedDetails')}
                  />
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Marital Status</InputLabel>
                    <Select
                      value={formData.maritalStatus}
                      onChange={handleSelectChange('maritalStatus')}
                      label="Marital Status"
                    >
                      <MenuItem value="Married">Married</MenuItem>
                      <MenuItem value="Divorced">Divorced</MenuItem>
                      <MenuItem value="Separated">Separated</MenuItem>
                      <MenuItem value="Single">Single</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
              Current School Information
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Current School/Creche attending"
                  value={formData.currentSchool}
                  onChange={handleInputChange('currentSchool')}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Address of School/Creche"
                  value={formData.currentSchoolAddress}
                  onChange={handleInputChange('currentSchoolAddress')}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <PhoneInput
                  label="Tel. No of School/Creche *"
                  value={formData.currentSchoolTel}
                  onChange={handleInputChange('currentSchoolTel')}
                  required
                  error={!!fieldErrors.currentSchoolTel}
                  helperText={fieldErrors.currentSchoolTel || 'Required for background checks'}
                  id="currentSchoolTel"
                  aria-describedby={fieldErrors.currentSchoolTel ? 'currentSchoolTel-error' : undefined}
                  aria-invalid={!!fieldErrors.currentSchoolTel}
                />
                {fieldErrors.currentSchoolTel && (
                  <Typography id="currentSchoolTel-error" role="alert" variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {fieldErrors.currentSchoolTel}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <TextField
                  fullWidth
                  label="Contact name *"
                  value={formData.currentSchoolContact}
                  onChange={handleInputChange('currentSchoolContact')}
                  required
                  error={!!fieldErrors.currentSchoolContact}
                  helperText={fieldErrors.currentSchoolContact || 'Required for background checks'}
                />
              </Box>
            </Box>
          </Box>
        );

      case 5:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
              Payment Method & Required Documents
            </Typography>
            
            {/* Payment Method */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Method of Payment
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif', mb: 2 }}>
                  <strong>Payment Instructions:</strong> Please make cash deposits into the school bank account:
                </Typography>
                <Box sx={{ pl: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Bank:</strong> FNB<br />
                    <strong>Branch:</strong> 203309<br />
                    <strong>Account Number:</strong> 54450670046<br />
                    <strong>Reference:</strong> Name of Learner ({formData.learnerName || '[Name]'})
                  </Typography>
                </Box>
              </Alert>
              <FormControl fullWidth error={!!fieldErrors.paymentMethod}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.paymentMethod}
                  onChange={handleSelectChange('paymentMethod')}
                  label="Payment Method"
                >
                  <MenuItem value="Cash Deposit">Cash Deposit</MenuItem>
                  <MenuItem value="Bank Stop Order">Bank Stop Order</MenuItem>
                  <MenuItem value="Direct Bank Deposit/EFT">Direct Bank Deposit/EFT</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                  <MenuItem value="Annually">Annually (payment to be made in advance)</MenuItem>
                </Select>
                {fieldErrors.paymentMethod && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {fieldErrors.paymentMethod}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Required Documents */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Required Documents
              </Typography>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                  <strong>APPLICATION WILL NOT BE ACCEPTED WITHOUT ALL RELEVANT DOCUMENTS</strong>
                </Typography>
              </Alert>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif', fontWeight: 600 }}>
                  Please ensure you have the following documents ready:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                    • Birth certificate<br />
                    • Baptism certificate (if applicable/Catholic learners)<br />
                    • Recent photograph of Learner<br />
                    • Copy of the last school report<br />
                    • Copy of current school statement/or letter from school confirming school fee situation<br />
                    • Any assessments and or reports done of a learner (psychologists, occupational therapists, doctors etc.)<br />
                    • Copies of salary Slip - mother / father (one or both can submit)<br />
                    • 3 month bank statement (latest 3 months) - mother/father<br />
                    • Copies of both parents ID documents - mother / father<br />
                    • If self-employed latest tax clearance from SARS<br />
                    • Valid working/or refugee visa/s for non-South Africans without SA Identity Book
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Terms and Conditions */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Terms and Conditions
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                  <strong>NOTE:</strong> PARENTS WILL BE NOTIFIED TELEPHONICALLY OF OUTCOME OF APPLICATION - NO DISCUSSION WILL BE LED INTO ONCE A DECISION HAS BEEN REACHED
                </Typography>
              </Alert>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreeToTerms}
                    onChange={handleCheckboxChange('agreeToTerms')}
                    color={fieldErrors.agreeToTerms ? 'error' : 'primary'}
                  />
                }
                label={
                  <span>
                    I agree to the school's terms and conditions <RequiredAsterisk />
                  </span>
                }
                sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}
              />
              {fieldErrors.agreeToTerms && (
                <Typography variant="caption" color="error" sx={{ ml: 4, display: 'block' }}>
                  {fieldErrors.agreeToTerms}
                </Typography>
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreeToPrivacy}
                    onChange={handleCheckboxChange('agreeToPrivacy')}
                    color={fieldErrors.agreeToPrivacy ? 'error' : 'primary'}
                  />
                }
                label={
                  <span>
                    I agree to the privacy policy and data processing <RequiredAsterisk />
                  </span>
                }
                sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}
              />
              {fieldErrors.agreeToPrivacy && (
                <Typography variant="caption" color="error" sx={{ ml: 4, display: 'block' }}>
                  {fieldErrors.agreeToPrivacy}
                </Typography>
              )}
            </Box>
          </Box>
        );

      case 6:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
              Upload Supporting Documents
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
              Please upload all required supporting documents for your application. You can upload multiple documents of different types.
            </Typography>
            {applicationId && (
              <ApplicationDocumentUpload 
                applicationId={applicationId}
                onDocumentsChange={(documents) => {
                  setUploadedDocuments(documents);
                  // Clear document error when documents are uploaded
                  if (documents.length > 0 && fieldErrors.documents) {
                    setFieldErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.documents;
                      return newErrors;
                    });
                  }
                  if (process.env.NODE_ENV === 'development') {
                    console.log('Documents updated:', documents);
                  }
                }}
              />
            )}
            {fieldErrors.documents && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {fieldErrors.documents}
              </Alert>
            )}
          </Box>
        );

      case 7:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
              Review Your Application
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Application Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                  <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                    <strong>Learner's Name:</strong> {formData.surname} {formData.learnerName}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                    <strong>Date of Birth:</strong> {formData.dateOfBirth}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                    <strong>Grade:</strong> {formData.gradeApplying}
                  </Typography>
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                  <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                    <strong>Mother:</strong> {formData.motherFullName}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                    <strong>Father:</strong> {formData.fatherFullName}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                    <strong>Payment Method:</strong> {formData.paymentMethod}
                  </Typography>
                </Box>
              </Box>
            </Paper>
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                <strong>Next Steps:</strong> After submitting your application, our admissions team will review it and contact you within 2-3 business days to schedule an interview and school tour.
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <>
      {/* Loading Skeleton instead of Backdrop */}
      {loadingDocuments && (
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="rectangular" height={400} sx={{ mb: 4, borderRadius: 2 }} />
          </Box>
          <Paper sx={{ p: 4 }}>
            <Skeleton variant="text" width="60%" height={60} sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} variant="rectangular" width={120} height={40} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} variant="rectangular" width="48%" height={56} />
              ))}
            </Box>
          </Paper>
        </Container>
      )}
      {!loadingDocuments && (
        <>
          <SEO
            title="Application Process - Holy Cross Convent School"
            description="Apply to Holy Cross Convent School Brooklyn. Complete our online application process for Grade R to Grade 7. Join our Catholic educational community."
            keywords="application process, enrollment, admissions, Holy Cross Convent School, Brooklyn, Catholic school, Grade R, primary school"
          />
          
          {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: '#ffffff',
                fontFamily: '"Lato", "Open Sans", sans-serif',
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)'
              }}
            >
              Application Process
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                color: '#ffffff',
                fontWeight: 600,
                fontFamily: '"Lato", "Open Sans", sans-serif',
                textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 0, 0, 0.5)'
              }}
            >
              Join Our Holy Cross Family
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                maxWidth: '800px', 
                margin: '0 auto', 
                fontSize: '1.1rem',
                color: '#ffffff',
                fontWeight: 500,
                fontFamily: '"Lato", "Open Sans", sans-serif',
                lineHeight: 1.8,
                textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.5)'
              }}
            >
              We welcome applications from families who share our values of faith, excellence, and community. 
              Our streamlined application process makes it easy to begin your child's journey with us.
            </Typography>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Grade R Promotion Section */}
        <GradeRCard sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <ChildCare sx={{ fontSize: 40, color: '#d32f2f', mr: 2 }} />
            <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
              Special Focus: Grade R Learners
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
            We're actively seeking Grade R learners to join our nurturing early childhood education program. 
            Our Grade R program provides the perfect foundation for your child's educational journey.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' }, textAlign: 'center' }}>
              <Star sx={{ fontSize: 40, color: '#ffd700', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Holistic Development</Typography>
              <Typography variant="body2">
                Focus on cognitive, emotional, and social development
              </Typography>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' }, textAlign: 'center' }}>
              <Group sx={{ fontSize: 40, color: '#ffd700', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Small Class Sizes</Typography>
              <Typography variant="body2">
                Individual attention and personalized learning
              </Typography>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' }, textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: '#ffd700', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Flexible Schedule</Typography>
              <Typography variant="body2">
                Half-day and full-day options available
              </Typography>
            </Box>
          </Box>
        </GradeRCard>

        {/* Helpful Resources for Prospective Parents */}
        <Box sx={{ mb: 6, p: 4, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e3f2fd' }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ color: '#1a237e', fontWeight: 700, mb: 3 }}>
            Helpful Resources
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#555', lineHeight: 1.8 }}>
            Before completing your application, explore these resources to help you make an informed decision about joining the Holy Cross family:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Description sx={{ color: '#1a237e', mt: 0.5 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 0.5 }}>
                  Fees Structure 2026
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  Review our comprehensive fee structure including tuition, activity fees, and payment options.
                </Typography>
                {feesDocumentUrl ? (
                  <Button
                    component="a"
                    variant="outlined"
                    size="small"
                    href={feesDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#1a237e',
                      borderColor: '#1a237e',
                      '&:hover': { borderColor: '#3949ab', bgcolor: 'rgba(26, 35, 126, 0.04)' },
                    }}
                  >
                    Download Fees Structure
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    disabled
                    sx={{
                      color: '#1a237e',
                      borderColor: '#1a237e',
                      '&:hover': { borderColor: '#3949ab', bgcolor: 'rgba(26, 35, 126, 0.04)' },
                    }}
                  >
                    Fees Structure Coming Soon
                  </Button>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Description sx={{ color: '#1a237e', mt: 0.5 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 0.5 }}>
                  Memorandum of Agreement
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  Please review and sign the school-parent agreement to complete the admissions process.
                </Typography>
                {agreementDocumentUrl ? (
                  <Button
                    component="a"
                    variant="outlined"
                    size="small"
                    href={agreementDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#1a237e',
                      borderColor: '#1a237e',
                      '&:hover': { borderColor: '#3949ab', bgcolor: 'rgba(26, 35, 126, 0.04)' },
                    }}
                  >
                    Download Agreement
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    disabled
                    sx={{
                      color: '#1a237e',
                      borderColor: '#1a237e',
                      '&:hover': { borderColor: '#3949ab', bgcolor: 'rgba(26, 35, 126, 0.04)' },
                    }}
                  >
                    Agreement Coming Soon
                  </Button>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Description sx={{ color: '#1a237e', mt: 0.5 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 0.5 }}>
                  School Uniforms
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  Learn about our uniform requirements, where to purchase, and uniform guidelines.
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  href="/info" 
                  sx={{ color: '#1a237e', borderColor: '#1a237e', '&:hover': { borderColor: '#3949ab', bgcolor: 'rgba(26, 35, 126, 0.04)' } }}
                >
                  View Uniform Information
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <School sx={{ color: '#1a237e', mt: 0.5 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 0.5 }}>
                  School Information
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  Discover more about our mission, values, academic programs, and school facilities.
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  href="/info" 
                  sx={{ color: '#1a237e', borderColor: '#1a237e', '&:hover': { borderColor: '#3949ab', bgcolor: 'rgba(26, 35, 126, 0.04)' } }}
                >
                  Learn More About Our School
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Group sx={{ color: '#1a237e', mt: 0.5 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 0.5 }}>
                  Meet Our Staff
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  Get to know our dedicated teachers and staff who will guide your child's educational journey.
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  href="/staff" 
                  sx={{ color: '#1a237e', borderColor: '#1a237e', '&:hover': { borderColor: '#3949ab', bgcolor: 'rgba(26, 35, 126, 0.04)' } }}
                >
                  View Our Staff
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Application Process Overview - Plain Text Version */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ color: '#1a237e', fontWeight: 700, mb: 3 }}>
            Application Process Overview
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Person sx={{ fontSize: 32, color: '#1a237e' }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                  1. Complete Application
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, pl: 7 }}>
                Fill out our comprehensive online application form with your child's and family information. The form is divided into clear sections to make the process straightforward and manageable.
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <ContactPhone sx={{ fontSize: 32, color: '#1a237e' }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                  2. Initial Contact
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, pl: 7 }}>
                Our admissions team will review your application and contact you within 2-3 business days to discuss your application, answer any questions, and schedule the next steps.
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <School sx={{ fontSize: 32, color: '#1a237e' }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                  3. School Tour & Interview
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, pl: 7 }}>
                Visit our campus for a personalized tour where you'll meet with our staff and teachers, see our facilities, and experience our welcoming community firsthand. This is also an opportunity for us to get to know your family better.
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <CheckCircle sx={{ fontSize: 32, color: '#1a237e' }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                  4. Enrollment
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, pl: 7 }}>
                Once accepted, complete the enrollment process including document submission, fee payment, and orientation. Welcome your child to the Holy Cross family!
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Application Form */}
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', color: '#1a237e', fontWeight: 700, mb: 4 }}>
            Online Application Form
          </Typography>
          
          <Stepper 
            activeStep={activeStep} 
            orientation={isMobile ? 'vertical' : 'horizontal'}
            sx={{ mb: 4 }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {validationError && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }} role="alert" aria-live="polite">
              {validationError}
            </Alert>
          )}

          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ color: '#1a237e' }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleFinalSubmit : handleNext}
              sx={{
                backgroundColor: '#1a237e',
                '&:hover': { backgroundColor: '#0d1458' },
                px: 4,
                py: 1.5,
              }}
              disabled={submitting || loadingDocuments}
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {submitting 
                ? (activeStep === steps.length - 1 ? 'Submitting...' : 'Processing...')
                : (activeStep === steps.length - 1 ? (applicationId ? 'Complete Application' : 'Submit Application') : 'Next')
              }
            </Button>
          </Box>
        </Paper>

        {/* Additional Information */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', color: '#1a237e', fontWeight: 700, mb: 4 }}>
            Important Information
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Application Requirements
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                      <ListItemText primary="Completed application form" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                      <ListItemText primary="Birth certificate (certified copy)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                      <ListItemText primary="Immunization certificate" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                      <ListItemText primary="Previous school report (if applicable)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                      <ListItemText primary="Proof of residence" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                      <ListItemText primary="Parent/Guardian ID copy" />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Important Dates
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemIcon><Schedule color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Application Deadline" 
                        secondary="Applications are accepted year-round, but early application is recommended" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Schedule color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="School Year" 
                        secondary="January to December" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Schedule color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Response Time" 
                        secondary="2-3 business days" 
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </Box>

        {/* Transport Providers Section */}
        <Box sx={{ py: 8, backgroundColor: '#f8f9fa', mt: 6 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: 'center',
                color: '#1a237e',
                fontWeight: 700,
                mb: 4,
                fontFamily: '"Lato", "Open Sans", sans-serif'
              }}
            >
              Transport Providers
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                mb: 4,
                color: '#666',
                fontFamily: '"Lato", "Open Sans", sans-serif'
              }}
            >
              We have compiled a list of reliable transport providers who service various areas around Brooklyn.
              Please note that these are private individuals and have no contracts with Holy Cross School.
            </Typography>
            
            <Paper sx={{ p: 4, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#d32f2f', fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Transport Contacts and Areas
              </Typography>
              <TableContainer>
                <Table sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#1a237e' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }} scope="col">Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }} scope="col">Areas</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }} scope="col">Contact Numbers</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Gwenneth Samuels</TableCell>
                      <TableCell>Milnerton, Sanddrift, Bothasig, Edgemead, Monte Vista</TableCell>
                      <TableCell>+27 61 872 0074</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Ronald</TableCell>
                      <TableCell>Brooklyn, Ysterplaat, Milnerton, Rugby, Sanddrift, and areas up to Paddocks</TableCell>
                      <TableCell>+27 73 461 5486</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cecilia Bless</TableCell>
                      <TableCell>Maitland, Ysterplaat</TableCell>
                      <TableCell>+27 63 931 2639</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Brother of all Kids</TableCell>
                      <TableCell>Maitland, Kensington, Ysterplaat, Brooklyn</TableCell>
                      <TableCell>+27 69 381 7478</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Michael</TableCell>
                      <TableCell>Kensington</TableCell>
                      <TableCell>+27 73 774 8799</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Craig/Tara Campbell</TableCell>
                      <TableCell>Milnerton, Brooklyn, Tygerhof, Sanddrift, Rugby (Surrounds)</TableCell>
                      <TableCell>+27 83 342 5446</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Maggie</TableCell>
                      <TableCell>Milnerton, Tygerhof, Ysterplaat (Surrounds)</TableCell>
                      <TableCell>+27 72 717 1265</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Chris</TableCell>
                      <TableCell>Tygerhof, Ysterplaat (Surrounds)</TableCell>
                      <TableCell>+27 73 630 0404</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Avrin</TableCell>
                      <TableCell>Most areas</TableCell>
                      <TableCell>+27 82 818 3222</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Nyalleng</TableCell>
                      <TableCell>Milnerton, Tygerhof (surrounding)</TableCell>
                      <TableCell>+27 60 764 6543</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Alert severity="warning" sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                  <strong>PLEASE NOTE:</strong> These are private individuals and have no contracts or interest between the Holy Cross School and the drivers. 
                  They are independent. These are contacts given to us, Holy Cross are not in any way liable or responsible for any occurrence or things going missing etc. 
                  This is between yourself and your driver.
                </Typography>
              </Alert>
            </Paper>
          </Container>
        </Box>

        {/* Grade R Uniforms Section */}
        <Box sx={{ py: 8, backgroundColor: '#ffffff' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: 'center',
                color: '#1a237e',
                fontWeight: 700,
                mb: 4,
                fontFamily: '"Lato", "Open Sans", sans-serif'
              }}
            >
              Grade R School Uniforms
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 6 }}>
              {/* Summer Uniform */}
              <Paper sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, p: 4, border: '2px solid #d32f2f' }}>
                <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 600, mb: 3, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                  Summer Uniform
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                    Girls:
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif', pl: 2 }}>
                    • School golf shirt<br />
                    • Royal blue school skorts/shorts<br />
                    • Royal blue school jersey (long or sleeveless)<br />
                    • White takkies and white socks
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                    Boys:
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif', pl: 2 }}>
                    • School golf shirt<br />
                    • Royal blue school shorts<br />
                    • Royal blue school jersey (long or sleeveless)<br />
                    • White takkies and white socks
                  </Typography>
                </Box>
              </Paper>

              {/* Winter Uniform */}
              <Paper sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, p: 4, border: '2px solid #1a237e' }}>
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 3, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                  Winter Uniform
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                    Girls:
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif', pl: 2 }}>
                    • School tracksuit<br />
                    • Long-sleeved school shirt<br />
                    • Royal blue school jersey (long or sleeveless)<br />
                    • White takkies and white socks
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                    Boys:
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif', pl: 2 }}>
                    • School tracksuit<br />
                    • Long-sleeved school golf shirt<br />
                    • Royal blue school jersey (long or sleeveless)<br />
                    • White takkies and white socks
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Stockist Information */}
            <Paper sx={{ p: 4, backgroundColor: '#f8f9fa', border: '2px solid #ffd700' }}>
              <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 3, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                Our Stockist
              </Typography>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                De Jagers Outfitters in Bellville
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif', mb: 2 }}>
                <strong>Address:</strong> Willowbridge Mall, 39 Carl Cronje Road, Tygervalley
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif', mb: 3 }}>
                <strong>Telephone:</strong> +27 (21) 914 7816
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>
                <strong>Note:</strong> Tracksuits, long-sleeved golf shirts and school backpacks may be ordered and purchased from school.
              </Typography>
            </Paper>
          </Container>
        </Box>

        {/* Contact Information */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#1a237e', fontWeight: 600, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
            Need Help with Your Application?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, fontFamily: '"Lato", "Open Sans", sans-serif' }}>
            Our admissions team is here to help you through the application process.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 1, color: '#1a237e' }} />
              <Typography variant="body1" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>+27 21 511 4337</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 1, color: '#1a237e' }} />
              <Typography variant="body1" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>admin@holycrossbrooklyn.co.za</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 1, color: '#1a237e' }} />
              <Typography variant="body1" sx={{ fontFamily: '"Lato", "Open Sans", sans-serif' }}>162 Koeberg Road, Brooklyn</Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={() => {
          setSuccessDialogOpen(false);
          // Reset form after dialog closes (only if application was completed, not just created)
          if (isApplicationCompleted) {
            resetFormAfterSuccess();
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: '"Poppins", sans-serif', color: '#4caf50', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle sx={{ fontSize: 32 }} />
          Application Submitted Successfully
        </DialogTitle>
        <DialogContent>
          <Box sx={{ fontFamily: '"Poppins", sans-serif', fontSize: '1rem', lineHeight: 1.8 }}>
            {successMessage.split('\n').map((line, index) => (
              <Typography 
                key={index} 
                component="p" 
                sx={{ mb: line.trim() === '' ? 1 : 0.5 }}
              >
                {line || '\u00A0'}
              </Typography>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setSuccessDialogOpen(false);
              // Reset form after dialog closes (only if application was completed, not just created)
              if (isApplicationCompleted) {
                resetFormAfterSuccess();
              }
            }}
            variant="contained"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              backgroundColor: '#1a237e',
              '&:hover': { backgroundColor: '#0d1458' }
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
        </>
      )}
    </>
  );
};

export default ApplicationProcess;