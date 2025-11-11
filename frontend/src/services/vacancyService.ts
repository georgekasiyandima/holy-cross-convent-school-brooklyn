import axios from 'axios';
import { API_BASE_URL_WITH_PREFIX } from './apiConfig';

export interface Vacancy {
  id: string;
  title: string;
  department: string; // TEACHING, ADMIN, SUPPORT, LEADERSHIP
  employmentType: string; // FULL_TIME, PART_TIME, CONTRACT, TEMPORARY
  location?: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  qualifications?: string[];
  salaryRange?: string;
  closingDate?: string;
  startDate?: string;
  isPublished: boolean;
  isUrgent: boolean;
  applicationEmail?: string;
  applicationInstructions?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface VacancyApiResponse {
  success: boolean;
  data: Vacancy | Vacancy[];
  message?: string;
}

class VacancyService {
  private baseUrl = `${API_BASE_URL_WITH_PREFIX}/vacancies`;

  /**
   * Get all published vacancies (public)
   */
  async getPublishedVacancies(): Promise<Vacancy[]> {
    try {
      const response = await axios.get<VacancyApiResponse>(this.baseUrl);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching published vacancies:', error);
      throw error;
    }
  }

  /**
   * Get a single published vacancy by ID (public)
   */
  async getVacancyById(id: string): Promise<Vacancy | null> {
    try {
      const response = await axios.get<VacancyApiResponse>(`${this.baseUrl}/${id}`);
      if (response.data.success && response.data.data) {
        return Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching vacancy:', error);
      return null;
    }
  }

  /**
   * Get all vacancies including unpublished (admin only)
   */
  async getAllVacancies(options: {
    department?: string;
    publishedOnly?: boolean;
    isUrgent?: boolean;
  } = {}): Promise<Vacancy[]> {
    try {
      const params = new URLSearchParams();
      if (options.department) params.append('department', options.department);
      if (options.publishedOnly) params.append('publishedOnly', 'true');
      if (options.isUrgent !== undefined) params.append('isUrgent', options.isUrgent.toString());

      const queryString = params.toString();
      const url = `${this.baseUrl}/admin/all${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get<VacancyApiResponse>(url);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching all vacancies:', error);
      throw error;
    }
  }

  /**
   * Get a single vacancy by ID (admin - includes unpublished)
   */
  async getVacancyByIdAdmin(id: string): Promise<Vacancy | null> {
    try {
      const response = await axios.get<VacancyApiResponse>(`${this.baseUrl}/admin/${id}`);
      if (response.data.success && response.data.data) {
        return Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching vacancy:', error);
      return null;
    }
  }

  /**
   * Create a new vacancy (admin only)
   */
  async createVacancy(data: Partial<Vacancy>): Promise<Vacancy> {
    try {
      const response = await axios.post<VacancyApiResponse>(`${this.baseUrl}/admin`, data);
      if (response.data.success && response.data.data) {
        return Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
      }
      throw new Error('Failed to create vacancy');
    } catch (error) {
      console.error('Error creating vacancy:', error);
      throw error;
    }
  }

  /**
   * Update a vacancy (admin only)
   */
  async updateVacancy(id: string, data: Partial<Vacancy>): Promise<Vacancy> {
    try {
      const response = await axios.put<VacancyApiResponse>(`${this.baseUrl}/admin/${id}`, data);
      if (response.data.success && response.data.data) {
        return Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
      }
      throw new Error('Failed to update vacancy');
    } catch (error) {
      console.error('Error updating vacancy:', error);
      throw error;
    }
  }

  /**
   * Delete a vacancy (admin only)
   */
  async deleteVacancy(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/admin/${id}`);
    } catch (error) {
      console.error('Error deleting vacancy:', error);
      throw error;
    }
  }
}

const vacancyService = new VacancyService();

export default vacancyService;

