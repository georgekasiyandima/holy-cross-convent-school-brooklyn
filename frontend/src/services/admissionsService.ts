import axios from 'axios';
import { API_BASE_URL, API_BASE_URL_WITH_PREFIX } from './apiConfig';

export interface ApplicationData {
  // Learner Information
  surname: string;
  learnerName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gradeApplying: string;
  year: string;
  lastGradePassed?: string;
  hasRepeated?: boolean;
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
  
  // Responsible Party (if not parents)
  responsiblePartyName?: string;
  responsiblePartyAddress?: string;
  responsiblePartyRelationship?: string;
  responsiblePartyHomePhone?: string;
  responsiblePartyWorkPhone?: string;
  responsiblePartyCellPhone?: string;
  
  // Learner Address (if different from parents)
  learnerAddress?: string;
  
  // Religious Information
  religiousDenomination?: string;
  isBaptised?: boolean;
  parishChurch?: string;
  refugeeStatus?: boolean;
  homeLanguage?: string;
  
  // Family Information
  numberOfChildren?: string;
  childrenAges?: string;
  siblingsAtHolyCross?: boolean;
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
  
  // Terms and Conditions
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

export interface Application {
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
  
  // Responsible Party (if not parents)
  responsiblePartyName?: string;
  responsiblePartyAddress?: string;
  responsiblePartyRelationship?: string;
  responsiblePartyHomePhone?: string;
  responsiblePartyWorkPhone?: string;
  responsiblePartyCellPhone?: string;
  
  // Learner Address (if different from parents)
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
  submittedAt: string;
  updatedAt: string;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  applicationId?: number;
  errors?: any[];
}

export interface ApplicationsResponse {
  success: boolean;
  applications: Application[];
}

export interface ApplicationStatistics {
  total: number;
  pending: number;
  approved: number;
  enrolled: number;
  gradeDistribution: Array<{
    grade: string;
    _count: {
      grade: number;
    };
  }>;
  monthlyApplications: Array<{
    month: string;
    count: number;
  }>;
}

export const admissionsService = {
  // Submit a new application
  async submitApplication(data: ApplicationData): Promise<ApplicationResponse> {
    try {
      console.log('Submitting application to:', `${API_BASE_URL_WITH_PREFIX}/admissions/submit`);
      const response = await axios.post(
        `${API_BASE_URL_WITH_PREFIX}/admissions/submit`, 
        data,
        {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error submitting application:', error);
      console.error('Request URL:', error.config?.url);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Application endpoint not found. Please contact support.');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message ||
        'Failed to submit application. Please try again.'
      );
    }
  },

  // Get all applications (admin only)
  async getApplications(): Promise<ApplicationsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL_WITH_PREFIX}/admissions/applications`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch applications. Please try again.'
      );
    }
  },

  // Get application by ID (admin only)
  async getApplication(id: number): Promise<{ success: boolean; application: Application }> {
    try {
      const response = await axios.get(`${API_BASE_URL_WITH_PREFIX}/admissions/applications/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching application:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch application. Please try again.'
      );
    }
  },

  // Update application status (admin only)
  async updateApplicationStatus(
    id: number, 
    status: string, 
    notes?: string
  ): Promise<{ success: boolean; application: Application }> {
    try {
      const response = await axios.patch(`${API_BASE_URL_WITH_PREFIX}/admissions/applications/${id}/status`, {
        status,
        notes,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating application status:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to update application status. Please try again.'
      );
    }
  },

  // Get application statistics (admin only)
  async getApplicationStatistics(): Promise<{ success: boolean; statistics: ApplicationStatistics }> {
    try {
      const response = await axios.get(`${API_BASE_URL_WITH_PREFIX}/admissions/statistics`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching application statistics:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch application statistics. Please try again.'
      );
    }
  },
};

export default admissionsService;
