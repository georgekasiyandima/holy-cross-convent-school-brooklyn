# Backend Deployment Guide - Railway

## 🚀 Deploying to Railway

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub account

### Step 2: Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `holy-cross-convent-school-brooklyn`
4. **Important**: Select the `backend` folder as the root directory

### Step 3: Configure Environment Variables
In Railway dashboard, add these environment variables:

```bash
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# CORS
FRONTEND_URL="https://your-vercel-app.vercel.app"

# Environment
NODE_ENV="production"
PORT="5000"

# Optional: Email configuration (if you have SMTP)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
```

### Step 4: Database Setup
Railway will automatically:
1. Run `npm install`
2. Run `npm run build`
3. Run `npm run prisma:generate`
4. Run `npm run prisma:deploy`

### Step 5: Get Your Backend URL
1. After deployment, Railway will provide a URL like: `https://your-app-name.railway.app`
2. Copy this URL - you'll need it for the frontend

### Step 6: Update Frontend Environment
In your Vercel dashboard, update the environment variable:
```
REACT_APP_API_URL=https://your-app-name.railway.app
```

## 🔄 Alternative: Render Deployment

If Railway doesn't work, try Render:

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. **Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npm run prisma:generate && npm run prisma:deploy`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

### Step 3: Environment Variables
Add the same environment variables as Railway above.

## 🧪 Testing Your Deployment

After deployment, test these endpoints:
- `GET https://your-backend-url.railway.app/api/health` - Health check
- `GET https://your-backend-url.railway.app/api/staff` - Staff API
- `GET https://your-backend-url.railway.app/api/board` - Board API

## 🔧 Troubleshooting

### Common Issues:
1. **Build Fails**: Check if all dependencies are in `package.json`
2. **Database Errors**: Ensure `DATABASE_URL` is set correctly
3. **CORS Errors**: Update `FRONTEND_URL` to your Vercel domain
4. **Port Issues**: Railway automatically assigns ports, don't hardcode them

### Logs:
- Check Railway/Render logs for detailed error messages
- Use `console.log` for debugging in production

## 📱 Next Steps After Backend Deployment

1. **Update Frontend**: Change `REACT_APP_API_URL` in Vercel
2. **Test Full App**: Verify all API calls work
3. **Monitor**: Set up error tracking (Sentry, etc.)
4. **Backup**: Set up database backups

## 🎯 Expected Results

After successful deployment:
- ✅ Backend API accessible at Railway/Render URL
- ✅ Database working with Prisma
- ✅ Frontend connecting to backend
- ✅ Full application functional
- ✅ School can access live website

Your Holy Cross Convent School website will be fully live and functional! 🎉
