#!/bin/bash
# VocalyzeAI - Production Deployment Script

echo "🚀 VocalyzeAI Production Deployment Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the VocalyzeAI root directory"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command_exists docker-compose; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create production environment file
echo ""
echo "🔧 Setting up production environment..."

if [ ! -f "backend/.env" ]; then
    echo "📝 Creating production environment file..."
    cp backend/.env.production backend/.env
    echo "⚠️  Please edit backend/.env with your production values before continuing!"
    echo "   Required: DATABASE_URL, JWT_SECRET_KEY, CORS_ORIGINS"
    read -p "Press Enter after editing the .env file..."
else
    echo "✅ Environment file already exists"
fi

# Build and start services
echo ""
echo "🏗️  Building and starting services..."

docker-compose down 2>/dev/null
docker-compose build --no-cache
docker-compose up -d

# Wait for services to start
echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo ""
echo "🔍 Checking service status..."

if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "🌐 Service URLs:"
    echo "   Frontend: http://localhost:8000"
    echo "   Backend API: http://localhost:5000"
    echo "   Health Check: http://localhost:5000/api/health"
    echo ""
    echo "📊 View logs: docker-compose logs -f"
    echo "🛑 Stop services: docker-compose down"
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Test your application at http://localhost:8000"
    echo "2. Set up a domain name and reverse proxy (nginx)"
    echo "3. Configure SSL certificates"
    echo "4. Deploy to production server"
else
    echo "❌ Some services failed to start. Check logs:"
    docker-compose logs
    exit 1
fi</content>
<parameter name="filePath">c:\Users\ASUS\Downloads\VocalyzeAI\deploy.sh