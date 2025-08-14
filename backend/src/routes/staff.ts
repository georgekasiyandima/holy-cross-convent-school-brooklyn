import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { AuthRequest, requireEditor } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all active staff members (public)
router.get('/', async (req, res, next) => {
  try {
    const { grade } = req.query;

    const where: any = { isActive: true };
    
    if (grade) {
      where.grade = grade;
    }

    const staff = await prisma.staffMember.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    res.json({
      success: true,
      data: { staff }
    });
  } catch (error) {
    next(error);
  }
});

// Get single staff member (public)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const staff = await prisma.staffMember.findFirst({
      where: { 
        id,
        isActive: true 
      }
    });

    if (!staff) {
      throw createError('Staff member not found', 404);
    }

    res.json({
      success: true,
      data: { staff }
    });
  } catch (error) {
    next(error);
  }
});

// Create staff member (admin/editor only)
router.post('/', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { name, role, email, phone, bio, imageUrl, grade, order } = req.body;

    if (!name || !role) {
      throw createError('Name and role are required', 400);
    }

    const staff = await prisma.staffMember.create({
      data: {
        name,
        role,
        email,
        phone,
        bio,
        imageUrl,
        grade,
        order: order || 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: { staff }
    });
  } catch (error) {
    next(error);
  }
});

// Update staff member (admin/editor only)
router.put('/:id', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, email, phone, bio, imageUrl, grade, order, isActive } = req.body;

    const staff = await prisma.staffMember.update({
      where: { id },
      data: {
        name,
        role,
        email,
        phone,
        bio,
        imageUrl,
        grade,
        order,
        isActive
      }
    });

    res.json({
      success: true,
      message: 'Staff member updated successfully',
      data: { staff }
    });
  } catch (error) {
    next(error);
  }
});

// Delete staff member (admin/editor only)
router.delete('/:id', requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.staffMember.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 