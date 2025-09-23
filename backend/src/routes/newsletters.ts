import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { AuthRequest, requireEditor } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all published newsletters (public)
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [newsletters, total] = await Promise.all([
      prisma.newsletter.findMany({
        where: { isPublished: true },
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
      prisma.newsletter.count({ where: { isPublished: true } })
    ]);

    res.json({
      success: true,
      data: {
        newsletters,
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

// Get single newsletter (public)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const newsletter = await prisma.newsletter.findFirst({
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

    if (!newsletter) {
      throw createError('Newsletter not found', 404);
    }

    res.json({
      success: true,
      data: { newsletter }
    });
  } catch (error) {
    next(error);
  }
});

// Create newsletter (admin/editor only)
router.post('/', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { title, content, summary, pdfUrl, isPublished } = req.body;

    if (!title || !content) {
      throw createError('Title and content are required', 400);
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        content,
        summary,
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
      message: 'Newsletter created successfully',
      data: { newsletter }
    });
  } catch (error) {
    next(error);
  }
});

// Update newsletter (admin/editor only)
router.put('/:id', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, summary, pdfUrl, isPublished } = req.body;

    const newsletter = await prisma.newsletter.update({
      where: { id },
      data: {
        title,
        content,
        summary,
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
      message: 'Newsletter updated successfully',
      data: { newsletter }
    });
  } catch (error) {
    next(error);
  }
});

// Delete newsletter (admin/editor only)
router.delete('/:id', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.newsletter.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Newsletter deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 