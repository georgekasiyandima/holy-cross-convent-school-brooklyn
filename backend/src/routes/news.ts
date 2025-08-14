import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { AuthRequest, requireEditor } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

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
        include: {
          author: {
            select: {
              id: true,
              name: true
            }
          },
          tags: true
        },
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

// Get single news article (public)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await prisma.newsArticle.findFirst({
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
        },
        tags: true
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
router.post('/', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { title, content, summary, imageUrl, isPublished, tagIds } = req.body;

    if (!title || !content) {
      throw createError('Title and content are required', 400);
    }

    const article = await prisma.newsArticle.create({
      data: {
        title,
        content,
        summary,
        imageUrl,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
        authorId: req.user!.id,
        tags: tagIds ? {
          connect: tagIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        tags: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: { article }
    });
  } catch (error) {
    next(error);
  }
});

// Update news article (admin/editor only)
router.put('/:id', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, summary, imageUrl, isPublished, tagIds } = req.body;

    const article = await prisma.newsArticle.update({
      where: { id },
      data: {
        title,
        content,
        summary,
        imageUrl,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        tags: tagIds ? {
          set: tagIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        tags: true
      }
    });

    res.json({
      success: true,
      message: 'News article updated successfully',
      data: { article }
    });
  } catch (error) {
    next(error);
  }
});

// Delete news article (admin/editor only)
router.delete('/:id', requireEditor, async (req: AuthRequest, res, next) => {
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

export default router; 