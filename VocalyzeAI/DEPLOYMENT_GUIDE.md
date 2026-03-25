# VocalyzeAI Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Frontend Only (Static Hosting) - FREE & EASY

Deploy just the frontend to services like:

#### **Netlify (Recommended for Beginners)**
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build settings:
   - **Build command**: `echo "No build required"`
   - **Publish directory**: `frontend`
6. Click "Deploy site"
7. Your site will be live at: `https://random-name.netlify.app`

#### **Vercel (Alternative)**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: `Other`
   - **Root Directory**: `frontend`
   - **Build Command**: `echo "No build"`
   - **Output Directory**: `.`
6. Click "Deploy"

#### **GitHub Pages (Completely Free)**
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Set source to "Deploy from a branch"
4. Select "main" branch and "/frontend" folder
5. Save - your site will be at: `https://yourusername.github.io/vocalyzeai`

---

### Option 2: Full Stack Deployment (Backend + Frontend)

#### **Railway (Easiest Full-Stack)**
1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Python/Flask
6. Set environment variables in Railway dashboard
7. Your app deploys automatically!

#### **Render (Free Tier Available)**
1. Go to [render.com](https://render.com)
2. Sign up/Login
3. Create "Web Service" from Git
4. Connect your repository
5. Configure:
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
6. Add environment variables
7. Deploy!

#### **Heroku (Classic Choice)**
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set buildpack: `heroku buildpacks:set heroku/python`
5. Push to Heroku: `git push heroku main`
6. Set environment variables: `heroku config:set KEY=value`

---

### Option 3: VPS/Cloud Server (Most Control)

#### **DigitalOcean Droplet**
1. Go to [digitalocean.com](https://digitalocean.com)
2. Create account and droplet ($6/month)
3. SSH into server
4. Install Docker: `curl -fsSL https://get.docker.com | sh`
5. Clone your repository
6. Run: `docker-compose up -d`
7. Configure Nginx reverse proxy
8. Point domain to server IP

#### **AWS EC2**
1. Create EC2 instance (t2.micro is free tier)
2. Install Docker
3. Deploy using docker-compose
4. Configure security groups
5. Set up load balancer (optional)

---

## 🌐 Domain Setup

### Buy a Domain
- **Namecheap** (~$10/year)
- **GoDaddy** (~$15/year)
- **Porkbun** (~$8/year)

### Point Domain to Your App

#### For Static Hosting (Netlify/Vercel):
- In your hosting dashboard, add custom domain
- Update DNS records as instructed

#### For Server Deployment:
1. Get your server's IP address
2. In domain settings, create A record:
   - **Type**: A
   - **Name**: @
   - **Value**: your-server-ip
3. For www subdomain:
   - **Type**: CNAME
   - **Name**: www
   - **Value**: your-domain.com

---

## 🔒 SSL Certificate (HTTPS)

### Automatic (Recommended)
Most hosting services provide free SSL:
- **Netlify**: Automatic SSL
- **Vercel**: Automatic SSL
- **Railway**: Automatic SSL
- **Render**: Automatic SSL

### Manual SSL (for VPS)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

---

## 🗄️ Database Setup

### For Production (Recommended)
Replace SQLite with PostgreSQL:

1. **Railway/Render**: Use their managed PostgreSQL
2. **AWS**: Use RDS PostgreSQL
3. **DigitalOcean**: Use managed database

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET_KEY=your-super-secret-key-here
FLASK_ENV=production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 📋 Pre-Deployment Checklist

- [ ] Test locally: `docker-compose up`
- [ ] Update API_BASE_URL in `frontend/app.js` to your domain
- [ ] Set production environment variables
- [ ] Configure CORS for your domain
- [ ] Set up proper logging
- [ ] Test all features
- [ ] Set up monitoring (optional)

---

## 🎯 Recommended Deployment Path

**For Beginners:**
1. Deploy frontend to **Netlify** (free)
2. Deploy backend to **Railway** (free tier)
3. Buy domain from **Namecheap**
4. Connect domain to both services

**Total Cost**: ~$10/year (domain only)

---

## 🔧 Troubleshooting

### Common Issues:

**CORS Errors:**
- Update CORS origins in `backend/app.py`
- Add your domain to allowed origins

**Database Connection:**
- Check DATABASE_URL format
- Ensure database is accessible

**Static Files:**
- Ensure correct file paths
- Check MIME types

**Environment Variables:**
- Never commit secrets to Git
- Use hosting platform's environment variable settings

---

## 📞 Need Help?

1. Check deployment logs
2. Test API endpoints: `https://yourdomain.com/api/health`
3. Check browser console for errors
4. Verify environment variables are set

Happy deploying! 🚀</content>
<parameter name="filePath">c:\Users\ASUS\Downloads\VocalyzeAI\DEPLOYMENT_GUIDE.md