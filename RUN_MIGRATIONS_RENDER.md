# 🚀 Run Database Migrations on Render

## ✅ Quick Fix: Run Migrations Now

Your database tables don't exist yet. Here's how to create them:

---

## **Method 1: Via Render Shell (Recommended - 5 minutes)**

### Step 1: Open Render Shell
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your **Backend Service** (e.g., `holy-cross-backend`)
3. Click the **"Shell"** tab at the top

### Step 2: Run Migrations
In the shell, run:
```bash
cd backend
npm run prisma:migrate:prod
```

**Expected Output:**
```
Applying migration `20250814213848_initial_enhanced_schema`
Applying migration `20250927081751_add_staff_category`
...
```

### Step 3: Verify
After migrations complete, test the health endpoint:
```javascript
fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ Tables:', data.database.tables));
```

---

## **Method 2: Check Auto-Migration (If Configured)**

### Check if Migrations Run Automatically
1. Go to Render Dashboard → Backend Service
2. Click **"Events"** tab
3. Look for deployment events
4. Check if you see migration logs like:
   ```
   Running: npm run prisma:deploy
   Applying migration...
   ```

### If Auto-Migration is NOT Working:
Your `Dockerfile` should have this in the CMD:
```dockerfile
CMD ["sh", "-c", "npm run prisma:deploy && node dist/server.production.js"]
```

**Check your Render service settings:**
1. Go to **Settings** → **Build & Deploy**
2. Verify the **Start Command** is: `npm start`
3. Check if `package.json` has `"start": "node dist/server.production.js"`

**If migrations aren't auto-running, use Method 1 above.**

---

## **Method 3: Manual Migration via Local Machine**

### Step 1: Get Database URL
1. Render Dashboard → PostgreSQL Database Service
2. Copy the **Internal Database URL** or **External Connection String**

### Step 2: Set Environment Variable
```bash
export DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

### Step 3: Run Migrations Locally
```bash
cd backend
npm run prisma:migrate:prod
```

**Note:** This requires your local machine to have network access to Render's database.

---

## 🔍 Verify Migrations Succeeded

### Test Health Endpoint:
```javascript
fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/health')
  .then(res => res.json())
  .then(data => {
    console.log('Database Status:', data.database);
    if (data.database.tables.staff_members) {
      console.log('✅ Migrations successful!');
    } else {
      console.log('❌ Migrations still needed');
    }
  });
```

### Expected Result After Migrations:
```json
{
  "status": "OK",
  "database": {
    "connected": true,
    "tables": {
      "staff_members": true,
      "users": true,
      "gallery_items": true,
      "allTables": ["staff_members", "users", "gallery_items", ...]
    }
  }
}
```

---

## 🚨 Troubleshooting

### **Error: "Migration already applied"**
- This is fine! It means migrations have already run.

### **Error: "Can't reach database server"**
- Check `DATABASE_URL` environment variable in Render
- Verify PostgreSQL service is running
- Check network connectivity

### **Error: "Permission denied"**
- Ensure your database user has CREATE TABLE permissions
- Check database user role in Render

### **Migrations run but tables still missing**
- Check if you're using the correct schema file (`schema.postgresql.prisma`)
- Verify Prisma client was generated: `npm run prisma:generate:prod`
- Check Render logs for migration errors

---

## 📋 After Migrations Complete

1. ✅ Test `/api/health` - should show tables exist
2. ✅ Test `/api/staff` - should return staff data (or empty array)
3. ✅ Test other endpoints that were failing

---

**Once migrations are complete, your 500 errors should be resolved!** 🎯

