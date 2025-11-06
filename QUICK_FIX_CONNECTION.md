# 🚨 Quick Fix: Backend Connection Issues

## ⚡️ Immediate Actions Needed

### **1. Get Your Actual Backend URL**

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click on your **holy-cross-backend** service
3. **Copy the Service URL** (NOT the placeholder - your actual URL!)
   - Should look like: `https://holy-cross-backend-xxxxx.onrender.com`
   - Or: `https://holy-cross-backend.onrender.com`

### **2. Fix CORS in Render (Backend)**

1. Render Dashboard → Your Backend Service → **Environment** tab
2. Add/Update these variables with your **actual Vercel URL**:

```bash
FRONTEND_URL=https://holy-cross-convent-school-brooklyn-aev14s5y5.vercel.app
CORS_ORIGIN=https://holy-cross-convent-school-brooklyn-aev14s5y5.vercel.app
```

**Important:** Use the exact Vercel URL from your error message!

3. **Save** - Render will auto-redeploy

### **3. Fix Environment Variables in Vercel (Frontend)**

1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Update with your **actual Render backend URL**:

```bash
REACT_APP_API_BASE_URL=https://your-actual-render-backend-url.onrender.com
REACT_APP_API_URL=https://your-actual-render-backend-url.onrender.com
```

**Replace `your-actual-render-backend-url.onrender.com` with your real URL from Step 1!**

3. **Save**

### **4. Test Backend Directly**

Open in browser (replace with your actual URL):
```
https://your-actual-backend-url.onrender.com/api/health
```

**Should return:**
```json
{
  "status": "OK",
  "database": "Connected",
  ...
}
```

### **5. Redeploy Frontend**

After updating environment variables, trigger redeploy:

```bash
git commit --allow-empty -m "Redeploy with correct backend URL"
git push
```

### **6. Test Again (Use Your Actual URL!)**

In browser console, use your **actual backend URL**:

```javascript
// Replace with YOUR actual backend URL from Render!
fetch('https://your-actual-backend-url.onrender.com/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend connected:', data))
  .catch(err => console.error('❌ Error:', err));
```

---

## 🔍 How to Find Your Backend URL

1. **Render Dashboard** → Your Backend Service
2. Look for **"Service URL"** or **"URL"** field
3. Copy the full URL (starts with `https://`)
4. It should end with `.onrender.com`

---

## ✅ Checklist

- [ ] Got actual backend URL from Render (not placeholder)
- [ ] Updated `FRONTEND_URL` in Render with your Vercel URL
- [ ] Updated `CORS_ORIGIN` in Render with your Vercel URL  
- [ ] Updated `REACT_APP_API_URL` in Vercel with your Render URL
- [ ] Updated `REACT_APP_API_BASE_URL` in Vercel with your Render URL
- [ ] Tested backend health endpoint in browser (works)
- [ ] Backend redeployed (auto after env var change)
- [ ] Frontend redeployed (after env var change)
- [ ] Tested connection with actual URLs

---

**The key issue: You used a placeholder URL. Get your actual backend URL from Render and use that everywhere!** 🎯

