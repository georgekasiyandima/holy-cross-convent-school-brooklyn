# Holy Cross Convent School Brooklyn - Backend API

A comprehensive Node.js/Express backend API for the Holy Cross Convent School Brooklyn website, providing dynamic content management, user authentication, and administrative functionality.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - JWT-based authentication with role-based access control
- **Dynamic Content Management** - News, events, newsletters, and announcements
- **Staff Management** - Complete staff directory with profiles and information
- **Gallery Management** - Image upload and organization
- **Contact Form Handling** - Message management and response tracking
- **File Upload System** - Secure file uploads with validation and processing

### New Enhanced Features
- **Policy Document Management** - Complete CRUD operations for school policies
- **Weather Integration** - Real-time weather data with caching and statistics
- **School Information Management** - Dynamic school details and configuration
- **Academic Calendar** - Comprehensive calendar management
- **Fee Structure Management** - Dynamic fee configuration by grade
- **Forms Management** - Document uploads and organization
- **Analytics & Statistics** - Usage tracking and reporting
- **Backup & Maintenance** - System maintenance and backup logs

## 🛠 Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer with Sharp for image processing
- **Validation**: Custom validation middleware
- **Security**: Helmet, CORS, rate limiting
- **Weather API**: OpenWeatherMap integration

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git

## 🚀 Installation

1. **Clone the repository**
```bash
   git clone <repository-url>
cd backend
   ```

2. **Install dependencies**
   ```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the backend directory:
```env
# Database
DATABASE_URL="file:./dev.db"

   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key-here"
   
   # Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3002
   
   # Weather API (optional)
   WEATHER_API_KEY=your_openweather_api_key_here
   
   # File Upload Limits
   MAX_FILE_SIZE=10485760
   ```

4. **Database Setup**
```bash
# Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Seed the database with initial data
   npm run seed
```

5. **Start the server**
```bash
   # Development mode
npm run dev
   
   # Production mode
   npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (admin only)
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### News & Content
- `GET /api/news` - Get all news articles
- `POST /api/news` - Create news article
- `PUT /api/news/:id` - Update news article
- `DELETE /api/news/:id` - Delete news article
- `GET /api/news/published` - Get published news

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/upcoming` - Get upcoming events

### Staff Management
- `GET /api/staff` - Get all staff members
- `POST /api/staff` - Create staff member
- `PUT /api/staff/:id` - Update staff member
- `DELETE /api/staff/:id` - Delete staff member
- `GET /api/staff/active` - Get active staff

### Gallery
- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery` - Upload gallery image
- `PUT /api/gallery/:id` - Update gallery image
- `DELETE /api/gallery/:id` - Delete gallery image
- `GET /api/gallery/category/:category` - Get images by category

### Contact Management
- `GET /api/contact` - Get all contact messages
- `POST /api/contact` - Submit contact form
- `PUT /api/contact/:id` - Update message status
- `DELETE /api/contact/:id` - Delete message
- `POST /api/contact/:id/reply` - Reply to message

### Policy Documents
- `GET /api/policies` - Get all policies
- `GET /api/policies/published` - Get published policies
- `POST /api/policies` - Create policy
- `PUT /api/policies/:id` - Update policy
- `DELETE /api/policies/:id` - Delete policy
- `PATCH /api/policies/:id/publish` - Publish/unpublish policy
- `GET /api/policies/categories/list` - Get policy categories
- `GET /api/policies/stats/overview` - Get policy statistics

### Weather Integration
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast
- `GET /api/weather/history` - Get weather history
- `POST /api/weather/record` - Manually record weather
- `GET /api/weather/stats` - Get weather statistics
- `PUT /api/weather/config` - Update weather configuration

### School Information
- `GET /api/school-info` - Get all school information
- `GET /api/school-info/public` - Get public school information
- `POST /api/school-info` - Create/update school info
- `PUT /api/school-info/:key` - Update specific info
- `DELETE /api/school-info/:key` - Delete school info
- `POST /api/school-info/bulk-update` - Bulk update school info

### Academic Calendar
- `GET /api/school-info/calendar/academic` - Get academic calendar
- `POST /api/school-info/calendar/academic` - Create calendar event

### Fee Structure
- `GET /api/school-info/fees/structure` - Get fee structure
- `POST /api/school-info/fees/structure` - Create fee structure

### Forms Management
- `GET /api/school-info/forms` - Get all forms
- `POST /api/school-info/forms` - Create form

### File Upload
- `POST /api/upload/image` - Upload image
- `POST /api/upload/document` - Upload document
- `POST /api/upload/multiple` - Upload multiple files
- `DELETE /api/upload/:filename` - Delete uploaded file

### Admin & Analytics
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - User management
- `POST /api/admin/backup` - Create system backup
- `GET /api/admin/logs` - System logs

## 🔐 Authentication & Authorization

### User Roles
- **SUPER_ADMIN**: Full system access
- **ADMIN**: Administrative access
- **EDITOR**: Content creation and editing
- **VIEWER**: Read-only access

### JWT Token Structure
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 📁 File Upload System

### Supported File Types
- **Images**: JPEG, JPG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV

### File Size Limits
- **Images**: 5MB
- **Documents**: 20MB
- **PDFs**: 15MB
- **General**: 10MB

### Upload Directories
- `/uploads/policies/` - Policy documents
- `/uploads/forms/` - School forms
- `/uploads/gallery/` - Gallery images
- `/uploads/staff/` - Staff photos
- `/uploads/news/` - News images
- `/uploads/events/` - Event images
- `/uploads/newsletters/` - Newsletter files
- `/uploads/reports/` - Report documents

## 🗄 Database Schema

### Key Models
- **User** - Authentication and user management
- **NewsArticle** - News and announcements
- **Event** - School events and activities
- **StaffMember** - Staff directory
- **GalleryImage** - Image gallery
- **ContactMessage** - Contact form submissions
- **Policy** - Policy documents
- **SchoolInfo** - Dynamic school information
- **AcademicCalendar** - Academic calendar events
- **FeeStructure** - Fee configuration
- **Form** - School forms
- **Setting** - System configuration

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev          # Start development server with nodemon
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio

# Testing
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
```

### Environment Variables
```env
# Required
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=5000

# Optional
NODE_ENV=development
FRONTEND_URL=http://localhost:3002
WEATHER_API_KEY=your_api_key
MAX_FILE_SIZE=10485760
```

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Use a production database (PostgreSQL recommended)
3. Set secure JWT secret
4. Configure proper CORS origins
5. Set up SSL/TLS certificates
6. Configure reverse proxy (nginx recommended)

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Granular permission system
- **Input Validation** - Comprehensive request validation
- **File Upload Security** - File type and size validation
- **CORS Protection** - Cross-origin request protection
- **Helmet Security** - Security headers
- **Rate Limiting** - API rate limiting
- **SQL Injection Protection** - Prisma ORM protection

## 📊 Monitoring & Logging

- **Morgan** - HTTP request logging
- **Error Handling** - Comprehensive error management
- **Health Checks** - System health monitoring
- **Analytics** - Usage tracking and statistics
- **Maintenance Logs** - System maintenance tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: admin@holycross.co.za
- Phone: +27 21 123 4567
- Website: https://holycross.co.za

## 🔄 Version History

- **v2.0.0** - Comprehensive backend with dynamic content management
- **v1.0.0** - Initial release with basic functionality

---

**Holy Cross Convent School Brooklyn** - Empowering education through technology. 