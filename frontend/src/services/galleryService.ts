import axios from 'axios';
import { API_BASE_URL as CONFIG_API_BASE_URL, API_BASE_URL_WITH_PREFIX } from './apiConfig';

// Use centralized API config
const API_URL = CONFIG_API_BASE_URL.replace('/api', '') || 'http://localhost:5000';
const API_BASE_URL = `${API_BASE_URL_WITH_PREFIX}/gallery`;

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: 'IMAGE' | 'VIDEO';
  filePath: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  tags: string[];
  isPublished: boolean;
  uploadedBy?: string;
  albumId?: string;
  createdAt: string;
  updatedAt: string;
  album?: Album;
}

export interface Album {
  id: string;
  title: string;
  description?: string;
  albumType: 'GENERAL' | 'CLASS';
  classGrade?: string;
  phase?: string;
  coverImageId?: string;
  isPublished: boolean;
  parentAlbumId?: string | null;
  createdAt: string;
  updatedAt: string;
  coverImage?: GalleryItem;
  items?: GalleryItem[];
  subAlbums?: Album[];
  _count?: {
    items: number;
    subAlbums?: number;
  };
}

export interface GalleryResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedGalleryResponse {
  items: GalleryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface GalleryFilters {
  category?: string;
  type?: 'IMAGE' | 'VIDEO';
  albumId?: string;
  page?: number;
  limit?: number;
  isPublished?: boolean;
}

class GalleryService {
  private static instance: GalleryService;
  private token: string | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('adminToken');
    }
  }

  public static getInstance(): GalleryService {
    if (!GalleryService.instance) {
      GalleryService.instance = new GalleryService();
    }
    // Always refresh token from localStorage when getting instance
    if (typeof window !== 'undefined') {
      GalleryService.instance.token = localStorage.getItem('adminToken');
    }
    return GalleryService.instance;
  }

  private getAuthHeaders() {
    // Always get fresh token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Get image URL helper (public method)
  getItemImageUrl(fileName: string): string {
    if (!fileName) {
      return '/placeholder-image.jpg'; // Fallback for missing images
    }
    if (fileName.startsWith('http')) {
      return fileName;
    }
    // Construct the URL using the backend base URL
    // Remove /api if present to get base URL
    let baseUrl = API_URL;
    if (baseUrl.includes('/api')) {
      baseUrl = baseUrl.replace('/api', '');
    }
    // Remove trailing slash if present
    baseUrl = baseUrl.replace(/\/$/, '');
    // Return the full URL - files are stored in uploads/gallery/ directory
    const imageUrl = `${baseUrl}/uploads/gallery/${encodeURIComponent(fileName)}`;
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Gallery image URL:', { fileName, imageUrl, baseUrl });
    }
    return imageUrl;
  }

  // Get gallery items with filters
  async getGalleryItems(filters: GalleryFilters = {}): Promise<PaginatedGalleryResponse> {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.type) params.append('type', filters.type);
      if (filters.albumId) params.append('albumId', filters.albumId);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.isPublished !== undefined) params.append('isPublished', filters.isPublished.toString());

      const response = await axios.get<GalleryResponse<PaginatedGalleryResponse>>(
        `${API_BASE_URL}?${params.toString()}`
      );

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch gallery items');
    } catch (error: any) {
      console.error('Error fetching gallery items:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch gallery items');
    }
  }

  // Get single gallery item
  async getGalleryItemById(id: string): Promise<GalleryItem> {
    try {
      const response = await axios.get<GalleryResponse<GalleryItem>>(`${API_BASE_URL}/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Gallery item not found');
    } catch (error: any) {
      console.error('Error fetching gallery item:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch gallery item');
    }
  }

  // Upload gallery item
  async uploadGalleryItem(
    file: File,
    data: {
      title: string;
      description?: string;
      category: string;
      tags?: string[];
      albumId?: string;
      isPublished?: boolean;
      postToSocial?: boolean;
    }
  ): Promise<GalleryItem> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      formData.append('category', data.category);
      if (data.tags) formData.append('tags', Array.isArray(data.tags) ? data.tags.join(',') : data.tags);
      if (data.albumId) formData.append('albumId', data.albumId);
      if (data.isPublished !== undefined) formData.append('isPublished', data.isPublished.toString());
      if (data.postToSocial) formData.append('postToSocial', 'true');

      const response = await axios.post<GalleryResponse<GalleryItem>>(
        `${API_BASE_URL}/upload`,
        formData,
        {
          headers: {
            ...this.getAuthHeaders(),
            // Don't set Content-Type - let axios/browser set it with boundary automatically
          },
        }
      );

      if (response.data && response.data.success) {
        // Ensure tags is always an array
        const item = response.data.data;
        if (!item) {
          throw new Error('Invalid response: no data returned');
        }
        if (item && typeof item.tags === 'string') {
          try {
            item.tags = JSON.parse(item.tags);
          } catch {
            item.tags = [];
          }
        } else if (!item.tags) {
          item.tags = [];
        }
        return item;
      }
      throw new Error(response.data?.error || response.data?.message || 'Failed to upload gallery item');
    } catch (error: any) {
      console.error('Error uploading gallery item:', error);
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessage = errorData.error || errorData.message || error.message || 'Failed to upload gallery item';
        throw new Error(errorMessage);
      }
      throw new Error(error.message || 'Failed to upload gallery item');
    }
  }

  // Update gallery item
  async updateGalleryItem(
    id: string,
    data: {
      title?: string;
      description?: string;
      category?: string;
      tags?: string[];
      albumId?: string | null;
      isPublished?: boolean;
    }
  ): Promise<GalleryItem> {
    try {
      const response = await axios.put<GalleryResponse<GalleryItem>>(
        `${API_BASE_URL}/${id}`,
        data,
        { headers: this.getAuthHeaders() }
      );

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to update gallery item');
    } catch (error: any) {
      console.error('Error updating gallery item:', error);
      throw new Error(error.response?.data?.error || 'Failed to update gallery item');
    }
  }

  // Delete gallery item
  async deleteGalleryItem(id: string): Promise<void> {
    try {
      const response = await axios.delete<GalleryResponse<{ message: string }>>(
        `${API_BASE_URL}/${id}`,
        { headers: this.getAuthHeaders() }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete gallery item');
      }
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete gallery item');
    }
  }

  // Get all albums
  async getAlbums(filters?: {
    albumType?: 'GENERAL' | 'CLASS';
    classGrade?: string;
    phase?: string;
    parentAlbumId?: string | null;
    isPublished?: boolean;
  }): Promise<Album[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.albumType) params.append('albumType', filters.albumType);
      if (filters?.classGrade) params.append('classGrade', filters.classGrade);
      if (filters?.phase) params.append('phase', filters.phase);
      if (filters?.parentAlbumId !== undefined) {
        params.append('parentAlbumId', filters.parentAlbumId === null ? 'null' : filters.parentAlbumId);
      }
      if (filters?.isPublished !== undefined) params.append('isPublished', filters.isPublished.toString());

      const response = await axios.get<GalleryResponse<Album[]>>(
        `${API_BASE_URL}/albums${params.toString() ? `?${params.toString()}` : ''}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch albums');
    } catch (error: any) {
      console.error('Error fetching albums:', error);
      if (error.response?.status === 404) {
        // Return empty array if endpoint not found (might not be implemented yet)
        console.warn('Albums endpoint returned 404, returning empty array');
        return [];
      }
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch albums';
      throw new Error(errorMessage);
    }
  }

  // Get single album
  async getAlbumById(id: string): Promise<Album> {
    try {
      const response = await axios.get<GalleryResponse<Album>>(`${API_BASE_URL}/albums/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Album not found');
    } catch (error: any) {
      console.error('Error fetching album:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch album');
    }
  }

  // Create album
  async createAlbum(data: {
    title: string;
    description?: string;
    albumType?: 'GENERAL' | 'CLASS';
    classGrade?: string;
    phase?: string;
    coverImageId?: string;
    parentAlbumId?: string | null;
    isPublished?: boolean;
  }): Promise<Album> {
    try {
      const response = await axios.post<GalleryResponse<Album>>(
        `${API_BASE_URL}/albums`,
        data,
        { headers: this.getAuthHeaders() }
      );

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to create album');
    } catch (error: any) {
      console.error('Error creating album:', error);
      throw new Error(error.response?.data?.error || 'Failed to create album');
    }
  }

  // Update album
  async updateAlbum(
    id: string,
    data: {
      title?: string;
      description?: string;
      albumType?: 'GENERAL' | 'CLASS';
      classGrade?: string | null;
      phase?: string | null;
      coverImageId?: string | null;
      parentAlbumId?: string | null;
      isPublished?: boolean;
    }
  ): Promise<Album> {
    try {
      const response = await axios.put<GalleryResponse<Album>>(
        `${API_BASE_URL}/albums/${id}`,
        data,
        { headers: this.getAuthHeaders() }
      );

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to update album');
    } catch (error: any) {
      console.error('Error updating album:', error);
      throw new Error(error.response?.data?.error || 'Failed to update album');
    }
  }

  // Delete album
  async deleteAlbum(id: string): Promise<void> {
    try {
      const response = await axios.delete<GalleryResponse<{ message: string }>>(
        `${API_BASE_URL}/albums/${id}`,
        { headers: this.getAuthHeaders() }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete album');
      }
    } catch (error: any) {
      console.error('Error deleting album:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete album');
    }
  }

  // Get categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await this.getGalleryItems({ limit: 1000 });
      const categories = new Set(response.items.map(item => item.category));
      return Array.from(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Get class photos albums (Grade R - Grade 7)
  async getClassPhotosAlbums(): Promise<Album[]> {
    try {
      const albums = await this.getAlbums({
        albumType: 'CLASS',
        isPublished: true
      });
      
      // Sort by grade (Grade R, Grade 1, ..., Grade 7)
      const gradeOrder = ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'];
      return albums.sort((a, b) => {
        const aIndex = gradeOrder.indexOf(a.classGrade || '');
        const bIndex = gradeOrder.indexOf(b.classGrade || '');
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    } catch (error) {
      console.error('Error fetching class photos:', error);
      return [];
    }
  }

  // Get events/occasions albums
  async getEventsAlbums(): Promise<Album[]> {
    try {
      const albums = await this.getAlbums({
        albumType: 'GENERAL',
        isPublished: true
      });
      
      return albums;
    } catch (error) {
      console.error('Error fetching events albums:', error);
      return [];
    }
  }
}

// Export the service instance
const galleryServiceInstance = GalleryService.getInstance();
export default galleryServiceInstance;
