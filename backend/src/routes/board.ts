import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all board members (public route)
router.get('/', async (req, res) => {
  try {
    const boardMembers = await prisma.boardMember.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    return res.json(boardMembers);
  } catch (error) {
    console.error('Error fetching board members:', error);
    return res.status(500).json({ error: 'Failed to fetch board members' });
  }
});

// Get board members by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    const boardMembers = await prisma.boardMember.findMany({
      where: {
        isActive: true,
        type: type as any
      },
      orderBy: {
        order: 'asc'
      }
    });

    return res.json(boardMembers);
  } catch (error) {
    console.error('Error fetching board members by type:', error);
    return res.status(500).json({ error: 'Failed to fetch board members' });
  }
});

// Get single board member by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const boardMember = await prisma.boardMember.findUnique({
      where: { id }
    });

    if (!boardMember) {
      return res.status(404).json({ error: 'Board member not found' });
    }

    return res.json(boardMember);
  } catch (error) {
    console.error('Error fetching board member:', error);
    return res.status(500).json({ error: 'Failed to fetch board member' });
  }
});

// Create new board member (admin only)
router.post('/', authMiddleware, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { name, role, position, type, email, phone, bio, order } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: 'Name and role are required' });
    }

    const boardMember = await prisma.boardMember.create({
      data: {
        name,
        role,
        position,
        type: type || 'MEMBER',
        email,
        phone,
        bio,
        order: order || 0,
        isActive: true
      }
    });

    return res.status(201).json(boardMember);
  } catch (error) {
    console.error('Error creating board member:', error);
    return res.status(500).json({ error: 'Failed to create board member' });
  }
});

// Update board member (admin only)
router.put('/:id', authMiddleware, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, position, type, email, phone, bio, order, isActive } = req.body;

    const boardMember = await prisma.boardMember.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(position !== undefined && { position }),
        ...(type && { type }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return res.json(boardMember);
  } catch (error) {
    console.error('Error updating board member:', error);
    return res.status(500).json({ error: 'Failed to update board member' });
  }
});

// Delete board member (admin only)
router.delete('/:id', authMiddleware, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.boardMember.delete({
      where: { id }
    });

    return res.json({ message: 'Board member deleted successfully' });
  } catch (error) {
    console.error('Error deleting board member:', error);
    return res.status(500).json({ error: 'Failed to delete board member' });
  }
});

// Reorder board members (admin only)
router.post('/reorder', authMiddleware, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { boardMembers } = req.body;

    if (!Array.isArray(boardMembers)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Update each board member's order
    const updatePromises = boardMembers.map((member: any) =>
      prisma.boardMember.update({
        where: { id: member.id },
        data: { order: member.order }
      })
    );

    await Promise.all(updatePromises);

    return res.json({ message: 'Board members reordered successfully' });
  } catch (error) {
    console.error('Error reordering board members:', error);
    return res.status(500).json({ error: 'Failed to reorder board members' });
  }
});

export default router;

