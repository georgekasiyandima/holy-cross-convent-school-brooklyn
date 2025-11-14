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
const PORT = parseInt(process.env.PORT || '5000', 10);

// Validate DATABASE_URL before initializing Prisma
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please set DATABASE_URL in Render Dashboard → Environment Variables');
  process.exit(1);
}

if (!DATABASE_URL.startsWith('postgresql://') && !DATABASE_URL.startsWith('postgres://')) {
  console.error('❌ ERROR: DATABASE_URL must start with postgresql:// or postgres://');
  console.error('Current DATABASE_URL format:', DATABASE_URL.substring(0, 20) + '...');
  console.error('Please check your DATABASE_URL in Render Dashboard → Environment Variables');
  process.exit(1);
}

// Log database connection info (without exposing password)
const dbUrlParts = DATABASE_URL.match(/^(postgresql|postgres):\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
if (dbUrlParts) {
  console.log('✅ Database URL configured:', {
    protocol: dbUrlParts[1],
    user: dbUrlParts[2],
    host: dbUrlParts[4],
    port: dbUrlParts[5],
    database: dbUrlParts[6]
  });
} else {
  console.warn('⚠️  Could not parse DATABASE_URL format');
}

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
// Allow multiple origins for Vercel preview deployments
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  'https://holy-cross-convent-school-brooklyn.vercel.app',
  /^https:\/\/holy-cross-convent-school-brooklyn-.*\.vercel\.app$/, // Allow all Vercel preview URLs
].filter(Boolean);

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed origins
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // In production, allow the origin if no specific CORS is set (fallback)
      if (!process.env.FRONTEND_URL && !process.env.CORS_ORIGIN) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionsRoutes);
app.use('/api/application-documents', applicationDocumentsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/school-hub', schoolHubRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/vacancies', vacanciesRoutes);

// Board Members API (simple endpoint for backward compatibility)
app.get('/api/board', async (req, res, next) => {
  try {
    const boardMembers = await prisma.boardMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(boardMembers);
  } catch (error) {
    next(error);
  }
});

// Board Members by Type (for backward compatibility)
app.get('/api/board/type/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const boardMembers = await prisma.boardMember.findMany({
      where: { 
        isActive: true,
        type: type.toUpperCase()
      },
      orderBy: { order: 'asc' }
    });
    res.json(boardMembers);
  } catch (error) {
    next(error);
  }
});

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
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection by querying a simple table
    await prisma.$queryRaw`SELECT 1`;
    
    // Check if key tables exist (handle gracefully if they don't)
    let tableNames: string[] = [];
    let tablesCheck: any = {};
    
    try {
      const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('staff_members', 'users', 'gallery_items')
      `;
      tableNames = tables.map(t => t.tablename);
      tablesCheck = {
        staff_members: tableNames.includes('staff_members'),
        users: tableNames.includes('users'),
        gallery_items: tableNames.includes('gallery_items'),
        allTables: tableNames
      };
    } catch (tableError: any) {
      // If table check fails, database is connected but tables might not exist
      console.warn('Table check failed (migrations may not have run):', tableError?.message);
      tablesCheck = {
        staff_members: false,
        users: false,
        gallery_items: false,
        allTables: [],
        error: 'Tables check failed - migrations may need to be run'
      };
    }
    
    const needsMigrations = !tablesCheck.staff_members || !tablesCheck.users;
    
    res.status(needsMigrations ? 200 : 200).json({
      status: needsMigrations ? 'WARNING' : 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      version: '1.0.0',
      database: {
        connected: true,
        tables: tablesCheck,
        ...(needsMigrations && {
          message: 'Database connected but migrations may not have been run. Run: npm run prisma:migrate:prod'
        })
      }
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    res.status(200).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      version: '1.0.0',
      database: {
        connected: false,
        error: error?.message || 'Database connection failed',
        message: 'Check DATABASE_URL environment variable and database service status'
      }
    });
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

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

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡️[server]: Server is running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/api/health`);
  console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected (PostgreSQL)' : 'Not configured'}`);
});

export { app, server };
