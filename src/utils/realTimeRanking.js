// Real-time Smart Ranking System
// Uses Node.js backend API + Firebase Realtime Database for live updates

import { db } from '../firebase';
import { getDatabase, ref, get, onValue, off } from 'firebase/database';
import { auth } from '../firebase';

const rtdb = getDatabase();
// In production (Vercel), use relative paths. In development, use localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api');

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
 * Update user's ranking data via Node.js API
 */
export const updateUserRanking = async (userId, userData) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }
    
    const token = await currentUser.getIdToken();
    
    const response = await fetch(`${API_BASE_URL}/update-user-metrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update ranking');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user ranking:', error);
    throw error;
  }
};

/**
 * Recalculate all user rankings via Node.js API (Admin only)
 */
export const recalculateAllRankings = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }
    
    const token = await currentUser.getIdToken();
    
    const response = await fetch(`${API_BASE_URL}/recalculate-rankings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to recalculate rankings');
    }
    
    const data = await response.json();
    console.log(`✅ Rankings recalculated: ${data.message}`);
    return data;
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
 * Get current leaderboard data from Node.js API
 */
export const getCurrentLeaderboard = async (type = 'overall', limit = 50, offset = 0) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/leaderboard?type=${type}&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      return data.data || [];
    }
    
    return [];
  } catch (error) {
    // Check if it's a connection error (server not running)
    if (
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('ERR_CONNECTION_REFUSED') ||
      error.name === 'TypeError'
    ) {
      console.warn(
        '⚠️ Ranking server is not running. Please start the Node.js server:\n' +
        '  1. Open a new terminal\n' +
        '  2. cd server\n' +
        '  3. npm install (if not done)\n' +
        '  4. npm run dev\n\n' +
        'The leaderboard will work once the server is running.'
      );
      
      // Return empty array gracefully - don't try RTDB fallback if server isn't running
      return [];
    }
    
    console.error('Error getting leaderboard:', error);
    
    // Only try RTDB fallback if user is authenticated and it's not a connection error
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.warn('User not authenticated. Cannot fetch leaderboard from RTDB.');
        return [];
      }
      
      const rtdbRef = ref(rtdb, `leaderboard/${type}`);
      const rtdbSnapshot = await get(rtdbRef);
      
      if (rtdbSnapshot.exists()) {
        const data = rtdbSnapshot.val();
        const rankings = data.rankings || [];
        return rankings.slice(offset, offset + limit);
      }
    } catch (fallbackError) {
      // Silently handle permission errors - they're expected if RTDB rules aren't set
      if (!fallbackError.message?.includes('Permission denied')) {
        console.warn('Fallback to RTDB failed:', fallbackError.message);
      }
    }
    
    return [];
  }
};

/**
 * Update user workout data and trigger ranking update via Node.js API
 */
export const updateUserWorkout = async (userId, workoutData) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }
    
    // Get current metrics from RTDB
    const userRef = ref(rtdb, `users/${userId}`);
    const userSnapshot = await get(userRef);
    const currentMetrics = userSnapshot.exists() ? userSnapshot.val() : {};
    
    // Update with new workout data
    const updatedMetrics = {
      ...currentMetrics,
      ...workoutData,
      lastWorkoutDate: new Date().toISOString(),
      totalWorkouts: (currentMetrics.totalWorkouts || 0) + 1
    };
    
    // Update user ranking via Node.js API
    await updateUserRanking(userId, updatedMetrics);
    
    console.log(`✅ Workout updated for user ${userId}`);
    
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};

/**
 * Get current user's ranking
 */
export const getMyRanking = async (type = 'overall') => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }
    
    const token = await currentUser.getIdToken();
    
    const response = await fetch(
      `${API_BASE_URL}/my-ranking?type=${type}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch your ranking');
    }
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting my ranking:', error);
    return null;
  }
};

/**
 * Initialize the ranking system (no longer needed, handled by Node.js backend)
 */
export const initializeRankingSystem = async () => {
  try {
    console.log('✅ Ranking system initialized (handled by Node.js backend)');
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
