# ✅ Automatic Migrations Setup

## 🎯 Solution: Migrations Run Automatically on Deployment

I've updated your configuration so **migrations run automatically every time your app starts** on Render.

---

## ✅ What Changed

### **Updated `backend/package.json`:**
```json
"start": "npm run prisma:deploy && node dist/server.production.js"
```

Now when Render runs `npm start`, it will:
1. ✅ Run database migrations (`prisma:deploy`)
2. ✅ Start the server

---

## 🚀 How to Apply This Fix

### **Option 1: Manual Redeploy (Recommended - 2 minutes)**

1. **Go to Render Dashboard:**
   - Navigate to your backend service
   - Click **"Manual Deploy"** → **"Deploy latest commit"**

2. **Wait for deployment:**
   - Render will pull the latest code
   - Run `npm install`
   - Run `npm run build`
   - Run `npm start` (which now includes migrations!)

3. **Check logs:**
   - Go to **"Logs"** tab
   - Look for: `Applying migration...`
   - You should see migration output

---

### **Option 2: Push Empty Commit (Alternative)**

If manual deploy doesn't work, push an empty commit:

```bash
git commit --allow-empty -m "Trigger Render deployment with auto-migrations"
git push origin main
```

Render will automatically detect the push and redeploy.

---

## 🔍 Verify Migrations Ran

### **Check Render Logs:**
1. Go to Render Dashboard → Backend Service → **"Logs"** tab
2. Look for output like:
   ```
   Applying migration `20250814213848_initial_enhanced_schema`
   Applying migration `20250927081751_add_staff_category`
   ...
   ```

### **Test Health Endpoint:**
```javascript
fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/health')
  .then(res => res.json())
  .then(data => {
    console.log('✅ Tables:', data.database?.tables);
    if (data.database?.tables?.staff_members) {
      console.log('✅ Migrations successful!');
    }
  });
```

### **Test Staff Endpoint:**
```javascript
fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/staff')
  .then(res => res.json())
  .then(data => console.log('✅ Staff API working:', data));
```

---

## 📋 What Happens Now

**Every time your app deploys or restarts:**
1. ✅ Migrations run automatically
2. ✅ Database tables are created/updated
3. ✅ Server starts normally

**No shell access needed!** 🎉

---

## 🚨 If Migrations Still Don't Run

### **Check 1: Verify Start Command**
1. Render Dashboard → Backend Service → **Settings**
2. Check **"Start Command"** is: `npm start`
3. If it's different, change it to: `npm start`

### **Check 2: Check Build Logs**
1. Go to **"Events"** tab
2. Look for build errors
3. Check if `npm install` completed successfully

### **Check 3: Check Runtime Logs**
1. Go to **"Logs"** tab
2. Look for migration errors
3. Check if `DATABASE_URL` is set correctly

---

## 💡 Alternative: Run Migrations from Local Machine

If automatic migrations still don't work, you can run them from your local machine:

### **Step 1: Get Database URL from Render**
1. Render Dashboard → PostgreSQL Database
2. Copy the **Internal Database URL** or **External Connection String**

### **Step 2: Set Environment Variable Locally**
```bash
export DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

### **Step 3: Run Migrations**
```bash
cd backend
npm run prisma:migrate:prod
```

**Note:** This requires your local machine to have network access to Render's database.

---

## ✅ Success Indicators

After deployment, you should see:
- ✅ Health endpoint shows `staff_members: true`
- ✅ `/api/staff` returns data (or empty array)
- ✅ No more 500 errors
- ✅ Render logs show migration output

---

**Once you trigger a redeploy, migrations will run automatically!** 🚀

