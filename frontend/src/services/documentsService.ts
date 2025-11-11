import axios from 'axios';
import DocumentService, { Document } from './documentService';
import { API_BASE_URL } from './apiConfig';

const documentService = DocumentService.getInstance();

export interface DocumentsResponse {
  success: boolean;
  data: Document[];
  count: number;
}

class DocumentsService {
  async getDocumentsByCategory(category: string): Promise<DocumentsResponse> {
    const docs = await documentService.getDocumentsByCategory(category, true);
    return {
      success: true,
      data: docs,
      count: docs.length,
    };
  }

  async getAllPublishedDocuments(): Promise<DocumentsResponse> {
    const docs = await documentService.getAllPublishedDocuments();
    return {
      success: true,
      data: docs,
      count: docs.length,
    };
  }

  async getPolicyDocuments(): Promise<Document[]> {
    const policies = await documentService.getDocumentsByCategory('policy', true).catch(() => []);
    const forms = await documentService.getDocumentsByCategory('form', true).catch(() => []);
    const fees = await documentService.getDocumentsByCategory('fees', true).catch(() => []);
    const combined = [...policies, ...forms, ...fees];

    const unique = combined.filter((doc, index, self) => index === self.findIndex((d) => d.id === doc.id));
    return unique;
  }

  getDocumentDownloadUrl(fileUrl: string): string {
    return documentService.getDocumentDownloadUrl(fileUrl);
  }

  async downloadDocument(doc: Document): Promise<void> {
    const downloadUrl = this.getDocumentDownloadUrl(doc.fileUrl);
    const response = await axios.get(downloadUrl, {
      baseURL: API_BASE_URL,
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = window.document.createElement('a');
    link.href = url;
    link.setAttribute('download', doc.fileName || doc.title);
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

const documentsService = new DocumentsService();

export default documentsService;
export type { Document };

