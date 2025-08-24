import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, Target, Activity, Flame, Scale, Zap } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

const CalorieCalculator = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    goal: 'maintain'
  });

  const [results, setResults] = useState(null);

  const activityMultipliers = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,         // Light exercise 1-3 days/week
    moderate: 1.55,       // Moderate exercise 3-5 days/week
    active: 1.725,        // Hard exercise 6-7 days/week
    veryActive: 1.9       // Very hard exercise, physical job
  };

  const goalAdjustments = {
    lose: -500,           // 500 calorie deficit for weight loss
    maintain: 0,          // No adjustment for maintenance
    gain: 300             // 300 calorie surplus for weight gain
  };

  const calculateCalories = () => {
    const { age, gender, weight, height, activityLevel, goal } = formData;
    
    if (!age || !weight || !height) return;

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityMultipliers[activityLevel];
    
    // Apply goal adjustment
    const targetCalories = Math.round(tdee + goalAdjustments[goal]);
    
    // Calculate macros (40% carbs, 30% protein, 30% fat for balanced diet)
    const proteinGrams = Math.round((targetCalories * 0.3) / 4);
    const carbsGrams = Math.round((targetCalories * 0.4) / 4);
    const fatGrams = Math.round((targetCalories * 0.3) / 9);

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories,
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetCalculator = () => {
    setFormData({
      age: '',
      gender: 'male',
      weight: '',
      height: '',
      activityLevel: 'moderate',
      goal: 'maintain'
    });
    setResults(null);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-day-card dark:bg-night-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-day-accent-primary dark:text-night-accent" />
              <h2 className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                Calorie Calculator
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-day-hover dark:hover:bg-night-hover rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-day-text-secondary dark:text-night-text-secondary" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary flex items-center">
                <Target className="w-5 h-5 mr-2 text-day-accent-primary dark:text-night-accent" />
                Personal Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-2">
                  Age
                </label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="25"
                  min="15"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full p-3 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-2">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="70"
                  min="30"
                  max="300"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-2">
                  Height (cm)
                </label>
                <Input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="175"
                  min="100"
                  max="250"
                />
              </div>
            </div>

            {/* Activity & Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary flex items-center">
                <Activity className="w-5 h-5 mr-2 text-day-accent-primary dark:text-night-accent" />
                Activity & Goals
              </h3>

              <div>
                <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-2">
                  Activity Level
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                  className="w-full p-3 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                >
                  <option value="sedentary">Sedentary (Little or no exercise)</option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="veryActive">Very Active (Physical job + exercise)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-2">
                  Goal
                </label>
                <select
                  value={formData.goal}
                  onChange={(e) => handleInputChange('goal', e.target.value)}
                  className="w-full p-3 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                >
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Weight</option>
                </select>
              </div>

              <div className="pt-4">
                <Button 
                  variant="primary" 
                  fullWidth 
                  onClick={calculateCalories}
                  disabled={!formData.age || !formData.weight || !formData.height}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Calories
                </Button>
              </div>

              <div>
                <Button 
                  variant="ghost" 
                  fullWidth 
                  onClick={resetCalculator}
                >
                  Reset Calculator
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 p-6 bg-gradient-to-r from-day-accent-primary/10 to-day-accent-secondary/10 dark:from-night-accent/10 dark:to-red-600/10 rounded-xl border border-day-accent-primary/20 dark:border-night-accent/20"
              >
                <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4 flex items-center">
                  <Flame className="w-6 h-6 mr-2 text-orange-500" />
                  Your Daily Calorie Needs
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-day-card dark:bg-night-card rounded-lg">
                      <div className="text-3xl font-bold text-day-accent-primary dark:text-night-accent">
                        {results.targetCalories}
                      </div>
                      <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                        Target Calories
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-day-card dark:bg-night-card rounded-lg">
                        <span className="text-day-text-secondary dark:text-night-text-secondary">BMR:</span>
                        <span className="font-semibold text-day-text-primary dark:text-night-text-primary">
                          {results.bmr} cal
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-day-card dark:bg-night-card rounded-lg">
                        <span className="text-day-text-secondary dark:text-night-text-secondary">TDEE:</span>
                        <span className="font-semibold text-day-text-primary dark:text-night-text-primary">
                          {results.tdee} cal
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-day-text-primary dark:text-night-text-primary flex items-center">
                      <Scale className="w-5 h-5 mr-2 text-blue-500" />
                      Daily Macros
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="text-blue-700 dark:text-blue-300">Protein:</span>
                        <span className="font-semibold text-blue-700 dark:text-blue-300">
                          {results.protein}g
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-green-700 dark:text-green-300">Carbs:</span>
                        <span className="font-semibold text-green-700 dark:text-green-300">
                          {results.carbs}g
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <span className="text-yellow-700 dark:text-yellow-300">Fat:</span>
                        <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                          {results.fat}g
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-day-hover dark:bg-night-hover rounded-lg">
                  <h4 className="font-semibold text-day-text-primary dark:text-night-text-primary mb-2 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Tips for Success
                  </h4>
                  <ul className="text-sm text-day-text-secondary dark:text-night-text-secondary space-y-1">
                    <li>• Track your food intake to stay within your calorie goal</li>
                    <li>• Focus on whole, nutrient-dense foods</li>
                    <li>• Stay hydrated and get adequate sleep</li>
                    <li>• Adjust portions based on your progress</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CalorieCalculator;
