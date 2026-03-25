# VocalyzeAI - Quick Start Guide

## 🎯 One-Command Setup

### Windows Users

```bash
# 1. Navigate to backend folder
cd backend

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy environment file
copy .env.example .env

# 5. Initialize database
python app.py

# 6. Keep this terminal running - your API is at http://localhost:5000
```

### macOS / Linux Users

```bash
# 1. Navigate to backend folder
cd backend

# 2. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy environment file
cp .env.example .env

# 5. Initialize database
python app.py

# 6. Keep this terminal running - your API is at http://localhost:5000
```

---

## 🌐 Open Frontend

### Option 1: Direct File Access (Easiest)
```
Simply open: VocalyzeAI/frontend/index.html in your web browser
```

### Option 2: Using Python HTTP Server

```bash
# In a NEW terminal, navigate to frontend folder
cd frontend

# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

### Option 3: Using Node.js

```bash
# Install globally (one-time)
npm install -g http-server

# In frontend folder
http-server -p 8000

# Then visit: http://localhost:8000
```

---

## ✅ Testing the Application

### 1. Test Without Login
- Click "Try Demo" button to see sample analysis results

### 2. Test Full Features
- Create account: Click "Sign In" → "Sign Up"
- Record audio: Click "Start Analysis" → "Record Now" → "Start Recording"
- Upload audio: Click "Start Analysis" → Upload MP3/WAV file
- View results: Analysis will display immediately
- Download report: Click "Download Report" button
- Check history: After logging in, click "Profile" → "View History"

### 3. Test Language Switching
- Select language from dropdown (English/中文)
- All UI text should update

---

## 🛠 Common Issues & Solutions

### Issue: "Cannot connect to API"
```
✅ Make sure backend (app.py) is running
✅ Backend should show: "Running on http://127.0.0.1:5000"
✅ Frontend API_BASE_URL should be http://localhost:5000/api
```

### Issue: "No module named 'flask'"
```
✅ Activate virtual environment first
✅ Run: pip install -r requirements.txt
```

### Issue: "Port 5000 already in use"
```bash
# Find and kill process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: "Microphone not working"
```
✅ Check browser permissions
✅ Use Chrome/Firefox for better compatibility
✅ Refresh page if permission was denied
```

---

## 📁 File Structure Explanation

```
VocalyzeAI/
│
├── frontend/
│   ├── index.html          ← Load this in browser
│   ├── styles.css          ← All styling
│   ├── app.js              ← Audio analysis & UI logic (Web Audio API)
│   └── languages.js        ← Multi-language support (EN/ZH)
│
├── backend/
│   ├── app.py              ← Flask server with all API endpoints
│   ├── requirements.txt     ← Python dependencies (pip install)
│   ├── .env.example        ← Copy to .env and modify
│   ├── uploads/            ← User audio files stored here
│   └── vocalyzeai.db       ← SQLite database (auto-created)
│
├── README.md               ← Full documentation
└── QUICKSTART.md          ← This file
```

---

## 🚀 Production Deployment

### Step 1: Backend Hosting

**Option A: Heroku**
```bash
cd backend
heroku create your-app-name
git push heroku main
```

**Option B: AWS (Elastic Beanstalk)**
```bash
eb init -p python-3.9 vocalyzeai
eb create vocalyzeai-env
eb deploy
```

**Option C: DigitalOcean**
- Create $5/month droplet
- SSH in: `ssh root@your_ip`
- Follow backend setup steps above
- Use Gunicorn: `gunicorn app:app`

### Step 2: Frontend Hosting

**Option A: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=frontend
```

**Option B: Vercel**
```bash
npm install -g vercel
vercel --prod
```

**Option C: AWS S3 + CloudFront**
- Upload frontend to S3
- Set S3 bucket as CloudFront origin

### Step 3: Update Configuration
```javascript
// In frontend/app.js, change:
const API_BASE_URL = 'https://your-backend-url/api';
```

---

## 📊 Database Queries (Advanced)

### View Users
```python
from app import db, User
users = User.query.all()
for user in users:
    print(f"{user.email}: {user.subscription_plan}")
```

### View Analyses
```python
from app import db, Analysis
analyses = Analysis.query.order_by(Analysis.created_at.desc()).all()
for a in analyses:
    print(f"Score: {a.overall_score}, User: {a.user.email}")
```

### Export as CSV
```python
import csv
from app import db, Analysis

analyses = Analysis.query.all()
with open('analyses.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerow(['User', 'Score', 'Level', 'Date'])
    for a in analyses:
        writer.writerow([a.user.email, a.overall_score, a.level, a.created_at])
```

---

## 🎓 Learning Resources

### Audio Processing
- [Web Audio API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Pitch Detection](https://en.wikipedia.org/wiki/Pitch_detection_algorithm)

### Flask Backend
- [Flask Official Docs](https://flask.palletsprojects.com/)
- [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/)
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/)

### Frontend
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [JavaScript Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

---

## 💡 Tips & Tricks

### 1. Faster Testing
```javascript
// In browser console (F12), simulate analysis:
appState.analysisResults = {
    pitchAccuracy: 85,
    stability: 'High',
    toneQuality: 'Good',
    resonance: 80,
    overallScore: 84,
    level: 'Advanced',
    feedback: 'Excellent voice!',
    suggestions: ['Keep practicing']
};
displayResults(appState.analysisResults);
```

### 2. Test Different Browsers
- Chrome: Best Web Audio API support
- Firefox: Good compatibility
- Safari: Limited microphone access (HTTPS required)
- Edge: Chromium-based, same as Chrome

### 3. Debug Audio
```javascript
// In browser console:
navigator.mediaDevices.enumerateDevices();
// Shows all available audio devices
```

### 4. Check Database
```bash
# SQLite command line
sqlite3 backend/vocalyzeai.db
> .tables
> SELECT * FROM users;
```

---

## 📞 Support

Need help? Try:
1. Check the README.md for detailed documentation
2. Look at browser console (F12) for error messages
3. Check backend terminal for server errors
4. Verify both frontend and backend are running

---

**Happy singing! 🎤** 

VocalyzeAI - Analyze, Learn, Improve
