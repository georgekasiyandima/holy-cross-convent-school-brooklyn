import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { authMiddleware, AuthRequest, requireEditor } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and document files are allowed'));
    }
  }
});

// Get all published news articles (public)
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isPublished: true };
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
        { summary: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.newsArticle.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        articles,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all news articles for admin management (includes drafts)
router.get('/manage', authMiddleware, requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { status, search, priority, limit = 50 } = req.query;

    const where: any = {};

    const normalizedStatus =
      typeof status === 'string' ? status.trim().toLowerCase() : undefined;
    if (normalizedStatus === 'published') {
      where.isPublished = true;
    } else if (normalizedStatus === 'draft') {
      where.isPublished = false;
    }

    const normalizedPriority =
      typeof priority === 'string' ? priority.trim().toUpperCase() : undefined;
    const validPriorities = ['LOW', 'NORMAL', 'MEDIUM', 'HIGH', 'URGENT'];
    if (normalizedPriority && validPriorities.includes(normalizedPriority)) {
      where.priority = normalizedPriority;
    }

    const searchTerm =
      typeof search === 'string' ? search.trim() : undefined;
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { content: { contains: searchTerm, mode: 'insensitive' } },
        { summary: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const parsedLimit = Number(limit);
    const take = Math.min(
      !Number.isNaN(parsedLimit) && parsedLimit > 0 ? parsedLimit : 50,
      200
    );

    const articles = await prisma.newsArticle.findMany({
      where,
      orderBy: [
        { isPublished: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      take,
    });

    res.json({
      success: true,
      data: articles,
      count: articles.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get single news article (public)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await prisma.newsArticle.findFirst({
      where: { 
        id,
        isPublished: true 
      }
    });

    if (!article) {
      throw createError('News article not found', 404);
    }

    res.json({
      success: true,
      data: { article }
    });
  } catch (error) {
    next(error);
  }
});

// Create news article (admin/editor only)
router.post('/', authMiddleware, requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const {
      title,
      content,
      summary,
      imageUrl,
      attachmentUrl,
      attachmentType,
      isPublished,
      publishedAt,
      priority,
    } = req.body;

    if (!title || !content) {
      throw createError('Title and content are required', 400);
    }

    const isPublishedBoolean =
      typeof isPublished === 'boolean' ? isPublished : isPublished === 'true';
    const publishTimestamp = isPublishedBoolean
      ? publishedAt
        ? new Date(publishedAt)
        : new Date()
      : null;

    const article = await prisma.newsArticle.create({
      data: {
        title,
        content,
        summary,
        imageUrl,
        attachmentUrl: attachmentUrl || null,
        attachmentType: attachmentType || null,
        isPublished: isPublishedBoolean,
        publishedAt: publishTimestamp,
        priority: priority || 'MEDIUM',
      },
    });

    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: { article },
    });
  } catch (error) {
    next(error);
  }
});

// Update news article (admin/editor only)
router.put('/:id', authMiddleware, requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      summary,
      imageUrl,
      attachmentUrl,
      attachmentType,
      isPublished,
      publishedAt,
      priority,
    } = req.body;

    const data: any = {
      title,
      content,
      summary,
      imageUrl,
      attachmentUrl: typeof attachmentUrl !== 'undefined' ? attachmentUrl : undefined,
      attachmentType:
        typeof attachmentType !== 'undefined' ? attachmentType : undefined,
      priority: priority || undefined,
    };

    if (typeof isPublished !== 'undefined') {
      const isPublishedBoolean =
        typeof isPublished === 'boolean' ? isPublished : isPublished === 'true';
      data.isPublished = isPublishedBoolean;
      data.publishedAt = isPublishedBoolean
        ? publishedAt
          ? new Date(publishedAt)
          : new Date()
        : null;
    }

    if (typeof attachmentUrl === 'string' && attachmentUrl.trim() === '') {
      data.attachmentUrl = null;
    }
    if (typeof attachmentType === 'string' && attachmentType.trim() === '') {
      data.attachmentType = null;
    }

    const article = await prisma.newsArticle.update({
      where: { id },
      data,
    });

    res.json({
      success: true,
      message: 'News article updated successfully',
      data: { article },
    });
  } catch (error) {
    next(error);
  }
});

// Delete news article (admin/editor only)
router.delete('/:id', authMiddleware, requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.newsArticle.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'News article deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Upload document (admin only)
router.post('/upload-document', authMiddleware, requireEditor, upload.single('file'), async (req: AuthRequest, res, next) => {
  try {
    if (!req.file) {
      throw createError('No file uploaded', 400);
    }

    const { title, description, category, isPublished } = req.body;
    
    if (!title || !category) {
      throw createError('Title and category are required', 400);
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        title: title,
        description: description || '',
        category: category,
        isPublished: isPublished === 'true',
        fileUrl: fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 