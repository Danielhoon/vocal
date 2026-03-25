# VocalyzeAI - SSL Setup (Netlify + Railway)

## 🎯 Your Setup
- **Frontend**: Netlify (Free SSL ✅)
- **Backend**: Railway (Free SSL ✅)
- **Domain**: vocalanalysis.com

---

## 📋 Step-by-Step Setup

### Step 1: Deploy Frontend to Netlify ✅

```bash
# Push your code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

**On Netlify:**
1. Visit [netlify.com](https://netlify.com)
2. Click **"New site from Git"**
3. Connect GitHub → Select your repository
4. Configure build:
   - **Build command**: `echo "No build required"`
   - **Publish directory**: `frontend`
5. Click **"Deploy"**
6. You get: `https://random-name.netlify.app` (SSL automatic ✓)

### Step 2: Deploy Backend to Railway ✅

**On Railway:**
1. Visit [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repository
4. Railway detects Python/Flask automatically
5. Set environment variables:
   ```
   FLASK_ENV=production
   DATABASE_URL=sqlite:///vocalyzeai.db
   JWT_SECRET_KEY=your-secure-key-here
   CORS_ORIGINS=https://your-frontend-url.netlify.app
   ```
6. Deploy (takes 2-5 minutes)
7. You get: `https://project.railway.app` (SSL automatic ✓)

---

## 🌐 Step 3: Add Custom Domains

### Frontend: vocalanalysis.com → Netlify

**In Netlify:**
1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter: `vocalanalysis.com`
4. Netlify shows DNS records to add

**In your domain registrar (Namecheap):**
1. Go to **Advanced DNS**
2. Add CNAME record:
   ```
   Type: CNAME
   Name: @
   Value: your-netlify-site.netlify.app
   TTL: 3600
   ```
3. Click Save

**For www:**
```
Type: CNAME
Name: www
Value: your-netlify-site.netlify.app
TTL: 3600
```

**SSL Status:** 
- Netlify provisions SSL within **24 hours**
- Or click "Check DNS" in Netlify to speed up

---

### Backend: api.vocalanalysis.com → Railway

**In Railway:**
1. Go to **Project** → **Settings** → **Custom Domain**
2. Click **Add Custom Domain**
3. Enter: `api.vocalanalysis.com`
4. Railway shows you the target

**In your domain registrar:**
1. Add CNAME record:
   ```
   Type: CNAME
   Name: api
   Value: railway-provided-target
   TTL: 3600
   ```
2. Click Save

**SSL Status:**
- SSL provisions within **5-10 minutes**
- Check status in Railway dashboard

---

## 🔧 Step 4: Update Your Code

**In `frontend/app.js`:**
```javascript
// Change this:
const API_BASE_URL = 'http://localhost:5000/api';

// To this:
const API_BASE_URL = 'https://api.vocalanalysis.com/api';
```

**In `backend/app.py`:**
```python
# Update CORS origins
cors_origins = "https://vocalanalysis.com,https://www.vocalanalysis.com"
```

**In `backend/.env`:**
```env
FLASK_ENV=production
FLASK_DEBUG=False
DATABASE_URL=sqlite:///vocalyzeai.db
JWT_SECRET_KEY=your-production-secret-key-min-32-chars
CORS_ORIGINS=https://vocalanalysis.com,https://www.vocalanalysis.com
```

---

## ✅ Step 5: Verify SSL is Working

### Check Frontend SSL
```bash
# In terminal
curl -I https://vocalanalysis.com

# Should see:
# HTTP/2 200
# content-type: text/html
```

### Check Backend SSL
```bash
curl -I https://api.vocalanalysis.com/api/health

# Should see:
# HTTP/2 200
# content-type: application/json
```

### In Browser
1. Visit **https://vocalanalysis.com**
2. Check address bar - should show 🔒 lock icon
3. Click lock icon → "Certificate is valid"

---

## 🔒 SSL Certificate Details

### Netlify
- **Provider**: Let's Encrypt
- **Auto-renews**: Yes ✓
- **Duration**: 90 days
- **Cost**: FREE

### Railway
- **Provider**: Let's Encrypt
- **Auto-renews**: Yes ✓
- **Duration**: 90 days
- **Cost**: FREE

---

## ⏱️ Timeline

| Step | Time | Status |
|------|------|--------|
| Deploy frontend to Netlify | 2 min | Immediate |
| Add domain to Netlify | 1 min | Instant |
| Netlify provisions SSL | 24 hours | Auto |
| Deploy backend to Railway | 5 min | Immediate |
| Add domain to Railway | 1 min | Instant |
| Railway provisions SSL | 10 min | Auto |
| **Total time to LIVE** | **~1 day** | ✅ |

---

## 🚨 Troubleshooting

### "Certificate is still pending"
- Wait 24 hours
- Check DNS propagation: [whatsmydns.net](https://whatsmydns.net)
- Refresh Netlify/Railway dashboard

### "SSL error" or "Certificate error"
```bash
# Check if domain resolved
nslookup vocalanalysis.com
nslookup api.vocalanalysis.com

# If no results, DNS not configured
# If yes, wait 5-24 hours for certificate
```

### "CORS error" in console
- Update `CORS_ORIGINS` in backend
- Update `API_BASE_URL` in frontend
- Restart backend service

### "Mixed Content" warning
- Make sure API_BASE_URL uses `https://`
- Don't use `http://` from HTTPS page

---

## 🎯 Final Checklist

- [ ] Both apps deployed to platforms
- [ ] Domains registered
- [ ] DNS records added to registrar
- [ ] Frontend SSL shows ✓ (24 hours)
- [ ] Backend SSL shows ✓ (5-10 min)
- [ ] Frontend code updated with HTTPS API URL
- [ ] Backend CORS origins updated
- [ ] Test: `curl https://api.vocalanalysis.com/api/health`
- [ ] Test: Visit `https://vocalanalysis.com` in browser
- [ ] 🔒 Lock icon shows in browser

---

## 📞 Support Links

- **Netlify Docs**: https://docs.netlify.com/domains-https/custom-domains/
- **Railway Docs**: https://docs.railway.app/manage/custom-domains
- **Domain DNS Help**: https://www.namecheap.com/support/

**Both platforms have 24/7 support if you get stuck!**

🎉 **Once SSL is live, you're production-ready!**