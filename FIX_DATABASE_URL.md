# 🔧 Fix DATABASE_URL Error

## 🚨 Current Issue

The error shows:
```
Error validating datasource `db`: the URL must start with the protocol `postgresql://` or `postgres://`.
```

This means `DATABASE_URL` is either:
1. ❌ Not set in Render environment variables
2. ❌ Set but has wrong format
3. ❌ Not being loaded properly

---

## ✅ Solution: Configure DATABASE_URL in Render

### **Step 1: Check if Database is Linked (2 minutes)**

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click your **Backend Service** (e.g., `holy-cross-backend`)
3. Go to **Settings** → **Environment**
4. Look for `DATABASE_URL` in the environment variables list

### **Step 2A: If DATABASE_URL is Missing**

If `DATABASE_URL` is not in the list:

1. **Link Your Database:**
   - In your Backend Service → **Settings** → **Environment**
   - Scroll to **"Add Environment Variable"**
   - Look for **"Link Database"** or **"Add from Database"** option
   - Select your PostgreSQL database (e.g., `holy-cross-db`)
   - Render will automatically add `DATABASE_URL`

2. **OR Manually Add:**
   - Click **"Add Environment Variable"**
   - Key: `DATABASE_URL`
   - Value: Get from your PostgreSQL service:
     - Go to your **PostgreSQL Database** service
     - Copy the **Internal Database URL** or **Connection String**
     - It should look like: `postgresql://user:password@host:port/database?sslmode=require`

### **Step 2B: If DATABASE_URL Exists but Wrong Format**

If `DATABASE_URL` exists but has wrong format:

1. **Check the Value:**
   - Click on `DATABASE_URL` to view/edit
   - It should start with `postgresql://` or `postgres://`
   - Example: `postgresql://holycross_user:password@dpg-xxxxx-a/holycross_db`

2. **Fix the Format:**
   - If it's missing the protocol, add `postgresql://` at the start
   - If it's using `postgres://`, that's fine (both work)
   - Ensure it includes: `postgresql://user:password@host:port/database`

3. **Get Correct URL from Database Service:**
   - Go to your **PostgreSQL Database** service in Render
   - Click **"Info"** tab
   - Copy the **Internal Database URL** (for services on same account)
   - OR copy **External Connection String** (if needed)

---

## ✅ Step 3: Verify Configuration

### **Check Environment Variables:**

In Render Dashboard → Backend Service → **Environment**, you should have:

```bash
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secret
FRONTEND_URL=https://your-frontend.vercel.app
```

### **Expected Format:**

```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

**Example:**
```
postgresql://holycross_user:abc123@dpg-xxxxx-a.oregon-postgres.render.com:5432/holycross_db?sslmode=require
```

---

## ✅ Step 4: Redeploy After Fixing

After updating `DATABASE_URL`:

1. **Render will auto-redeploy** (if auto-deploy is enabled)
2. **OR manually trigger:**
   - Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🔍 Verify It's Working

### **Check Render Logs:**

After redeploy, check logs for:
```
✅ Database URL configured: { protocol: 'postgresql', user: '...', host: '...', ... }
```

If you see:
```
❌ ERROR: DATABASE_URL environment variable is not set!
```

Then `DATABASE_URL` is still not configured correctly.

---

## 🚨 Common Issues

### **Issue 1: Database Not Created Yet**

If you don't have a PostgreSQL database:
1. Render Dashboard → **"New +"** → **"PostgreSQL"**
2. Create database
3. Link it to your backend service

### **Issue 2: Using Wrong Database URL**

- ✅ **Use Internal Database URL** (for services on same Render account)
- ❌ Don't use External URL unless necessary (has different host/port)

### **Issue 3: URL Has Special Characters**

If password has special characters, they need to be URL-encoded:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- etc.

---

## 📋 Quick Checklist

- [ ] PostgreSQL database exists in Render
- [ ] Database is linked to backend service
- [ ] `DATABASE_URL` appears in environment variables
- [ ] `DATABASE_URL` starts with `postgresql://` or `postgres://`
- [ ] Backend service redeployed after setting `DATABASE_URL`
- [ ] Logs show "✅ Database URL configured"

---

## 💡 Alternative: Check render.yaml

If you're using `render.yaml`, check that database is linked:

```yaml
envVars:
  - key: DATABASE_URL
    fromDatabase:
      name: holy-cross-db
      property: connectionString
```

This automatically links the database. If this is set, Render should handle it automatically.

---

**After fixing `DATABASE_URL` and redeploying, the migration error should be resolved!** 🎯

