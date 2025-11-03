import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireEditor, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Unified Calendar Event Interface
 * Combines both Event and AcademicCalendar models into a single format
 */
interface UnifiedCalendarEvent {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  imageUrl: string | null;
  category: string;
  type: string;
  source: 'event' | 'academic'; // Track which model it came from
  // AcademicCalendar specific fields
  isHoliday?: boolean;
  isExam?: boolean;
  isPublicHoliday?: boolean;
  grade?: string | null;
  time?: string | null;
  facebookLink?: string | null;
  // Event specific fields
  isPublished?: boolean;
  authorId?: string | null;
  authorName?: string | null;
}

/**
 * GET /api/school-hub/events
 * Unified endpoint that fetches both Event and AcademicCalendar entries
 * 
 * Query params:
 * - year: Filter by year
 * - month: Filter by month (1-12)
 * - category: Filter by category (academic, spiritual, cultural, sports, community)
 * - type: Filter by type (EXAM, HOLIDAY, CULTURAL_DAY, etc.)
 * - grade: Filter by grade (all, 0, 1, 2, etc.)
 * - startDate: Start date for range filter
 * - endDate: End date for range filter
 * - upcoming: Only return future events (true/false)
 * - source: Filter by source (event, academic, or both)
 */
router.get('/events', async (req, res, next) => {
  try {
    const {
      year,
      month,
      category,
      type,
      grade,
      startDate,
      endDate,
      upcoming,
      source // 'event', 'academic', or undefined for both
    } = req.query;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build date filter
    let dateFilter: any = {};
    
    if (upcoming === 'true') {
      dateFilter.startDate = { gte: today };
    } else if (startDate && endDate) {
      dateFilter.startDate = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    } else if (year) {
      const startOfYear = new Date(`${year}-01-01`);
      const endOfYear = new Date(`${year}-12-31`);
      dateFilter.startDate = {
        gte: startOfYear,
        lte: endOfYear
      };
      
      if (month) {
        const yearNum = parseInt(year as string);
        const monthNum = parseInt(month as string);
        const startOfMonth = new Date(yearNum, monthNum - 1, 1);
        const endOfMonth = new Date(yearNum, monthNum, 0);
        dateFilter.startDate = {
          gte: startOfMonth,
          lte: endOfMonth
        };
      }
    }

    const unifiedEvents: UnifiedCalendarEvent[] = [];

    // Fetch AcademicCalendar events
    if (!source || source === 'academic') {
      const academicWhere: any = { ...dateFilter };
      
      if (category) {
        academicWhere.category = category;
      }
      
      if (type) {
        academicWhere.type = type;
      }
      
      if (grade) {
        academicWhere.OR = [
          { grade: grade },
          { grade: 'all' }
        ];
      }

      const academicEvents = await prisma.academicCalendar.findMany({
        where: academicWhere,
        orderBy: { startDate: 'asc' }
      });

      // Transform AcademicCalendar to unified format
      academicEvents.forEach(event => {
        unifiedEvents.push({
          id: event.id,
          title: event.title,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location || null,
          imageUrl: null,
          category: event.category,
          type: event.type,
          source: 'academic',
          isHoliday: event.isHoliday,
          isExam: event.isExam,
          isPublicHoliday: event.isPublicHoliday,
          grade: event.grade,
          time: event.time || null,
          facebookLink: null,
          isPublished: true // AcademicCalendar events are always "published"
        });
      });
    }

    // Fetch Event model events
    if (!source || source === 'event') {
      const eventWhere: any = {
        isPublished: true,
        ...dateFilter
      };

      if (category) {
        eventWhere.category = category;
      }

      const events = await prisma.event.findMany({
        where: eventWhere,
        orderBy: { startDate: 'asc' }
      });

      // Transform Event to unified format
      events.forEach(event => {
        unifiedEvents.push({
          id: event.id,
          title: event.title,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location || null,
          imageUrl: event.imageUrl || null,
          category: event.category || 'community',
          type: 'OTHER', // Event model doesn't have type, default to OTHER
          source: 'event',
          isPublished: event.isPublished,
          authorId: null, // Event model doesn't have authorId
          authorName: null // Event model doesn't have author relation
        });
      });
    }

    // Sort all events by start date
    unifiedEvents.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    res.json({
      success: true,
      data: unifiedEvents,
      count: unifiedEvents.length,
      filters: {
        year,
        month,
        category,
        type,
        grade,
        upcoming: upcoming === 'true'
      }
    });
  } catch (error) {
    console.error('Error fetching unified events:', error);
    next(createError('Failed to fetch events', 500));
  }
});

/**
 * GET /api/school-hub/events/upcoming
 * Get upcoming events from both sources
 */
router.get('/events/upcoming', async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch upcoming academic calendar events
    const academicEvents = await prisma.academicCalendar.findMany({
      where: {
        startDate: { gte: today }
      },
      orderBy: { startDate: 'asc' },
      take: Math.ceil(Number(limit) / 2)
    });

    // Fetch upcoming regular events
    const events = await prisma.event.findMany({
      where: {
        isPublished: true,
        startDate: { gte: today }
      },
      orderBy: { startDate: 'asc' },
      take: Math.ceil(Number(limit) / 2)
    });

    const unifiedEvents: UnifiedCalendarEvent[] = [];

    academicEvents.forEach(event => {
      unifiedEvents.push({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location || null,
        imageUrl: null,
        category: event.category,
        type: event.type,
        source: 'academic',
        isHoliday: event.isHoliday,
        isExam: event.isExam,
        isPublicHoliday: event.isPublicHoliday,
        grade: event.grade,
        time: event.time || null,
        isPublished: true
      });
    });

    events.forEach(event => {
      unifiedEvents.push({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location || null,
        imageUrl: event.imageUrl || null,
        category: event.category || 'community',
        type: 'OTHER',
        source: 'event',
        isPublished: event.isPublished,
        authorId: null, // Event model doesn't have authorId
        authorName: null // Event model doesn't have author relation
      });
    });

    // Sort and limit
    unifiedEvents.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    res.json({
      success: true,
      data: unifiedEvents.slice(0, Number(limit)),
      count: unifiedEvents.length
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    next(createError('Failed to fetch upcoming events', 500));
  }
});

/**
 * GET /api/school-hub/events/:id
 * Get a single event by ID (searches both models)
 */
router.get('/events/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Try AcademicCalendar first
    let event = await prisma.academicCalendar.findUnique({
      where: { id }
    });

    let source: 'event' | 'academic' = 'academic';

    // If not found, try Event model
    if (!event) {
      event = await prisma.event.findUnique({
        where: { id }
      }) as any;
      source = 'event';
    }

    if (!event) {
      throw createError('Event not found', 404);
    }

    // Transform to unified format
    const unifiedEvent: UnifiedCalendarEvent = source === 'academic' ? {
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location || null,
      imageUrl: null,
      category: event.category,
      type: event.type,
      source: 'academic',
      isHoliday: event.isHoliday,
      isExam: event.isExam,
      isPublicHoliday: event.isPublicHoliday,
      grade: event.grade,
      time: event.time || null,
      isPublished: true
    } : {
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location || null,
      imageUrl: (event as any).imageUrl || null,
      category: event.category || 'community',
      type: 'OTHER',
      source: 'event',
      isPublished: (event as any).isPublished,
      authorId: null, // Event model doesn't have authorId
      authorName: null // Event model doesn't have author relation
    };

    res.json({
      success: true,
      data: unifiedEvent
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/school-hub/events
 * Create a new event (can create either type based on request body)
 */
router.post('/events', authMiddleware, requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      imageUrl,
      category,
      type,
      isHoliday,
      isExam,
      isPublicHoliday,
      grade,
      time,
      facebookLink,
      eventType = 'academic' // 'academic' or 'event'
    } = req.body;

    if (!title || !startDate) {
      throw createError('Title and start date are required', 400);
    }

    let createdEvent;

    if (eventType === 'academic') {
      // Create AcademicCalendar entry
      createdEvent = await prisma.academicCalendar.create({
        data: {
          title,
          description: description || null,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          type: type || 'OTHER',
          category: category || 'academic',
          isHoliday: isHoliday || false,
          isExam: isExam || false,
          isPublicHoliday: isPublicHoliday || false,
          grade: grade || 'all',
          location: location || null,
          time: time || null
          // Note: facebookLink is not in AcademicCalendar schema
        }
      });
    } else {
      // Create Event entry
      createdEvent = await prisma.event.create({
        data: {
          title,
          description: description || '',
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          location: location || null,
          imageUrl: imageUrl || null,
          category: category || 'community',
          isPublished: req.body.isPublished !== false
          // Note: Event model doesn't have authorId field
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: createdEvent
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/school-hub/events/:id
 * Update an event (automatically detects which model to update)
 */
router.put('/events/:id', authMiddleware, requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    // Check which model contains this ID
    const academicEvent = await prisma.academicCalendar.findUnique({
      where: { id }
    });

    if (academicEvent) {
      // Update AcademicCalendar
      const updated = await prisma.academicCalendar.update({
        where: { id },
        data: {
          title: req.body.title,
          description: req.body.description,
          startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
          endDate: req.body.endDate ? new Date(req.body.endDate) : null,
          type: req.body.type,
          category: req.body.category,
          isHoliday: req.body.isHoliday,
          isExam: req.body.isExam,
          isPublicHoliday: req.body.isPublicHoliday,
          grade: req.body.grade,
          location: req.body.location,
          time: req.body.time
          // Note: facebookLink is not in AcademicCalendar schema
        }
      });

      return res.json({
        success: true,
        message: 'Event updated successfully',
        data: updated
      });
    }

    // Try Event model
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (event) {
      const updated = await prisma.event.update({
        where: { id },
        data: {
          title: req.body.title,
          description: req.body.description,
          startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
          endDate: req.body.endDate ? new Date(req.body.endDate) : null,
          location: req.body.location,
          imageUrl: req.body.imageUrl,
          category: req.body.category,
          isPublished: req.body.isPublished
        }
      });

      return res.json({
        success: true,
        message: 'Event updated successfully',
        data: updated
      });
    }

    throw createError('Event not found', 404);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/school-hub/events/:id
 * Delete an event (automatically detects which model to delete from)
 */
router.delete('/events/:id', authMiddleware, requireEditor, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    // Try AcademicCalendar first
    const academicEvent = await prisma.academicCalendar.findUnique({
      where: { id }
    });

    if (academicEvent) {
      await prisma.academicCalendar.delete({
        where: { id }
      });
      return res.json({
        success: true,
        message: 'Event deleted successfully'
      });
    }

    // Try Event model
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (event) {
      await prisma.event.delete({
        where: { id }
      });
      return res.json({
        success: true,
        message: 'Event deleted successfully'
      });
    }

    throw createError('Event not found', 404);
  } catch (error) {
    next(error);
  }
});

export default router;

