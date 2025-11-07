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
import galleryRoutes from './routes/gallery';
import vacanciesRoutes from './routes/vacancies';
import { errorHandler } from './middleware/errorHandler';
import keepAliveService from './services/keepAliveService';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

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

// CORS - Allow all origins in development for easier debugging
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.FRONTEND_URL || 'http://localhost:3000')
    : true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - serve uploads directory
// This allows access to files like /uploads/gallery/image.jpg, /uploads/staff/image.jpg, etc.
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    // Set proper CORS headers for images
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  }
}));

// Log upload directory info on startup
console.log('📁 Upload directory configured:', uploadsPath);
console.log('📁 Upload directory exists:', require('fs').existsSync(uploadsPath));

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

// School Hub routes (unified calendar & events)
app.use('/api/school-hub', schoolHubRoutes);

// Calendar routes (terms, etc.)
app.use('/api/calendar', calendarRoutes);

// Gallery routes
app.use('/api/gallery', galleryRoutes);

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
