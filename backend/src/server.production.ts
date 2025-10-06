import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS - Allow all origins for now to fix deployment issues
const corsOptions = {
  origin: '*', // Allow all origins temporarily
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Holy Cross Convent School Backend API',
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0'
  });
});

/**
 * ========================================
 * STAFF API - REAL DATABASE CONNECTION
 * ========================================
 */
app.get('/api/staff', async (req, res) => {
  try {
    const staff = await prisma.staffMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    // Group staff by category
    const groupedStaff = {
      leadership: staff.filter(member => member.category === 'LEADERSHIP'),
      teaching: staff.filter(member => member.category === 'TEACHING'),
      admin: staff.filter(member => member.category === 'ADMIN'),
      support: staff.filter(member => member.category === 'SUPPORT')
    };

    res.status(200).json({
      success: true,
      data: {
        staff,
        groupedStaff
      }
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * ========================================
 * BOARD MEMBERS API - REAL DATABASE CONNECTION
 * ========================================
 */
app.get('/api/board', async (req, res) => {
  try {
    const boardMembers = await prisma.boardMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.status(200).json(boardMembers);
  } catch (error) {
    console.error('Error fetching board members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * ========================================
 * NEWS API - REAL DATABASE CONNECTION
 * ========================================
 */
app.get('/api/news', async (req, res) => {
  try {
    const news = await prisma.newsArticle.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 10
    });
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * ========================================
 * EVENTS API - REAL DATABASE CONNECTION
 * ========================================
 */
app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { startDate: 'asc' },
      take: 20
    });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * ========================================
 * CALENDAR API - REAL DATABASE CONNECTION
 * ========================================
 */
app.get('/api/calendar/events', async (req, res) => {
  try {
    const events = await prisma.academicCalendar.findMany({
      where: { 
        startDate: {
          gte: new Date() // Only future events
        }
      },
      orderBy: { startDate: 'asc' }
    });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/calendar/terms', async (req, res) => {
  try {
    const terms = await prisma.academicCalendar.findMany({
      where: { 
        type: 'TERM_START'
      },
      orderBy: { startDate: 'asc' }
    });
    res.status(200).json(terms);
  } catch (error) {
    console.error('Error fetching calendar terms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * ========================================
 * SCHOOL STATISTICS API - REAL DATABASE CONNECTION
 * ========================================
 */
app.get('/api/school-stats', async (req, res) => {
  try {
    // Get basic stats from database
    const staffCount = await prisma.staffMember.count({
      where: { isActive: true }
    });
    
    const newsCount = await prisma.newsArticle.count({
      where: { isPublished: true }
    });
    
    const eventsCount = await prisma.event.count({
      where: { isPublished: true }
    });

    // Return mock stats for now (you can create a SchoolStats model later)
    const stats = [
      {
        id: '1',
        title: 'Total Students',
        value: 250,
        description: 'Enrolled students',
        isVisible: true,
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Teaching Staff',
        value: staffCount,
        description: 'Qualified educators',
        isVisible: true,
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Years of Excellence',
        value: 65,
        description: 'Since 1959',
        isVisible: true,
        order: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching school statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

export { app, server };
