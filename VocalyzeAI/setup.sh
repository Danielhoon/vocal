#!/bin/bash
# VocalyzeAI - Setup Script for macOS and Linux
# Run with: bash setup.sh

echo "================================"
echo "VocalyzeAI - Setup Script"
echo "================================"
echo ""

# Check Python installation
echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 not installed"
    echo "Install with: brew install python3 (macOS) or apt-get install python3 (Linux)"
    exit 1
fi

PYTHON_VERSION=$(python3 --version 2>&1)
echo "✓ Found: $PYTHON_VERSION"
echo ""

# Navigate to backend directory
echo "Setting up backend environment..."
cd backend || exit

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo "✓ Virtual environment activated"
echo ""

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt
if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created (modify as needed)"
else
    echo "✓ .env file already exists"
fi
echo ""

# Print next steps
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. The backend will start in 3 seconds..."
echo "2. Keep this terminal open while using the app"
echo "3. Open another terminal for frontend setup:"
echo "   - cd frontend"
echo "   - python3 -m http.server 8000"
echo "4. Visit: http://localhost:8000"
echo ""

sleep 3

echo "Starting Flask backend..."
python app.py
