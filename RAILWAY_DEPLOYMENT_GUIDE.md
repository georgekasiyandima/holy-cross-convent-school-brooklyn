# Railway Backend Deployment Guide - Step by Step

## 🎯 Quick Summary

This guide will help you deploy your backend to Railway with PostgreSQL database. The process takes about 30-45 minutes.

---

## ✅ Pre-Deployment Checklist

Before starting, ensure:
- [ ] Code is committed and pushed to GitHub
- [ ] You have a GitHub account
- [ ] You have access to your Vercel frontend URL
- [ ] You know your JWT secret (or can generate one)

---

## 🚀 Step 1: Create Railway Account (5 minutes)

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (recommended)
4. Authorize Railway to access your GitHub repositories

---

## 🚀 Step 2: Create New Project (5 minutes)

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select your repository: `holy-cross-convent-school-brooklyn`
4. Click **"Deploy Now"**

Railway will start deploying, but we need to configure it first.

---

## 🚀 Step 3: Configure Root Directory (2 minutes)

1. Click on your newly created service
2. Go to **Settings** tab
3. Scroll to **Root Directory**
4. Set it to: `backend`
5. Click **"Save"**

This tells Railway to deploy from the `backend` folder.

---

## 🚀 Step 4: Add PostgreSQL Database (5 minutes)

1. In your Railway project dashboard, click **"New"** button (top right)
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a PostgreSQL database
4. **Important:** Railway automatically provides the `DATABASE_URL` environment variable - you don't need to set it manually!

The database will appear as a separate service in your project.

---

## 🚀 Step 5: Configure Environment Variables (10 minutes)

1. Go back to your **backend service** (not the database)
2. Click on **Variables** tab
3. Add these environment variables:

### Required Variables:

```bash
# JWT Secret (generate a strong random string - minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-change-this

# Server Configuration
NODE_ENV=production
PORT=5000

# Frontend URL (your Vercel frontend URL)
FRONTEND_URL=https://holy-cross-convent-school-brooklyn.vercel.app

# CORS Origin (same as frontend URL)
CORS_ORIGIN=https://holy-cross-convent-school-brooklyn.vercel.app

# Base URL (will be set after deployment - see Step 8)
BASE_URL=https://your-app-name.railway.app
```

### How to Generate JWT Secret:

```bash
# In terminal, run:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

### Important Notes:

- **DATABASE_URL** is automatically provided by Railway - DO NOT set it manually
- Replace `your-vercel-app.vercel.app` with your actual Vercel frontend URL
- The `BASE_URL` will be updated after you get your Railway URL (Step 8)

---

## 🚀 Step 6: Configure Build Settings (5 minutes)

1. In your backend service, go to **Settings** tab
2. Scroll to **Build Command**
3. Set it to:
   ```bash
   npm install && npm run prisma:generate:prod && npm run build
   ```
4. Scroll to **Start Command**
5. Set it to:
   ```bash
   npm start
   ```
6. Ensure **Root Directory** is set to: `backend`
7. Click **"Save"**

---

## 🚀 Step 7: Add Persistent Volume for File Uploads (5 minutes)

**Important:** This ensures uploaded files (images, documents) persist across deployments.

1. In your backend service, go to **Settings** tab
2. Scroll to **Volumes** section
3. Click **"Add Volume"**
4. Set:
   - **Mount Path:** `/app/uploads`
   - **Volume Size:** 1GB (or more if needed)
5. Click **"Add"**

---

## 🚀 Step 8: Get Your Backend URL (2 minutes)

1. After Railway finishes deploying, go to your service
2. Click on **Settings** tab
3. Scroll to **Domains** section
4. You'll see a URL like: `https://holy-cross-backend-production.railway.app`
5. **Copy this URL** - you'll need it!

### Update BASE_URL:

1. Go back to **Variables** tab
2. Update `BASE_URL` to your actual Railway URL:
   ```bash
   BASE_URL=https://your-actual-railway-url.railway.app
   ```
3. Railway will automatically redeploy

---

## 🚀 Step 9: Run Database Migrations (5 minutes)

Railway should automatically run migrations during build, but let's verify:

1. Go to your service → **Deployments** tab
2. Click on the latest deployment
3. Check the **Logs** - you should see:
   ```
   Running prisma migrate deploy...
   Applied migration: 2025_xxx_initial
   ```

### If Migrations Fail:

1. In Railway dashboard, click on your backend service
2. Click **"Connect"** → **"Open Shell"**
3. Run:
   ```bash
   npm run prisma:deploy
   ```

---

## 🚀 Step 10: Seed Database (Optional - 5 minutes)

If you need to populate your database with initial data:

1. In Railway dashboard, click on your backend service
2. Click **"Connect"** → **"Open Shell"**
3. Run:
   ```bash
   npm run seed:remote
   ```

---

## 🚀 Step 11: Update Frontend (5 minutes)

1. Go to your **Vercel Dashboard**
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add or update:
   ```bash
   REACT_APP_API_URL=https://your-railway-backend.railway.app
   ```
   (Replace with your actual Railway URL from Step 8)
5. Go to **Deployments** tab
6. Click **"Redeploy"** on the latest deployment

---

## ✅ Step 12: Test Your Deployment (10 minutes)

### Test Backend Endpoints:

Open these URLs in your browser or use curl:

```bash
# Health Check
https://your-railway-backend.railway.app/api/health

# Staff API
https://your-railway-backend.railway.app/api/staff

# Board API
https://your-railway-backend.railway.app/api/board

# Gallery API
https://your-railway-backend.railway.app/api/gallery
```

### Test Frontend:

1. Visit your Vercel site
2. Open browser console (F12)
3. Check for any API errors
4. Verify data loads correctly
5. Test admin login
6. Test file uploads

---

## 🔧 Troubleshooting

### Issue: Build Fails

**Check:**
1. Railway logs (Deployments → Latest → View Logs)
2. Ensure all dependencies are in `package.json`
3. Check Node version (should be 18+)
4. Verify TypeScript compiles without errors

**Common Fixes:**
- Clear build cache: Settings → Clear Build Cache
- Redeploy: Deployments → Redeploy

### Issue: Database Connection Errors

**Symptoms:** `Can't reach database server` or `Connection refused`

**Check:**
1. Verify PostgreSQL service is running (should show green)
2. Check DATABASE_URL is set (Railway auto-provides it)
3. Verify database and backend are in the same project

**Fix:**
- Ensure PostgreSQL service is deployed
- Check network connectivity between services

### Issue: Prisma Client Not Generated

**Symptoms:** `@prisma/client did not initialize`

**Fix:**
1. Check build logs for Prisma errors
2. Verify `prisma:generate:prod` runs in build command
3. Ensure `schema.postgresql.prisma` exists

### Issue: Migrations Fail

**Symptoms:** `Migration failed` or `Schema mismatch`

**Fix:**
1. Connect to Railway shell
2. Run: `npm run prisma:deploy`
3. Check logs for specific errors

### Issue: File Uploads Not Working

**Symptoms:** Files uploaded but not accessible or files disappear

**Check:**
1. Verify volume is mounted at `/app/uploads`
2. Check file permissions
3. Verify static file serving is configured

**Fix:**
- Ensure volume is added (Step 7)
- Check uploads directory exists
- Verify file paths in code

### Issue: CORS Errors

**Symptoms:** `Access-Control-Allow-Origin` errors in browser

**Fix:**
1. Update `FRONTEND_URL` in Railway environment variables
2. Update `CORS_ORIGIN` to match exactly
3. Verify frontend URL is correct (no trailing slash)
4. Redeploy backend

### Issue: 404 on API Endpoints

**Symptoms:** All endpoints return 404

**Check:**
1. Verify `BASE_URL` includes `/api` prefix if needed
2. Check server.production.ts routes
3. Verify build completed successfully

---

## 📊 Monitoring

### Check Logs:
1. Railway Dashboard → Your Service → **Deployments** → Latest → **View Logs**
2. Or use Railway CLI: `railway logs`

### Check Metrics:
1. Railway Dashboard → Your Service → **Metrics**
2. Monitor:
   - CPU usage
   - Memory usage
   - Request count
   - Error rate

---

## 💰 Cost Estimate

### Railway Free Tier:
- **$5 credit/month** (free)
- **PostgreSQL:** Included
- **File Storage:** Included (volumes)
- **Bandwidth:** Generous limits

### Expected Usage:
- School website: ~$3-5/month
- Well within free tier for most use cases

### Upgrade If Needed:
- If you exceed free tier, upgrade to **Hobby** plan ($5/month)
- Still very affordable for a school website

---

## ✅ Success Checklist

Your deployment is successful when:

- [ ] Backend accessible at Railway URL
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

1. **Set up admin user** (if not already done)
2. **Import/seed initial data**
3. **Test all features** (upload, gallery, applications, etc.)
4. **Set up monitoring** (optional)
5. **Document deployment process** for future reference

---

## 📞 Need Help?

If you encounter issues:
1. Check Railway logs first
2. Review troubleshooting section above
3. Check browser console for frontend errors
4. Test endpoints with curl/Postman
5. Verify all environment variables are set correctly

---

**You're ready to deploy! Start with Step 1 and work through each step.** 🚀

