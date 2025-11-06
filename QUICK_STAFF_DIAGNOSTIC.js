// 🔍 Quick Staff Images Diagnostic
// Copy and paste this into your browser console on your Vercel site

(async () => {
  console.log('🔍 Starting Staff Images Diagnostic...\n');
  
  try {
    // 1. Test API
    console.log('1️⃣ Testing Staff API...');
    const res = await fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/staff');
    
    if (!res.ok) {
      console.error(`❌ API Error: ${res.status} ${res.statusText}`);
      return;
    }
    
    const data = await res.json();
    console.log('✅ API Response:', data);
    
    const staff = data.data?.staff || [];
    console.log(`\n2️⃣ Staff Count: ${staff.length}`);
    
    if (staff.length === 0) {
      console.log('❌ PROBLEM: No staff data in database!');
      console.log('✅ SOLUTION: Add staff members via admin panel');
      return;
    }
    
    // 3. Check first staff member
    const firstStaff = staff[0];
    console.log('\n3️⃣ First Staff Member:', {
      name: firstStaff.name,
      role: firstStaff.role,
      hasImageUrl: !!firstStaff.imageUrl,
      imageUrl: firstStaff.imageUrl
    });
    
    if (!firstStaff.imageUrl) {
      console.log('❌ PROBLEM: Staff member has no imageUrl');
      console.log('✅ SOLUTION: Upload images via admin panel');
      return;
    }
    
    // 4. Test image URL
    const imageUrl = firstStaff.imageUrl.startsWith('http') 
      ? firstStaff.imageUrl 
      : `https://holy-cross-convent-school-brooklyn.onrender.com${firstStaff.imageUrl}`;
    
    console.log(`\n4️⃣ Testing Image URL: ${imageUrl}`);
    
    const imgRes = await fetch(imageUrl, { method: 'HEAD' });
    if (imgRes.ok) {
      console.log('✅ Image exists and is accessible!');
      console.log('✅ Image size:', imgRes.headers.get('content-length'), 'bytes');
      console.log('✅ Image type:', imgRes.headers.get('content-type'));
    } else {
      console.log(`❌ PROBLEM: Image not found - ${imgRes.status} ${imgRes.statusText}`);
      console.log('✅ SOLUTION: Images were lost (ephemeral storage). Re-upload images via admin panel.');
    }
    
    // 5. Summary
    console.log('\n📊 Summary:');
    const withImages = staff.filter(s => s.imageUrl).length;
    console.log(`   - Total staff: ${staff.length}`);
    console.log(`   - With images: ${withImages}`);
    console.log(`   - Without images: ${staff.length - withImages}`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
})();

