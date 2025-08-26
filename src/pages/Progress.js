import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Target, 
  BarChart3,
  Activity,
  Flame,
  Clock,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { db } from '../firebase';
import { ref, onValue, off } from 'firebase/database';

const Progress = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [goals, setGoals] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    if (!user?.uid) return;

    const userDashRef = ref(db, `users/${user.uid}/dashboard`);
    
    const unsubscribe = onValue(userDashRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStats(Array.isArray(data.stats) ? data.stats : (data.stats ? Object.values(data.stats) : []));
        setGoals(Array.isArray(data.goals) ? data.goals : (data.goals ? Object.values(data.goals) : []));
        setRecentWorkouts(Array.isArray(data.recentWorkouts) ? data.recentWorkouts : (data.recentWorkouts ? Object.values(data.recentWorkouts) : []));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const getProgressData = () => {
    const weekData = {
      workouts: 5,
      calories: 2450,
      minutes: 180,
      heartRate: 142
    };

    const monthData = {
      workouts: 22,
      calories: 10800,
      minutes: 780,
      heartRate: 138
    };

    return timeRange === 'week' ? weekData : monthData;
  };

  const progressData = getProgressData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary">
              Progress & Analytics
            </h1>
            <p className="text-day-text-secondary dark:text-night-text-secondary">
              Track your fitness journey with detailed insights
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={timeRange === 'week' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTimeRange('week')}
          >
            Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            Month
          </Button>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
            {progressData.workouts}
          </div>
          <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
            Workouts This {timeRange === 'week' ? 'Week' : 'Month'}
          </div>
          <div className="mt-2 text-xs text-green-600 dark:text-green-400">
            +2 from last {timeRange === 'week' ? 'week' : 'month'}
          </div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
            {progressData.calories.toLocaleString()}
          </div>
          <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
            Calories Burned
          </div>
          <div className="mt-2 text-xs text-green-600 dark:text-green-400">
            +320 from last {timeRange === 'week' ? 'week' : 'month'}
          </div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
            {progressData.minutes}
          </div>
          <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
            Active Minutes
          </div>
          <div className="mt-2 text-xs text-green-600 dark:text-green-400">
            +45 from last {timeRange === 'week' ? 'week' : 'month'}
          </div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
            {progressData.heartRate}
          </div>
          <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
            Avg Heart Rate
          </div>
          <div className="mt-2 text-xs text-red-600 dark:text-red-400">
            -8 from last {timeRange === 'week' ? 'week' : 'month'}
          </div>
        </Card>
      </motion.div>

      {/* Goals Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Goals Progress
              </h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-day-text-primary dark:text-night-text-primary">
                      {goal.title}
                    </span>
                    <span className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-day-border dark:bg-night-border rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-day-accent-primary to-day-accent-secondary dark:from-night-accent dark:to-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-day-border dark:border-night-border">
              <Button 
                variant="ghost" 
                fullWidth 
                onClick={() => navigate('/goals')}
              >
                View All Goals
              </Button>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Recent Activity
              </h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {recentWorkouts.slice(0, 4).map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-day-hover dark:hover:bg-night-hover transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-day-accent-primary to-day-accent-secondary dark:from-night-accent dark:to-red-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-day-text-primary dark:text-night-text-primary text-sm">
                        {workout.name}
                      </h4>
                      <p className="text-xs text-day-text-secondary dark:text-night-text-secondary">
                        {workout.duration} • {workout.calories} cal
                      </p>
                    </div>
                  </div>
                  <Badge variant="ghost" size="sm" className="capitalize">
                    {workout.type}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-day-border dark:border-night-border">
              <Button 
                variant="ghost" 
                fullWidth 
                onClick={() => navigate('/workouts')}
              >
                View All Workouts
              </Button>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Progress Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Progress Trends
              </h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="h-64 bg-day-hover dark:bg-night-hover rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto text-day-text-secondary dark:text-night-text-secondary mb-4" />
                <h3 className="text-lg font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                  Progress Charts Coming Soon
                </h3>
                <p className="text-day-text-secondary dark:text-night-text-secondary">
                  Advanced analytics and visualizations will be available here
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
};

export default Progress;
