import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { AuthRequest, requireEditor } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all published events (public)
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, upcoming } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isPublished: true };
    
    if (upcoming === 'true') {
      where.startDate = {
        gte: new Date()
      };
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { startDate: 'asc' },
        skip,
        take: Number(limit)
      }),
      prisma.event.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        events,
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

// Get single event (public)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findFirst({
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

    if (!event) {
      throw createError('Event not found', 404);
    }

    res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    next(error);
  }
});

// Create event (admin/editor only)
router.post('/', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { title, description, startDate, endDate, location, imageUrl, isPublished } = req.body;

    if (!title || !description || !startDate) {
      throw createError('Title, description, and start date are required', 400);
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        imageUrl,
        isPublished: isPublished || false,
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
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    next(error);
  }
});

// Update event (admin/editor only)
router.put('/:id', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, location, imageUrl, isPublished } = req.body;

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        location,
        imageUrl,
        isPublished
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
      message: 'Event updated successfully',
      data: { event }
    });
  } catch (error) {
    next(error);
  }
});

// Delete event (admin/editor only)
router.delete('/:id', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 