# 🔧 Staff Upload Fix Guide

## 🚨 Issue
Staff image upload not working after PostgreSQL migration and deployment.

---

## 🔍 Quick Diagnostic

### Step 1: Check Browser Console
1. Open DevTools (F12)
2. Go to **Console** tab
3. Try to upload an image
4. Look for error messages

### Step 2: Check Network Tab
1. Open DevTools → **Network** tab
2. Try to upload an image
3. Find the `/api/staff/:id` request
4. Check:
   - **Status code** (should be 200)
   - **Request payload** (should have FormData)
   - **Response** (should have success: true)

### Step 3: Check Render Logs
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click backend service → **Logs**
3. Look for:
   - `🔍 Staff PUT route: Starting request`
   - `🔍 updateStaffImage: Starting`
   - Any error messages

---

## ✅ Common Fixes

### Fix 1: File Not Being Sent

**Symptom:** `req.file` is undefined in logs

**Check:**
- File input is working
- File is selected before upload
- FormData is created correctly

**Fix:** The frontend code looks correct. Check browser console for JavaScript errors.

### Fix 2: Authentication Issues

**Symptom:** 401 Unauthorized errors

**Fix:**
```javascript
// Check token in browser console
console.log('Token:', localStorage.getItem('adminToken'));

// If missing, log in again
```

### Fix 3: File Size Too Large

**Symptom:** `LIMIT_FILE_SIZE` error

**Fix:** 
- Maximum file size is 5MB
- Compress image before uploading
- Or increase limit in `backend/src/middleware/upload.ts`

### Fix 4: Upload Directory Not Writable

**Symptom:** `EACCES` or `ENOENT` errors in Render logs

**Fix:** The service now creates directories automatically. Check Render logs to see if directories are created.

### Fix 5: Database Connection Issues

**Symptom:** Database errors in Render logs

**Fix:**
- Check DATABASE_URL is set correctly
- Verify PostgreSQL service is running
- Check database migrations have run

---

## 🧪 Test Upload Endpoint Directly

Run this in browser console on your Vercel site:

```javascript
(async () => {
  const API_URL = 'https://holy-cross-convent-school-brooklyn.onrender.com/api';
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    console.error('❌ No token. Please log in first.');
    return;
  }
  
  // Get first staff member
  const staffRes = await fetch(`${API_URL}/staff`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const staffData = await staffRes.json();
  
  if (!staffData.success || !staffData.data.staff || staffData.data.staff.length === 0) {
    console.error('❌ No staff members found');
    return;
  }
  
  const staff = staffData.data.staff[0];
  console.log('📝 Testing upload for:', staff.name);
  
  // Create test image
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1a237e';
  ctx.fillRect(0, 0, 100, 100);
  ctx.fillStyle = '#ffd700';
  ctx.font = '20px Arial';
  ctx.fillText('Test', 30, 50);
  
  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append('image', blob, 'test-upload.png');
    formData.append('name', staff.name);
    formData.append('role', staff.role || '');
    formData.append('category', staff.category);
    
    console.log('📤 Uploading...');
    try {
      const uploadRes = await fetch(`${API_URL}/staff/${staff.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const uploadData = await uploadRes.json();
      console.log('📥 Response status:', uploadRes.status);
      console.log('📄 Response:', uploadData);
      
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
})();
```

---

## 📋 What to Check in Render Logs

After trying to upload, check Render logs for:

### ✅ Success Indicators:
```
🔍 Staff PUT route: Starting request
🔍 Staff PUT route: File received: Yes
🔍 updateStaffImage: Starting with staffId: ...
✅ Created upload directory: /app/uploads/staff
🔍 updateStaffImage: File validation passed
🔍 optimizeImage: Processing file: ...
✅ Created staff directory: /app/uploads/staff
🔍 updateStaffImage: Image optimization completed
✅ Login successful for user: ...
```

### ❌ Error Indicators:
```
❌ Error creating/accessing directory: ...
❌ Staff image update error: ...
❌ Uploaded file not found on server
❌ File type ... is not allowed
❌ Database operation failed
```

---

## 🔧 Enhanced Error Handling

The updated code now:
1. ✅ Creates upload directories automatically
2. ✅ Verifies directories exist before processing
3. ✅ Provides detailed logging
4. ✅ Handles file path issues
5. ✅ Better error messages

---

## 🚨 Important: Render Ephemeral Storage

**Remember:** Render's free tier has **ephemeral storage**. This means:

- ✅ Files upload successfully
- ✅ Files are accessible immediately
- ❌ Files are **lost on redeploy**
- ❌ Files are **lost on server restart**

### Solutions:

1. **Re-upload after each deploy** (temporary)
2. **Use external storage** (Cloudinary, AWS S3) - **Recommended**
3. **Upgrade Render plan** for persistent storage

---

## 🎯 Next Steps

1. **Deploy the fixes** (they're already pushed)
2. **Wait for deployment** (2-5 minutes)
3. **Try uploading again**
4. **Check Render logs** for detailed error messages
5. **Run diagnostic script** if still not working

---

## 📞 Still Not Working?

1. **Check browser console** for frontend errors
2. **Check Network tab** for request/response details
3. **Check Render logs** for backend errors
4. **Verify environment variables** are set
5. **Test API endpoint directly** using the test script above

The enhanced logging will show exactly where the upload is failing!

