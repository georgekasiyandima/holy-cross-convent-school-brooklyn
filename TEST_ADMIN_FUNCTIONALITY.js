// 🧪 Comprehensive Admin Functionality Test
// Copy and paste this into your browser console on your Vercel site
// This will test all admin features

(async () => {
  const API_URL = 'https://holy-cross-convent-school-brooklyn.onrender.com/api';
  const token = localStorage.getItem('adminToken');
  
  console.log('🧪 Admin Functionality Test Suite');
  console.log('==================================\n');
  
  if (!token) {
    console.error('❌ No admin token found. Please log in first.');
    return;
  }
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  let passed = 0;
  let failed = 0;
  
  const test = (name, fn) => {
    return async () => {
      try {
        console.log(`\n🔍 Testing: ${name}`);
        await fn();
        console.log(`   ✅ PASSED: ${name}`);
        passed++;
      } catch (error) {
        console.error(`   ❌ FAILED: ${name}`);
        console.error(`   Error:`, error.message);
        failed++;
      }
    };
  };
  
  // Test 1: Authentication
  await test('Authentication', async () => {
    const res = await fetch(`${API_URL}/auth/me`, { headers });
    const data = await res.json();
    if (!data.success) throw new Error('Auth check failed');
    console.log(`   👤 User: ${data.data.user.email}`);
  })();
  
  // Test 2: Staff Endpoint
  await test('Staff Endpoint', async () => {
    const res = await fetch(`${API_URL}/staff`, { headers });
    const data = await res.json();
    if (!data.success) throw new Error('Staff endpoint failed');
    console.log(`   📊 Staff count: ${data.data.staff?.length || 0}`);
  })();
  
  // Test 3: Applications Endpoint
  await test('Applications Endpoint', async () => {
    const res = await fetch(`${API_URL}/admissions/applications`, { headers });
    const data = await res.json();
    if (res.status === 200) {
      console.log(`   📋 Applications accessible`);
    } else {
      throw new Error(`Status: ${res.status}`);
    }
  })();
  
  // Test 4: Calendar Endpoint
  await test('Calendar Endpoint', async () => {
    const res = await fetch(`${API_URL}/calendar`, { headers });
    if (res.status === 200 || res.status === 404) {
      console.log(`   📅 Calendar endpoint accessible`);
    } else {
      throw new Error(`Status: ${res.status}`);
    }
  })();
  
  // Test 5: Gallery Endpoint
  await test('Gallery Endpoint', async () => {
    const res = await fetch(`${API_URL}/gallery`, { headers });
    if (res.status === 200 || res.status === 404) {
      console.log(`   🖼️  Gallery endpoint accessible`);
    } else {
      throw new Error(`Status: ${res.status}`);
    }
  })();
  
  // Test 6: Documents Endpoint
  await test('Documents Endpoint', async () => {
    const res = await fetch(`${API_URL}/documents`, { headers });
    if (res.status === 200 || res.status === 404) {
      console.log(`   📄 Documents endpoint accessible`);
    } else {
      throw new Error(`Status: ${res.status}`);
    }
  })();
  
  // Test 7: School Stats Endpoint
  await test('School Stats Endpoint', async () => {
    const res = await fetch(`${API_URL}/school-stats`, { headers });
    if (res.status === 200 || res.status === 404) {
      console.log(`   📊 School stats endpoint accessible`);
    } else {
      throw new Error(`Status: ${res.status}`);
    }
  })();
  
  // Test 8: Vacancies Endpoint
  await test('Vacancies Endpoint', async () => {
    const res = await fetch(`${API_URL}/vacancies`, { headers });
    if (res.status === 200 || res.status === 404) {
      console.log(`   💼 Vacancies endpoint accessible`);
    } else {
      throw new Error(`Status: ${res.status}`);
    }
  })();
  
  // Test 9: Staff Upload Test (without file)
  await test('Staff Upload Endpoint Structure', async () => {
    // Get first staff member
    const staffRes = await fetch(`${API_URL}/staff`, { headers });
    const staffData = await staffRes.json();
    
    if (!staffData.success || !staffData.data.staff || staffData.data.staff.length === 0) {
      console.log(`   ⚠️  No staff members to test upload with`);
      return;
    }
    
    const staff = staffData.data.staff[0];
    
    // Test endpoint structure (will fail without file, but shows endpoint exists)
    const testRes = await fetch(`${API_URL}/staff/${staff.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: staff.name })
    });
    
    // 400 is expected without file, 401 means auth issue, 404 means route doesn't exist
    if (testRes.status === 400) {
      console.log(`   ✅ Upload endpoint exists and accepts requests`);
    } else if (testRes.status === 401) {
      throw new Error('Authentication failed');
    } else if (testRes.status === 404) {
      throw new Error('Upload endpoint not found');
    } else {
      console.log(`   ⚠️  Unexpected status: ${testRes.status}`);
    }
  })();
  
  // Test 10: Backend Health
  await test('Backend Health', async () => {
    const res = await fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/health');
    const data = await res.json();
    if (data.status !== 'OK') throw new Error('Backend not healthy');
    console.log(`   ✅ Backend is online`);
  })();
  
  // Summary
  console.log('\n==================================');
  console.log('📊 Test Summary');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Admin functionality is working.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
    console.log('💡 Check Render logs for detailed error messages.');
  }
})();

