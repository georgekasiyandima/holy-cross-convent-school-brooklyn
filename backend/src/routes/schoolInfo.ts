import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();
const prisma = new PrismaClient();

// Get all school information
router.get('/', async (req, res) => {
  try {
    const { category, isPublic } = req.query;
    
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (isPublic !== undefined) {
      where.isPublic = isPublic === 'true';
    }

    const schoolInfo = await prisma.schoolInfo.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    });

    // Group by category for better organization
    const groupedInfo = schoolInfo.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    res.json(groupedInfo);
  } catch (error) {
    console.error('Error fetching school information:', error);
    res.status(500).json({ error: 'Failed to fetch school information' });
  }
});

// Get public school information
router.get('/public', async (req, res) => {
  try {
    const { category } = req.query;
    
    const where: any = { isPublic: true };
    
    if (category) {
      where.category = category;
    }

    const schoolInfo = await prisma.schoolInfo.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    });

    // Group by category
    const groupedInfo = schoolInfo.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    res.json(groupedInfo);
  } catch (error) {
    console.error('Error fetching public school information:', error);
    res.status(500).json({ error: 'Failed to fetch public school information' });
  }
});

// Get specific school information by key
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    const schoolInfo = await prisma.schoolInfo.findUnique({
      where: { key }
    });

    if (!schoolInfo) {
      return res.status(404).json({ error: 'School information not found' });
    }

    return res.json(schoolInfo);
  } catch (error) {
    console.error('Error fetching school information:', error);
    return res.status(500).json({ error: 'Failed to fetch school information' });
  }
});

// Create or update school information
router.post('/',
  authMiddleware,
  requireRole(['ADMIN', 'EDITOR']),
  async (req, res) => {
    try {
      const {
        key,
        value,
        type = 'text',
        category = 'general',
        isPublic = true,
        order = 0
      } = req.body;

      const schoolInfo = await prisma.schoolInfo.upsert({
        where: { key },
        update: {
          value,
          type,
          category,
          isPublic,
          order
        },
        create: {
          key,
          value,
          type,
          category,
          isPublic,
          order
        }
      });

      return res.json(schoolInfo);
    } catch (error) {
      console.error('Error creating/updating school information:', error);
      return res.status(500).json({ error: 'Failed to create/update school information' });
    }
  }
);

// Update school information
router.put('/:key',
  authMiddleware,
  requireRole(['ADMIN', 'EDITOR']),
  async (req, res) => {
    try {
      const { key } = req.params;
      const {
        value,
        type,
        category,
        isPublic,
        order
      } = req.body;

      const schoolInfo = await prisma.schoolInfo.update({
        where: { key },
        data: {
          value,
          type,
          category,
          isPublic,
          order
        }
      });

      return res.json(schoolInfo);
    } catch (error) {
      console.error('Error updating school information:', error);
      return res.status(500).json({ error: 'Failed to update school information' });
    }
  }
);

// Delete school information
router.delete('/:key',
  authMiddleware,
  requireRole(['ADMIN']),
  async (req, res) => {
    try {
      const { key } = req.params;

      await prisma.schoolInfo.delete({
        where: { key }
      });

      return res.json({ message: 'School information deleted successfully' });
    } catch (error) {
      console.error('Error deleting school information:', error);
      return res.status(500).json({ error: 'Failed to delete school information' });
    }
  }
);

// Academic Calendar Management
router.get('/calendar/academic', async (req, res) => {
  try {
    const { year, type, grade } = req.query;
    
    const where: any = {};
    
    if (year) {
      where.OR = [
        { startDate: { gte: new Date(`${year}-01-01`) } },
        { endDate: { lte: new Date(`${year}-12-31`) } }
      ];
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

    const calendar = await prisma.academicCalendar.findMany({
      where,
      orderBy: { startDate: 'asc' }
    });

    res.json(calendar);
  } catch (error) {
    console.error('Error fetching academic calendar:', error);
    res.status(500).json({ error: 'Failed to fetch academic calendar' });
  }
});

// Create academic calendar event
router.post('/calendar/academic',
  authMiddleware,
  requireRole(['ADMIN', 'EDITOR']),
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
        grade
      } = req.body;

      const calendarEvent = await prisma.academicCalendar.create({
        data: {
          title,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          type,
          isHoliday,
          isExam,
          grade
        }
      });

      res.status(201).json(calendarEvent);
    } catch (error) {
      console.error('Error creating academic calendar event:', error);
      res.status(500).json({ error: 'Failed to create academic calendar event' });
    }
  }
);

// Fee Structure Management
router.get('/fees/structure', async (req, res) => {
  try {
    const { grade, feeType, academicYear, isActive } = req.query;
    
    const where: any = {};
    
    if (grade) {
      where.grade = grade;
    }
    
    if (feeType) {
      where.feeType = feeType;
    }
    
    if (academicYear) {
      where.academicYear = academicYear;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const feeStructure = await prisma.feeStructure.findMany({
      where,
      orderBy: [
        { grade: 'asc' },
        { feeType: 'asc' }
      ]
    });

    // Group by grade
    const groupedFees = feeStructure.reduce((acc, fee) => {
      if (!acc[fee.grade]) {
        acc[fee.grade] = [];
      }
      acc[fee.grade].push(fee);
      return acc;
    }, {} as Record<string, any[]>);

    res.json(groupedFees);
  } catch (error) {
    console.error('Error fetching fee structure:', error);
    res.status(500).json({ error: 'Failed to fetch fee structure' });
  }
});

// Create fee structure
router.post('/fees/structure',
  authMiddleware,
  requireRole(['ADMIN']),
  async (req, res) => {
    try {
      const {
        grade,
        feeType,
        amount,
        currency = 'ZAR',
        description,
        academicYear,
        dueDate
      } = req.body;

      const feeStructure = await prisma.feeStructure.create({
        data: {
          grade,
          feeType,
          amount: parseFloat(amount),
          currency,
          description,
          academicYear,
          dueDate: dueDate ? new Date(dueDate) : null
        }
      });

      res.status(201).json(feeStructure);
    } catch (error) {
      console.error('Error creating fee structure:', error);
      res.status(500).json({ error: 'Failed to create fee structure' });
    }
  }
);

// Forms Management
router.get('/forms', async (req, res) => {
  try {
    const { category, isActive } = req.query;
    
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const forms = await prisma.form.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    });

    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

// Create form
router.post('/forms',
  authMiddleware,
  requireRole(['ADMIN', 'EDITOR']),
  upload.single('pdf'),
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        order = 0
      } = req.body;

      const pdfUrl = req.file ? `/uploads/forms/${req.file.filename}` : null;

      const form = await prisma.form.create({
        data: {
          title,
          description,
          category,
          pdfUrl,
          order: parseInt(order)
        }
      });

      res.status(201).json(form);
    } catch (error) {
      console.error('Error creating form:', error);
      res.status(500).json({ error: 'Failed to create form' });
    }
  }
);

// Get school statistics
router.get('/stats/overview',
  authMiddleware,
  requireRole(['ADMIN', 'EDITOR']),
  async (req, res) => {
    try {
      const [
        totalStaff,
        activeStaff,
        totalEvents,
        publishedEvents,
        totalNews,
        publishedNews,
        totalPolicies,
        publishedPolicies,
        totalForms,
        activeForms
      ] = await Promise.all([
        prisma.staffMember.count(),
        prisma.staffMember.count({ where: { isActive: true } }),
        prisma.event.count(),
        prisma.event.count({ where: { isPublished: true } }),
        prisma.newsArticle.count(),
        prisma.newsArticle.count({ where: { isPublished: true } }),
        prisma.policy.count(),
        prisma.policy.count({ where: { isPublished: true } }),
        prisma.form.count(),
        prisma.form.count({ where: { isActive: true } })
      ]);

      res.json({
        staff: {
          total: totalStaff,
          active: activeStaff
        },
        events: {
          total: totalEvents,
          published: publishedEvents
        },
        news: {
          total: totalNews,
          published: publishedNews
        },
        policies: {
          total: totalPolicies,
          published: publishedPolicies
        },
        forms: {
          total: totalForms,
          active: activeForms
        }
      });
    } catch (error) {
      console.error('Error fetching school statistics:', error);
      res.status(500).json({ error: 'Failed to fetch school statistics' });
    }
  }
);

// Bulk update school information
router.post('/bulk-update',
  authMiddleware,
  requireRole(['ADMIN']),
  async (req, res) => {
    try {
      const { updates } = req.body; // Array of { key, value, type, category, isPublic, order }

      const results = await Promise.all(
        updates.map(async (update: any) => {
          return await prisma.schoolInfo.upsert({
            where: { key: update.key },
            update: {
              value: update.value,
              type: update.type,
              category: update.category,
              isPublic: update.isPublic,
              order: update.order
            },
            create: {
              key: update.key,
              value: update.value,
              type: update.type,
              category: update.category,
              isPublic: update.isPublic,
              order: update.order
            }
          });
        })
      );

      res.json({ message: 'Bulk update completed successfully', results });
    } catch (error) {
      console.error('Error performing bulk update:', error);
      res.status(500).json({ error: 'Failed to perform bulk update' });
    }
  }
);

export default router;
