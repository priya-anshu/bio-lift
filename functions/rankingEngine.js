const { getFirestore } = require("firebase-admin/firestore");
const { logger } = require("firebase-functions");

const db = getFirestore();

/**
 * Smart Ranking System Ranking Engine
 * 
 * This module handles:
 * - Overall ranking calculations
 * - Weekly/Monthly ranking periods
 * - Leaderboard generation
 * - Ranking delta calculations
 * - Tier-based ranking system
 */

/**
 * Update all rankings (overall, weekly, monthly)
 * @returns {Promise<void>}
 */
async function updateRankings() {
  try {
    logger.info("Starting ranking update process...");
    
    // Get all user scores
    const userScoresSnapshot = await db.collection("userScores").get();
    const userScores = [];
    
    userScoresSnapshot.forEach(doc => {
      const data = doc.data();
      userScores.push({
        userId: data.userId,
        score: data.score || 0,
        strengthScore: data.strengthScore || 0,
        staminaScore: data.staminaScore || 0,
        consistencyScore: data.consistencyScore || 0,
        improvementScore: data.improvementScore || 0,
        lastUpdated: data.lastUpdated
      });
    });
    
    // Sort by total score (descending)
    userScores.sort((a, b) => b.score - a.score);
    
    // Generate rankings with positions
    const rankings = userScores.map((user, index) => ({
      ...user,
      rank: index + 1,
      tier: calculateTier(index + 1, userScores.length)
    }));
    
    // Store previous rankings for delta calculation
    await storePreviousRankings();
    
    // Update overall rankings
    await updateOverallRankings(rankings);
    
    // Update weekly rankings
    await updateWeeklyRankings(rankings);
    
    // Update monthly rankings
    await updateMonthlyRankings(rankings);
    
    // Update tier statistics
    await updateTierStatistics(rankings);
    
    logger.info(`Successfully updated rankings for ${rankings.length} users`);
  } catch (error) {
    logger.error("Error updating rankings:", error);
    throw error;
  }
}

/**
 * Update overall rankings
 * @param {Array} rankings - Sorted user rankings
 * @returns {Promise<void>}
 */
async function updateOverallRankings(rankings) {
  try {
    await db.collection("rankings").doc("overall").set({
      rankings: rankings,
      lastUpdated: new Date(),
      totalUsers: rankings.length,
      metadata: {
        type: "overall",
        description: "All-time user rankings based on total performance score"
      }
    });
  } catch (error) {
    logger.error("Error updating overall rankings:", error);
    throw error;
  }
}

/**
 * Update weekly rankings
 * @param {Array} rankings - Sorted user rankings
 * @returns {Promise<void>}
 */
async function updateWeeklyRankings(rankings) {
  try {
    const now = new Date();
    const weekStart = getWeekStart(now);
    const weekEnd = getWeekEnd(now);
    
    // Filter users who were active this week
    const weeklyRankings = rankings.filter(user => {
      if (!user.lastUpdated) return false;
      const lastUpdate = new Date(user.lastUpdated.toDate ? user.lastUpdated.toDate() : user.lastUpdated);
      return lastUpdate >= weekStart && lastUpdate <= weekEnd;
    });
    
    await db.collection("rankings").doc("weekly").set({
      rankings: weeklyRankings,
      lastUpdated: new Date(),
      totalUsers: weeklyRankings.length,
      period: {
        start: weekStart,
        end: weekEnd
      },
      metadata: {
        type: "weekly",
        description: "Weekly user rankings for active users"
      }
    });
  } catch (error) {
    logger.error("Error updating weekly rankings:", error);
    throw error;
  }
}

/**
 * Update monthly rankings
 * @param {Array} rankings - Sorted user rankings
 * @returns {Promise<void>}
 */
async function updateMonthlyRankings(rankings) {
  try {
    const now = new Date();
    const monthStart = getMonthStart(now);
    const monthEnd = getMonthEnd(now);
    
    // Filter users who were active this month
    const monthlyRankings = rankings.filter(user => {
      if (!user.lastUpdated) return false;
      const lastUpdate = new Date(user.lastUpdated.toDate ? user.lastUpdated.toDate() : user.lastUpdated);
      return lastUpdate >= monthStart && lastUpdate <= monthEnd;
    });
    
    await db.collection("rankings").doc("monthly").set({
      rankings: monthlyRankings,
      lastUpdated: new Date(),
      totalUsers: monthlyRankings.length,
      period: {
        start: monthStart,
        end: monthEnd
      },
      metadata: {
        type: "monthly",
        description: "Monthly user rankings for active users"
      }
    });
  } catch (error) {
    logger.error("Error updating monthly rankings:", error);
    throw error;
  }
}

/**
 * Store previous rankings for delta calculation
 * @returns {Promise<void>}
 */
async function storePreviousRankings() {
  try {
    const overallDoc = await db.collection("rankings").doc("overall").get();
    
    if (overallDoc.exists) {
      await db.collection("rankings").doc("overall_previous").set(overallDoc.data());
    }
  } catch (error) {
    logger.error("Error storing previous rankings:", error);
  }
}

/**
 * Calculate tier based on rank and total users
 * @param {number} rank - User's rank
 * @param {number} totalUsers - Total number of users
 * @returns {string} Tier name
 */
function calculateTier(rank, totalUsers) {
  if (totalUsers === 0) return "Bronze";
  
  const percentile = (rank / totalUsers) * 100;
  
  if (percentile <= 5) return "Diamond";
  if (percentile <= 15) return "Platinum";
  if (percentile <= 30) return "Gold";
  if (percentile <= 50) return "Silver";
  return "Bronze";
}

/**
 * Update tier statistics
 * @param {Array} rankings - User rankings
 * @returns {Promise<void>}
 */
async function updateTierStatistics(rankings) {
  try {
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
    
    await db.collection("statistics").doc("tierDistribution").set({
      tierStats: tierStats,
      totalUsers: rankings.length,
      lastUpdated: new Date()
    });
  } catch (error) {
    logger.error("Error updating tier statistics:", error);
  }
}

/**
 * Get leaderboard data
 * @param {string} type - Leaderboard type (overall, weekly, monthly)
 * @param {number} limit - Number of results to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Leaderboard data
 */
async function getLeaderboard(type = 'overall', limit = 50, offset = 0) {
  try {
    const rankingsDoc = await db.collection("rankings").doc(type).get();
    
    if (!rankingsDoc.exists) {
      return [];
    }
    
    const rankings = rankingsDoc.data().rankings || [];
    
    // Apply pagination
    const paginatedRankings = rankings.slice(offset, offset + limit);
    
    // Enrich with user profile data
    const enrichedRankings = await enrichRankingsWithUserData(paginatedRankings);
    
    return enrichedRankings;
  } catch (error) {
    logger.error(`Error fetching ${type} leaderboard:`, error);
    return [];
  }
}

/**
 * Enrich rankings with user profile data
 * @param {Array} rankings - Basic ranking data
 * @returns {Promise<Array>} Enriched ranking data
 */
async function enrichRankingsWithUserData(rankings) {
  try {
    const enrichedRankings = [];
    
    for (const ranking of rankings) {
      try {
        // Get user profile data
        const userProfileDoc = await db.collection("users").doc(ranking.userId).get();
        const userProfile = userProfileDoc.exists ? userProfileDoc.data() : {};
        
        // Get previous ranking for delta calculation
        const previousRankingsDoc = await db.collection("rankings").doc("overall_previous").get();
        const previousRankings = previousRankingsDoc.exists ? previousRankingsDoc.data().rankings : [];
        const previousRank = previousRankings.findIndex(r => r.userId === ranking.userId) + 1;
        const rankDelta = previousRank > 0 ? previousRank - ranking.rank : 0;
        
        enrichedRankings.push({
          ...ranking,
          displayName: userProfile.displayName || userProfile.name || 'Anonymous',
          photoURL: userProfile.photoURL || null,
          rankDelta: rankDelta,
          rankChange: rankDelta > 0 ? 'up' : rankDelta < 0 ? 'down' : 'stable'
        });
      } catch (error) {
        logger.error(`Error enriching ranking for user ${ranking.userId}:`, error);
        // Add basic data if enrichment fails
        enrichedRankings.push({
          ...ranking,
          displayName: 'Anonymous',
          photoURL: null,
          rankDelta: 0,
          rankChange: 'stable'
        });
      }
    }
    
    return enrichedRankings;
  } catch (error) {
    logger.error("Error enriching rankings with user data:", error);
    return rankings;
  }
}

/**
 * Get user's ranking details
 * @param {string} userId - User ID
 * @param {string} type - Ranking type (overall, weekly, monthly)
 * @returns {Promise<Object>} User ranking details
 */
async function getUserRankingDetails(userId, type = 'overall') {
  try {
    const rankingsDoc = await db.collection("rankings").doc(type).get();
    
    if (!rankingsDoc.exists) {
      return null;
    }
    
    const rankings = rankingsDoc.data().rankings || [];
    const userRanking = rankings.find(rank => rank.userId === userId);
    
    if (!userRanking) {
      return null;
    }
    
    // Get previous ranking for delta calculation
    const previousRankingsDoc = await db.collection("rankings").doc(`${type}_previous`).get();
    const previousRankings = previousRankingsDoc.exists ? previousRankingsDoc.data().rankings : [];
    const previousRank = previousRankings.findIndex(r => r.userId === userId) + 1;
    const rankDelta = previousRank > 0 ? previousRank - userRanking.rank : 0;
    
    return {
      ...userRanking,
      rankDelta: rankDelta,
      rankChange: rankDelta > 0 ? 'up' : rankDelta < 0 ? 'down' : 'stable',
      totalUsers: rankings.length
    };
  } catch (error) {
    logger.error(`Error fetching ranking details for user ${userId}:`, error);
    return null;
  }
}

/**
 * Get ranking statistics
 * @returns {Promise<Object>} Ranking statistics
 */
async function getRankingStatistics() {
  try {
    const stats = {};
    
    // Get tier distribution
    const tierStatsDoc = await db.collection("statistics").doc("tierDistribution").get();
    if (tierStatsDoc.exists) {
      stats.tierDistribution = tierStatsDoc.data();
    }
    
    // Get overall ranking stats
    const overallRankingsDoc = await db.collection("rankings").doc("overall").get();
    if (overallRankingsDoc.exists) {
      const overallData = overallRankingsDoc.data();
      stats.overall = {
        totalUsers: overallData.totalUsers,
        lastUpdated: overallData.lastUpdated
      };
    }
    
    // Get weekly ranking stats
    const weeklyRankingsDoc = await db.collection("rankings").doc("weekly").get();
    if (weeklyRankingsDoc.exists) {
      const weeklyData = weeklyRankingsDoc.data();
      stats.weekly = {
        totalUsers: weeklyData.totalUsers,
        lastUpdated: weeklyData.lastUpdated,
        period: weeklyData.period
      };
    }
    
    // Get monthly ranking stats
    const monthlyRankingsDoc = await db.collection("rankings").doc("monthly").get();
    if (monthlyRankingsDoc.exists) {
      const monthlyData = monthlyRankingsDoc.data();
      stats.monthly = {
        totalUsers: monthlyData.totalUsers,
        lastUpdated: monthlyData.lastUpdated,
        period: monthlyData.period
      };
    }
    
    return stats;
  } catch (error) {
    logger.error("Error fetching ranking statistics:", error);
    return {};
  }
}

/**
 * Get week start date
 * @param {Date} date - Date to get week start for
 * @returns {Date} Week start date
 */
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get week end date
 * @param {Date} date - Date to get week end for
 * @returns {Date} Week end date
 */
function getWeekEnd(date) {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return weekEnd;
}

/**
 * Get month start date
 * @param {Date} date - Date to get month start for
 * @returns {Date} Month start date
 */
function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Get month end date
 * @param {Date} date - Date to get month end for
 * @returns {Date} Month end date
 */
function getMonthEnd(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Calculate percentile rank
 * @param {number} rank - User's rank
 * @param {number} totalUsers - Total number of users
 * @returns {number} Percentile (0-100)
 */
function calculatePercentile(rank, totalUsers) {
  if (totalUsers === 0) return 0;
  return Math.round(((totalUsers - rank + 1) / totalUsers) * 100);
}

/**
 * Get top performers by category
 * @param {string} category - Category to rank by (strength, stamina, consistency, improvement)
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} Top performers in category
 */
async function getTopPerformersByCategory(category, limit = 10) {
  try {
    const userScoresSnapshot = await db.collection("userScores").get();
    const userScores = [];
    
    userScoresSnapshot.forEach(doc => {
      const data = doc.data();
      userScores.push({
        userId: data.userId,
        score: data[`${category}Score`] || 0,
        totalScore: data.score || 0
      });
    });
    
    // Sort by category score
    userScores.sort((a, b) => b.score - a.score);
    
    // Take top performers
    const topPerformers = userScores.slice(0, limit);
    
    // Enrich with user data
    return await enrichRankingsWithUserData(topPerformers);
  } catch (error) {
    logger.error(`Error fetching top performers for category ${category}:`, error);
    return [];
  }
}

module.exports = {
  updateRankings,
  getLeaderboard,
  getUserRankingDetails,
  getRankingStatistics,
  getTopPerformersByCategory,
  calculatePercentile
};
