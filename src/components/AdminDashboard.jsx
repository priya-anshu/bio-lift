import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CogIcon, 
  ChartBarIcon, 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  PlayIcon,
  StopIcon,
  AdjustmentsHorizontalIcon,
  DocumentChartBarIcon,
  UsersIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [weights, setWeights] = useState({
    strength: 0.3,
    stamina: 0.25,
    consistency: 0.25,
    improvement: 0.2
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recalculationStatus, setRecalculationStatus] = useState('idle');
  const [systemStats, setSystemStats] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [adminToken, setAdminToken] = useState('');

  // Fetch current weights
  const fetchCurrentWeights = async () => {
    try {
      const response = await fetch(
        'https://us-central1-biolift-c37b6.cloudfunctions.net/getCurrentWeights'
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.weights) {
          setWeights(data.weights);
        }
      }
    } catch (err) {
      console.error('Error fetching current weights:', err);
    }
  };

  // Fetch system statistics
  const fetchSystemStats = async () => {
    try {
      const response = await fetch(
        'https://us-central1-biolift-c37b6.cloudfunctions.net/getRankingStatistics'
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSystemStats(data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching system stats:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCurrentWeights();
    fetchSystemStats();
  }, []);

  // Update weights
  const handleUpdateWeights = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(
        'https://us-central1-biolift-c37b6.cloudfunctions.net/updateRankingWeights',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({ weights })
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess('Ranking weights updated successfully!');
        fetchSystemStats(); // Refresh stats
      } else {
        setError(data.error || 'Failed to update weights');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error updating weights:', err);
    } finally {
      setLoading(false);
    }
  };

  // Recalculate all rankings
  const handleRecalculateRankings = async () => {
    try {
      setRecalculationStatus('running');
      setError(null);
      setSuccess(null);

      const response = await fetch(
        'https://us-central1-biolift-c37b6.cloudfunctions.net/recalculateAllRankings',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(`Successfully recalculated rankings for ${data.processedCount} users!`);
        setRecalculationStatus('completed');
        fetchSystemStats(); // Refresh stats
      } else {
        setError(data.error || 'Failed to recalculate rankings');
        setRecalculationStatus('failed');
      }
    } catch (err) {
      setError('Network error occurred');
      setRecalculationStatus('failed');
      console.error('Error recalculating rankings:', err);
    }
  };

  // Validate weights sum
  const validateWeights = () => {
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    return Math.abs(total - 1) < 0.01;
  };

  // Handle weight change
  const handleWeightChange = (category, value) => {
    const newWeights = { ...weights, [category]: parseFloat(value) || 0 };
    setWeights(newWeights);
  };

  // Reset weights to defaults
  const resetToDefaults = () => {
    setWeights({
      strength: 0.3,
      stamina: 0.25,
      consistency: 0.25,
      improvement: 0.2
    });
  };

  // Get weight validation status
  const getWeightValidationStatus = () => {
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    const isValid = Math.abs(total - 1) < 0.01;
    
    if (isValid) {
      return { valid: true, message: 'Weights are valid', color: 'text-green-600' };
    } else {
      return { 
        valid: false, 
        message: `Weights sum to ${total.toFixed(2)} (should be 1.00)`, 
        color: 'text-red-600' 
      };
    }
  };

  const weightValidation = getWeightValidationStatus();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Smart Ranking Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage ranking algorithms, weights, and system performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </button>
            <button
              onClick={fetchSystemStats}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Refresh Stats
            </button>
          </div>
        </div>

        {/* Admin Authentication */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                Admin Authentication Required
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin token"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <div className="flex">
              <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
          >
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
              <div className="text-sm text-green-800">{success}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weight Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Ranking Weights</h2>
            <button
              onClick={resetToDefaults}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reset to Defaults
            </button>
          </div>

          <div className="space-y-4">
            {[
              { key: 'strength', label: 'Strength', description: 'Weight lifting performance' },
              { key: 'stamina', label: 'Stamina', description: 'Endurance and cardio' },
              { key: 'consistency', label: 'Consistency', description: 'Workout regularity' },
              { key: 'improvement', label: 'Improvement', description: 'Progress over time' }
            ].map((category) => (
              <div key={category.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {category.label}
                    </label>
                    <p className="text-xs text-gray-500">{category.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={weights[category.key]}
                      onChange={(e) => handleWeightChange(category.key, e.target.value)}
                      className="w-24"
                    />
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.05"
                      value={weights[category.key]}
                      onChange={(e) => handleWeightChange(category.key, e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${weights[category.key] * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}

            {/* Weight Validation */}
            <div className={`mt-4 p-3 rounded-lg ${
              weightValidation.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {weightValidation.valid ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-red-400 mr-2" />
                )}
                <span className={`text-sm font-medium ${weightValidation.color}`}>
                  {weightValidation.message}
                </span>
              </div>
            </div>

            <button
              onClick={handleUpdateWeights}
              disabled={loading || !weightValidation.valid || !adminToken}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Weights'}
            </button>
          </div>
        </div>

        {/* System Operations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">System Operations</h2>

          <div className="space-y-6">
            {/* Recalculate Rankings */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Recalculate All Rankings</h3>
                  <p className="text-sm text-gray-600">
                    Force recalculation of all user rankings with current weights
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  recalculationStatus === 'idle' ? 'bg-gray-100 text-gray-600' :
                  recalculationStatus === 'running' ? 'bg-yellow-100 text-yellow-600' :
                  recalculationStatus === 'completed' ? 'bg-green-100 text-green-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {recalculationStatus === 'idle' ? 'Ready' :
                   recalculationStatus === 'running' ? 'Running' :
                   recalculationStatus === 'completed' ? 'Completed' : 'Failed'}
                </div>
              </div>
              
              <button
                onClick={handleRecalculateRankings}
                disabled={recalculationStatus === 'running' || !adminToken}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {recalculationStatus === 'running' ? (
                  <>
                    <StopIcon className="w-4 h-4 mr-2 animate-spin" />
                    Recalculating...
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Start Recalculation
                  </>
                )}
              </button>
            </div>

            {/* Advanced Operations */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <h3 className="text-lg font-medium text-gray-900">Advanced Operations</h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      disabled={!adminToken}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Clear Cache
                    </button>
                    <button
                      disabled={!adminToken}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Backup Rankings
                    </button>
                    <button
                      disabled={!adminToken}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Export Data
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      {systemStats && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">System Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: 'Total Users',
                value: systemStats.overall?.totalUsers || 0,
                icon: UsersIcon,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50'
              },
              {
                label: 'Weekly Active',
                value: systemStats.weekly?.totalUsers || 0,
                icon: ClockIcon,
                color: 'text-green-600',
                bgColor: 'bg-green-50'
              },
              {
                label: 'Monthly Active',
                value: systemStats.monthly?.totalUsers || 0,
                icon: ChartBarIcon,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50'
              },
              {
                label: 'Last Updated',
                value: systemStats.overall?.lastUpdated ? 
                  new Date(systemStats.overall.lastUpdated).toLocaleDateString() : 'N/A',
                icon: DocumentChartBarIcon,
                color: 'text-orange-600',
                bgColor: 'bg-orange-50'
              }
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`${stat.bgColor} rounded-lg p-4`}>
                  <div className="flex items-center">
                    <Icon className={`w-8 h-8 ${stat.color} mr-3`} />
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tier Distribution */}
          {systemStats.tierDistribution && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tier Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(systemStats.tierDistribution.tierStats || {}).map(([tier, count]) => (
                  <div key={tier} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600">{tier}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
