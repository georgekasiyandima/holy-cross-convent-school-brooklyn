# Render Production Deployment Guide

## 🚀 Deploying the Full Backend with Real Database

### Current Status
- ✅ Production server created (`server.production.ts`)
- ✅ Real database connections implemented
- ✅ All API endpoints connected to Prisma
- ✅ CORS configured for frontend
- ✅ Code pushed to GitHub

### Render Configuration Updates Needed

#### 1. Build Command
Update your Render service Build Command to:
```bash
npm install && npm run build:production
```

**Alternative (if the above fails):**
```bash
npm install
npm run prisma:generate
npm run build
```

#### 2. Start Command
Update your Render service Start Command to:
```bash
npm start
```

#### 3. Environment Variables
Add these environment variables in your Render dashboard:

**Required:**
```
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=your-super-secret-jwt-key-for-production
NODE_ENV=production
PORT=5000
```

**Optional (for full functionality):**
```
FRONTEND_URL=https://holy-cross-convent-school-brooklyn-xi.vercel.app
BASE_URL=https://holy-cross-convent-school-brooklyn.onrender.com
```

### What This Will Do

#### ✅ Real Data Connection
- **Staff API** - Returns actual staff from your database
- **Board API** - Returns actual board members from your database  
- **News API** - Returns actual news articles from your database
- **Events API** - Returns actual events from your database
- **Calendar API** - Returns actual calendar events from your database

#### ✅ Proper Data Formatting
- Staff data grouped by category (leadership, teaching, admin, support)
- All endpoints return data in the format expected by frontend
- Proper error handling and logging

#### ✅ Database Integration
- Uses your existing SQLite database
- Connects to all your existing data
- Maintains data integrity and relationships

### After Deployment

1. **Test the endpoints:**
   - `https://holy-cross-convent-school-brooklyn.onrender.com/api/staff`
   - `https://holy-cross-convent-school-brooklyn.onrender.com/api/board`
   - `https://holy-cross-convent-school-brooklyn.onrender.com/api/news`

2. **Verify real data:**
   - Check that staff members match your database
   - Check that board members match your database
   - Check that news articles are from your database

### Troubleshooting

If deployment fails:
1. Check the build logs in Render dashboard
2. Ensure all environment variables are set
3. Verify the database file exists and is accessible

### Next Steps After Successful Deployment

1. Test all pages on your website
2. Verify real data is displaying
3. Update any missing data in your database
4. Set up proper JWT secret for authentication features
