// Quick test data generator using Firebase client SDK
// This script can be run in the browser console or as a React component

import { db } from '../firebase';
import { collection, doc, setDoc, addDoc, getDocs } from 'firebase/firestore';
import { 
  calculateUserScore, 
  calculateUserTier, 
  recalculateAllRankings,
  initializeRankingSystem 
} from './realTimeRanking';

// Note: We'll use existing users from your RTDB instead of creating test users

// Test metrics data - based on your existing user data structure
const generateTestMetrics = (userId) => {
  // Generate realistic workout data based on your existing stats
  const totalWorkouts = Math.floor(Math.random() * 50) + 10;
  const totalCaloriesBurned = Math.floor(Math.random() * 30000) + 5000;
  const workoutStreak = Math.floor(Math.random() * 15) + 1;
  
  return {
    maxWeightLifted: Math.floor(Math.random() * 200) + 30, // Realistic for beginners
    totalWorkouts: totalWorkouts,
    averageWorkoutDuration: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
    consistencyScore: Math.floor(Math.random() * 30) + 70, // 70-100 for active users
    improvementRate: Math.random() * 15 + 5, // 5-20% improvement
    lastWorkoutDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last week
    workoutStreak: workoutStreak,
    totalCaloriesBurned: totalCaloriesBurned,
    averageHeartRate: Math.floor(Math.random() * 30) + 130, // 130-160 bpm
    maxHeartRate: Math.floor(Math.random() * 40) + 160, // 160-200 bpm
    flexibilityScore: Math.floor(Math.random() * 25) + 75, // 75-100 for active users
    enduranceScore: Math.floor(Math.random() * 25) + 75, // 75-100 for active users
    strengthScore: Math.floor(Math.random() * 25) + 75, // 75-100 for active users
    lastUpdated: new Date()
  };
};

// Function to create test data
export const createQuickTestData = async () => {
  console.log('🚀 Creating quick test data with Real-time Ranking System...');
  
  try {
    // Initialize the ranking system
    await initializeRankingSystem();
    console.log('✅ Ranking system initialized');
    
    // Get existing users from RTDB to create metrics for them
    const { getDatabase, ref, get } = await import('firebase/database');
    const rtdb = getDatabase();
    
    // Get existing users from RTDB
    const usersRef = ref(rtdb, 'users');
    const usersSnapshot = await get(usersRef);
    
    if (!usersSnapshot.exists()) {
      console.log('❌ No users found in RTDB. Please create users first.');
      return;
    }
    
    const existingUsers = usersSnapshot.val();
    console.log(`📊 Found ${Object.keys(existingUsers).length} existing users`);
    
    // Create metrics for each existing user
    for (const [uid, userData] of Object.entries(existingUsers)) {
      console.log(`Creating metrics for: ${userData.name || userData.email}`);
      
      // Generate metrics and calculate scores
      const metrics = generateTestMetrics(uid);
      const scoreData = calculateUserScore(metrics);
      
      // Add to userMetrics collection with calculated scores
      await setDoc(doc(db, 'userMetrics', uid), {
        ...metrics,
        ...scoreData,
        displayName: userData.name || userData.email,
        email: userData.email,
        photoURL: userData.avatar || '',
        level: userData.level || 'beginner',
        membership: userData.membership || 'free',
        lastUpdated: new Date()
      });
      
      console.log(`✅ Created metrics for ${userData.name || userData.email} with score: ${scoreData.totalScore}`);
    }
    
    // Use the real-time ranking system to calculate and store rankings
    console.log('🔄 Calculating rankings using Smart Ranking System...');
    const rankings = await recalculateAllRankings();
    
    console.log('✅ Rankings calculated and stored in real-time database');
    console.log('🎉 Test data created! Check your leaderboard now.');
    console.log('📊 Top 3 users:');
    rankings.slice(0, 3).forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.displayName} - ${user.tier} (Score: ${user.score})`);
    });
    
  } catch (error) {
    console.error('❌ Error creating test data:', error);
  }
};

// Function to simulate real-time workout updates for existing users
export const simulateWorkoutUpdate = async (userId, workoutData) => {
  try {
    const { updateUserWorkout } = await import('./realTimeRanking');
    await updateUserWorkout(userId, workoutData);
    console.log(`✅ Workout updated for user ${userId}`);
  } catch (error) {
    console.error('Error simulating workout update:', error);
  }
};

// Function to simulate workout for a random existing user
export const simulateRandomWorkout = async () => {
  try {
    const { getDatabase, ref, get } = await import('firebase/database');
    const rtdb = getDatabase();
    
    // Get existing users from RTDB
    const usersRef = ref(rtdb, 'users');
    const usersSnapshot = await get(usersRef);
    
    if (!usersSnapshot.exists()) {
      console.log('❌ No users found in RTDB');
      return;
    }
    
    const existingUsers = usersSnapshot.val();
    const userIds = Object.keys(existingUsers);
    const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
    
    // Simulate workout data
    const workoutData = {
      maxWeightLifted: Math.floor(Math.random() * 200) + 30,
      totalWorkouts: Math.floor(Math.random() * 20) + 5,
      workoutStreak: Math.floor(Math.random() * 10) + 1,
      totalCaloriesBurned: Math.floor(Math.random() * 5000) + 1000
    };
    
    await simulateWorkoutUpdate(randomUserId, workoutData);
    console.log(`✅ Simulated workout for user: ${existingUsers[randomUserId].name || existingUsers[randomUserId].email}`);
    
  } catch (error) {
    console.error('Error simulating random workout:', error);
  }
};

// Function to trigger ranking calculation
export const triggerRankingCalculation = async () => {
  try {
    const { recalculateAllRankings } = await import('./realTimeRanking');
    const rankings = await recalculateAllRankings();
    console.log('✅ Rankings recalculated:', rankings.length, 'users');
    return rankings;
  } catch (error) {
    console.error('Error triggering ranking calculation:', error);
  }
};

// Export for use in React components
export default { createQuickTestData, triggerRankingCalculation };
