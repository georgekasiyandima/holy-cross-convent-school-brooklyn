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
import { errorHandler } from './middleware/errorHandler';
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

// CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

// Events API
app.get('/api/events', async (req, res) => {
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

// Calendar API
app.get('/api/calendar/events', async (req, res) => {
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
});

export default app;
