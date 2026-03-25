// ============================================
// VocalyzeAI - Main Application JavaScript
// ============================================

const API_BASE_URL = 'http://localhost:5000/api';

// State Management
let appState = {
    user: null,
    isLoggedIn: false,
    currentAudio: null,
    mediaRecorder: null,
    audioChunks: [],
    analysisResults: null,
};

// ============================================
// Audio Analysis Functions (Web Audio API)
// ============================================

class AudioAnalyzer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
    }

    async analyzeAudio(audioBuffer) {
        const method = 'GET';
        const offlineCtx = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
        );

        // Create frequency analyzer
        const analyser = offlineCtx.createAnalyser();
        analyser.fftSize = 2048;

        const source = offlineCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyser);
        analyser.connect(offlineCtx.destination);
        source.start(0);

        // Get frequency data
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        // Analyze audio characteristics
        const results = this.processAudioData(audioBuffer, dataArray);
        return results;
    }

    processAudioData(audioBuffer, frequencyData) {
        const samples = audioBuffer.getChannelData(0);

        // 1. Pitch Accuracy (simplified - looks at fundamental frequency)
        const pitchAccuracy = this.calculatePitchAccuracy(frequencyData);

        // 2. Vocal Stability (variance in amplitude)
        const stability = this.calculateStability(samples);

        // 3. Tone Quality (spectral analysis)
        const toneQuality = this.calculateToneQuality(frequencyData);

        // 4. Resonance (energy distribution)
        const resonance = this.calculateResonance(frequencyData);

        // 5. Overall Score
        const overallScore = Math.round(
            (pitchAccuracy + (stability * 100) + (toneQuality * 100) + resonance) / 4
        );

        // Determine level
        let level = 'Beginner';
        if (overallScore >= 75) level = 'Expert';
        else if (overallScore >= 60) level = 'Advanced';
        else if (overallScore >= 45) level = 'Intermediate';

        return {
            pitchAccuracy: Math.min(100, pitchAccuracy),
            stability: stability > 0.7 ? 'High' : stability > 0.4 ? 'Medium' : 'Low',
            toneQuality: toneQuality > 0.75 ? 'Excellent' : toneQuality > 0.6 ? 'Good' : toneQuality > 0.45 ? 'Fair' : 'Poor',
            resonance: Math.round(resonance),
            overallScore: overallScore,
            level: level,
            feedback: this.generateFeedback(pitchAccuracy, stability, toneQuality),
            suggestions: this.generateSuggestions(pitchAccuracy, stability, toneQuality),
        };
    }

    calculatePitchAccuracy(frequencyData) {
        // Find dominant frequency
        let maxValue = 0;
        let maxIndex = 0;
        for (let i = 0; i < frequencyData.length; i++) {
            if (frequencyData[i] > maxValue) {
                maxValue = frequencyData[i];
                maxIndex = i;
            }
        }

        // Calculate pitch accuracy (0-100)
        const dominanceRatio = maxValue / 255;
        return Math.round(dominanceRatio * 100);
    }

    calculateStability(samples) {
        // Calculate RMS and variance
        let sumSquares = 0;
        for (let i = 0; i < samples.length; i++) {
            sumSquares += samples[i] * samples[i];
        }
        const rms = Math.sqrt(sumSquares / samples.length);

        // Stability based on signal consistency
        return Math.min(1, rms + 0.3);
    }

    calculateToneQuality(frequencyData) {
        // Calculate spectral centroid
        let weightedSum = 0;
        let sum = 0;
        for (let i = 0; i < frequencyData.length; i++) {
            weightedSum += i * frequencyData[i];
            sum += frequencyData[i];
        }

        const centroid = sum > 0 ? weightedSum / sum : 0;
        // Normalize to 0-1 (ideal tone is around mid-high frequencies)
        return Math.min(1, centroid / 256);
    }

    calculateResonance(frequencyData) {
        // Measure energy distribution
        const midFreqEnergy = frequencyData.slice(100, 200).reduce((a, b) => a + b, 0);
        const totalEnergy = frequencyData.reduce((a, b) => a + b, 0);

        const ratio = totalEnergy > 0 ? midFreqEnergy / totalEnergy : 0;
        return Math.round(ratio * 100);
    }

    generateFeedback(pitch, stability, tone) {
        let feedback = '';

        if (pitch >= 75) {
            feedback += 'Your pitch accuracy is excellent! ';
        } else if (pitch >= 60) {
            feedback += 'Your pitch is generally good, but there\'s room for improvement. ';
        } else {
            feedback += 'Work on improving your pitch accuracy through practice. ';
        }

        if (stability === 'High') {
            feedback += 'Your vocal stability is great! ';
        } else if (stability === 'Medium') {
            feedback += 'You may need to improve breath control for better stability. ';
        } else {
            feedback += 'Focus on controlling your breathing to improve stability. ';
        }

        return feedback;
    }

    generateSuggestions(pitch, stability, tone) {
        const suggestions = [
            'Practice pitch exercises daily for 10-15 minutes',
            'Work on breath support and control',
            'Record yourself and listen back to identify weak areas',
            'Warm up your voice before singing',
            'Focus on proper posture while singing',
        ];

        // Customize based on scores
        if (pitch < 60) {
            suggestions[0] = 'Focus on pitch accuracy - use reference notes for practice';
        }

        if (stability === 'Low') {
            suggestions[1] = 'Improve breath control through diaphragmatic breathing exercises';
        }

        return suggestions.slice(0, 3);
    }
}

const audioAnalyzer = new AudioAnalyzer();

// ============================================
// Event Listeners - File Upload
// ============================================

const dragDropArea = document.getElementById('drag-drop-area');
const audioInput = document.getElementById('audio-input');
const startBtn = document.getElementById('start-btn');
const demoBtn = document.getElementById('demo-btn');

dragDropArea.addEventListener('click', () => audioInput.click());

dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.classList.add('drag-over');
});

dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.classList.remove('drag-over');
});

dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload(files[0]);
    }
});

audioInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
    }
});

function handleFileUpload(file) {
    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
        showWarning('file-size-warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(e.target.result, (audioBuffer) => {
            appState.currentAudio = audioBuffer;
            analyzeAudio(audioBuffer);
        }, (err) => {
            console.error('Error decoding audio:', err);
            showError('error-analysis');
        });
    };
    reader.readAsArrayBuffer(file);
}

// ============================================
// Recording Functionality
// ============================================

const recordBtn = document.getElementById('record-btn');
const stopRecordBtn = document.getElementById('stop-record-btn');
const recordingIndicator = document.getElementById('recording-indicator');

recordBtn.addEventListener('click', startRecording);
stopRecordBtn.addEventListener('click', stopRecording);

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);

        appState.mediaRecorder = mediaRecorder;
        appState.audioChunks = [];

        mediaRecorder.ondataavailable = (e) => {
            appState.audioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(appState.audioChunks, { type: 'audio/wav' });
            const reader = new FileReader();
            reader.onload = (e) => {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioContext.decodeAudioData(e.target.result, (audioBuffer) => {
                    appState.currentAudio = audioBuffer;
                    analyzeAudio(audioBuffer);
                });
            };
            reader.readAsArrayBuffer(audioBlob);
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        recordBtn.style.display = 'none';
        stopRecordBtn.style.display = 'inline-block';
        recordingIndicator.style.display = 'flex';
    } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Unable to access microphone');
    }
}

function stopRecording() {
    appState.mediaRecorder.stop();
    recordBtn.style.display = 'inline-block';
    stopRecordBtn.style.display = 'none';
    recordingIndicator.style.display = 'none';
}

// ============================================
// Audio Analysis
// ============================================

async function analyzeAudio(audioBuffer) {
    showLoadingState();

    setTimeout(async () => {
        const results = await audioAnalyzer.analyzeAudio(audioBuffer);
        appState.analysisResults = results;

        // Save analysis if user is logged in
        if (appState.isLoggedIn) {
            saveAnalysisToDatabase(results);
        }

        displayResults(results);
    }, 1500); // Simulate analysis delay
}

function displayResults(results) {
    // Update metric displays
    document.getElementById('pitch-progress').style.width = results.pitchAccuracy + '%';
    document.getElementById('pitch-value').textContent = results.pitchAccuracy + '%';

    document.getElementById('stability-value').textContent = results.stability;

    document.getElementById('tone-value').textContent = results.toneQuality;

    document.getElementById('resonance-progress').style.width = results.resonance + '%';
    document.getElementById('resonance-value').textContent = results.resonance + '%';

    // Update overall score
    document.getElementById('overall-score').textContent = results.overallScore;
    document.getElementById('score-level').textContent = getTranslation(`level-${results.level.toLowerCase()}`);

    // Update feedback
    document.getElementById('feedback-text').textContent = results.feedback;

    // Update suggestions
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = results.suggestions
        .map(s => `<li>${s}</li>`)
        .join('');

    // Show results area
    hideAllSections();
    document.getElementById('results-area').style.display = 'block';
}

// ============================================
// UI State Management
// ============================================

function hideAllSections() {
    document.getElementById('upload-area').style.display = 'none';
    document.getElementById('results-area').style.display = 'none';
    document.getElementById('loading-area').style.display = 'none';
}

function showUploadArea() {
    hideAllSections();
    document.getElementById('upload-area').style.display = 'block';
    resetUploadForm();
}

function showLoadingState() {
    hideAllSections();
    document.getElementById('loading-area').style.display = 'block';
}

function resetUploadForm() {
    audioInput.value = '';
}

function showWarning(messageKey) {
    // Find and show warning element
    const warning = document.getElementById('file-size-warning');
    if (warning) {
        warning.style.display = 'block';
        setTimeout(() => {
            warning.style.display = 'none';
        }, 3000);
    }
}

function showError(messageKey) {
    alert(getTranslation(messageKey));
}

// ============================================
// Navigation Events
// ============================================

startBtn.addEventListener('click', showUploadArea);
demoBtn.addEventListener('click', () => {
    // Demo with sample analysis
    appState.analysisResults = {
        pitchAccuracy: 82,
        stability: 'Medium',
        toneQuality: 'Good',
        resonance: 75,
        overallScore: 79,
        level: 'Intermediate',
        feedback: 'Your pitch is generally accurate, but you may need to improve breath control for better stability in higher notes.',
        suggestions: [
            'Work on breath support for sustained notes',
            'Practice pitch exercises regularly',
            'Record yourself and analyze your recordings'
        ]
    };
    hideAllSections();
    document.getElementById('results-area').style.display = 'block';
    displayResults(appState.analysisResults);
});

document.getElementById('try-again-btn').addEventListener('click', showUploadArea);

// ============================================
// Action Buttons
// ============================================

document.getElementById('share-btn').addEventListener('click', () => {
    const result = appState.analysisResults;
    const text = `Check out my vocal analysis! Overall Score: ${result.overallScore}/100 (${result.level}) - VocalyzeAI`;
    if (navigator.share) {
        navigator.share({
            title: 'VocalyzeAI - Vocal Analysis',
            text: text
        });
    } else {
        alert(text);
    }
});

document.getElementById('download-btn').addEventListener('click', () => {
    const result = appState.analysisResults;
    const reportContent = `
VocalyzeAI - Vocal Analysis Report
===================================

Overall Score: ${result.overallScore}/100
Level: ${result.level}

Metrics:
- Pitch Accuracy: ${result.pitchAccuracy}%
- Vocal Stability: ${result.stability}
- Tone Quality: ${result.toneQuality}
- Resonance: ${result.resonance}%

Feedback:
${result.feedback}

Suggestions:
${result.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Generated: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VocalyzeAI_Report_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// ============================================
// Authentication
// ============================================

const authBtn = document.getElementById('auth-btn');
const authModal = document.getElementById('auth-modal');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const userProfile = document.getElementById('user-profile');
const closeModal = document.querySelector('.close-modal');

authBtn.addEventListener('click', () => {
    if (appState.isLoggedIn) {
        showUserProfile();
    } else {
        authModal.style.display = 'flex';
    }
});

closeModal.addEventListener('click', () => {
    authModal.style.display = 'none';
});

authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Login/Signup toggle
document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Login
document.getElementById('login-submit').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            appState.user = data.user;
            appState.isLoggedIn = true;
            localStorage.setItem('auth_token', data.token);
            authModal.style.display = 'none';
            showDashboard();
            authBtn.textContent = 'Profile ▼';
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (err) {
        console.error('Login error:', err);
    }
});

// Signup
document.getElementById('signup-submit').addEventListener('click', async () => {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            appState.user = data.user;
            appState.isLoggedIn = true;
            localStorage.setItem('auth_token', data.token);
            authModal.style.display = 'none';
            showUserProfile();
            authBtn.textContent = 'Profile ▼';
        } else {
            alert(data.error || 'Signup failed');
        }
    } catch (err) {
        console.error('Signup error:', err);
    }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    appState.user = null;
    appState.isLoggedIn = false;
    localStorage.removeItem('auth_token');
    authModal.style.display = 'none';
    authBtn.textContent = 'Sign In';
    alert('Logged out successfully');
});

// History
document.getElementById('history-btn').addEventListener('click', loadHistory);

const historyModal = document.getElementById('history-modal');
const closeHistoryModal = document.querySelectorAll('.close-modal')[1];

closeHistoryModal.addEventListener('click', () => {
    historyModal.style.display = 'none';
});

function showUserProfile() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    userProfile.style.display = 'block';
    document.querySelector('#user-email-display strong').textContent = appState.user.email;
}

// Add navigation buttons to user profile
document.getElementById('profile-dashboard-btn').addEventListener('click', () => {
    authModal.style.display = 'none';
    showDashboard();
});

document.getElementById('profile-analysis-btn').addEventListener('click', () => {
    authModal.style.display = 'none';
    showMainApp();
});

async function loadHistory() {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = data.analyses.map(a => `
            <div class="history-item">
                <div>
                    <p><strong>Score: ${a.overall_score}/100</strong></p>
                    <p>${new Date(a.created_at).toLocaleString()}</p>
                </div>
                <button class="btn btn-secondary btn-small">View</button>
            </div>
        `).join('') || '<p>No analyses yet</p>';

        historyModal.style.display = 'flex';
    } catch (err) {
        console.error('Error loading history:', err);
    }
}

async function saveAnalysisToDatabase(results) {
    try {
        const token = localStorage.getItem('auth_token');
        await fetch(`${API_BASE_URL}/analysis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                pitch_accuracy: results.pitchAccuracy,
                stability: results.stability,
                tone_quality: results.toneQuality,
                resonance: results.resonance,
                overall_score: results.overallScore,
                level: results.level,
                feedback: results.feedback
            })
        });
    } catch (err) {
        console.error('Error saving analysis:', err);
    }
}

// ============================================
// Forgot Password Functionality
// ============================================

const forgotPasswordLink = document.getElementById('forgot-password-link');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const forgotForm = document.getElementById('forgot-form');
const forgotSuccess = document.getElementById('forgot-success');
const forgotCloseBtn = document.getElementById('forgot-close-btn');

// Show forgot password modal
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    authModal.style.display = 'none';
    forgotPasswordModal.classList.add('show');
});

// Close forgot password modal
forgotCloseBtn.addEventListener('click', () => {
    forgotPasswordModal.classList.remove('show');
    forgotForm.style.display = 'block';
    forgotSuccess.style.display = 'none';
    document.getElementById('forgot-email').value = '';
});

// Close modal when clicking outside
forgotPasswordModal.addEventListener('click', (e) => {
    if (e.target === forgotPasswordModal) {
        forgotPasswordModal.classList.remove('show');
        forgotForm.style.display = 'block';
        forgotSuccess.style.display = 'none';
        document.getElementById('forgot-email').value = '';
    }
});

// Handle forgot password form submission
document.getElementById('forgot-submit').addEventListener('click', async () => {
    const email = document.getElementById('forgot-email').value;

    if (!email) {
        alert('Please enter your email address');
        return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    const submitBtn = document.getElementById('forgot-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        const response = await fetch(`${API_BASE_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            forgotForm.style.display = 'none';
            forgotSuccess.style.display = 'block';
        } else {
            alert(data.error || 'Failed to send reset email');
        }
    } catch (err) {
        console.error('Forgot password error:', err);
        alert('An error occurred. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Reset Link';
    }
});

// ============================================
// Dashboard Functionality
// ============================================

async function loadDashboard() {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (response.ok) {
            updateDashboardStats(data.stats);
            updateRecentAnalyses(data.recentAnalyses);
        } else {
            console.error('Error loading dashboard:', data.error);
        }
    } catch (err) {
        console.error('Dashboard error:', err);
    }
}

function updateDashboardStats(stats) {
    document.getElementById('total-analyses').textContent = stats.totalAnalyses || 0;
    document.getElementById('avg-score').textContent = stats.averageScore || 0;
    document.getElementById('best-score').textContent = stats.bestScore || 0;
    document.getElementById('current-level').textContent = stats.currentLevel || 'Beginner';
}

function updateRecentAnalyses(analyses) {
    const recentList = document.getElementById('recent-list');

    if (!analyses || analyses.length === 0) {
        recentList.innerHTML = '<div class="no-analyses">No analyses yet. Start your first vocal analysis!</div>';
        return;
    }

    recentList.innerHTML = analyses.map(analysis => `
        <div class="recent-item" onclick="viewAnalysis(${analysis.id})">
            <div class="recent-item-left">
                <div class="recent-score">${analysis.overall_score}</div>
                <div class="recent-details">
                    <h4>Vocal Analysis</h4>
                    <p>Level: ${analysis.level}</p>
                </div>
            </div>
            <div class="recent-date">${new Date(analysis.created_at).toLocaleDateString()}</div>
        </div>
    `).join('');
}

function viewAnalysis(analysisId) {
    // Navigate to analysis results or show modal with details
    // For now, just show an alert
    alert(`Viewing analysis ${analysisId}`);
}

// Quick action buttons
document.getElementById('new-analysis-btn').addEventListener('click', () => {
    document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('view-history-btn').addEventListener('click', () => {
    loadHistory();
});

// ============================================
// Login Redirect to Dashboard
// ============================================

// Modify signup success to also show dashboard
document.getElementById('signup-submit').addEventListener('click', async () => {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            appState.user = data.user;
            appState.isLoggedIn = true;
            localStorage.setItem('auth_token', data.token);
            authModal.style.display = 'none';
            showDashboard();
            authBtn.textContent = 'Profile ▼';
        } else {
            alert(data.error || 'Signup failed');
        }
    } catch (err) {
        console.error('Signup error:', err);
    }
});
function showDashboard() {
    // Hide main sections
    document.getElementById('hero-section').style.display = 'none';
    document.getElementById('features-section').style.display = 'none';
    document.getElementById('upload-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'none';

    // Show dashboard
    document.getElementById('dashboard-section').style.display = 'block';

    // Load dashboard data
    loadDashboard();
}

// Function to show main app (for navigation)
function showMainApp() {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('hero-section').style.display = 'block';
    document.getElementById('features-section').style.display = 'block';
    document.getElementById('upload-section').style.display = 'block';
    document.getElementById('results-section').style.display = 'none';
}
