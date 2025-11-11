import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string | null;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  type: 'news' | 'newsletter';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'MEDIUM';
  publishedAt: string;
  createdAt: string;
  updatedAt?: string;
  author?: {
    id: string;
    name: string;
    email?: string;
  };
}

export interface AnnouncementsResponse {
  success: boolean;
  data: Announcement[];
  count: number;
  total?: number;
}

class AnnouncementsService {
  /**
   * Get all announcements (news + newsletters)
   */
  async getAnnouncements(options?: {
    limit?: number;
    priority?: string;
    type?: 'news' | 'newsletter';
    published?: boolean;
  }): Promise<AnnouncementsResponse> {
    try {
      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.priority) params.append('priority', options.priority);
      if (options?.type) params.append('type', options.type);
      if (options?.published !== undefined) params.append('published', options.published.toString());

      const response = await axios.get<AnnouncementsResponse>(
        `${API_BASE_URL}/school-hub/announcements?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  }

  /**
   * Get latest announcements (for home page)
   */
  async getLatestAnnouncements(limit: number = 5): Promise<AnnouncementsResponse> {
    try {
      const response = await axios.get<AnnouncementsResponse>(
        `${API_BASE_URL}/school-hub/announcements/latest?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching latest announcements:', error);
      throw error;
    }
  }
}

const announcementsService = new AnnouncementsService();

export default announcementsService;


