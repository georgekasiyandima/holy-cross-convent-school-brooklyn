# Production Backend Deployment Plan - Holy Cross Convent School

## 🎯 Deployment Strategy

Based on your project setup, here's the **ideal hosting plan**:

### **Recommended Platform: Railway** 🚂
**Why Railway?**
- ✅ Built-in PostgreSQL database (free tier available)
- ✅ Automatic deployments from GitHub
- ✅ Simple configuration
- ✅ Good documentation
- ✅ Handles file uploads well
- ✅ Free tier is generous for school projects

### **Alternative: Render** ☁️
**Why Render?**
- ✅ Free PostgreSQL database
- ✅ Free web service tier
- ✅ Good for static file serving
- ⚠️ Slower cold starts (free tier)

---

## 🔴 Critical Issues to Fix First

### **Issue #1: Database Provider**
**Current:** SQLite (file-based database)
**Problem:** SQLite doesn't work well in cloud deployments because:
- File system is ephemeral (files can be lost)
- Multiple instances can't share the same file
- No concurrent write support

**Solution:** Switch to PostgreSQL for production

### **Issue #2: File Upload Storage**
**Current:** Files stored in `uploads/` directory
**Problem:** Files will be lost on server restart/redeploy

**Solution:** Use persistent storage (Railway volumes or external storage)

### **Issue #3: Environment Variables**
**Current:** Mix of SQLite and production configs
**Solution:** Clean separation between dev and production

---

## 📋 Step-by-Step Deployment Plan

### **Phase 1: Prepare for PostgreSQL Migration** (30 minutes)

#### Step 1.1: Create PostgreSQL Schema
Create a new Prisma schema file for PostgreSQL:

```bash
# We'll create schema.postgresql.prisma
```

#### Step 1.2: Update Package.json Scripts
Ensure build scripts handle both environments:

```json
"build:production": "npm run prisma:generate && npm run build",
"prisma:deploy": "prisma migrate deploy",
"prisma:generate": "prisma generate"
```

#### Step 1.3: Test PostgreSQL Locally (Optional)
```bash
# Install PostgreSQL locally or use Docker
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres

# Set DATABASE_URL
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/holycross_db"

# Run migrations
npx prisma migrate deploy
```

---

### **Phase 2: Deploy to Railway** (45 minutes)

#### Step 2.1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway to access your repositories

#### Step 2.2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose repository: `holy-cross-convent-school-brooklyn`
4. **IMPORTANT:** Set **Root Directory** to `backend`

#### Step 2.3: Add PostgreSQL Database
1. In Railway dashboard, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically create a PostgreSQL database
3. Copy the **DATABASE_URL** (you'll need it)

#### Step 2.4: Configure Environment Variables
In Railway → Your Service → Variables, add:

```bash
# Database (automatically provided by Railway PostgreSQL)
DATABASE_URL="postgresql://postgres:password@hostname:5432/railway"
# ⚠️ Railway provides this automatically - don't set manually!

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-min-32-chars-long"

# Server Configuration
NODE_ENV="production"
PORT="5000"

# Frontend URL (your Vercel URL)
FRONTEND_URL="https://holy-cross-convent-school-brooklyn.vercel.app"

# CORS (allow your frontend)
CORS_ORIGIN="https://holy-cross-convent-school-brooklyn.vercel.app"

# Base URL (your Railway backend URL - will be set after deployment)
BASE_URL="https://your-app-name.railway.app"
```

#### Step 2.5: Configure Build Settings
In Railway → Your Service → Settings:

**Build Command:**
```bash
npm install && npm run prisma:generate && npm run build
```

**Start Command:**
```bash
npm start
```

**Root Directory:**
```
backend
```

#### Step 2.6: Add Persistent Volume for Uploads
1. In Railway → Your Service → Settings → Volumes
2. Click **"Add Volume"**
3. Mount path: `/app/uploads`
4. This ensures uploaded files persist across deployments

#### Step 2.7: Deploy
Railway will automatically:
1. Install dependencies
2. Generate Prisma client
3. Build the application
4. Run migrations
5. Start the server

#### Step 2.8: Get Your Backend URL
After deployment, Railway provides a URL like:
```
https://holy-cross-backend-production.railway.app
```

Copy this URL!

---

### **Phase 3: Database Migration** (30 minutes)

#### Step 3.1: Run Migrations
Railway will automatically run `prisma migrate deploy` during build.

**If migrations fail:**
1. Connect to Railway database
2. Run migrations manually:
   ```bash
   npx prisma migrate deploy
   ```

#### Step 3.2: Seed Production Database
After migration, seed your database:

```bash
# In Railway dashboard → Service → Deployments → Latest → View Logs
# Or use Railway CLI
railway run npm run seed:remote
```

---

### **Phase 4: Update Frontend** (15 minutes)

#### Step 4.1: Update Vercel Environment Variables
In Vercel Dashboard → Your Project → Settings → Environment Variables:

```bash
REACT_APP_API_URL=https://your-railway-backend.railway.app
```

#### Step 4.2: Redeploy Frontend
1. Go to Vercel Dashboard
2. Click **"Redeploy"** on latest deployment
3. Or push a new commit to trigger auto-deploy

---

### **Phase 5: Testing** (30 minutes)

#### Test Backend Endpoints:
```bash
# Health Check
curl https://your-railway-backend.railway.app/api/health

# Staff API
curl https://your-railway-backend.railway.app/api/staff

# Board API
curl https://your-railway-backend.railway.app/api/board

# Gallery API
curl https://your-railway-backend.railway.app/api/gallery
```

#### Test Frontend:
1. Visit your Vercel site
2. Check browser console for API calls
3. Verify data loads correctly
4. Test admin login
5. Test file uploads

---

## 🔧 Troubleshooting Common Issues

### **Issue: Database Connection Errors**
**Symptoms:** `Can't reach database server`
**Solution:**
1. Check DATABASE_URL in Railway (should be auto-provided)
2. Verify PostgreSQL service is running
3. Check network connectivity

### **Issue: Prisma Client Not Generated**
**Symptoms:** `@prisma/client did not initialize`
**Solution:**
1. Ensure `prisma:generate` runs in build command
2. Check build logs for Prisma errors
3. Verify schema.prisma is correct

### **Issue: Migrations Fail**
**Symptoms:** `Migration failed`
**Solution:**
1. Check database connection
2. Verify schema matches database
3. Run `npx prisma migrate reset` (⚠️ deletes data)
4. Or run migrations manually: `npx prisma migrate deploy`

### **Issue: File Uploads Not Working**
**Symptoms:** Files uploaded but not accessible
**Solution:**
1. Ensure volume is mounted at `/app/uploads`
2. Check file permissions
3. Verify static file serving is configured

### **Issue: CORS Errors**
**Symptoms:** `Access-Control-Allow-Origin` errors
**Solution:**
1. Update `FRONTEND_URL` in Railway environment variables
2. Check CORS configuration in server.production.ts
3. Verify frontend URL matches exactly

### **Issue: Build Fails**
**Symptoms:** Build process exits with error
**Solution:**
1. Check build logs in Railway
2. Verify all dependencies are in package.json
3. Check Node version (should be 18+)
4. Ensure TypeScript compiles without errors

---

## 📊 Cost Estimate

### **Railway (Recommended)**
- **Free Tier:** $5 credit/month
- **Estimated Usage:** ~$3-5/month for school website
- **PostgreSQL:** Included in free tier
- **File Storage:** Included (volumes)

### **Render (Alternative)**
- **Free Tier:** Limited (spins down after inactivity)
- **PostgreSQL:** Free tier available
- **File Storage:** Included

**Recommendation:** Start with Railway free tier, upgrade if needed ($5-10/month)

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All code is committed and pushed to GitHub
- [ ] Environment variables are documented
- [ ] Database schema is ready for PostgreSQL
- [ ] Build scripts are tested locally
- [ ] Migration scripts are ready
- [ ] Seed data is prepared
- [ ] File upload paths are configured
- [ ] CORS is configured for frontend URL
- [ ] JWT secret is generated (strong, random)
- [ ] Frontend URL is known

---

## 🚀 Quick Start Commands

### **Local Testing (Before Deploy)**
```bash
# Test PostgreSQL connection
export DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
npm run prisma:generate
npm run build
npm start
```

### **Deploy to Railway**
1. Push code to GitHub
2. Railway auto-deploys
3. Check deployment logs
4. Test endpoints

### **Post-Deployment**
```bash
# Seed database (if needed)
railway run npm run seed:remote

# Check logs
railway logs

# View database
railway connect postgres
```

---

## 📝 Next Steps After Deployment

1. **Monitor Performance**
   - Set up Railway metrics
   - Monitor database usage
   - Check error logs

2. **Set Up Backups**
   - Configure automatic PostgreSQL backups
   - Export data regularly

3. **Security**
   - Rotate JWT secret regularly
   - Enable HTTPS only
   - Set up rate limiting

4. **Documentation**
   - Document API endpoints
   - Create admin user guide
   - Document deployment process

---

## 🎯 Success Criteria

Deployment is successful when:
- ✅ Backend API accessible at Railway URL
- ✅ Health check returns 200 OK
- ✅ Database queries work
- ✅ File uploads work and persist
- ✅ Frontend connects to backend
- ✅ Admin login works
- ✅ All pages load with real data
- ✅ No CORS errors
- ✅ No console errors

---

## 📞 Support

If you encounter issues:
1. Check Railway logs
2. Check browser console
3. Verify environment variables
4. Test endpoints with curl/Postman
5. Review this guide's troubleshooting section

---

**Ready to deploy? Let's start with Phase 1!** 🚀

