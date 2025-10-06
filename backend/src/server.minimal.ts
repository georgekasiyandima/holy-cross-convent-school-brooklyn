import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;
const FRONTEND_URL = 'http://localhost:3000';

// Basic middleware
app.use(express.json());

// CORS configuration - allow all origins for now
app.use(cors({
  origin: '*', // Allow all origins temporarily
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false,
}));

// Handle preflight requests
app.options('*', cors());

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
    environment: 'production',
    version: '1.0.0'
  });
});

// Basic staff endpoint (mock data)
app.get('/api/staff', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      groupedStaff: {
        leadership: [
          {
            id: '1',
            name: 'Mrs Du Plessis',
            role: 'Principal',
            category: 'LEADERSHIP',
            email: 'admin@holycross.co.za',
            phone: '+27 21 123 4567',
            grade: 'Grade 7',
            subjects: ['Leadership'],
            favoriteQuote: 'Education is the most powerful weapon which you can use to change the world. - Nelson Mandela',
            imageUrl: '/api/images/principal.jpg',
            isActive: true,
            order: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        teaching: [
          {
            id: '2',
            name: 'Mrs Wilson',
            role: 'Grade R Teacher',
            category: 'TEACHING',
            email: 'wilson@holycross.co.za',
            phone: '+27 21 123 4568',
            grade: 'Grade R',
            subjects: ['Grade R'],
            favoriteQuote: 'Every child is a different kind of flower, and all together, they make this world a beautiful garden.',
            imageUrl: '/api/images/teacher1.jpg',
            isActive: true,
            order: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      }
    }
  });
});

// Basic board members endpoint (mock data)
app.get('/api/board', (req, res) => {
  res.status(200).json([
    {
      id: '1',
      name: 'Ms Du Plessis',
      role: 'Principal',
      type: 'EXECUTIVE',
      email: 'admin@holycross.co.za',
      bio: 'Principal of Holy Cross Convent School Brooklyn',
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Sr Eileen',
      role: 'Board Member',
      type: 'REPRESENTATIVE',
      email: 'eileen@holycross.co.za',
      bio: 'Religious representative on the school board',
      order: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

// Basic news endpoint (mock data)
app.get('/api/news', (req, res) => {
  res.status(200).json([
    {
      id: '1',
      title: 'Welcome to Holy Cross Convent School Brooklyn',
      content: 'We are excited to welcome students and families to our school community.',
      author: 'Admin',
      publishedAt: new Date().toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

// Basic events endpoint (mock data)
app.get('/api/events', (req, res) => {
  res.status(200).json([
    {
      id: '1',
      title: 'School Opening Day',
      description: 'Welcome back to school for the new academic year',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      location: 'School Hall',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

// Basic calendar endpoint (mock data)
app.get('/api/calendar', (req, res) => {
  res.status(200).json([
    {
      id: '1',
      title: 'Academic Year 2025',
      description: 'Academic calendar for 2025',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`Environment: production`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

export { app, server };