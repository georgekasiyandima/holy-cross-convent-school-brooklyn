import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth';
import { GalleryService } from '../services/galleryService';
import SocialMediaService from '../services/socialMediaService';
import {
  validateCreateGalleryItem,
  validateUpdateGalleryItem,
  validateCreateAlbum,
  validateUpdateAlbum,
  validateQueryParams
} from '../middleware/galleryValidation';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

const parseBooleanQueryParam = (value: any, defaultValue?: boolean): boolean | undefined => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }

  return Boolean(value);
};

// Configure multer for file uploads
// Use absolute path to ensure files are saved in the correct location
const uploadsBaseDir = path.join(process.cwd(), 'uploads', 'gallery');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use absolute path to ensure consistency
    if (!fs.existsSync(uploadsBaseDir)) {
      fs.mkdirSync(uploadsBaseDir, { recursive: true });
      console.log('✅ Created gallery upload directory:', uploadsBaseDir);
    }
    cb(null, uploadsBaseDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

// Gallery item types
const GalleryItemType = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO'
} as const;

// Gallery categories
const GalleryCategory = {
  EVENTS: 'EVENTS',
  SPORTS: 'SPORTS',
  ACADEMIC: 'ACADEMIC',
  CULTURAL: 'CULTURAL',
  GENERAL: 'GENERAL'
} as const;

// Albums endpoints - MUST come before /:id routes to avoid route conflicts
router.get('/albums', async (req, res) => {
  try {
    const { albumType, classGrade, isPublished, parentAlbumId, phase } = req.query as any;
    const publishedFilter = parseBooleanQueryParam(isPublished, undefined);
    const albums = await GalleryService.listAlbums({
      albumType,
      classGrade,
      isPublished: publishedFilter,
      parentAlbumId: parentAlbumId === 'null' ? null : parentAlbumId,
      phase,
    });
    return res.json({
      success: true,
      data: albums
    });
  } catch (error: any) {
    console.error('Error fetching albums:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch albums',
      message: error.message || 'Internal server error'
    });
  }
});

router.get('/albums/:id', async (req, res) => {
  try {
    const album = await GalleryService.getAlbumById(req.params.id);
    if (!album) {
      return res.status(404).json({ 
        success: false,
        error: 'Album not found' 
      });
    }
    
    // Check if album is published (public access)
    if (!album.isPublished && !(req as any).user) {
      return res.status(403).json({ 
        success: false,
        error: 'Album is not available' 
      });
    }
    
    return res.json({
      success: true,
      data: album
    });
  } catch (error: any) {
    console.error('Error fetching album:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch album',
      message: error.message || 'Internal server error'
    });
  }
});

// Get all gallery items
router.get('/', validateQueryParams, async (req, res) => {
  try {
    const { category, type, albumId, page, limit, isPublished } = req.query;
    
    const publishedFilter = parseBooleanQueryParam(isPublished, true);

    const result = await GalleryService.getGalleryItems({
      category: category as string,
      type: type as string,
      albumId: albumId as string,
      isPublished: publishedFilter,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    return res.json({
      success: true,
      data: {
        items: result.items,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: result.total,
          pages: Math.ceil(result.total / Number(limit))
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching gallery items:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch gallery items',
      message: error.message || 'Internal server error'
    });
  }
});

// Get single gallery item - MUST come after /albums routes
router.get('/:id', async (req, res) => {
  try {
    const item = await GalleryService.getGalleryItemById(req.params.id);

    if (!item) {
      return res.status(404).json({ 
        success: false,
        error: 'Gallery item not found' 
      });
    }

    // Check if item is published (public access)
    if (!item.isPublished && !(req as any).user) {
      return res.status(403).json({ 
        success: false,
        error: 'Gallery item is not available' 
      });
    }

    return res.json({
      success: true,
      data: item
    });
  } catch (error: any) {
    console.error('Error fetching gallery item:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch gallery item',
      message: error.message || 'Internal server error'
    });
  }
});

// Upload new gallery item
router.post('/upload',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  upload.single('file'),
  async (req, res, next) => {
    try {
      console.log('🔍 Gallery Upload Route: Starting request');
      console.log('🔍 Gallery Upload Route: File received:', req.file ? 'Yes' : 'No');
      console.log('🔍 Gallery Upload Route: Body:', req.body);
      console.log('🔍 Gallery Upload Route: User:', (req as any).user?.email);
      
      if (!req.file) {
        console.error('❌ Gallery Upload Route: No file received');
        return res.status(400).json({ 
          success: false,
          error: 'No file uploaded' 
        });
      }
      
      // Verify file exists and log absolute path
      const fileExists = fs.existsSync(req.file.path);
      const absolutePath = path.resolve(req.file.path);
      const expectedUrl = `/uploads/gallery/${req.file.filename}`;
      
      console.log('🔍 Gallery Upload Route: File details:', {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        absolutePath: absolutePath,
        fileExists: fileExists,
        size: req.file.size,
        mimetype: req.file.mimetype,
        expectedUrl: expectedUrl
      });
      
      if (!fileExists) {
        console.error('❌ Gallery Upload Route: File does not exist at path:', req.file.path);
        return res.status(500).json({
          success: false,
          error: 'File was not saved correctly'
        });
      }

      // Validate required fields
      if (!req.body.title || req.body.title.trim() === '') {
        return res.status(400).json({ 
          success: false,
          error: 'Title is required' 
        });
      }

      // Validate category if provided
      const validCategories = ['EVENTS', 'SPORTS', 'ACADEMIC', 'CULTURAL', 'GENERAL', 'CLASS_PHOTOS'];
      if (req.body.category && !validCategories.includes(req.body.category)) {
        return res.status(400).json({ 
          success: false,
          error: `Invalid category. Must be one of: ${validCategories.join(', ')}` 
        });
      }

      next();
    } catch (error: any) {
      return res.status(400).json({ 
        success: false,
        error: error.message || 'Validation failed' 
      });
    }
  },
  async (req, res) => {
    try {
      const { title, description, category, tags, albumId, isPublished } = req.body;
      
      // Determine file type
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      const isVideo = ['.mp4', '.mov', '.avi', '.webm'].includes(fileExtension);
      
      const tagsArray = tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : (Array.isArray(tags) ? tags : [])) : [];
      
      // Parse isPublished - handle string 'true'/'false' or boolean
      const published = parseBooleanQueryParam(isPublished, true) ?? true;
      
      console.log('🔍 Gallery Upload Route: Creating gallery item in database...');
      
      const item = await GalleryService.createGalleryItem({
        title: title.trim(),
        description: description?.trim() || undefined,
        category: category || GalleryCategory.GENERAL,
        type: isVideo ? GalleryItemType.VIDEO : GalleryItemType.IMAGE,
        filePath: req.file.path,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        tags: tagsArray,
        isPublished: published,
        uploadedBy: (req as any).user?.id,
        ...(albumId && albumId !== '' ? { albumId } : {}),
      });
      
      console.log('✅ Gallery Upload Route: Gallery item created:', item.id);

      // Parse tags from JSON if needed
      let parsedTags = [];
      try {
        parsedTags = item.tags ? (typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags) : [];
      } catch {
        parsedTags = [];
      }
      
      // Ensure fileName is properly set
      const itemResponse = {
        ...item,
        tags: parsedTags,
        fileName: item.fileName || req.file.filename
      };
      
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/gallery/${itemResponse.fileName}`;
      console.log('✅ Gallery Upload Route: Upload successful');
      console.log('🔗 Image URL:', imageUrl);
      console.log('📁 File path:', req.file.path);
      console.log('📝 File name:', itemResponse.fileName);
      console.log('📊 File size:', req.file.size, 'bytes');

      // Post to social media if requested and configured
      let socialMediaResults = null;
      if (req.body.postToSocial === 'true' && itemResponse.isPublished) {
        try {
          const caption = `${itemResponse.title}${itemResponse.description ? ` - ${itemResponse.description}` : ''}\n\n#HolyCrossConventSchool #Brooklyn #CapeTown`;
          
          socialMediaResults = await SocialMediaService.postToAll({
            imageUrl,
            caption,
            title: itemResponse.title,
            description: itemResponse.description
          });
        } catch (socialError) {
          console.error('Error posting to social media:', socialError);
          // Don't fail the upload if social media fails
        }
      }

      return res.status(201).json({
        success: true,
        data: itemResponse,
        message: 'Gallery item uploaded successfully',
        ...(socialMediaResults && { socialMedia: socialMediaResults })
      });
    } catch (error: any) {
      console.error('Error uploading gallery item:', error);
      
      // Clean up uploaded file on error
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      
      return res.status(500).json({ 
        success: false,
        error: 'Failed to upload gallery item',
        message: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
);

// Update gallery item
router.put('/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  validateUpdateGalleryItem,
  async (req, res) => {
    try {
      const { title, description, category, tags, albumId, isPublished } = req.body;

      const publishedFilter = parseBooleanQueryParam(isPublished, undefined);

      // Check if item exists
      const existingItem = await GalleryService.getGalleryItemById(req.params.id);
      if (!existingItem) {
        return res.status(404).json({ 
          success: false,
          error: 'Gallery item not found' 
        });
      }

      const updatePayload: any = {
        title,
        description,
        category,
        tags: tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags) : undefined,
        albumId,
      };

      if (publishedFilter !== undefined) {
        updatePayload.isPublished = publishedFilter;
      }

      const item = await GalleryService.updateGalleryItem(req.params.id, updatePayload);

      return res.json({
        success: true,
        data: item,
        message: 'Gallery item updated successfully'
      });
    } catch (error: any) {
      console.error('Error updating gallery item:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to update gallery item',
        message: error.message || 'Internal server error'
      });
    }
  }
);

// Delete gallery item
router.delete('/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const item = await GalleryService.getGalleryItemById(req.params.id);

      if (!item) {
        return res.status(404).json({ 
          success: false,
          error: 'Gallery item not found' 
        });
      }

      // Delete file from filesystem
      if (fs.existsSync(item.filePath)) {
        try {
          fs.unlinkSync(item.filePath);
        } catch (fileError) {
          console.error('Error deleting file:', fileError);
          // Continue with database deletion even if file deletion fails
        }
      }

      await GalleryService.deleteGalleryItem(req.params.id);

      return res.json({ 
        success: true,
        message: 'Gallery item deleted successfully' 
      });
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to delete gallery item',
        message: error.message || 'Internal server error'
      });
    }
  }
);

// Create album
router.post('/albums',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  validateCreateAlbum,
  async (req, res) => {
    try {
    const { title, description, albumType, classGrade, phase, parentAlbumId, isPublished, coverImageId } = req.body;
      
      // Validate coverImageId if provided
      if (coverImageId) {
        const coverImage = await GalleryService.getGalleryItemById(coverImageId);
        if (!coverImage) {
          return res.status(400).json({ 
            success: false,
            error: 'Cover image not found' 
          });
        }
        if (coverImage.type !== 'IMAGE') {
          return res.status(400).json({ 
            success: false,
            error: 'Cover image must be an image file' 
          });
        }
      }
      
      if (parentAlbumId) {
        const parentAlbum = await GalleryService.getAlbumById(parentAlbumId);
        if (!parentAlbum) {
          return res.status(400).json({
            success: false,
            error: 'Parent album not found',
          });
        }
      }

      const album = await GalleryService.createAlbum({
        title,
        description,
        albumType,
        classGrade,
        phase,
        isPublished,
        coverImageId,
        parentAlbumId,
      });
      return res.status(201).json({
        success: true,
        data: album,
        message: 'Album created successfully'
      });
    } catch (error: any) {
      console.error('Error creating album:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to create album',
        message: error.message || 'Internal server error'
      });
    }
  }
);

router.put('/albums/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  validateUpdateAlbum,
  async (req, res) => {
    try {
      // Check if album exists
      const existingAlbum = await GalleryService.getAlbumById(req.params.id);
      if (!existingAlbum) {
        return res.status(404).json({ 
          success: false,
          error: 'Album not found' 
        });
      }
      
      // Validate coverImageId if provided
      if (req.body.coverImageId) {
        const coverImage = await GalleryService.getGalleryItemById(req.body.coverImageId);
        if (!coverImage) {
          return res.status(400).json({ 
            success: false,
            error: 'Cover image not found' 
          });
        }
        if (coverImage.type !== 'IMAGE') {
          return res.status(400).json({ 
            success: false,
            error: 'Cover image must be an image file' 
          });
        }
      }
      if (req.body.parentAlbumId) {
        if (req.body.parentAlbumId === req.params.id) {
          return res.status(400).json({
            success: false,
            error: 'Album cannot be its own parent',
          });
        }

        // Prevent cyclical hierarchy by ensuring parent is not a descendant
        let ancestorId: string | null | undefined = req.body.parentAlbumId;
        while (ancestorId) {
          if (ancestorId === req.params.id) {
            return res.status(400).json({
              success: false,
              error: 'Cannot assign a child album as parent',
            });
          }
          const ancestor = await GalleryService.getAlbumById(ancestorId);
          if (!ancestor) {
            return res.status(400).json({
              success: false,
              error: 'Parent album not found',
            });
          }
          ancestorId = ancestor.parentAlbumId;
        }
      }
      
      const album = await GalleryService.updateAlbum(req.params.id, {
        title,
        description,
        albumType,
        classGrade,
        phase: req.body.phase ?? null,
        isPublished,
        coverImageId,
        parentAlbumId: req.body.parentAlbumId ?? null,
      });
      return res.json({
        success: true,
        data: album,
        message: 'Album updated successfully'
      });
    } catch (error: any) {
      console.error('Error updating album:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to update album',
        message: error.message || 'Internal server error'
      });
    }
  }
);

router.delete('/albums/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      // Check if album exists
      const existingAlbum = await GalleryService.getAlbumById(req.params.id);
      if (!existingAlbum) {
        return res.status(404).json({ 
          success: false,
          error: 'Album not found' 
        });
      }
      
      await GalleryService.deleteAlbum(req.params.id);
      return res.json({ 
        success: true,
        message: 'Album deleted successfully' 
      });
    } catch (error: any) {
      console.error('Error deleting album:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to delete album',
        message: error.message || 'Internal server error'
      });
    }
  }
);

// Get gallery statistics (protected - admin only)
router.get('/stats/overview',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const totalItems = await prisma.galleryItem.count();
      const imageCount = await prisma.galleryItem.count({ where: { type: GalleryItemType.IMAGE } });
      const videoCount = await prisma.galleryItem.count({ where: { type: GalleryItemType.VIDEO } });
      const publishedCount = await prisma.galleryItem.count({ where: { isPublished: true } });
      const unpublishedCount = await prisma.galleryItem.count({ where: { isPublished: false } });
      
      const categoryStats = await prisma.galleryItem.groupBy({
        by: ['category'],
        _count: { category: true }
      });
      
      const albumCount = await prisma.album.count();
      const classAlbumCount = await prisma.album.count({ where: { albumType: 'CLASS' } });

      return res.json({
        success: true,
        data: {
          totalItems,
          imageCount,
          videoCount,
          publishedCount,
          unpublishedCount,
          albumCount,
          classAlbumCount,
          categoryStats: categoryStats.map(stat => ({
            category: stat.category,
            count: stat._count.category
          }))
        }
      });
    } catch (error: any) {
      console.error('Error fetching gallery stats:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to fetch gallery statistics',
        message: error.message || 'Internal server error'
      });
    }
  }
);

export default router;