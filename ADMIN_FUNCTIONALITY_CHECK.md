# 🔍 Admin Functionality Diagnostic & Fix Guide

## 🚨 Current Issues After PostgreSQL Migration

1. **Staff image upload not working**
2. **Admin features may not be working as expected**
3. **Things that worked on localhost not working in production**

---

## 🔧 Quick Diagnostic Script

Run this in your browser console on your Vercel site to diagnose issues:

```javascript
(async () => {
  const API_URL = 'https://holy-cross-convent-school-brooklyn.onrender.com/api';
  const token = localStorage.getItem('adminToken');
  
  console.log('🔍 Admin Functionality Diagnostic');
  console.log('================================\n');
  
  // 1. Check authentication
  console.log('1️⃣ Checking authentication...');
  if (!token) {
    console.error('   ❌ No admin token found. Please log in.');
    return;
  }
  console.log('   ✅ Token found:', token.substring(0, 20) + '...');
  
  // 2. Test auth endpoint
  try {
    const authCheck = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const authData = await authCheck.json();
    if (authData.success) {
      console.log('   ✅ Authentication valid');
      console.log('   👤 User:', authData.data.user.email);
    } else {
      console.error('   ❌ Authentication failed:', authData.error);
      return;
    }
  } catch (err) {
    console.error('   ❌ Auth check error:', err);
    return;
  }
  
  // 3. Check staff endpoint
  console.log('\n2️⃣ Checking staff endpoint...');
  try {
    const staffRes = await fetch(`${API_URL}/staff`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const staffData = await staffRes.json();
    if (staffData.success) {
      console.log('   ✅ Staff endpoint working');
      console.log('   📊 Staff count:', staffData.data.staff?.length || 0);
      if (staffData.data.staff && staffData.data.staff.length > 0) {
        const firstStaff = staffData.data.staff[0];
        console.log('   👤 First staff:', firstStaff.name);
        console.log('   🖼️  Has image:', !!firstStaff.imageUrl);
        if (firstStaff.imageUrl) {
          console.log('   🔗 Image URL:', firstStaff.imageUrl);
        }
      }
    } else {
      console.error('   ❌ Staff endpoint error:', staffData.error);
    }
  } catch (err) {
    console.error('   ❌ Staff endpoint error:', err);
  }
  
  // 4. Test upload endpoint (without file)
  console.log('\n3️⃣ Checking upload endpoint structure...');
  try {
    // This will fail but shows us the endpoint exists
    const testRes = await fetch(`${API_URL}/staff/test-id`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'test' })
    });
    const testData = await testRes.json();
    console.log('   📡 Endpoint response:', testRes.status);
    console.log('   📄 Response:', testData);
  } catch (err) {
    console.log('   ⚠️  Endpoint test (expected to fail without file):', err.message);
  }
  
  // 5. Check backend health
  console.log('\n4️⃣ Checking backend health...');
  try {
    const healthRes = await fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/health');
    const healthData = await healthRes.json();
    console.log('   ✅ Backend is online');
    console.log('   📊 Status:', healthData.status);
  } catch (err) {
    console.error('   ❌ Backend health check failed:', err);
  }
  
  console.log('\n================================');
  console.log('✅ Diagnostic complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Check the errors above');
  console.log('   2. Try uploading an image');
  console.log('   3. Check browser console for upload errors');
  console.log('   4. Check Render logs for backend errors');
})();
```

---

## 🔧 Common Issues & Fixes

### Issue 1: Upload Directory Not Writable

**Symptom:** Upload fails with "EACCES" or "ENOENT" errors

**Fix:** The upload service should create directories automatically, but check Render logs for permission errors.

### Issue 2: Ephemeral Storage (Files Lost on Redeploy)

**Symptom:** Images work initially but disappear after redeploy

**Solution:** This is expected on Render free tier. Options:
1. **Re-upload after each deploy** (temporary solution)
2. **Use external storage** (Cloudinary, AWS S3, etc.) - recommended
3. **Upgrade Render plan** for persistent storage

### Issue 3: CORS Issues

**Symptom:** Upload fails with CORS error in browser console

**Fix:** Check backend CORS configuration allows your Vercel domain.

### Issue 4: Authentication Token Issues

**Symptom:** 401 Unauthorized errors

**Fix:** 
- Check token is in localStorage
- Verify token hasn't expired
- Re-login if needed

### Issue 5: Database Connection Issues

**Symptom:** 500 errors, database connection errors

**Fix:**
- Check DATABASE_URL is set correctly in Render
- Verify PostgreSQL service is running
- Check database migrations have run

---

## 🧪 Test Staff Upload Manually

### Step 1: Create Test FormData

```javascript
// Run in browser console on staff upload page
const testUpload = async () => {
  const API_URL = 'https://holy-cross-convent-school-brooklyn.onrender.com/api';
  const token = localStorage.getItem('adminToken');
  
  // Get first staff member
  const staffRes = await fetch(`${API_URL}/staff`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const staffData = await staffRes.json();
  
  if (!staffData.success || !staffData.data.staff || staffData.data.staff.length === 0) {
    console.error('❌ No staff members found');
    return;
  }
  
  const staffMember = staffData.data.staff[0];
  console.log('📝 Testing upload for:', staffMember.name);
  
  // Create a test image (1x1 pixel PNG)
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append('image', blob, 'test.png');
    formData.append('name', staffMember.name);
    formData.append('role', staffMember.role || '');
    formData.append('category', staffMember.category);
    
    try {
      const uploadRes = await fetch(`${API_URL}/staff/${staffMember.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - browser will set it with boundary
        },
        body: formData
      });
      
      const uploadData = await uploadRes.json();
      console.log('📤 Upload response:', uploadRes.status);
      console.log('📄 Response data:', uploadData);
      
      if (uploadData.success) {
        console.log('✅ Upload successful!');
        console.log('🖼️  Image URL:', uploadData.data?.staff?.imageUrl || uploadData.data?.imageUrl);
      } else {
        console.error('❌ Upload failed:', uploadData.error, uploadData.message);
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
    }
  }, 'image/png');
};

testUpload();
```

---

## 🔍 Check Render Logs

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service
3. Go to **Logs** tab
4. Look for:
   - `🔍 Staff PUT route: Starting request`
   - `🔍 Upload Route: File received:`
   - `❌` error messages
   - Database connection errors

---

## ✅ Expected Behavior

### Working Upload Should Show:

**Frontend Console:**
```
🔍 Upload - Token: Present
🔍 Upload - Staff Member: { id: '...', name: '...' }
Upload progress: 100%
```

**Render Logs:**
```
🔍 Staff PUT route: Starting request
🔍 Staff PUT route: File received: Yes
🔍 Staff PUT route: Processing image upload
🔍 updateStaffImage: Starting with staffId: ...
🔍 updateStaffImage: File validation passed
🔍 updateStaffImage: Image optimization completed
✅ Login successful for user: ...
```

**Response:**
```json
{
  "success": true,
  "message": "Staff member updated successfully with new image",
  "data": {
    "staff": { ... },
    "image": {
      "url": "/uploads/staff/...",
      "thumbnailUrl": "/uploads/staff/..."
    }
  }
}
```

---

## 🚀 Quick Fixes to Try

### Fix 1: Clear Browser Cache
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely

### Fix 2: Re-login
- Log out
- Clear localStorage
- Log in again
- Try upload

### Fix 3: Check API URL
- Verify `REACT_APP_API_BASE_URL` is set in Vercel
- Should be: `https://holy-cross-convent-school-brooklyn.onrender.com`

### Fix 4: Verify Backend is Running
- Check: https://holy-cross-convent-school-brooklyn.onrender.com/api/health
- Should return: `{"status":"OK",...}`

---

## 📋 Full Admin Feature Checklist

Test each feature:

- [ ] **Login** - Can log in successfully
- [ ] **Dashboard** - Shows all modules and menu
- [ ] **Staff Upload** - Can upload staff images
- [ ] **Document Upload** - Can upload documents
- [ ] **Application Management** - Can view applications
- [ ] **Calendar Management** - Can create/edit events
- [ ] **Gallery Management** - Can upload images
- [ ] **School Statistics** - Can view/edit stats
- [ ] **Newsletter** - Can create newsletters
- [ ] **Vacancies** - Can manage job postings

---

## 🆘 Still Not Working?

1. **Check browser console** for JavaScript errors
2. **Check Network tab** for failed requests
3. **Check Render logs** for backend errors
4. **Verify environment variables** are set correctly
5. **Test API endpoints directly** using the diagnostic script

---

**Remember:** Render's free tier has ephemeral storage. Files will be lost on redeploy. Consider using external storage for production!







