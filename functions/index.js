const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// Import ranking system modules
const { calculateUserScore } = require("./scoreCalculator");
const { updateRankings, getLeaderboard } = require("./rankingEngine");
const { validateMetrics, sanitizeData } = require("./dataValidator");

// ===== SMART RANKING SYSTEM CLOUD FUNCTIONS =====

/**
 * Trigger: New user metrics added
 * Purpose: Calculate score and update rankings when new metrics are added
 */
exports.onMetricsAdded = onDocumentCreated("/userMetrics/{userId}", async (event) => {
  try {
    const userId = event.params.userId;
    const metricsData = event.data.data();
    
    logger.info(`Processing new metrics for user: ${userId}`);
    
    // Validate incoming metrics data
    const validatedData = validateMetrics(metricsData);
    if (!validatedData.isValid) {
      logger.error(`Invalid metrics data for user ${userId}:`, validatedData.errors);
      return null;
    }
    
    // Calculate user score
    const userScore = await calculateUserScore(userId, validatedData.data);
    
    // Update user's current score
    await db.collection("userScores").doc(userId).set({
      userId: userId,
      score: userScore.totalScore,
      strengthScore: userScore.strengthScore,
      staminaScore: userScore.staminaScore,
      consistencyScore: userScore.consistencyScore,
      improvementScore: userScore.improvementScore,
      lastUpdated: new Date(),
      metrics: validatedData.data
    }, { merge: true });
    
    // Trigger ranking update
    await updateRankings();
    
    logger.info(`Successfully processed metrics for user: ${userId}`);
    return null;
  } catch (error) {
    logger.error("Error processing new metrics:", error);
    throw error;
  }
});

/**
 * Trigger: User metrics updated
 * Purpose: Recalculate score and update rankings when metrics are modified
 */
exports.onMetricsUpdated = onDocumentUpdated("/userMetrics/{userId}", async (event) => {
  try {
    const userId = event.params.userId;
    const newData = event.data.after.data();
    const previousData = event.data.before.data();
    
    logger.info(`Processing updated metrics for user: ${userId}`);
    
    // Only process if there are meaningful changes
    if (JSON.stringify(newData) === JSON.stringify(previousData)) {
      return null;
    }
    
    // Validate updated metrics data
    const validatedData = validateMetrics(newData);
    if (!validatedData.isValid) {
      logger.error(`Invalid updated metrics for user ${userId}:`, validatedData.errors);
      return null;
    }
    
    // Recalculate user score
    const userScore = await calculateUserScore(userId, validatedData.data);
    
    // Update user's current score
    await db.collection("userScores").doc(userId).set({
      userId: userId,
      score: userScore.totalScore,
      strengthScore: userScore.strengthScore,
      staminaScore: userScore.staminaScore,
      consistencyScore: userScore.consistencyScore,
      improvementScore: userScore.improvementScore,
      lastUpdated: new Date(),
      metrics: validatedData.data
    }, { merge: true });
    
    // Trigger ranking update
    await updateRankings();
    
    logger.info(`Successfully processed updated metrics for user: ${userId}`);
    return null;
  } catch (error) {
    logger.error("Error processing updated metrics:", error);
    throw error;
  }
});

/**
 * HTTP Function: Get leaderboard data
 * Purpose: Retrieve leaderboard data for frontend display
 */
exports.getLeaderboard = onRequest(async (req, res) => {
  try {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    
    const { type = 'overall', limit = 50, offset = 0 } = req.query;
    
    const leaderboard = await getLeaderboard(type, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      data: leaderboard,
      type: type,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch leaderboard data"
    });
  }
});

/**
 * HTTP Function: Admin - Recalculate all rankings
 * Purpose: Force recalculation of all user rankings (admin only)
 */
exports.recalculateAllRankings = onRequest(async (req, res) => {
  try {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    
    // Verify admin access (you should implement proper authentication)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: "Unauthorized access"
      });
      return;
    }
    
    logger.info("Starting full ranking recalculation...");
    
    // Get all users with metrics
    const usersSnapshot = await db.collection("userMetrics").get();
    const users = [];
    
    usersSnapshot.forEach(doc => {
      users.push({
        userId: doc.id,
        metrics: doc.data()
      });
    });
    
    // Process each user
    const batch = db.batch();
    let processedCount = 0;
    
    for (const user of users) {
      try {
        const validatedData = validateMetrics(user.metrics);
        if (validatedData.isValid) {
          const userScore = await calculateUserScore(user.userId, validatedData.data);
          
          const scoreRef = db.collection("userScores").doc(user.userId);
          batch.set(scoreRef, {
            userId: user.userId,
            score: userScore.totalScore,
            strengthScore: userScore.strengthScore,
            staminaScore: userScore.staminaScore,
            consistencyScore: userScore.consistencyScore,
            improvementScore: userScore.improvementScore,
            lastUpdated: new Date(),
            metrics: validatedData.data
          }, { merge: true });
          
          processedCount++;
        }
      } catch (error) {
        logger.error(`Error processing user ${user.userId}:`, error);
      }
    }
    
    // Commit all score updates
    await batch.commit();
    
    // Update rankings
    await updateRankings();
    
    logger.info(`Successfully recalculated rankings for ${processedCount} users`);
    
    res.json({
      success: true,
      message: `Successfully recalculated rankings for ${processedCount} users`,
      processedCount: processedCount
    });
  } catch (error) {
    logger.error("Error in full ranking recalculation:", error);
    res.status(500).json({
      success: false,
      error: "Failed to recalculate rankings"
    });
  }
});

/**
 * HTTP Function: Admin - Update ranking weights
 * Purpose: Update the weight factors for score calculation (admin only)
 */
exports.updateRankingWeights = onRequest(async (req, res) => {
  try {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    
    // Verify admin access
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: "Unauthorized access"
      });
      return;
    }
    
    const { weights } = req.body;
    
    if (!weights || typeof weights !== 'object') {
      res.status(400).json({
        success: false,
        error: "Invalid weights data"
      });
      return;
    }
    
    // Validate weights
    const requiredWeights = ['strength', 'stamina', 'consistency', 'improvement'];
    for (const weight of requiredWeights) {
      if (typeof weights[weight] !== 'number' || weights[weight] < 0 || weights[weight] > 1) {
        res.status(400).json({
          success: false,
          error: `Invalid weight for ${weight}. Must be a number between 0 and 1.`
        });
        return;
      }
    }
    
    // Update weights in database
    await db.collection("systemConfig").doc("rankingWeights").set({
      weights: weights,
      lastUpdated: new Date(),
      updatedBy: "admin" // You should get this from auth token
    });
    
    logger.info("Ranking weights updated:", weights);
    
    res.json({
      success: true,
      message: "Ranking weights updated successfully",
      weights: weights
    });
  } catch (error) {
    logger.error("Error updating ranking weights:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update ranking weights"
    });
  }
});

/**
 * HTTP Function: Get user ranking details
 * Purpose: Get detailed ranking information for a specific user
 */
exports.getUserRanking = onRequest(async (req, res) => {
  try {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    
    const { userId } = req.query;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID is required"
      });
      return;
    }
    
    // Get user score and ranking
    const userScoreDoc = await db.collection("userScores").doc(userId).get();
    const rankingsDoc = await db.collection("rankings").doc("overall").get();
    
    if (!userScoreDoc.exists) {
      res.status(404).json({
        success: false,
        error: "User not found"
      });
      return;
    }
    
    const userScore = userScoreDoc.data();
    const rankings = rankingsDoc.exists ? rankingsDoc.data().rankings : [];
    
    // Find user's position in rankings
    const userRank = rankings.findIndex(rank => rank.userId === userId) + 1;
    
    // Get previous ranking for delta calculation
    const previousRankingsDoc = await db.collection("rankings").doc("overall_previous").get();
    const previousRankings = previousRankingsDoc.exists ? previousRankingsDoc.data().rankings : [];
    const previousRank = previousRankings.findIndex(rank => rank.userId === userId) + 1;
    
    const rankDelta = previousRank > 0 ? previousRank - userRank : 0;
    
    res.json({
      success: true,
      data: {
        userId: userId,
        currentRank: userRank,
        previousRank: previousRank > 0 ? previousRank : null,
        rankDelta: rankDelta,
        score: userScore.score,
        strengthScore: userScore.strengthScore,
        staminaScore: userScore.staminaScore,
        consistencyScore: userScore.consistencyScore,
        improvementScore: userScore.improvementScore,
        lastUpdated: userScore.lastUpdated
      }
    });
  } catch (error) {
    logger.error("Error fetching user ranking:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user ranking"
    });
  }
});

// Export all functions
module.exports = {
  onMetricsAdded,
  onMetricsUpdated,
  getLeaderboard,
  recalculateAllRankings,
  updateRankingWeights,
  getUserRanking
};
