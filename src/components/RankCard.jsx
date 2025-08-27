import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrophyIcon, 
  FireIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  MinusIcon,
  UserIcon,
  ChartBarIcon,
  LightBulbIcon,
  ClockIcon,
  HeartIcon,
  BoltIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { 
  TrophyIcon as TrophySolidIcon,
  FireIcon as FireSolidIcon 
} from '@heroicons/react/24/solid';

const RankCard = ({ userId, showInsights = true }) => {
  const [userRanking, setUserRanking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user ranking data
  const fetchUserRanking = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://us-central1-biolift-c37b6.cloudfunctions.net/getUserRanking?userId=${userId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch user ranking data');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUserRanking(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch user ranking data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user ranking:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user insights
  const fetchUserInsights = async () => {
    if (!showInsights) return;
    
    try {
      const response = await fetch(
        `https://us-central1-biolift-c37b6.cloudfunctions.net/getUserInsights?userId=${userId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setInsights(data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching user insights:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUserRanking();
    fetchUserInsights();
  }, [userId]);

  // Get tier color and icon
  const getTierInfo = (tier) => {
    switch (tier) {
      case 'Diamond':
        return { 
          color: 'text-blue-500', 
          bgColor: 'bg-blue-50', 
          borderColor: 'border-blue-200',
          icon: TrophySolidIcon,
          gradient: 'from-blue-500 to-blue-600'
        };
      case 'Platinum':
        return { 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-50', 
          borderColor: 'border-gray-200',
          icon: TrophySolidIcon,
          gradient: 'from-gray-500 to-gray-600'
        };
      case 'Gold':
        return { 
          color: 'text-yellow-500', 
          bgColor: 'bg-yellow-50', 
          borderColor: 'border-yellow-200',
          icon: TrophySolidIcon,
          gradient: 'from-yellow-500 to-yellow-600'
        };
      case 'Silver':
        return { 
          color: 'text-gray-400', 
          bgColor: 'bg-gray-50', 
          borderColor: 'border-gray-200',
          icon: TrophyIcon,
          gradient: 'from-gray-400 to-gray-500'
        };
      default:
        return { 
          color: 'text-orange-600', 
          bgColor: 'bg-orange-50', 
          borderColor: 'border-orange-200',
          icon: TrophyIcon,
          gradient: 'from-orange-500 to-orange-600'
        };
    }
  };

  // Get rank change indicator
  const getRankChangeIndicator = (rankChange, rankDelta) => {
    switch (rankChange) {
      case 'up':
        return (
          <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">+{rankDelta}</span>
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{rankDelta}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            <MinusIcon className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">No change</span>
          </div>
        );
    }
  };

  // Calculate score percentage
  const getScorePercentage = (score) => {
    return Math.min(100, Math.max(0, score));
  };

  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FireIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading user ranking
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userRanking) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">User Not Found</h3>
        <p className="text-gray-600">No ranking data available for this user.</p>
      </div>
    );
  }

  const tierInfo = getTierInfo(userRanking.tier || 'Bronze');
  const TierIcon = tierInfo.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${tierInfo.gradient} text-white p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <TierIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Rank #{userRanking.currentRank}</h2>
              <p className="text-white text-opacity-90">
                {userRanking.tier || 'Bronze'} Tier
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{userRanking.score?.toFixed(1) || '0.0'}</div>
            <div className="text-white text-opacity-90">Total Score</div>
          </div>
        </div>
        
        {/* Rank Change */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white text-opacity-90">Rank Change:</span>
            {getRankChangeIndicator(userRanking.rankChange, userRanking.rankDelta)}
          </div>
          <div className="text-white text-opacity-90">
            {userRanking.totalUsers && `of ${userRanking.totalUsers} users`}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { key: 'overview', label: 'Overview', icon: ChartBarIcon },
            { key: 'breakdown', label: 'Score Breakdown', icon: BoltIcon },
            { key: 'insights', label: 'Insights', icon: LightBulbIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Score Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { 
                  label: 'Strength', 
                  score: userRanking.strengthScore, 
                  icon: BoltIcon,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-50'
                },
                { 
                  label: 'Stamina', 
                  score: userRanking.staminaScore, 
                  icon: HeartIcon,
                  color: 'text-red-600',
                  bgColor: 'bg-red-50'
                },
                { 
                  label: 'Consistency', 
                  score: userRanking.consistencyScore, 
                  icon: ClockIcon,
                  color: 'text-green-600',
                  bgColor: 'bg-green-50'
                },
                { 
                  label: 'Improvement', 
                  score: userRanking.improvementScore, 
                  icon: ArrowTrendingUpIcon,
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-50'
                }
              ].map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className={`${metric.bgColor} rounded-lg p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${metric.color}`} />
                      <span className={`text-sm font-medium ${metric.color}`}>
                        {metric.score?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {metric.label}
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${metric.color.replace('text-', 'bg-')} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${getScorePercentage(metric.score)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Performance Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Current Rank:</span>
                  <span className="ml-2 font-medium">#{userRanking.currentRank}</span>
                </div>
                {userRanking.previousRank && (
                  <div>
                    <span className="text-gray-600">Previous Rank:</span>
                    <span className="ml-2 font-medium">#{userRanking.previousRank}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Tier:</span>
                  <span className="ml-2 font-medium">{userRanking.tier || 'Bronze'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="ml-2 font-medium">
                    {userRanking.lastUpdated ? new Date(userRanking.lastUpdated).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'breakdown' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Detailed Score Breakdown */}
            <div className="space-y-4">
              {[
                { 
                  label: 'Strength Score', 
                  score: userRanking.strengthScore, 
                  description: 'Based on max weight lifted, one-rep max, and total volume',
                  icon: BoltIcon
                },
                { 
                  label: 'Stamina Score', 
                  score: userRanking.staminaScore, 
                  description: 'Based on workout duration, cardio, and heart rate data',
                  icon: HeartIcon
                },
                { 
                  label: 'Consistency Score', 
                  score: userRanking.consistencyScore, 
                  description: 'Based on workout streak, frequency, and attendance',
                  icon: ClockIcon
                },
                { 
                  label: 'Improvement Score', 
                  score: userRanking.improvementScore, 
                  description: 'Based on progress over time and rate of improvement',
                  icon: ArrowTrendingUpIcon
                }
              ].map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{metric.label}</span>
                      </div>
                      <span className={`text-lg font-bold ${getScoreColor(metric.score)}`}>
                        {metric.score?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{metric.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${getScoreColor(metric.score).replace('text-', 'bg-')} h-3 rounded-full transition-all duration-300`}
                        style={{ width: `${getScorePercentage(metric.score)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {insights ? (
              <>
                {/* Insights */}
                {insights.insights && insights.insights.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-blue-900 mb-3 flex items-center">
                      <LightBulbIcon className="w-5 h-5 mr-2" />
                      Performance Insights
                    </h3>
                    <ul className="space-y-2">
                      {insights.insights.map((insight, index) => (
                        <li key={index} className="text-sm text-blue-800 flex items-start">
                          <StarIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {insights.recommendations && insights.recommendations.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-green-900 mb-3 flex items-center">
                      <ArrowTrendingUpIcon className="w-5 h-5 mr-2" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {insights.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm text-green-800 flex items-start">
                          <FireIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <LightBulbIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
                <p className="text-gray-600">
                  Insights will be generated as you continue to use the platform.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RankCard;
