# Holy Cross Convent School Brooklyn - Backend API

A robust, scalable backend API built with Node.js, Express, TypeScript, and SQLite for the Holy Cross Convent School Brooklyn website.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Content Management**: News articles, events, newsletters, and reports
- **Contact Management**: Contact form submissions with admin dashboard
- **Gallery Management**: Image upload and organization
- **Staff Management**: Staff profiles and information
- **File Upload**: Secure file upload system
- **Database**: SQLite with Prisma ORM for easy deployment
- **Email Integration**: Newsletter distribution and notifications
- **PDF Generation**: Automated report generation

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Email**: Nodemailer
- **PDF**: Puppeteer
- **Security**: Helmet, CORS, Morgan

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (for newsletters)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3002
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with initial data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication

#### POST `/api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "admin@holycrossbrooklyn.edu",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "admin@holycrossbrooklyn.edu",
      "name": "School Administrator",
      "role": "SUPER_ADMIN"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/setup`
Create initial admin user (first-time setup only).

### Contact Form

#### POST `/api/contact/submit`
Submit contact form (public).

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "General Inquiry",
  "message": "Hello, I have a question...",
  "inquiryType": "general"
}
```

### News Articles

#### GET `/api/news`
Get all published news articles (public).

#### POST `/api/news`
Create news article (admin/editor only).

### Events

#### GET `/api/events`
Get all published events (public).

#### POST `/api/events`
Create event (admin/editor only).

### Newsletters

#### GET `/api/newsletters`
Get all published newsletters (public).

#### POST `/api/newsletters`
Create newsletter (admin/editor only).

### Reports

#### GET `/api/reports`
Get all published reports (public).

#### POST `/api/reports`
Create report (admin/editor only).

### Gallery

#### GET `/api/gallery`
Get all published gallery images (public).

#### POST `/api/gallery`
Upload gallery image (admin/editor only).

### Staff

#### GET `/api/staff`
Get all active staff members (public).

#### POST `/api/staff`
Create staff member (admin/editor only).

### Admin Dashboard

#### GET `/api/admin/stats`
Get dashboard statistics (admin only).

#### GET `/api/admin/users`
Get all users (admin only).

## 🔐 Authentication & Authorization

### User Roles

- **SUPER_ADMIN**: Full system access
- **ADMIN**: Content management and user management
- **EDITOR**: Content creation and editing
- **VIEWER**: Read-only access

### Protected Routes

Most admin routes require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts         # Authentication middleware
│   │   └── errorHandler.ts # Error handling middleware
│   ├── routes/             # API routes
│   │   ├── auth.ts         # Authentication routes
│   │   ├── contact.ts      # Contact form routes
│   │   ├── news.ts         # News articles routes
│   │   ├── events.ts       # Events routes
│   │   ├── newsletters.ts  # Newsletter routes
│   │   ├── reports.ts      # Reports routes
│   │   ├── gallery.ts      # Gallery routes
│   │   ├── staff.ts        # Staff routes
│   │   ├── upload.ts       # File upload routes
│   │   └── admin.ts        # Admin dashboard routes
│   ├── scripts/            # Database scripts
│   │   └── seed.ts         # Database seeding
│   └── server.ts           # Main server file
├── prisma/
│   └── schema.prisma       # Database schema
├── uploads/                # File upload directory
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Database Schema

The database includes the following main entities:

- **Users**: Authentication and user management
- **NewsArticles**: School news and announcements
- **Events**: School events and activities
- **Newsletters**: Email newsletters
- **Reports**: School reports and documents
- **ContactMessages**: Contact form submissions
- **GalleryImages**: Photo gallery
- **StaffMembers**: Staff information
- **Tags**: Content categorization
- **Settings**: System configuration
- **EmailSubscribers**: Newsletter subscribers
- **FileUploads**: File management

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

Update the `.env` file with production values:

```env
NODE_ENV=production
JWT_SECRET=your-very-secure-production-jwt-secret
DATABASE_URL="file:./production.db"
FRONTEND_URL=https://your-domain.com
```

### Database Backup

```bash
# Backup SQLite database
cp dev.db backup-$(date +%Y%m%d-%H%M%S).db
```

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build TypeScript to JavaScript
- `npm start`: Start production server
- `npm run db:generate`: Generate Prisma client
- `npm run db:push`: Push schema changes to database
- `npm run db:migrate`: Run database migrations
- `npm run db:studio`: Open Prisma Studio
- `npm run db:seed`: Seed database with initial data

### Adding New Features

1. Update the Prisma schema in `prisma/schema.prisma`
2. Run `npm run db:push` to update the database
3. Create new route files in `src/routes/`
4. Add middleware as needed in `src/middleware/`
5. Update the main server file to include new routes

## 📞 Support

For technical support or questions about the backend API, please contact the development team.

## 📄 License

This project is proprietary to Holy Cross Convent School Brooklyn. 