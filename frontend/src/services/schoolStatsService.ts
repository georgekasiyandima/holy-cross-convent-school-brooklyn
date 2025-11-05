import { SchoolStatsDisplay } from '../types/schoolStats';
import { API_BASE_URL_WITH_PREFIX } from './apiConfig';

const API_BASE_URL = API_BASE_URL_WITH_PREFIX;

export interface SchoolStatistic {
  id: string;
  key: string;
  value: string;
  label: string;
  icon: string;
  type: 'number' | 'percentage' | 'text';
  category: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStatisticData {
  key: string;
  value: string;
  label?: string;
  icon?: string;
  type?: 'number' | 'percentage' | 'text';
  order?: number;
  isVisible?: boolean;
}

class SchoolStatsService {
  private static instance: SchoolStatsService;

  public static getInstance(): SchoolStatsService {
    if (!SchoolStatsService.instance) {
      SchoolStatsService.instance = new SchoolStatsService();
    }
    return SchoolStatsService.instance;
  }

  /**
   * Get all visible statistics for public display
   */
  async getVisibleStats(): Promise<SchoolStatsDisplay[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/school-stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching visible school statistics:', error);
      // Return fallback data if API fails
      return this.getFallbackStats();
    }
  }

  /**
   * Get all statistics for admin management
   */
  async getAllStats(): Promise<SchoolStatistic[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/school-stats/admin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching admin school statistics:', error);
      throw error;
    }
  }

  /**
   * Create or update a school statistic
   */
  async saveStatistic(statData: CreateStatisticData): Promise<SchoolStatistic> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/school-stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(statData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error saving school statistic:', error);
      throw error;
    }
  }

  /**
   * Update a specific school statistic
   */
  async updateStatistic(key: string, statData: Partial<CreateStatisticData>): Promise<SchoolStatistic> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/school-stats/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(statData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating school statistic:', error);
      throw error;
    }
  }

  /**
   * Delete a school statistic
   */
  async deleteStatistic(key: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/school-stats/${key}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting school statistic:', error);
      throw error;
    }
  }

  /**
   * Initialize default statistics
   */
  async initializeDefaultStats(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/school-stats/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error initializing default statistics:', error);
      throw error;
    }
  }

  /**
   * Fallback statistics when API is unavailable
   */
  private getFallbackStats(): SchoolStatsDisplay[] {
    return [
      {
        id: 'fallback-1',
        label: 'Years of Excellence',
        value: '64+',
        icon: 'TrendingUp',
        type: 'text'
      },
      {
        id: 'fallback-2',
        label: 'Learners',
        value: '250+',
        icon: 'People',
        type: 'number'
      },
      {
        id: 'fallback-3',
        label: 'Academic Success',
        value: '95%',
        icon: 'EmojiEvents',
        type: 'percentage'
      },
      {
        id: 'fallback-4',
        label: 'Character Development',
        value: '100%',
        icon: 'Psychology',
        type: 'percentage'
      }
    ];
  }
}

export default SchoolStatsService;

