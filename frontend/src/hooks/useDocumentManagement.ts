import { useState, useEffect, useCallback } from 'react';
import DocumentService, { Document, DocumentUpload } from '../services/documentService';

//---------------------------------------------------------
// HOOK INTERFACE
//---------------------------------------------------------
interface UseDocumentManagementReturn {
  // State
  documents: Document[];
  loading: boolean;
  error: string | null;
  uploading: boolean;
  uploadProgress: number;
  
  // Actions
  loadDocuments: (category: string, published?: boolean) => Promise<void>;
  uploadDocument: (category: string, documentData: DocumentUpload) => Promise<Document>;
  updateDocument: (category: string, id: string, updates: Partial<Document>) => Promise<void>;
  deleteDocument: (category: string, id: string) => Promise<void>;
  togglePublishStatus: (category: string, id: string, isPublished: boolean) => Promise<void>;
  searchDocuments: (query: string, category?: string) => Promise<Document[]>;
  
  // Utilities
  clearError: () => void;
  resetUploadProgress: () => void;
}

//---------------------------------------------------------
// CUSTOM HOOK
//---------------------------------------------------------
export const useDocumentManagement = (): UseDocumentManagementReturn => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const documentService = DocumentService.getInstance();

  //---------------------------------------------------------
  // LOAD DOCUMENTS
  //---------------------------------------------------------
  const loadDocuments = useCallback(async (category: string, published: boolean = true) => {
    try {
      setLoading(true);
      setError(null);
      const docs = await documentService.getDocumentsByCategory(category, published);
      setDocuments(docs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load documents';
      setError(errorMessage);
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  }, [documentService]);

  //---------------------------------------------------------
  // UPLOAD DOCUMENT
  //---------------------------------------------------------
  const uploadDocument = useCallback(async (category: string, documentData: DocumentUpload): Promise<Document> => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      // Validate file
      const validation = documentService.validateFile(documentData.file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Upload document
      const uploadedDoc = await documentService.uploadDocument(category, documentData);
      
      // Add to local state
      setDocuments(prev => [uploadedDoc, ...prev]);
      setUploadProgress(100);
      
      return uploadedDoc;
    } catch (err) {
      let errorMessage = 'Failed to upload document';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
      console.error('Error uploading document:', err);
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000); // Reset progress after 1 second
    }
  }, [documentService]);

  //---------------------------------------------------------
  // UPDATE DOCUMENT
  //---------------------------------------------------------
  const updateDocument = useCallback(async (category: string, id: string, updates: Partial<Document>): Promise<void> => {
    try {
      setError(null);
      const updatedDoc = await documentService.updateDocument(category, id, updates);
      
      // Update local state
      setDocuments(prev => 
        prev.map(doc => doc.id === id ? updatedDoc : doc)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update document';
      setError(errorMessage);
      console.error('Error updating document:', err);
      throw err;
    }
  }, [documentService]);

  //---------------------------------------------------------
  // DELETE DOCUMENT
  //---------------------------------------------------------
  const deleteDocument = useCallback(async (category: string, id: string): Promise<void> => {
    try {
      setError(null);
      await documentService.deleteDocument(category, id);
      
      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      setError(errorMessage);
      console.error('Error deleting document:', err);
      throw err;
    }
  }, [documentService]);

  //---------------------------------------------------------
  // TOGGLE PUBLISH STATUS
  //---------------------------------------------------------
  const togglePublishStatus = useCallback(async (category: string, id: string, isPublished: boolean): Promise<void> => {
    try {
      setError(null);
      const updatedDoc = await documentService.togglePublishStatus(category, id, isPublished);
      
      // Update local state
      setDocuments(prev => 
        prev.map(doc => doc.id === id ? updatedDoc : doc)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update publish status';
      setError(errorMessage);
      console.error('Error toggling publish status:', err);
      throw err;
    }
  }, [documentService]);

  //---------------------------------------------------------
  // SEARCH DOCUMENTS
  //---------------------------------------------------------
  const searchDocuments = useCallback(async (query: string, category?: string): Promise<Document[]> => {
    try {
      setError(null);
      const results = await documentService.searchDocuments(query, category);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search documents';
      setError(errorMessage);
      console.error('Error searching documents:', err);
      throw err;
    }
  }, [documentService]);

  //---------------------------------------------------------
  // UTILITY FUNCTIONS
  //---------------------------------------------------------
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetUploadProgress = useCallback(() => {
    setUploadProgress(0);
  }, []);

  //---------------------------------------------------------
  // RETURN HOOK INTERFACE
  //---------------------------------------------------------
  return {
    // State
    documents,
    loading,
    error,
    uploading,
    uploadProgress,
    
    // Actions
    loadDocuments,
    uploadDocument,
    updateDocument,
    deleteDocument,
    togglePublishStatus,
    searchDocuments,
    
    // Utilities
    clearError,
    resetUploadProgress,
  };
};

export default useDocumentManagement;
