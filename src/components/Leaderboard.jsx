import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrophyIcon, 
  FireIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  MinusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { 
  TrophyIcon as TrophySolidIcon,
  FireIcon as FireSolidIcon 
} from '@heroicons/react/24/solid';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const Leaderboard = () => {
  const { isDarkMode } = useTheme();
  const { user: currentUser } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardType, setLeaderboardType] = useState('overall');
  const [sortBy, setSortBy] = useState('rank');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch leaderboard data from Node.js API
  const fetchLeaderboard = async (type = 'overall', page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const limit = itemsPerPage;
      const offset = (page - 1) * itemsPerPage;
      
      // Use the real-time ranking system (now calls Node.js API)
      const { getCurrentLeaderboard } = await import('../utils/realTimeRanking');
      const rankings = await getCurrentLeaderboard(type, limit, offset);
      
      if (rankings.length === 0) {
        // Show helpful message
        setError(
          'No leaderboard data available yet. ' +
          'Rankings will appear once users log progress in the Track Progress page. ' +
          'The system is calculating rankings automatically...'
        );
        setLeaderboardData([]);
      } else {
        setError(null);
        setLeaderboardData(rankings);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard. Please ensure the ranking server is running.');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch and real-time subscription
  useEffect(() => {
    fetchLeaderboard(leaderboardType, currentPage);
    
    // Subscribe to real-time updates
    const setupRealTimeSubscription = async () => {
      const { subscribeToLeaderboard } = await import('../utils/realTimeRanking');
      const unsubscribe = subscribeToLeaderboard(leaderboardType, (rankings) => {
        setLeaderboardData(rankings);
        setLoading(false);
      });
      
      return unsubscribe;
    };
    
    let unsubscribe;
    setupRealTimeSubscription().then(unsub => {
      unsubscribe = unsub;
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [leaderboardType, currentPage]);

  // Handle leaderboard type change
  const handleTypeChange = (type) => {
    setLeaderboardType(type);
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Sort data
  const sortedData = [...leaderboardData].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle special cases
    if (sortBy === 'rank') {
      aValue = parseInt(a.rank);
      bValue = parseInt(b.rank);
    } else if (sortBy === 'score') {
      aValue = parseFloat(a.score);
      bValue = parseFloat(b.score);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Filter data by search term
  const filteredData = sortedData.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get tier color and icon
  const getTierInfo = (tier) => {
    switch (tier) {
      case 'Diamond':
        return { 
          color: 'text-blue-500 dark:text-blue-400', 
          bgColor: 'bg-blue-50 dark:bg-blue-900/30', 
          icon: TrophySolidIcon 
        };
      case 'Platinum':
        return { 
          color: 'text-gray-600 dark:text-gray-300', 
          bgColor: 'bg-gray-50 dark:bg-gray-800/50', 
          icon: TrophySolidIcon 
        };
      case 'Gold':
        return { 
          color: 'text-yellow-500 dark:text-yellow-400', 
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/30', 
          icon: TrophySolidIcon 
        };
      case 'Silver':
        return { 
          color: 'text-gray-400 dark:text-gray-500', 
          bgColor: 'bg-gray-50 dark:bg-gray-800/50', 
          icon: TrophyIcon 
        };
      default:
        return { 
          color: 'text-orange-600 dark:text-orange-400', 
          bgColor: 'bg-orange-50 dark:bg-orange-900/30', 
          icon: TrophyIcon 
        };
    }
  };

  // Get rank change indicator
  const getRankChangeIndicator = (rankChange, rankDelta) => {
    switch (rankChange) {
      case 'up':
        return (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">+{rankDelta}</span>
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center text-red-600 dark:text-red-400">
            <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{rankDelta}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-400 dark:text-gray-500">
            <MinusIcon className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">-</span>
          </div>
        );
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(10)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-day-card dark:bg-night-card rounded-lg shadow-sm border border-day-border dark:border-night-border p-4"
        >
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/2"></div>
            </div>
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen bg-day-bg dark:bg-night-bg transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary mb-2">
              Smart Ranking Leaderboard
            </h1>
            <p className="text-day-text-secondary dark:text-night-text-secondary">
              Real-time rankings based on strength, stamina, consistency, and improvement
            </p>
          </div>
          <button
            onClick={() => fetchLeaderboard(leaderboardType, currentPage)}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-day-accent-primary dark:bg-night-accent text-white rounded-lg hover:bg-blue-700 dark:hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Leaderboard Type Tabs */}
        <div className="flex space-x-1 bg-day-card dark:bg-night-card rounded-lg p-1 mb-6 border border-day-border dark:border-night-border">
          {[
            { key: 'overall', label: 'Overall', icon: TrophyIcon },
            { key: 'weekly', label: 'Weekly', icon: FireIcon },
            { key: 'monthly', label: 'Monthly', icon: ArrowTrendingUpIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => handleTypeChange(tab.key)}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                  leaderboardType === tab.key
                    ? 'bg-day-accent-primary dark:bg-night-accent text-white shadow-sm'
                    : 'text-day-text-secondary dark:text-night-text-secondary hover:text-day-text-primary dark:hover:text-night-text-primary hover:bg-day-hover dark:hover:bg-night-hover'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-day-card dark:bg-night-card border border-day-border dark:border-night-border rounded-lg text-day-text-primary dark:text-night-text-primary placeholder-day-text-secondary dark:placeholder-night-text-secondary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-day-card dark:bg-night-card border border-day-border dark:border-night-border rounded-lg text-day-text-primary dark:text-night-text-primary hover:bg-day-hover dark:hover:bg-night-hover transition-colors"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-day-card dark:bg-night-card rounded-lg p-4 mb-6 border border-day-border dark:border-night-border"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="w-full px-3 py-2 bg-day-card dark:bg-night-card border border-day-border dark:border-night-border rounded-md text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent transition-colors"
                  >
                    <option value="rank">Rank</option>
                    <option value="score">Score</option>
                    <option value="displayName">Name</option>
                    <option value="tier">Tier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                    Sort Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 bg-day-card dark:bg-night-card border border-day-border dark:border-night-border rounded-md text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent transition-colors"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                    Items Per Page
                  </label>
                  <select
                    value={itemsPerPage}
                    className="w-full px-3 py-2 bg-day-card dark:bg-night-card border border-day-border dark:border-night-border rounded-md text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent transition-colors opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <FireIcon className="h-5 w-5 text-red-400 dark:text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                Error loading leaderboard
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard Content */}
      <div className="bg-day-card dark:bg-night-card rounded-lg shadow-sm border border-day-border dark:border-night-border overflow-hidden">
        {/* Table Header */}
        <div className="bg-day-hover dark:bg-night-hover px-6 py-3 border-b border-day-border dark:border-night-border">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-day-text-primary dark:text-night-text-primary">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">User</div>
            <div className="col-span-2">Tier</div>
            <div className="col-span-2">Score</div>
            <div className="col-span-2">Change</div>
            <div className="col-span-1">Actions</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-day-border dark:divide-night-border">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredData.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <TrophyIcon className="mx-auto h-12 w-12 text-day-text-secondary dark:text-night-text-secondary" />
              <h3 className="mt-2 text-sm font-medium text-day-text-primary dark:text-night-text-primary">No users found</h3>
              <p className="mt-1 text-sm text-day-text-secondary dark:text-night-text-secondary">
                {searchTerm ? 'Try adjusting your search terms.' : 'No users in this leaderboard yet.'}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredData.map((user, index) => {
                const tierInfo = getTierInfo(user.tier);
                const TierIcon = tierInfo.icon;
                const isCurrentUser = currentUser && user.userId === currentUser.uid;
                const isTopRanker = user.rank === 1;
                const isTopThree = user.rank <= 3;
                
                // Different styles for top 3
                const getTopThreeStyle = () => {
                  if (user.rank === 1) {
                    return {
                      bg: 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20',
                      border: 'border-yellow-300 dark:border-yellow-700',
                      glow: 'shadow-lg shadow-yellow-500/20 dark:shadow-yellow-500/10',
                      text: 'text-yellow-900 dark:text-yellow-100'
                    };
                  } else if (user.rank === 2) {
                    return {
                      bg: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/30',
                      border: 'border-gray-300 dark:border-gray-600',
                      glow: 'shadow-md shadow-gray-400/20 dark:shadow-gray-600/10',
                      text: 'text-gray-900 dark:text-gray-100'
                    };
                  } else if (user.rank === 3) {
                    return {
                      bg: 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20',
                      border: 'border-orange-300 dark:border-orange-700',
                      glow: 'shadow-md shadow-orange-500/20 dark:shadow-orange-500/10',
                      text: 'text-orange-900 dark:text-orange-100'
                    };
                  }
                  return {
                    bg: '',
                    border: '',
                    glow: '',
                    text: ''
                  };
                };
                
                const topThreeStyle = getTopThreeStyle();
                const isHighlighted = isCurrentUser || isTopRanker;
                
                return (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: isTopThree ? 1 : 1
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      delay: index * 0.05,
                      type: isTopThree ? "spring" : "tween",
                      stiffness: isTopThree ? 100 : 50
                    }}
                    whileHover={isTopThree ? { scale: 1.02 } : { scale: 1.01 }}
                    className={`
                      px-6 py-4 transition-all duration-300 relative overflow-hidden
                      ${isTopThree ? `${topThreeStyle.bg} ${topThreeStyle.border} border-l-4 ${topThreeStyle.glow}` : ''}
                      ${isCurrentUser && !isTopThree ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400' : ''}
                      ${!isCurrentUser && !isTopThree ? 'hover:bg-day-hover dark:hover:bg-night-hover' : ''}
                      ${isCurrentUser && !isTopThree ? 'ring-2 ring-blue-500/50 dark:ring-blue-400/50' : ''}
                    `}
                  >
                    {/* Shiny shimmer effect for top ranker */}
                    {isTopRanker && (
                      <>
                        {/* Shimmer overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(250, 204, 21, 0.4), transparent)',
                          }}
                          animate={{
                            x: ['-100%', '200%'],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: 'linear',
                          }}
                        />
                        
                        {/* Glowing border effect */}
                        <motion.div
                          className="absolute inset-0 border-2 border-yellow-400/50 rounded-lg"
                          animate={{
                            boxShadow: [
                              '0 0 10px rgba(250, 204, 21, 0.3)',
                              '0 0 20px rgba(250, 204, 21, 0.5)',
                              '0 0 10px rgba(250, 204, 21, 0.3)',
                            ],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: 'easeInOut',
                          }}
                        />
                      </>
                    )}
                    
                    {/* Current user indicator */}
                    {isCurrentUser && (
                      <div className="absolute top-2 right-2">
                        <motion.div
                          className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Rank */}
                      <div className="col-span-1">
                        <div className="flex items-center">
                          <motion.span 
                            className={`text-lg font-bold ${
                              user.rank === 1 ? 'text-yellow-600 dark:text-yellow-400' :
                              user.rank === 2 ? 'text-gray-600 dark:text-gray-300' :
                              user.rank === 3 ? 'text-orange-600 dark:text-orange-400' :
                              'text-day-text-primary dark:text-night-text-primary'
                            }`}
                            animate={isTopThree ? { 
                              scale: [1, 1.1, 1],
                            } : {}}
                            transition={isTopThree ? { 
                              repeat: Infinity, 
                              duration: 2,
                              delay: index * 0.2
                            } : {}}
                          >
                            #{user.rank}
                          </motion.span>
                          {user.rank <= 3 && (
                            <motion.div 
                              className="ml-2"
                              animate={isTopRanker ? {
                                rotate: [0, -10, 10, -10, 0],
                              } : {}}
                              transition={isTopRanker ? {
                                repeat: Infinity,
                                duration: 3,
                                delay: 0.5
                              } : {}}
                            >
                              {user.rank === 1 && <TrophySolidIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-400 drop-shadow-lg" />}
                              {user.rank === 2 && <TrophySolidIcon className="w-5 h-5 text-gray-400 dark:text-gray-300" />}
                              {user.rank === 3 && <TrophySolidIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="col-span-4">
                        <div className="flex items-center space-x-3">
                          <motion.div 
                            className="flex-shrink-0 relative"
                            animate={isTopRanker ? {
                              scale: [1, 1.1, 1],
                            } : {}}
                            transition={isTopRanker ? {
                              repeat: Infinity,
                              duration: 2
                            } : {}}
                          >
                            {user.photoURL ? (
                              <div className="relative">
                                <motion.img
                                  className={`rounded-full ${
                                    isTopRanker ? 'h-12 w-12 ring-4 ring-yellow-400 dark:ring-yellow-500 shadow-lg shadow-yellow-500/50' :
                                    isTopThree ? 'h-11 w-11 ring-2 ring-gray-300 dark:ring-gray-600' :
                                    isCurrentUser ? 'h-10 w-10 ring-2 ring-blue-500 dark:ring-blue-400' :
                                    'h-10 w-10'
                                  }`}
                                  src={user.photoURL}
                                  alt={user.displayName}
                                  animate={isTopRanker ? {
                                    filter: [
                                      'brightness(1) drop-shadow(0 0 5px rgba(250, 204, 21, 0.5))',
                                      'brightness(1.2) drop-shadow(0 0 15px rgba(250, 204, 21, 0.8))',
                                      'brightness(1) drop-shadow(0 0 5px rgba(250, 204, 21, 0.5))',
                                    ],
                                  } : {}}
                                  transition={isTopRanker ? {
                                    repeat: Infinity,
                                    duration: 2,
                                  } : {}}
                                />
                                {/* Shiny overlay on avatar */}
                                {isTopRanker && (
                                  <motion.div
                                    className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/50 via-transparent to-transparent pointer-events-none"
                                    animate={{
                                      opacity: [0.3, 0.7, 0.3],
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 2,
                                    }}
                                  />
                                )}
                              </div>
                            ) : (
                              <div className={`rounded-full flex items-center justify-center relative ${
                                isTopRanker ? 'h-12 w-12 ring-4 ring-yellow-400 dark:ring-yellow-500 shadow-lg shadow-yellow-500/50 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600' :
                                isTopThree ? 'h-11 w-11 ring-2 ring-gray-300 dark:ring-gray-600 bg-gray-300 dark:bg-gray-700' :
                                isCurrentUser ? 'h-10 w-10 ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-300 dark:bg-blue-700' :
                                'h-10 w-10 bg-gray-300 dark:bg-gray-700'
                              }`}>
                                <span className={`text-sm font-medium relative z-10 ${
                                  isTopRanker ? 'text-yellow-900 dark:text-yellow-100 drop-shadow-md' :
                                  'text-day-text-primary dark:text-night-text-primary'
                                }`}>
                                  {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                                {/* Shiny overlay on avatar */}
                                {isTopRanker && (
                                  <motion.div
                                    className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/60 via-transparent to-transparent pointer-events-none"
                                    animate={{
                                      opacity: [0.4, 0.8, 0.4],
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 2,
                                    }}
                                  />
                                )}
                              </div>
                            )}
                            {/* Top ranker badge */}
                            {isTopRanker && (
                              <motion.div
                                className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 rounded-full p-1 shadow-lg shadow-yellow-500/50 z-20"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ 
                                  scale: 1, 
                                  rotate: 0,
                                  boxShadow: [
                                    '0 0 5px rgba(250, 204, 21, 0.5)',
                                    '0 0 15px rgba(250, 204, 21, 0.8)',
                                    '0 0 5px rgba(250, 204, 21, 0.5)',
                                  ],
                                }}
                                transition={{ 
                                  scale: { delay: 0.4 },
                                  boxShadow: {
                                    repeat: Infinity,
                                    duration: 2,
                                  }
                                }}
                              >
                                <FireSolidIcon className="w-3 h-3 text-white drop-shadow-md" />
                              </motion.div>
                            )}
                            {/* Current user badge */}
                            {isCurrentUser && !isTopRanker && (
                              <motion.div
                                className="absolute -top-1 -right-1 bg-blue-500 dark:bg-blue-400 rounded-full p-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <span className="text-xs text-white font-bold">YOU</span>
                              </motion.div>
                            )}
                          </motion.div>
                          <div>
                            <motion.div 
                              className={`text-sm font-medium relative ${
                                isTopThree ? topThreeStyle.text :
                                isCurrentUser ? 'text-blue-600 dark:text-blue-400 font-bold' :
                                'text-day-text-primary dark:text-night-text-primary'
                              }`}
                              animate={isTopRanker ? {
                                textShadow: [
                                  '0 0 5px rgba(250, 204, 21, 0.5)',
                                  '0 0 10px rgba(250, 204, 21, 0.8)',
                                  '0 0 5px rgba(250, 204, 21, 0.5)',
                                ],
                              } : {}}
                              transition={isTopRanker ? {
                                repeat: Infinity,
                                duration: 2,
                              } : {}}
                            >
                              {user.displayName}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs bg-blue-500 dark:bg-blue-400 text-white px-2 py-0.5 rounded-full">
                                  YOU
                                </span>
                              )}
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      {/* Tier */}
                      <div className="col-span-2">
                        <motion.div 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tierInfo.bgColor} ${tierInfo.color}`}
                          animate={isTopRanker ? {
                            boxShadow: [
                              '0 0 0 0 rgba(234, 179, 8, 0.4)',
                              '0 0 0 8px rgba(234, 179, 8, 0)',
                            ],
                          } : {}}
                          transition={isTopRanker ? {
                            repeat: Infinity,
                            duration: 2
                          } : {}}
                        >
                          <TierIcon className="w-3 h-3 mr-1" />
                          {user.tier}
                        </motion.div>
                      </div>

                      {/* Score */}
                      <div className="col-span-2">
                        <motion.div 
                          className={`text-sm font-medium relative ${
                            isTopRanker ? 'text-yellow-600 dark:text-yellow-400' :
                            isTopThree ? topThreeStyle.text :
                            'text-day-text-primary dark:text-night-text-primary'
                          }`}
                          animate={isTopRanker ? {
                            scale: [1, 1.05, 1],
                            textShadow: [
                              '0 0 5px rgba(250, 204, 21, 0.5)',
                              '0 0 10px rgba(250, 204, 21, 0.8)',
                              '0 0 5px rgba(250, 204, 21, 0.5)',
                            ],
                          } : {}}
                          transition={isTopRanker ? {
                            repeat: Infinity,
                            duration: 2
                          } : {}}
                        >
                          {user.score?.toFixed(1) || '0.0'}
                        </motion.div>
                        <div className={`text-xs ${
                          isTopThree ? topThreeStyle.text + ' opacity-70' :
                          'text-day-text-secondary dark:text-night-text-secondary'
                        }`}>
                          Total Score
                        </div>
                      </div>

                      {/* Rank Change */}
                      <div className="col-span-2">
                        {getRankChangeIndicator(user.rankChange, user.rankDelta)}
                      </div>

                      {/* Actions */}
                      <div className="col-span-1">
                        <button className="text-day-accent-primary dark:text-night-accent hover:text-blue-800 dark:hover:text-red-500 text-sm font-medium transition-colors">
                          View
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && filteredData.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
            {filteredData.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-day-card dark:bg-night-card border border-day-border dark:border-night-border rounded-md text-sm font-medium text-day-text-primary dark:text-night-text-primary hover:bg-day-hover dark:hover:bg-night-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={filteredData.length < itemsPerPage}
              className="px-3 py-2 bg-day-card dark:bg-night-card border border-day-border dark:border-night-border rounded-md text-sm font-medium text-day-text-primary dark:text-night-text-primary hover:bg-day-hover dark:hover:bg-night-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
