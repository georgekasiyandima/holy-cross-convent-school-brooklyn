import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all terms
router.get('/terms', async (req, res) => {
  try {
    const terms = await prisma.academicTerm.findMany({
      orderBy: [{ year: 'desc' }, { termNumber: 'desc' }],
    });
    return res.json(terms);
  } catch (error) {
    console.error('Error fetching terms:', error);
    return res.status(500).json({ error: 'Failed to fetch terms' });
  }
});

// Get active term
router.get('/terms/active', async (req, res) => {
  try {
    const term = await prisma.academicTerm.findFirst({
      where: { isActive: true },
      orderBy: [{ year: 'desc' }, { termNumber: 'desc' }],
    });

    if (!term) {
      return res.status(404).json({ error: 'No active term found' });
    }

    return res.json(term);
  } catch (error) {
    console.error('Error fetching active term:', error);
    return res.status(500).json({ error: 'Failed to fetch active term' });
  }
});

// Create new term
router.post('/terms',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const { year, termNumber, name, startDate, endDate, description, isActive } = req.body;

      if (!year || !termNumber || !name || !startDate || !endDate) {
        return res.status(400).json({ error: 'year, termNumber, name, startDate, and endDate are required.' });
      }

      const created = await prisma.academicTerm.create({
        data: {
          year: Number(year),
          termNumber: Number(termNumber),
          name,
          description: description || null,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          isActive: Boolean(isActive),
        },
      });

      if (isActive) {
        await prisma.academicTerm.updateMany({
          where: { id: { not: created.id } },
          data: { isActive: false },
        });
      }

      return res.status(201).json(created);
    } catch (error) {
      console.error('Error creating term:', error);
      return res.status(500).json({ error: 'Failed to create term' });
    }
  }
);

// Update term
router.put('/terms/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { year, termNumber, name, startDate, endDate, description, isActive } = req.body;

      const updated = await prisma.academicTerm.update({
        where: { id },
        data: {
          year: year !== undefined ? Number(year) : undefined,
          termNumber: termNumber !== undefined ? Number(termNumber) : undefined,
          name,
          description,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          isActive,
        },
      });

      if (isActive) {
        await prisma.academicTerm.updateMany({
          where: { id: { not: updated.id } },
          data: { isActive: false },
        });
      }

      return res.json(updated);
    } catch (error) {
      console.error('Error updating term:', error);
      return res.status(500).json({ error: 'Failed to update term' });
    }
  }
);

// Set active term
router.patch('/terms/:id/activate',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.$transaction([
        prisma.academicTerm.updateMany({
          data: { isActive: false },
        }),
        prisma.academicTerm.update({
          where: { id },
          data: { isActive: true },
        }),
      ]);

      const activeTerm = await prisma.academicTerm.findUnique({ where: { id } });
      return res.json(activeTerm);
    } catch (error) {
      console.error('Error activating term:', error);
      return res.status(500).json({ error: 'Failed to activate term' });
    }
  }
);

// Get calendar events
router.get('/events', async (req, res) => {
  try {
    const { 
      year, 
      month, 
      category, 
      type, 
      grade,
      startDate,
      endDate 
    } = req.query;

    const where: any = {};

    if (year) {
      const startOfYear = new Date(`${year}-01-01`);
      const endOfYear = new Date(`${year}-12-31`);
      where.startDate = {
        gte: startOfYear,
        lte: endOfYear
      };
    }

    if (month) {
      const yearNum = year ? parseInt(year as string) : new Date().getFullYear();
      const monthNum = parseInt(month as string);
      const startOfMonth = new Date(yearNum, monthNum - 1, 1);
      const endOfMonth = new Date(yearNum, monthNum, 0);
      where.startDate = {
        gte: startOfMonth,
        lte: endOfMonth
      };
    }

    // Note: termId filter removed as Term model doesn't exist

    if (category) {
      where.category = category;
    }

    if (type) {
      where.type = type;
    }

    if (grade) {
      where.OR = [
        { grade: grade },
        { grade: 'all' }
      ];
    }

    if (startDate && endDate) {
      where.startDate = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const events = await prisma.academicCalendar.findMany({
      where,
      orderBy: { startDate: 'asc' }
    });

    return res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

// Create calendar event
router.post('/events',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const {
        title,
        description,
        startDate,
        endDate,
        type,
        isHoliday,
        isExam,
        isPublicHoliday,
        grade,
        category,
        location,
        time
      } = req.body;

      const event = await prisma.academicCalendar.create({
        data: {
          title,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          type,
          isHoliday: isHoliday || false,
          isExam: isExam || false,
          isPublicHoliday: isPublicHoliday || false,
          grade: grade || 'all',
          category,
          location,
          time
          // Note: facebookLink and termId are not in AcademicCalendar schema
        }
      });

      return res.status(201).json(event);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return res.status(500).json({ error: 'Failed to create calendar event' });
    }
  }
);

// Update calendar event
router.put('/events/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        startDate,
        endDate,
        type,
        isHoliday,
        isExam,
        isPublicHoliday,
        grade,
        category,
        location,
        time
      } = req.body;

      const event = await prisma.academicCalendar.update({
        where: { id },
        data: {
          title,
          description,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          type,
          isHoliday,
          isExam,
          isPublicHoliday,
          grade,
          category,
          location,
          time
          // Note: facebookLink and termId are not in AcademicCalendar schema
        }
      });

      return res.json(event);
    } catch (error) {
      console.error('Error updating calendar event:', error);
      return res.status(500).json({ error: 'Failed to update calendar event' });
    }
  }
);

// Delete calendar event
router.delete('/events/:id',
  authMiddleware,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.academicCalendar.delete({
        where: { id }
      });

      return res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return res.status(500).json({ error: 'Failed to delete calendar event' });
    }
  }
);

// Get upcoming events
router.get('/events/upcoming', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const today = new Date();

    const events = await prisma.academicCalendar.findMany({
      where: {
        startDate: {
          gte: today
        }
      },
      orderBy: { startDate: 'asc' },
      take: parseInt(limit as string)
    });

    return res.json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return res.status(500).json({ error: 'Failed to fetch upcoming events' });
  }
});

// Get events by date range
router.get('/events/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const events = await prisma.academicCalendar.findMany({
      where: {
        startDate: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
      },
      orderBy: { startDate: 'asc' }
    });

    return res.json(events);
  } catch (error) {
    console.error('Error fetching events by date range:', error);
    return res.status(500).json({ error: 'Failed to fetch events by date range' });
  }
});

export default router;
