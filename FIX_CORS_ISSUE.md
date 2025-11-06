# 🔧 Fix CORS Issue - Quick Guide

## 🚨 Current Issue

Your backend is configured to allow:
- `https://holy-cross-convent-school-brooklyn-l9nkk0tl0.vercel.app`

But your frontend is at:
- `https://holy-cross-convent-school-brooklyn-aev14s5y5.vercel.app`

**These are different Vercel preview URLs!**

---

## ✅ Solution 1: Update CORS in Render (Recommended)

### **In Render Dashboard → Backend Service → Environment:**

Update these variables to allow your current Vercel URL:

```bash
FRONTEND_URL=https://holy-cross-convent-school-brooklyn-aev14s5y5.vercel.app
CORS_ORIGIN=https://holy-cross-convent-school-brooklyn-aev14s5y5.vercel.app
```

**Or better yet**, if you have a production domain, use that:
```bash
FRONTEND_URL=https://holy-cross-convent-school-brooklyn.vercel.app
CORS_ORIGIN=https://holy-cross-convent-school-brooklyn.vercel.app
```

**Note:** Vercel preview URLs change with each deployment. Consider using your production domain or a wildcard pattern.

---

## ✅ Solution 2: Use Correct Endpoint

**Important:** The health endpoint is `/api/health` not `/health`

Test with:
```javascript
fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend connected:', data))
  .catch(err => console.error('❌ Error:', err));
```

---

## ✅ Solution 3: Code Fix (Already Applied)

I've updated the backend code to:
- Allow all Vercel preview URLs matching the pattern
- Allow your production Vercel domain
- Fallback to allowing all origins if no CORS is configured

**After this code is deployed, you'll need to:**
1. Push the changes
2. Wait for Render to redeploy
3. Test again

---

## 🚀 Quick Fix Steps

1. **Update CORS in Render:**
   - Go to Render Dashboard → Backend → Environment
   - Set `CORS_ORIGIN` to your current Vercel URL
   - Save (auto-redeploys)

2. **Test with correct endpoint:**
   ```javascript
   fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/health')
     .then(res => res.json())
     .then(data => console.log('✅ Success:', data))
   ```

3. **Update Frontend Environment Variables:**
   - Vercel Dashboard → Settings → Environment Variables
   - Set `REACT_APP_API_URL` to: `https://holy-cross-convent-school-brooklyn.onrender.com`
   - Set `REACT_APP_API_BASE_URL` to: `https://holy-cross-convent-school-brooklyn.onrender.com`

4. **Redeploy Frontend:**
   - Push an empty commit or redeploy in Vercel

---

## 📝 Your URLs

Based on the error:
- **Backend:** `https://holy-cross-convent-school-brooklyn.onrender.com`
- **Frontend (current):** `https://holy-cross-convent-school-brooklyn-aev14s5y5.vercel.app`
- **Frontend (old CORS):** `https://holy-cross-convent-school-brooklyn-l9nkk0tl0.vercel.app`

---

**The code fix I just made will allow all Vercel preview URLs, so this won't be an issue after deployment!** 🎯

