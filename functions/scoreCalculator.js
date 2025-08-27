const { getFirestore } = require("firebase-admin/firestore");
const { logger } = require("firebase-functions");

const db = getFirestore();

/**
 * Smart Ranking System Score Calculator
 * 
 * This module calculates user scores based on multiple performance factors:
 * - Strength: Max weight lifted, one-rep max, etc.
 * - Stamina: Endurance metrics, workout duration, etc.
 * - Consistency: Regular workout attendance, streak length
 * - Improvement: Progress over time, rate of improvement
 */

// Default weight configuration
const DEFAULT_WEIGHTS = {
  strength: 0.3,
  stamina: 0.25,
  consistency: 0.25,
  improvement: 0.2
};

/**
 * Calculate comprehensive user score based on performance metrics
 * @param {string} userId - User ID
 * @param {Object} metrics - User performance metrics
 * @returns {Object} Calculated scores for each category and total
 */
async function calculateUserScore(userId, metrics) {
  try {
    // Get current weight configuration
    const weights = await getCurrentWeights();
    
    // Calculate individual category scores
    const strengthScore = calculateStrengthScore(metrics);
    const staminaScore = calculateStaminaScore(metrics);
    const consistencyScore = calculateConsistencyScore(metrics);
    const improvementScore = await calculateImprovementScore(userId, metrics);
    
    // Calculate weighted total score
    const totalScore = (
      strengthScore * weights.strength +
      staminaScore * weights.stamina +
      consistencyScore * weights.consistency +
      improvementScore * weights.improvement
    );
    
    // Store score breakdown for analysis
    await storeScoreBreakdown(userId, {
      strengthScore,
      staminaScore,
      consistencyScore,
      improvementScore,
      totalScore,
      weights,
      calculatedAt: new Date()
    });
    
    return {
      totalScore: Math.round(totalScore * 100) / 100, // Round to 2 decimal places
      strengthScore: Math.round(strengthScore * 100) / 100,
      staminaScore: Math.round(staminaScore * 100) / 100,
      consistencyScore: Math.round(consistencyScore * 100) / 100,
      improvementScore: Math.round(improvementScore * 100) / 100
    };
  } catch (error) {
    logger.error(`Error calculating score for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Calculate strength score based on lifting metrics
 * @param {Object} metrics - User metrics
 * @returns {number} Strength score (0-100)
 */
function calculateStrengthScore(metrics) {
  const {
    maxWeightLifted = 0,
    oneRepMax = 0,
    totalWeightLifted = 0,
    strengthExercises = [],
    bodyWeight = 70 // Default body weight in kg
  } = metrics;
  
  let strengthScore = 0;
  
  // Factor 1: Max weight lifted (relative to body weight)
  if (maxWeightLifted > 0 && bodyWeight > 0) {
    const weightToBodyRatio = maxWeightLifted / bodyWeight;
    // Score based on weight-to-body ratio (0-50 points)
    strengthScore += Math.min(50, weightToBodyRatio * 25);
  }
  
  // Factor 2: One-rep max (absolute strength)
  if (oneRepMax > 0) {
    // Score based on one-rep max (0-30 points)
    strengthScore += Math.min(30, oneRepMax / 10);
  }
  
  // Factor 3: Total weight lifted (volume)
  if (totalWeightLifted > 0) {
    // Score based on total volume (0-20 points)
    strengthScore += Math.min(20, totalWeightLifted / 1000);
  }
  
  // Cap at 100
  return Math.min(100, strengthScore);
}

/**
 * Calculate stamina score based on endurance metrics
 * @param {Object} metrics - User metrics
 * @returns {number} Stamina score (0-100)
 */
function calculateStaminaScore(metrics) {
  const {
    workoutDuration = 0,
    cardioMinutes = 0,
    restTimeBetweenSets = 0,
    enduranceExercises = [],
    heartRateData = [],
    maxHeartRate = 0
  } = metrics;
  
  let staminaScore = 0;
  
  // Factor 1: Workout duration (0-30 points)
  if (workoutDuration > 0) {
    // Score based on average workout duration in minutes
    staminaScore += Math.min(30, workoutDuration / 2);
  }
  
  // Factor 2: Cardio minutes (0-25 points)
  if (cardioMinutes > 0) {
    staminaScore += Math.min(25, cardioMinutes / 3);
  }
  
  // Factor 3: Rest time efficiency (0-20 points)
  if (restTimeBetweenSets > 0) {
    // Lower rest time = higher score (more efficient)
    const restEfficiency = Math.max(0, 120 - restTimeBetweenSets) / 120;
    staminaScore += restEfficiency * 20;
  }
  
  // Factor 4: Heart rate data (0-25 points)
  if (heartRateData.length > 0 && maxHeartRate > 0) {
    const avgHeartRate = heartRateData.reduce((sum, hr) => sum + hr, 0) / heartRateData.length;
    const heartRateEfficiency = avgHeartRate / maxHeartRate;
    staminaScore += heartRateEfficiency * 25;
  }
  
  return Math.min(100, staminaScore);
}

/**
 * Calculate consistency score based on workout regularity
 * @param {Object} metrics - User metrics
 * @returns {number} Consistency score (0-100)
 */
function calculateConsistencyScore(metrics) {
  const {
    workoutStreak = 0,
    totalWorkouts = 0,
    daysSinceStart = 0,
    missedWorkouts = 0,
    workoutFrequency = 0,
    lastWorkoutDate = null
  } = metrics;
  
  let consistencyScore = 0;
  
  // Factor 1: Current workout streak (0-40 points)
  if (workoutStreak > 0) {
    consistencyScore += Math.min(40, workoutStreak * 2);
  }
  
  // Factor 2: Overall workout frequency (0-30 points)
  if (totalWorkouts > 0 && daysSinceStart > 0) {
    const frequency = totalWorkouts / daysSinceStart;
    consistencyScore += Math.min(30, frequency * 100);
  }
  
  // Factor 3: Attendance rate (0-20 points)
  if (totalWorkouts > 0 && missedWorkouts >= 0) {
    const attendanceRate = totalWorkouts / (totalWorkouts + missedWorkouts);
    consistencyScore += attendanceRate * 20;
  }
  
  // Factor 4: Recent activity (0-10 points)
  if (lastWorkoutDate) {
    const daysSinceLastWorkout = (new Date() - new Date(lastWorkoutDate)) / (1000 * 60 * 60 * 24);
    if (daysSinceLastWorkout <= 7) {
      consistencyScore += 10;
    } else if (daysSinceLastWorkout <= 14) {
      consistencyScore += 5;
    }
  }
  
  return Math.min(100, consistencyScore);
}

/**
 * Calculate improvement score based on progress over time
 * @param {string} userId - User ID
 * @param {Object} currentMetrics - Current user metrics
 * @returns {number} Improvement score (0-100)
 */
async function calculateImprovementScore(userId, currentMetrics) {
  try {
    // Get historical data for comparison
    const historicalData = await getHistoricalMetrics(userId);
    
    if (!historicalData || historicalData.length < 2) {
      // Not enough data for improvement calculation
      return 50; // Neutral score
    }
    
    let improvementScore = 0;
    
    // Factor 1: Strength improvement (0-30 points)
    const strengthImprovement = calculateStrengthImprovement(historicalData, currentMetrics);
    improvementScore += strengthImprovement * 30;
    
    // Factor 2: Stamina improvement (0-25 points)
    const staminaImprovement = calculateStaminaImprovement(historicalData, currentMetrics);
    improvementScore += staminaImprovement * 25;
    
    // Factor 3: Consistency improvement (0-25 points)
    const consistencyImprovement = calculateConsistencyImprovement(historicalData, currentMetrics);
    improvementScore += consistencyImprovement * 25;
    
    // Factor 4: Overall progress rate (0-20 points)
    const progressRate = calculateProgressRate(historicalData, currentMetrics);
    improvementScore += progressRate * 20;
    
    return Math.min(100, improvementScore);
  } catch (error) {
    logger.error(`Error calculating improvement score for user ${userId}:`, error);
    return 50; // Default neutral score
  }
}

/**
 * Calculate strength improvement over time
 * @param {Array} historicalData - Historical metrics data
 * @param {Object} currentMetrics - Current metrics
 * @returns {number} Improvement factor (0-1)
 */
function calculateStrengthImprovement(historicalData, currentMetrics) {
  const recentData = historicalData.slice(-3); // Last 3 data points
  const oldData = historicalData.slice(0, 3); // First 3 data points
  
  if (recentData.length === 0 || oldData.length === 0) {
    return 0.5;
  }
  
  const recentAvg = recentData.reduce((sum, data) => sum + (data.maxWeightLifted || 0), 0) / recentData.length;
  const oldAvg = oldData.reduce((sum, data) => sum + (data.maxWeightLifted || 0), 0) / oldData.length;
  
  if (oldAvg === 0) return 0.5;
  
  const improvement = (recentAvg - oldAvg) / oldAvg;
  return Math.max(0, Math.min(1, improvement + 0.5)); // Normalize to 0-1
}

/**
 * Calculate stamina improvement over time
 * @param {Array} historicalData - Historical metrics data
 * @param {Object} currentMetrics - Current metrics
 * @returns {number} Improvement factor (0-1)
 */
function calculateStaminaImprovement(historicalData, currentMetrics) {
  const recentData = historicalData.slice(-3);
  const oldData = historicalData.slice(0, 3);
  
  if (recentData.length === 0 || oldData.length === 0) {
    return 0.5;
  }
  
  const recentAvg = recentData.reduce((sum, data) => sum + (data.workoutDuration || 0), 0) / recentData.length;
  const oldAvg = oldData.reduce((sum, data) => sum + (data.workoutDuration || 0), 0) / oldData.length;
  
  if (oldAvg === 0) return 0.5;
  
  const improvement = (recentAvg - oldAvg) / oldAvg;
  return Math.max(0, Math.min(1, improvement + 0.5));
}

/**
 * Calculate consistency improvement over time
 * @param {Array} historicalData - Historical metrics data
 * @param {Object} currentMetrics - Current metrics
 * @returns {number} Improvement factor (0-1)
 */
function calculateConsistencyImprovement(historicalData, currentMetrics) {
  const recentData = historicalData.slice(-3);
  const oldData = historicalData.slice(0, 3);
  
  if (recentData.length === 0 || oldData.length === 0) {
    return 0.5;
  }
  
  const recentAvg = recentData.reduce((sum, data) => sum + (data.workoutStreak || 0), 0) / recentData.length;
  const oldAvg = oldData.reduce((sum, data) => sum + (data.workoutStreak || 0), 0) / oldData.length;
  
  if (oldAvg === 0) return 0.5;
  
  const improvement = (recentAvg - oldAvg) / oldAvg;
  return Math.max(0, Math.min(1, improvement + 0.5));
}

/**
 * Calculate overall progress rate
 * @param {Array} historicalData - Historical metrics data
 * @param {Object} currentMetrics - Current metrics
 * @returns {number} Progress rate (0-1)
 */
function calculateProgressRate(historicalData, currentMetrics) {
  if (historicalData.length < 2) return 0.5;
  
  const timeSpan = historicalData.length; // Number of data points
  const progressTrend = historicalData.map((data, index) => {
    return (data.maxWeightLifted || 0) + (data.workoutDuration || 0) + (data.workoutStreak || 0);
  });
  
  // Calculate trend (positive = improving, negative = declining)
  let trend = 0;
  for (let i = 1; i < progressTrend.length; i++) {
    trend += progressTrend[i] - progressTrend[i - 1];
  }
  
  const avgTrend = trend / (progressTrend.length - 1);
  return Math.max(0, Math.min(1, avgTrend / 100 + 0.5)); // Normalize to 0-1
}

/**
 * Get current weight configuration from database
 * @returns {Object} Current weight configuration
 */
async function getCurrentWeights() {
  try {
    const weightsDoc = await db.collection("systemConfig").doc("rankingWeights").get();
    
    if (weightsDoc.exists) {
      return weightsDoc.data().weights;
    }
    
    // Return default weights if not configured
    return DEFAULT_WEIGHTS;
  } catch (error) {
    logger.error("Error fetching weight configuration:", error);
    return DEFAULT_WEIGHTS;
  }
}

/**
 * Get historical metrics for a user
 * @param {string} userId - User ID
 * @returns {Array} Historical metrics data
 */
async function getHistoricalMetrics(userId) {
  try {
    const historicalSnapshot = await db.collection("userMetricsHistory")
      .doc(userId)
      .collection("snapshots")
      .orderBy("timestamp", "desc")
      .limit(10)
      .get();
    
    const historicalData = [];
    historicalSnapshot.forEach(doc => {
      historicalData.push(doc.data());
    });
    
    return historicalData;
  } catch (error) {
    logger.error(`Error fetching historical metrics for user ${userId}:`, error);
    return [];
  }
}

/**
 * Store score breakdown for analysis and debugging
 * @param {string} userId - User ID
 * @param {Object} scoreBreakdown - Detailed score breakdown
 */
async function storeScoreBreakdown(userId, scoreBreakdown) {
  try {
    await db.collection("scoreBreakdowns").doc(userId).set({
      ...scoreBreakdown,
      userId: userId
    }, { merge: true });
  } catch (error) {
    logger.error(`Error storing score breakdown for user ${userId}:`, error);
  }
}

/**
 * Get personalized insights for a user
 * @param {string} userId - User ID
 * @returns {Object} Personalized insights and recommendations
 */
async function getUserInsights(userId) {
  try {
    const scoreBreakdown = await db.collection("scoreBreakdowns").doc(userId).get();
    const userScore = await db.collection("userScores").doc(userId).get();
    
    if (!scoreBreakdown.exists || !userScore.exists) {
      return {
        insights: [],
        recommendations: []
      };
    }
    
    const breakdown = scoreBreakdown.data();
    const score = userScore.data();
    
    const insights = [];
    const recommendations = [];
    
    // Analyze strength performance
    if (breakdown.strengthScore < 50) {
      insights.push("Your strength score is below average");
      recommendations.push("Focus on progressive overload in your strength training");
    } else if (breakdown.strengthScore > 80) {
      insights.push("Excellent strength performance!");
      recommendations.push("Consider increasing weight or adding more challenging exercises");
    }
    
    // Analyze stamina performance
    if (breakdown.staminaScore < 50) {
      insights.push("Your endurance could be improved");
      recommendations.push("Add more cardio sessions and reduce rest time between sets");
    }
    
    // Analyze consistency
    if (breakdown.consistencyScore < 50) {
      insights.push("Workout consistency needs improvement");
      recommendations.push("Set a regular workout schedule and stick to it");
    }
    
    // Analyze improvement
    if (breakdown.improvementScore < 50) {
      insights.push("Your progress rate is slower than average");
      recommendations.push("Review your training program and consider increasing intensity");
    }
    
    return {
      insights,
      recommendations,
      scoreBreakdown: breakdown
    };
  } catch (error) {
    logger.error(`Error generating insights for user ${userId}:`, error);
    return {
      insights: [],
      recommendations: []
    };
  }
}

module.exports = {
  calculateUserScore,
  getUserInsights,
  getCurrentWeights
};
