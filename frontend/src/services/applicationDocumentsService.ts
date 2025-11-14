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

export interface UploadProgress {
  onProgress?: (percent: number) => void;
}

// Validate API_BASE_URL on import (Important Fix #7)
if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined. Please set REACT_APP_API_BASE_URL environment variable.');
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

// Helper function to create fetch with timeout and credentials
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 30000
): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: 'include', // Critical Fix #1: Always include credentials
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

class ApplicationDocumentsService {
  protected baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || `${API_BASE_URL}/api/application-documents`;
  }

  /**
   * Upload a document with optional progress tracking
   * @param data - Document upload data
   * @param progress - Optional progress callback
   * @returns Upload result with document data or error
   */
  async uploadDocument(
    data: UploadDocumentData,
    progress?: UploadProgress
  ): Promise<{ success: boolean; data?: ApplicationDocument; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('document', data.file);
      formData.append('applicationId', data.applicationId.toString());
      formData.append('documentType', data.documentType);

      // Use XMLHttpRequest for upload progress (Critical Fix #5)
      if (progress?.onProgress) {
        return new Promise((resolve) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded * 100) / e.total);
              progress.onProgress?.(percent);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const result = JSON.parse(xhr.responseText);
                resolve({
                  success: true,
                  data: result.data,
                });
              } catch (parseError) {
                resolve({
                  success: false,
                  error: 'Failed to parse response',
                });
              }
            } else {
              try {
                const result = JSON.parse(xhr.responseText);
                resolve({
                  success: false,
                  error: result.error || `Upload failed: ${xhr.statusText}`,
                });
              } catch {
                resolve({
                  success: false,
                  error: `Upload failed: ${xhr.status} ${xhr.statusText}`,
                });
              }
            }
          };

          xhr.onerror = () => {
            resolve({
              success: false,
              error: 'Network error during upload',
            });
          };

          xhr.open('POST', `${this.baseUrl}/upload`);
          xhr.withCredentials = true; // Critical Fix #1: Include credentials
          xhr.send(formData);
        });
      }

      // Fallback to fetch if no progress callback
      const response = await fetchWithTimeout(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error: unknown) {
      // Critical Fix #3: Use unknown + guard
      const errorMessage = getErrorMessage(error);
      
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error uploading document:', error);
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get all documents for an application
   * @param applicationId - Application ID
   * @returns Documents array or error
   */
  async getDocuments(applicationId: number): Promise<{ success: boolean; data?: ApplicationDocument[]; error?: string }> {
    try {
      const response = await fetchWithTimeout(`${this.baseUrl}/${applicationId}`);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to fetch documents: ${response.status}`;
        try {
          const errorResult = JSON.parse(errorText);
          errorMessage = errorResult.error || errorMessage;
        } catch {
          // If not JSON, use status text
          errorMessage = `${errorMessage} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Important Fix #12: Basic type guard
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format');
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error: unknown) {
      // Critical Fix #3: Use unknown + guard
      const errorMessage = getErrorMessage(error);
      
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching documents:', error);
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Delete a document
   * @param documentId - Document ID to delete
   * @returns Success status with deleted ID or error
   */
  async deleteDocument(documentId: number): Promise<{ success: boolean; deletedId?: number; error?: string }> {
    try {
      const response = await fetchWithTimeout(`${this.baseUrl}/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Delete failed: ${response.status}`;
        try {
          const errorResult = JSON.parse(errorText);
          errorMessage = errorResult.error || errorMessage;
        } catch {
          errorMessage = `${errorMessage} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Critical Fix #6: Return deleted ID
      return {
        success: true,
        deletedId: documentId,
      };
    } catch (error: unknown) {
      // Critical Fix #3: Use unknown + guard
      const errorMessage = getErrorMessage(error);
      
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error deleting document:', error);
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get available document types
   * @returns Document types array or error
   */
  async getDocumentTypes(): Promise<{ success: boolean; data?: DocumentType[]; error?: string }> {
    try {
      // Important Fix #10: Remove debug logs
      if (process.env.NODE_ENV !== 'production') {
        console.log('Fetching document types...');
      }

      const response = await fetchWithTimeout(`${this.baseUrl}/types`);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to fetch document types: ${response.status}`;
        try {
          const errorResult = JSON.parse(errorText);
          errorMessage = errorResult.error || errorMessage;
        } catch {
          errorMessage = `${errorMessage} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Important Fix #12: Basic type guard
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format');
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch document types');
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error: unknown) {
      // Critical Fix #3: Use unknown + guard
      const errorMessage = getErrorMessage(error);
      
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching document types:', error);
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get a signed download URL for a document (Critical Fix #4)
   * Uses secure endpoint that requires authentication
   * @param documentId - Document ID
   * @returns Signed download URL that expires
   */
  async getSignedDownloadUrl(documentId: number): Promise<string> {
    try {
      const response = await fetchWithTimeout(`${this.baseUrl}/download-url/${documentId}`);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to get download URL: ${response.status}`;
        try {
          const errorResult = JSON.parse(errorText);
          errorMessage = errorResult.error || errorMessage;
        } catch {
          errorMessage = `${errorMessage} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.url || result.data?.url || '';
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
  getDownloadUrl(documentId: number): string {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('getDownloadUrl is deprecated. Use getSignedDownloadUrl for secure access.');
    }
    return `${this.baseUrl}/download/${documentId}`;
  }

  /**
   * Format file size in human-readable format
   * Uses 1024 (binary) for consistency with system file sizes
   * @param bytes - File size in bytes
   * @returns Formatted string (e.g., "1.5 MB")
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    // Important Fix #9: Use 1024 for binary (KB, MB, GB) - standard for file sizes
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}

// Important Fix #11: Factory pattern for testability
export const createApplicationDocumentsService = (baseUrl?: string) => {
  return new ApplicationDocumentsService(baseUrl);
};

// Default singleton instance
const applicationDocumentsService = createApplicationDocumentsService();
export default applicationDocumentsService;

