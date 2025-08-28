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

const Leaderboard = () => {
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

  // Fetch leaderboard data
  const fetchLeaderboard = async (type = 'overall', page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the real-time ranking system
      const { getCurrentLeaderboard } = await import('../utils/realTimeRanking');
      const rankings = await getCurrentLeaderboard(type);
      setLeaderboardData(rankings);
      
    } catch (err) {
      setError(err.message);
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
        return { color: 'text-blue-500', bgColor: 'bg-blue-50', icon: TrophySolidIcon };
      case 'Platinum':
        return { color: 'text-gray-600', bgColor: 'bg-gray-50', icon: TrophySolidIcon };
      case 'Gold':
        return { color: 'text-yellow-500', bgColor: 'bg-yellow-50', icon: TrophySolidIcon };
      case 'Silver':
        return { color: 'text-gray-400', bgColor: 'bg-gray-50', icon: TrophyIcon };
      default:
        return { color: 'text-orange-600', bgColor: 'bg-orange-50', icon: TrophyIcon };
    }
  };

  // Get rank change indicator
  const getRankChangeIndicator = (rankChange, rankDelta) => {
    switch (rankChange) {
      case 'up':
        return (
          <div className="flex items-center text-green-600">
                            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">+{rankDelta}</span>
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center text-red-600">
                            <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{rankDelta}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-400">
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
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
            </div>
            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Smart Ranking Leaderboard
            </h1>
            <p className="text-gray-600">
              Real-time rankings based on strength, stamina, consistency, and improvement
            </p>
          </div>
          <button
            onClick={() => fetchLeaderboard(leaderboardType, currentPage)}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
                            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Leaderboard Type Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
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
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
              className="bg-gray-50 rounded-lg p-4 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="rank">Rank</option>
                    <option value="score">Score</option>
                    <option value="displayName">Name</option>
                    <option value="tier">Tier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items Per Page
                  </label>
                  <select
                    value={itemsPerPage}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <FireIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading leaderboard
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">User</div>
            <div className="col-span-2">Tier</div>
            <div className="col-span-2">Score</div>
            <div className="col-span-2">Change</div>
            <div className="col-span-1">Actions</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredData.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'No users in this leaderboard yet.'}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredData.map((user, index) => {
                const tierInfo = getTierInfo(user.tier);
                const TierIcon = tierInfo.icon;
                
                return (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Rank */}
                      <div className="col-span-1">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-900">
                            #{user.rank}
                          </span>
                          {user.rank <= 3 && (
                            <div className="ml-2">
                              {user.rank === 1 && <TrophySolidIcon className="w-5 h-5 text-yellow-500" />}
                              {user.rank === 2 && <TrophySolidIcon className="w-5 h-5 text-gray-400" />}
                              {user.rank === 3 && <TrophySolidIcon className="w-5 h-5 text-orange-600" />}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="col-span-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {user.photoURL ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.photoURL}
                                alt={user.displayName}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.displayName}
                            </div>
                            <div className="text-sm text-gray-500">
                              User ID: {user.userId}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tier */}
                      <div className="col-span-2">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tierInfo.bgColor} ${tierInfo.color}`}>
                          <TierIcon className="w-3 h-3 mr-1" />
                          {user.tier}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="col-span-2">
                        <div className="text-sm font-medium text-gray-900">
                          {user.score?.toFixed(1) || '0.0'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Total Score
                        </div>
                      </div>

                      {/* Rank Change */}
                      <div className="col-span-2">
                        {getRankChangeIndicator(user.rankChange, user.rankDelta)}
                      </div>

                      {/* Actions */}
                      <div className="col-span-1">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
            {filteredData.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={filteredData.length < itemsPerPage}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
