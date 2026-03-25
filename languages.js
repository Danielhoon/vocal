// ============================================
// VocalyzeAI - Language Support
// ============================================

const translations = {
    en: {
        // Hero Section
        "hero-title": "Analyze Your Singing with AI",
        "hero-subtitle": "Get instant feedback on your pitch, tone, and vocal performance — in seconds.",
        
        // How It Works
        "how-title": "How It Works",
        "step1-title": "Upload Your Voice",
        "step1-desc": "Record or upload your audio file in MP3/WAV format",
        "step2-title": "AI Analyzes Performance",
        "step2-desc": "Our AI analyzes pitch, tone, stability, and more",
        "step3-title": "Get Instant Feedback",
        "step3-desc": "Receive personalized recommendations to improve",
        
        // Upload Section
        "upload-title": "Upload Your Audio",
        "drag-desc": "Drag and drop your audio file here or click to select",
        "rec-title": "Or Record Now",
        "recording-text": "Recording...",
        
        // Results
        "results-title": "Your Vocal Report",
        "pitch-label": "Pitch Accuracy",
        "stability-label": "Vocal Stability",
        "tone-label": "Tone Quality",
        "resonance-label": "Resonance",
        "overall-label": "Overall Score",
        "feedback-title": "AI Feedback",
        "suggestions-title": "Improvement Tips",
        
        // Why Us
        "why-title": "Why VocalyzeAI?",
        "feature1-title": "Instant AI Feedback",
        "feature1-desc": "Get real-time analysis of your vocal performance",
        "feature2-title": "No Vocal Coach Needed",
        "feature2-desc": "Affordable access to professional vocal guidance",
        "feature3-title": "Data-Driven Insights",
        "feature3-desc": "Track your progress with detailed analytics",
        "feature4-title": "Fast and Easy to Use",
        "feature4-desc": "3 simple steps to improve your singing",
        
        // Pricing
        "pricing-title": "Pricing Plans",
        "free-plan": "Free",
        "pro-plan": "Pro",
        "pro-plus-plan": "Pro Plus",
        
        // CTA
        "cta-title": "Ready to Improve Your Voice?",
        "cta-subtitle": "Join thousands of singers already using VocalyzeAI",
        "tagline": "Powered by AI-driven vocal analysis technology",
        
        // Auth
        "login-title": "Sign In",
        "signup-title": "Sign Up",
        "profile-title": "Profile",
        "history-title": "Analysis History",
        
        // Levels
        "level-beginner": "Beginner",
        "level-intermediate": "Intermediate",
        "level-advanced": "Advanced",
        "level-expert": "Expert",
        
        // Stability
        "stability-low": "Low",
        "stability-medium": "Medium",
        "stability-high": "High",
        
        // Tone
        "tone-poor": "Poor",
        "tone-fair": "Fair",
        "tone-good": "Good",
        "tone-excellent": "Excellent",
        
        // Loading
        "loading-text": "Analyzing your vocal performance...",
        
        // Error Messages
        "file-size-warning": "File size must be ≤ 10MB",
        "error-upload": "Error uploading file. Please try again.",
        "error-analysis": "Error analyzing audio. Please try again.",
        
        // Success Messages
        "success-upload": "File uploaded successfully!",
        "success-analysis": "Analysis complete!",
    },
    
    zh: {
        // Hero Section
        "hero-title": "用AI分析你的歌声",
        "hero-subtitle": "立即获得关于你的音高、音色和声乐表现的反馈 — 只需几秒钟。",
        
        // How It Works
        "how-title": "工作原理",
        "step1-title": "上传你的声音",
        "step1-desc": "录音或上传MP3/WAV格式的音频文件",
        "step2-title": "AI分析表现",
        "step2-desc": "我们的AI分析音准、音色、稳定性等",
        "step3-title": "获得即时反馈",
        "step3-desc": "收到个性化建议以改进你的歌声",
        
        // Upload Section
        "upload-title": "上传你的音频",
        "drag-desc": "将音频文件拖放到此处或点击选择",
        "rec-title": "或现在录音",
        "recording-text": "录音中...",
        
        // Results
        "results-title": "你的声乐报告",
        "pitch-label": "音高准确度",
        "stability-label": "声音稳定性",
        "tone-label": "音质",
        "resonance-label": "共鸣",
        "overall-label": "总体评分",
        "feedback-title": "AI反馈",
        "suggestions-title": "改进建议",
        
        // Why Us
        "why-title": "为什么选择VocalyzeAI？",
        "feature1-title": "即时AI反馈",
        "feature1-desc": "获得实时的声乐表现分析",
        "feature2-title": "不需要声乐教练",
        "feature2-desc": "以经济实惠的方式获得专业声乐指导",
        "feature3-title": "数据驱动的见解",
        "feature3-desc": "使用详细的分析跟踪你的进度",
        "feature4-title": "快速且易于使用",
        "feature4-desc": "3个简单步骤改进你的歌声",
        
        // Pricing
        "pricing-title": "价格计划",
        "free-plan": "免费版",
        "pro-plan": "专业版",
        "pro-plus-plan": "专业增强版",
        
        // CTA
        "cta-title": "准备改进你的歌声了吗？",
        "cta-subtitle": "加入数千名已经使用VocalyzeAI的歌手",
        "tagline": "采用AI驱动的声乐分析技术",
        
        // Auth
        "login-title": "登录",
        "signup-title": "注册",
        "profile-title": "个人资料",
        "history-title": "分析历史",
        
        // Levels
        "level-beginner": "初级",
        "level-intermediate": "中级",
        "level-advanced": "高级",
        "level-expert": "专家",
        
        // Stability
        "stability-low": "低",
        "stability-medium": "中等",
        "stability-high": "高",
        
        // Tone
        "tone-poor": "差",
        "tone-fair": "一般",
        "tone-good": "良好",
        "tone-excellent": "优秀",
        
        // Loading
        "loading-text": "正在分析你的声乐表现...",
        
        // Error Messages
        "file-size-warning": "文件大小必须≤10MB",
        "error-upload": "上传文件出错。请重试。",
        "error-analysis": "分析音频出错。请重试。",
        
        // Success Messages
        "success-upload": "文件上传成功！",
        "success-analysis": "分析完成！",
    }
};

let currentLanguage = localStorage.getItem('language') || 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updatePageTranslations();
}

function getTranslation(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

function updatePageTranslations() {
    // Update all elements with translation keys
    document.querySelectorAll('[id]').forEach(element => {
        const key = element.id;
        if (translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = getTranslation(key);
            } else if (element.tagName === 'BUTTON' && !element.textContent.match(/[🎤⏹📤⬇️]/)) {
                element.textContent = getTranslation(key);
            } else if (!element.classList.contains('step') && 
                       !element.classList.contains('feature') && 
                       !element.classList.contains('pricing-card')) {
                element.textContent = getTranslation(key);
            }
        }
    });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('language-select').value = currentLanguage;
    updatePageTranslations();
});

// Language selector change event
document.getElementById('language-select').addEventListener('change', (e) => {
    setLanguage(e.target.value);
});
