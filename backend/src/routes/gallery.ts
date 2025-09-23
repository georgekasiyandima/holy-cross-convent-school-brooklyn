import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { AuthRequest, requireEditor } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all published gallery images (public)
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isPublished: true };
    
    if (category) {
      where.category = category;
    }

    const [images, total] = await Promise.all([
      prisma.galleryImage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.galleryImage.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        images,
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

// Get gallery categories (public)
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.galleryImage.groupBy({
      by: ['category'],
      where: { isPublished: true },
      _count: {
        category: true
      }
    });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
});

// Create gallery image (admin/editor only)
router.post('/', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { title, description, imageUrl, thumbnailUrl, category, tags } = req.body;

    if (!title || !imageUrl || !category) {
      throw createError('Title, image URL, and category are required', 400);
    }

    const image = await prisma.galleryImage.create({
      data: {
        title,
        description,
        imageUrl,
        thumbnailUrl,
        category,
        tags
      }
    });

    res.status(201).json({
      success: true,
      message: 'Gallery image created successfully',
      data: { image }
    });
  } catch (error) {
    next(error);
  }
});

// Update gallery image (admin/editor only)
router.put('/:id', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, thumbnailUrl, category, tags, isPublished } = req.body;

    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        thumbnailUrl,
        category,
        tags,
        isPublished
      }
    });

    res.json({
      success: true,
      message: 'Gallery image updated successfully',
      data: { image }
    });
  } catch (error) {
    next(error);
  }
});

// Delete gallery image (admin/editor only)
router.delete('/:id', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.galleryImage.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 