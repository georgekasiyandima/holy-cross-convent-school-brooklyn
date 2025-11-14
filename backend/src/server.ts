import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import admissionsRoutes from './routes/admissions';
import applicationDocumentsRoutes from './routes/applicationDocuments';
import staffRoutes from './routes/staff';
import documentsRoutes from './routes/documents';
import schoolHubRoutes from './routes/schoolHub';
import calendarRoutes from './routes/calendar';
import newsRoutes from './routes/news';
import galleryRoutes from './routes/gallery';
import governingBodyRoutes from './routes/governingBody';
import vacanciesRoutes from './routes/vacancies';
import { errorHandler } from './middleware/errorHandler';
import keepAliveService from './services/keepAliveService';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
// Allow cross-origin resource embedding for static assets (images)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());
app.use(morgan('combined'));

// CORS - Allow all origins in development for easier debugging
const corsOptions = {
  origin: isProduction 
    ? (process.env.FRONTEND_URL || 'http://localhost:3000')
    : true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 1000, // relaxed limit in development
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});

if (isProduction) {
  app.use('/api/', limiter);
} else {
  console.log('⚙️  Rate limiter disabled for development environment');
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - serve uploads directory
// This allows access to files like /uploads/gallery/image.jpg, /uploads/staff/image.jpg, etc.
// Use process.cwd() to match where files are actually saved
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    // Set proper CORS headers for images
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  }
}));

// Log upload directory info on startup (development only)
if (!isProduction) {
  console.log('📁 Upload directory configured:', uploadsPath);
  console.log('📁 Upload directory exists:', require('fs').existsSync(uploadsPath));
  console.log('📁 Process CWD:', process.cwd());
  console.log('📁 __dirname:', __dirname);
}

// Verify gallery directory exists
const galleryPath = path.join(uploadsPath, 'gallery');
if (require('fs').existsSync(galleryPath)) {
  if (!isProduction) {
    console.log('✅ Gallery directory exists:', galleryPath);
  }
} else {
  if (!isProduction) {
    console.log('⚠️  Gallery directory does not exist yet:', galleryPath);
  }
  require('fs').mkdirSync(galleryPath, { recursive: true });
  if (!isProduction) {
    console.log('✅ Created gallery directory:', galleryPath);
  }
}

// Auth routes
app.use('/api/auth', authRoutes);

// Admissions routes
app.use('/api/admissions', admissionsRoutes);

// Application documents routes
app.use('/api/application-documents', applicationDocumentsRoutes);

// Staff routes
app.use('/api/staff', staffRoutes);

// Documents routes
app.use('/api/documents', documentsRoutes);

// News / announcements routes
app.use('/api/news', newsRoutes);

// School Hub routes (unified calendar & events)
app.use('/api/school-hub', schoolHubRoutes);

// Calendar routes (terms, etc.)
app.use('/api/calendar', calendarRoutes);

// Gallery routes
app.use('/api/gallery', galleryRoutes);

// Governing body routes
app.use('/api/governing-body', governingBodyRoutes);

// Vacancies routes
app.use('/api/vacancies', vacanciesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});


// Board Members API
app.get('/api/board', async (req, res) => {
  try {
    const boardMembers = await prisma.boardMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(boardMembers);
  } catch (error) {
    console.error('Error fetching board members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// News API
app.get('/api/news', async (req, res) => {
  try {
    const news = await prisma.newsArticle.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 10
    });
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DEPRECATED: Events API - Use /api/school-hub/events instead
// This endpoint will be removed in a future version
app.get('/api/events', async (req, res) => {
  // Add deprecation header
  res.setHeader('X-API-Deprecated', 'true');
  res.setHeader('X-API-Deprecation-Message', 'This endpoint is deprecated. Please use /api/school-hub/events instead.');
  res.setHeader('X-API-Alternative', '/api/school-hub/events');
  
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { startDate: 'asc' },
      take: 20
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DEPRECATED: Calendar API - Use /api/school-hub/events instead
// This endpoint will be removed in a future version
app.get('/api/calendar/events', async (req, res) => {
  // Add deprecation header
  res.setHeader('X-API-Deprecated', 'true');
  res.setHeader('X-API-Deprecation-Message', 'This endpoint is deprecated. Please use /api/school-hub/events instead.');
  res.setHeader('X-API-Alternative', '/api/school-hub/events');
  
  try {
    const events = await prisma.academicCalendar.findMany({
      orderBy: { startDate: 'asc' },
      take: 50
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware (must be after all routes)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Holy Cross Convent School Backend Server
📡 Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Health check: http://localhost:${PORT}/api/health
📚 API Documentation: http://localhost:${PORT}/
  `);

  // Start keep-alive service in production to prevent Render sleep
  if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Initializing keep-alive service...');
    // Service will auto-start after 30 seconds
  }
});

export default app;
