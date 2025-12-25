const admin = require('firebase-admin');

// Lazy getters for Firebase services (initialized after admin.initializeApp)
const getDb = () => admin.database();
const getFirestore = () => admin.firestore();

// Ranking algorithm weights
const RANKING_WEIGHTS = {
  strength: 0.30,
  stamina: 0.25,
  consistency: 0.25,
  improvement: 0.20
};

// Tier thresholds (percentile-based)
const TIER_THRESHOLDS = {
  Diamond: 0.95,    // Top 5%
  Platinum: 0.85,   // Top 15%
  Gold: 0.70,       // Top 30%
  Silver: 0.50,     // Top 50%
  Bronze: 0.0       // Everyone else
};

/**
 * Calculate user's ranking score based on multiple factors
 */
function calculateUserScore(userData) {
  const {
    maxWeightLifted = 0,
    totalWorkouts = 0,
    workoutStreak = 0,
    consistencyScore = 0,
    improvementRate = 0,
    totalCaloriesBurned = 0,
    averageHeartRate = 0,
    flexibilityScore = 0,
    enduranceScore = 0,
    // Progress tracking data
    progressEntries = []
  } = userData;

  // Normalize values to 0-100 scale
  const normalizedStrength = Math.min((maxWeightLifted / 500) * 100, 100);
  const normalizedWorkouts = Math.min((totalWorkouts / 100) * 100, 100);
  const normalizedStreak = Math.min((workoutStreak / 30) * 100, 100);
  const normalizedConsistency = Math.min(consistencyScore, 100);
  const normalizedImprovement = Math.min(improvementRate, 100);
  const normalizedCalories = Math.min((totalCaloriesBurned / 100000) * 100, 100);
  const normalizedHeartRate = Math.max(0, 100 - Math.abs(averageHeartRate - 140) / 2);
  const normalizedFlexibility = Math.min(flexibilityScore, 100);
  const normalizedEndurance = Math.min(enduranceScore, 100);

  // Calculate weighted scores
  const strengthScore = normalizedStrength * RANKING_WEIGHTS.strength;
  const staminaScore = (normalizedEndurance + normalizedHeartRate) * RANKING_WEIGHTS.stamina / 2;
  const consistencyScore_weighted = (normalizedWorkouts + normalizedStreak + normalizedConsistency) * RANKING_WEIGHTS.consistency / 3;
  const improvementScore_weighted = (normalizedImprovement + normalizedCalories) * RANKING_WEIGHTS.improvement / 2;

  // Bonus for progress tracking (if user logs progress regularly)
  let progressBonus = 0;
  if (progressEntries && progressEntries.length > 0) {
    const recentEntries = progressEntries.filter(entry => {
      const entryDate = new Date(entry.date || entry.timestamp);
      const daysSince = (Date.now() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 30; // Entries in last 30 days
    });
    progressBonus = Math.min(recentEntries.length * 0.5, 5); // Max 5 point bonus
  }

  const totalScore = strengthScore + staminaScore + consistencyScore_weighted + improvementScore_weighted + progressBonus;

  return {
    totalScore: Math.round(totalScore * 100) / 100,
    strengthScore: Math.round(strengthScore * 100) / 100,
    staminaScore: Math.round(staminaScore * 100) / 100,
    consistencyScore: Math.round(consistencyScore_weighted * 100) / 100,
    improvementScore: Math.round(improvementScore_weighted * 100) / 100,
    progressBonus: Math.round(progressBonus * 100) / 100,
    breakdown: {
      strength: normalizedStrength,
      workouts: normalizedWorkouts,
      streak: normalizedStreak,
      consistency: normalizedConsistency,
      improvement: normalizedImprovement,
      calories: normalizedCalories,
      heartRate: normalizedHeartRate,
      flexibility: normalizedFlexibility,
      endurance: normalizedEndurance
    }
  };
}

/**
 * Calculate user tier based on percentile
 */
function calculateTier(rank, totalUsers) {
  if (totalUsers === 0) return 'Bronze';
  
  const percentile = (totalUsers - rank + 1) / totalUsers;
  
  if (percentile >= TIER_THRESHOLDS.Diamond) return 'Diamond';
  if (percentile >= TIER_THRESHOLDS.Platinum) return 'Platinum';
  if (percentile >= TIER_THRESHOLDS.Gold) return 'Gold';
  if (percentile >= TIER_THRESHOLDS.Silver) return 'Silver';
  return 'Bronze';
}

/**
 * Validate metrics data
 */
function validateMetrics(metrics) {
  const errors = [];
  
  if (typeof metrics !== 'object') {
    return { isValid: false, errors: ['Metrics must be an object'] };
  }
  
  // Optional validation - can be extended
  const numericFields = ['maxWeightLifted', 'totalWorkouts', 'workoutStreak', 'totalCaloriesBurned'];
  numericFields.forEach(field => {
    if (metrics[field] !== undefined && (isNaN(metrics[field]) || metrics[field] < 0)) {
      errors.push(`${field} must be a non-negative number`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    data: metrics
  };
}

/**
 * Get all Google-authenticated users from Firebase
 */
async function getAllGoogleUsers() {
  try {
    const db = getDb();
    const usersRef = db.ref('users');
    const snapshot = await usersRef.once('value');
    const users = snapshot.val() || {};
    
    // Filter users who logged in with Google (have __sessionType === 'firebase')
    const googleUsers = Object.entries(users)
      .filter(([uid, userData]) => {
        // Check if user has Google auth (has email and name from Google)
        return userData.email && (userData.name || userData.displayName);
      })
      .map(([uid, userData]) => ({
        uid: uid,
        email: userData.email || '',
        name: userData.name || userData.displayName || 'Anonymous',
        avatar: userData.avatar || userData.photoURL || '',
        membership: userData.membership || 'free',
        level: userData.level || 'beginner',
        points: userData.points || 0,
        rank: userData.rank || 'Rookie'
      }));
    
    return googleUsers;
  } catch (error) {
    console.error('Error fetching Google users:', error);
    return [];
  }
}

/**
 * Get user metrics from Firebase RTDB and progress tracking
 */
async function getUserMetrics(userId) {
  try {
    const db = getDb();
    // Get user data from RTDB
    const userRef = db.ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    const userData = userSnapshot.val() || {};
    
    // Get progress entries
    const progressRef = db.ref(`users/${userId}/progress/entries`);
    const progressSnapshot = await progressRef.once('value');
    const progressEntries = progressSnapshot.val() || {};
    
    // Convert progress entries to array
    const entriesArray = Object.entries(progressEntries).map(([id, entry]) => ({
      id,
      ...entry
    }));
    
    // Calculate metrics from progress entries
    let maxWeightLifted = userData.maxWeightLifted || 0;
    let totalWorkouts = userData.totalWorkouts || entriesArray.length;
    let workoutStreak = userData.workoutStreak || 0;
    let totalCaloriesBurned = userData.totalCaloriesBurned || 0;
    
    // Calculate from progress entries if available
    if (entriesArray.length > 0) {
      // Find max weight from squat, bench, deadlift
      entriesArray.forEach(entry => {
        const maxLift = Math.max(
          entry.squat || 0,
          entry.bench || 0,
          entry.deadlift || 0
        );
        if (maxLift > maxWeightLifted) {
          maxWeightLifted = maxLift;
        }
      });
      
      // Calculate streak
      const sortedEntries = entriesArray.sort((a, b) => {
        const dateA = new Date(a.date || a.timestamp);
        const dateB = new Date(b.date || b.timestamp);
        return dateB - dateA;
      });
      
      workoutStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < sortedEntries.length; i++) {
        const entryDate = new Date(sortedEntries[i].date || sortedEntries[i].timestamp);
        entryDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
        if (daysDiff === workoutStreak) {
          workoutStreak++;
        } else {
          break;
        }
      }
    }
    
    return {
      ...userData,
      maxWeightLifted,
      totalWorkouts,
      workoutStreak,
      totalCaloriesBurned,
      consistencyScore: userData.consistencyScore || 0,
      improvementRate: userData.improvementRate || 0,
      averageHeartRate: userData.averageHeartRate || 0,
      flexibilityScore: userData.flexibilityScore || 0,
      enduranceScore: userData.enduranceScore || 0,
      progressEntries: entriesArray
    };
  } catch (error) {
    console.error(`Error fetching metrics for user ${userId}:`, error);
    return {};
  }
}

/**
 * Update user metrics and recalculate ranking
 */
async function updateUserMetrics(userId, metrics) {
  try {
    const db = getDb();
    // Get current user data
    const currentMetrics = await getUserMetrics(userId);
    const updatedMetrics = { ...currentMetrics, ...metrics };
    
    // Calculate new score
    const scoreData = calculateUserScore(updatedMetrics);
    
    // Update user data in RTDB
    const userRef = db.ref(`users/${userId}`);
    await userRef.update({
      ...updatedMetrics,
      ...scoreData,
      lastUpdated: admin.database.ServerValue.TIMESTAMP
    });
    
    // Trigger ranking recalculation
    await recalculateAllRankings();
    
    return scoreData;
  } catch (error) {
    console.error(`Error updating metrics for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Recalculate all user rankings
 */
async function recalculateAllRankings() {
  try {
    console.log('🔄 Recalculating all rankings...');
    
    // Get all Google-authenticated users
    const googleUsers = await getAllGoogleUsers();
    
    console.log(`👥 Found ${googleUsers.length} Google-authenticated users`);
    
    if (googleUsers.length === 0) {
      console.log('⚠️ No users found. Users need to log in with Google and have progress data.');
      return [];
    }
    
    // Calculate scores for all users
    const userScores = [];
    
    for (const user of googleUsers) {
      try {
        const metrics = await getUserMetrics(user.uid);
        
        // Only include users with some activity (at least 1 workout or progress entry)
        const hasActivity = (metrics.totalWorkouts > 0) || 
                           (metrics.progressEntries && metrics.progressEntries.length > 0) ||
                           (metrics.maxWeightLifted > 0);
        
        if (!hasActivity) {
          console.log(`⏭️ Skipping user ${user.name} (${user.uid}) - no activity data`);
          continue;
        }
        
        const scoreData = calculateUserScore(metrics);
        
        console.log(`✅ Calculated score for ${user.name}: ${scoreData.totalScore.toFixed(2)}`);
        
        userScores.push({
          userId: user.uid,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          ...scoreData,
          metrics: metrics
        });
      } catch (error) {
        console.error(`❌ Error calculating score for user ${user.uid}:`, error);
      }
    }
    
    console.log(`📊 Calculated scores for ${userScores.length} active users`);
    
    // Sort by total score (descending)
    userScores.sort((a, b) => b.totalScore - a.totalScore);
    
    // Assign ranks and tiers
    const rankedUsers = userScores.map((user, index) => ({
      ...user,
      rank: index + 1,
      tier: calculateTier(index + 1, userScores.length),
      rankChange: 'stable', // Will be calculated later
      rankDelta: 0,
      lastUpdated: Date.now()
    }));
    
    // Get previous rankings for delta calculation
    const db = getDb();
    const previousRankingsRef = db.ref('leaderboard/overall_previous');
    const previousSnapshot = await previousRankingsRef.once('value');
    const previousRankings = previousSnapshot.val()?.rankings || [];
    
    // Calculate rank changes
    rankedUsers.forEach(user => {
      const previousRank = previousRankings.findIndex(r => r.userId === user.userId) + 1;
      if (previousRank > 0) {
        user.rankDelta = previousRank - user.rank;
        user.rankChange = user.rankDelta > 0 ? 'up' : user.rankDelta < 0 ? 'down' : 'stable';
      }
    });
    
    // Store previous rankings
    const currentRankingsRef = db.ref('leaderboard/overall');
    const currentSnapshot = await currentRankingsRef.once('value');
    if (currentSnapshot.exists()) {
      await previousRankingsRef.set(currentSnapshot.val());
    }
    
    // Update current rankings in RTDB
    await currentRankingsRef.set({
      rankings: rankedUsers,
      lastUpdated: Date.now(),
      totalUsers: rankedUsers.length
    });
    
    // Also update weekly and monthly rankings
    await updatePeriodRankings(rankedUsers, 'weekly');
    await updatePeriodRankings(rankedUsers, 'monthly');
    
    console.log(`✅ Rankings updated for ${rankedUsers.length} users`);
    return rankedUsers;
  } catch (error) {
    console.error('Error recalculating rankings:', error);
    throw error;
  }
}

/**
 * Update period-based rankings (weekly/monthly)
 */
async function updatePeriodRankings(rankedUsers, period) {
  try {
    const db = getDb();
    const now = new Date();
    let startDate, endDate;
    
    if (period === 'weekly') {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }
    
    // Filter users active in this period
    const periodRankings = rankedUsers.filter(user => {
      if (!user.metrics || !user.metrics.progressEntries) return false;
      const recentEntries = user.metrics.progressEntries.filter(entry => {
        const entryDate = new Date(entry.date || entry.timestamp);
        return entryDate >= startDate && entryDate <= endDate;
      });
      return recentEntries.length > 0;
    });
    
    await db.ref(`leaderboard/${period}`).set({
      rankings: periodRankings,
      lastUpdated: Date.now(),
      totalUsers: periodRankings.length,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    });
  } catch (error) {
    console.error(`Error updating ${period} rankings:`, error);
  }
}

/**
 * Get leaderboard data
 */
async function getLeaderboard(type = 'overall', limit = 50, offset = 0) {
  try {
    const db = getDb();
    const leaderboardRef = db.ref(`leaderboard/${type}`);
    const snapshot = await leaderboardRef.once('value');
    const data = snapshot.val();
    
    if (!data || !data.rankings || data.rankings.length === 0) {
      console.log(`📭 No rankings found for type: ${type}`);
      return [];
    }
    
    const rankings = data.rankings || [];
    console.log(`📊 Found ${rankings.length} rankings for type: ${type}`);
    
    // Apply pagination
    const paginatedRankings = rankings.slice(offset, offset + limit);
    
    // Enrich with display names
    const enrichedRankings = paginatedRankings.map(ranking => ({
      ...ranking,
      displayName: ranking.name || ranking.displayName || 'Anonymous',
      photoURL: ranking.avatar || ranking.photoURL || null,
      score: ranking.totalScore || ranking.score || 0
    }));
    
    return enrichedRankings;
  } catch (error) {
    console.error(`Error fetching ${type} leaderboard:`, error);
    return [];
  }
}

/**
 * Get user ranking details
 */
async function getUserRankingDetails(userId, type = 'overall') {
  try {
    const db = getDb();
    const leaderboardRef = db.ref(`leaderboard/${type}`);
    const snapshot = await leaderboardRef.once('value');
    const data = snapshot.val();
    
    if (!data || !data.rankings) {
      return null;
    }
    
    const rankings = data.rankings || [];
    const userRanking = rankings.find(r => r.userId === userId);
    
    if (!userRanking) {
      return null;
    }
    
    return {
      ...userRanking,
      currentRank: userRanking.rank,
      score: userRanking.totalScore,
      strengthScore: userRanking.strengthScore,
      staminaScore: userRanking.staminaScore,
      consistencyScore: userRanking.consistencyScore,
      improvementScore: userRanking.improvementScore,
      totalUsers: rankings.length
    };
  } catch (error) {
    console.error(`Error fetching ranking details for user ${userId}:`, error);
    return null;
  }
}

/**
 * Get ranking statistics
 */
async function getRankingStatistics() {
  try {
    const db = getDb();
    const overallRef = db.ref('leaderboard/overall');
    const snapshot = await overallRef.once('value');
    const data = snapshot.val();
    
    if (!data || !data.rankings) {
      return {};
    }
    
    const rankings = data.rankings || [];
    
    // Calculate tier distribution
    const tierStats = {
      Diamond: 0,
      Platinum: 0,
      Gold: 0,
      Silver: 0,
      Bronze: 0
    };
    
    rankings.forEach(user => {
      if (tierStats[user.tier] !== undefined) {
        tierStats[user.tier]++;
      }
    });
    
    return {
      totalUsers: rankings.length,
      tierDistribution: tierStats,
      lastUpdated: data.lastUpdated
    };
  } catch (error) {
    console.error('Error fetching ranking statistics:', error);
    return {};
  }
}

module.exports = {
  calculateUserScore,
  calculateTier,
  validateMetrics,
  getAllGoogleUsers,
  getUserMetrics,
  updateUserMetrics,
  recalculateAllRankings,
  getLeaderboard,
  getUserRankingDetails,
  getRankingStatistics
};

