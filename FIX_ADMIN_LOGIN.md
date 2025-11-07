# 🔧 Fix Admin Login Issue

## 🚨 Current Issue
Admin login is attempting but then failing.

## 🔍 Possible Causes

1. **No admin user exists in database** (Most likely)
2. **Wrong credentials**
3. **JWT_SECRET not set**
4. **Database connection issue**
5. **CORS issue**

---

## ✅ Solution 1: Create Admin User via Setup Endpoint

### Step 1: Check if Setup is Needed

Open your browser console on your Vercel site and run:

```javascript
fetch('https://your-backend.onrender.com/api/auth/check-setup')
  .then(res => res.json())
  .then(data => {
    console.log('Setup status:', data);
    if (data.data.needsSetup) {
      console.log('⚠️ No admin user exists. Need to create one.');
    }
  });
```

### Step 2: Create Admin User

If setup is needed, run this in browser console:

```javascript
fetch('https://your-backend.onrender.com/api/auth/setup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@holycross.co.za',
    password: 'admin123',
    name: 'System Administrator'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Admin user created:', data);
  if (data.success) {
    console.log('📧 Email:', data.data.user.email);
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change password after first login!');
  }
})
.catch(err => {
  console.error('❌ Error:', err);
  err.json().then(data => console.error('Error details:', data));
});
```

### Step 3: Login with Created Credentials

- **Email:** `admin@holycross.co.za`
- **Password:** `admin123`

**⚠️ Important:** Change the password after first login!

---

## ✅ Solution 2: Check Render Logs

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service
3. Go to "Logs" tab
4. Look for login attempts - you should see:
   - `🔍 Login attempt: { email: '...', hasPassword: true }`
   - `❌ Login failed: User not found for email: ...` OR
   - `❌ Login failed: Invalid password for email: ...` OR
   - `✅ Login successful for user: ...`

This will tell you exactly what's wrong.

---

## ✅ Solution 3: Verify Environment Variables

### Check JWT_SECRET

1. Go to Render Dashboard → Your Backend Service
2. Go to "Environment" tab
3. Check if `JWT_SECRET` is set
4. If not, add it:
   - Key: `JWT_SECRET`
   - Value: A long random string (e.g., generate one online)

### Check DATABASE_URL

1. Verify `DATABASE_URL` is set correctly
2. Should start with `postgresql://` or `postgres://`
3. Should be the Internal Database URL from your PostgreSQL service

---

## ✅ Solution 4: Test Login Endpoint Directly

Test the login endpoint directly to see the exact error:

```javascript
// Run in browser console
fetch('https://your-backend.onrender.com/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@holycross.co.za',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Login response:', data);
  if (data.success) {
    console.log('✅ Login successful!');
    console.log('Token:', data.data.token);
  } else {
    console.error('❌ Login failed:', data.error, data.message);
  }
})
.catch(err => {
  console.error('❌ Network error:', err);
});
```

---

## 🔍 Debugging Steps

### 1. Check Browser Console
- Open DevTools (F12)
- Go to Console tab
- Look for error messages
- Check Network tab for failed requests

### 2. Check Network Request
- Open DevTools → Network tab
- Try to login
- Click on the `/auth/login` request
- Check:
  - Request payload (email/password sent)
  - Response status code
  - Response body (error message)

### 3. Check Backend Logs
- Go to Render Dashboard
- Check logs for:
  - `🔍 Login attempt:`
  - `❌ Login failed:`
  - `✅ Login successful:`

---

## 📋 Common Error Messages

### "No admin user found"
**Solution:** Create admin user using `/api/auth/setup` endpoint

### "Invalid credentials"
**Solution:** 
- Check email is correct
- Check password is correct
- Verify user exists in database

### "Account inactive"
**Solution:** User exists but `isActive` is false. Update in database.

### "Network error" or CORS error
**Solution:** 
- Check backend URL is correct
- Check CORS is configured
- Check backend is running

---

## 🚀 Quick Fix Script

Run this in your browser console on your Vercel site:

```javascript
(async () => {
  const API_URL = 'https://your-backend.onrender.com/api';
  
  // 1. Check setup status
  console.log('1️⃣ Checking setup status...');
  const setupCheck = await fetch(`${API_URL}/auth/check-setup`);
  const setupData = await setupCheck.json();
  console.log('Setup status:', setupData);
  
  if (setupData.data.needsSetup) {
    console.log('2️⃣ Creating admin user...');
    const setup = await fetch(`${API_URL}/auth/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@holycross.co.za',
        password: 'admin123',
        name: 'System Administrator'
      })
    });
    const setupResult = await setup.json();
    console.log('Setup result:', setupResult);
    
    if (setupResult.success) {
      console.log('✅ Admin user created!');
      console.log('📧 Email: admin@holycross.co.za');
      console.log('🔑 Password: admin123');
    }
  } else {
    console.log('✅ Admin user already exists');
  }
  
  // 3. Test login
  console.log('3️⃣ Testing login...');
  const login = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@holycross.co.za',
      password: 'admin123'
    })
  });
  const loginResult = await login.json();
  console.log('Login result:', loginResult);
  
  if (loginResult.success) {
    console.log('✅ Login successful!');
    console.log('Token:', loginResult.data.token);
  } else {
    console.error('❌ Login failed:', loginResult.error, loginResult.message);
  }
})();
```

**Remember to replace `your-backend.onrender.com` with your actual backend URL!**

---

## ✅ After Fixing

1. **Login should work** with the created credentials
2. **Change password** after first login
3. **Check Render logs** to verify login is working
4. **Test all admin features** to ensure everything works

---

## 📞 Still Having Issues?

1. Check Render logs for detailed error messages
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Test the endpoints directly using the scripts above
5. Check database connection is working

