# 🚨 Quick Fix for Failed Render Deployment

## ⚡️ Fast Fix (5 Minutes)

Since you already have Render set up, here's the quickest way to fix it:

---

## 🔧 Step 1: Update Render Settings (2 minutes)

### **Go to Render Dashboard:**
1. Visit [dashboard.render.com](https://dashboard.render.com)
2. Find your **holy-cross-backend** service
3. Click **Settings**

### **Update These Settings:**

#### **Root Directory:**
```
backend
```
⚠️ **Critical!** If this is wrong, nothing will work.

#### **Build Command:**
```bash
npm install && npm run prisma:generate:prod && npm run build && npm run prisma:deploy
```

#### **Start Command:**
```bash
npm start
```

---

## 🔧 Step 2: Check Environment Variables (2 minutes)

Go to **Environment** tab, ensure you have:

### **Required:**
```bash
DATABASE_URL=postgresql://... (from your PostgreSQL service)
JWT_SECRET=your-secret-key-min-32-chars
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app
BASE_URL=https://your-app-name.onrender.com
```

### **How to Get DATABASE_URL:**
1. In Render Dashboard, find your **PostgreSQL** database
2. Click on it → **Info** tab
3. Copy **Internal Database URL**
4. Paste as `DATABASE_URL` in web service

---

## 🔧 Step 3: Redeploy (1 minute)

1. Click **"Manual Deploy"**
2. Select **"Deploy latest commit"**
3. Watch logs
4. Should see: ✅ Build succeeded → ✅ Service started

---

## ✅ Test

Visit: `https://your-app-name.onrender.com/api/health`

Should return: `{"status":"OK",...}`

---

## 🔍 If Still Failing

Check the **logs** from the failed deployment and look for:
- ❌ "Cannot find module" → Missing dependency
- ❌ "Database connection" → Wrong DATABASE_URL
- ❌ "Prisma client" → Build command missing prisma:generate:prod
- ❌ "Root directory" → Root Directory not set to `backend`

---

**Most common fix:** Set Root Directory to `backend` and include `prisma:generate:prod` in Build Command.

