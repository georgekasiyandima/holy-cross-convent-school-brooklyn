# 🔍 How to Check Render Logs for Errors

## Step-by-Step Guide

### 1. **Access Render Dashboard**
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Log in to your account

### 2. **Navigate to Your Backend Service**
1. Find your backend service (e.g., `holy-cross-backend`)
2. Click on it to open the service dashboard

### 3. **View Logs**
1. Click the **"Logs"** tab at the top
2. You'll see real-time logs from your application

### 4. **Look for Error Messages**
Scroll through the logs and look for:
- ❌ **Red error messages** - These indicate failures
- 🔍 **Prisma errors** - Look for:
  - `relation "staff_members" does not exist`
  - `PrismaClientKnownRequestError`
  - `P2002` (unique constraint violation)
  - `P2025` (record not found)
- 🔍 **Database connection errors**:
  - `Can't reach database server`
  - `Connection refused`
  - `Authentication failed`

### 5. **Filter Logs**
- Use the search box to filter for specific terms:
  - `error`
  - `staff`
  - `Prisma`
  - `500`
  - `migration`

### 6. **Check Recent Deployments**
1. Click the **"Events"** tab
2. Look for deployment events
3. Check if migrations ran successfully

---

## 🚨 Common Errors You Might See

### **Error: `relation "staff_members" does not exist`**
**Meaning:** Database migrations haven't been run  
**Fix:** Run migrations (see below)

### **Error: `PrismaClientKnownRequestError`**
**Meaning:** Database query failed  
**Fix:** Check the error code and message for details

### **Error: `Can't reach database server`**
**Meaning:** Database connection issue  
**Fix:** Check `DATABASE_URL` environment variable

---

## 📋 What to Copy and Share

When you find an error, copy:
1. **The full error message**
2. **The timestamp** (when it occurred)
3. **Any stack traces**
4. **The line numbers** (if shown)

Example:
```
2025-11-06 13:15:23 ERROR: relation "staff_members" does not exist
    at PrismaClient.queryRaw (prisma-client.js:1234:56)
    at router.get (staff.ts:85:23)
```

---

## 🔧 Quick Actions from Logs

### **If you see migration errors:**
1. Go to **"Shell"** tab in Render
2. Run: `cd backend && npm run prisma:migrate:prod`

### **If you see connection errors:**
1. Go to **"Environment"** tab
2. Check `DATABASE_URL` is set correctly
3. Verify your PostgreSQL service is running

---

**Once you find the error, share it with me and I can help fix it!** 🎯

