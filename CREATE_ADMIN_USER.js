// 🔐 Create Admin User Script
// Copy and paste this entire script into your browser console on your Vercel site
// This will create an admin user if one doesn't exist

(async () => {
  const API_URL = 'https://holy-cross-convent-school-brooklyn.onrender.com/api';
  
  console.log('🔐 Admin User Setup Script');
  console.log('==========================\n');
  
  try {
    // Step 1: Check if setup is needed
    console.log('1️⃣ Checking if admin user exists...');
    const setupCheck = await fetch(`${API_URL}/auth/check-setup`);
    const setupData = await setupCheck.json();
    
    console.log('   Response:', setupData);
    
    if (setupData.data.needsSetup) {
      console.log('   ⚠️  No admin user found. Creating one now...\n');
      
      // Step 2: Create admin user
      console.log('2️⃣ Creating admin user...');
      const setupResponse = await fetch(`${API_URL}/auth/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@holycross.co.za',
          password: 'admin123',
          name: 'System Administrator'
        })
      });
      
      const setupResult = await setupResponse.json();
      
      if (setupResult.success) {
        console.log('   ✅ Admin user created successfully!\n');
        console.log('   📧 Email: admin@holycross.co.za');
        console.log('   🔑 Password: admin123');
        console.log('   👤 Role: SUPER_ADMIN');
        console.log('   ⚠️  IMPORTANT: Change password after first login!\n');
        
        // Step 3: Test login
        console.log('3️⃣ Testing login with new credentials...');
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'admin@holycross.co.za',
            password: 'admin123'
          })
        });
        
        const loginResult = await loginResponse.json();
        
        if (loginResult.success) {
          console.log('   ✅ Login test successful!');
          console.log('   🎉 You can now log in to the admin panel!');
          console.log('   🔗 Token received:', loginResult.data.token.substring(0, 20) + '...');
        } else {
          console.error('   ❌ Login test failed:', loginResult.error, loginResult.message);
        }
      } else {
        console.error('   ❌ Failed to create admin user:', setupResult.error, setupResult.message);
      }
    } else {
      console.log('   ✅ Admin user already exists!');
      console.log('   📊 Total users:', setupData.data.userCount);
      console.log('   💡 If you forgot your password, you may need to reset it in the database.\n');
      
      // Try to login with default credentials
      console.log('3️⃣ Testing login with default credentials...');
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@holycross.co.za',
          password: 'admin123'
        })
      });
      
      const loginResult = await loginResponse.json();
      
      if (loginResult.success) {
        console.log('   ✅ Login successful with default credentials!');
        console.log('   🎉 You can log in to the admin panel!');
      } else {
        console.log('   ❌ Login failed:', loginResult.error, loginResult.message);
        console.log('   💡 The password may have been changed. Try your actual password.');
      }
    }
    
    console.log('\n==========================');
    console.log('✅ Script completed!');
    
  } catch (error) {
    console.error('❌ Error running script:', error);
    console.error('   Make sure you are on your Vercel site and the backend is accessible.');
  }
})();

