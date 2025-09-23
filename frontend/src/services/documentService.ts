import axios from 'axios';

//---------------------------------------------------------
// TYPES & INTERFACES
//---------------------------------------------------------
export interface Document {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  type: 'logo' | 'mission' | 'vision' | 'policy' | 'form' | 'other';
  category: string;
  tags: string[];
  isPublished: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUpload {
  title: string;
  description: string;
  type: 'logo' | 'mission' | 'vision' | 'policy' | 'form' | 'other';
  category: string;
  tags: string[];
  isPublished: boolean;
  file: File;
}

export interface DocumentResponse {
  success: boolean;
  data: Document | Document[];
  count?: number;
  message?: string;
  error?: string;
}

//---------------------------------------------------------
// API CONFIGURATION
//---------------------------------------------------------
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
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
// DOCUMENT SERVICE CLASS
//---------------------------------------------------------
class DocumentService {
  private static instance: DocumentService;

  public static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  //---------------------------------------------------------
  // DOCUMENT CRUD OPERATIONS
  //---------------------------------------------------------

  /**
   * Get all documents by category
   */
  async getDocumentsByCategory(category: string, published: boolean = true): Promise<Document[]> {
    try {
      const response = await api.get(`/api/documents/${category}?published=${published}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw new Error('Failed to fetch documents');
    }
  }

  /**
   * Get document by ID
   */
  async getDocumentById(category: string, id: string): Promise<Document> {
    try {
      const response = await api.get(`/api/documents/${category}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw new Error('Failed to fetch document');
    }
  }

  /**
   * Upload document
   */
  async uploadDocument(category: string, documentData: DocumentUpload): Promise<Document> {
    try {
      const formData = new FormData();
      formData.append('file', documentData.file);
      formData.append('title', documentData.title);
      formData.append('description', documentData.description);
      formData.append('isPublished', documentData.isPublished.toString());
      formData.append('tags', JSON.stringify(documentData.tags));

      const response = await api.post(`/api/documents/${category}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          // You can emit progress events here if needed
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }
  }

  /**
   * Update document
   */
  async updateDocument(category: string, id: string, updates: Partial<Document>): Promise<Document> {
    try {
      const response = await api.put(`/api/documents/${category}/${id}`, updates);
      return response.data.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error('Failed to update document');
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(category: string, id: string): Promise<void> {
    try {
      await api.delete(`/api/documents/${category}/${id}`);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  }

  /**
   * Publish/Unpublish document
   */
  async togglePublishStatus(category: string, id: string, isPublished: boolean): Promise<Document> {
    try {
      const response = await api.patch(`/api/documents/${category}/${id}/publish`, {
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
   * Get document categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await api.get('/api/documents/categories');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['logo', 'mission', 'vision', 'policy', 'form', 'other'];
    }
  }

  /**
   * Search documents
   */
  async searchDocuments(query: string, category?: string): Promise<Document[]> {
    try {
      const params = new URLSearchParams({ q: query });
      if (category) params.append('category', category);
      
      const response = await api.get(`/api/documents/search?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching documents:', error);
      throw new Error('Failed to search documents');
    }
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    byType: Record<string, number>;
    published: number;
    unpublished: number;
  }> {
    try {
      const response = await api.get('/api/documents/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching document stats:', error);
      throw new Error('Failed to fetch document statistics');
    }
  }

  //---------------------------------------------------------
  // FILE VALIDATION
  //---------------------------------------------------------

  /**
   * Validate file type and size
   */
  validateFile(file: File, maxSize: number = 10 * 1024 * 1024): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      };
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not supported. Please upload PDF, images, or document files.'
      };
    }

    return { valid: true };
  }

  /**
   * Get file type category
   */
  getFileTypeCategory(mimeType: string): 'image' | 'document' | 'other' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document';
    return 'other';
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
}

export default DocumentService;
