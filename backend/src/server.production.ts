import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
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
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma Client
// For production, use PostgreSQL (Railway automatically provides DATABASE_URL)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
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

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

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

// Note: Staff, Board, News, Events, and Calendar APIs are handled by their respective route files
// (staffRoutes, boardRoutes, etc.) which are already mounted above

// Error handling middleware (must be last)
app.use(errorHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

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

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡️[server]: Server is running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/api/health`);
  console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  console.log(`Database path: ${dbPath}`);
  console.log(`Database exists: ${fs.existsSync(dbPath)}`);
});

export { app, server };