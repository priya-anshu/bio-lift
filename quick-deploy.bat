@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Smart Ranking System - Quick Deploy
echo ========================================
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase CLI not found. Please install it first:
    echo npm install -g firebase-tools
    pause
    exit /b 1
)

echo ✅ Firebase CLI found
echo.

REM Check if user is logged in
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please log in to Firebase first:
    firebase login
    echo.
)

echo ✅ Firebase authentication verified
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install
cd functions
npm install
cd ..
echo ✅ Dependencies installed
echo.

REM Deploy Firestore rules and indexes
echo 🗄️ Deploying Firestore configuration...
firebase deploy --only firestore:rules,firestore:indexes
echo ✅ Firestore configuration deployed
echo.

REM Deploy Cloud Functions
echo ⚙️ Deploying Cloud Functions...
firebase deploy --only functions
echo ✅ Cloud Functions deployed
echo.

REM Build and deploy frontend
echo 🎨 Building and deploying frontend...
npm run build
firebase deploy --only hosting
echo ✅ Frontend deployed
echo.

echo ========================================
echo 🎉 Deployment Complete!
echo ========================================
echo.
echo Your Smart Ranking System is now live!
echo.
echo 📍 Access your app at: https://your-project-id.web.app
echo 📊 Ranking page: https://your-project-id.web.app/ranking
echo 🔧 Admin dashboard: https://your-project-id.web.app/admin
echo.
echo 📚 For detailed setup instructions, see: SMART_RANKING_SETUP_GUIDE.md
echo.

pause
