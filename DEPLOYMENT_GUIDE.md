# 🚀 Holy Cross Convent School - Deployment Guide

## **Deployment Strategy**

### **Frontend → Vercel** ✅
- **Free hosting with global CDN**
- **Automatic deployments from GitHub**
- **Perfect for React applications**

### **Backend → Railway** ✅
- **Free tier with database**
- **Easy deployment from GitHub**
- **Automatic HTTPS**

## **Step-by-Step Deployment**

### **1. Deploy Frontend to Vercel**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - **Root Directory**: Set to `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

3. **Set Environment Variables in Vercel:**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   GENERATE_SOURCEMAP=false
   ```

### **2. Deploy Backend to Railway**

1. **Prepare Backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - **Root Directory**: Set to `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

3. **Setup Database:**
   - Railway will automatically create a PostgreSQL database
   - Run migrations: `npx prisma migrate deploy`

### **3. Update Frontend API URL**

1. **Get Backend URL from Railway**
2. **Update Vercel Environment Variables:**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Update `REACT_APP_API_URL` with your Railway URL

## **Alternative Backend Options**

### **Render.com** (Alternative to Railway)
- Similar free tier
- Easy PostgreSQL setup
- Good performance

### **Heroku** (If you have credits)
- More expensive but reliable
- Easy deployment

## **Post-Deployment Checklist**

- [ ] Frontend loads without errors
- [ ] Backend API responds
- [ ] Database connection works
- [ ] Admin login functions
- [ ] File uploads work
- [ ] All pages load correctly

## **Custom Domain Setup**

### **Vercel Domain:**
1. Go to Vercel Dashboard
2. Project Settings → Domains
3. Add your domain
4. Update DNS records

### **SSL Certificate:**
- Automatically provided by Vercel and Railway
- HTTPS enabled by default

## **Monitoring & Analytics**

### **Vercel Analytics:**
- Built-in performance monitoring
- Real user metrics
- Error tracking

### **Railway Metrics:**
- Resource usage monitoring
- Log viewing
- Performance metrics

## **Backup Strategy**

1. **Database Backups:**
   - Railway provides automatic backups
   - Export data regularly

2. **Code Backups:**
   - GitHub repository
   - Regular commits

## **Support & Maintenance**

- **Vercel**: Excellent documentation and support
- **Railway**: Good community support
- **Both platforms**: Automatic updates and security patches

## **Costs**

### **Free Tier Limits:**
- **Vercel**: 100GB bandwidth/month
- **Railway**: $5 credit monthly (usually enough for small sites)

### **Scaling:**
- Both platforms scale automatically
- Pay only for what you use