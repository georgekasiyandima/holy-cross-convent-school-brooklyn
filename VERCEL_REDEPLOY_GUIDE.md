# 🚀 Vercel Redeploy Guide - Connect to Render Backend

## ✅ Backend Status

Your backend is **live and working** at:
```
https://holy-cross-convent-school-brooklyn.onrender.com
```

✅ Database connected  
✅ Server running on port 5000  
✅ Health endpoint working  

---

## 🎯 Step 1: Set Environment Variables in Vercel (5 minutes)

### **Go to Vercel Dashboard:**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **holy-cross-convent-school-brooklyn** project
3. Click **Settings** → **Environment Variables**

### **Add/Update These Variables:**

```bash
REACT_APP_API_BASE_URL=https://holy-cross-convent-school-brooklyn.onrender.com
REACT_APP_API_URL=https://holy-cross-convent-school-brooklyn.onrender.com
```

**Important:**
- ✅ **No trailing slash** - Don't include `/` at the end
- ✅ **Use HTTPS** - Always use `https://`
- ✅ **Set for Production** (and Preview if you want)

### **Click "Save"**

---

## 🚀 Step 2: Redeploy Frontend (2 minutes)

### **Option A: Manual Redeploy (Recommended)**

1. In Vercel Dashboard → Your Project
2. Go to **"Deployments"** tab
3. Find the latest deployment
4. Click the **three dots (`...`)** → **"Redeploy"**
5. Select **"Use existing Build Cache"** (faster)
6. Click **"Redeploy"**

### **Option B: Push Empty Commit**

```bash
git commit --allow-empty -m "Trigger Vercel redeploy with backend connection"
git push origin main
```

Vercel will automatically detect the push and redeploy.

---

## ✅ Step 3: Verify Connection (2 minutes)

After redeploy completes, test the connection:

### **Test 1: Check Browser Console**

1. Open your Vercel frontend URL
2. Open **Developer Console** (F12)
3. Go to **Network** tab
4. Refresh the page
5. Look for API calls to `holy-cross-convent-school-brooklyn.onrender.com`
6. They should return **200 OK** (not 404 or CORS errors)

### **Test 2: Test Specific Endpoints**

Open browser console and run:

```javascript
// Test health endpoint
fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/health')
  .then(res => res.json())
  .then(data => {
    console.log('✅ Backend Health:', data);
    if (data.database?.tables?.staff_members) {
      console.log('✅ Database tables exist!');
    }
  });

// Test staff endpoint
fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/staff')
  .then(res => res.json())
  .then(data => console.log('✅ Staff API:', data));
```

### **Test 3: Test Frontend Pages**

1. Navigate to **Staff** page - should load staff members
2. Navigate to **Gallery** page - should load gallery items
3. Navigate to **Home** page - should load announcements/events

---

## 🔍 Troubleshooting

### **If you see CORS errors:**

1. Go to Render Dashboard → Backend Service → **Environment**
2. Verify these are set:
   ```bash
   FRONTEND_URL=https://your-vercel-app.vercel.app
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```
3. Redeploy backend if you changed them

### **If API calls fail:**

1. Check Vercel environment variables are set correctly
2. Check browser console for exact error
3. Verify backend is running (test `/api/health` directly)

### **If data doesn't load:**

1. Check Network tab - are API calls being made?
2. Check Response - what error is returned?
3. Verify backend logs in Render for errors

---

## ✅ Success Indicators

After redeploy, you should see:
- ✅ No CORS errors in console
- ✅ API calls return 200 OK
- ✅ Staff page loads staff members
- ✅ Gallery page loads images
- ✅ Home page loads announcements/events
- ✅ Admin features work (if logged in)

---

## 📋 Quick Checklist

- [ ] Set `REACT_APP_API_BASE_URL` in Vercel
- [ ] Set `REACT_APP_API_URL` in Vercel
- [ ] Redeploy frontend on Vercel
- [ ] Test health endpoint
- [ ] Test staff endpoint
- [ ] Test frontend pages
- [ ] Verify no CORS errors

---

**Once you redeploy Vercel, your frontend will be connected to your backend!** 🎉

