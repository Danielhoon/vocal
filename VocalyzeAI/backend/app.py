"""
VocalyzeAI - Flask Backend Application
======================================
Main application entry point
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import datetime, timedelta
import os
import json
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///vocalyzeai.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_UPLOAD_SIZE', 10 * 1024 * 1024))  # 10MB default

# CORS Configuration
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:8000,http://localhost:3000')
cors_origins_list = [origin.strip() for origin in cors_origins.split(',')]
CORS(app, origins=cors_origins_list)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Create uploads directory
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ============================================
# Database Models
# ============================================

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    subscription_plan = db.Column(db.String(50), default='free')  # free, pro, pro_plus
    analyses = db.relationship('Analysis', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subscription_plan': self.subscription_plan,
            'created_at': self.created_at.isoformat(),
            'total_analyses': len(self.analyses)
        }


class Analysis(db.Model):
    __tablename__ = 'analyses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    pitch_accuracy = db.Column(db.Float, nullable=False)
    stability = db.Column(db.String(50), nullable=False)
    tone_quality = db.Column(db.String(50), nullable=False)
    resonance = db.Column(db.Float, nullable=False)
    overall_score = db.Column(db.Float, nullable=False)
    level = db.Column(db.String(50), nullable=False)
    feedback = db.Column(db.Text, nullable=False)
    suggestions = db.Column(db.JSON, nullable=True)
    audio_file = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'pitch_accuracy': self.pitch_accuracy,
            'stability': self.stability,
            'tone_quality': self.tone_quality,
            'resonance': self.resonance,
            'overall_score': self.overall_score,
            'level': self.level,
            'feedback': self.feedback,
            'suggestions': self.suggestions,
            'created_at': self.created_at.isoformat()
        }


class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    plan = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, completed, failed
    stripe_payment_id = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': self.amount,
            'plan': self.plan,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }


class PasswordResetToken(db.Model):
    __tablename__ = 'password_reset_tokens'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(255), unique=True, nullable=False, index=True)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'token': self.token,
            'expires_at': self.expires_at.isoformat(),
            'used': self.used,
            'created_at': self.created_at.isoformat()
        }

# ============================================
# Authentication Routes
# ============================================

@app.route('/api/signup', methods=['POST'])
def signup():
    """Register a new user"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['name', 'email', 'password']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create new user
        user = User(name=data['name'], email=data['email'])
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create JWT token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User created successfully',
            'user': user.to_dict(),
            'token': access_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['email', 'password']):
            return jsonify({'error': 'Missing email or password'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user():
    """Get current user info"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# Analysis Routes
# ============================================

@app.route('/api/analysis', methods=['POST'])
@jwt_required()
def save_analysis():
    """Save analysis results"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check subscription limits
        if user.subscription_plan == 'free':
            # Free users get 1 analysis per day
            today = datetime.utcnow().date()
            daily_count = Analysis.query.filter(
                Analysis.user_id == user_id,
                db.func.date(Analysis.created_at) == today
            ).count()
            
            if daily_count >= 1:
                return jsonify({'error': 'Daily analysis limit reached. Upgrade to Pro for unlimited analyses'}), 403
        
        data = request.get_json()
        
        analysis = Analysis(
            user_id=user_id,
            pitch_accuracy=data.get('pitch_accuracy', 0),
            stability=data.get('stability', 'Medium'),
            tone_quality=data.get('tone_quality', 'Fair'),
            resonance=data.get('resonance', 0),
            overall_score=data.get('overall_score', 0),
            level=data.get('level', 'Beginner'),
            feedback=data.get('feedback', ''),
            suggestions=data.get('suggestions', [])
        )
        
        db.session.add(analysis)
        db.session.commit()
        
        return jsonify({
            'message': 'Analysis saved successfully',
            'analysis': analysis.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get user's analysis history"""
    try:
        user_id = get_jwt_identity()
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        analyses = Analysis.query.filter_by(user_id=user_id).order_by(
            Analysis.created_at.desc()
        ).paginate(page=page, per_page=per_page)
        
        return jsonify({
            'analyses': [a.to_dict() for a in analyses.items],
            'total': analyses.total,
            'page': page,
            'pages': analyses.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/analysis/<int:analysis_id>', methods=['GET'])
@jwt_required()
def get_analysis(analysis_id):
    """Get specific analysis"""
    try:
        user_id = get_jwt_identity()
        analysis = Analysis.query.filter_by(id=analysis_id, user_id=user_id).first()
        
        if not analysis:
            return jsonify({'error': 'Analysis not found'}), 404
        
        return jsonify({'analysis': analysis.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# Payment Routes
# ============================================

@app.route('/api/subscription/upgrade', methods=['POST'])
@jwt_required()
def upgrade_subscription():
    """Upgrade user subscription"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        plan = data.get('plan')  # pro or pro_plus
        
        if plan not in ['pro', 'pro_plus']:
            return jsonify({'error': 'Invalid plan'}), 400
        
        # In production, use Stripe API here
        # For now, update subscription directly
        user.subscription_plan = plan
        db.session.commit()
        
        return jsonify({
            'message': f'Upgraded to {plan}',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/payment/callback', methods=['POST'])
def payment_callback():
    """Stripe webhook callback"""
    try:
        # In production, verify Stripe signature
        data = request.get_json()
        
        # Handle different event types
        event_type = data.get('type')
        
        if event_type == 'charge.succeeded':
            # Update user subscription
            pass
        
        return jsonify({'received': True}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# Password Reset & Dashboard Endpoints
# ============================================

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    """Send password reset email"""
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            # Don't reveal if email exists or not for security
            return jsonify({'message': 'If an account with this email exists, a reset link has been sent.'}), 200

        # Generate reset token
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=24)

        # Save token to database
        reset_token = PasswordResetToken(
            user_id=user.id,
            token=token,
            expires_at=expires_at
        )
        db.session.add(reset_token)
        db.session.commit()

        # Send reset email (simplified - in production use proper email service)
        reset_link = f"https://vocalanalysis.com/reset-password?token={token}"

        # For demo purposes, just return the reset link
        # In production, send actual email
        print(f"Password reset link for {email}: {reset_link}")

        return jsonify({
            'message': 'If an account with this email exists, a reset link has been sent.',
            'reset_link': reset_link  # Remove in production
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    """Get dashboard data for logged-in user"""
    try:
        user_id = get_jwt_identity()

        # Get user's analyses
        analyses = Analysis.query.filter_by(user_id=user_id).order_by(Analysis.created_at.desc()).all()

        # Calculate stats
        total_analyses = len(analyses)
        if total_analyses > 0:
            avg_score = sum(a.overall_score for a in analyses) / total_analyses
            best_score = max(a.overall_score for a in analyses)
            current_level = analyses[0].level  # Most recent level
        else:
            avg_score = 0
            best_score = 0
            current_level = 'Beginner'

        # Get recent analyses (last 5)
        recent_analyses = analyses[:5]

        stats = {
            'totalAnalyses': total_analyses,
            'averageScore': round(avg_score, 1),
            'bestScore': best_score,
            'currentLevel': current_level
        }

        dashboard_data = {
            'stats': stats,
            'recentAnalyses': [a.to_dict() for a in recent_analyses]
        }

        return jsonify(dashboard_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# Health Check & Error Handlers
# ============================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# ============================================
# Application Initialization
# ============================================

def init_db():
    """Initialize database"""
    with app.app_context():
        db.create_all()
        print("Database initialized!")


if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
