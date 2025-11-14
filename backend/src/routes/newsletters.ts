import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth';
import { NewsletterService } from '../services/newsletterService';
import nodemailer from 'nodemailer';

const router = express.Router();
const prisma = new PrismaClient();

// Newsletter status enum
enum NewsletterStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  FAILED = 'FAILED'
}

// Newsletter priority enum
enum NewsletterPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// Get all newsletters
router.get('/', async (req, res) => {
  try {
    const { status, priority, authorId, page = 1, limit = 20 } = req.query;
    
    const result = await NewsletterService.getNewsletters({
      status: status as string,
      priority: priority as string,
      authorId: authorId as string,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    return res.json({
      newsletters: result.newsletters,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        pages: Math.ceil(result.total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return res.status(500).json({ error: 'Failed to fetch newsletters' });
  }
});

// Get single newsletter
router.get('/:id', async (req, res) => {
  try {
    const newsletter = await NewsletterService.getNewsletterById(req.params.id);

    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    return res.json(newsletter);
  } catch (error) {
    console.error('Error fetching newsletter:', error);
    return res.status(500).json({ error: 'Failed to fetch newsletter' });
  }
});

// Create new newsletter
router.post('/',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const {
        title,
        content,
        priority = NewsletterPriority.NORMAL,
        scheduledFor,
        targetAudience = 'ALL', // ALL, SPECIFIC_GRADES, SPECIFIC_PARENTS
        gradeLevels = [],
        attachments = []
      } = req.body;

      const newsletter = await NewsletterService.createNewsletter({
        title,
        content,
        priority,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
        targetAudience,
        gradeLevels,
        attachments,
        authorId: (req as any).user?.id || 'unknown',
      });

      return res.status(201).json(newsletter);
    } catch (error) {
      console.error('Error creating newsletter:', error);
      return res.status(500).json({ error: 'Failed to create newsletter' });
    }
  }
);

// Update newsletter
router.put('/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const { title, content, priority, scheduledFor, status, targetAudience, gradeLevels, attachments } = req.body;

      const newsletter = await NewsletterService.updateNewsletter(req.params.id, {
        title,
        content,
        priority,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
        status,
        targetAudience,
        gradeLevels,
        attachments,
      });

      return res.json(newsletter);
    } catch (error) {
      console.error('Error updating newsletter:', error);
      return res.status(500).json({ error: 'Failed to update newsletter' });
    }
  }
);

// Send newsletter
router.post('/:id/send',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const result = await NewsletterService.sendNewsletter(req.params.id);
      return res.json({ message: 'Newsletter sent successfully', ...result });
    } catch (error) {
      console.error('Error sending newsletter:', error);
      return res.status(500).json({ error: 'Failed to send newsletter' });
    }
  }
);

// Delete newsletter
router.delete('/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      await NewsletterService.deleteNewsletter(req.params.id);
      return res.json({ message: 'Newsletter deleted successfully' });
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      return res.status(500).json({ error: 'Failed to delete newsletter' });
    }
  }
);

// Get newsletter statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const statusGroups = await prisma.newsletter.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const statusCount = statusGroups.reduce<Record<string, number>>((acc, group) => {
      acc[group.status] = group._count.status;
      return acc;
    }, {});

    const totalNewsletters = statusGroups.reduce((sum, group) => sum + group._count.status, 0);

    return res.json({
      newsletters: {
        total: totalNewsletters,
        sent: statusCount[NewsletterStatus.SENT] ?? 0,
        draft: statusCount[NewsletterStatus.DRAFT] ?? 0,
        scheduled: statusCount[NewsletterStatus.SCHEDULED] ?? 0,
      },
      recipients: {
        total: 0,
        sent: 0,
        failed: 0,
        successRate: 0
      }
    });
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    return res.status(500).json({ error: 'Failed to fetch newsletter statistics' });
  }
});

// Get parent email list for targeting
router.get('/parents/list', async (req, res) => {
  try {
    // Parent targeting is not yet implemented; return empty list for now
    return res.json([]);
  } catch (error) {
    console.error('Error fetching parent list:', error);
    return res.status(500).json({ error: 'Failed to fetch parent list' });
  }
});

export default router;