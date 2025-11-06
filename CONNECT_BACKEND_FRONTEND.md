# 🔗 Connect Backend to Frontend - Complete Guide

## ✅ Prerequisites

- ✅ Backend deployed on Render (you've completed this!)
- ✅ Frontend deployed on Vercel
- ✅ Backend URL from Render (e.g., `https://holy-cross-backend.onrender.com`)
- ✅ Frontend URL from Vercel (e.g., `https://holy-cross-convent-school-brooklyn.vercel.app`)

---

## 🚀 Step 1: Get Your Backend URL from Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click on your **holy-cross-backend** service
3. Copy the **Service URL** (e.g., `https://holy-cross-backend.onrender.com`)
4. **Test the backend** by visiting: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"OK","database":"Connected",...}`

---

## 🚀 Step 2: Update Frontend Environment Variables in Vercel

### **Option A: Using Vercel Dashboard (Recommended)**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **holy-cross-convent-school-brooklyn** project
3. Click **Settings** → **Environment Variables**
4. Add/Update the following variables:

#### **Required Environment Variable:**

```bash
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

**Example:**
```bash
REACT_APP_API_URL=https://holy-cross-backend.onrender.com
```

#### **Important Notes:**
- ⚠️ **No trailing slash** - Don't include `/` at the end
- ⚠️ **Use HTTPS** - Always use `https://` not `http://`
- ⚠️ **Environment** - Set for **Production**, **Preview**, and **Development** (or just Production if you prefer)

5. Click **Save**

### **Option B: Using Vercel CLI**

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variable
vercel env add REACT_APP_API_URL production
# When prompted, enter: https://your-backend-url.onrender.com
```

---

## 🚀 Step 3: Update Backend CORS Configuration

Ensure your backend allows requests from your Vercel frontend:

1. Go to Render Dashboard → Your Backend Service → **Environment** tab
2. Check/Update these variables:

```bash
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

**Example:**
```bash
FRONTEND_URL=https://holy-cross-convent-school-brooklyn.vercel.app
CORS_ORIGIN=https://holy-cross-convent-school-brooklyn.vercel.app
```

3. **Redeploy** the backend if you changed these values (Render will auto-redeploy)

---

## 🚀 Step 4: Redeploy Frontend

After setting environment variables, you need to trigger a new deployment:

### **Option A: Automatic (via Git Push)**

```bash
# Make a small change and push
git commit --allow-empty -m "Trigger Vercel redeploy with new API URL"
git push
```

### **Option B: Manual Redeploy in Vercel**

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click the **three dots** (⋯) on the latest deployment
4. Click **Redeploy**
5. Wait for deployment to complete (2-3 minutes)

---

## 🧪 Step 5: Test the Connection

### **1. Test Backend Health Endpoint**

Open in browser:
```
https://your-backend-url.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "...",
  "environment": "production",
  "database": "Connected"
}
```

### **2. Test Frontend Connection**

1. Visit your Vercel frontend URL
2. Open **Browser Developer Tools** (F12)
3. Go to **Console** tab
4. Look for any CORS errors or API connection errors
5. Try logging in or accessing features that use the backend

### **3. Test API Endpoints from Frontend**

In browser console, test:
```javascript
// Test API connection
fetch('https://your-backend-url.onrender.com/api/health')
  .then(res => res.json())
  .then(data => console.log('Backend connected:', data))
  .catch(err => console.error('Connection error:', err));
```

---

## 🔍 Step 6: Verify Configuration

### **Check Frontend API Configuration**

The frontend uses these files for API configuration:

1. **`frontend/src/services/apiConfig.ts`** - Centralized API config
2. **`frontend/src/services/galleryService.ts`** - Uses `REACT_APP_API_URL`
3. **`frontend/src/contexts/AuthContext.tsx`** - Uses `REACT_APP_API_URL`

### **Current Configuration:**

```typescript
// apiConfig.ts
const defaultProdBase = 'https://holy-cross-convent-school-brooklyn.onrender.com';
const resolvedBase = envApiBase || (process.env.NODE_ENV === 'production' ? defaultProdBase : defaultDevBase);
```

**After setting `REACT_APP_API_URL` in Vercel:**
- The frontend will use `process.env.REACT_APP_API_URL` instead of the default
- All API calls will go to your Render backend

---

## 🐛 Troubleshooting

### **Issue: CORS Errors**

**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Fix:**
1. Check `FRONTEND_URL` and `CORS_ORIGIN` in Render environment variables
2. Ensure they match your Vercel URL exactly (including `https://`)
3. Redeploy backend after updating

### **Issue: 404 Not Found**

**Error:** `404 Not Found` when calling API endpoints

**Fix:**
1. Verify backend URL is correct (no trailing slash)
2. Check that backend is running (visit `/api/health`)
3. Ensure API routes are correct (e.g., `/api/gallery`, `/api/staff`)

### **Issue: 401 Unauthorized**

**Error:** `401 Unauthorized` when accessing protected routes

**Fix:**
1. Check that `JWT_SECRET` is set in Render
2. Verify authentication token is being sent from frontend
3. Check browser console for token storage issues

### **Issue: Environment Variable Not Working**

**Error:** Frontend still using old/default API URL

**Fix:**
1. Verify variable name is exactly `REACT_APP_API_URL` (case-sensitive)
2. Ensure it's set for the correct environment (Production)
3. **Redeploy frontend** after setting the variable
4. Clear browser cache and hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### **Issue: Backend Not Responding**

**Error:** `Network Error` or `Failed to fetch`

**Fix:**
1. Check Render dashboard - is backend service running? (green status)
2. Check Render logs for errors
3. Verify backend URL is accessible: `https://your-backend-url.onrender.com/api/health`
4. Check if backend is sleeping (free tier sleeps after inactivity)

---

## 📋 Quick Checklist

- [ ] Backend deployed on Render ✅
- [ ] Backend health endpoint working (`/api/health`)
- [ ] Backend URL copied (e.g., `https://holy-cross-backend.onrender.com`)
- [ ] `REACT_APP_API_URL` set in Vercel environment variables
- [ ] `FRONTEND_URL` and `CORS_ORIGIN` set in Render environment variables
- [ ] Frontend redeployed after setting environment variables
- [ ] Backend redeployed after setting CORS variables (if changed)
- [ ] Tested connection from browser console
- [ ] No CORS errors in browser console
- [ ] API calls working from frontend

---

## 🎯 Next Steps After Connection

1. **Test Authentication:**
   - Try logging in to admin panel
   - Verify JWT tokens are working

2. **Test API Endpoints:**
   - Gallery uploads
   - Staff management
   - Application submissions
   - Document uploads

3. **Monitor Logs:**
   - Check Render logs for backend errors
   - Check Vercel logs for frontend errors
   - Monitor browser console for client-side errors

4. **Performance:**
   - Test page load times
   - Check API response times
   - Monitor Render service uptime

---

## 📞 Support

If you encounter issues:

1. **Check Render Logs:**
   - Render Dashboard → Your Service → **Logs** tab
   - Look for errors or warnings

2. **Check Vercel Logs:**
   - Vercel Dashboard → Your Project → **Deployments** → Click deployment → **Functions** tab

3. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Check **Console** and **Network** tabs
   - Look for failed requests

4. **Verify Environment Variables:**
   - Double-check variable names (case-sensitive)
   - Ensure no extra spaces or quotes
   - Verify URLs are correct (https, no trailing slash)

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ Frontend loads without console errors
- ✅ API calls succeed (check Network tab)
- ✅ Authentication works
- ✅ Data loads from backend (staff, gallery, etc.)
- ✅ No CORS errors in console
- ✅ Backend logs show successful requests

---

**Your backend is now live! Follow these steps to connect it to your frontend.** 🚀

