import axios from 'axios';
import { API_BASE_URL_WITH_PREFIX } from './apiConfig';

export interface GoverningBodyMember {
  id: string;
  name: string;
  designation?: string | null;
  sector?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const api = axios.create({
  baseURL: `${API_BASE_URL_WITH_PREFIX}/governing-body`,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class GoverningBodyService {
  async getMembers(includeInactive = false): Promise<GoverningBodyMember[]> {
    const response = await api.get('/', {
      params: {
        includeInactive,
      },
    });
    return response.data.data || [];
  }

  async createMember(payload: Partial<GoverningBodyMember>): Promise<GoverningBodyMember> {
    const response = await api.post('/', payload);
    return response.data.data;
  }

  async updateMember(id: string, payload: Partial<GoverningBodyMember>): Promise<GoverningBodyMember> {
    const response = await api.put(`/${id}`, payload);
    return response.data.data;
  }

  async deleteMember(id: string): Promise<void> {
    await api.delete(`/${id}`);
  }
}

const governingBodyService = new GoverningBodyService();

export default governingBodyService;




