import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

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
  createdAt: Date;
  updatedAt: Date;
}

export class DocumentService {
  private static instance: DocumentService;

  public static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  // Public methods
  public async getDocumentsByCategory(category: string, published: boolean = true): Promise<Document[]> {

  public async getDocumentsByCategory(category: string, published: boolean = true): Promise<Document[]> {
    try {
      // TODO: Document model not in schema - using Policy as placeholder
      // This should be fixed when Document model is added to schema
      const documents = await (prisma as any).policy?.findMany({
        where: {
          category: category,
          isPublished: published
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.description || '',
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        category: doc.category,
        tags: JSON.parse(doc.tags || '[]') as string[],
        isPublished: doc.isPublished,
        authorId: doc.authorId,
        authorName: doc.authorName,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching documents by category:', error);
      throw new Error('Failed to fetch documents');
    }
  }

  public async getAllPublishedDocuments(): Promise<Document[]> {
    try {
      // TODO: Document model not in schema - return empty array for now
      // This should be fixed when Document model is added to schema
      return [];
      /* const documents: any[] = [];

      return documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.description || '',
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        category: doc.category,
        tags: JSON.parse(doc.tags || '[]') as string[],
        isPublished: doc.isPublished,
        authorId: doc.authorId,
        authorName: doc.authorName,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching all published documents:', error);
      throw new Error('Failed to fetch documents');
    }
  }

  public async getDocumentById(id: string): Promise<Document | null> {
    try {
      // TODO: Document model not in schema - return null for now
      // This should be fixed when Document model is added to schema
      const document: any = null;

      if (!document) return null;

      return {
        id: document.id,
        title: document.title,
        description: document.description || '',
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        category: document.category,
        tags: JSON.parse(document.tags || '[]') as string[],
        isPublished: document.isPublished,
        authorId: document.authorId,
        authorName: document.authorName,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt
      };
    } catch (error) {
      console.error('Error fetching document by ID:', error);
      throw new Error('Failed to fetch document');
    }
  }

  public async createDocument(documentData: {
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
  }): Promise<Document> {
    try {
      // TODO: Document model not in schema - return dummy data for now
      // This should be fixed when Document model is added to schema
      console.warn('Document model not available in schema. Returning dummy document.');
      return {
        id: `dummy-${Date.now()}`,
        title: documentData.title,
        description: documentData.description,
        fileName: documentData.fileName,
        fileUrl: documentData.fileUrl,
        fileSize: documentData.fileSize,
        mimeType: documentData.mimeType,
        category: documentData.category,
        tags: documentData.tags,
        isPublished: documentData.isPublished,
        authorId: documentData.authorId,
        authorName: documentData.authorName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      /* const document = await (prisma as any).document.create({
        data: {
          title: documentData.title,
          description: documentData.description,
          fileName: documentData.fileName,
          fileUrl: documentData.fileUrl,
          fileSize: documentData.fileSize,
          mimeType: documentData.mimeType,
          category: documentData.category,
          tags: JSON.stringify(documentData.tags || []),
          isPublished: documentData.isPublished,
          authorId: documentData.authorId,
          authorName: documentData.authorName
        }
      });

      return {
        id: document.id,
        title: document.title,
        description: document.description || '',
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        category: document.category,
        tags: JSON.parse(document.tags || '[]') as string[],
        isPublished: document.isPublished,
        authorId: document.authorId,
        authorName: document.authorName,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt
      };
    } catch (error: any) {
      console.error('Error creating document:', error);
      console.error('Error details:', {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        meta: error?.meta,
        stack: error?.stack
      });
      console.error('Document data attempted:', documentData);
      
      // Provide more specific error message
      if (error?.code === 'P2002') {
        throw new Error('A document with this title already exists');
      } else if (error?.message) {
        throw new Error(`Failed to create document: ${error.message}`);
      } else {
        throw new Error('Failed to create document. Please check the server logs for details.');
      }
    }
  }

  public async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    try {
      // TODO: Document model not in schema - return dummy data for now
      console.warn('Document model not available in schema. Returning dummy document.');
      const existing = await this.getDocumentById(id);
      if (!existing) {
        throw new Error('Document not found');
      }
      return {
        ...existing,
        ...updates,
        updatedAt: new Date(),
      };
      /* const document = await (prisma as any).document.update({
        where: { id },
        data: {
          ...(updates.title && { title: updates.title }),
          ...(updates.description && { description: updates.description }),
          ...(updates.tags && { tags: JSON.stringify(updates.tags) }),
          ...(updates.isPublished !== undefined && { isPublished: updates.isPublished })
        }
      });

      return {
        id: document.id,
        title: document.title,
        description: document.description || '',
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        category: document.category,
        tags: JSON.parse(document.tags || '[]') as string[],
        isPublished: document.isPublished,
        authorId: document.authorId,
        authorName: document.authorName,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt
      };
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error('Failed to update document');
    }
  }

  public async deleteDocument(id: string): Promise<void> {
    try {
      // TODO: Document model not in schema - just log for now
      console.warn('Document model not available in schema. Delete operation skipped.');
      /* const document = await (prisma as any).document.findUnique({
        where: { id }
      });

      if (document) {
        // Delete physical file
        const filePath = path.join(process.cwd(), document.fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await (prisma as any).document.delete({
        where: { id }
      }); */
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  }

  public async getDocumentStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    published: number;
    unpublished: number;
  }> {
    try {
      // TODO: Document model not in schema - return empty stats for now
      const total = 0;
      const published = 0;
      const unpublished = 0;
      const categoryStats: any[] = [];
      /* const total = await (prisma as any).document?.count() || 0;
      const published = await (prisma as any).document?.count({
        where: { isPublished: true }
      }) || 0;
      const unpublished = total - published;

      // Get counts by category
      const categoryStats = await (prisma as any).document?.groupBy({
        by: ['category'],
        _count: {
          category: true
        }
      }) || []; */

      const byCategory: Record<string, number> = {};

      return {
        total,
        byCategory,
        published,
        unpublished
      };
    } catch (error) {
      console.error('Error fetching document stats:', error);
      throw new Error('Failed to fetch document statistics');
    }
  }
}

export default DocumentService;
