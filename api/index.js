// Vercel Serverless Function - Express API Handler
// This file wraps the Express server for Vercel deployment

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Initialize Express app
const app = express();

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;
    
    if (!serviceAccount) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is required');
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || "https://biolift-c37b6-default-rtdb.firebaseio.com"
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error.message);
    throw error;
  }
}

// Import ranking engine and middleware (after Firebase is initialized)
const rankingEngine = require('../server/rankingEngine');
const authMiddleware = require('../server/middleware/auth');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'BioLift Ranking Server',
    endpoints: {
      health: '/health',
      leaderboard: '/api/leaderboard',
      myRanking: '/api/my-ranking',
      userRanking: '/api/user-ranking/:userId',
      stats: '/api/ranking-stats'
    },
    timestamp: new Date().toISOString() 
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== RANKING API ENDPOINTS =====

/**
 * GET /api/leaderboard
 * Get leaderboard data (overall, weekly, monthly)
 * Query params: type (overall|weekly|monthly), limit, offset
 */
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { type = 'overall', limit = 50, offset = 0 } = req.query;
    
    let leaderboard = await rankingEngine.getLeaderboard(
      type, 
      parseInt(limit), 
      parseInt(offset)
    );
    
    // If leaderboard is empty, try to calculate rankings automatically
    if (leaderboard.length === 0 && type === 'overall') {
      console.log('📊 Leaderboard is empty. Calculating initial rankings...');
      try {
        await rankingEngine.recalculateAllRankings();
        // Fetch again after calculation
        leaderboard = await rankingEngine.getLeaderboard(
          type, 
          parseInt(limit), 
          parseInt(offset)
        );
        console.log(`✅ Calculated rankings for ${leaderboard.length} users`);
      } catch (calcError) {
        console.error('Error calculating initial rankings:', calcError);
        // Continue with empty leaderboard
      }
    }
    
    res.json({
      success: true,
      data: leaderboard,
      type: type,
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: leaderboard.length
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard data'
    });
  }
});

/**
 * GET /api/user-ranking/:userId
 * Get detailed ranking information for a specific user
 * Protected: Requires authentication
 */
app.get('/api/user-ranking/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { type = 'overall' } = req.query;
    
    // Security: Users can only view their own ranking unless admin
    if (req.user.uid !== userId && req.user.email !== 'admin@biolift.com') {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: You can only view your own ranking'
      });
    }
    
    const userRanking = await rankingEngine.getUserRankingDetails(userId, type);
    
    if (!userRanking) {
      return res.status(404).json({
        success: false,
        error: 'User ranking not found'
      });
    }
    
    res.json({
      success: true,
      data: userRanking
    });
  } catch (error) {
    console.error('Error fetching user ranking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user ranking'
    });
  }
});

/**
 * GET /api/my-ranking
 * Get current authenticated user's ranking
 * Protected: Requires authentication
 */
app.get('/api/my-ranking', authMiddleware, async (req, res) => {
  try {
    const { type = 'overall' } = req.query;
    const userId = req.user.uid;
    
    const userRanking = await rankingEngine.getUserRankingDetails(userId, type);
    
    if (!userRanking) {
      return res.status(404).json({
        success: false,
        error: 'No ranking data found. Start logging workouts to get ranked!'
      });
    }
    
    res.json({
      success: true,
      data: userRanking
    });
  } catch (error) {
    console.error('Error fetching my ranking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch your ranking'
    });
  }
});

/**
 * POST /api/update-user-metrics
 * Update user metrics and trigger ranking recalculation
 * Protected: Requires authentication
 */
app.post('/api/update-user-metrics', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const metrics = req.body;
    
    // Validate metrics
    const validation = rankingEngine.validateMetrics(metrics);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid metrics data',
        details: validation.errors
      });
    }
    
    // Update user metrics and recalculate ranking
    await rankingEngine.updateUserMetrics(userId, validation.data);
    
    res.json({
      success: true,
      message: 'Metrics updated and ranking recalculated'
    });
  } catch (error) {
    console.error('Error updating user metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update metrics'
    });
  }
});

/**
 * POST /api/recalculate-rankings
 * Force recalculation of all rankings (Admin only)
 * Protected: Requires admin authentication
 */
app.post('/api/recalculate-rankings', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.email !== 'admin@biolift.com') {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Admin access required'
      });
    }
    
    console.log('🔄 Admin triggered ranking recalculation...');
    const rankings = await rankingEngine.recalculateAllRankings();
    
    res.json({
      success: true,
      message: 'All rankings recalculated successfully',
      totalUsers: rankings.length
    });
  } catch (error) {
    console.error('Error recalculating rankings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to recalculate rankings',
      details: error.message
    });
  }
});

/**
 * GET /api/recalculate-rankings
 * Public endpoint to trigger ranking calculation (for initial setup)
 * Note: In production, you might want to protect this or make it admin-only
 */
app.get('/api/recalculate-rankings', async (req, res) => {
  try {
    console.log('🔄 Public ranking recalculation triggered...');
    const rankings = await rankingEngine.recalculateAllRankings();
    
    res.json({
      success: true,
      message: 'Rankings calculated successfully',
      totalUsers: rankings.length,
      note: 'This endpoint is for initial setup. Consider protecting it in production.'
    });
  } catch (error) {
    console.error('Error recalculating rankings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to recalculate rankings',
      details: error.message
    });
  }
});

/**
 * GET /api/ranking-stats
 * Get ranking statistics
 */
app.get('/api/ranking-stats', async (req, res) => {
  try {
    const stats = await rankingEngine.getRankingStatistics();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching ranking stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ranking statistics'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Export as Vercel serverless function
module.exports = app;

