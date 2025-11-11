import axios from 'axios';
import { API_BASE_URL_WITH_PREFIX } from './apiConfig';

export interface AdminAnnouncement {
  id: string;
  title: string;
  content: string;
  summary?: string | null;
  imageUrl?: string | null;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  priority?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    email?: string | null;
  } | null;
}

export interface AdminAnnouncementPayload {
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string | null;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  priority?: string;
  isPublished?: boolean;
  publishedAt?: string | null;
}

export interface UploadResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  isPublished: boolean;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType?: string;
  uploadedAt: string;
}

const api = axios.create({
  baseURL: `${API_BASE_URL_WITH_PREFIX}/news`,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class AdminAnnouncementsService {
  async listAnnouncements(params?: {
    status?: 'all' | 'published' | 'draft';
    search?: string;
    priority?: string;
    limit?: number;
  }): Promise<AdminAnnouncement[]> {
    const response = await api.get('/manage', { params });
    return response.data?.data || [];
  }

  async createAnnouncement(payload: AdminAnnouncementPayload): Promise<AdminAnnouncement> {
    const response = await api.post('/', payload);
    return response.data?.data?.article;
  }

  async updateAnnouncement(id: string, payload: AdminAnnouncementPayload): Promise<AdminAnnouncement> {
    const response = await api.put(`/${id}`, payload);
    return response.data?.data?.article;
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await api.delete(`/${id}`);
  }

  async uploadAsset(file: File, options?: { title?: string; description?: string; category?: string }): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', options?.title || file.name);
    formData.append('description', options?.description || '');
    formData.append('category', options?.category || 'announcements');
    formData.append('isPublished', 'true');

    const response = await api.post('/upload-document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data?.data;
  }
}

const adminAnnouncementsService = new AdminAnnouncementsService();

export default adminAnnouncementsService;

