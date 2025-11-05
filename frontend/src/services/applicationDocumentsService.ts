import { API_BASE_URL } from './apiConfig';

export interface ApplicationDocument {
  id: number;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface DocumentType {
  value: string;
  label: string;
}

export interface UploadDocumentData {
  applicationId: number;
  documentType: string;
  file: File;
}

class ApplicationDocumentsService {
  private baseUrl = `${API_BASE_URL}/api/application-documents`;

  async uploadDocument(data: UploadDocumentData): Promise<{ success: boolean; data?: ApplicationDocument; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('document', data.file);
      formData.append('applicationId', data.applicationId.toString());
      formData.append('documentType', data.documentType);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      console.error('Error uploading document:', error);
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }
  }

  async getDocuments(applicationId: number): Promise<{ success: boolean; data?: ApplicationDocument[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${applicationId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch documents');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch documents'
      };
    }
  }

  async deleteDocument(documentId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${documentId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Delete failed');
      }

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error deleting document:', error);
      return {
        success: false,
        error: error.message || 'Delete failed'
      };
    }
  }

  async getDocumentTypes(): Promise<{ success: boolean; data?: DocumentType[]; error?: string }> {
    try {
      console.log('Fetching document types from:', `${this.baseUrl}/types`);
      const response = await fetch(`${this.baseUrl}/types`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch document types. Status:', response.status, 'Response:', errorText);
        throw new Error(`Failed to fetch document types: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Document types received:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch document types');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      console.error('Error fetching document types:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch document types'
      };
    }
  }

  getDownloadUrl(documentId: number): string {
    return `${this.baseUrl}/download/${documentId}`;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

const applicationDocumentsService = new ApplicationDocumentsService();
export default applicationDocumentsService;
