# Smart Ranking System (SRS) Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Database Schema](#database-schema)
3. [Ranking Formula](#ranking-formula)
4. [API Endpoints](#api-endpoints)
5. [Deployment Instructions](#deployment-instructions)
6. [Usage Examples](#usage-examples)
7. [Testing Guide](#testing-guide)
8. [Troubleshooting](#troubleshooting)

## System Overview

The Smart Ranking System (SRS) is a comprehensive, real-time ranking and leaderboard system for fitness applications. It calculates user scores based on multiple performance factors and provides dynamic rankings with tier-based progression.

### Key Features
- **Multi-factor Scoring**: Combines strength, stamina, consistency, and improvement metrics
- **Real-time Updates**: Automatic ranking updates when user data changes
- **Tier System**: Diamond, Platinum, Gold, Silver, Bronze tiers based on percentile
- **Multiple Timeframes**: Overall, weekly, and monthly rankings
- **Personalized Insights**: AI-generated recommendations for improvement
- **Admin Dashboard**: Weight management and system monitoring
- **Comprehensive Security**: Role-based access control and data validation

### Architecture
- **Frontend**: React.js with Tailwind CSS and Framer Motion
- **Backend**: Firebase Cloud Functions (Node.js)
- **Database**: Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Real-time Updates**: Firestore triggers

## Database Schema

### Collections Overview

#### 1. `users/{userId}`
User profile information.
```javascript
{
  displayName: string,
  email: string,
  photoURL: string,
  createdAt: timestamp,
  lastLoginAt: timestamp,
  preferences: {
    privacyLevel: 'public' | 'private' | 'friends',
    notifications: boolean,
    theme: 'light' | 'dark'
  }
}
```

#### 2. `userMetrics/{userId}`
Current user performance metrics.
```javascript
{
  userId: string,
  timestamp: timestamp,
  
  // Strength metrics
  maxWeightLifted: number,      // kg
  oneRepMax: number,           // kg
  totalWeightLifted: number,   // kg
  bodyWeight: number,          // kg
  strengthExercises: string[],
  
  // Stamina metrics
  workoutDuration: number,     // minutes
  cardioMinutes: number,       // minutes
  restTimeBetweenSets: number, // seconds
  enduranceExercises: string[],
  heartRateData: number[],     // bpm array
  maxHeartRate: number,        // bpm
  
  // Consistency metrics
  workoutStreak: number,       // consecutive days
  totalWorkouts: number,
  daysSinceStart: number,
  missedWorkouts: number,
  workoutFrequency: number,    // workouts per week
  lastWorkoutDate: timestamp,
  
  // Additional metrics
  caloriesBurned: number,
  workoutIntensity: number,    // 1-10 scale
  workoutSatisfaction: number, // 1-10 scale
  customMetrics: object        // key-value pairs
}
```

#### 3. `userScores/{userId}`
Calculated user scores and rankings.
```javascript
{
  userId: string,
  score: number,               // Total weighted score (0-100)
  strengthScore: number,       // Individual category scores
  staminaScore: number,
  consistencyScore: number,
  improvementScore: number,
  lastUpdated: timestamp,
  metrics: object              // Reference to metrics used
}
```

#### 4. `rankings/{rankingType}`
Leaderboard data for different timeframes.
```javascript
{
  rankings: [
    {
      userId: string,
      rank: number,
      score: number,
      tier: string,
      strengthScore: number,
      staminaScore: number,
      consistencyScore: number,
      improvementScore: number,
      lastUpdated: timestamp
    }
  ],
  lastUpdated: timestamp,
  totalUsers: number,
  period: {
    start: timestamp,
    end: timestamp
  },
  metadata: {
    type: string,
    description: string
  }
}
```

#### 5. `systemConfig/{configId}`
System configuration and weights.
```javascript
{
  weights: {
    strength: number,      // 0-1, must sum to 1.0
    stamina: number,
    consistency: number,
    improvement: number
  },
  lastUpdated: timestamp,
  updatedBy: string
}
```

#### 6. `scoreBreakdowns/{userId}`
Detailed score calculation breakdowns.
```javascript
{
  userId: string,
  strengthScore: number,
  staminaScore: number,
  consistencyScore: number,
  improvementScore: number,
  totalScore: number,
  weights: object,
  calculatedAt: timestamp
}
```

#### 7. `userMetricsHistory/{userId}/snapshots/{snapshotId}`
Historical metrics for improvement calculations.
```javascript
{
  timestamp: timestamp,
  metrics: object,         // Snapshot of userMetrics
  score: number,
  rank: number
}
```

#### 8. `statistics/{statId}`
System statistics and analytics.
```javascript
{
  tierDistribution: {
    tierStats: {
      Diamond: number,
      Platinum: number,
      Gold: number,
      Silver: number,
      Bronze: number
    },
    totalUsers: number,
    lastUpdated: timestamp
  }
}
```

## Ranking Formula

### Score Calculation

The total score is calculated using a weighted formula:

```
Total Score = (Strength × W₁) + (Stamina × W₂) + (Consistency × W₃) + (Improvement × W₄)
```

Where W₁ + W₂ + W₃ + W₄ = 1.0

### Individual Category Scores

#### 1. Strength Score (0-100)
```
Strength Score = min(100, 
  (Weight-to-Body Ratio × 25) +     // Max 50 points
  (One-Rep Max ÷ 10) +              // Max 30 points
  (Total Weight Lifted ÷ 1000)      // Max 20 points
)
```

#### 2. Stamina Score (0-100)
```
Stamina Score = min(100,
  (Workout Duration ÷ 2) +           // Max 30 points
  (Cardio Minutes ÷ 3) +             // Max 25 points
  (Rest Efficiency × 20) +           // Max 20 points
  (Heart Rate Efficiency × 25)       // Max 25 points
)
```

#### 3. Consistency Score (0-100)
```
Consistency Score = min(100,
  (Workout Streak × 2) +             // Max 40 points
  (Frequency × 100) +                // Max 30 points
  (Attendance Rate × 20) +           // Max 20 points
  (Recent Activity Bonus)            // Max 10 points
)
```

#### 4. Improvement Score (0-100)
```
Improvement Score = min(100,
  (Strength Improvement × 30) +      // Max 30 points
  (Stamina Improvement × 25) +       // Max 25 points
  (Consistency Improvement × 25) +   // Max 25 points
  (Progress Rate × 20)               // Max 20 points
)
```

### Tier Calculation

Tiers are based on percentile ranking:
- **Diamond**: Top 5%
- **Platinum**: Top 15%
- **Gold**: Top 30%
- **Silver**: Top 50%
- **Bronze**: Remaining users

## API Endpoints

### Cloud Functions Endpoints

#### 1. Get Leaderboard
```
GET /getLeaderboard?type=overall&limit=50&offset=0
```
**Response:**
```javascript
{
  success: true,
  data: [
    {
      userId: string,
      rank: number,
      score: number,
      tier: string,
      displayName: string,
      photoURL: string,
      rankDelta: number,
      rankChange: 'up' | 'down' | 'stable'
    }
  ],
  type: string,
  limit: number,
  offset: number
}
```

#### 2. Get User Ranking
```
GET /getUserRanking?userId={userId}
```
**Response:**
```javascript
{
  success: true,
  data: {
    userId: string,
    currentRank: number,
    previousRank: number,
    rankDelta: number,
    score: number,
    strengthScore: number,
    staminaScore: number,
    consistencyScore: number,
    improvementScore: number,
    lastUpdated: timestamp
  }
}
```

#### 3. Update Ranking Weights (Admin)
```
POST /updateRankingWeights
Headers: { Authorization: 'Bearer {adminToken}' }
Body: {
  weights: {
    strength: number,
    stamina: number,
    consistency: number,
    improvement: number
  }
}
```

#### 4. Recalculate All Rankings (Admin)
```
POST /recalculateAllRankings
Headers: { Authorization: 'Bearer {adminToken}' }
```

### Firestore Triggers

#### 1. onMetricsAdded
Triggered when new user metrics are added.
- Calculates user score
- Updates userScores collection
- Triggers ranking update

#### 2. onMetricsUpdated
Triggered when user metrics are updated.
- Recalculates user score
- Updates userScores collection
- Triggers ranking update

## Deployment Instructions

### Prerequisites
- Node.js 18+ installed
- Firebase CLI installed
- Firebase project created
- Git repository initialized

### Step 1: Project Setup
```bash
# Clone the repository
git clone <repository-url>
cd bio-lift

# Install dependencies
npm install

# Install Firebase CLI if not already installed
npm install -g firebase-tools
```

### Step 2: Firebase Configuration
```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select the following services:
# - Firestore
# - Functions
# - Hosting (optional)
```

### Step 3: Environment Configuration
```bash
# Set up environment variables
firebase functions:config:set \
  admin.token="your-admin-token" \
  system.default_weights='{"strength":0.3,"stamina":0.25,"consistency":0.25,"improvement":0.2}'
```

### Step 4: Deploy Cloud Functions
```bash
# Deploy functions
cd functions
npm install
firebase deploy --only functions
```

### Step 5: Deploy Firestore Rules
```bash
# Deploy security rules
firebase deploy --only firestore:rules
```

### Step 6: Deploy Frontend
```bash
# Build the React app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Step 7: Initialize Database
```bash
# Create initial system configuration
firebase firestore:set /systemConfig/rankingWeights \
  '{"weights":{"strength":0.3,"stamina":0.25,"consistency":0.25,"improvement":0.2},"lastUpdated":"2024-01-01T00:00:00Z","updatedBy":"system"}'
```

### Step 8: Verify Deployment
1. Check Cloud Functions logs: `firebase functions:log`
2. Test API endpoints using Postman or curl
3. Verify Firestore rules are working
4. Test frontend components

## Usage Examples

### 1. Adding User Metrics
```javascript
// Add user metrics to trigger score calculation
const userMetrics = {
  userId: 'user123',
  timestamp: new Date(),
  maxWeightLifted: 100,
  workoutDuration: 60,
  workoutStreak: 7,
  bodyWeight: 70
};

await firebase.firestore()
  .collection('userMetrics')
  .doc('user123')
  .set(userMetrics);
```

### 2. Fetching Leaderboard
```javascript
// Fetch overall leaderboard
const response = await fetch(
  'https://us-central1-your-project.cloudfunctions.net/getLeaderboard?type=overall&limit=20'
);
const data = await response.json();
console.log(data.data); // Array of ranked users
```

### 3. Getting User Ranking
```javascript
// Get specific user's ranking
const response = await fetch(
  'https://us-central1-your-project.cloudfunctions.net/getUserRanking?userId=user123'
);
const data = await response.json();
console.log(`User rank: #${data.data.currentRank}`);
```

### 4. Admin Weight Update
```javascript
// Update ranking weights (admin only)
const newWeights = {
  strength: 0.35,
  stamina: 0.25,
  consistency: 0.25,
  improvement: 0.15
};

const response = await fetch(
  'https://us-central1-your-project.cloudfunctions.net/updateRankingWeights',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your-admin-token'
    },
    body: JSON.stringify({ weights: newWeights })
  }
);
```

### 5. React Component Usage
```javascript
import Leaderboard from './components/Leaderboard';
import RankCard from './components/RankCard';
import AdminDashboard from './components/AdminDashboard';

// In your React app
function App() {
  return (
    <div>
      <Leaderboard />
      <RankCard userId="user123" showInsights={true} />
      <AdminDashboard />
    </div>
  );
}
```

## Testing Guide

### 1. Unit Tests
```bash
# Run Cloud Functions tests
cd functions
npm test

# Run frontend tests
npm test
```

### 2. Integration Tests
```bash
# Test API endpoints
curl -X GET "https://us-central1-your-project.cloudfunctions.net/getLeaderboard?type=overall&limit=5"

# Test with authentication
curl -X POST "https://us-central1-your-project.cloudfunctions.net/updateRankingWeights" \
  -H "Authorization: Bearer your-admin-token" \
  -H "Content-Type: application/json" \
  -d '{"weights":{"strength":0.3,"stamina":0.25,"consistency":0.25,"improvement":0.2}}'
```

### 3. Sample Test Data
```javascript
// Create test users with metrics
const testUsers = [
  {
    userId: 'test_user_1',
    metrics: {
      maxWeightLifted: 150,
      workoutDuration: 90,
      workoutStreak: 14,
      bodyWeight: 80
    }
  },
  {
    userId: 'test_user_2',
    metrics: {
      maxWeightLifted: 120,
      workoutDuration: 60,
      workoutStreak: 7,
      bodyWeight: 70
    }
  }
];

// Add test data to Firestore
for (const user of testUsers) {
  await firebase.firestore()
    .collection('userMetrics')
    .doc(user.userId)
    .set({
      ...user.metrics,
      timestamp: new Date(),
      userId: user.userId
    });
}
```

### 4. Performance Testing
```bash
# Test with large datasets
# Create 1000 test users and measure ranking calculation time
node test/performance-test.js
```

## Troubleshooting

### Common Issues

#### 1. Cloud Functions Not Deploying
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear Firebase cache
firebase logout
firebase login

# Redeploy with verbose logging
firebase deploy --only functions --debug
```

#### 2. Firestore Rules Errors
```bash
# Test rules locally
firebase emulators:start

# Check rule syntax
firebase deploy --only firestore:rules --debug
```

#### 3. CORS Issues
```javascript
// Ensure CORS headers are set in Cloud Functions
res.set('Access-Control-Allow-Origin', '*');
res.set('Access-Control-Allow-Methods', 'GET, POST');
res.set('Access-Control-Allow-Headers', 'Content-Type');
```

#### 4. Authentication Issues
```javascript
// Check Firebase Auth configuration
// Ensure admin tokens are properly set
firebase functions:config:get
```

#### 5. Performance Issues
- Monitor Cloud Function execution times
- Check Firestore read/write quotas
- Optimize database queries
- Use pagination for large datasets

### Debugging Tips

1. **Check Cloud Function Logs**
   ```bash
   firebase functions:log --only onMetricsAdded
   ```

2. **Monitor Firestore Usage**
   - Check Firebase Console > Usage
   - Monitor read/write operations

3. **Test Locally**
   ```bash
   firebase emulators:start
   # Test with local emulator
   ```

4. **Validate Data**
   ```javascript
   // Check data validation in Cloud Functions
   console.log('Incoming metrics:', metrics);
   console.log('Validation result:', validateMetrics(metrics));
   ```

### Performance Optimization

1. **Batch Operations**
   ```javascript
   // Use batch writes for multiple updates
   const batch = db.batch();
   // Add operations to batch
   await batch.commit();
   ```

2. **Indexing**
   ```javascript
   // Create composite indexes for queries
   // Check Firebase Console > Firestore > Indexes
   ```

3. **Caching**
   ```javascript
   // Implement caching for frequently accessed data
   // Use Firestore cache or external cache (Redis)
   ```

## Security Considerations

1. **Authentication**: All endpoints require Firebase Auth
2. **Authorization**: Role-based access control
3. **Data Validation**: Input validation on all endpoints
4. **Rate Limiting**: Prevent abuse with rate limiting
5. **Audit Logging**: Log all admin operations
6. **Data Encryption**: Sensitive data encrypted at rest

## Monitoring and Analytics

1. **Cloud Function Metrics**
   - Execution time
   - Memory usage
   - Error rates

2. **Firestore Metrics**
   - Read/write operations
   - Query performance
   - Storage usage

3. **Application Metrics**
   - User engagement
   - Ranking accuracy
   - System performance

## Support and Maintenance

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor Firebase service updates
   - Update security rules as needed

2. **Backup Strategy**
   - Regular Firestore backups
   - Version control for configuration
   - Disaster recovery plan

3. **Scaling Considerations**
   - Monitor usage patterns
   - Plan for user growth
   - Optimize for performance

---

For additional support, please refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
