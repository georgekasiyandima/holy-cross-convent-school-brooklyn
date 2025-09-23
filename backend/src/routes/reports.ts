import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { AuthRequest, requireEditor } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all published reports (public)
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isPublished: true };
    
    if (type) {
      where.type = type;
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.report.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        reports,
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

// Get single report (public)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findFirst({
      where: { 
        id,
        isPublished: true 
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!report) {
      throw createError('Report not found', 404);
    }

    res.json({
      success: true,
      data: { report }
    });
  } catch (error) {
    next(error);
  }
});

// Create report (admin/editor only)
router.post('/', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { title, description, type, pdfUrl, isPublished } = req.body;

    if (!title || !type) {
      throw createError('Title and type are required', 400);
    }

    const report = await prisma.report.create({
      data: {
        title,
        description,
        type,
        pdfUrl,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
        authorId: req.user!.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: { report }
    });
  } catch (error) {
    next(error);
  }
});

// Update report (admin/editor only)
router.put('/:id', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, type, pdfUrl, isPublished } = req.body;

    const report = await prisma.report.update({
      where: { id },
      data: {
        title,
        description,
        type,
        pdfUrl,
        isPublished,
        publishedAt: isPublished ? new Date() : null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: { report }
    });
  } catch (error) {
    next(error);
  }
});

// Delete report (admin/editor only)
router.delete('/:id', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.report.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 