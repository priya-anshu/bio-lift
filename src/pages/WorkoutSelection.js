import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Flame, 
  Target,
  Dumbbell,
  Heart,
  Zap,
  Filter,
  Search,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { 
  getWorkoutTemplates, 
  getWorkoutRecommendations,
  generateRandomWorkout 
} from '../utils/workoutUtils';

const WorkoutSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedFocus, setSelectedFocus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [userProfile, setUserProfile] = useState({
    fitnessLevel: 'intermediate',
    goals: ['general-fitness'],
    availableTime: 45,
    equipment: ['dumbbells', 'bodyweight']
  });

  const difficulties = [
    { id: 'all', label: 'All Levels', icon: Target },
    { id: 'beginner', label: 'Beginner', icon: Heart },
    { id: 'intermediate', label: 'Intermediate', icon: TrendingUp },
    { id: 'advanced', label: 'Advanced', icon: Zap }
  ];

  const focusAreas = [
    { id: 'all', label: 'All Focus Areas', icon: Target },
    { id: 'full-body', label: 'Full Body', icon: Activity },
    { id: 'upper-body', label: 'Upper Body', icon: Dumbbell },
    { id: 'lower-body', label: 'Lower Body', icon: Zap },
    { id: 'core', label: 'Core', icon: Target },
    { id: 'cardio', label: 'Cardio', icon: Heart },
    { id: 'strength', label: 'Strength', icon: Dumbbell },
    { id: 'flexibility', label: 'Flexibility', icon: Heart }
  ];

  const allTemplates = getWorkoutTemplates();
  const recommendations = getWorkoutRecommendations(userProfile);

  const filteredTemplates = Object.values(allTemplates).filter(template => {
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    const matchesFocus = selectedFocus === 'all' || template.focus === selectedFocus;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDifficulty && matchesFocus && matchesSearch;
  });

  const handleStartWorkout = (template) => {
    // Navigate to workout page with the selected template
    navigate('/workout', { 
      state: { 
        workoutTemplate: template,
        fromSelection: true 
      } 
    });
  };

  const handleQuickStart = () => {
    const randomWorkout = generateRandomWorkout(userProfile);
    handleStartWorkout(randomWorkout);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getFocusIcon = (focus) => {
    switch (focus) {
      case 'full-body': return Activity;
      case 'upper-body': return Dumbbell;
      case 'lower-body': return Zap;
      case 'core': return Target;
      case 'cardio': return Heart;
      case 'strength': return Dumbbell;
      case 'flexibility': return Heart;
      default: return Target;
    }
  };

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
              Choose Your Workout
            </h1>
            <p className="text-day-text-secondary dark:text-night-text-secondary">
              Select from our curated workout templates or start a quick workout
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => setShowQuickStart(true)}
          >
            <Zap className="w-4 h-4 mr-2" />
            Quick Start
          </Button>
          <Button
            variant="primary"
            onClick={handleQuickStart}
          >
            <Play className="w-4 h-4 mr-2" />
            Random Workout
          </Button>
        </div>
      </motion.div>

      {/* Quick Start Modal */}
      <AnimatePresence>
        {showQuickStart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-day-card dark:bg-night-card rounded-xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
                  Quick Start Workout
                </h2>
                <p className="text-day-text-secondary dark:text-night-text-secondary mb-6">
                  Start a workout based on your preferences and available time
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-2">
                      Available Time
                    </label>
                    <select
                      value={userProfile.availableTime}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, availableTime: parseInt(e.target.value) }))}
                      className="w-full p-3 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-2">
                      Equipment Available
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['bodyweight', 'dumbbells', 'resistance-bands', 'full-gym'].map(equipment => (
                        <label key={equipment} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={userProfile.equipment.includes(equipment)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setUserProfile(prev => ({ 
                                  ...prev, 
                                  equipment: [...prev.equipment, equipment] 
                                }));
                              } else {
                                setUserProfile(prev => ({ 
                                  ...prev, 
                                  equipment: prev.equipment.filter(eq => eq !== equipment) 
                                }));
                              }
                            }}
                            className="rounded border-day-border dark:border-night-border"
                          />
                          <span className="text-sm capitalize">{equipment.replace('-', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button variant="ghost" onClick={() => setShowQuickStart(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleQuickStart} className="flex-1">
                    Start Workout
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-day-text-secondary dark:text-night-text-secondary" />
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2">
          {difficulties.map((difficulty) => {
            const Icon = difficulty.icon;
            return (
              <Button
                key={difficulty.id}
                variant={selectedDifficulty === difficulty.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty.id)}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{difficulty.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Focus Area Filter */}
        <div className="flex flex-wrap gap-2">
          {focusAreas.map((focus) => {
            const Icon = focus.icon;
            return (
              <Button
                key={focus.id}
                variant={selectedFocus === focus.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedFocus(focus.id)}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{focus.label}</span>
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
            <Star className="w-5 h-5 inline mr-2 text-yellow-500" />
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map((template) => (
          <WorkoutCard
            key={template.name}
            template={template}
            onStart={handleStartWorkout}
            isRecommended={true}
            getFocusIcon={getFocusIcon}
            getDifficultyColor={getDifficultyColor}
          />
        ))}
          </div>
        </motion.div>
      )}

      {/* All Workouts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
          All Workout Templates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <WorkoutCard
              key={template.name}
              template={template}
              onStart={handleStartWorkout}
              isRecommended={false}
              getFocusIcon={getFocusIcon}
              getDifficultyColor={getDifficultyColor}
            />
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto text-day-text-secondary dark:text-night-text-secondary mb-4" />
            <h3 className="text-lg font-medium text-day-text-primary dark:text-night-text-primary mb-2">
              No workouts found
            </h3>
            <p className="text-day-text-secondary dark:text-night-text-secondary mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button variant="primary" onClick={() => {
              setSelectedDifficulty('all');
              setSelectedFocus('all');
              setSearchQuery('');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Workout Card Component
const WorkoutCard = ({ template, onStart, isRecommended, getFocusIcon, getDifficultyColor }) => {
  const FocusIcon = getFocusIcon(template.focus);
  
  return (
    <Card className={`p-6 hover:shadow-lg transition-all cursor-pointer ${isRecommended ? 'ring-2 ring-yellow-400' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FocusIcon className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
          <Badge 
            variant="ghost" 
            size="sm"
            className={getDifficultyColor(template.difficulty)}
          >
            {template.difficulty}
          </Badge>
        </div>
        {isRecommended && (
          <Star className="w-5 h-5 text-yellow-500" />
        )}
      </div>

      <h3 className="text-lg font-bold text-day-text-primary dark:text-night-text-primary mb-2">
        {template.name}
      </h3>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-4 text-sm text-day-text-secondary dark:text-night-text-secondary">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {template.duration}
          </span>
          <span className="flex items-center">
            <Flame className="w-4 h-4 mr-1" />
            {template.calories} cal
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-day-text-secondary dark:text-night-text-secondary" />
          <span className="text-sm text-day-text-secondary dark:text-night-text-secondary capitalize">
            {template.focus.replace('-', ' ')}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Dumbbell className="w-4 h-4 text-day-text-secondary dark:text-night-text-secondary" />
          <span className="text-sm text-day-text-secondary dark:text-night-text-secondary">
            {template.exercises.length} exercises
          </span>
        </div>
      </div>

      <Button 
        variant="primary" 
        fullWidth
        onClick={() => onStart(template)}
      >
        <Play className="w-4 h-4 mr-2" />
        Start Workout
      </Button>
    </Card>
  );
};

export default WorkoutSelection;
