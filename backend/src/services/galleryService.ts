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
  albumId?: string | null;
}

export class GalleryService {
  // Album APIs
  static async createAlbum(data: {
    title: string;
    description?: string;
    albumType?: 'GENERAL' | 'CLASS';
    classGrade?: string;
    isPublished?: boolean;
    coverImageId?: string;
  }) {
    return await prisma.album.create({
      data: {
        title: data.title,
        description: data.description,
        albumType: data.albumType || 'GENERAL',
        classGrade: data.classGrade,
        isPublished: data.isPublished ?? true,
        coverImageId: data.coverImageId,
      }
    });
  }

  static async listAlbums(filters?: {
    albumType?: 'GENERAL' | 'CLASS';
    classGrade?: string;
    isPublished?: boolean;
  }) {
    const where: any = {};
    if (filters?.albumType) where.albumType = filters.albumType;
    if (filters?.classGrade) where.classGrade = filters.classGrade;
    if (filters?.isPublished !== undefined) where.isPublished = filters.isPublished;

    return await prisma.album.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { coverImage: true, _count: { select: { items: true } } }
    });
  }

  static async getAlbumById(id: string) {
    return await prisma.album.findUnique({
      where: { id },
      include: { items: true, coverImage: true }
    });
  }

  static async updateAlbum(id: string, data: {
    title?: string;
    description?: string;
    albumType?: 'GENERAL' | 'CLASS';
    classGrade?: string | null;
    isPublished?: boolean;
    coverImageId?: string | null;
  }) {
    return await prisma.album.update({
      where: { id },
      data
    });
  }

  static async deleteAlbum(id: string) {
    return await prisma.album.delete({ where: { id } });
  }

  static async createGalleryItem(data: CreateGalleryItemData) {
    const tagsJson = data.tags ? JSON.stringify(data.tags) : null;
    const { uploadedBy, ...createData } = data;
    
    return await prisma.galleryItem.create({
      data: {
        ...createData,
        category: data.category as any, // Cast to enum type
        tags: tagsJson,
        uploader: uploadedBy ? { connect: { id: uploadedBy } } : undefined,
        album: (data as any).albumId ? { connect: { id: (data as any).albumId } } : undefined,
      },
    });
  }

  static async getGalleryItems(filters?: {
    category?: string;
    type?: string;
    isPublished?: boolean;
    albumId?: string;
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

    if (filters?.albumId) {
      where.albumId = filters.albumId;
    }

    const [items, total] = await Promise.all([
      prisma.galleryItem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
        include: { album: true }
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
