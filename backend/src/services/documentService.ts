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

  async getDocumentsByCategory(category: string, published: boolean = true): Promise<Document[]> {
    try {
      const documents = await prisma.document.findMany({
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

  async getDocumentById(id: string): Promise<Document | null> {
    try {
      const document = await prisma.document.findUnique({
        where: { id }
      });

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

  async createDocument(documentData: {
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
      const document = await prisma.document.create({
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

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    try {
      const document = await prisma.document.update({
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

  async deleteDocument(id: string): Promise<void> {
    try {
      // Get document to delete file
      const document = await prisma.document.findUnique({
        where: { id }
      });

      if (document) {
        // Delete physical file
        const filePath = path.join(process.cwd(), document.fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await prisma.document.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  }

  async getDocumentStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    published: number;
    unpublished: number;
  }> {
    try {
      const total = await prisma.document.count();
      const published = await prisma.document.count({
        where: { isPublished: true }
      });
      const unpublished = total - published;

      // Get counts by category
      const categoryStats = await prisma.document.groupBy({
        by: ['category'],
        _count: {
          category: true
        }
      });

      const byCategory = categoryStats.reduce((acc, stat) => {
        acc[stat.category] = stat._count.category;
        return acc;
      }, {} as Record<string, number>);

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
