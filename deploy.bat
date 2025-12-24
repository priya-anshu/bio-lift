@echo off
echo ========================================
echo BioLift - Quick Deploy to Firebase
echo ========================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Build React app
echo 📦 Building React app...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
)
echo ✅ Build complete!
echo.

REM Deploy to Firebase
echo 🚀 Deploying to Firebase...
call firebase deploy --only hosting
if errorlevel 1 (
    echo ❌ Deployment failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo 🎉 Deployment Complete!
echo ========================================
echo.
echo Your app is live at: https://biolift-c37b6.web.app
echo.
pause

