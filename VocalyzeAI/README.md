# VocalyzeAI - Advanced Vocal Analysis System

A modern web application that uses AI-driven vocal analysis to provide instant feedback on singing performance. Users can upload audio files or record live, and receive detailed analysis on pitch accuracy, vocal stability, tone quality, and resonance.

## 🎯 Features

### Core Functionality
- **Audio Upload & Recording**: Support for MP3, WAV formats with file size validation
- **Real-time Analysis**: Analyze pitch accuracy, vocal stability, tone quality, and resonance
- **AI Feedback Generation**: Personalized feedback and improvement suggestions
- **Results Visualization**: Interactive progress bars and metric displays
- **Result Sharing**: Share results on social media or download as PDF

### User Features
- **User Authentication**: Secure signup/login with JWT tokens
- **Analysis History**: Track all previous analyses with timestamps
- **Subscription Plans**: Free, Pro, and Pro Plus tiers with different limits
- **Language Support**: English and Chinese with easy language switching
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Advanced Features
- **Payment Integration**: Stripe integration for subscription management
- **Data Analytics**: Track progress over time
- **Batch Analysis**: Process multiple files
- **API Access**: RESTful API for integration

## 📋 Project Structure

```
VocalyzeAI/
├── frontend/                 # Web UI
│   ├── index.html           # Main HTML page
│   ├── styles.css           # Styling
│   ├── app.js               # Main application logic
│   └── languages.js         # Multi-language support
│
├── backend/                 # Python Flask server
│   ├── app.py               # Main Flask application
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example         # Environment variables template
│   ├── uploads/             # Audio file storage
│   └── vocalyzeai.db        # SQLite database
│
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+ (optional, for bundling)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Microphone for live recording

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize database**
   ```bash
   python
   >>> from app import init_db
   >>> init_db()
   >>> exit()
   ```

6. **Run the server**
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser, or
   - Use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     ```
   - Then visit `http://localhost:8000`

   Or use Node.js `http-server`:
   ```bash
   npm install -g http-server
   http-server -p 8000
   ```

## 🔧 Configuration

### Backend Configuration (.env)

```env
# Flask
FLASK_ENV=development
FLASK_DEBUG=True

# Database
DATABASE_URL=sqlite:///vocalyzeai.db

# JWT
JWT_SECRET_KEY=your-secret-key

# Payment (Optional)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### API Base URL

In `frontend/app.js`, update the API endpoint if needed:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 📚 API Documentation

### Authentication Endpoints

#### Sign Up
```
POST /api/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

Response:
{
  "message": "User created successfully",
  "user": {...},
  "token": "jwt_token"
}
```

#### Login
```
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response:
{
  "message": "Login successful",
  "user": {...},
  "token": "jwt_token"
}
```

#### Get User
```
GET /api/user
Authorization: Bearer jwt_token

Response:
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "subscription_plan": "free",
    "total_analyses": 5
  }
}
```

### Analysis Endpoints

#### Save Analysis
```
POST /api/analysis
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "pitch_accuracy": 82,
  "stability": "Medium",
  "tone_quality": "Good",
  "resonance": 75,
  "overall_score": 79,
  "level": "Intermediate",
  "feedback": "Your pitch is generally accurate...",
  "suggestions": ["Improve breathing", "Practice pitch..."]
}

Response:
{
  "message": "Analysis saved successfully",
  "analysis": {...}
}
```

#### Get History
```
GET /api/history?page=1&per_page=10
Authorization: Bearer jwt_token

Response:
{
  "analyses": [...],
  "total": 25,
  "page": 1,
  "pages": 3
}
```

#### Get Single Analysis
```
GET /api/analysis/{id}
Authorization: Bearer jwt_token

Response:
{
  "analysis": {...}
}
```

### Subscription Endpoints

#### Upgrade Subscription
```
POST /api/subscription/upgrade
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "plan": "pro"  // or "pro_plus"
}

Response:
{
  "message": "Upgraded to pro",
  "user": {...}
}
```

## 📊 Audio Analysis Explained

### Analysis Metrics

1. **Pitch Accuracy (0-100%)**
   - Measures how accurately you match the target pitch
   - Uses fundamental frequency detection
   - Target: >75% for good accuracy

2. **Vocal Stability**
   - LOW: Inconsistent pitch and volume
   - MEDIUM: Generally stable with minor fluctuations
   - HIGH: Stable and consistent throughout

3. **Tone Quality**
   - POOR: Harsh, nasal, or unclear sound
   - FAIR: Basic vocal control but needs improvement
   - GOOD: Clear, pleasant tone with good control
   - EXCELLENT: Professional-quality tone

4. **Resonance (0-100%)**
   - Measures energy distribution across frequency spectrum
   - Higher values indicate better resonance
   - Important for voice projection and richness

### Overall Score Calculation
```
Overall Score = (Pitch + Stability×100 + Tone×100 + Resonance) / 4

Levels:
- Beginner: < 45
- Intermediate: 45-60
- Advanced: 60-75
- Expert: 75-100
```

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 1024px
- Flexible grid layouts

### Accessibility
- Semantic HTML
- ARIA labels for screen readers
- Keyboard navigation support
- Color contrast compliance

### Performance
- Minimal external dependencies
- Local storage for user preferences
- Lazy loading for images
- Optimized CSS animations

## 🔐 Security Features

- **Password Security**: Werkzeug hashing with salt
- **JWT Tokens**: Secure stateless authentication
- **CORS**: Configured for secure cross-origin requests
- **File Validation**: Size and type checking
- **HTTPS Ready**: All endpoints support HTTPS
- **Data Privacy**: User audio files handled securely

## 💳 Payment Integration

### Stripe Setup (Optional)

1. Create account at stripe.com
2. Get API keys from dashboard
3. Add to .env:
   ```
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```
4. Implement Stripe.js in frontend
5. Handle webhook callbacks

### Pricing Plans

| Plan | Price | Analyses/Day | Features |
|------|-------|-------------|----------|
| Free | $0 | 1 | Basic metrics |
| Pro | $9.99/month | Unlimited | All metrics + history |
| Pro Plus | $19.99/month | Unlimited | Pro + AI coaching |

## 🧪 Testing

### Manual Testing Checklist

- [ ] User signup/login
- [ ] Audio upload (various formats)
- [ ] Live recording
- [ ] Analysis processing
- [ ] Results display
- [ ] History loading
- [ ] Language switching
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] Payment flow (if enabled)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Troubleshooting

### Issue: "CORS error when calling API"
**Solution**: Ensure backend is running and CORS is enabled in app.py

### Issue: "Microphone access denied"
**Solution**: 
- Check browser permissions
- Use HTTPS in production
- Verify microphone is plugged in

### Issue: "File upload fails"
**Solution**:
- Check file size (max 10MB)
- Verify audio format (MP3, WAV)
- Ensure backend upload folder has write permissions

### Issue: "Database locked"
**Solution**:
- Restart backend server
- Check for concurrent access
- Consider PostgreSQL for production

## 🚀 Deployment

### Frontend Deployment

**Netlify:**
```bash
netlify deploy --prod --dir=frontend
```

**Vercel:**
```bash
vercel --prod
```

**GitHub Pages:**
- Push to gh-pages branch
- Enable Pages in repository settings

### Backend Deployment

**Heroku:**
```bash
heroku create vocalyzeai
git push heroku main
```

**AWS:**
- Use Elastic Beanstalk or Lambda
- Configure RDS for database
- Use S3 for audio storage

**DigitalOcean:**
- Create droplet
- Install Python and dependencies
- Use Gunicorn + Nginx

## 📈 Future Enhancements

- [ ] Machine learning model for advanced analysis
- [ ] Waveform visualization
- [ ] Real-time pitch display
- [ ] Video recording support
- [ ] Comparison with professional singers
- [ ] Social sharing with leaderboards
- [ ] Mobile app (React Native/Flutter)
- [ ] Integration with music platforms (Spotify)
- [ ] AI coaching with ChatGPT
- [ ] Advanced metrics (vibrato, dynamics)

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For issues, questions, or feedback:
- Create an issue on GitHub
- Email: support@vocalyzeai.com
- Discord: [Join our community]

## 🙏 Acknowledgments

- **Web Audio API**: For browser-based audio processing
- **Flask**: For the web framework
- **SQLAlchemy**: For database ORM
- **Stripe**: For payment processing
- **Bootstrap community**: For CSS inspiration

---

**VocalyzeAI** - Powered by AI-driven vocal analysis technology | Made with ❤️
