import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth';
import { GalleryService } from '../services/galleryService';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/gallery';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
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
enum GalleryItemType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

// Gallery categories
enum GalleryCategory {
  EVENTS = 'EVENTS',
  SPORTS = 'SPORTS',
  ACADEMIC = 'ACADEMIC',
  CULTURAL = 'CULTURAL',
  GENERAL = 'GENERAL'
}

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const { category, type, page = 1, limit = 20 } = req.query;
    
    const result = await GalleryService.getGalleryItems({
      category: category as string,
      type: type as string,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    return res.json({
      items: result.items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        pages: Math.ceil(result.total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

// Get single gallery item
router.get('/:id', async (req, res) => {
  try {
    const item = await GalleryService.getGalleryItemById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    return res.json(item);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    return res.status(500).json({ error: 'Failed to fetch gallery item' });
  }
});

// Upload new gallery item
router.post('/upload',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { title, description, category, tags } = req.body;
      
      // Determine file type
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      const isVideo = ['.mp4', '.mov', '.avi', '.webm'].includes(fileExtension);
      
      const item = await GalleryService.createGalleryItem({
        title,
        description,
        category: category || GalleryCategory.GENERAL,
        type: isVideo ? GalleryItemType.VIDEO : GalleryItemType.IMAGE,
        filePath: req.file.path,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        uploadedBy: (req as any).user?.id,
      });

      return res.status(201).json(item);
    } catch (error) {
      console.error('Error uploading gallery item:', error);
      return res.status(500).json({ error: 'Failed to upload gallery item' });
    }
  }
);

// Update gallery item
router.put('/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const { title, description, category, tags } = req.body;

      const item = await GalleryService.updateGalleryItem(req.params.id, {
        title,
        description,
        category,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      });

      return res.json(item);
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return res.status(500).json({ error: 'Failed to update gallery item' });
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
        return res.status(404).json({ error: 'Gallery item not found' });
      }

      // Delete file from filesystem
      if (fs.existsSync(item.filePath)) {
        fs.unlinkSync(item.filePath);
      }

      await GalleryService.deleteGalleryItem(req.params.id);

      return res.json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return res.status(500).json({ error: 'Failed to delete gallery item' });
    }
  }
);

// Get gallery statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalItems = await prisma.galleryItem.count();
    const imageCount = await prisma.galleryItem.count({ where: { type: GalleryItemType.IMAGE } });
    const videoCount = await prisma.galleryItem.count({ where: { type: GalleryItemType.VIDEO } });
    
    const categoryStats = await prisma.galleryItem.groupBy({
      by: ['category'],
      _count: { category: true }
    });

    return res.json({
      totalItems,
      imageCount,
      videoCount,
      categoryStats
    });
  } catch (error) {
    console.error('Error fetching gallery stats:', error);
    return res.status(500).json({ error: 'Failed to fetch gallery statistics' });
  }
});

export default router;