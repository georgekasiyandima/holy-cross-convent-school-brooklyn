import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { AuthRequest, requireAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Submit contact form (public)
router.post('/submit', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, subject, message, inquiryType } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message || !inquiryType) {
      throw createError('Please fill in all required fields', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError('Please provide a valid email address', 400);
    }

    // Create contact message
    const contactMessage = await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        subject,
        message,
        inquiryType
      }
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
      data: {
        id: contactMessage.id,
        submittedAt: contactMessage.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all contact messages (admin only)
router.get('/', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: any = {};
    
    if (status === 'read') {
      where.isRead = true;
    } else if (status === 'unread') {
      where.isRead = false;
    } else if (status === 'replied') {
      where.isReplied = true;
    } else if (status === 'unreplied') {
      where.isReplied = false;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { subject: { contains: search as string, mode: 'insensitive' } },
        { message: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Get messages with pagination
    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.contactMessage.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        messages,
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

// Get single contact message (admin only)
router.get('/:id', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!message) {
      throw createError('Contact message not found', 404);
    }

    // Mark as read if not already read
    if (!message.isRead) {
      await prisma.contactMessage.update({
        where: { id },
        data: { isRead: true }
      });
    }

    res.json({
      success: true,
      data: { message }
    });
  } catch (error) {
    next(error);
  }
});

// Mark message as read (admin only)
router.patch('/:id/read', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true }
    });

    res.json({
      success: true,
      message: 'Message marked as read',
      data: { message }
    });
  } catch (error) {
    next(error);
  }
});

// Mark message as replied (admin only)
router.patch('/:id/replied', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isReplied: true }
    });

    res.json({
      success: true,
      message: 'Message marked as replied',
      data: { message }
    });
  } catch (error) {
    next(error);
  }
});

// Assign message to admin (admin only)
router.patch('/:id/assign', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { assignedToId } = req.body;

    if (!assignedToId) {
      throw createError('Please provide assignedToId', 400);
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { assignedToId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Message assigned successfully',
      data: { message }
    });
  } catch (error) {
    next(error);
  }
});

// Delete contact message (admin only)
router.delete('/:id', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.contactMessage.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get contact statistics (admin only)
router.get('/stats/overview', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const [
      total,
      unread,
      replied,
      today,
      thisWeek,
      thisMonth
    ] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.contactMessage.count({ where: { isReplied: true } }),
      prisma.contactMessage.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.contactMessage.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        }
      }),
      prisma.contactMessage.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        total,
        unread,
        replied,
        today,
        thisWeek,
        thisMonth
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 