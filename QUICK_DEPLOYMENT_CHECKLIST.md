# ✅ Quick Deployment Checklist

## 🎯 Goal: Get Changes Visible on Vercel + Deploy Backend

---

## STEP 1: Commit & Push Changes (5 minutes)

### Option A: Use the Script (Easiest)
```bash
./DEPLOY_NOW.sh
```

### Option B: Manual Commands
```bash
# Stage all changes
git add .

# Commit
git commit -m "Update website: Fix Info page images, Donate currency, History page enhancements"

# Push (triggers Vercel auto-deployment)
git push origin main
```

✅ **Expected Result**: Vercel will automatically start deploying in 2-3 minutes

---

## STEP 2: Verify Vercel Deployment (2 minutes)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Check **Deployments** tab
4. Look for:
   - ✅ Green checkmark = Success
   - ❌ Red X = Error (check logs)
   - 🟡 Yellow circle = Building

5. Once deployed, click on the deployment
6. Copy the production URL
7. **Test**: Visit the URL and hard refresh (Cmd+Shift+R)

---

## STEP 3: Deploy Backend (15-20 minutes)

### Choose Platform:

#### 🚂 Railway (Recommended - Easier)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Select repository
5. **Root Directory**: `backend`
6. Add PostgreSQL database
7. Set environment variables (see COMPLETE_DEPLOYMENT_GUIDE.md)
8. Deploy!

#### 🎨 Render (Alternative)
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. New → Web Service
4. Connect repository
5. **Root Directory**: `backend`
6. **Build Command**: `npm install && npm run build && npm run prisma:generate && npm run prisma:deploy`
7. **Start Command**: `npm start`
8. Add PostgreSQL database
9. Set environment variables
10. Deploy!

---

## STEP 4: Connect Frontend to Backend (5 minutes)

1. Get your backend URL (e.g., `https://your-app.railway.app`)
2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
3. Add/Update:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
4. **Redeploy** frontend (Vercel will auto-redeploy, or manually trigger)

---

## STEP 5: Test Everything (10 minutes)

### Frontend Tests:
- [ ] Website loads
- [ ] All pages accessible
- [ ] Images display
- [ ] Forms work
- [ ] Admin login works

### Backend Tests:
- [ ] Health check: `https://your-backend/api/health`
- [ ] API endpoints respond
- [ ] Database connected

### Integration Tests:
- [ ] Frontend can fetch data from backend
- [ ] API calls work (check browser console)
- [ ] No CORS errors

---

## STEP 6: Share with School (1 minute)

Send them:
- **Production URL**: `https://your-app.vercel.app`
- **Note**: "This URL will automatically update when we push changes"

---

## 🐛 Common Issues & Quick Fixes

### Issue: Changes Not Showing
**Fix**: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R) or clear cache

### Issue: Vercel Build Fails
**Fix**: Check build logs in Vercel dashboard, verify `package.json` has correct scripts

### Issue: Backend Not Deploying
**Fix**: Check Railway/Render logs, verify environment variables are set

### Issue: Frontend Can't Connect to Backend
**Fix**: 
1. Verify `REACT_APP_API_URL` in Vercel matches backend URL
2. Check CORS settings in backend
3. Ensure backend is running (check health endpoint)

---

## 📞 Need Help?

1. Check **COMPLETE_DEPLOYMENT_GUIDE.md** for detailed instructions
2. Check deployment logs in Vercel/Railway/Render dashboards
3. Verify environment variables are set correctly

---

**Time Estimate**: ~30-45 minutes total
**Difficulty**: ⭐⭐⭐ (Moderate)

🎉 **You're done!** The school can now see updates in real-time.

