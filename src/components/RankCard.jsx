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
import { useTheme } from '../context/ThemeContext';

const RankCard = ({ userId, showInsights = true }) => {
  const { isDarkMode } = useTheme();
  const [userRanking, setUserRanking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user ranking data from Node.js API
  const fetchUserRanking = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get Firebase auth token
      const { auth } = await import('../firebase');
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User must be authenticated');
      }
      
      const token = await currentUser.getIdToken();
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      
      const response = await fetch(
        `${API_BASE_URL}/user-ranking/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user ranking data');
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

  // Fetch user insights (generated from ranking data)
  const fetchUserInsights = async () => {
    if (!showInsights || !userRanking) return;
    
    try {
      // Generate insights from ranking data
      const generatedInsights = {
        insights: [],
        recommendations: []
      };
      
      // Strength insights
      if (userRanking.strengthScore < 20) {
        generatedInsights.insights.push('Your strength score is below average. Focus on progressive overload.');
        generatedInsights.recommendations.push('Increase your training volume gradually each week.');
      } else if (userRanking.strengthScore > 60) {
        generatedInsights.insights.push('Excellent strength performance! You\'re in the top tier.');
      }
      
      // Consistency insights
      if (userRanking.consistencyScore < 30) {
        generatedInsights.insights.push('Consistency is key. Try to maintain a regular workout schedule.');
        generatedInsights.recommendations.push('Aim for at least 3-4 workouts per week.');
      }
      
      // Improvement insights
      if (userRanking.improvementScore > 50) {
        generatedInsights.insights.push('Great progress! You\'re improving steadily.');
      }
      
      // Tier-based recommendations
      if (userRanking.tier === 'Bronze') {
        generatedInsights.recommendations.push('Focus on building a consistent workout routine.');
      } else if (userRanking.tier === 'Silver') {
        generatedInsights.recommendations.push('You\'re making good progress. Keep pushing!');
      } else if (userRanking.tier === 'Gold' || userRanking.tier === 'Platinum') {
        generatedInsights.recommendations.push('You\'re in the top tier! Maintain your performance.');
      }
      
      setInsights(generatedInsights);
    } catch (err) {
      console.error('Error generating user insights:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUserRanking();
  }, [userId]);
  
  // Fetch insights after ranking data is loaded
  useEffect(() => {
    if (userRanking) {
      fetchUserInsights();
    }
  }, [userRanking, showInsights]);

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
          color: 'text-gray-600 dark:text-gray-300', 
          bgColor: 'bg-gray-50 dark:bg-gray-800/50', 
          borderColor: 'border-gray-200 dark:border-gray-700',
          icon: TrophySolidIcon,
          gradient: 'from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700'
        };
      case 'Gold':
        return { 
          color: 'text-yellow-500 dark:text-yellow-400', 
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/30', 
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          icon: TrophySolidIcon,
          gradient: 'from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700'
        };
      case 'Silver':
        return { 
          color: 'text-gray-400 dark:text-gray-500', 
          bgColor: 'bg-gray-50 dark:bg-gray-800/50', 
          borderColor: 'border-gray-200 dark:border-gray-700',
          icon: TrophyIcon,
          gradient: 'from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600'
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
          <div className="flex items-center text-day-text-secondary dark:text-night-text-secondary bg-day-card dark:bg-night-card px-2 py-1 rounded-full">
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
    <div className="bg-day-card dark:bg-night-card rounded-lg shadow-sm border border-day-border dark:border-night-border p-6">
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
      <div className="bg-day-card dark:bg-night-card border border-day-border dark:border-night-border rounded-lg p-6 text-center">
        <UserIcon className="mx-auto h-12 w-12 text-day-text-secondary dark:text-night-text-secondary mb-4" />
        <h3 className="text-lg font-medium text-day-text-primary dark:text-night-text-primary mb-2">User Not Found</h3>
        <p className="text-day-text-secondary dark:text-night-text-secondary">No ranking data available for this user.</p>
      </div>
    );
  }

  const tierInfo = getTierInfo(userRanking.tier || 'Bronze');
  const TierIcon = tierInfo.icon;

  return (
    <div className="bg-day-card dark:bg-night-card rounded-lg shadow-sm border border-day-border dark:border-night-border overflow-hidden">
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
      <div className="border-b border-day-border dark:border-night-border">
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
                    ? 'border-day-accent-primary dark:border-night-accent text-day-accent-primary dark:text-night-accent'
                    : 'border-transparent text-day-text-secondary dark:text-night-text-secondary hover:text-day-text-primary dark:hover:text-night-text-primary hover:border-day-border dark:hover:border-night-border'
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
                    <div className="text-sm font-medium text-day-text-primary dark:text-night-text-primary">
                      {metric.label}
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
            <div className="bg-day-hover dark:bg-night-hover rounded-lg p-4">
              <h3 className="text-lg font-medium text-day-text-primary dark:text-night-text-primary mb-3">Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-day-text-secondary dark:text-night-text-secondary">Current Rank:</span>
                  <span className="ml-2 font-medium text-day-text-primary dark:text-night-text-primary">#{userRanking.currentRank}</span>
                </div>
                {userRanking.previousRank && (
                  <div>
                    <span className="text-day-text-secondary dark:text-night-text-secondary">Previous Rank:</span>
                    <span className="ml-2 font-medium text-day-text-primary dark:text-night-text-primary">#{userRanking.previousRank}</span>
                  </div>
                )}
                <div>
                  <span className="text-day-text-secondary dark:text-night-text-secondary">Tier:</span>
                  <span className="ml-2 font-medium text-day-text-primary dark:text-night-text-primary">{userRanking.tier || 'Bronze'}</span>
                </div>
                <div>
                  <span className="text-day-text-secondary dark:text-night-text-secondary">Last Updated:</span>
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
                  <div key={metric.label} className="border border-day-border dark:border-night-border rounded-lg p-4 bg-day-card dark:bg-night-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-5 h-5 text-day-text-secondary dark:text-night-text-secondary" />
                        <span className="font-medium text-day-text-primary dark:text-night-text-primary">{metric.label}</span>
                      </div>
                      <span className={`text-lg font-bold ${getScoreColor(metric.score)}`}>
                        {metric.score?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    <p className="text-sm text-day-text-secondary dark:text-night-text-secondary mb-3">{metric.description}</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
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
                <LightBulbIcon className="mx-auto h-12 w-12 text-day-text-secondary dark:text-night-text-secondary mb-4" />
                <h3 className="text-lg font-medium text-day-text-primary dark:text-night-text-primary mb-2">No Insights Available</h3>
                <p className="text-day-text-secondary dark:text-night-text-secondary">
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
