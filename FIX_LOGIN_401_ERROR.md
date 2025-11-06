# 🔧 Fix Login 401 Error

## 🚨 Current Issue

Getting `401 Unauthorized` when trying to log in.

**Most Likely Cause:** No admin user exists in the database yet.

---

## ✅ Solution 1: Create Admin User via Seed Script (Recommended)

### **Step 1: Get Database URL from Render**

1. Go to Render Dashboard → PostgreSQL Database
2. Click **"Info"** tab
3. Copy the **Internal Database URL** or **External Connection String**

### **Step 2: Run Seed Script Locally**

```bash
cd backend

# Set database URL
export DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Generate Prisma client
npm run prisma:generate:prod

# Run seed script (creates admin user)
npm run seed:remote
```

**Or use the createAdmin script:**

```bash
# Set database URL
export DATABASE_URL="your-render-database-url"

# Run createAdmin script
npx ts-node src/scripts/createAdmin.ts
```

### **Step 3: Default Admin Credentials**

After running the seed script, you can log in with:

- **Email:** `admin@holycross.co.za`
- **Password:** `admin123`

**⚠️ Important:** Change the password after first login!

---

## ✅ Solution 2: Create Admin via API (If You Have Access)

If you can't run scripts locally, you can create an admin user via the API:

### **Step 1: Register Admin User**

```javascript
// Run this in browser console on your Vercel site
fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@holycross.co.za',
    password: 'your-secure-password',
    name: 'System Administrator',
    role: 'ADMIN'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Admin user created:', data);
})
.catch(err => console.error('❌ Error:', err));
```

**Note:** This only works if the `/register` endpoint is public. If it's protected, use Solution 1.

---

## ✅ Solution 3: Check Existing Users

First, verify if any users exist:

```javascript
// Test if you can query users (this might require auth, so may not work)
fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/auth/me')
  .then(res => res.json())
  .then(data => console.log('Current user:', data))
  .catch(err => console.log('No user logged in'));
```

---

## 🔍 Troubleshooting

### **Error: "Invalid credentials"**
- ✅ User exists but password is wrong
- **Fix:** Use correct password or reset it

### **Error: "User inactive"**
- ✅ User exists but `isActive` is `false`
- **Fix:** Update user in database to set `isActive = true`

### **Error: "User not found"**
- ✅ No user exists with that email
- **Fix:** Create admin user using Solution 1 or 2

### **Error: CORS or Network Error**
- ✅ Backend not accessible
- **Fix:** Check backend is running and CORS is configured

---

## 📋 Quick Checklist

- [ ] Database is connected (✅ confirmed)
- [ ] Admin user exists in database (❌ likely missing)
- [ ] Using correct email/password
- [ ] User is active (`isActive = true`)
- [ ] Backend is running
- [ ] CORS is configured correctly

---

## 🚀 After Creating Admin User

1. **Log in with:**
   - Email: `admin@holycross.co.za`
   - Password: `admin123` (or the password you set)

2. **Change password immediately** after first login

3. **Add staff members** via admin panel

---

**The 401 error should be resolved once you create an admin user!** 🎯

