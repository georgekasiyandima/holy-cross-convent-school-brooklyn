# 🔐 Create Admin User via API

## 🚨 Issue

The database is not accessible from your local machine (Render's free plan restricts external connections).

## ✅ Solution: Create Admin via API

Since the `/register` endpoint might be protected, let's create a temporary public registration endpoint or use an alternative method.

---

## 🚀 Method 1: Create Admin via API (If Register is Public)

Run this in your **browser console** on your Vercel site:

```javascript
fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@holycross.co.za',
    password: 'admin123',
    name: 'System Administrator',
    role: 'ADMIN'
  })
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@holycross.co.za');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change password after first login!');
  } else {
    console.error('❌ Error:', data.error || data.message);
  }
})
.catch(err => {
  console.error('❌ Request failed:', err);
  console.log('💡 If this fails, the register endpoint might be protected. Use Method 2.');
});
```

---

## 🚀 Method 2: Temporarily Make Register Public

If Method 1 fails (401/403), we need to temporarily allow public registration. Let me create a quick fix for this.

---

## 🚀 Method 3: Use Render Shell (If Available)

If you have shell access on Render (paid plan), you can run:

```bash
cd backend
npm run prisma:generate:prod
npx ts-node src/scripts/createAdmin.ts
```

---

**Try Method 1 first - it's the quickest!** 🎯

