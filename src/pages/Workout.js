import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Timer, 
  Target,
  Dumbbell,
  Heart,
  Zap,
  Clock,
  Settings,
  RotateCcw
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const Workout = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45);

  const workoutPlan = {
    name: "Upper Body Strength",
    duration: "45 min",
    difficulty: "Intermediate",
    calories: "320",
    exercises: [
      {
        id: 1,
        name: "Push-ups",
        sets: 3,
        reps: "12-15",
        rest: "60s",
        video: "https://example.com/pushup-demo.mp4",
        description: "Standard push-ups targeting chest, shoulders, and triceps"
      },
      {
        id: 2,
        name: "Dumbbell Rows",
        sets: 3,
        reps: "10-12 each",
        rest: "60s",
        video: "https://example.com/row-demo.mp4",
        description: "Single-arm dumbbell rows for back strength"
      },
      {
        id: 3,
        name: "Shoulder Press",
        sets: 3,
        reps: "8-10",
        rest: "90s",
        video: "https://example.com/press-demo.mp4",
        description: "Overhead press for shoulder development"
      },
      {
        id: 4,
        name: "Bicep Curls",
        sets: 3,
        reps: "12-15",
        rest: "60s",
        video: "https://example.com/curl-demo.mp4",
        description: "Dumbbell bicep curls for arm strength"
      }
    ]
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentExercise < workoutPlan.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const handleReset = () => {
    setCurrentExercise(0);
    setIsPlaying(false);
    setTimeRemaining(45);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary mb-2">
          {workoutPlan.name}
        </h1>
        <div className="flex items-center space-x-4 text-day-text-secondary dark:text-night-text-secondary">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{workoutPlan.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span>{workoutPlan.difficulty}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>{workoutPlan.calories} cal</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Workout Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <Card className="p-6">
            <div className="aspect-video bg-gradient-to-br from-day-accent-primary/10 to-day-accent-secondary/10 dark:from-night-accent/10 dark:to-red-600/10 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <Dumbbell className="w-16 h-16 text-day-accent-primary dark:text-night-accent mx-auto mb-4" />
                <p className="text-day-text-secondary dark:text-night-text-secondary">
                  AI Exercise Demo
                </p>
                <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                  {workoutPlan.exercises[currentExercise].name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                {workoutPlan.exercises[currentExercise].name}
              </h3>
              <Badge variant="primary">
                {currentExercise + 1} of {workoutPlan.exercises.length}
              </Badge>
            </div>
            
            <p className="text-day-text-secondary dark:text-night-text-secondary mt-2">
              {workoutPlan.exercises[currentExercise].description}
            </p>
          </Card>

          {/* Exercise Controls */}
          <Card className="p-6">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button
                variant="ghost"
                size="lg"
                onClick={handlePrevious}
                disabled={currentExercise === 0}
              >
                <SkipBack className="w-6 h-6" />
              </Button>
              
              <Button
                variant="primary"
                size="lg"
                onClick={handlePlayPause}
                className="w-16 h-16 rounded-full"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                onClick={handleNext}
                disabled={currentExercise === workoutPlan.exercises.length - 1}
              >
                <SkipForward className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                  {timeRemaining}s
                </div>
                <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                  Rest Time
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                  {workoutPlan.exercises[currentExercise].sets}
                </div>
                <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                  Sets
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                  {workoutPlan.exercises[currentExercise].reps}
                </div>
                <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                  Reps
                </div>
              </div>
            </div>
          </Card>

          {/* Progress Bar */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary">
                Workout Progress
              </h3>
              <span className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                {Math.round(((currentExercise + 1) / workoutPlan.exercises.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-day-border dark:bg-night-border rounded-full h-3">
              <div
                className="bg-gradient-to-r from-day-accent-primary to-day-accent-secondary dark:from-night-accent dark:to-red-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentExercise + 1) / workoutPlan.exercises.length) * 100}%` }}
              ></div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Workout Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary mb-4">
              Workout Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-day-text-secondary dark:text-night-text-secondary">
                  Exercises Completed
                </span>
                <span className="font-semibold text-day-text-primary dark:text-night-text-primary">
                  {currentExercise}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-day-text-secondary dark:text-night-text-secondary">
                  Total Sets
                </span>
                <span className="font-semibold text-day-text-primary dark:text-night-text-primary">
                  {workoutPlan.exercises.slice(0, currentExercise + 1).reduce((acc, ex) => acc + ex.sets, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-day-text-secondary dark:text-night-text-secondary">
                  Time Elapsed
                </span>
                <span className="font-semibold text-day-text-primary dark:text-night-text-primary">
                  12:34
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-day-text-secondary dark:text-night-text-secondary">
                  Calories Burned
                </span>
                <span className="font-semibold text-day-text-primary dark:text-night-text-primary">
                  156
                </span>
              </div>
            </div>
          </Card>

          {/* Exercise List */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary mb-4">
              Exercise List
            </h3>
            <div className="space-y-3">
              {workoutPlan.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentExercise
                      ? 'bg-day-accent-primary/10 dark:bg-night-accent/10 border border-day-accent-primary dark:border-night-accent'
                      : index < currentExercise
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-day-hover dark:bg-night-hover hover:bg-day-border dark:hover:bg-night-border'
                  }`}
                  onClick={() => setCurrentExercise(index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-day-text-primary dark:text-night-text-primary">
                        {exercise.name}
                      </h4>
                      <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                        {exercise.sets} sets × {exercise.reps}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {index < currentExercise && (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      {index === currentExercise && (
                        <div className="w-4 h-4 bg-day-accent-primary dark:bg-night-accent rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button variant="ghost" fullWidth>
                <Settings className="w-4 h-4 mr-2" />
                Adjust Difficulty
              </Button>
              <Button variant="ghost" fullWidth>
                <Heart className="w-4 h-4 mr-2" />
                Track Heart Rate
              </Button>
              <Button variant="ghost" fullWidth onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Workout
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Workout; 