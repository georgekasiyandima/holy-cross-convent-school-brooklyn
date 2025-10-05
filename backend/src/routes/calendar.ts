import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all terms
router.get('/terms', async (req, res) => {
  try {
    const { year } = req.query;
    
    const where: any = {};
    if (year) {
      where.year = parseInt(year as string);
    }

    const terms = await prisma.term.findMany({
      where,
      include: {
        events: {
          orderBy: { startDate: 'asc' }
        }
      },
      orderBy: { termNumber: 'asc' }
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
    const activeTerm = await prisma.term.findFirst({
      where: { isActive: true },
      include: {
        events: {
          orderBy: { startDate: 'asc' }
        }
      }
    });

    if (!activeTerm) {
      return res.status(404).json({ error: 'No active term found' });
    }

    return res.json(activeTerm);
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
      const { year, termNumber, name, startDate, endDate, description } = req.body;

      // Check if term already exists
      const existingTerm = await prisma.term.findUnique({
        where: {
          year_termNumber: {
            year: parseInt(year),
            termNumber: parseInt(termNumber)
          }
        }
      });

      if (existingTerm) {
        return res.status(400).json({ error: 'Term already exists for this year' });
      }

      const term = await prisma.term.create({
        data: {
          year: parseInt(year),
          termNumber: parseInt(termNumber),
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          description
        }
      });

      return res.status(201).json(term);
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
      const { name, startDate, endDate, description, isActive } = req.body;

      const term = await prisma.term.update({
        where: { id },
        data: {
          name,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          description,
          isActive
        }
      });

      return res.json(term);
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

      // Deactivate all other terms
      await prisma.term.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });

      // Activate the selected term
      const term = await prisma.term.update({
        where: { id },
        data: { isActive: true }
      });

      return res.json(term);
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
      termId, 
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

    if (termId) {
      where.termId = termId;
    }

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
      include: {
        term: true
      },
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
  requireRole(['ADMIN']),
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
        time,
        facebookLink,
        termId
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
          time,
          facebookLink,
          termId
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
  requireRole(['ADMIN']),
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
        time,
        facebookLink,
        termId
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
          time,
          facebookLink,
          termId
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
  requireRole(['ADMIN']),
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
      include: {
        term: true
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
      include: {
        term: true
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
