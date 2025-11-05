import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// Base URL without /api for static file serving
const BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export interface Document {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsResponse {
  success: boolean;
  data: Document[];
  count: number;
}

class DocumentsService {
  /**
   * Get all documents by category
   */
  async getDocumentsByCategory(category: string): Promise<DocumentsResponse> {
    try {
      const response = await axios.get<DocumentsResponse>(
        `${API_BASE_URL}/documents/${category}?published=true`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  /**
   * Get all published documents (fallback method)
   */
  async getAllPublishedDocuments(): Promise<DocumentsResponse> {
    try {
      const response = await axios.get<DocumentsResponse>(
        `${API_BASE_URL}/documents/all`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching all documents:', error);
      throw error;
    }
  }

  /**
   * Get all policy documents (for Forms & Fees page)
   * Also fetches documents from other categories that might be relevant
   */
  async getPolicyDocuments(): Promise<Document[]> {
    try {
      // Fetch policy category documents
      const policyResponse = await this.getDocumentsByCategory('policy');
      const policyDocs = policyResponse.data || [];
      console.log('Policy documents response:', policyResponse);
      console.log('Policy documents array:', policyDocs);
      
      // Also try to fetch from 'form' category for forms
      try {
        const formResponse = await this.getDocumentsByCategory('form');
        const formDocs = formResponse.data || [];
        const allDocs = [...policyDocs, ...formDocs];
        console.log('All documents (policy + form):', allDocs);
        return allDocs;
      } catch (formError) {
        console.warn('Could not fetch form documents:', formError);
        return policyDocs;
      }
    } catch (error) {
      console.error('Error fetching policy documents:', error);
      return [];
    }
  }

  /**
   * Get document download URL
   */
  getDocumentDownloadUrl(fileUrl: string): string {
    // If fileUrl already includes the base URL, return as is
    if (fileUrl.startsWith('http')) {
      return fileUrl;
    }
    // If fileUrl starts with /uploads, use BASE_URL (not API_BASE_URL) since static files are served at root
    if (fileUrl.startsWith('/uploads')) {
      return `${BASE_URL}${fileUrl}`;
    }
    // Otherwise, assume it's a relative path from uploads
    return `${BASE_URL}/uploads/documents/${fileUrl}`;
  }

  /**
   * Download document
   */
  async downloadDocument(doc: Document): Promise<void> {
    try {
      const downloadUrl = this.getDocumentDownloadUrl(doc.fileUrl);
      const response = await axios.get(downloadUrl, {
        responseType: 'blob',
      });

      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = window.document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.fileName || doc.title);
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }
}

export default new DocumentsService();

