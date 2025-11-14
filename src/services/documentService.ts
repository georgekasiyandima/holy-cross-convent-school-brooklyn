import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

type DocumentRecord = {
  id: string;
  title: string;
  description: string | null;
  fileName: string | null;
  fileUrl: string | null;
  filePath: string | null;
  fileSize: number | null;
  mimeType: string | null;
  category: string;
  type: string | null;
  tags: string | null;
  isPublished: boolean;
  authorId: string | null;
  authorName: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface Document {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  category: string;
  type?: string | null;
  tags: string[];
  isPublished: boolean;
  authorId?: string | null;
  authorName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const mapDocument = (doc: DocumentRecord): Document => {
  let tags: string[] = [];
  if (doc.tags) {
    try {
      const parsed = JSON.parse(doc.tags);
      if (Array.isArray(parsed)) {
        tags = parsed;
      }
    } catch (error) {
      console.warn('Failed to parse document tags JSON:', error);
    }
  }

  return {
    id: doc.id,
    title: doc.title,
    description: doc.description ?? '',
    fileName: doc.fileName ?? '',
    fileUrl: doc.fileUrl ?? '',
    filePath: doc.filePath ?? undefined,
    fileSize: doc.fileSize ?? undefined,
    mimeType: doc.mimeType ?? undefined,
    category: doc.category,
    type: doc.type,
    tags,
    isPublished: doc.isPublished,
    authorId: doc.authorId,
    authorName: doc.authorName,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
};

const serializeTags = (tags?: string[]): string | null => {
  if (!tags) {
    return null;
  }

  try {
    return JSON.stringify(tags);
  } catch (error) {
    console.warn('Failed to stringify document tags:', error);
    return null;
  }
};

// Export instance type for use in other files
export type DocumentServiceInstance = {
  getDocumentsByCategory: (category: string, published?: boolean) => Promise<Document[]>;
  getAllPublishedDocuments: () => Promise<Document[]>;
  getDocumentById: (id: string) => Promise<Document | null>;
  createDocument: (documentData: {
    title: string;
    description?: string;
    fileName: string;
    fileUrl: string;
    filePath?: string;
    fileSize?: number;
    mimeType?: string;
    category: string;
    type?: string;
    tags?: string[];
    isPublished?: boolean;
    authorId?: string;
    authorName?: string;
  }) => Promise<Document>;
  updateDocument: (id: string, updates: Partial<{
    title: string;
    description: string;
    fileName: string;
    fileUrl: string;
    filePath: string | null;
    fileSize: number;
    mimeType: string;
    category: string;
    type: string | null;
    tags: string[];
    isPublished: boolean;
    authorId: string | null;
    authorName: string | null;
  }>) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
  getDocumentStats: () => Promise<{
    total: number;
    byCategory: Record<string, number>;
    published: number;
    unpublished: number;
  }>;
};

export class DocumentService {
  private static instance: DocumentService;

  public static getInstance(): DocumentServiceInstance {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance as DocumentServiceInstance;
  }

  private constructor() {}

  public async getDocumentsByCategory(category: string, published: boolean = true): Promise<Document[]> {
    try {
      const documents = await prisma.document.findMany({
        where: {
          category,
          ...(published !== undefined ? { isPublished: published } : {})
        },
        orderBy: { createdAt: 'desc' }
      });

      return documents.map(mapDocument);
    } catch (error) {
      console.error('Error fetching documents by category:', error);
      throw new Error('Failed to fetch documents');
    }
  }

  public async getAllPublishedDocuments(): Promise<Document[]> {
    try {
      const documents = await prisma.document.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' }
      });

      return documents.map(mapDocument);
    } catch (error) {
      console.error('Error fetching all documents:', error);
      throw new Error('Failed to fetch documents');
    }
  }

  public async getDocumentById(id: string): Promise<Document | null> {
    try {
      const document = await prisma.document.findUnique({ where: { id } });
      return document ? mapDocument(document) : null;
    } catch (error) {
      console.error('Error fetching document by ID:', error);
      throw new Error('Failed to fetch document');
    }
  }

  public async createDocument(documentData: {
    title: string;
    description?: string;
    fileName: string;
    fileUrl: string;
    filePath?: string;
    fileSize?: number;
    mimeType?: string;
    category: string;
    type?: string;
    tags?: string[];
    isPublished?: boolean;
    authorId?: string;
    authorName?: string;
  }): Promise<Document> {
    try {
      const document = await prisma.document.create({
        data: {
          title: documentData.title,
          description: documentData.description ?? '',
          fileName: documentData.fileName,
          fileUrl: documentData.fileUrl,
          filePath: documentData.filePath ?? null,
          fileSize: documentData.fileSize ?? null,
          mimeType: documentData.mimeType ?? null,
          category: documentData.category,
          type: documentData.type ?? null,
          tags: serializeTags(documentData.tags),
          isPublished: documentData.isPublished ?? true,
          authorId: documentData.authorId ?? null,
          authorName: documentData.authorName ?? null
        }
      });

      return mapDocument(document);
    } catch (error: any) {
      console.error('Error creating document:', error);
      if (error?.code === 'P2002') {
        throw new Error('A document with this title already exists');
      }
      throw new Error(error?.message || 'Failed to create document');
    }
  }

  public async updateDocument(id: string, updates: Partial<{
    title: string;
    description: string;
    fileName: string;
    fileUrl: string;
    filePath: string | null;
    fileSize: number;
    mimeType: string;
    category: string;
    type: string | null;
    tags: string[];
    isPublished: boolean;
    authorId: string | null;
    authorName: string | null;
  }>): Promise<Document> {
    try {
      const document = await prisma.document.update({
        where: { id },
        data: {
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.fileName !== undefined && { fileName: updates.fileName }),
          ...(updates.fileUrl !== undefined && { fileUrl: updates.fileUrl }),
          ...(updates.filePath !== undefined && { filePath: updates.filePath }),
          ...(updates.fileSize !== undefined && { fileSize: updates.fileSize }),
          ...(updates.mimeType !== undefined && { mimeType: updates.mimeType }),
          ...(updates.category !== undefined && { category: updates.category }),
          ...(updates.type !== undefined && { type: updates.type }),
          ...(updates.tags !== undefined && { tags: serializeTags(updates.tags) }),
          ...(updates.isPublished !== undefined && { isPublished: updates.isPublished }),
          ...(updates.authorId !== undefined && { authorId: updates.authorId }),
          ...(updates.authorName !== undefined && { authorName: updates.authorName })
        }
      });

      return mapDocument(document);
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error('Failed to update document');
    }
  }

  public async deleteDocument(id: string): Promise<void> {
    try {
      const document = await prisma.document.findUnique({ where: { id } });
      if (!document) {
        throw new Error('Document not found');
      }

      await prisma.document.delete({ where: { id } });

      const pathsToAttempt = [
        document.filePath ?? undefined,
        document.fileUrl ? path.join(process.cwd(), document.fileUrl.replace(/^\//, '')) : undefined
      ].filter(Boolean) as string[];

      for (const filePath of pathsToAttempt) {
        try {
          if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (fileError) {
          console.warn('Error deleting document file from disk:', fileError);
        }
      }
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
      const [total, published, categoryStats] = await Promise.all([
        prisma.document.count(),
        prisma.document.count({ where: { isPublished: true } }),
        prisma.document.groupBy({
          by: ['category'],
          _count: { category: true }
        })
      ]);

      const byCategory: Record<string, number> = {};
      for (const stat of categoryStats) {
        byCategory[stat.category] = stat._count.category;
      }

      const unpublished = total - published;

      return { total, byCategory, published, unpublished };
    } catch (error) {
      console.error('Error fetching document stats:', error);
      throw new Error('Failed to fetch document statistics');
    }
  }
}

export default DocumentService;





