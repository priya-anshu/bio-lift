import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award,
  Play,
  Plus,
  ArrowRight,
  Flame,
  Heart,
  Zap,
  Clock
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { db } from '../firebase';
import { ref, get, set, onValue, off } from 'firebase/database';




const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [dbError, setDbError] = useState('');

  const ICON_MAP = {
    Flame,
    Zap,
    Clock,
    Heart,
    Play,
    Target,
    TrendingUp
  };

  useEffect(() => {
    if (!user?.uid) return;

    const userDashRef = ref(db, `users/${user.uid}/dashboard`);
    const statsRef = ref(db, `users/${user.uid}/dashboard/stats`);
    const goalsRef = ref(db, `users/${user.uid}/dashboard/goals`);
    const workoutsRef = ref(db, `users/${user.uid}/dashboard/recentWorkouts`);

    let didCancel = false;

    const seedDefaultsIfMissing = async () => {
      try {
        const snapshot = await get(userDashRef);
        if (!snapshot.exists()) {
          const defaults = {
          stats: [
            { title: 'Workouts This Week', value: '5', change: '+2', changeType: 'positive', icon: 'Flame', color: 'text-orange-500' },
            { title: 'Calories Burned', value: '2,450', change: '+320', changeType: 'positive', icon: 'Zap', color: 'text-yellow-500' },
            { title: 'Active Minutes', value: '180', change: '+45', changeType: 'positive', icon: 'Clock', color: 'text-blue-500' },
            { title: 'Heart Rate Avg', value: '142', change: '-8', changeType: 'negative', icon: 'Heart', color: 'text-red-500' }
          ],
          goals: [
            { id: 1, title: 'Weekly Workouts', current: 5, target: 7, unit: 'workouts', progress: 71 },
            { id: 2, title: 'Monthly Calories', current: 8500, target: 12000, unit: 'calories', progress: 71 },
            { id: 3, title: 'Weight Goal', current: 75, target: 70, unit: 'kg', progress: 50 }
          ],
          recentWorkouts: [
            { id: 1, name: 'Upper Body Strength', duration: '45 min', calories: '320', date: '2 hours ago', type: 'Strength' },
            { id: 2, name: 'Cardio HIIT', duration: '30 min', calories: '280', date: 'Yesterday', type: 'Cardio' },
            { id: 3, name: 'Yoga Flow', duration: '60 min', calories: '180', date: '2 days ago', type: 'Flexibility' }
          ]
          };
          await set(userDashRef, defaults);
        }
      } catch (e) {
        setDbError('Failed to read/write dashboard data. Check database rules and authentication.');
        // surface in console for debugging
        // eslint-disable-next-line no-console
        console.error('Dashboard DB access error at path:', `users/${user.uid}/dashboard`, e);
        setLoading(false);
      }
    };

    (async () => {
      try {
        await seedDefaultsIfMissing();
      } catch {}

      const handleError = (err) => {
        setDbError(err?.message || 'Database error');
        // eslint-disable-next-line no-console
        console.error('onValue error:', err);
        setLoading(false);
      };

      const unsubStats = onValue(statsRef, (snap) => {
        if (didCancel) return;
        const val = snap.val();
        // eslint-disable-next-line no-console
        console.log('stats value:', val);
        setStats(Array.isArray(val) ? val : (val ? Object.values(val) : []));
      }, handleError);
      const unsubGoals = onValue(goalsRef, (snap) => {
        if (didCancel) return;
        const val = snap.val();
        // eslint-disable-next-line no-console
        console.log('goals value:', val);
        setGoals(Array.isArray(val) ? val : (val ? Object.values(val) : []));
      }, handleError);
      const unsubWorkouts = onValue(workoutsRef, (snap) => {
        if (didCancel) return;
        const val = snap.val();
        // eslint-disable-next-line no-console
        console.log('recentWorkouts value:', val);
        setRecentWorkouts(Array.isArray(val) ? val : (val ? Object.values(val) : []));
      }, handleError);

      setLoading(false);

      return () => {
        didCancel = true;
        off(statsRef);
        off(goalsRef);
        off(workoutsRef);
        if (typeof unsubStats === 'function') unsubStats();
        if (typeof unsubGoals === 'function') unsubGoals();
        if (typeof unsubWorkouts === 'function') unsubWorkouts();
      };
    })();

    return () => {
      didCancel = true;
      off(statsRef);
      off(goalsRef);
      off(workoutsRef);
    };
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-4 w-24 mb-2"></div>
              <div className="skeleton h-8 w-16 mb-2"></div>
              <div className="skeleton h-3 w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-day-text-secondary dark:text-night-text-secondary">
          Ready to crush your fitness goals today?
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = ICON_MAP[stat.icon] || Flame;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color.replace('text-', '')}/10`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <Badge 
                  variant={stat.changeType === 'positive' ? 'success' : 'danger'}
                  size="sm"
                >
                  {stat.change}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                {stat.title}
              </p>
            </Card>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Start Workout */}
        <Card className="p-6 bg-gradient-to-br from-day-accent-primary to-day-accent-secondary dark:to-night-border dark:from-red-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-white/20">
              <Play className="w-5 h-5" />
            </div>
            <Badge variant="outline" 
            size="sm" className="border-white dark:border-white text-white  dark:text-night-text-primary">
              Quick Start
            </Badge>
          </div>
          <h3 className="text-xl font-bold mb-2">Start Workout</h3>
          <p className="text-white/80 mb-4">
            Begin your next training session with AI-powered guidance
          </p>
          <Button 
            variant="outline"  
            size="sm" 
            className="border-white dark:border-white text-white  hover:text-day-accent-primary  dark:text-night-text-primary"
            onClick={() => navigate('/workout-selection')}
          >
            Start Now
          </Button>
        </Card>

        {/* Create Plan */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-day-accent-secondary/10">
              <Plus className="w-5 h-5 text-day-accent-secondary" />
            </div>
            <Badge variant="secondary" size="sm">
              New
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-2">
            Create Plan
          </h3>
          <p className="text-day-text-secondary dark:text-night-text-secondary mb-4">
            Generate a personalized workout plan based on your goals
          </p>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/create-plan')}
          >
            Create Plan
          </Button>
        </Card>

        {/* View Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-day-accent-primary/10">
              <TrendingUp className="w-5 h-5 text-day-accent-primary" />
            </div>
            <Badge variant="primary" size="sm">
              Trending
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-2">
            View Progress
          </h3>
          <p className="text-day-text-secondary dark:text-night-text-secondary mb-4">
            Track your fitness journey with detailed analytics
          </p>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => navigate('/progress')}
          >
            View Progress
          </Button>
        </Card>
      </motion.div>

      {/* Goals and Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Goals Progress */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Your Goals
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/goals')}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {goals.map((goal) => (
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
          </Card.Body>
        </Card>

        {/* Recent Workouts */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Recent Workouts
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/workouts')}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-day-hover dark:hover:bg-night-hover transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-day-accent-primary to-day-accent-secondary dark:from-night-accent dark:to-red-600 rounded-lg flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-day-text-primary dark:text-night-text-primary">
                        {workout.name}
                      </h3>
                      <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                        {workout.duration} • {workout.calories} cal
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="ghost" size="sm">
                      {workout.type}
                    </Badge>
                    <p className="text-xs text-day-text-secondary dark:text-night-text-secondary mt-1">
                      {workout.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Achievement Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Recent Achievements
              </h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-day-text-primary dark:text-night-text-primary">
                  Streak Master
                </h3>
                <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                  7 day workout streak
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-day-text-primary dark:text-night-text-primary">
                  Goal Crusher
                </h3>
                <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                  Hit 3 monthly goals
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-day-text-primary dark:text-night-text-primary">
                  Energy Boost
                </h3>
                <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                  Burned 2000+ calories
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard; 