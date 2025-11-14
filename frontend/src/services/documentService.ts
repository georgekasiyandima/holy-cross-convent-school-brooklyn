import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, API_BASE_URL_WITH_PREFIX } from './apiConfig';

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
  type: string;
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
  type?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  file: File;
}

export interface UploadProgress {
  onProgress?: (percent: number) => void;
}

// Helper function to safely extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};

//---------------------------------------------------------
// API CONFIGURATION
//---------------------------------------------------------
const createApiInstance = (): AxiosInstance => {
  const apiInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Critical Fix #3: Include credentials for cookies
  });

  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Critical Fix #1: Token refresh interceptor
  apiInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const refreshResponse = await axios.post(
              `${API_BASE_URL}/api/auth/refresh`,
              { refreshToken },
              { withCredentials: true }
            );

            const newToken = refreshResponse.data?.token || refreshResponse.data?.data?.token;
            if (newToken) {
              localStorage.setItem('adminToken', newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return apiInstance(originalRequest);
            }
          }
        } catch (refreshError) {
          // Refresh failed, clear storage and redirect
          if (process.env.NODE_ENV !== 'production') {
            console.error('Token refresh failed:', refreshError);
          }
        }

        // If refresh fails or no refresh token, clear and redirect
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('refreshToken');
        window.location.href = '/admin/login';
      }

      return Promise.reject(error);
    }
  );

  return apiInstance;
};

const api = createApiInstance();

//---------------------------------------------------------
// DOCUMENT SERVICE CLASS
//---------------------------------------------------------
class DocumentService {
  private static instance: DocumentService;
  // Critical Fix #5: Configurable max file size
  private readonly MAX_FILE_SIZE: number = 10 * 1024 * 1024; // 10MB default

  constructor(private apiInstance: AxiosInstance = api, maxFileSize?: number) {
    if (maxFileSize) {
      this.MAX_FILE_SIZE = maxFileSize;
    }
  }

  public static getInstance(apiInstance?: AxiosInstance): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService(apiInstance);
    }
    return DocumentService.instance;
  }

  //-------------------------------------------------------
  // NORMALIZATION HELPERS
  //-------------------------------------------------------
  /**
   * Parse tags from various formats (array, JSON string, etc.)
   * Important Fix #8: Trim tags to remove empty strings
   */
  private parseTags(raw: unknown): string[] {
    if (Array.isArray(raw)) {
      return raw
        .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
        .map(tag => tag.trim());
    }

    if (typeof raw === 'string' && raw.trim().length > 0) {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed)
          ? parsed
              .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
              .map(tag => tag.trim())
          : [];
      } catch (error: unknown) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Failed to parse document tags JSON:', error);
        }
      }
    }

    return [];
  }

  /**
   * Normalize document data from API response
   * Critical Fix #6: Add fallback for missing fileUrl
   */
  private normalizeDocument = (doc: any): Document => {
    const createdAt = doc.createdAt || new Date().toISOString();
    const updatedAt = doc.updatedAt || createdAt;

    // Critical Fix #6: Provide fallback for fileUrl
    const fileUrl = doc.fileUrl || doc.filePath || doc.fileName || '';
    const normalizedFileUrl = fileUrl 
      ? this.getDocumentDownloadUrl(fileUrl)
      : `${API_BASE_URL}/uploads/documents/placeholder.pdf`;

    return {
      id: doc.id,
      title: doc.title,
      description: doc.description || '',
      fileName: doc.fileName || doc.title || 'document',
      fileUrl: normalizedFileUrl,
      fileSize: typeof doc.fileSize === 'number' ? doc.fileSize : 0,
      mimeType: doc.mimeType || 'application/pdf',
      type: doc.type || doc.category || 'other',
      category: doc.category || 'general',
      tags: this.parseTags(doc.tags),
      isPublished: Boolean(doc.isPublished),
      authorId: doc.authorId || '',
      authorName: doc.authorName || '',
      createdAt,
      updatedAt,
    };
  };

  private get documentsEndpoint(): string {
    return `${API_BASE_URL_WITH_PREFIX}/documents`;
  }

  //-------------------------------------------------------
  // READ OPERATIONS
  //-------------------------------------------------------
  /**
   * Get all published documents
   */
  async getAllPublishedDocuments(): Promise<Document[]> {
    const response = await this.apiInstance.get(`${this.documentsEndpoint}/all`);
    const docs = response.data?.data || [];
    const normalized = docs.map(this.normalizeDocument);
    return normalized.sort((a: Document, b: Document) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Get documents by category
   */
  async getDocumentsByCategory(category: string, published: boolean = true): Promise<Document[]> {
    const response = await this.apiInstance.get(`${this.documentsEndpoint}/${category}?published=${published}`);
    const docs = response.data?.data || [];
    return docs.map(this.normalizeDocument);
  }

  /**
   * Get a document by ID
   * Important Fix #14: Return null instead of empty object if not found
   */
  async getDocumentById(category: string, id: string): Promise<Document | null> {
    try {
      const response = await this.apiInstance.get(`${this.documentsEndpoint}/${category}/${id}`);
      const data = response.data?.data;
      if (!data || !data.id) {
        return null;
      }
      return this.normalizeDocument(data);
    } catch (error: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching document by ID:', error);
      }
      return null;
    }
  }

  //-------------------------------------------------------
  // WRITE OPERATIONS
  //-------------------------------------------------------
  /**
   * Upload a document with optional progress tracking
   * Important Fix #13: Add upload progress support
   */
  async uploadDocument(
    category: string,
    documentData: DocumentUpload,
    progress?: UploadProgress
  ): Promise<Document> {
    const formData = new FormData();
    formData.append('file', documentData.file);
    formData.append('title', documentData.title);
    formData.append('description', documentData.description || '');
    formData.append('category', category);
    if (documentData.type) {
      formData.append('type', documentData.type);
    }
    if (documentData.tags?.length) {
      formData.append('tags', JSON.stringify(documentData.tags));
    }
    formData.append('isPublished', documentData.isPublished.toString());

    const config: any = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // Critical Fix #3: Include credentials
    };

    // Add progress tracking if callback provided
    if (progress?.onProgress) {
      config.onUploadProgress = (progressEvent: any) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          progress.onProgress?.(percent);
        }
      };
    }

    const response = await this.apiInstance.post(`${this.documentsEndpoint}/upload`, formData, config);
    return this.normalizeDocument(response.data?.data || {});
  }

  async updateDocument(category: string, id: string, updates: Partial<Document>): Promise<Document> {
    const response = await this.apiInstance.put(`${this.documentsEndpoint}/${category}/${id}`, updates);
    return this.normalizeDocument(response.data?.data || {});
  }

  async deleteDocument(category: string, id: string): Promise<void> {
    await this.apiInstance.delete(`${this.documentsEndpoint}/${category}/${id}`);
  }

  async togglePublishStatus(category: string, id: string, isPublished: boolean): Promise<Document> {
    const response = await this.apiInstance.put(`${this.documentsEndpoint}/${category}/${id}`, { isPublished });
    return this.normalizeDocument(response.data?.data || {});
  }

  //-------------------------------------------------------
  // METADATA / SEARCH
  //-------------------------------------------------------
  /**
   * Get available categories
   * Important Fix #11: Try API first, fallback to client-side
   */
  async getCategories(): Promise<string[]> {
    try {
      // Try API endpoint first
      const response = await this.apiInstance.get(`${this.documentsEndpoint}/categories`);
      if (response.data?.categories && Array.isArray(response.data.categories)) {
        return response.data.categories;
      }
    } catch (error: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching categories from API:', error);
      }
    }

    // Fallback to client-side extraction
    try {
      const allDocs = await this.getAllPublishedDocuments();
      const categories = Array.from(new Set(allDocs.map((doc) => doc.category)));
      return categories.length ? categories : ['policy', 'form', 'admissions', 'fees', 'other'];
    } catch (error: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching categories:', error);
      }
      return ['policy', 'form', 'admissions', 'fees', 'other'];
    }
  }

  /**
   * Search documents
   * Important Fix #12: Use server-side search if available, fallback to client-side
   */
  async searchDocuments(query: string, category?: string): Promise<Document[]> {
    const lower = query.trim().toLowerCase();
    if (!lower) {
      return category ? this.getDocumentsByCategory(category) : this.getAllPublishedDocuments();
    }

    try {
      // Try server-side search first
      const params: any = { q: lower };
      if (category) {
        params.category = category;
      }
      const response = await this.apiInstance.get(`${this.documentsEndpoint}/search`, { params });
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data.map(this.normalizeDocument);
      }
    } catch (error: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Server-side search failed, falling back to client-side:', error);
      }
    }

    // Fallback to client-side search
    const sourceDocs = category
      ? await this.getDocumentsByCategory(category)
      : await this.getAllPublishedDocuments();

    return sourceDocs.filter((doc) =>
      doc.title.toLowerCase().includes(lower) ||
      doc.description.toLowerCase().includes(lower) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(lower))
    );
  }

  async getDocumentStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    published: number;
    unpublished: number;
  }> {
    try {
      const response = await this.apiInstance.get(`${this.documentsEndpoint}/stats`);
      return response.data?.data;
    } catch (error: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching document stats:', error);
      }
      const docs = await this.getAllPublishedDocuments();
      const total = docs.length;
      const byCategory = docs.reduce<Record<string, number>>((acc, doc) => {
        acc[doc.category] = (acc[doc.category] || 0) + 1;
        return acc;
      }, {});
      return {
        total,
        byCategory,
        published: total,
        unpublished: 0,
      };
    }
  }

  //-------------------------------------------------------
  // UTILITIES
  //-------------------------------------------------------
  /**
   * Get a signed download URL for a document (Critical Fix #2)
   * Uses secure endpoint that requires authentication
   * @param documentId - Document ID
   * @returns Signed download URL that expires
   */
  async getSignedDownloadUrl(documentId: string): Promise<string> {
    try {
      const response = await this.apiInstance.get(`${this.documentsEndpoint}/signed-url/${documentId}`);
      return response.data?.url || response.data?.data?.url || '';
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error getting signed download URL:', error);
      }
      throw new Error(`Failed to get download URL: ${errorMessage}`);
    }
  }

  /**
   * @deprecated Use getSignedDownloadUrl instead for secure access
   * Get public download URL (not recommended for production)
   */
  getDocumentDownloadUrl(fileUrl: string): string {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('getDocumentDownloadUrl is deprecated. Use getSignedDownloadUrl for secure access.');
    }
    if (!fileUrl) {
      return `${API_BASE_URL}/uploads/documents/placeholder.pdf`;
    }

    if (fileUrl.startsWith('http')) {
      return fileUrl;
    }

    if (fileUrl.startsWith('/')) {
      return `${API_BASE_URL}${fileUrl}`;
    }

    return `${API_BASE_URL}/uploads/documents/${fileUrl}`;
  }

  /**
   * Validate file before upload
   * Critical Fix #5: Use configurable MAX_FILE_SIZE
   */
  validateFile(file: File, maxSize?: number): { valid: boolean; error?: string } {
    const maxFileSize = maxSize || this.MAX_FILE_SIZE;
    if (file.size > maxFileSize) {
      return {
        valid: false,
        error: `File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`,
      };
    }

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
      'text/csv',
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not supported. Please upload PDF, images, or document files.',
      };
    }

    return { valid: true };
  }

  /**
   * Get file type category
   * Important Fix #9: More robust file type detection
   */
  getFileTypeCategory(mimeType: string): 'image' | 'document' | 'other' {
    if (mimeType.startsWith('image/')) return 'image';
    
    // Important Fix #9: More specific document type detection
    if (
      mimeType === 'application/pdf' ||
      mimeType.includes('word') ||
      mimeType.includes('excel') ||
      mimeType.includes('spreadsheet') ||
      mimeType.includes('presentation') ||
      mimeType.startsWith('text/') ||
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument'
    ) {
      return 'document';
    }
    
    return 'other';
  }

  /**
   * Format file size in human-readable format
   * Important Fix #10: Use 1024 (binary) for consistency with system file sizes
   */
  formatFileSize(bytes: number): string {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024; // Binary prefixes (standard for file sizes)
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    // Important Fix #10: Proper rounding
    const value = bytes / Math.pow(k, i);
    return `${Math.round(value * 100) / 100} ${sizes[i]}`;
  }
}

// Important Fix #7: Factory pattern for testability
export const createDocumentService = (apiInstance?: AxiosInstance, maxFileSize?: number): DocumentService => {
  return new DocumentService(apiInstance, maxFileSize);
};

// Default singleton instance
const DocumentServiceInstance = DocumentService.getInstance();
export default DocumentService;
export { DocumentServiceInstance };
