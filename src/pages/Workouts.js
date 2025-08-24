import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Flame, 
  Calendar,
  Filter,
  Search,
  Plus,
  TrendingUp,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { db } from '../firebase';
import { ref, onValue, off } from 'firebase/database';

const Workouts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    if (!user?.uid) return;

    const workoutsRef = ref(db, `users/${user.uid}/dashboard/recentWorkouts`);
    
    const unsubscribe = onValue(workoutsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setWorkouts(Array.isArray(data) ? data : Object.values(data));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const filteredWorkouts = workouts
    .filter(workout => {
      const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || workout.type.toLowerCase() === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'duration':
          return parseInt(b.duration) - parseInt(a.duration);
        case 'calories':
          return parseInt(b.calories) - parseInt(a.calories);
        default:
          return 0;
      }
    });

  const workoutTypes = ['all', 'strength', 'cardio', 'flexibility', 'hiit', 'yoga'];
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'duration', label: 'Duration' },
    { value: 'calories', label: 'Calories' }
  ];

  const getWorkoutStats = () => {
    if (workouts.length === 0) return null;

    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + parseInt(w.calories), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + parseInt(w.duration), 0);
    const avgCalories = Math.round(totalCalories / totalWorkouts);
    const avgDuration = Math.round(totalDuration / totalWorkouts);

    return { totalWorkouts, totalCalories, totalDuration, avgCalories, avgDuration };
  };

  const stats = getWorkoutStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
              Workout History
            </h1>
            <p className="text-day-text-secondary dark:text-night-text-secondary">
              Track your fitness journey and progress
            </p>
          </div>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/workout-selection')}
        >
          <Play className="w-4 h-4 mr-2" />
          Start Workout
        </Button>
      </motion.div>

      {/* Stats Overview */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
              {stats.totalWorkouts}
            </div>
            <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
              Total Workouts
            </div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
              {stats.totalCalories}
            </div>
            <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
              Calories Burned
            </div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
              {stats.totalDuration}
            </div>
            <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
              Total Minutes
            </div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
              {stats.avgCalories}
            </div>
            <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
              Avg Calories/Workout
            </div>
          </Card>
        </motion.div>
      )}

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-day-text-secondary dark:text-night-text-secondary" />
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
          >
            {workoutTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Workouts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        {filteredWorkouts.map((workout) => (
          <Card key={workout.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-day-accent-primary to-day-accent-secondary dark:from-night-accent dark:to-red-600 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary">
                    {workout.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-day-text-secondary dark:text-night-text-secondary">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {workout.duration}
                    </span>
                    <span className="flex items-center">
                      <Flame className="w-4 h-4 mr-1" />
                      {workout.calories} cal
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {workout.date}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant="ghost" size="sm" className="capitalize">
                  {workout.type}
                </Badge>
                                 <Button 
                   variant="ghost" 
                   size="sm"
                   onClick={() => navigate('/workout-selection')}
                 >
                   <Play className="w-4 h-4 mr-1" />
                   Repeat
                 </Button>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {filteredWorkouts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center py-12"
        >
          <Play className="w-16 h-16 mx-auto text-day-text-secondary dark:text-night-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-day-text-primary dark:text-night-text-primary mb-2">
            {searchQuery || filterType !== 'all' ? 'No workouts found' : 'No workouts yet'}
          </h3>
          <p className="text-day-text-secondary dark:text-night-text-secondary mb-4">
            {searchQuery || filterType !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Start your fitness journey with your first workout'
            }
          </p>
                     <Button variant="primary" onClick={() => navigate('/workout-selection')}>
             <Play className="w-4 h-4 mr-2" />
             Start Your First Workout
           </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Workouts;
