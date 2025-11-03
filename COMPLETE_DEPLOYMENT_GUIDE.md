# 🚀 Complete Deployment Guide - Holy Cross Convent School

## 📋 Quick Overview

**Current Setup:**
- **Frontend**: Deployed on Vercel (should auto-deploy from GitHub)
- **Backend**: Needs deployment (Railway or Render recommended)
- **Issue**: Changes not showing on Vercel
- **Solution**: Ensure proper git commits and Vercel configuration

---

## ✅ PART 1: Fix Vercel Auto-Deployment

### Problem: Changes Not Updating on Vercel

**Root Cause:** Changes haven't been committed and pushed to GitHub, or Vercel isn't properly connected.

### Solution Steps:

#### Step 1: Commit and Push All Changes

```bash
# Make sure you're in the project root
cd "/Users/georgekasiyandima/Holy Cross Convent School Brooklyn"

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Update school website: Fix Info page images, Donate page currency, History page, and other enhancements"

# Push to GitHub (this triggers Vercel deployment)
git push origin main
```

#### Step 2: Verify Vercel Configuration

1. **Check Vercel Dashboard:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to **Settings** → **Git**
   - Ensure it's connected to the correct GitHub repository
   - Verify **Production Branch** is set to `main`

2. **Check Build Settings:**
   - Go to **Settings** → **General**
   - **Root Directory**: Should be `frontend` (or blank if repo root is frontend)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

3. **Environment Variables:**
   - Go to **Settings** → **Environment Variables**
   - Ensure these are set:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app/api
     GENERATE_SOURCEMAP=false
     NODE_ENV=production
     ```

#### Step 3: Trigger Manual Deployment (if needed)

If automatic deployment isn't working:

1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on the latest deployment
3. Or use Vercel CLI:
   ```bash
   cd frontend
   vercel --prod
   ```

#### Step 4: Verify Public Access

1. Go to **Settings** → **General**
2. Scroll to **Visibility**
3. Ensure it's set to **"Public"**
4. Copy your production URL (e.g., `https://holy-cross-school.vercel.app`)

---

## ✅ PART 2: Backend Deployment (Railway - Recommended)

### Why Railway?
- **Free tier available** (with usage limits)
- **Easy PostgreSQL setup**
- **Automatic HTTPS**
- **GitHub integration**

### Deployment Steps:

#### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway to access your repositories

#### Step 2: Deploy Backend Service

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `holy-cross-convent-school-brooklyn`
4. **Important Settings:**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npm run prisma:generate`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`

#### Step 3: Add PostgreSQL Database

1. In your project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically create a database
3. Note the connection string (looks like: `postgresql://...`)

#### Step 4: Configure Environment Variables

In Railway dashboard, go to your service → **Variables** tab and add:

```env
# Database (Railway will auto-populate this)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Server
NODE_ENV=production
PORT=5000

# JWT Secret (CHANGE THIS to a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS - Use your Vercel URL
FRONTEND_URL=https://your-vercel-app.vercel.app

# File Upload (optional)
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

#### Step 5: Run Database Migrations

1. In Railway, go to your backend service
2. Click on **"Deployments"** tab
3. Click on the latest deployment
4. Go to **"Logs"** tab
5. You should see migrations running automatically, OR
6. Use Railway CLI or add this to your build command:
   ```bash
   npm run prisma:deploy
   ```

#### Step 6: Get Your Backend URL

1. After deployment, Railway provides a URL like: `https://your-app-name.railway.app`
2. Copy this URL - you'll need it for the frontend
3. Test it: `https://your-app-name.railway.app/api/health`

#### Step 7: Update Frontend API URL

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update or add:
   ```
   REACT_APP_API_URL=https://your-app-name.railway.app
   ```
3. **Important**: Don't include `/api` in the URL - the frontend adds it automatically
4. Redeploy frontend to pick up the new environment variable

---

## ✅ PART 3: Alternative Backend Deployment (Render)

If Railway doesn't work, use Render:

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. **Settings:**
   - **Name**: `holy-cross-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build && npm run prisma:generate && npm run prisma:deploy`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter for better performance)

### Step 3: Add PostgreSQL Database

1. Click **"New +"** → **"PostgreSQL"**
2. Name it: `holy-cross-db`
3. Copy the **Internal Database URL**

### Step 4: Environment Variables

In your web service settings, add:

```env
DATABASE_URL=<from PostgreSQL service>
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

## ✅ PART 4: Real-Time Update Workflow

To ensure the school sees updates immediately:

### Daily Update Process:

1. **Make Changes Locally**
   ```bash
   # Make your code changes
   # Test locally (npm start in frontend, npm run dev in backend)
   ```

2. **Commit and Push**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

3. **Vercel Auto-Deploys** (usually takes 2-3 minutes)
   - Check Vercel dashboard for deployment status
   - Green checkmark = successful deployment

4. **Verify Deployment**
   - Visit your Vercel URL
   - Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
   - Check if changes are visible

5. **Share Progress**
   - Send the Vercel URL to the school
   - They can refresh to see latest changes

### Weekly Backend Updates:

Backend updates are less frequent, but when needed:

1. Make backend changes locally
2. Test thoroughly
3. Commit and push
4. Railway/Render will auto-deploy
5. Test the API endpoints
6. If database changes needed, run migrations

---

## ✅ PART 5: Verification Checklist

After deployment, verify:

### Frontend (Vercel):
- [ ] Website loads without errors
- [ ] All pages accessible
- [ ] Images load correctly
- [ ] Forms work
- [ ] Admin login works
- [ ] API calls succeed (check browser console)

### Backend (Railway/Render):
- [ ] Health check works: `https://your-backend-url/api/health`
- [ ] API endpoints respond
- [ ] Database connection works
- [ ] File uploads work
- [ ] Authentication works

### Integration:
- [ ] Frontend can connect to backend
- [ ] CORS is configured correctly
- [ ] Environment variables are set correctly

---

## 🐛 Troubleshooting

### Problem: Changes Not Showing on Vercel

**Solutions:**
1. Check git commit was pushed: `git log --oneline -5`
2. Check Vercel dashboard for deployment status
3. Hard refresh browser (Cmd+Shift+R)
4. Check browser cache - try incognito mode
5. Verify environment variables are set correctly

### Problem: Backend Not Deploying

**Solutions:**
1. Check build logs in Railway/Render
2. Verify `package.json` has correct build/start commands
3. Check environment variables are set
4. Verify database connection string is correct
5. Check if migrations need to run manually

### Problem: Frontend Can't Connect to Backend

**Solutions:**
1. Verify `REACT_APP_API_URL` in Vercel matches backend URL
2. Check CORS settings in backend
3. Verify backend is running (check health endpoint)
4. Check browser console for specific errors

---

## 📞 Quick Reference

### Frontend URL:
`https://your-vercel-app.vercel.app`

### Backend URL:
`https://your-backend.railway.app` (or `.onrender.com`)

### Health Check:
`https://your-backend-url/api/health`

### Admin Login:
`https://your-vercel-app.vercel.app/admin/login`

---

## 🎯 Next Steps After Deployment

1. ✅ Test all functionality
2. ✅ Set up custom domain (optional)
3. ✅ Configure email service (for contact forms)
4. ✅ Set up payment integration (PayFast)
5. ✅ Final review with school team
6. ✅ Go live! 🎉

---

## 💡 Tips for Ongoing Development

1. **Always test locally before pushing**
2. **Commit frequently with clear messages**
3. **Monitor Vercel/Railway for deployment errors**
4. **Keep environment variables updated**
5. **Document any manual steps needed**

---

**Last Updated**: 2024
**Maintained By**: Development Team

