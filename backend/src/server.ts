import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Holy Cross Convent School Brooklyn API',
    version: '1.0.0',
    status: 'running'
  });
});

// School information route
app.get('/api/school', (req: Request, res: Response) => {
  res.json({
    name: 'Holy Cross Convent School Brooklyn',
    address: '123 School Street, Brooklyn, NY 11201',
    phone: '(555) 123-4567',
    email: 'info@holycrossbrooklyn.edu',
    founded: '1950',
    mission: 'Nurturing Excellence, Building Character, Inspiring Faith',
    grades: 'K-12',
    type: 'Private Catholic School'
  });
});

// Programs route
app.get('/api/programs', (req: Request, res: Response) => {
  res.json([
    {
      id: 1,
      name: 'Elementary School',
      grades: 'K-5',
      description: 'Foundation years focusing on core academics and character development'
    },
    {
      id: 2,
      name: 'Middle School',
      grades: '6-8',
      description: 'Transitional years with expanded curriculum and extracurricular activities'
    },
    {
      id: 3,
      name: 'High School',
      grades: '9-12',
      description: 'College preparatory program with advanced placement courses'
    }
  ]);
});

// Events route
app.get('/api/events', (req: Request, res: Response) => {
  res.json([
    {
      id: 1,
      title: 'Open House',
      date: '2024-03-15',
      time: '10:00 AM',
      description: 'Come visit our campus and meet our faculty'
    },
    {
      id: 2,
      title: 'Spring Concert',
      date: '2024-04-20',
      time: '7:00 PM',
      description: 'Annual student music performance'
    },
    {
      id: 3,
      title: 'Graduation Ceremony',
      date: '2024-06-15',
      time: '2:00 PM',
      description: 'Class of 2024 graduation celebration'
    }
  ]);
});

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 Holy Cross Convent School Brooklyn API`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
}); 