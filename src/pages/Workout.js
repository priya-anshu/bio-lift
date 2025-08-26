import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
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
  RotateCcw,
  X
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ExerciseImage from '../components/ExerciseImage';
import { getExerciseData } from '../utils/exerciseUtils';
import { WorkoutSession } from '../utils/workoutUtils';

const Workout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [repMultiplier, setRepMultiplier] = useState(1);
  const [setAdjustment, setSetAdjustment] = useState(0);
  const [restSeconds, setRestSeconds] = useState(60);
  const [showHeartRate, setShowHeartRate] = useState(false);
  const [isHeartTracking, setIsHeartTracking] = useState(false);
  const [heartRate, setHeartRate] = useState(78);
  const [avgHeartRate, setAvgHeartRate] = useState(0);
  const [peakHeartRate, setPeakHeartRate] = useState(0);
  const [samplesCount, setSamplesCount] = useState(0);
  const [currentExerciseData, setCurrentExerciseData] = useState(null);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState({
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
  });

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

  // If a workout template is passed via navigation state, apply it; otherwise keep default
  useEffect(() => {
    const workoutTemplate = location.state?.workoutTemplate;
    if (!workoutTemplate) {
      // Do not redirect; allow default workout to be shown when coming directly to /workout
      return;
    }

    const session = new WorkoutSession(workoutTemplate);
    setWorkoutSession(session);
    setWorkoutPlan(workoutTemplate);
  }, [location.state]);

  const handleReset = () => {
    setCurrentExercise(0);
    setIsPlaying(false);
    setTimeRemaining(45);
  };

  const computeSets = (baseSets) => {
    const adjusted = baseSets + setAdjustment;
    return Math.max(1, adjusted);
  };

  const computeReps = (repsString) => {
    if (!repsString) return '';
    const rangeMatch = repsString.match(/^(\d+)\s*-\s*(\d+)$/);
    const singleMatch = repsString.match(/^(\d+)$/);
    if (rangeMatch) {
      const min = Math.max(1, Math.round(parseInt(rangeMatch[1], 10) * repMultiplier));
      const max = Math.max(min, Math.round(parseInt(rangeMatch[2], 10) * repMultiplier));
      return `${min}-${max}`;
    }
    if (singleMatch) {
      const val = Math.max(1, Math.round(parseInt(singleMatch[1], 10) * repMultiplier));
      return `${val}`;
    }
    return repsString;
  };

  const applyPresetDifficulty = (level) => {
    setDifficulty(level);
    if (level === 'Beginner') {
      setRepMultiplier(0.8);
      setSetAdjustment(-1);
      setRestSeconds(75);
    } else if (level === 'Intermediate') {
      setRepMultiplier(1);
      setSetAdjustment(0);
      setRestSeconds(60);
    } else if (level === 'Advanced') {
      setRepMultiplier(1.2);
      setSetAdjustment(1);
      setRestSeconds(45);
    }
  };

  // Load exercise data when current exercise changes
  useEffect(() => {
    const currentExerciseName = workoutPlan.exercises[currentExercise].name;
    const loadExerciseData = async () => {
      const data = await getExerciseData(currentExerciseName);
      setCurrentExerciseData(data);
    };
    loadExerciseData();
  }, [currentExercise, workoutPlan]);

  // Simulate heart rate while tracking is enabled
  useEffect(() => {
    if (!isHeartTracking) return;
    const interval = setInterval(() => {
      const base = 75 + currentExercise * 8;
      const target = Math.min(185, base + (isPlaying ? 30 : 0));
      const noise = Math.random() * 6 - 3;
      const next = Math.max(55, Math.min(195, Math.round(heartRate + (target - heartRate) * 0.15 + noise)));
      setHeartRate(next);
      setSamplesCount((c) => c + 1);
      setAvgHeartRate((prevAvg) => {
        const total = prevAvg * samplesCount + next;
        return total / (samplesCount + 1);
      });
      setPeakHeartRate((p) => Math.max(p, next));
    }, 1500);
    return () => clearInterval(interval);
  }, [isHeartTracking, currentExercise, isPlaying, heartRate, samplesCount]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
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
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/workout-selection')}
          className="p-2"
        >
          <X className="w-5 h-5" />
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Workout Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exercise Image Display */}
          <Card className="p-6">
            <div className="aspect-video rounded-lg mb-4 overflow-hidden">
              <ExerciseImage 
                exerciseName={workoutPlan.exercises[currentExercise].name}
                className="w-full h-full rounded-lg"
                showFallback={true}
                animate={true}
                animationSpeed={2000}
              />
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
              {currentExerciseData?.instructions?.[0] || workoutPlan.exercises[currentExercise].description}
            </p>
            
            {/* Exercise Details */}
            {currentExerciseData && (
              <div className="mt-4 p-4 bg-day-hover dark:bg-night-hover rounded-lg">
                <h4 className="font-semibold text-day-text-primary dark:text-night-text-primary mb-2">
                  Exercise Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-day-text-secondary dark:text-night-text-secondary">Level: </span>
                    <span className="text-day-text-primary dark:text-night-text-primary capitalize">
                      {currentExerciseData.level}
                    </span>
                  </div>
                  <div>
                    <span className="text-day-text-secondary dark:text-night-text-secondary">Equipment: </span>
                    <span className="text-day-text-primary dark:text-night-text-primary capitalize">
                      {currentExerciseData.equipment}
                    </span>
                  </div>
                  <div>
                    <span className="text-day-text-secondary dark:text-night-text-secondary">Category: </span>
                    <span className="text-day-text-primary dark:text-night-text-primary capitalize">
                      {currentExerciseData.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-day-text-secondary dark:text-night-text-secondary">Primary Muscles: </span>
                    <span className="text-day-text-primary dark:text-night-text-primary">
                      {currentExerciseData.primaryMuscles?.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            )}
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
                  {restSeconds}s
                </div>
                <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                  Rest Time
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                  {computeSets(workoutPlan.exercises[currentExercise].sets)}
                </div>
                <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                  Sets
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                  {computeReps(workoutPlan.exercises[currentExercise].reps)}
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
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-day-border dark:bg-night-border flex-shrink-0">
                        <ExerciseImage 
                          exerciseName={exercise.name}
                          className="w-full h-full"
                          showFallback={true}
                          isStatic={true}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-day-text-primary dark:text-night-text-primary truncate">
                          {exercise.name}
                        </h4>
                        <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                          {computeSets(exercise.sets)} sets × {computeReps(exercise.reps)}
                        </p>
                      </div>
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
              <Button variant="ghost" fullWidth onClick={() => setShowDifficulty(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Adjust Difficulty
              </Button>
              <Button variant="ghost" fullWidth onClick={() => setShowHeartRate(true)}>
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

      {/* Adjust Difficulty Modal */}
      {showDifficulty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDifficulty(false)}></div>
          <Card className="relative w-full max-w-xl p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">Adjust Difficulty</h3>
              <button className="text-day-text-secondary dark:text-night-text-secondary" onClick={() => setShowDifficulty(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {['Beginner','Intermediate','Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => applyPresetDifficulty(lvl)}
                  className={`p-3 rounded-lg border transition-colors ${
                    difficulty === lvl
                      ? 'border-day-accent-primary dark:border-night-accent text-day-text-primary dark:text-night-text-primary bg-day-accent-primary/10 dark:bg-night-accent/10'
                      : 'border-day-border dark:border-night-border text-day-text-secondary dark:text-night-text-secondary hover:bg-day-hover dark:hover:bg-night-hover'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-day-text-primary dark:text-night-text-primary flex items-center">
                    <Target className="w-4 h-4 mr-2" /> Rep Intensity ({repMultiplier.toFixed(1)}×)
                  </label>
                  <span className="text-sm text-day-text-secondary dark:text-night-text-secondary">Adjust reps</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={repMultiplier}
                  onChange={(e) => setRepMultiplier(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-day-text-primary dark:text-night-text-primary">Set Adjustment ({setAdjustment >= 0 ? `+${setAdjustment}` : setAdjustment})</label>
                  <span className="text-sm text-day-text-secondary dark:text-night-text-secondary">-2 to +2</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="1"
                  value={setAdjustment}
                  onChange={(e) => setSetAdjustment(parseInt(e.target.value, 10))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-day-text-primary dark:text-night-text-primary flex items-center">
                    <Timer className="w-4 h-4 mr-2" /> Rest Time ({restSeconds}s)
                  </label>
                  <span className="text-sm text-day-text-secondary dark:text-night-text-secondary">30s to 120s</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="5"
                  value={restSeconds}
                  onChange={(e) => setRestSeconds(parseInt(e.target.value, 10))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <Button variant="ghost" onClick={() => setShowDifficulty(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setShowDifficulty(false)}>Apply</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Track Heart Rate Modal */}
      {showHeartRate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowHeartRate(false)}></div>
          <Card className="relative w-full max-w-xl p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">Heart Rate</h3>
              <button className="text-day-text-secondary dark:text-night-text-secondary" onClick={() => setShowHeartRate(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg border border-day-border dark:border-night-border">
                <div className="flex items-center justify-center text-day-text-secondary dark:text-night-text-secondary mb-1">
                  <Heart className="w-4 h-4 mr-1" /> Current
                </div>
                <div className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary">{heartRate}<span className="text-base font-medium ml-1">bpm</span></div>
              </div>
              <div className="text-center p-4 rounded-lg border border-day-border dark:border-night-border">
                <div className="text-day-text-secondary dark:text-night-text-secondary mb-1">Average</div>
                <div className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary">{Math.round(avgHeartRate) || 0}<span className="text-base font-medium ml-1">bpm</span></div>
              </div>
              <div className="text-center p-4 rounded-lg border border-day-border dark:border-night-border">
                <div className="text-day-text-secondary dark:text-night-text-secondary mb-1">Peak</div>
                <div className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary">{peakHeartRate || heartRate}<span className="text-base font-medium ml-1">bpm</span></div>
              </div>
            </div>

            <div className="mb-4">
              <div className="w-full bg-day-border dark:bg-night-border rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    heartRate < 100 ? 'bg-green-500' : heartRate < 150 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, (heartRate - 50) / 1.5))}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-day-text-secondary dark:text-night-text-secondary mt-1">
                <span>50</span>
                <span>100</span>
                <span>150</span>
                <span>200</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                Samples: {samplesCount}
              </div>
              <div className="space-x-2">
                <Button
                  variant={isHeartTracking ? 'outline' : 'primary'}
                  onClick={() => setIsHeartTracking((v) => !v)}
                >
                  {isHeartTracking ? 'Pause' : 'Start'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setAvgHeartRate(0);
                    setPeakHeartRate(0);
                    setSamplesCount(0);
                  }}
                >
                  Reset Stats
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Workout; 