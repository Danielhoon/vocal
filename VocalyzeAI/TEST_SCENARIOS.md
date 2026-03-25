# VocalyzeAI - Test Scenarios & Validation Guide

## 🧪 Complete Testing Walkthrough

Follow this guide to test every feature of VocalyzeAI.

### ⏱️ Total Time: ~30 minutes

---

## Phase 1: Setup Verification (5 minutes)

### Step 1.1: Check Python Installation
```bash
python --version
# Should show Python 3.8 or higher
```

### Step 1.2: Check Backend is Running
```
Open: http://localhost:5000/api/health
Expected: {"status": "healthy"}
```

### Step 1.3: Check Frontend is Accessible
```
Open: http://localhost:8000
Expected: VocalyzeAI logo and "Analyze Your Singing with AI" title
```

### Step 1.4: Verify Database Created
```bash
# Windows
cd backend
dir vocalyzeai.db

# macOS/Linux
cd backend
ls vocalyzeai.db
```

**✅ If all pass, setup is correct**

---

## Phase 2: Frontend UI Testing (5 minutes)

### Step 2.1: Test Hero Section
- [ ] Page loads without errors
- [ ] Hero section is centered
- [ ] Both buttons visible: "Start Analysis" & "Try Demo"
- [ ] Navigation bar is sticky
- [ ] Language selector shows options

### Step 2.2: Test Navigation
- [ ] Click "How It Works" → Scrolls to section
- [ ] Click "Pricing" → Scrolls to pricing cards
- [ ] All links are clickable

### Step 2.3: Test Demo Button
- [ ] Click "Try Demo"
- [ ] Upload area becomes visible
- [ ] Can see the demo analysis
- [ ] Results show:
  - Pitch Accuracy: 82%
  - Stability: Medium
  - Tone Quality: Good
  - Overall Score: 79/100 (Intermediate level)

### Step 2.4: Test Language Switching
- [ ] Dropdown shows: English, 中文
- [ ] Select "中文" (Chinese)
- [ ] All text updates to Chinese:
  - "分析你的歌声用AI"
  - "你的声乐报告"
- [ ] Switch back to English
- [ ] All text returns to English

**✅ If all pass, frontend is working**

---

## Phase 3: Authentication Testing (10 minutes)

### Step 3.1: Sign Up
1. Click "Sign In" button
2. Click "Sign up" link
3. Fill signup form:
   ```
   Full Name: Test User
   Email: testuser@example.com
   Password: TestPassword123
   ```
4. Click "Sign Up"

**Expected Results:**
- [ ] Account created successfully
- [ ] Modal closes
- [ ] "Sign In" button changes to "Profile ▼"
- [ ] Can see "Your Profile" section in database

### Step 3.2: Login Test
1. Refresh page (clears session)
2. Click "Profile ▼" → shows log out
3. Click "Logout"
4. Sign in again with test credentials

**Expected Results:**
- [ ] Login successful
- [ ] Profile displays "testuser@example.com"
- [ ] Shows "Total Analyses: 0"

### Step 3.3: Authorization Test
1. Open Browser DevTools (F12)
2. Go to Application tab
3. Check LocalStorage
4. Should see "auth_token" key

**Expected Results:**
- [ ] JWT token stored in localStorage
- [ ] Token expires in 30 days

**✅ If all pass, authentication works**

---

## Phase 4: Audio Upload Testing (5 minutes)

### Step 4.1: Missing Audio File
1. Click "Start Analysis"
2. Click upload area without selecting file

**Expected:** No error, file input ready

### Step 4.2: Upload Test
1. Click upload area
2. Select an MP3 or WAV file
3. File selected

**Expected:**
- [ ] File name appears (or visual feedback)
- [ ] Analysis starts automatically
- [ ] Loading spinner appears

### Step 4.3: Analysis Results Display
After analysis completes (2-3 seconds):

**Check all metrics display:**
- [ ] Pitch Accuracy Shows percentage (0-100%)
- [ ] Stability Shows text (Low/Medium/High)
- [ ] Tone Quality Shows text (Poor/Fair/Good/Excellent)
- [ ] Resonance Shows percentage (0-100%)
- [ ] Overall Score Shows number/100 with level

**Check feedback section:**
- [ ] AI Feedback contains text
- [ ] Suggestions show 3 items
- [ ] All buttons visible: Share, Download, Try Again

### Step 4.4: File Size Validation
1. Try uploading file > 10MB
2. Should see warning: "File size must be ≤ 10MB"

**✅ If all pass, file upload works**

---

## Phase 5: Recording Testing (5 minutes)

### Step 5.1: Permission Check
1. Click "Start Analysis"
2. Click "Or Record Now"
3. Click "🎤 Start Recording"

**Expected:**
- [ ] Browser asks for microphone permission
- [ ] Allow microphone access
- [ ] Recording indicator appears with pulse animation
- [ ] "Recording..." text shows

### Step 5.2: Record Audio
1. Speak or sing into microphone for 5-10 seconds
2. Click "⏹ Stop Recording"

**Expected:**
- [ ] Recording stops
- [ ] Indicator disappears
- [ ] Analysis starts automatically
- [ ] Results display after 2-3 seconds

### Step 5.3: Check Analysis From Recording
- [ ] All metrics display values
- [ ] Results make sense for your voice
- [ ] Feedback is relevant

**✅ If all pass, recording works**

---

## Phase 6: Results Management (3 minutes)

### Step 6.1: Download Report
1. From analysis results, click "⬇️ Download Report"

**Expected:**
- [ ] Download dialog appears
- [ ] File named `VocalyzeAI_Report_[timestamp].txt`
- [ ] Contains:
  - Your score
  - All metrics
  - Feedback
  - Suggestions
  - Timestamp

### Step 6.2: Share Results
1. Click "📤 Share Results"

**Expected (varies by browser):**
- [ ] Share dialog appears, OR
- [ ] Result text displayed to copy
- [ ] Can share to social media (if supported)

### Step 6.3: Try Again
1. Click "🎤 Try Again"
2. Returns to upload screen

**Expected:**
- [ ] Results hidden
- [ ] Upload area shown again
- [ ] Can upload another file

**✅ If all pass, results management works**

---

## Phase 7: History Testing (3 minutes)

### Step 7.1: Save Analyses
1. Upload/record audio and complete analysis
2. View results (should be saved since you're logged in)
3. Repeat with different audio 2-3 more times

### Step 7.2: View History
1. Click "Profile ▼"
2. Click "View History"

**Expected in History Modal:**
- [ ] Shows all previous analyses
- [ ] Each shows score and date
- [ ] Shows in reverse chronological order
- [ ] Total count correct

### Step 7.3: History Entry Details
1. Click on a history entry

**Expected:**
- [ ] Shows full analysis data
- [ ] All metrics visible
- [ ] Feedback displayed
- [ ] Can close modal

**✅ If all pass, history works**

---

## Phase 8: Mobile Responsiveness (3 minutes)

### Step 8.1: Mobile View
1. Open DevTools (F12)
2. Click device toggle (mobile icon)
3. Select iPhone 12 or similar

**Check these breakpoints:**
- [ ] 375px (Mobile) - Single column
- [ ] 768px (Tablet) - 2 columns
- [ ] 1024px (Desktop) - 3+ columns

### Step 8.2: Mobile Functionality
1. Try upload on mobile view
2. Try recording on mobile view
3. Try language switching

**Expected:**
- [ ] All features work
- [ ] No horizontal scroll
- [ ] Buttons are touch-friendly
- [ ] Text readable

### Step 8.3: Real Mobile Testing
1. Get mobile phone (iPhone/Android)
2. Open DevTools on phone
3. Visit http://localhost:8000 (or public URL)

**Expected:**
- [ ] Microphone access works
- [ ] Analysis completes
- [ ] Results display correctly
- [ ] Smooth interactions

**✅ If all pass, mobile design works**

---

## Phase 9: Data Persistence (2 minutes)

### Step 9.1: Database Test
1. Upload audio and get analysis
2. Restart backend: Kill Python process and restart

**Expected:**
- [ ] Analysis still appears in history
- [ ] User account still exists
- [ ] Data persisted to database

### Step 9.2: LocalStorage Test
1. Open DevTools (F12)
2. Application → LocalStorage
3. Look for stored items:
   - `language`: en or zh
   - `auth_token`: JWT token

**Expected:**
- [ ] Language preference preserved
- [ ] Token available for API calls

**✅ If all pass, data persistence works**

---

## Phase 10: Error Handling (2 minutes)

### Step 10.1: Network Error Test
1. Stop backend server
2. Try to sign in with new credentials
3. Try to upload audio

**Expected:**
- [ ] Error message displays
- [ ] "Error connecting to API"
- [ ] UI doesn't crash
- [ ] Can retry

### Step 10.2: Invalid Input Test
1. Show error for empty password
2. Show error for invalid email
3. Show error for mismatched passwords

**Expected:**
- [ ] Form validation works
- [ ] Clear error messages

### Step 10.3: Large File Test
1. Create test file > 10MB
2. Try to upload

**Expected:**
- [ ] Shows warning: "File size must be ≤ 10MB"
- [ ] Upload blocked

**✅ If all pass, error handling works**

---

## Phase 11: Performance Testing (2 minutes)

### Step 11.1: Load Time
1. Open DevTools (F12) → Performance tab
2. Refresh page
3. Measure load time

**Target:** < 2 seconds

### Step 11.2: Analysis Speed
1. Upload audio file
2. Measure time to complete analysis
3. Time from upload start to results display

**Target:** < 5 seconds

### Step 11.3: API Response
1. Open DevTools → Network tab
2. Refresh page
3. Check API call durations

**Target:** < 500ms per request

**✅ If times acceptable, performance is good**

---

## Phase 12: Browser Compatibility (2 minutes)

Test in each available browser:

### Chrome / Edge
- [ ] Page loads
- [ ] Audio analysis works
- [ ] Recording works
- [ ] No console errors
- [ ] Performance: Excellent

### Firefox
- [ ] Page loads
- [ ] Audio analysis works
- [ ] Recording works
- [ ] No console errors
- [ ] Performance: Good

### Safari (macOS/iOS)
- [ ] Page loads
- [ ] Recording requires HTTPS
- [ ] Audio analysis works
- [ ] No console errors
- [ ] Performance: Good

**✅ If all browsers work, compatibility confirmed**

---

## 🐛 Debugging Checklist

If anything fails:

### Frontend Issues
```javascript
// In browser console (F12)
console.log(appState)  // Check app state
console.log(audioAnalyzer)  // Check analyzer setup
fetch('http://localhost:5000/api/health').then(r => r.json()).then(console.log)
```

### Backend Issues
```bash
# Check if running
curl http://localhost:5000/api/health

# View logs
tail -f backend/venv/Scripts/python.log

# Reset database
rm backend/vocalyzeai.db
python backend/app.py
```

### Audio Issues
```javascript
// In console
navigator.mediaDevices.enumerateDevices()  // Check microphone
```

---

## 📋 Summary Test Results

Fill in your test results:

```
Phase 1 (Setup): ✅ ☐ ❌
Phase 2 (UI): ✅ ☐ ❌
Phase 3 (Auth): ✅ ☐ ❌
Phase 4 (Upload): ✅ ☐ ❌
Phase 5 (Recording): ✅ ☐ ❌
Phase 6 (Results): ✅ ☐ ❌
Phase 7 (History): ✅ ☐ ❌
Phase 8 (Mobile): ✅ ☐ ❌
Phase 9 (Persistence): ✅ ☐ ❌
Phase 10 (Errors): ✅ ☐ ❌
Phase 11 (Performance): ✅ ☐ ❌
Phase 12 (Compatibility): ✅ ☐ ❌

Overall: ✅ ☐ ❌
```

---

## ✅ Success Criteria

**If ALL phases pass: ✨ System is fully functional!**

You can now:
- ✅ Deploy to production
- ✅ Add users to beta testing
- ✅ Collect feedback
- ✅ Iterate on features

---

## 🎉 Next Steps After Testing

1. **Deploy to Production**
   - Follow deployment section in README.md
   - Set up HTTPS/SSL
   - Configure domain

2. **Gather User Feedback**
   - Share with beta testers
   - Collect feedback
   - Track issues

3. **Monitor Performance**
   - Set up analytics
   - Monitor error rates
   - Track usage patterns

4. **Make Improvements**
   - Fix bugs from feedback
   - Optimize performance
   - Add requested features

---

**Happy Testing! 🎤**

For issues, check:
- Browser console (F12)
- Backend terminal output
- README.md troubleshooting section
