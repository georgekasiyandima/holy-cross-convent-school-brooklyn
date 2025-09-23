import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { validatePolicy } from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// Get all policies with filtering and pagination
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      isPublished,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished === 'true';
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Get policies with author information
    const policies = await prisma.policy.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [sortBy as string]: sortOrder as 'asc' | 'desc',
      },
      skip,
      take: Number(limit),
    });

    // Get total count for pagination
    const total = await prisma.policy.count({ where });

    res.json({
      policies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
    res.status(500).json({ error: 'Failed to fetch policies' });
  }
});

// Get published policies (public endpoint)
router.get('/published', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;

    const where: any = { isPublished: true };

    if (category) {
      where.category = category;
    }

    const policies = await prisma.policy.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        pdfUrl: true,
        version: true,
        publishedAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    res.json(policies);
  } catch (error) {
    console.error('Error fetching published policies:', error);
    res.status(500).json({ error: 'Failed to fetch published policies' });
  }
});

// Get policy by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const policy = await prisma.policy.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!policy) {
      res.status(404).json({ error: 'Policy not found' });
      return;
    }

    res.json(policy);
  } catch (error) {
    console.error('Error fetching policy:', error);
    res.status(500).json({ error: 'Failed to fetch policy' });
  }
});

// Create new policy
router.post(
  '/',
  authMiddleware,
  requireRole(['ADMIN', 'EDITOR']),
  upload.single('pdf'),
  validatePolicy,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // TypeScript now knows about req.user from our type declaration
      if (!req.user?.id) {
        res.status(401).json({ error: 'Unauthorized: User not authenticated' });
        return;
      }

      const {
        title,
        description,
        content,
        category,
        version = '1.0',
      } = req.body;

      const pdfUrl = req.file ? `/uploads/policies/${req.file.filename}` : null;

      const policy = await prisma.policy.create({
        data: {
          title,
          description,
          content,
          category,
          version,
          pdfUrl,
          authorId: req.user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.status(201).json(policy);
    } catch (error) {
      console.error('Error creating policy:', error);
      res.status(500).json({ error: 'Failed to create policy' });
    }
  }
);

// Update policy
router.put(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN', 'EDITOR']),
  upload.single('pdf'),
  validatePolicy,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        content,
        category,
        version,
        isPublished,
      } = req.body;

      // Check if policy exists
      const existingPolicy = await prisma.policy.findUnique({
        where: { id },
      });

      if (!existingPolicy) {
        res.status(404).json({ error: 'Policy not found' });
        return;
      }

      const updateData: any = {
        title,
        description,
        content,
        category,
        version,
      };

      if (isPublished !== undefined) {
        updateData.isPublished = isPublished === 'true';
        if (isPublished === 'true') {
          updateData.publishedAt = new Date();
        }
      }

      if (req.file) {
        updateData.pdfUrl = `/uploads/policies/${req.file.filename}`;
      }

      const policy = await prisma.policy.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.json(policy);
    } catch (error) {
      console.error('Error updating policy:', error);
      res.status(500).json({ error: 'Failed to update policy' });
    }
  }
);

// Publish/Unpublish policy
router.patch(
  '/:id/publish',
  authMiddleware,
  requireRole(['ADMIN', 'EDITOR']),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { isPublished } = req.body;

      const policy = await prisma.policy.update({
        where: { id },
        data: {
          isPublished: isPublished,
          publishedAt: isPublished ? new Date() : null,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.json(policy);
    } catch (error) {
      console.error('Error updating policy publish status:', error);
      res.status(500).json({ error: 'Failed to update policy publish status' });
    }
  }
);

// Delete policy
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN']),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if policy exists
      const policy = await prisma.policy.findUnique({
        where: { id },
      });

      if (!policy) {
        res.status(404).json({ error: 'Policy not found' });
        return;
      }

      await prisma.policy.delete({
        where: { id },
      });

      res.json({ message: 'Policy deleted successfully' });
    } catch (error) {
      console.error('Error deleting policy:', error);
      res.status(500).json({ error: 'Failed to delete policy' });
    }
  }
);

// Get policy categories
router.get('/categories/list', async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = [
      'ACADEMIC',
      'DISCIPLINARY',
      'SAFETY',
      'FINANCIAL',
      'ADMINISTRATIVE',
      'TECHNOLOGY',
      'HEALTH',
      'OTHER',
    ];
    res.json(categories);
  } catch (error) {
    console.error('Error fetching policy categories:', error);
    res.status(500).json({ error: 'Failed to fetch policy categories' });
  }
});

// Get policy statistics
router.get(
  '/stats-overview',
  authMiddleware,
  requireRole(['ADMIN', 'EDITOR']),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const totalPolicies = await prisma.policy.count();
      const publishedPolicies = await prisma.policy.count({
        where: { isPublished: true },
      });
      const draftPolicies = await prisma.policy.count({
        where: { isPublished: false },
      });

      const policiesByCategory = await prisma.policy.groupBy({
        by: ['category'],
        _count: {
          category: true,
        },
      });

      res.json({
        total: totalPolicies,
        published: publishedPolicies,
        drafts: draftPolicies,
        byCategory: policiesByCategory,
      });
    } catch (error) {
      console.error('Error fetching policy statistics:', error);
      res.status(500).json({ error: 'Failed to fetch policy statistics' });
    }
  }
);

export default router;