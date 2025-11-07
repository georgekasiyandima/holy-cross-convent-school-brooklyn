// 🧪 Test Image Access After Upload
// Run this in browser console after uploading an image

(async () => {
  const API_URL = 'https://holy-cross-convent-school-brooklyn.onrender.com/api';
  const token = localStorage.getItem('adminToken');
  
  console.log('🧪 Testing Image Access');
  console.log('========================\n');
  
  // Test 1: Get gallery items
  console.log('1️⃣ Fetching gallery items...');
  try {
    const galleryRes = await fetch(`${API_URL}/gallery?limit=5`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const galleryData = await galleryRes.json();
    
    if (galleryData.success && galleryData.data.items) {
      console.log(`   ✅ Found ${galleryData.data.items.length} gallery items`);
      
      // Test 2: Check each image URL
      galleryData.data.items.forEach((item, index) => {
        if (item.type === 'IMAGE' && item.fileName) {
          const imageUrl = `https://holy-cross-convent-school-brooklyn.onrender.com/uploads/gallery/${item.fileName}`;
          console.log(`\n${index + 1}. ${item.title}`);
          console.log(`   FileName: ${item.fileName}`);
          console.log(`   Image URL: ${imageUrl}`);
          
          // Test if image is accessible
          fetch(imageUrl, { method: 'HEAD' })
            .then(res => {
              if (res.ok) {
                console.log(`   ✅ Image accessible (${res.status})`);
                console.log(`   📊 Content-Type: ${res.headers.get('Content-Type')}`);
                console.log(`   📏 Content-Length: ${res.headers.get('Content-Length')} bytes`);
              } else {
                console.error(`   ❌ Image not accessible: ${res.status} ${res.statusText}`);
              }
            })
            .catch(err => {
              console.error(`   ❌ Image access error: ${err.message}`);
            });
        }
      });
    } else {
      console.error('   ❌ No gallery items found');
    }
  } catch (err) {
    console.error('   ❌ Error fetching gallery:', err);
  }
  
  // Test 3: Test specific image from console log
  console.log('\n\n2️⃣ Testing specific image from your console log...');
  const testFileName = 'file-1762494499977-457299027.jpg';
  const testUrl = `https://holy-cross-convent-school-brooklyn.onrender.com/uploads/gallery/${testFileName}`;
  console.log(`   Testing: ${testUrl}`);
  
  try {
    const testRes = await fetch(testUrl, { method: 'HEAD' });
    if (testRes.ok) {
      console.log(`   ✅ Image is accessible!`);
      console.log(`   📊 Status: ${testRes.status}`);
      console.log(`   📊 Content-Type: ${testRes.headers.get('Content-Type')}`);
      console.log(`   📏 Size: ${testRes.headers.get('Content-Length')} bytes`);
    } else {
      console.error(`   ❌ Image not accessible: ${testRes.status} ${testRes.statusText}`);
      console.log(`   💡 This means the file might not exist on the server`);
      console.log(`   💡 Or the static file serving isn't configured correctly`);
    }
  } catch (err) {
    console.error(`   ❌ Error accessing image: ${err.message}`);
  }
  
  // Test 4: Check backend health
  console.log('\n\n3️⃣ Checking backend health...');
  try {
    const healthRes = await fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/health');
    const healthData = await healthRes.json();
    console.log(`   ✅ Backend is online: ${healthData.status}`);
  } catch (err) {
    console.error(`   ❌ Backend health check failed: ${err.message}`);
  }
  
  console.log('\n========================');
  console.log('✅ Test complete!');
  console.log('\n💡 If images are not accessible:');
  console.log('   1. Check Render logs for upload errors');
  console.log('   2. Verify static file serving is configured');
  console.log('   3. Check if files exist in uploads/gallery/ directory');
  console.log('   4. Remember: Render free tier loses files on redeploy!');
})();

