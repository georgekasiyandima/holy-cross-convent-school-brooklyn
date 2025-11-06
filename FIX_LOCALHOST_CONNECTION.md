# 🔧 Fix Localhost Connection Error

## 🚨 Current Issue

Frontend is trying to connect to `localhost:5000` instead of your Render backend.

**Error:** `POST http://localhost:5000/api/auth/login net::ERR_CONNECTION_REFUSED`

---

## ✅ Solution: Set Environment Variables in Vercel

The frontend needs to know where your backend is. You need to set environment variables in Vercel.

### **Step 1: Go to Vercel Dashboard**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **holy-cross-convent-school-brooklyn** project
3. Click **Settings** → **Environment Variables**

### **Step 2: Add/Update Environment Variables**

Add these two variables:

```bash
REACT_APP_API_BASE_URL=https://holy-cross-convent-school-brooklyn.onrender.com
REACT_APP_API_URL=https://holy-cross-convent-school-brooklyn.onrender.com
```

**Important:**
- ✅ **No trailing slash** - Don't include `/` at the end
- ✅ **Use HTTPS** - Always use `https://`
- ✅ **Set for Production** (and Preview if you want)

### **Step 3: Redeploy Frontend**

After setting environment variables:

1. **Option A: Manual Redeploy**
   - Vercel Dashboard → Deployments → Latest → `...` → **Redeploy**

2. **Option B: Push Empty Commit**
   ```bash
   git commit --allow-empty -m "Trigger Vercel redeploy with API URL"
   git push
   ```

---

## 🔍 Verify Environment Variables

After redeploy, check if variables are loaded:

1. Open your Vercel site
2. Open browser console (F12)
3. Run:
   ```javascript
   console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
   console.log('API URL:', process.env.REACT_APP_API_URL);
   ```

If they show `undefined`, the environment variables aren't set correctly.

---

## 📋 Quick Checklist

- [ ] Environment variables set in Vercel
- [ ] Variables point to Render backend URL
- [ ] No trailing slash in URLs
- [ ] Frontend redeployed after setting variables
- [ ] Test login again

---

**After redeploying with correct environment variables, the login should work!** 🎯

