# 🔧 Fix Staff API 500 Error

## 🚨 Current Issue

The `/api/staff` endpoint is returning a 500 error. This is likely due to:

1. **Database migrations not run** - The PostgreSQL database on Render might not have the `staff_members` table
2. **Database connection issue** - The `DATABASE_URL` might be incorrect
3. **Prisma client not generated** - The Prisma client might not be using the PostgreSQL schema

---

## ✅ Solution 1: Check Database Migrations (Most Likely Fix)

### **In Render Dashboard:**

1. Go to your **PostgreSQL Database** service
2. Check if migrations have been run
3. If not, run migrations manually:

**Option A: Via Render Shell (Recommended)**
1. In Render Dashboard → Your Backend Service
2. Click **"Shell"** tab
3. Run:
   ```bash
   cd backend
   npm run prisma:migrate:prod
   ```

**Option B: Via Local Connection**
1. Get your database connection string from Render
2. Set it locally:
   ```bash
   export DATABASE_URL="your-render-postgres-url"
   cd backend
   npm run prisma:migrate:prod
   ```

---

## ✅ Solution 2: Verify Database Connection

### **Check Environment Variables in Render:**

1. Go to Render Dashboard → Backend Service → Environment
2. Verify `DATABASE_URL` is set correctly
3. It should look like:
   ```
   postgresql://user:password@host:port/database?sslmode=require
   ```

### **Test Database Connection:**

In Render Shell:
```bash
cd backend
npx prisma db pull
```

If this fails, your `DATABASE_URL` is incorrect.

---

## ✅ Solution 3: Regenerate Prisma Client

### **In Render Dashboard → Backend Service:**

1. Go to **"Shell"** tab
2. Run:
   ```bash
   cd backend
   npm run prisma:generate:prod
   ```

This ensures the Prisma client is using the PostgreSQL schema.

---

## ✅ Solution 4: Check Render Logs

### **View Detailed Error:**

1. Go to Render Dashboard → Backend Service
2. Click **"Logs"** tab
3. Look for error messages related to:
   - `PrismaClientKnownRequestError`
   - `relation "staff_members" does not exist`
   - `Connection refused`

---

## 🚀 Quick Fix Checklist

- [ ] Verify `DATABASE_URL` is set in Render environment variables
- [ ] Run database migrations: `npm run prisma:migrate:prod`
- [ ] Regenerate Prisma client: `npm run prisma:generate:prod`
- [ ] Check Render logs for specific error messages
- [ ] Verify PostgreSQL database is running and accessible
- [ ] Test database connection manually

---

## 📝 Common Error Messages & Fixes

### **Error: `relation "staff_members" does not exist`**
**Fix:** Run migrations - `npm run prisma:migrate:prod`

### **Error: `Can't reach database server`**
**Fix:** Check `DATABASE_URL` and ensure PostgreSQL service is running

### **Error: `PrismaClientValidationError`**
**Fix:** Regenerate Prisma client - `npm run prisma:generate:prod`

---

## 🔍 Debug Steps

1. **Check if table exists:**
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_name = 'staff_members';
   ```

2. **Check Prisma client:**
   ```bash
   cd backend
   npx prisma studio
   ```
   (This will open a browser UI to view your database)

3. **Test connection:**
   ```bash
   cd backend
   npx prisma db execute --stdin
   ```
   Then type: `SELECT 1;`

---

**After applying these fixes, redeploy your backend service and test again!** 🎯

