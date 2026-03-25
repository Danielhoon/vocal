# VocalyzeAI - Windows Setup Script
# Run with: powershell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "================================" -ForegroundColor Cyan
Write-Host "VocalyzeAI - Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check Python installation
Write-Host "Checking Python installation..." -ForegroundColor Yellow
$pythonCheck = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Python not installed or not in PATH" -ForegroundColor Red
    Write-Host "Download from: https://www.python.org/downloads/" -ForegroundColor Green
    exit 1
}
Write-Host "✓ Found: $pythonCheck" -ForegroundColor Green
Write-Host ""

# Navigate to backend directory
Write-Host "Setting up backend environment..." -ForegroundColor Yellow
cd backend

# Check if venv exists
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "Activating virtual environment..."
& "venv\Scripts\Activate.ps1"
Write-Host "✓ Virtual environment activated" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..."
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created (modify as needed)" -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}
Write-Host ""

# Start backend
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. The backend will start in 3 seconds..." -ForegroundColor White
Write-Host "2. Keep this window open while using the app" -ForegroundColor White
Write-Host "3. Open another terminal/PowerShell for frontend" -ForegroundColor White
Write-Host "4. In frontend folder, run: python -m http.server 8000" -ForegroundColor White
Write-Host "5. Visit: http://localhost:8000" -ForegroundColor White
Write-Host ""

Start-Sleep -Seconds 3

Write-Host "Starting Flask backend..." -ForegroundColor Yellow
python app.py
