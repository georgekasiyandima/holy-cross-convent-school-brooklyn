import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const memberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  designation: z.string().optional().nullable(),
  sector: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email('Invalid email').optional().nullable(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

// Public: list all active members ordered
router.get('/', async (req, res, next) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const members = await prisma.governingBodyMember.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    return res.status(200).json({
      success: true,
      data: members,
      count: members.length,
      meta: {
        includeInactive,
      },
    });
  } catch (error) {
    console.error('Error fetching governing body members:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch governing body members',
    });
  }
});

// Admin: create member
router.post(
  '/',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res, next) => {
    try {
      const parsed = memberSchema.parse(req.body);
      const member = await prisma.governingBodyMember.create({
        data: {
          name: parsed.name,
          designation: parsed.designation ?? null,
          sector: parsed.sector ?? null,
          address: parsed.address ?? null,
          phone: parsed.phone ?? null,
          email: parsed.email ?? null,
          order: parsed.order ?? 0,
          isActive: parsed.isActive ?? true,
        },
      });
      res.status(201).json({ success: true, data: member });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: update member
router.put(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res, next) => {
    try {
      const parsed = memberSchema.partial().parse(req.body);
      const member = await prisma.governingBodyMember.update({
        where: { id: req.params.id },
        data: {
          ...parsed,
        },
      });
      res.json({ success: true, data: member });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: delete member
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res, next) => {
    try {
      await prisma.governingBodyMember.delete({
        where: { id: req.params.id },
      });
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

