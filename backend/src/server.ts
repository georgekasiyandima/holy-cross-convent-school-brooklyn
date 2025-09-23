import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Import routes
import authRoutes from './routes/auth';
import newsRoutes from './routes/news';
import eventsRoutes from './routes/events';
import staffRoutes from './routes/staff';
import galleryRoutes from './routes/gallery';
import contactRoutes from './routes/contact';
// import documentRoutes from './routes/documents'; // Temporarily commented out due to TypeScript errors
// import assetRoutes from './routes/assets'; // Temporarily commented out due to TypeScript errors
import schoolRoutes from './routes/schoolInfo';
// import analyticsRoutes from './routes/analytics'; // Commented out - route doesn't exist yet

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Prisma
export const prisma = new PrismaClient({
  log: NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      database: 'connected',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
// app.use('/api/documents', documentRoutes); // Temporarily commented out due to TypeScript errors
// app.use('/api/assets', assetRoutes); // Temporarily commented out due to TypeScript errors
app.use('/api/school', schoolRoutes);
// app.use('/api/analytics', analyticsRoutes); // Commented out - route doesn't exist yet

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Holy Cross Convent School Brooklyn API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      news: '/api/news',
      events: '/api/events',
      staff: '/api/staff',
      gallery: '/api/gallery',
      contact: '/api/contact',
      documents: '/api/documents',
      assets: '/api/assets',
      school: '/api/school',
      analytics: '/api/analytics',
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist.`,
    availableEndpoints: [
      '/api/health',
      '/api/auth',
      '/api/news',
      '/api/events',
      '/api/staff',
      '/api/gallery',
      '/api/contact',
      '/api/documents',
      '/api/assets',
      '/api/school',
      '/api/analytics',
    ],
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🚀 Holy Cross Convent School Brooklyn API Server
📡 Server running on port ${PORT}
🌍 Environment: ${NODE_ENV}
📅 Started at: ${new Date().toISOString()}
🔗 Health check: http://localhost:${PORT}/api/health
📚 API Documentation: http://localhost:${PORT}/
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

export default app;