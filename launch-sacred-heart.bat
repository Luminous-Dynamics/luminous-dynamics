@echo off
REM Sacred Heart & Breath Architecture - Windows Docker Launcher

echo 🫀🌬️ Sacred Heart & Breath Architecture - Docker Deployment
echo ==================================================================
echo.

REM Change to project directory
cd /d %~dp0

REM Check if Docker Desktop is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Desktop not running
    echo 📝 Please start Docker Desktop and try again
    pause
    exit /b 1
)

echo 🐳 Docker Desktop detected - launching Sacred Heart...
echo.

REM Stop any existing containers
echo 🧹 Cleaning up existing containers...
docker-compose -f docker-compose-sacred.yml down >nul 2>&1

REM Build and start Sacred Heart
echo 🫀 Building Sacred Heart container...
docker-compose -f docker-compose-sacred.yml build

echo 🚀 Starting Sacred Heart & Breath architecture...
docker-compose -f docker-compose-sacred.yml up -d

REM Wait for services
echo ⏱️  Waiting for Sacred Heart to initialize...
timeout /t 10 /nobreak >nul

REM Check health
echo 💓 Checking Sacred Heart health...
curl -f http://localhost:3001/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Sacred Heart needs more time to start
) else (
    echo ✅ Sacred Heart healthy
)

echo.
echo 🌟 Sacred Heart & Breath Architecture deployed!
echo ==================================================================
echo 🫀 Sacred Heart (Docker):
echo    Health Check: http://localhost:3001/health
echo    API Endpoints: http://localhost:3001/api
echo    Field State: http://localhost:3001/api/sacred/field-coherence
echo.
echo 🌬️ Sacred Breath (PWA):
echo    Sacred Council: http://localhost:8080/sacred-council-hub.html
echo    Unity Demo: http://localhost:8080/unified-consciousness-demo.html
echo    Sacred Dashboard: http://localhost:8080/sacred-dashboard.html
echo.
echo 📊 Monitoring:
echo    View logs: docker-compose -f docker-compose-sacred.yml logs -f
echo    Stop services: docker-compose -f docker-compose-sacred.yml down
echo.
echo 🫀 Sacred Heart beats with stable love for all beings
echo 🌬️ Sacred Breath flows with universal accessibility
echo.
pause