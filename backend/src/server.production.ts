import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Fix database file permissions before creating Prisma client
const dbPath = path.join(__dirname, '../prisma/dev.db');
const dbDir = path.dirname(dbPath);

// Ensure database directory exists and has proper permissions
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Check if database file exists and is readable
if (fs.existsSync(dbPath)) {
  try {
    // Try to set proper permissions
    fs.chmodSync(dbPath, 0o666);
    console.log('Database file permissions set successfully');
  } catch (error) {
    console.log('Could not set database permissions:', error);
  }
} else {
  console.log('Database file not found at:', dbPath);
  console.log('Available files in prisma directory:');
  try {
    const files = fs.readdirSync(path.join(__dirname, '../prisma'));
    console.log(files);
  } catch (error) {
    console.log('Could not read prisma directory:', error);
  }
}

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Middleware
// Allow cross-origin resource embedding for static assets (images)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
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
    console.log('Fetching staff from database...');
    console.log('Database path:', dbPath);
    console.log('Database exists:', fs.existsSync(dbPath));
    
    const staff = await prisma.staffMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    console.log(`Found ${staff.length} staff members`);

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
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      databasePath: dbPath,
      databaseExists: fs.existsSync(dbPath)
    });
  }
});

/**
 * ========================================
 * BOARD MEMBERS API - REAL DATABASE CONNECTION
 * ========================================
 */
app.get('/api/board', async (req, res) => {
  try {
    console.log('Fetching board members from database...');
    const boardMembers = await prisma.boardMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    
    console.log(`Found ${boardMembers.length} board members`);
    res.status(200).json(boardMembers);
  } catch (error) {
    console.error('Error fetching board members:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * ========================================
 * NEWS API - REAL DATABASE CONNECTION
 * ========================================
 */
app.get('/api/news', async (req, res) => {
  try {
    console.log('Fetching news from database...');
    const news = await prisma.newsArticle.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 10
    });
    
    console.log(`Found ${news.length} news articles`);
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * ========================================
 * EVENTS API - REAL DATABASE CONNECTION
 * ========================================
 */
app.get('/api/events', async (req, res) => {
  try {
    console.log('Fetching events from database...');
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { startDate: 'asc' },
      take: 20
    });
    
    console.log(`Found ${events.length} events`);
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * ========================================
 * CALENDAR API - REAL DATABASE CONNECTION
 * ========================================
 */
app.get('/api/calendar/events', async (req, res) => {
  try {
    console.log('Fetching calendar events from database...');
    const events = await prisma.academicCalendar.findMany({
      where: { 
        startDate: {
          gte: new Date() // Only future events
        }
      },
      orderBy: { startDate: 'asc' }
    });
    
    console.log(`Found ${events.length} calendar events`);
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/calendar/terms', async (req, res) => {
  try {
    console.log('Fetching calendar terms from database...');
    const terms = await prisma.academicCalendar.findMany({
      where: { 
        type: 'TERM_START'
      },
      orderBy: { startDate: 'asc' }
    });
    
    console.log(`Found ${terms.length} calendar terms`);
    res.status(200).json(terms);
  } catch (error) {
    console.error('Error fetching calendar terms:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * ========================================
 * SCHOOL STATISTICS API - REAL DATABASE CONNECTION
 * ========================================
 */
app.get('/api/school-stats', async (req, res) => {
  try {
    console.log('Fetching school statistics from database...');
    
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

    console.log(`Staff: ${staffCount}, News: ${newsCount}, Events: ${eventsCount}`);

    // Return stats with real data
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
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
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
  console.log(`Database path: ${dbPath}`);
  console.log(`Database exists: ${fs.existsSync(dbPath)}`);
});

export { app, server };