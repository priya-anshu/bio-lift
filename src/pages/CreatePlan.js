import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Target, 
  Activity, 
  Clock, 
  Dumbbell, 
  Heart, 
  Zap, 
  Calendar,
  CheckCircle,
  Plus,
  Save,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

const CreatePlan = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [planData, setPlanData] = useState({
    goal: '',
    fitnessLevel: '',
    availableDays: [],
    workoutDuration: '',
    focusAreas: [],
    experience: '',
    equipment: [],
    timeOfDay: ''
  });

  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const goals = [
    { id: 'weight-loss', label: 'Weight Loss', icon: Target, description: 'Focus on cardio and calorie burning' },
    { id: 'muscle-gain', label: 'Muscle Gain', icon: Dumbbell, description: 'Strength training and hypertrophy' },
    { id: 'endurance', label: 'Endurance', icon: Heart, description: 'Improve cardiovascular fitness' },
    { id: 'flexibility', label: 'Flexibility', icon: Activity, description: 'Yoga and mobility work' },
    { id: 'general-fitness', label: 'General Fitness', icon: Zap, description: 'Balanced overall fitness' }
  ];

  const fitnessLevels = [
    { id: 'beginner', label: 'Beginner', description: 'New to fitness or returning after a long break' },
    { id: 'intermediate', label: 'Intermediate', description: 'Regular exercise routine, some experience' },
    { id: 'advanced', label: 'Advanced', description: 'Consistent training, good form and knowledge' }
  ];

  const availableDays = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

  const focusAreas = [
    { id: 'upper-body', label: 'Upper Body', icon: Dumbbell },
    { id: 'lower-body', label: 'Lower Body', icon: Activity },
    { id: 'core', label: 'Core', icon: Target },
    { id: 'cardio', label: 'Cardio', icon: Heart },
    { id: 'full-body', label: 'Full Body', icon: Zap }
  ];

  const equipment = [
    { id: 'bodyweight', label: 'Bodyweight Only', description: 'No equipment needed' },
    { id: 'dumbbells', label: 'Dumbbells', description: 'Basic weight training' },
    { id: 'resistance-bands', label: 'Resistance Bands', description: 'Portable and versatile' },
    { id: 'full-gym', label: 'Full Gym Access', description: 'All equipment available' }
  ];

  const handleInputChange = (field, value) => {
    if (field === 'availableDays' || field === 'focusAreas' || field === 'equipment') {
      const currentValues = planData[field];
      if (currentValues.includes(value)) {
        setPlanData(prev => ({
          ...prev,
          [field]: currentValues.filter(item => item !== value)
        }));
      } else {
        setPlanData(prev => ({
          ...prev,
          [field]: [...currentValues, value]
        }));
      }
    } else {
      setPlanData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return planData.goal && planData.fitnessLevel;
      case 2:
        return planData.availableDays.length > 0 && planData.workoutDuration;
      case 3:
        return planData.focusAreas.length > 0 && planData.experience;
      case 4:
        return planData.equipment.length > 0 && planData.timeOfDay;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceed()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const plan = {
      id: Date.now(),
      name: `${planData.goal.charAt(0).toUpperCase() + planData.goal.slice(1)} ${planData.fitnessLevel} Plan`,
      goal: planData.goal,
      fitnessLevel: planData.fitnessLevel,
      duration: '8 weeks',
      workoutsPerWeek: planData.availableDays.length,
      focusAreas: planData.focusAreas,
      equipment: planData.equipment,
      weeklySchedule: generateWeeklySchedule(),
      exercises: generateExercises(),
      estimatedCalories: calculateEstimatedCalories(),
      createdAt: new Date().toISOString()
    };
    
    setGeneratedPlan(plan);
    setIsGenerating(false);
  };

  const generateWeeklySchedule = () => {
    const schedule = {};
    planData.availableDays.forEach(day => {
      if (planData.focusAreas.includes('full-body')) {
        schedule[day] = 'Full Body Workout';
      } else if (planData.focusAreas.includes('upper-body') && planData.focusAreas.includes('lower-body')) {
        schedule[day] = day % 2 === 0 ? 'Upper Body' : 'Lower Body';
      } else if (planData.focusAreas.includes('cardio')) {
        schedule[day] = 'Cardio + Core';
      } else {
        schedule[day] = 'Strength Training';
      }
    });
    return schedule;
  };

  const generateExercises = () => {
    const exercises = [];
    const exerciseDatabase = {
      'upper-body': ['Push-ups', 'Pull-ups', 'Dumbbell Rows', 'Shoulder Press', 'Bicep Curls'],
      'lower-body': ['Squats', 'Lunges', 'Deadlifts', 'Calf Raises', 'Glute Bridges'],
      'core': ['Planks', 'Crunches', 'Russian Twists', 'Mountain Climbers', 'Leg Raises'],
      'cardio': ['Burpees', 'Jumping Jacks', 'High Knees', 'Mountain Climbers', 'Jump Rope']
    };

    planData.focusAreas.forEach(area => {
      if (exerciseDatabase[area]) {
        exercises.push(...exerciseDatabase[area].slice(0, 3));
      }
    });

    return exercises.slice(0, 8);
  };

  const calculateEstimatedCalories = () => {
    let baseCalories = 200;
    if (planData.workoutDuration === '30') baseCalories = 250;
    if (planData.workoutDuration === '45') baseCalories = 350;
    if (planData.workoutDuration === '60') baseCalories = 450;
    
    if (planData.focusAreas.includes('cardio')) baseCalories *= 1.2;
    if (planData.fitnessLevel === 'advanced') baseCalories *= 1.1;
    
    return Math.round(baseCalories);
  };

  const savePlan = () => {
    // Here you would save to Firebase
    console.log('Saving plan:', generatedPlan);
    // Navigate back to dashboard
    navigate('/dashboard');
  };

  const startPlan = () => {
    // Here you would start the plan
    console.log('Starting plan:', generatedPlan);
    navigate('/workout-selection');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-4"
      >
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
            Create Your Plan
          </h1>
          <p className="text-day-text-secondary dark:text-night-text-secondary">
            Let's build a personalized workout plan just for you
          </p>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-full bg-day-border dark:bg-night-border rounded-full h-2">
        <div
          className="bg-gradient-to-r from-day-accent-primary to-day-accent-secondary dark:from-night-accent dark:to-red-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step <= currentStep
                ? 'bg-day-accent-primary dark:bg-night-accent text-white'
                : 'bg-day-hover dark:bg-night-hover text-day-text-secondary dark:text-night-text-secondary'
            }`}
          >
            {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
                What's your main fitness goal?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => {
                  const Icon = goal.icon;
                  return (
                    <div
                      key={goal.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        planData.goal === goal.id
                          ? 'border-day-accent-primary dark:border-night-accent bg-day-accent-primary/10 dark:bg-night-accent/10'
                          : 'border-day-border dark:border-night-border hover:border-day-accent-primary/50 dark:hover:border-night-accent/50'
                      }`}
                      onClick={() => handleInputChange('goal', goal.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-6 h-6 text-day-accent-primary dark:text-night-accent" />
                        <div>
                          <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary">
                            {goal.label}
                          </h3>
                          <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                            {goal.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
                What's your current fitness level?
              </h2>
              <div className="space-y-3">
                {fitnessLevels.map((level) => (
                  <div
                    key={level.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      planData.fitnessLevel === level.id
                        ? 'border-day-accent-primary dark:border-night-accent bg-day-accent-primary/10 dark:bg-night-accent/10'
                        : 'border-day-border dark:border-night-border hover:border-day-accent-primary/50 dark:hover:border-night-accent/50'
                    }`}
                    onClick={() => handleInputChange('fitnessLevel', level.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary">
                          {level.label}
                        </h3>
                        <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                          {level.description}
                        </p>
                      </div>
                      {planData.fitnessLevel === level.id && (
                        <CheckCircle className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
                How many days per week can you work out?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableDays.map((day) => (
                  <div
                    key={day.id}
                    className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      planData.availableDays.includes(day.id)
                        ? 'border-day-accent-primary dark:border-night-accent bg-day-accent-primary/10 dark:bg-night-accent/10'
                        : 'border-day-border dark:border-night-border hover:border-day-accent-primary/50 dark:hover:border-night-accent/50'
                    }`}
                    onClick={() => handleInputChange('availableDays', day.id)}
                  >
                    <span className="font-medium text-day-text-primary dark:text-night-text-primary">
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
                How long do you want each workout to be?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: '30', label: '30 minutes', description: 'Quick and effective' },
                  { id: '45', label: '45 minutes', description: 'Balanced workout' },
                  { id: '60', label: '60 minutes', description: 'Comprehensive training' }
                ].map((duration) => (
                  <div
                    key={duration.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      planData.workoutDuration === duration.id
                        ? 'border-day-accent-primary dark:border-night-accent bg-day-accent-primary/10 dark:bg-night-accent/10'
                        : 'border-day-border dark:border-night-border hover:border-day-accent-primary/50 dark:hover:border-night-accent/50'
                    }`}
                    onClick={() => handleInputChange('workoutDuration', duration.id)}
                  >
                    <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary">
                      {duration.label}
                    </h3>
                    <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                      {duration.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
                What areas would you like to focus on?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {focusAreas.map((area) => {
                  const Icon = area.icon;
                  return (
                    <div
                      key={area.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        planData.focusAreas.includes(area.id)
                          ? 'border-day-accent-primary dark:border-night-accent bg-day-accent-primary/10 dark:bg-night-accent/10'
                          : 'border-day-border dark:border-night-border hover:border-day-accent-primary/50 dark:hover:border-night-accent/50'
                      }`}
                      onClick={() => handleInputChange('focusAreas', area.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
                        <span className="font-medium text-day-text-primary dark:text-night-text-primary">
                          {area.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
                What's your experience with exercise?
              </h2>
              <div className="space-y-3">
                {[
                  { id: 'new', label: 'New to Exercise', description: 'Starting my fitness journey' },
                  { id: 'some', label: 'Some Experience', description: 'I\'ve worked out before' },
                  { id: 'experienced', label: 'Experienced', description: 'I know what I\'m doing' }
                ].map((exp) => (
                  <div
                    key={exp.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      planData.experience === exp.id
                        ? 'border-day-accent-primary dark:border-night-accent bg-day-accent-primary/10 dark:bg-night-accent/10'
                        : 'border-day-border dark:border-night-border hover:border-day-accent-primary/50 dark:hover:border-night-accent/50'
                    }`}
                    onClick={() => handleInputChange('experience', exp.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary">
                          {exp.label}
                        </h3>
                        <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                          {exp.description}
                        </p>
                      </div>
                      {planData.experience === exp.id && (
                        <CheckCircle className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
                What equipment do you have access to?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.map((eq) => (
                  <div
                    key={eq.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      planData.equipment.includes(eq.id)
                        ? 'border-day-accent-primary dark:border-night-accent bg-day-accent-primary/10 dark:bg-night-accent/10'
                        : 'border-day-border dark:border-night-border hover:border-day-accent-primary/50 dark:hover:border-night-accent/50'
                    }`}
                    onClick={() => handleInputChange('equipment', eq.id)}
                  >
                    <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary">
                      {eq.label}
                    </h3>
                    <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                      {eq.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
                What time of day do you prefer to work out?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'morning', label: 'Morning', description: 'Start your day strong' },
                  { id: 'afternoon', label: 'Afternoon', description: 'Midday energy boost' },
                  { id: 'evening', label: 'Evening', description: 'Unwind after work' }
                ].map((time) => (
                  <div
                    key={time.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      planData.timeOfDay === time.id
                        ? 'border-day-accent-primary dark:border-night-accent bg-day-accent-primary/10 dark:bg-night-accent/10'
                        : 'border-day-border dark:border-night-border hover:border-day-accent-primary/50 dark:hover:border-night-accent/50'
                    }`}
                    onClick={() => handleInputChange('timeOfDay', time.id)}
                  >
                    <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary">
                      {time.label}
                    </h3>
                    <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                      {time.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button
            variant="primary"
            onClick={nextStep}
            disabled={!canProceed()}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={generatePlan}
            disabled={!canProceed() || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Plan'}
          </Button>
        )}
      </div>

      {/* Generated Plan */}
      <AnimatePresence>
        {generatedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                  Your Personalized Plan
                </h2>
                <Badge variant="primary" size="sm">
                  {generatedPlan.duration}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary mb-3">
                    Plan Overview
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-day-text-secondary dark:text-night-text-secondary">Goal:</span>
                      <span className="font-medium capitalize">{generatedPlan.goal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-day-text-secondary dark:text-night-text-secondary">Level:</span>
                      <span className="font-medium capitalize">{generatedPlan.fitnessLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-day-text-secondary dark:text-night-text-secondary">Workouts/Week:</span>
                      <span className="font-medium">{generatedPlan.workoutsPerWeek}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-day-text-secondary dark:text-night-text-secondary">Est. Calories:</span>
                      <span className="font-medium">{generatedPlan.estimatedCalories}/workout</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary mb-3">
                    Weekly Schedule
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(generatedPlan.weeklySchedule).map(([day, workout]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="text-day-text-secondary dark:text-night-text-secondary capitalize">
                          {day}:
                        </span>
                        <span className="font-medium text-day-text-primary dark:text-night-text-primary">
                          {workout}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary mb-3">
                  Sample Exercises
                </h3>
                <div className="flex flex-wrap gap-2">
                  {generatedPlan.exercises.map((exercise, index) => (
                    <Badge key={index} variant="ghost" size="sm">
                      {exercise}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="primary" onClick={startPlan}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Plan
                </Button>
                <Button variant="secondary" onClick={savePlan}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Plan
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreatePlan;
