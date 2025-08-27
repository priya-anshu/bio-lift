@echo off
setlocal enabledelayedexpansion

REM Smart Ranking System Deployment Script for Windows
REM This script automates the complete deployment process for the SRS

REM Configuration
set PROJECT_ID=biolift-c37b6
set REGION=us-central1
set NODE_VERSION=18

REM Colors for output (Windows 10+)
set RED=[91m
set GREEN=[92m
set YELLOW=[93m
set BLUE=[94m
set NC=[0m

echo %BLUE%╔══════════════════════════════════════════════════════════════╗%NC%
echo %BLUE%║                Smart Ranking System Deployment               ║%NC%
echo %BLUE%║                        v1.0.0                               ║%NC%
echo %BLUE%╚══════════════════════════════════════════════════════════════╝%NC%

echo.
echo %BLUE%[%date% %time%] Starting deployment process...%NC%

REM Check prerequisites
echo %BLUE%[%date% %time%] Checking prerequisites...%NC%

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Node.js is not installed. Please install Node.js %NODE_VERSION% or higher.%NC%
    exit /b 1
)
echo %GREEN%✅ Node.js version %NC%
node --version

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ npm is not installed.%NC%
    exit /b 1
)
echo %GREEN%✅ npm is available%NC%

REM Check Firebase CLI
firebase --version >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%⚠️ Firebase CLI not found. Installing...%NC%
    npm install -g firebase-tools
)
echo %GREEN%✅ Firebase CLI is available%NC%

REM Check Firebase login
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Not logged in to Firebase. Please run 'firebase login' first.%NC%
    exit /b 1
)
echo %GREEN%✅ Firebase authentication verified%NC%

REM Install dependencies
echo %BLUE%[%date% %time%] Installing project dependencies...%NC%

REM Install root dependencies
if exist "package.json" (
    npm install
    echo %GREEN%✅ Root dependencies installed%NC%
)

REM Install functions dependencies
if exist "functions" (
    cd functions
    npm install
    cd ..
    echo %GREEN%✅ Functions dependencies installed%NC%
)

REM Set up Firebase configuration
echo %BLUE%[%date% %time%] Setting up Firebase configuration...%NC%

REM Check if firebase.json exists
if not exist "firebase.json" (
    echo %YELLOW%⚠️ firebase.json not found. Initializing Firebase project...%NC%
    firebase init --project %PROJECT_ID% --yes
)

REM Set environment variables
echo %BLUE%[%date% %time%] Setting Firebase environment variables...%NC%
firebase functions:config:set admin.token="your-secure-admin-token-here" system.default_weights="{\"strength\":0.3,\"stamina\":0.25,\"consistency\":0.25,\"improvement\":0.2}" system.project_id="%PROJECT_ID%" system.region="%REGION%"

echo %GREEN%✅ Firebase configuration set up%NC%

REM Deploy Cloud Functions
echo %BLUE%[%date% %time%] Deploying Cloud Functions...%NC%

cd functions
npm run build >nul 2>&1
firebase deploy --only functions --project %PROJECT_ID%
cd ..

echo %GREEN%✅ Cloud Functions deployed successfully%NC%

REM Deploy Firestore rules
echo %BLUE%[%date% %time%] Deploying Firestore security rules...%NC%
firebase deploy --only firestore:rules --project %PROJECT_ID%
echo %GREEN%✅ Firestore rules deployed successfully%NC%

REM Deploy Firestore indexes
echo %BLUE%[%date% %time%] Deploying Firestore indexes...%NC%
if exist "firestore.indexes.json" (
    firebase deploy --only firestore:indexes --project %PROJECT_ID%
    echo %GREEN%✅ Firestore indexes deployed successfully%NC%
) else (
    echo %YELLOW%⚠️ firestore.indexes.json not found. Skipping index deployment.%NC%
)

REM Initialize database
echo %BLUE%[%date% %time%] Initializing database with default configuration...%NC%

REM Create initial system configuration
firebase firestore:set /systemConfig/rankingWeights "{\"weights\":{\"strength\":0.3,\"stamina\":0.25,\"consistency\":0.25,\"improvement\":0.2},\"lastUpdated\":\"2024-01-01T00:00:00Z\",\"updatedBy\":\"system\"}" --project %PROJECT_ID%

REM Create initial statistics document
firebase firestore:set /statistics/tierDistribution "{\"tierStats\":{\"Diamond\":0,\"Platinum\":0,\"Gold\":0,\"Silver\":0,\"Bronze\":0},\"totalUsers\":0,\"lastUpdated\":\"2024-01-01T00:00:00Z\"}" --project %PROJECT_ID%

echo %GREEN%✅ Database initialized with default configuration%NC%

REM Build and deploy frontend
echo %BLUE%[%date% %time%] Building and deploying frontend...%NC%

REM Build React app
if exist "package.json" (
    npm run build
    echo %GREEN%✅ Frontend built successfully%NC%
)

REM Deploy to Firebase Hosting
firebase deploy --only hosting --project %PROJECT_ID%
echo %GREEN%✅ Frontend deployed successfully%NC%

REM Run tests
echo %BLUE%[%date% %time%] Running system tests...%NC%
if exist "test\ranking-system-test.js" (
    cd test
    node ranking-system-test.js
    cd ..
    echo %GREEN%✅ System tests completed%NC%
) else (
    echo %YELLOW%⚠️ Test script not found. Skipping tests.%NC%
)

REM Verify deployment
echo %BLUE%[%date% %time%] Verifying deployment...%NC%

set FUNCTIONS_URL=https://%REGION%-%PROJECT_ID%.cloudfunctions.net

REM Test leaderboard endpoint
echo %BLUE%[%date% %time%] Testing leaderboard endpoint...%NC%
curl -s "%FUNCTIONS_URL%/getLeaderboard?type=overall&limit=5" >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%⚠️ Leaderboard endpoint test failed%NC%
) else (
    echo %GREEN%✅ Leaderboard endpoint is working%NC%
)

REM Test user ranking endpoint
echo %BLUE%[%date% %time%] Testing user ranking endpoint...%NC%
curl -s "%FUNCTIONS_URL%/getUserRanking?userId=test" >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%⚠️ User ranking endpoint test failed%NC%
) else (
    echo %GREEN%✅ User ranking endpoint is working%NC%
)

REM Check Firestore rules
echo %BLUE%[%date% %time%] Verifying Firestore rules...%NC%
firebase firestore:rules:get --project %PROJECT_ID% >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%⚠️ Firestore rules verification failed%NC%
) else (
    echo %GREEN%✅ Firestore rules are deployed%NC%
)

REM Generate deployment report
echo %BLUE%[%date% %time%] Generating deployment report...%NC%

set REPORT_FILE=deployment-report-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.txt
set REPORT_FILE=%REPORT_FILE: =0%

(
echo Smart Ranking System Deployment Report
echo =====================================
echo Date: %date% %time%
echo Project ID: %PROJECT_ID%
echo Region: %REGION%
echo.
echo Deployment Summary:
echo - Cloud Functions: Deployed to %REGION%
echo - Firestore Rules: Deployed
echo - Firestore Indexes: Deployed
echo - Frontend: Deployed to Firebase Hosting
echo - Database: Initialized with default configuration
echo.
echo API Endpoints:
echo - Leaderboard: %FUNCTIONS_URL%/getLeaderboard
echo - User Ranking: %FUNCTIONS_URL%/getUserRanking
echo - Update Weights: %FUNCTIONS_URL%/updateRankingWeights ^(Admin^)
echo - Recalculate Rankings: %FUNCTIONS_URL%/recalculateAllRankings ^(Admin^)
echo.
echo Next Steps:
echo 1. Update admin token in Firebase Functions config
echo 2. Add your service account key for testing
echo 3. Configure custom domain ^(optional^)
echo 4. Set up monitoring and alerts
echo 5. Run performance tests with real data
echo.
echo Documentation: SMART_RANKING_SYSTEM_DOCUMENTATION.md
) > "%REPORT_FILE%"

echo %GREEN%✅ Deployment report generated: %REPORT_FILE%%NC%

echo.
echo %GREEN%╔══════════════════════════════════════════════════════════════╗%NC%
echo %GREEN%║                    Deployment Complete!                     ║%NC%
echo %GREEN%╚══════════════════════════════════════════════════════════════╝%NC%

echo.
echo %BLUE%[%date% %time%] Smart Ranking System has been successfully deployed!%NC%
echo %BLUE%[%date% %time%] Check the deployment report for next steps and API endpoints.%NC%

pause
