# 🚀 Deployment & Testing Guide

## Overview
This guide walks you through deploying changes, testing all features, and ensuring everything works before going live.

---

## 📦 How Deployments Work

### Vercel (Frontend)
- **Auto-deploys** when you push to `main` branch
- **Manual deploy** available in Vercel dashboard
- **Preview deployments** for pull requests
- **Build logs** show in Vercel dashboard

### Render (Backend)
- **Auto-deploys** when you push to `main` branch (if connected to GitHub)
- **Manual deploy** available in Render dashboard
- **Build logs** show in Render dashboard
- **Free tier** spins down after 15 minutes of inactivity

---

## 🔄 Pushing Changes to Trigger Redeploy

### Step 1: Stage Your Changes
```bash
# Add all modified files
git add .

# Or add specific files
git add backend/src/routes/staff.ts
git add backend/src/services/keepAliveService.ts
```

### Step 2: Commit Changes
```bash
git commit -m "Fix staff upload functionality and add database keep-alive service"
```

### Step 3: Push to GitHub
```bash
git push origin main
```

### Step 4: Monitor Deployments

**Vercel:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Watch the deployment build
4. Wait for "Ready" status

**Render:**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service
3. Go to "Events" tab
4. Watch the deployment
5. Wait for "Live" status

---

## 🗄️ Database Keep-Alive Service

### What It Does
The keep-alive service prevents Render's free tier from sleeping by:
- Pinging the database every 5 minutes
- Pinging the health endpoint every 5 minutes
- Keeping both services active

### How It Works
1. Service starts automatically in production
2. Runs every 5 minutes
3. Executes lightweight database query
4. Calls health endpoint to keep web service awake

### Verification
After deployment, check Render logs for:
```
🔄 Starting keep-alive service...
✅ Keep-alive service started
🔔 Keep-alive ping at [timestamp]
✅ Keep-alive ping successful
```

---

## 🧪 Testing Workflow

### Phase 1: Quick Smoke Tests (5 minutes)
1. **Frontend loads:** Visit your Vercel URL
2. **Backend responds:** Check `/api/health` endpoint
3. **Staff page loads:** Visit staff page
4. **Admin login works:** Try logging in

### Phase 2: Feature Testing (30 minutes)
Follow the [Pre-Launch Testing Checklist](./PRE_LIVE_TESTING_CHECKLIST.md)

**Priority Features:**
1. ✅ Staff image upload
2. ✅ Application form submission
3. ✅ Admin authentication
4. ✅ Calendar/Events display
5. ✅ Gallery display
6. ✅ Documents download

### Phase 3: Integration Testing (15 minutes)
1. **End-to-end workflows:**
   - Create staff member → Upload image → View on public page
   - Submit application → View in admin panel → Update status
   - Create event → View on calendar → View details

2. **Cross-browser testing:**
   - Chrome
   - Firefox
   - Safari
   - Mobile browsers

### Phase 4: Performance Testing (10 minutes)
1. **Page load times:** Should be < 3 seconds
2. **Image loading:** Should be fast with thumbnails
3. **API response times:** Should be < 1 second
4. **Mobile performance:** Test on actual device

---

## 🔍 Testing Each Feature

### Staff Image Upload
1. **Login as admin**
2. **Go to Staff Upload page**
3. **Select a staff member**
4. **Upload an image:**
   - Choose file (JPEG, PNG, or WebP)
   - File size < 5MB
   - Click upload
5. **Verify:**
   - Success message appears
   - Image updates immediately
   - Image displays on public staff page

**Common Issues:**
- ❌ "No image file provided" → Check file input
- ❌ "File too large" → Reduce file size
- ❌ "Upload failed" → Check backend logs

### Application Form
1. **Go to Admissions page**
2. **Fill out application form:**
   - All required fields
   - Upload documents
   - Submit
3. **Verify:**
   - Success message appears
   - Application saved in admin panel
   - Documents are accessible

**Common Issues:**
- ❌ Form validation errors → Check required fields
- ❌ Document upload fails → Check file type/size
- ❌ Submission fails → Check backend connection

### Calendar & Events
1. **View calendar page**
2. **Verify:**
   - Events display correctly
   - Dates are accurate
   - Can view event details
3. **Admin:**
   - Create new event
   - Update event
   - Delete event

**Common Issues:**
- ❌ Events not showing → Check database
- ❌ Dates wrong → Check timezone settings
- ❌ Can't create event → Check admin permissions

### Gallery
1. **View gallery page**
2. **Verify:**
   - Images load correctly
   - Can filter by category
   - Can view full-size images
3. **Admin:**
   - Upload new images
   - Organize into albums
   - Delete images

**Common Issues:**
- ❌ Images not loading → Check file paths
- ❌ Slow loading → Check image optimization
- ❌ Upload fails → Check file size/type

---

## 🐛 Debugging Issues

### Frontend Issues

**Check Browser Console:**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Check Network tab for failed requests

**Common Errors:**
- `CORS error` → Backend CORS not configured
- `401 Unauthorized` → Token expired or invalid
- `404 Not Found` → API endpoint doesn't exist
- `500 Internal Server Error` → Backend error

### Backend Issues

**Check Render Logs:**
1. Go to Render dashboard
2. Click on backend service
3. Go to "Logs" tab
4. Look for error messages

**Common Errors:**
- `Database connection failed` → Check DATABASE_URL
- `Prisma client not generated` → Run `npm run prisma:generate`
- `File upload failed` → Check upload directory permissions

### Database Issues

**Check Database Connection:**
1. Go to Render dashboard
2. Click on PostgreSQL service
3. Check "Status" (should be "Available")
4. Verify DATABASE_URL in backend environment variables

**Common Issues:**
- ❌ Database sleeping → Keep-alive service should prevent this
- ❌ Connection timeout → Check network settings
- ❌ Migration errors → Run migrations manually

---

## ✅ Pre-Launch Checklist

Before going live, ensure:

### Technical
- [ ] All features tested and working
- [ ] No critical bugs
- [ ] Performance is acceptable
- [ ] Security measures in place
- [ ] Database keep-alive is running
- [ ] Error handling works
- [ ] Logging is configured

### Content
- [ ] Initial data is seeded
- [ ] Staff members have images
- [ ] Sample events are created
- [ ] Sample announcements are posted
- [ ] Gallery has sample images
- [ ] Documents are uploaded

### Admin
- [ ] Admin account is created
- [ ] Admin can log in
- [ ] Admin can access all features
- [ ] Admin can upload files
- [ ] Admin can manage content

### Monitoring
- [ ] Error tracking set up
- [ ] Uptime monitoring configured
- [ ] Log aggregation working
- [ ] Alerts configured (optional)

---

## 🚀 Going Live

### Final Steps
1. **Review all test results**
2. **Fix any critical issues**
3. **Double-check environment variables**
4. **Verify database is seeded**
5. **Test admin login**
6. **Do final smoke test**
7. **Announce launch!**

### Post-Launch
1. **Monitor error logs** for first 24 hours
2. **Check user feedback**
3. **Monitor performance**
4. **Fix any issues quickly**
5. **Celebrate! 🎉**

---

## 📞 Support Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)

### Debugging Tools
- Browser DevTools (F12)
- Render Logs
- Vercel Logs
- Network tab in browser

### Getting Help
- Check error messages carefully
- Review logs for clues
- Test in isolation
- Check environment variables
- Verify database connection

---

## 🎯 Moving Forward

### Regular Maintenance
1. **Weekly:** Review error logs
2. **Monthly:** Update dependencies
3. **Quarterly:** Review performance
4. **As needed:** Add new features

### Scaling Considerations
- Monitor database size
- Watch API usage
- Consider upgrading Render plan if needed
- Optimize images and assets
- Cache frequently accessed data

### Feature Additions
- Test thoroughly before deploying
- Use feature flags for gradual rollouts
- Monitor impact of new features
- Get user feedback

---

**Remember:** Test thoroughly, deploy confidently, monitor closely! 🚀







