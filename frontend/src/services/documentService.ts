import axios from 'axios';
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

//---------------------------------------------------------
// API CONFIGURATION
//---------------------------------------------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
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

  //-------------------------------------------------------
  // NORMALIZATION HELPERS
  //-------------------------------------------------------
  private parseTags(raw: unknown): string[] {
    if (Array.isArray(raw)) {
      return raw.filter((tag): tag is string => typeof tag === 'string');
    }

    if (typeof raw === 'string' && raw.trim().length > 0) {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed)
          ? parsed.filter((tag): tag is string => typeof tag === 'string')
          : [];
      } catch (error) {
        console.warn('Failed to parse document tags JSON:', error);
      }
    }

    return [];
  }

  private normalizeDocument = (doc: any): Document => {
    const createdAt = doc.createdAt || new Date().toISOString();
    const updatedAt = doc.updatedAt || createdAt;

    return {
      id: doc.id,
      title: doc.title,
      description: doc.description || '',
      fileName: doc.fileName || doc.title || 'document',
      fileUrl: this.getDocumentDownloadUrl(doc.fileUrl || doc.filePath || ''),
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
  async getAllPublishedDocuments(): Promise<Document[]> {
    const response = await api.get(`${this.documentsEndpoint}/all`);
    const docs = response.data?.data || [];
    const normalized = docs.map(this.normalizeDocument);
    return normalized.sort((a: Document, b: Document) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getDocumentsByCategory(category: string, published: boolean = true): Promise<Document[]> {
    const response = await api.get(`${this.documentsEndpoint}/${category}?published=${published}`);
    const docs = response.data?.data || [];
    return docs.map(this.normalizeDocument);
  }

  async getDocumentById(category: string, id: string): Promise<Document> {
    const response = await api.get(`${this.documentsEndpoint}/${category}/${id}`);
    return this.normalizeDocument(response.data?.data || {});
  }

  //-------------------------------------------------------
  // WRITE OPERATIONS
  //-------------------------------------------------------
  async uploadDocument(category: string, documentData: DocumentUpload): Promise<Document> {
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

    const response = await api.post(`${this.documentsEndpoint}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return this.normalizeDocument(response.data?.data || {});
  }

  async updateDocument(category: string, id: string, updates: Partial<Document>): Promise<Document> {
    const response = await api.put(`${this.documentsEndpoint}/${category}/${id}`, updates);
    return this.normalizeDocument(response.data?.data || {});
  }

  async deleteDocument(category: string, id: string): Promise<void> {
    await api.delete(`${this.documentsEndpoint}/${category}/${id}`);
  }

  async togglePublishStatus(category: string, id: string, isPublished: boolean): Promise<Document> {
    const response = await api.put(`${this.documentsEndpoint}/${category}/${id}`, { isPublished });
    return this.normalizeDocument(response.data?.data || {});
  }

  //-------------------------------------------------------
  // METADATA / SEARCH (CLIENT-SIDE FALLBACKS)
  //-------------------------------------------------------
  async getCategories(): Promise<string[]> {
    try {
      const allDocs = await this.getAllPublishedDocuments();
      const categories = Array.from(new Set(allDocs.map((doc) => doc.category)));
      return categories.length ? categories : ['policy', 'form', 'admissions', 'fees', 'other'];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['policy', 'form', 'admissions', 'fees', 'other'];
    }
  }

  async searchDocuments(query: string, category?: string): Promise<Document[]> {
    const lower = query.trim().toLowerCase();
    if (!lower) {
      return category ? this.getDocumentsByCategory(category) : this.getAllPublishedDocuments();
    }

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
      const response = await api.get(`${this.documentsEndpoint}/stats`);
      return response.data?.data;
    } catch (error) {
      console.error('Error fetching document stats:', error);
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
  getDocumentDownloadUrl(fileUrl: string): string {
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

  validateFile(file: File, maxSize: number = 10 * 1024 * 1024): { valid: boolean; error?: string } {
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
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

  getFileTypeCategory(mimeType: string): 'image' | 'document' | 'other' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
      return 'document';
    }
    return 'other';
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}

const DocumentServiceInstance = DocumentService.getInstance();
export default DocumentService;
export { DocumentServiceInstance };
