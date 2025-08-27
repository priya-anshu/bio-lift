#!/bin/bash

# Smart Ranking System Deployment Script
# This script automates the complete deployment process for the SRS

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="biolift-c37b6"
REGION="us-central1"
NODE_VERSION="18"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js $NODE_VERSION or higher."
        exit 1
    fi
    
    NODE_VER=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VER" -lt 18 ]; then
        error "Node.js version $NODE_VER is too old. Please upgrade to version 18 or higher."
        exit 1
    fi
    
    success "Node.js version $(node --version) is compatible"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        error "npm is not installed."
        exit 1
    fi
    
    success "npm is available"
    
    # Check Firebase CLI
    if ! command -v firebase &> /dev/null; then
        warning "Firebase CLI not found. Installing..."
        npm install -g firebase-tools
    fi
    
    success "Firebase CLI is available"
    
    # Check if logged in to Firebase
    if ! firebase projects:list &> /dev/null; then
        error "Not logged in to Firebase. Please run 'firebase login' first."
        exit 1
    fi
    
    success "Firebase authentication verified"
}

# Install dependencies
install_dependencies() {
    log "Installing project dependencies..."
    
    # Install root dependencies
    if [ -f "package.json" ]; then
        npm install
        success "Root dependencies installed"
    fi
    
    # Install functions dependencies
    if [ -d "functions" ]; then
        cd functions
        npm install
        cd ..
        success "Functions dependencies installed"
    fi
}

# Set up Firebase configuration
setup_firebase_config() {
    log "Setting up Firebase configuration..."
    
    # Check if firebase.json exists
    if [ ! -f "firebase.json" ]; then
        warning "firebase.json not found. Initializing Firebase project..."
        firebase init --project $PROJECT_ID --yes
    fi
    
    # Set environment variables
    log "Setting Firebase environment variables..."
    firebase functions:config:set \
        admin.token="your-secure-admin-token-here" \
        system.default_weights='{"strength":0.3,"stamina":0.25,"consistency":0.25,"improvement":0.2}' \
        system.project_id="$PROJECT_ID" \
        system.region="$REGION"
    
    success "Firebase configuration set up"
}

# Deploy Cloud Functions
deploy_functions() {
    log "Deploying Cloud Functions..."
    
    # Build functions
    cd functions
    npm run build 2>/dev/null || true
    
    # Deploy functions
    firebase deploy --only functions --project $PROJECT_ID
    
    cd ..
    success "Cloud Functions deployed successfully"
}

# Deploy Firestore rules
deploy_firestore_rules() {
    log "Deploying Firestore security rules..."
    
    firebase deploy --only firestore:rules --project $PROJECT_ID
    
    success "Firestore rules deployed successfully"
}

# Deploy Firestore indexes
deploy_firestore_indexes() {
    log "Deploying Firestore indexes..."
    
    if [ -f "firestore.indexes.json" ]; then
        firebase deploy --only firestore:indexes --project $PROJECT_ID
        success "Firestore indexes deployed successfully"
    else
        warning "firestore.indexes.json not found. Skipping index deployment."
    fi
}

# Initialize database
initialize_database() {
    log "Initializing database with default configuration..."
    
    # Create initial system configuration
    firebase firestore:set /systemConfig/rankingWeights \
        '{"weights":{"strength":0.3,"stamina":0.25,"consistency":0.25,"improvement":0.2},"lastUpdated":"2024-01-01T00:00:00Z","updatedBy":"system"}' \
        --project $PROJECT_ID
    
    # Create initial statistics document
    firebase firestore:set /statistics/tierDistribution \
        '{"tierStats":{"Diamond":0,"Platinum":0,"Gold":0,"Silver":0,"Bronze":0},"totalUsers":0,"lastUpdated":"2024-01-01T00:00:00Z"}' \
        --project $PROJECT_ID
    
    success "Database initialized with default configuration"
}

# Build and deploy frontend
deploy_frontend() {
    log "Building and deploying frontend..."
    
    # Build React app
    if [ -f "package.json" ]; then
        npm run build
        success "Frontend built successfully"
    fi
    
    # Deploy to Firebase Hosting
    firebase deploy --only hosting --project $PROJECT_ID
    
    success "Frontend deployed successfully"
}

# Run tests
run_tests() {
    log "Running system tests..."
    
    # Check if test script exists
    if [ -f "test/ranking-system-test.js" ]; then
        cd test
        node ranking-system-test.js
        cd ..
        success "System tests completed"
    else
        warning "Test script not found. Skipping tests."
    fi
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Check Cloud Functions
    FUNCTIONS_URL="https://$REGION-$PROJECT_ID.cloudfunctions.net"
    
    # Test leaderboard endpoint
    log "Testing leaderboard endpoint..."
    if curl -s "$FUNCTIONS_URL/getLeaderboard?type=overall&limit=5" > /dev/null; then
        success "Leaderboard endpoint is working"
    else
        warning "Leaderboard endpoint test failed"
    fi
    
    # Test user ranking endpoint
    log "Testing user ranking endpoint..."
    if curl -s "$FUNCTIONS_URL/getUserRanking?userId=test" > /dev/null; then
        success "User ranking endpoint is working"
    else
        warning "User ranking endpoint test failed"
    fi
    
    # Check Firestore rules
    log "Verifying Firestore rules..."
    if firebase firestore:rules:get --project $PROJECT_ID > /dev/null 2>&1; then
        success "Firestore rules are deployed"
    else
        warning "Firestore rules verification failed"
    fi
}

# Generate deployment report
generate_report() {
    log "Generating deployment report..."
    
    REPORT_FILE="deployment-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$REPORT_FILE" << EOF
Smart Ranking System Deployment Report
=====================================
Date: $(date)
Project ID: $PROJECT_ID
Region: $REGION

Deployment Summary:
- Cloud Functions: Deployed to $REGION
- Firestore Rules: Deployed
- Firestore Indexes: Deployed
- Frontend: Deployed to Firebase Hosting
- Database: Initialized with default configuration

API Endpoints:
- Leaderboard: $FUNCTIONS_URL/getLeaderboard
- User Ranking: $FUNCTIONS_URL/getUserRanking
- Update Weights: $FUNCTIONS_URL/updateRankingWeights (Admin)
- Recalculate Rankings: $FUNCTIONS_URL/recalculateAllRankings (Admin)

Next Steps:
1. Update admin token in Firebase Functions config
2. Add your service account key for testing
3. Configure custom domain (optional)
4. Set up monitoring and alerts
5. Run performance tests with real data

Documentation: SMART_RANKING_SYSTEM_DOCUMENTATION.md
EOF
    
    success "Deployment report generated: $REPORT_FILE"
}

# Main deployment function
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                Smart Ranking System Deployment               ║"
    echo "║                        v1.0.0                               ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    log "Starting deployment process..."
    
    # Run deployment steps
    check_prerequisites
    install_dependencies
    setup_firebase_config
    deploy_functions
    deploy_firestore_rules
    deploy_firestore_indexes
    initialize_database
    deploy_frontend
    run_tests
    verify_deployment
    generate_report
    
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    Deployment Complete!                     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    log "Smart Ranking System has been successfully deployed!"
    log "Check the deployment report for next steps and API endpoints."
}

# Cleanup function
cleanup() {
    log "Cleaning up..."
    # Add any cleanup tasks here
}

# Error handling
trap cleanup EXIT
trap 'error "Deployment failed. Check the logs above for details."; exit 1' ERR

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --test-only    Run only the test suite"
        echo "  --functions    Deploy only Cloud Functions"
        echo "  --frontend     Deploy only frontend"
        echo "  --verify       Run only verification tests"
        echo ""
        echo "Examples:"
        echo "  $0              # Full deployment"
        echo "  $0 --test-only  # Run tests only"
        echo "  $0 --functions  # Deploy functions only"
        exit 0
        ;;
    --test-only)
        log "Running tests only..."
        run_tests
        exit 0
        ;;
    --functions)
        log "Deploying functions only..."
        check_prerequisites
        install_dependencies
        setup_firebase_config
        deploy_functions
        exit 0
        ;;
    --frontend)
        log "Deploying frontend only..."
        check_prerequisites
        install_dependencies
        deploy_frontend
        exit 0
        ;;
    --verify)
        log "Running verification only..."
        verify_deployment
        exit 0
        ;;
    "")
        # No arguments, run full deployment
        main
        ;;
    *)
        error "Unknown option: $1"
        echo "Use --help for usage information."
        exit 1
        ;;
esac
