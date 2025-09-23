# Holy Cross Convent School - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Holy Cross Convent School website to production.

## Prerequisites
- Node.js 18+ installed
- Git repository access
- Domain name (holycrossbrooklyn.edu.za)
- SSL certificate
- Web hosting service

## Production Build

### 1. Build the Application
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build/` directory.

### 2. Test the Build Locally
```bash
npx serve -s build
```

Visit `http://localhost:3000` to verify the build works correctly.

## Deployment Options

### Option 1: Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/build`
4. Configure environment variables if needed
5. Deploy

### Option 2: Vercel
1. Connect your GitHub repository to Vercel
2. Set framework preset to "Create React App"
3. Set root directory to `frontend`
4. Deploy

### Option 3: Traditional Web Hosting
1. Upload the contents of `frontend/build/` to your web server
2. Configure your web server to serve `index.html` for all routes
3. Set up URL rewriting for React Router

## Domain Configuration

### 1. DNS Settings
Configure your domain's DNS to point to your hosting provider:
- A record: Point to your server IP
- CNAME: www.holycrossbrooklyn.edu.za → holycrossbrooklyn.edu.za

### 2. SSL Certificate
- Install SSL certificate for HTTPS
- Configure automatic redirects from HTTP to HTTPS
- Update all internal links to use HTTPS

## Environment Configuration

### 1. Google Analytics
Update the GA tracking ID in `frontend/src/components/Analytics.tsx`:
```typescript
const GA_TRACKING_ID = 'G-YOUR-ACTUAL-TRACKING-ID';
```

### 2. SEO Configuration
Update the canonical URL in `frontend/public/index.html`:
```html
<link rel="canonical" href="https://holycrossbrooklyn.edu.za/" />
```

### 3. Sitemap
Update `frontend/public/sitemap.xml` with your actual domain:
```xml
<loc>https://holycrossbrooklyn.edu.za/</loc>
```

## Performance Optimization

### 1. Image Optimization
- All images are optimized and compressed
- Lazy loading implemented for better performance
- WebP format recommended for new images

### 2. Caching
- Service worker implemented for offline functionality
- Static assets cached for better performance
- CDN recommended for global distribution

### 3. Bundle Optimization
- Code splitting implemented
- Tree shaking enabled
- Gzip compression recommended

## Monitoring & Analytics

### 1. Performance Monitoring
- Core Web Vitals tracking enabled
- Page load time monitoring
- User interaction tracking

### 2. Analytics Setup
- Google Analytics 4 configured
- Custom event tracking
- Conversion tracking

### 3. Error Monitoring
- Console error logging
- Performance metrics logging
- User behavior tracking

## Security Considerations

### 1. HTTPS
- SSL certificate required
- HSTS headers recommended
- Secure cookie settings

### 2. Content Security Policy
Add CSP headers to prevent XSS attacks:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
```

### 3. Security Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## Maintenance

### 1. Regular Updates
- Keep dependencies updated
- Monitor for security vulnerabilities
- Update content regularly

### 2. Backup Strategy
- Regular database backups (if applicable)
- Version control for all changes
- Document all customizations

### 3. Performance Monitoring
- Monitor Core Web Vitals
- Track user engagement metrics
- Optimize based on analytics data

## Troubleshooting

### Common Issues
1. **404 errors on refresh**: Configure URL rewriting
2. **Images not loading**: Check file paths and permissions
3. **Analytics not working**: Verify GA tracking ID
4. **Performance issues**: Check bundle size and caching

### Support
For technical support, contact the development team or refer to the project documentation.

## Post-Deployment Checklist

- [ ] SSL certificate installed and working
- [ ] All pages loading correctly
- [ ] Images and assets loading
- [ ] Contact form functional
- [ ] Analytics tracking working
- [ ] Performance metrics acceptable
- [ ] Mobile responsiveness verified
- [ ] SEO meta tags correct
- [ ] Sitemap accessible
- [ ] Robots.txt configured
- [ ] Social media sharing working
- [ ] Offline functionality tested

## Contact Information
For deployment assistance, contact the development team or school administration. 