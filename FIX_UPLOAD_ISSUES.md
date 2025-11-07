# 🔧 Fix Upload Issues - Staff & Gallery

## 🚨 Current Issues

1. **Staff upload not working** - Images not uploading
2. **Gallery images not being served** - Can upload but images don't display

---

## 🔍 Root Causes

### Issue 1: Gallery Images Not Served

**Problem:** 
- Files are uploaded to `uploads/gallery/`
- Frontend tries to access them at `/uploads/gallery/{fileName}`
- Static file serving is configured but URLs might be wrong

**Fix Applied:**
- ✅ Fixed gallery service to use centralized API config
- ✅ Improved URL generation
- ✅ Added CORS headers for static files
- ✅ Added logging for image URLs

### Issue 2: Staff Upload Not Working

**Problem:**
- File might not be reaching the backend
- Upload directory might not exist
- File validation might be failing

**Fix Applied:**
- ✅ Enhanced error handling
- ✅ Added file existence verification
- ✅ Improved logging throughout upload process
- ✅ Better directory creation

---

## 🧪 Diagnostic Scripts

### Test Staff Upload

```javascript
// Run in browser console on staff upload page
(async () => {
  const API_URL = 'https://holy-cross-convent-school-brooklyn.onrender.com/api';
  const token = localStorage.getItem('adminToken');
  
  // Get first staff
  const staffRes = await fetch(`${API_URL}/staff`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const staffData = await staffRes.json();
  
  if (!staffData.data.staff || staffData.data.staff.length === 0) {
    console.error('❌ No staff members found');
    return;
  }
  
  const staff = staffData.data.staff[0];
  console.log('Testing upload for:', staff.name);
  
  // Create test image
  const canvas = document.createElement('canvas');
  canvas.width = 200; canvas.height = 200;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1a237e';
  ctx.fillRect(0, 0, 200, 200);
  ctx.fillStyle = '#ffd700';
  ctx.font = '30px Arial';
  ctx.fillText('Test', 60, 110);
  
  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append('image', blob, 'test-staff.png');
    formData.append('name', staff.name);
    formData.append('role', staff.role || '');
    formData.append('category', staff.category);
    
    console.log('📤 Uploading...');
    const uploadRes = await fetch(`${API_URL}/staff/${staff.id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    
    const uploadData = await uploadRes.json();
    console.log('📥 Response:', uploadData);
    
    if (uploadData.success) {
      console.log('✅ Upload successful!');
      console.log('🖼️  Image URL:', uploadData.data?.staff?.imageUrl || uploadData.data?.imageUrl);
    } else {
      console.error('❌ Upload failed:', uploadData.error, uploadData.message);
    }
  }, 'image/png');
})();
```

### Test Gallery Image Access

```javascript
// Run in browser console on gallery page
(async () => {
  const API_URL = 'https://holy-cross-convent-school-brooklyn.onrender.com/api';
  
  // Get gallery items
  const galleryRes = await fetch(`${API_URL}/gallery?limit=5`);
  const galleryData = await galleryRes.json();
  
  if (galleryData.success && galleryData.data.items) {
    console.log('📊 Gallery items found:', galleryData.data.items.length);
    
    galleryData.data.items.forEach((item, index) => {
      if (item.type === 'IMAGE' && item.fileName) {
        const imageUrl = `https://holy-cross-convent-school-brooklyn.onrender.com/uploads/gallery/${item.fileName}`;
        console.log(`\n${index + 1}. ${item.title}`);
        console.log('   FileName:', item.fileName);
        console.log('   Image URL:', imageUrl);
        
        // Test if image is accessible
        fetch(imageUrl, { method: 'HEAD' })
          .then(res => {
            if (res.ok) {
              console.log('   ✅ Image accessible');
            } else {
              console.error(`   ❌ Image not accessible: ${res.status} ${res.statusText}`);
            }
          })
          .catch(err => {
            console.error('   ❌ Image access error:', err.message);
          });
      }
    });
  } else {
    console.error('❌ No gallery items found');
  }
})();
```

---

## 🔧 What Was Fixed

### 1. Gallery Image URLs
- ✅ Fixed to use centralized API config
- ✅ Proper URL construction
- ✅ Added logging for debugging

### 2. Static File Serving
- ✅ Enhanced with CORS headers
- ✅ Added cache headers
- ✅ Added directory logging

### 3. Staff Upload
- ✅ Better file verification
- ✅ Enhanced error messages
- ✅ Improved logging

---

## 📋 Check Render Logs

After trying to upload, check Render logs for:

### Staff Upload:
```
🔍 Staff PUT route: Starting request
🔍 Staff PUT route: File received: Yes
🔍 Staff PUT route: File details: { ... }
✅ Created upload directory: /app/uploads/staff
🔍 updateStaffImage: Starting with staffId: ...
✅ Staff PUT route: Upload successful
```

### Gallery Upload:
```
📁 Upload directory configured: /app/uploads
✅ Created upload directory: /app/uploads/gallery
```

### Image Serving:
```
GET /uploads/gallery/filename.jpg 200
```

---

## 🚨 Important: Render Ephemeral Storage

**Remember:** Files uploaded to Render free tier are **lost on redeploy**!

### Solutions:

1. **Re-upload after each deploy** (temporary)
2. **Use external storage** (Cloudinary, AWS S3) - **Recommended**
3. **Upgrade Render plan** for persistent storage

---

## ✅ Testing Checklist

After deployment:

- [ ] **Staff Upload:**
  - [ ] Can select staff member
  - [ ] Can choose image file
  - [ ] Upload button works
  - [ ] Success message appears
  - [ ] Image updates in UI
  - [ ] Image displays on public page

- [ ] **Gallery Upload:**
  - [ ] Can upload image
  - [ ] Success message appears
  - [ ] Image appears in gallery list
  - [ ] Image displays correctly
  - [ ] Image URL is correct

---

## 🐛 Still Not Working?

1. **Check browser console** (F12) for errors
2. **Check Network tab** for failed requests
3. **Check Render logs** for backend errors
4. **Verify environment variables** are set
5. **Test endpoints directly** using the scripts above

The enhanced logging will show exactly where things are failing!

