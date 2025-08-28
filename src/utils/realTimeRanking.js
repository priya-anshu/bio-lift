// Real-time Smart Ranking System
// Uses Firestore for data storage + Real-time Database for live updates

import { db } from '../firebase';
import { doc, setDoc, getDoc, getDocs, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { getDatabase, ref, set, get, onValue, off } from 'firebase/database';

const rtdb = getDatabase();

// Ranking weights configuration
const RANKING_WEIGHTS = {
  strength: 0.3,
  stamina: 0.25,
  consistency: 0.25,
  improvement: 0.2
};

// Tier thresholds
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
export const calculateUserScore = (userData) => {
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
    strengthScore: existingStrengthScore = 0
  } = userData;

  // Normalize values to 0-100 scale
  const normalizedStrength = Math.min((maxWeightLifted / 500) * 100, 100);
  const normalizedWorkouts = Math.min((totalWorkouts / 100) * 100, 100);
  const normalizedStreak = Math.min((workoutStreak / 30) * 100, 100);
  const normalizedConsistency = consistencyScore;
  const normalizedImprovement = Math.min(improvementRate, 100);
  const normalizedCalories = Math.min((totalCaloriesBurned / 100000) * 100, 100);
  const normalizedHeartRate = Math.max(0, 100 - Math.abs(averageHeartRate - 140) / 2);
  const normalizedFlexibility = flexibilityScore;
  const normalizedEndurance = enduranceScore;

  // Calculate weighted score
  const calculatedStrengthScore = normalizedStrength * RANKING_WEIGHTS.strength;
  const staminaScore = (normalizedEndurance + normalizedHeartRate) * RANKING_WEIGHTS.stamina / 2;
  const calculatedConsistencyScore = (normalizedWorkouts + normalizedStreak + normalizedConsistency) * RANKING_WEIGHTS.consistency / 3;
  const improvementScore = (normalizedImprovement + normalizedCalories) * RANKING_WEIGHTS.improvement / 2;

  const totalScore = calculatedStrengthScore + staminaScore + calculatedConsistencyScore + improvementScore;

  return {
    totalScore: Math.round(totalScore * 100) / 100,
    strengthScore: Math.round(calculatedStrengthScore * 100) / 100,
    staminaScore: Math.round(staminaScore * 100) / 100,
    consistencyScore: Math.round(calculatedConsistencyScore * 100) / 100,
    improvementScore: Math.round(improvementScore * 100) / 100,
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
};

/**
 * Determine user tier based on score percentile
 */
export const calculateUserTier = (score, totalUsers, userRank) => {
  if (totalUsers === 0) return 'Bronze';
  
  const percentile = (totalUsers - userRank + 1) / totalUsers;
  
  if (percentile >= TIER_THRESHOLDS.Diamond) return 'Diamond';
  if (percentile >= TIER_THRESHOLDS.Platinum) return 'Platinum';
  if (percentile >= TIER_THRESHOLDS.Gold) return 'Gold';
  if (percentile >= TIER_THRESHOLDS.Silver) return 'Silver';
  return 'Bronze';
};

/**
 * Update user's ranking data in Firestore
 */
export const updateUserRanking = async (userId, userData) => {
  try {
    // Calculate new score
    const scoreData = calculateUserScore(userData);
    
    // Update user metrics with calculated scores
    await setDoc(doc(db, 'userMetrics', userId), {
      ...userData,
      ...scoreData,
      lastUpdated: new Date()
    }, { merge: true });

    // Trigger ranking recalculation
    await recalculateAllRankings();
    
    return scoreData;
  } catch (error) {
    console.error('Error updating user ranking:', error);
    throw error;
  }
};

/**
 * Recalculate all user rankings and update real-time database
 */
export const recalculateAllRankings = async () => {
  try {
    console.log('🔄 Recalculating all rankings...');
    
    // Get all users with metrics
    const usersSnapshot = await getDocs(collection(db, 'userMetrics'));
    const users = [];
    
    usersSnapshot.forEach(doc => {
      users.push({
        userId: doc.id,
        ...doc.data()
      });
    });

    // Calculate scores and sort by total score
    const rankedUsers = users
      .map(user => ({
        ...user,
        score: user.totalScore || 0
      }))
      .sort((a, b) => b.score - a.score)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
        tier: calculateUserTier(user.score, users.length, index + 1),
        rankChange: 'stable', // Will be calculated later
        rankDelta: 0,
        lastUpdated: new Date()
      }));

    // Store in Firestore for persistence
    await setDoc(doc(db, 'rankings', 'overall'), {
      rankings: rankedUsers,
      lastUpdated: new Date(),
      totalUsers: rankedUsers.length,
      metadata: {
        type: "overall",
        description: "Real-time user rankings"
      }
    });

    // Update real-time database for live updates
    await set(ref(rtdb, 'leaderboard/overall'), {
      rankings: rankedUsers,
      lastUpdated: Date.now(),
      totalUsers: rankedUsers.length
    });

    console.log(`✅ Rankings updated for ${rankedUsers.length} users`);
    return rankedUsers;
    
  } catch (error) {
    console.error('Error recalculating rankings:', error);
    throw error;
  }
};

/**
 * Listen to real-time leaderboard updates
 */
export const subscribeToLeaderboard = (type = 'overall', callback) => {
  const leaderboardRef = ref(rtdb, `leaderboard/${type}`);
  
  const unsubscribe = onValue(leaderboardRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.rankings) {
      callback(data.rankings);
    } else {
      callback([]);
    }
  });

  return () => off(leaderboardRef, 'value', unsubscribe);
};

/**
 * Get current leaderboard data
 */
export const getCurrentLeaderboard = async (type = 'overall') => {
  try {
    // Try real-time database first
    const rtdbRef = ref(rtdb, `leaderboard/${type}`);
    const rtdbSnapshot = await get(rtdbRef);
    
    if (rtdbSnapshot.exists()) {
      return rtdbSnapshot.val().rankings || [];
    }
    
    // Fallback to Firestore
    const firestoreDoc = await getDoc(doc(db, 'rankings', type));
    if (firestoreDoc.exists()) {
      return firestoreDoc.data().rankings || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

/**
 * Update user workout data and trigger ranking update
 */
export const updateUserWorkout = async (userId, workoutData) => {
  try {
    // Get current user metrics
    const userDoc = await getDoc(doc(db, 'userMetrics', userId));
    const currentMetrics = userDoc.exists() ? userDoc.data() : {};
    
    // Update with new workout data
    const updatedMetrics = {
      ...currentMetrics,
      ...workoutData,
      lastWorkoutDate: new Date(),
      totalWorkouts: (currentMetrics.totalWorkouts || 0) + 1
    };
    
    // Update user ranking
    await updateUserRanking(userId, updatedMetrics);
    
    console.log(`✅ Workout updated for user ${userId}`);
    
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};

/**
 * Initialize the ranking system
 */
export const initializeRankingSystem = async () => {
  try {
    // Set up ranking weights
    await setDoc(doc(db, 'systemConfig', 'rankingWeights'), {
      ...RANKING_WEIGHTS,
      lastUpdated: new Date()
    });
    
    // Initialize real-time database structure
    await set(ref(rtdb, 'leaderboard'), {
      overall: { rankings: [], lastUpdated: Date.now(), totalUsers: 0 },
      weekly: { rankings: [], lastUpdated: Date.now(), totalUsers: 0 },
      monthly: { rankings: [], lastUpdated: Date.now(), totalUsers: 0 }
    });
    
    console.log('✅ Ranking system initialized');
  } catch (error) {
    console.error('Error initializing ranking system:', error);
  }
};

export default {
  calculateUserScore,
  calculateUserTier,
  updateUserRanking,
  recalculateAllRankings,
  subscribeToLeaderboard,
  getCurrentLeaderboard,
  updateUserWorkout,
  initializeRankingSystem
};
