# 🌱 Seed Database with Staff Members

## ✅ Quick Solution: Add Staff via Admin Panel

1. **Log in to Admin Panel:**
   - Go to your Vercel site
   - Navigate to admin login
   - Log in with your credentials

2. **Add Staff Members:**
   - Go to Staff Management
   - Click "Add Staff Member"
   - Fill in details and upload images
   - Save

---

## 🚀 Alternative: Run Seed Script Locally

If you want to quickly add sample staff data:

### **Step 1: Get Database URL from Render**

1. Go to Render Dashboard → PostgreSQL Database
2. Click **"Info"** tab
3. Copy the **Internal Database URL** or **External Connection String**

### **Step 2: Set Environment Variable Locally**

```bash
export DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

### **Step 3: Run Seed Script**

```bash
cd backend
npm run seed:remote
```

Or if you want to use the local seed script:

```bash
cd backend
# Make sure DATABASE_URL is set
npm run prisma:generate:prod
npx ts-node src/scripts/seed.ts
```

### **Step 4: Verify**

Test the API again:
```javascript
fetch('https://holy-cross-convent-school-brooklyn.onrender.com/api/staff')
  .then(res => res.json())
  .then(data => console.log('Staff Count:', data.data?.staff?.length));
```

---

## 📋 What the Seed Script Creates

The seed script (`backend/src/scripts/seed.ts`) creates:
- ✅ Admin user (if doesn't exist)
- ✅ Sample staff members (Principal, Deputy Principal, Teachers, etc.)

**Note:** The seed script creates sample data. You'll still need to:
- Upload actual staff photos
- Update staff information to match your real staff
- Add any missing staff members

---

## ⚠️ Important Notes

1. **Images:** The seed script doesn't upload images. You'll need to add images via admin panel.

2. **Ephemeral Storage:** On Render's free plan, uploaded images are lost on redeploy. Consider:
   - Using external storage (Cloudinary, S3)
   - Re-uploading images after deployments
   - Upgrading to paid plan with persistent disk

3. **Data Safety:** The seed script uses `upsert` for admin user (won't duplicate), but creates new staff members each time. Run it once, then use admin panel for updates.

---

**After seeding, your staff page should show staff members!** 🎯

