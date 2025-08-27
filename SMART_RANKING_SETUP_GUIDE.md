# Smart Ranking System - Setup and Running Guide

## 🚀 Quick Start Guide

This guide will help you set up and run the Smart Ranking System in your BioLift project.

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Node.js (v16 or higher)
- ✅ npm or yarn
- ✅ Firebase CLI installed (`npm install -g firebase-tools`)
- ✅ Firebase project created
- ✅ Git repository initialized

## 🔧 Step 1: Install Dependencies

### Frontend Dependencies
```bash
# Install additional dependencies for the Smart Ranking System
npm install @heroicons/react framer-motion
```

### Backend Dependencies
```bash
cd functions
npm install
cd ..
```

## 🔥 Step 2: Firebase Configuration

### 2.1 Initialize Firebase (if not already done)
```bash
firebase login
firebase init
```

### 2.2 Update Firebase Configuration
Make sure your `firebase.json` includes:
```json
{
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 2.3 Set Environment Variables
```bash
firebase functions:config:set admin.token="your-secure-admin-token"
```

## 🗄️ Step 3: Database Setup

### 3.1 Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 3.2 Deploy Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

### 3.3 Initialize Database with Default Data
```bash
# Run the initialization script
node test/ranking-system-test.js --init
```

## ⚙️ Step 4: Deploy Backend

### 4.1 Deploy Cloud Functions
```bash
firebase deploy --only functions
```

### 4.2 Verify Functions Deployment
Check the Firebase Console → Functions to ensure all functions are deployed:
- `onMetricsAdded`
- `onMetricsUpdated`
- `getLeaderboard`
- `getUserRanking`
- `recalculateAllRankings`
- `updateRankingWeights`

## 🎨 Step 5: Frontend Integration

### 5.1 Component Integration
The Smart Ranking System components are now integrated into your existing `Ranking.js` page with three tabs:
- **Leaderboard**: Shows the global leaderboard
- **My Ranking**: Shows individual user ranking and insights
- **Admin**: Admin dashboard (only visible to admins)

### 5.2 Admin Access Setup
To access the admin dashboard, either:
1. Set your user email to `admin@biolift.com` in your user profile
2. Add an `admin` role to your user document in Firestore
3. Navigate directly to `/admin` route

### 5.3 Navigation Integration
The ranking system is accessible through:
- Main navigation: `/ranking`
- Direct admin access: `/admin`

## 🚀 Step 6: Running the System

### 6.1 Local Development
```bash
# Terminal 1: Start React development server
npm start

# Terminal 2: Start Firebase emulators (optional for local testing)
firebase emulators:start
```

### 6.2 Production Deployment
```bash
# Build the React app
npm run build

# Deploy everything
firebase deploy
```

## 📊 Step 7: Testing the System

### 7.1 Run Automated Tests
```bash
# Run the comprehensive test suite
node test/ranking-system-test.js
```

### 7.2 Manual Testing Steps
1. **Create Test Users**: Add some test users with metrics
2. **Add User Metrics**: Use the form or API to add performance data
3. **Check Rankings**: Visit `/ranking` to see the leaderboard
4. **Test Admin Features**: Access `/admin` to adjust weights and recalculate

### 7.3 Sample Test Data
```javascript
// Example user metrics to test with
const testMetrics = {
  maxWeightLifted: 200,
  totalWorkouts: 50,
  averageWorkoutDuration: 45,
  consistencyScore: 85,
  improvementRate: 12.5,
  lastWorkoutDate: new Date(),
  workoutStreak: 7
};
```

## 🔧 Step 8: Configuration

### 8.1 Adjust Ranking Weights
1. Go to `/admin` or `/ranking` → Admin tab
2. Adjust the sliders for:
   - Strength (default: 0.3)
   - Stamina (default: 0.25)
   - Consistency (default: 0.25)
   - Improvement (default: 0.2)
3. Click "Update Weights"

### 8.2 Customize Tier Thresholds
Edit `functions/rankingEngine.js` to modify tier calculations:
```javascript
function calculateTier(rank, totalUsers) {
  if (totalUsers === 0) return "Bronze";
  const percentile = (rank / totalUsers) * 100;
  if (percentile <= 5) return "Diamond";
  if (percentile <= 15) return "Platinum";
  if (percentile <= 30) return "Gold";
  if (percentile <= 50) return "Silver";
  return "Bronze";
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Cloud Functions Not Deploying
```bash
# Check Firebase CLI version
firebase --version

# Clear cache and retry
firebase functions:delete --force
firebase deploy --only functions
```

#### 2. CORS Errors
- Ensure all HTTP functions include CORS headers
- Check that your domain is allowed in Firebase Console

#### 3. Firestore Rules Errors
```bash
# Test rules locally
firebase emulators:start --only firestore

# Deploy rules again
firebase deploy --only firestore:rules
```

#### 4. Component Import Errors
- Ensure all components are in the correct directories
- Check that all dependencies are installed
- Verify import paths are correct

### Debug Mode
Enable debug logging in Cloud Functions:
```javascript
// In functions/index.js
const logger = require('firebase-functions/logger');
logger.info('Debug message');
```

## 📈 Monitoring

### 7.1 Firebase Console Monitoring
- **Functions**: Monitor execution times and errors
- **Firestore**: Check data consistency and usage
- **Analytics**: Track user engagement with rankings

### 7.2 Custom Metrics
The system automatically tracks:
- User score changes
- Ranking updates
- Admin actions
- System performance

## 🔒 Security Considerations

### 7.1 Admin Access
- Use secure admin tokens
- Implement proper role-based access
- Monitor admin actions

### 7.2 Data Protection
- All user data is protected by Firestore rules
- Scores and rankings are calculated server-side
- No sensitive data is exposed to clients

## 📚 API Reference

### Available Endpoints
- `GET /getLeaderboard` - Fetch leaderboard data
- `GET /getUserRanking` - Get user ranking details
- `POST /recalculateAllRankings` - Recalculate all rankings (admin)
- `POST /updateRankingWeights` - Update ranking weights (admin)

### Firestore Triggers
- `onMetricsAdded` - Triggered when new metrics are added
- `onMetricsUpdated` - Triggered when metrics are updated

## 🎯 Next Steps

### 7.1 Advanced Features
- Implement real-time updates with Firestore listeners
- Add push notifications for ranking changes
- Create mobile app integration

### 7.2 Performance Optimization
- Implement caching for leaderboard data
- Optimize score calculation algorithms
- Add database indexing for better performance

### 7.3 Analytics Integration
- Track user engagement with rankings
- Monitor system performance
- Generate insights reports

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the Firebase Console logs
3. Run the test suite to identify problems
4. Check the comprehensive documentation in `SMART_RANKING_SYSTEM_DOCUMENTATION.md`

## 🎉 Success!

Your Smart Ranking System is now fully integrated and running! Users can:
- View dynamic leaderboards
- See their personal rankings and insights
- Admins can manage the system through the dashboard

The system will automatically update rankings as users add new performance metrics, providing a truly dynamic and engaging fitness competition experience.
