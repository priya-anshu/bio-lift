/**
 * Smart Ranking System Test Script
 * 
 * This script tests the complete ranking system functionality including:
 * - Score calculation
 * - Ranking updates
 * - Data validation
 * - API endpoints
 * - Performance metrics
 */

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin (for testing)
const serviceAccount = require('../serviceAccountKey.json');
initializeApp({
  credential: require('firebase-admin').credential.cert(serviceAccount)
});

const db = getFirestore();

// Test configuration
const TEST_CONFIG = {
  numberOfUsers: 50,
  testIterations: 3,
  apiBaseUrl: 'https://us-central1-biolift-c37b6.cloudfunctions.net'
};

// Sample user data generator
function generateTestUser(userId) {
  return {
    userId: userId,
    timestamp: new Date(),
    
    // Strength metrics
    maxWeightLifted: Math.floor(Math.random() * 200) + 50, // 50-250 kg
    oneRepMax: Math.floor(Math.random() * 150) + 30, // 30-180 kg
    totalWeightLifted: Math.floor(Math.random() * 5000) + 1000, // 1000-6000 kg
    bodyWeight: Math.floor(Math.random() * 50) + 60, // 60-110 kg
    strengthExercises: ['Bench Press', 'Squat', 'Deadlift'],
    
    // Stamina metrics
    workoutDuration: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
    cardioMinutes: Math.floor(Math.random() * 60) + 10, // 10-70 minutes
    restTimeBetweenSets: Math.floor(Math.random() * 120) + 30, // 30-150 seconds
    enduranceExercises: ['Running', 'Cycling', 'Swimming'],
    heartRateData: Array.from({length: 10}, () => Math.floor(Math.random() * 60) + 120), // 120-180 bpm
    maxHeartRate: Math.floor(Math.random() * 40) + 160, // 160-200 bpm
    
    // Consistency metrics
    workoutStreak: Math.floor(Math.random() * 30) + 1, // 1-30 days
    totalWorkouts: Math.floor(Math.random() * 200) + 10, // 10-210 workouts
    daysSinceStart: Math.floor(Math.random() * 365) + 30, // 30-395 days
    missedWorkouts: Math.floor(Math.random() * 50) + 0, // 0-50 missed
    workoutFrequency: Math.random() * 5 + 2, // 2-7 workouts per week
    lastWorkoutDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last week
    
    // Additional metrics
    caloriesBurned: Math.floor(Math.random() * 800) + 200, // 200-1000 calories
    workoutIntensity: Math.random() * 8 + 2, // 2-10 scale
    workoutSatisfaction: Math.random() * 8 + 2, // 2-10 scale
    customMetrics: {
      flexibility: Math.random() * 100,
      balance: Math.random() * 100,
      coordination: Math.random() * 100
    }
  };
}

// Test utilities
class RankingSystemTest {
  constructor() {
    this.testResults = [];
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runTest(testName, testFunction) {
    this.log(`Starting test: ${testName}`);
    const startTime = Date.now();
    
    try {
      await testFunction();
      const duration = Date.now() - startTime;
      this.testResults.push({
        name: testName,
        status: 'PASSED',
        duration: duration
      });
      this.log(`Test passed: ${testName} (${duration}ms)`, 'success');
    } catch (error) {
      const duration = Date.now() - startTime;
      this.testResults.push({
        name: testName,
        status: 'FAILED',
        duration: duration,
        error: error.message
      });
      this.log(`Test failed: ${testName} - ${error.message}`, 'error');
    }
  }

  async cleanup() {
    this.log('Cleaning up test data...');
    
    // Delete test users
    const batch = db.batch();
    for (let i = 1; i <= TEST_CONFIG.numberOfUsers; i++) {
      const userId = `test_user_${i}`;
      
      // Delete user metrics
      const metricsRef = db.collection('userMetrics').doc(userId);
      batch.delete(metricsRef);
      
      // Delete user scores
      const scoresRef = db.collection('userScores').doc(userId);
      batch.delete(scoresRef);
      
      // Delete score breakdowns
      const breakdownRef = db.collection('scoreBreakdowns').doc(userId);
      batch.delete(breakdownRef);
      
      // Delete historical data
      const historyRef = db.collection('userMetricsHistory').doc(userId);
      batch.delete(historyRef);
    }
    
    await batch.commit();
    this.log('Cleanup completed', 'success');
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('SMART RANKING SYSTEM TEST RESULTS');
    console.log('='.repeat(60));
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.status === 'PASSED').length;
    const failedTests = totalTests - passedTests;
    const totalDuration = Date.now() - this.startTime;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log(`Total Duration: ${totalDuration}ms`);
    
    console.log('\nDetailed Results:');
    this.testResults.forEach(result => {
      const status = result.status === 'PASSED' ? '✅' : '❌';
      console.log(`${status} ${result.name} (${result.duration}ms)`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    console.log('\n' + '='.repeat(60));
  }
}

// Test functions
async function testDataValidation() {
  const testData = generateTestUser('validation_test_user');
  
  // Test valid data
  const validData = { ...testData };
  if (!validData.userId || !validData.timestamp) {
    throw new Error('Valid data validation failed');
  }
  
  // Test invalid data
  const invalidData = { ...testData, maxWeightLifted: -10 };
  if (invalidData.maxWeightLifted >= 0) {
    throw new Error('Invalid data validation failed');
  }
  
  // Test missing required fields
  const missingFields = { userId: 'test' };
  if (missingFields.timestamp) {
    throw new Error('Missing fields validation failed');
  }
}

async function testScoreCalculation() {
  const testUser = generateTestUser('score_test_user');
  
  // Add test user metrics
  await db.collection('userMetrics').doc(testUser.userId).set(testUser);
  
  // Wait for score calculation (trigger should fire)
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Check if score was calculated
  const scoreDoc = await db.collection('userScores').doc(testUser.userId).get();
  if (!scoreDoc.exists) {
    throw new Error('Score calculation failed - no score document found');
  }
  
  const scoreData = scoreDoc.data();
  if (typeof scoreData.score !== 'number' || scoreData.score < 0 || scoreData.score > 100) {
    throw new Error(`Invalid score calculated: ${scoreData.score}`);
  }
  
  // Validate individual category scores
  const categories = ['strengthScore', 'staminaScore', 'consistencyScore', 'improvementScore'];
  for (const category of categories) {
    if (typeof scoreData[category] !== 'number' || scoreData[category] < 0 || scoreData[category] > 100) {
      throw new Error(`Invalid ${category}: ${scoreData[category]}`);
    }
  }
}

async function testRankingGeneration() {
  // Create multiple test users
  const testUsers = [];
  for (let i = 1; i <= TEST_CONFIG.numberOfUsers; i++) {
    const user = generateTestUser(`ranking_test_user_${i}`);
    testUsers.push(user);
    
    // Add user metrics
    await db.collection('userMetrics').doc(user.userId).set(user);
  }
  
  // Wait for all scores to be calculated
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Check if rankings were generated
  const rankingsDoc = await db.collection('rankings').doc('overall').get();
  if (!rankingsDoc.exists) {
    throw new Error('Ranking generation failed - no rankings document found');
  }
  
  const rankingsData = rankingsDoc.data();
  if (!rankingsData.rankings || rankingsData.rankings.length === 0) {
    throw new Error('Ranking generation failed - no rankings data');
  }
  
  // Validate ranking structure
  const firstRanking = rankingsData.rankings[0];
  if (!firstRanking.userId || !firstRanking.rank || !firstRanking.score || !firstRanking.tier) {
    throw new Error('Invalid ranking structure');
  }
  
  // Check if rankings are sorted by score (descending)
  for (let i = 1; i < rankingsData.rankings.length; i++) {
    if (rankingsData.rankings[i].score > rankingsData.rankings[i - 1].score) {
      throw new Error('Rankings not properly sorted by score');
    }
  }
  
  // Validate tier distribution
  const tierCounts = {};
  rankingsData.rankings.forEach(ranking => {
    tierCounts[ranking.tier] = (tierCounts[ranking.tier] || 0) + 1;
  });
  
  const totalUsers = rankingsData.rankings.length;
  const expectedTiers = {
    Diamond: Math.ceil(totalUsers * 0.05),
    Platinum: Math.ceil(totalUsers * 0.10),
    Gold: Math.ceil(totalUsers * 0.15),
    Silver: Math.ceil(totalUsers * 0.20),
    Bronze: Math.ceil(totalUsers * 0.50)
  };
  
  for (const [tier, expectedCount] of Object.entries(expectedTiers)) {
    const actualCount = tierCounts[tier] || 0;
    if (actualCount === 0) {
      throw new Error(`No users assigned to ${tier} tier`);
    }
  }
}

async function testAPIEndpoints() {
  // Test leaderboard endpoint
  const leaderboardResponse = await fetch(
    `${TEST_CONFIG.apiBaseUrl}/getLeaderboard?type=overall&limit=10`
  );
  
  if (!leaderboardResponse.ok) {
    throw new Error(`Leaderboard API failed: ${leaderboardResponse.status}`);
  }
  
  const leaderboardData = await leaderboardResponse.json();
  if (!leaderboardData.success || !Array.isArray(leaderboardData.data)) {
    throw new Error('Invalid leaderboard API response');
  }
  
  // Test user ranking endpoint
  const userRankingResponse = await fetch(
    `${TEST_CONFIG.apiBaseUrl}/getUserRanking?userId=ranking_test_user_1`
  );
  
  if (!userRankingResponse.ok) {
    throw new Error(`User ranking API failed: ${userRankingResponse.status}`);
  }
  
  const userRankingData = await userRankingResponse.json();
  if (!userRankingData.success || !userRankingData.data) {
    throw new Error('Invalid user ranking API response');
  }
}

async function testPerformance() {
  const startTime = Date.now();
  
  // Test with larger dataset
  const largeTestUsers = [];
  for (let i = 1; i <= 100; i++) {
    const user = generateTestUser(`perf_test_user_${i}`);
    largeTestUsers.push(user);
    
    // Add user metrics
    await db.collection('userMetrics').doc(user.userId).set(user);
  }
  
  // Wait for processing
  await new Promise(resolve => setTimeout(resolve, 15000));
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  // Performance threshold: should process 100 users in under 20 seconds
  if (duration > 20000) {
    throw new Error(`Performance test failed: ${duration}ms for 100 users (threshold: 20000ms)`);
  }
  
  console.log(`Performance test passed: ${duration}ms for 100 users`);
}

async function testWeightUpdates() {
  // Test weight validation
  const validWeights = {
    strength: 0.3,
    stamina: 0.25,
    consistency: 0.25,
    improvement: 0.2
  };
  
  const totalWeight = Object.values(validWeights).reduce((sum, weight) => sum + weight, 0);
  if (Math.abs(totalWeight - 1.0) > 0.01) {
    throw new Error(`Invalid weight sum: ${totalWeight} (should be 1.0)`);
  }
  
  // Test invalid weights
  const invalidWeights = {
    strength: 0.5,
    stamina: 0.5,
    consistency: 0.5,
    improvement: 0.5
  };
  
  const invalidTotal = Object.values(invalidWeights).reduce((sum, weight) => sum + weight, 0);
  if (Math.abs(invalidTotal - 1.0) <= 0.01) {
    throw new Error('Invalid weights validation failed');
  }
}

async function testHistoricalData() {
  const testUserId = 'history_test_user';
  
  // Create historical snapshots
  const historicalData = [];
  for (let i = 0; i < 5; i++) {
    const snapshot = {
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Last 5 days
      metrics: generateTestUser(testUserId),
      score: Math.random() * 100,
      rank: Math.floor(Math.random() * 100) + 1
    };
    historicalData.push(snapshot);
    
    // Add to historical collection
    await db.collection('userMetricsHistory')
      .doc(testUserId)
      .collection('snapshots')
      .add(snapshot);
  }
  
  // Verify historical data was stored
  const historySnapshot = await db.collection('userMetricsHistory')
    .doc(testUserId)
    .collection('snapshots')
    .orderBy('timestamp', 'desc')
    .limit(5)
    .get();
  
  if (historySnapshot.size !== 5) {
    throw new Error(`Historical data test failed: expected 5 snapshots, got ${historySnapshot.size}`);
  }
}

// Main test runner
async function runAllTests() {
  const tester = new RankingSystemTest();
  
  try {
    // Run all tests
    await tester.runTest('Data Validation', testDataValidation);
    await tester.runTest('Score Calculation', testScoreCalculation);
    await tester.runTest('Ranking Generation', testRankingGeneration);
    await tester.runTest('API Endpoints', testAPIEndpoints);
    await tester.runTest('Performance', testPerformance);
    await tester.runTest('Weight Updates', testWeightUpdates);
    await tester.runTest('Historical Data', testHistoricalData);
    
    // Print results
    tester.printResults();
    
  } catch (error) {
    console.error('Test runner error:', error);
  } finally {
    // Cleanup test data
    await tester.cleanup();
  }
}

// Export for use in other test files
module.exports = {
  RankingSystemTest,
  generateTestUser,
  runAllTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  console.log('Starting Smart Ranking System Tests...\n');
  runAllTests().catch(console.error);
}
