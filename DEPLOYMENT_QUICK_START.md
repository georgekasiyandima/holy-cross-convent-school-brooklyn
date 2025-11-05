# 🚀 Quick Start: Deploy Backend to Railway

## ⚡️ 5-Minute Setup Guide

### **Step 1: Create Railway Account** (2 minutes)
1. Go to [railway.app](https://railway.app)
2. Sign up with **GitHub**
3. Authorize Railway access

### **Step 2: Deploy Backend** (2 minutes)
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: `holy-cross-convent-school-brooklyn`
4. **Set Root Directory to:** `backend`
5. Click **"Deploy"**

### **Step 3: Add PostgreSQL Database** (1 minute)
1. In your project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway automatically creates the database and sets `DATABASE_URL`

### **Step 4: Configure Environment Variables** (5 minutes)
In Railway → Your Service → **Variables**, add:

```bash
JWT_SECRET=your-super-secret-key-min-32-chars
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Step 5: Add Volume for File Uploads** (1 minute)
1. Settings → **Volumes** → **Add Volume**
2. Mount Path: `/app/uploads`
3. Size: 1GB

### **Step 6: Get Your Backend URL** (1 minute)
1. Settings → **Domains**
2. Copy the URL (e.g., `https://holy-cross-backend.railway.app`)
3. Update `BASE_URL` in Variables (if needed)

### **Step 7: Update Frontend** (2 minutes)
1. Go to **Vercel Dashboard**
2. Settings → Environment Variables
3. Add/Update: `REACT_APP_API_URL=https://your-railway-url.railway.app`
4. Redeploy frontend

### **Step 8: Test** (2 minutes)
Visit: `https://your-railway-url.railway.app/api/health`

Should return: `{"status":"OK",...}`

---

## ✅ Success Checklist

- [ ] Backend deployed on Railway
- [ ] PostgreSQL database created
- [ ] Environment variables set
- [ ] Volume added for uploads
- [ ] Frontend updated with backend URL
- [ ] Health check returns 200 OK
- [ ] Frontend connects to backend

---

## 🔧 If Something Goes Wrong

1. **Check Railway Logs:** Service → Deployments → Latest → View Logs
2. **Verify Environment Variables** are set correctly
3. **Check Database Connection:** Ensure PostgreSQL service is running
4. **Test Endpoints:** Use curl or Postman to test API

---

## 📚 Full Documentation

For detailed instructions, see:
- `RAILWAY_DEPLOYMENT_GUIDE.md` - Complete step-by-step guide
- `PRODUCTION_DEPLOYMENT_PLAN.md` - Architecture and strategy

---

**Total Time: ~15 minutes** ⏱️

