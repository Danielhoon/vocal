@echo off
REM VocalyzeAI - Production Deployment Script (Windows)
echo 🚀 VocalyzeAI Production Deployment Script
echo ==========================================

REM Check if we're in the right directory
if not exist "docker-compose.yml" (
    echo ❌ Error: Please run this script from the VocalyzeAI root directory
    pause
    exit /b 1
)

REM Check prerequisites
echo 📋 Checking prerequisites...

docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    echo    Visit: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    echo    Visit: https://docs.docker.com/compose/install/
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Create production environment file
echo.
echo 🔧 Setting up production environment...

if not exist "backend\.env" (
    echo 📝 Creating production environment file...
    copy backend\.env.production backend\.env
    echo ⚠️  Please edit backend\.env with your production values before continuing!
    echo    Required: DATABASE_URL, JWT_SECRET_KEY, CORS_ORIGINS
    pause
) else (
    echo ✅ Environment file already exists
)

REM Build and start services
echo.
echo 🏗️  Building and starting services...

docker-compose down 2>nul
docker-compose build --no-cache
docker-compose up -d

REM Wait for services to start
echo.
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if services are running
echo.
echo 🔍 Checking service status...

docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Services are running!
    echo.
    echo 🌐 Service URLs:
    echo    Frontend: http://localhost:8000
    echo    Backend API: http://localhost:5000
    echo    Health Check: http://localhost:5000/api/health
    echo.
    echo 📊 View logs: docker-compose logs -f
    echo 🛑 Stop services: docker-compose down
    echo.
    echo 🎉 Deployment completed successfully!
    echo.
    echo Next steps:
    echo 1. Test your application at http://localhost:8000
    echo 2. Set up a domain name and reverse proxy ^(nginx^)
    echo 3. Configure SSL certificates
    echo 4. Deploy to production server
) else (
    echo ❌ Some services failed to start. Check logs:
    docker-compose logs
    pause
    exit /b 1
)

pause</content>
<parameter name="filePath">c:\Users\ASUS\Downloads\VocalyzeAI\deploy.bat