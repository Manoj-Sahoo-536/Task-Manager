# Deployment Guide

Complete guide to deploying Task Manager to production.

## Prerequisites

- GitHub account
- MongoDB Atlas account (free tier available)
- Vercel account (for frontend)
- Render/Railway account (for backend)

---

## Database Setup (MongoDB Atlas)

### 1. Create Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Create a New Cluster"**
4. Select **Free Tier (M0)**
5. Choose a cloud provider and region
6. Click **"Create Cluster"**

### 2. Configure Database Access

1. Go to **Database Access**
2. Click **"Add New Database User"**
3. Create username and password
4. Set privileges to **"Read and write to any database"**
5. Click **"Add User"**

### 3. Configure Network Access

1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 4. Get Connection String

1. Click **"Connect"** on your cluster
2. Select **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `taskmanager`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
```

---

## Backend Deployment (Render)

### 1. Prepare Backend

Create `render.yaml` in backend folder:
```yaml
services:
  - type: web
    name: task-manager-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

### 2. Deploy to Render

1. Go to [Render](https://render.com)
2. Sign up or log in
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Select the backend folder
6. Configure:
   - **Name**: task-manager-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3. Set Environment Variables

Add these environment variables in Render:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
```

### 4. Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://task-manager-api.onrender.com`)

---

## Frontend Deployment (Vercel)

### 1. Prepare Frontend

Update `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up or log in
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist

### 3. Set Environment Variables

Add in Vercel:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 4. Deploy

1. Click **"Deploy"**
2. Wait for deployment
3. Your app is live at `https://your-app.vercel.app`

---

## Alternative: Railway Deployment

### Backend on Railway

1. Go to [Railway](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Select your repository
5. Add environment variables
6. Deploy

### Advantages
- Faster cold starts than Render
- Better free tier
- Automatic HTTPS

---

## Post-Deployment Configuration

### 1. Update CORS Settings

In `backend/server.js`, update CORS:
```javascript
const corsOptions = {
  origin: [
    'https://your-app.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
};
```

### 2. Update Frontend API URL

Ensure frontend points to production backend:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### 3. Test Production

1. Visit your Vercel URL
2. Create an account
3. Test all features:
   - Task creation
   - File uploads
   - Authentication
   - Analytics

---

## Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed
5. Wait for SSL certificate

### Render Custom Domain

1. Go to Render dashboard
2. Select your service
3. Click **"Settings"** → **"Custom Domain"**
4. Add your domain
5. Update DNS records

---

## Environment Variables Reference

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key_min_32_chars
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-api.onrender.com/api
```

---

## Monitoring & Maintenance

### Monitor Backend

- Check Render/Railway logs
- Set up uptime monitoring (UptimeRobot)
- Monitor MongoDB Atlas metrics

### Monitor Frontend

- Check Vercel analytics
- Monitor error logs
- Track performance metrics

### Regular Maintenance

- Update dependencies monthly
- Review and optimize database queries
- Check for security updates
- Backup database regularly

---

## Troubleshooting

### Backend Not Starting

- Check environment variables
- Verify MongoDB connection string
- Check Render/Railway logs
- Ensure PORT is set correctly

### Frontend Can't Connect to Backend

- Verify VITE_API_URL is correct
- Check CORS settings
- Ensure backend is running
- Check browser console for errors

### Database Connection Issues

- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions
- Test connection string locally first

### File Upload Issues

- Check file size limits
- Verify upload directory exists
- Check backend storage configuration
- Consider using cloud storage (AWS S3, Cloudinary)

---

## Scaling Considerations

### When to Upgrade

- Free tier limits reached
- Slow response times
- High traffic volume
- Need better performance

### Upgrade Options

**Render:**
- Starter: $7/month
- Standard: $25/month

**Vercel:**
- Pro: $20/month
- Unlimited bandwidth

**MongoDB Atlas:**
- M10: $0.08/hour (~$57/month)
- Better performance and backups

---

## Security Checklist

- ✅ Environment variables secured
- ✅ JWT secret is strong (32+ characters)
- ✅ CORS configured correctly
- ✅ HTTPS enabled
- ✅ Database access restricted
- ✅ API rate limiting enabled
- ✅ Input validation on all endpoints
- ✅ File upload restrictions in place

---

## Backup Strategy

### Database Backups

1. MongoDB Atlas automatic backups (paid tiers)
2. Manual exports via mongodump
3. Regular JSON exports via app

### Code Backups

- GitHub repository (primary)
- Local clones
- Tagged releases

---

## CI/CD (Optional)

### Automatic Deployments

**Vercel:**
- Automatically deploys on push to main
- Preview deployments for PRs

**Render:**
- Auto-deploy on GitHub push
- Configure in Render settings

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod
```

---

## Support

Deployment issues?
- Check platform documentation
- Review deployment logs
- Contact support
- Open GitHub issue
