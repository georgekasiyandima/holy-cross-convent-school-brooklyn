import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { AuthRequest, requireAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get dashboard statistics (admin only)
router.get('/stats', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const [
      totalUsers,
      totalNewsArticles,
      totalEvents,
      totalNewsletters,
      totalReports,
      totalContactMessages,
      totalGalleryImages,
      totalStaffMembers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.newsArticle.count(),
      prisma.event.count(),
      prisma.newsletter.count(),
      prisma.report.count(),
      prisma.contactMessage.count(),
      prisma.galleryImage.count(),
      prisma.staffMember.count()
    ]);

    // Get recent activity
    const recentActivity = await prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        subject: true,
        createdAt: true,
        isRead: true
      }
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalNewsArticles,
          totalEvents,
          totalNewsletters,
          totalReports,
          totalContactMessages,
          totalGalleryImages,
          totalStaffMembers
        },
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all users (admin only)
router.get('/users', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.user.count()
    ]);

    res.json({
      success: true,
      data: {
        users,
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

// Update user (admin only)
router.put('/users/:id', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        isActive
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Delete user (admin only)
router.delete('/users/:id', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get system settings (admin only)
router.get('/settings', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const settings = await prisma.setting.findMany();

    res.json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    next(error);
  }
});

// Update system settings (admin only)
router.put('/settings', requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { settings } = req.body;

    const updatedSettings = [];

    for (const setting of settings) {
      const updated = await prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: {
          key: setting.key,
          value: setting.value,
          type: setting.type || 'string'
        }
      });
      updatedSettings.push(updated);
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: { settings: updatedSettings }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 