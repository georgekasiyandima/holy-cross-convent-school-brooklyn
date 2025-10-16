import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

//---------------------------------------------------------
// TYPES & INTERFACES
//---------------------------------------------------------
export interface Image {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  thumbnailUrl: string;
  fileSize: number;
  mimeType: string;
  category: 'gallery' | 'staff' | 'news' | 'events' | 'other';
  tags: string[];
  isPublished: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  width?: number;
  height?: number;
}

export interface ImageUpload {
  title: string;
  description: string;
  category: 'gallery' | 'staff' | 'news' | 'events' | 'other';
  tags: string[];
  isPublished: boolean;
  file: File;
}

export interface ImageResponse {
  success: boolean;
  data: Image | Image[];
  count?: number;
  message?: string;
  error?: string;
}

//---------------------------------------------------------
// API CONFIGURATION
//---------------------------------------------------------
const BASE = API_BASE_URL;

const api = axios.create({
  baseURL: BASE,
  timeout: 30000, // 30 seconds for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

//---------------------------------------------------------
// IMAGE SERVICE CLASS
//---------------------------------------------------------
class ImageService {
  private static instance: ImageService;

  public static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }

  //---------------------------------------------------------
  // IMAGE CRUD OPERATIONS
  //---------------------------------------------------------

  /**
   * Get all images by category
   */
  async getImagesByCategory(category: string, published: boolean = true): Promise<Image[]> {
    try {
      const response = await api.get(`/api/gallery/category/${category}?published=${published}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw new Error('Failed to fetch images');
    }
  }

  /**
   * Get image by ID
   */
  async getImageById(category: string, id: string): Promise<Image> {
    try {
      const response = await api.get(`/api/gallery/${category}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching image:', error);
      throw new Error('Failed to fetch image');
    }
  }

  /**
   * Upload image
   */
  async uploadImage(category: string, imageData: ImageUpload): Promise<Image> {
    try {
      const formData = new FormData();
      formData.append('file', imageData.file);
      formData.append('title', imageData.title);
      formData.append('description', imageData.description);
      formData.append('isPublished', imageData.isPublished.toString());
      formData.append('tags', JSON.stringify(imageData.tags));

      const response = await api.post(`/api/gallery/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Update image
   */
  async updateImage(category: string, id: string, updates: Partial<Image>): Promise<Image> {
    try {
      const response = await api.put(`/api/gallery/${category}/${id}`, updates);
      return response.data.data;
    } catch (error) {
      console.error('Error updating image:', error);
      throw new Error('Failed to update image');
    }
  }

  /**
   * Delete image
   */
  async deleteImage(category: string, id: string): Promise<void> {
    try {
      await api.delete(`/api/gallery/${category}/${id}`);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  /**
   * Publish/Unpublish image
   */
  async togglePublishStatus(category: string, id: string, isPublished: boolean): Promise<Image> {
    try {
      const response = await api.patch(`/api/gallery/${category}/${id}/publish`, {
        isPublished
      });
      return response.data.data;
    } catch (error) {
      console.error('Error toggling publish status:', error);
      throw new Error('Failed to update publish status');
    }
  }

  //---------------------------------------------------------
  // UTILITY METHODS
  //---------------------------------------------------------

  /**
   * Get image categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await api.get('/api/gallery/categories');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['gallery', 'staff', 'news', 'events', 'other'];
    }
  }

  /**
   * Search images
   */
  async searchImages(query: string, category?: string): Promise<Image[]> {
    try {
      const params = new URLSearchParams({ q: query });
      if (category) params.append('category', category);
      
      const response = await api.get(`/api/gallery/search?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching images:', error);
      throw new Error('Failed to search images');
    }
  }

  /**
   * Get image statistics
   */
  async getImageStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    published: number;
    unpublished: number;
  }> {
    try {
      const response = await api.get('/api/gallery/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching image stats:', error);
      throw new Error('Failed to fetch image statistics');
    }
  }

  //---------------------------------------------------------
  // FILE VALIDATION
  //---------------------------------------------------------

  /**
   * Validate image file type and size
   */
  validateImageFile(file: File, maxSize: number = 5 * 1024 * 1024): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Image size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      };
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Image type not supported. Please upload JPEG, PNG, WebP, or GIF images.'
      };
    }

    return { valid: true };
  }

  /**
   * Get image dimensions
   */
  getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Create thumbnail
   */
  createThumbnail(file: File, maxWidth: number = 300, maxHeight: number = 300): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate thumbnail dimensions
        let { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;

        canvas.width = width;
        canvas.height = height;

        // Draw thumbnail
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => {
        reject(new Error('Failed to create thumbnail'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get initials from a name string
   */
  getInitials(name: string): string {
    if (!name || typeof name !== 'string') return '?';
    
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * Load and optimize image with configuration
   */
  async loadImage(src: string, config?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  }): Promise<string> {
    try {
      // For now, return the original src as we don't have image optimization service
      // In a production environment, this would call an image optimization service
      // like Cloudinary, ImageKit, or a custom optimization endpoint
      
      if (!src) {
        throw new Error('No image source provided');
      }

      // Basic validation
      if (!src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
        throw new Error('Invalid image source');
      }

      // Return the original URL for now
      // TODO: Implement actual image optimization
      return src;
    } catch (error) {
      console.error('Error loading image:', error);
      throw error;
    }
  }

  /**
   * Get optimized image URL with configuration
   */
  getOptimizedImageUrl(src: string, config?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  }): string {
    if (!src) return '';
    
    // For now, return the original URL
    // In production, this would generate optimized URLs
    // TODO: Implement actual image optimization service integration
    return src;
  }

  /**
   * Preload images with configuration
   */
  async preloadImages(imageUrls: string[], config?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  }): Promise<void> {
    try {
      const preloadPromises = imageUrls.map(url => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
          img.src = url;
        });
      });

      await Promise.all(preloadPromises);
    } catch (error) {
      console.error('Error preloading images:', error);
      throw error;
    }
  }
}

export default ImageService;