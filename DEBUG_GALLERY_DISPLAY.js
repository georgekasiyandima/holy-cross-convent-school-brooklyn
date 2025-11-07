// 🐛 Debug Gallery Display Issue
// Run this in browser console on the Gallery page

(async () => {
  const API_URL = 'https://holy-cross-convent-school-brooklyn.onrender.com/api';
  
  console.log('🐛 Debugging Gallery Display');
  console.log('============================\n');
  
  // 1. Check what items are being fetched
  console.log('1️⃣ Fetching gallery items...');
  try {
    const res = await fetch(`${API_URL}/gallery?limit=10&isPublished=true`);
    const data = await res.json();
    
    if (data.success && data.data.items) {
      console.log(`   ✅ Found ${data.data.items.length} published items`);
      
      data.data.items.forEach((item, index) => {
        console.log(`\n   Item ${index + 1}:`);
        console.log(`   - ID: ${item.id}`);
        console.log(`   - Title: ${item.title}`);
        console.log(`   - Type: ${item.type}`);
        console.log(`   - FileName: ${item.fileName}`);
        console.log(`   - IsPublished: ${item.isPublished}`);
        console.log(`   - Category: ${item.category}`);
        
        if (item.type === 'IMAGE' && item.fileName) {
          const imageUrl = `https://holy-cross-convent-school-brooklyn.onrender.com/uploads/gallery/${item.fileName}`;
          console.log(`   - Image URL: ${imageUrl}`);
          
          // Test if image is accessible
          fetch(imageUrl, { method: 'HEAD' })
            .then(imgRes => {
              if (imgRes.ok) {
                console.log(`   ✅ Image is accessible`);
              } else {
                console.error(`   ❌ Image not accessible: ${imgRes.status}`);
              }
            })
            .catch(err => {
              console.error(`   ❌ Image access error: ${err.message}`);
            });
        }
      });
    } else {
      console.error('   ❌ No items found or error:', data);
    }
  } catch (err) {
    console.error('   ❌ Error fetching items:', err);
  }
  
  // 2. Check all items (including unpublished)
  console.log('\n\n2️⃣ Fetching ALL items (including unpublished)...');
  try {
    const res = await fetch(`${API_URL}/gallery?limit=10`);
    const data = await res.json();
    
    if (data.success && data.data.items) {
      console.log(`   ✅ Found ${data.data.items.length} total items`);
      
      const published = data.data.items.filter(i => i.isPublished);
      const unpublished = data.data.items.filter(i => !i.isPublished);
      
      console.log(`   📊 Published: ${published.length}`);
      console.log(`   📊 Unpublished: ${unpublished.length}`);
      
      if (unpublished.length > 0) {
        console.log('\n   ⚠️  Unpublished items found:');
        unpublished.forEach(item => {
          console.log(`   - ${item.title} (ID: ${item.id})`);
        });
        console.log('\n   💡 These items won\'t show on the public gallery!');
        console.log('   💡 Make sure to set isPublished: true when uploading.');
      }
    }
  } catch (err) {
    console.error('   ❌ Error:', err);
  }
  
  // 3. Check the latest uploaded item
  console.log('\n\n3️⃣ Checking latest uploaded item...');
  try {
    const res = await fetch(`${API_URL}/gallery?limit=1`);
    const data = await res.json();
    
    if (data.success && data.data.items && data.data.items.length > 0) {
      const latest = data.data.items[0];
      console.log('   Latest item:');
      console.log(`   - Title: ${latest.title}`);
      console.log(`   - IsPublished: ${latest.isPublished}`);
      console.log(`   - FileName: ${latest.fileName}`);
      
      if (!latest.isPublished) {
        console.log('\n   ⚠️  ISSUE FOUND: Latest item is NOT published!');
        console.log('   💡 This is why it\'s not showing in the gallery.');
        console.log('   💡 Solution: Re-upload and make sure "Published" is checked.');
      }
    }
  } catch (err) {
    console.error('   ❌ Error:', err);
  }
  
  console.log('\n============================');
  console.log('✅ Debug complete!');
})();

