import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateGalleryItemData {
  title: string;
  description?: string;
  category: string;
  type: 'IMAGE' | 'VIDEO';
  filePath: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  tags?: string[];
  isPublished?: boolean;
  uploadedBy?: string;
}

export interface UpdateGalleryItemData {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  isPublished?: boolean;
}

export class GalleryService {
  static async createGalleryItem(data: CreateGalleryItemData) {
    const tagsJson = data.tags ? JSON.stringify(data.tags) : null;
    const { uploadedBy, ...createData } = data;
    
    return await prisma.galleryItem.create({
      data: {
        ...createData,
        category: data.category as any, // Cast to enum type
        tags: tagsJson,
        uploader: uploadedBy ? { connect: { id: uploadedBy } } : undefined,
      },
    });
  }

  static async getGalleryItems(filters?: {
    category?: string;
    type?: string;
    isPublished?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    
    if (filters?.category) {
      where.category = filters.category;
    }
    
    if (filters?.type) {
      where.type = filters.type;
    }
    
    if (filters?.isPublished !== undefined) {
      where.isPublished = filters.isPublished;
    }

    const [items, total] = await Promise.all([
      prisma.galleryItem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      }),
      prisma.galleryItem.count({ where }),
    ]);

    // Parse JSON fields
    const itemsWithParsedData = items.map(item => ({
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
    }));

    return {
      items: itemsWithParsedData,
      total,
    };
  }

  static async getGalleryItemById(id: string) {
    const item = await prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!item) {
      return null;
    }

    return {
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
    };
  }

  static async updateGalleryItem(id: string, data: UpdateGalleryItemData) {
    const updateData: any = { ...data };
    
    if (data.tags) {
      updateData.tags = JSON.stringify(data.tags);
    }

    const updatedItem = await prisma.galleryItem.update({
      where: { id },
      data: updateData,
    });

    return {
      ...updatedItem,
      tags: updatedItem.tags ? JSON.parse(updatedItem.tags) : [],
    };
  }

  static async deleteGalleryItem(id: string) {
    return await prisma.galleryItem.delete({
      where: { id },
    });
  }

  static async getGalleryCategories() {
    const categories = await prisma.galleryItem.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return categories.map(cat => cat.category);
  }
}
