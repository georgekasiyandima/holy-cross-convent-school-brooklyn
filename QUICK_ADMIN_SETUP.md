# 🔐 Quick Admin User Setup

## Your Backend URL
**https://holy-cross-convent-school-brooklyn.onrender.com**

---

## 🚀 Quick Setup (Copy & Paste)

### Step 1: Open Your Vercel Site
Go to your Vercel site (the frontend)

### Step 2: Open Browser Console
- Press `F12` or `Right-click → Inspect`
- Go to the **Console** tab

### Step 3: Copy & Paste This Script

```javascript
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
```

### Step 4: Press Enter
The script will:
1. ✅ Check if admin user exists
2. ✅ Create admin user if needed
3. ✅ Test login with the new credentials

---

## 📋 Default Credentials

After running the script, you can log in with:

- **Email:** `admin@holycross.co.za`
- **Password:** `admin123`

**⚠️ IMPORTANT:** Change the password after first login!

---

## 🔍 What the Script Does

1. **Checks Setup Status**
   - Calls `/api/auth/check-setup`
   - Determines if admin user exists

2. **Creates Admin User** (if needed)
   - Calls `/api/auth/setup`
   - Creates user with email: `admin@holycross.co.za`
   - Sets password: `admin123`
   - Role: `SUPER_ADMIN`

3. **Tests Login**
   - Attempts login with created credentials
   - Verifies everything works

---

## ✅ Success Output

You should see:
```
🔐 Admin User Setup Script
==========================

1️⃣ Checking if admin user exists...
   Response: { success: true, data: { needsSetup: true, userCount: 0 } }
   ⚠️  No admin user found. Creating one now...

2️⃣ Creating admin user...
   ✅ Admin user created successfully!

   📧 Email: admin@holycross.co.za
   🔑 Password: admin123
   👤 Role: SUPER_ADMIN
   ⚠️  IMPORTANT: Change password after first login!

3️⃣ Testing login with new credentials...
   ✅ Login test successful!
   🎉 You can now log in to the admin panel!
   🔗 Token received: eyJhbGciOiJIUzI1NiIs...

==========================
✅ Script completed!
```

---

## ❌ Troubleshooting

### Error: "Setup already completed"
- Admin user already exists
- Try logging in with the default credentials
- If password was changed, you'll need to reset it

### Error: Network error
- Check backend is running: https://holy-cross-convent-school-brooklyn.onrender.com/api/health
- Check CORS is configured
- Make sure you're running the script on your Vercel site

### Error: "User already exists"
- Admin user exists but setup endpoint was called
- Just try logging in with the credentials

---

## 🎯 After Setup

1. **Go to Admin Login Page**
   - Navigate to `/admin/login` on your Vercel site

2. **Log In**
   - Email: `admin@holycross.co.za`
   - Password: `admin123`

3. **Change Password**
   - After logging in, change your password immediately

4. **Test Features**
   - Upload staff images
   - Create events
   - Manage content

---

## 📞 Need Help?

If the script doesn't work:
1. Check browser console for errors
2. Check Render logs: https://dashboard.render.com
3. Verify backend is accessible: https://holy-cross-convent-school-brooklyn.onrender.com/api/health
4. Check the [FIX_ADMIN_LOGIN.md](./FIX_ADMIN_LOGIN.md) guide for more troubleshooting

---

**Ready to go!** Just copy the script above and paste it into your browser console! 🚀

