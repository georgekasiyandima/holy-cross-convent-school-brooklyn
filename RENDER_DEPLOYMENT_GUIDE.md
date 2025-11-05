# Render Backend Deployment Guide - Step by Step

## 🎯 Quick Summary

This guide will help you deploy your backend to Render with PostgreSQL database. Render offers a free tier that's perfect for getting started.

---

## ✅ Pre-Deployment Checklist

Before starting, ensure:
- [ ] Code is committed and pushed to GitHub
- [ ] You have a GitHub account
- [ ] You have access to your Vercel frontend URL
- [ ] You know your JWT secret (or can generate one)

---

## 🚀 Step 1: Create Render Account (5 minutes)

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended)
4. Verify your email address

---

## 🚀 Step 2: Create PostgreSQL Database (5 minutes)

**Important:** Create the database FIRST, before the web service.

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name:** `holy-cross-db` (or any name you prefer)
   - **Database:** `holycross_db` (or leave default)
   - **User:** Leave default or customize
   - **Region:** Choose closest to your users (e.g., `US East (Ohio)`)
   - **PostgreSQL Version:** Latest (14 or 15)
   - **Plan:** **Free** (for now)
3. Click **"Create Database"**
4. Wait for database to be provisioned (2-3 minutes)
5. **Copy the Internal Database URL** - you'll need it in Step 4

**Important Notes:**
- Free tier PostgreSQL spins down after 90 days of inactivity
- Free tier has limited storage (1GB) - enough for initial deployment
- Database URL format: `postgresql://user:password@host:5432/database`

---

## 🚀 Step 3: Create Web Service (10 minutes)

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Select **"Build and deploy from a Git repository"**
3. Connect your GitHub account (if not already connected)
4. Select repository: `holy-cross-convent-school-brooklyn`
5. Configure service:

### **Basic Settings:**
- **Name:** `holy-cross-backend` (or any name)
- **Region:** Same as database (for better performance)
- **Branch:** `main`
- **Root Directory:** `backend` ⚠️ **IMPORTANT!**
- **Runtime:** `Node`
- **Build Command:**
  ```bash
  npm install && npm run prisma:generate:prod && npm run build
  ```
- **Start Command:**
  ```bash
  npm start
  ```
- **Plan:** **Free** (for now)

### **Advanced Settings (click to expand):**
- **Auto-Deploy:** `Yes` (deploys automatically on git push)
- **Health Check Path:** `/api/health`

6. Click **"Create Web Service"**

---

## 🚀 Step 4: Configure Environment Variables (10 minutes)

In your web service → **Environment** tab, add these variables:

### **Required Variables:**

```bash
# Database (use the Internal Database URL from Step 2)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Secret (generate a strong random string - minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-change-this

# Server Configuration
NODE_ENV=production
PORT=10000

# Frontend URL (your Vercel frontend URL)
FRONTEND_URL=https://holy-cross-convent-school-brooklyn.vercel.app

# CORS Origin (same as frontend URL)
CORS_ORIGIN=https://holy-cross-convent-school-brooklyn.vercel.app

# Base URL (will be set after deployment - see Step 6)
BASE_URL=https://your-app-name.onrender.com
```

### **How to Generate JWT Secret:**

```bash
# In terminal, run:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

### **Important Notes:**
- Use **Internal Database URL** (not External) for better security and performance
- Replace `your-vercel-app.vercel.app` with your actual Vercel frontend URL
- The `BASE_URL` will be updated after you get your Render URL (Step 6)
- **PORT** should be `10000` for Render (Render assigns port automatically, but we set it for consistency)

---

## 🚀 Step 5: Configure Persistent Disk (5 minutes)

**Important:** This ensures uploaded files persist across deployments.

1. In your web service → **Settings** tab
2. Scroll to **"Persistent Disk"** section
3. Click **"Mount Persistent Disk"**
4. Configure:
   - **Mount Path:** `/opt/render/project/src/uploads`
   - **Size:** 1GB (or more if needed)
5. Click **"Mount Disk"**

**Note:** Free tier has limited disk space. For production, consider upgrading or using external storage (S3, Cloudinary).

---

## 🚀 Step 6: Get Your Backend URL (2 minutes)

1. After Render finishes deploying, go to your web service
2. You'll see a URL like: `https://holy-cross-backend.onrender.com`
3. **Copy this URL** - you'll need it!

### **Update BASE_URL:**

1. Go to **Environment** tab
2. Update `BASE_URL` to your actual Render URL:
   ```bash
   BASE_URL=https://your-actual-render-url.onrender.com
   ```
3. Render will automatically redeploy

---

## 🚀 Step 7: Run Database Migrations (5 minutes)

1. Go to your web service → **Shell** tab (or use **Logs** to monitor)
2. The build should automatically run migrations, but let's verify:
3. Check **Logs** tab - you should see:
   ```
   Running prisma migrate deploy...
   Applied migration: 2025_xxx_initial
   ```

### **If Migrations Fail:**

1. Go to **Shell** tab
2. Run:
   ```bash
   npm run prisma:deploy
   ```

---

## 🚀 Step 8: Seed Database (Optional - 5 minutes)

If you need to populate your database with initial data:

1. Go to **Shell** tab
2. Run:
   ```bash
   npm run seed:remote
   ```

---

## 🚀 Step 9: Update Frontend (5 minutes)

1. Go to your **Vercel Dashboard**
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add or update:
   ```bash
   REACT_APP_API_URL=https://your-render-backend.onrender.com
   ```
   (Replace with your actual Render URL from Step 6)
5. Go to **Deployments** tab
6. Click **"Redeploy"** on the latest deployment

---

## ✅ Step 10: Test Your Deployment (10 minutes)

### **Test Backend Endpoints:**

Open these URLs in your browser:

```bash
# Health Check
https://your-render-backend.onrender.com/api/health

# Staff API
https://your-render-backend.onrender.com/api/staff

# Board API
https://your-render-backend.onrender.com/about-us/board

# Gallery API
https://your-render-backend.onrender.com/api/gallery
```

### **Test Frontend:**

1. Visit your Vercel site
2. Open browser console (F12)
3. Check for any API errors
4. Verify data loads correctly
5. Test admin login
6. Test file uploads

---

## 🔧 Troubleshooting

### **Issue: Build Fails**

**Check:**
1. Render logs (Deployments → Latest → View Logs)
2. Ensure Root Directory is set to `backend`
3. Check all dependencies are in `package.json`
4. Verify TypeScript compiles without errors

**Common Fixes:**
- Clear build cache: Settings → Clear Build Cache
- Redeploy: Manual Deploy → Deploy latest commit

### **Issue: Database Connection Errors**

**Symptoms:** `Can't reach database server` or `Connection refused`

**Check:**
1. Verify DATABASE_URL is set correctly (use Internal URL)
2. Check database service is running (should show green)
3. Verify database and web service are in the same region

**Fix:**
- Ensure database service is deployed
- Use Internal Database URL (not External)
- Check network connectivity

### **Issue: Cold Start Issues**

**Symptoms:** First request takes 30-60 seconds

**Explanation:**
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes time to wake up

**Solution:**
- Use a service like [UptimeRobot](https://uptimerobot.com) to ping your site every 5 minutes (keeps it awake)
- Or upgrade to paid plan ($7/month) for always-on service

### **Issue: Prisma Client Not Generated**

**Symptoms:** `@prisma/client did not initialize`

**Fix:**
1. Check build logs for Prisma errors
2. Verify `prisma:generate:prod` runs in build command
3. Ensure `schema.postgresql.prisma` exists

### **Issue: Migrations Fail**

**Symptoms:** `Migration failed` or `Schema mismatch`

**Fix:**
1. Go to Shell tab
2. Run: `npm run prisma:deploy`
3. Check logs for specific errors

### **Issue: File Uploads Not Working**

**Symptoms:** Files uploaded but not accessible or files disappear

**Check:**
1. Verify persistent disk is mounted
2. Check file paths in code
3. Verify static file serving is configured

**Fix:**
- Ensure persistent disk is added (Step 5)
- Check uploads directory exists
- Verify file paths match mount path

### **Issue: CORS Errors**

**Symptoms:** `Access-Control-Allow-Origin` errors in browser

**Fix:**
1. Update `FRONTEND_URL` in Render environment variables
2. Update `CORS_ORIGIN` to match exactly
3. Verify frontend URL is correct (no trailing slash)
4. Redeploy backend

---

## 📊 Render Free Tier Limitations

### **What's Included (Free):**
- ✅ PostgreSQL database (1GB storage)
- ✅ Web service (spins down after 15 min inactivity)
- ✅ 750 hours/month compute time
- ✅ Persistent disk (limited)
- ✅ Automatic deployments

### **Limitations:**
- ⚠️ **Cold Starts:** Service spins down after 15 minutes → first request takes 30-60 seconds
- ⚠️ **Database Spins Down:** After 90 days of inactivity
- ⚠️ **Limited Storage:** 1GB database, limited disk space
- ⚠️ **No SSL Custom Domain:** On free tier (but HTTPS is included)

### **Workarounds:**
1. **Cold Starts:** Use UptimeRobot to ping every 5 minutes (free)
2. **Database:** Keep database active with regular queries
3. **Storage:** Use external storage (Cloudinary, S3) for large files

---

## 💰 Cost Breakdown

### **Free Tier (Current):**
- **Cost:** $0/month
- **Limitations:** Cold starts, spins down after inactivity
- **Best For:** Development, testing, low-traffic sites

### **Starter Plan ($7/month):**
- Always-on service (no cold starts)
- Better performance
- More reliable for production

### **Professional Plan ($25/month):**
- Better performance
- More resources
- Priority support

---

## ✅ Success Checklist

Your deployment is successful when:

- [ ] Backend accessible at Render URL
- [ ] `/api/health` returns 200 OK
- [ ] Database queries work
- [ ] File uploads work and persist
- [ ] Frontend connects to backend
- [ ] Admin login works
- [ ] All pages load with real data
- [ ] No CORS errors
- [ ] No console errors in browser

---

## 🎉 Next Steps

After successful deployment:

1. **Set up monitoring** (optional)
   - Use Render's built-in metrics
   - Set up UptimeRobot for uptime monitoring
   
2. **Set up backups**
   - Export database regularly
   - Use Render's backup feature (if available)

3. **Test thoroughly**
   - Test all features
   - Test admin functions
   - Test file uploads
   - Test on mobile devices

4. **Document for client**
   - Create admin guide
   - Document deployment process
   - Provide credentials securely

---

**You're ready to deploy! Follow each step carefully.** 🚀

