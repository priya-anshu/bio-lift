import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { db } from '../firebase';
import { ref, get, set, onValue, off } from 'firebase/database';

const Goals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const goalsRef = ref(db, `users/${user.uid}/dashboard/goals`);
    
    const unsubscribe = onValue(goalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGoals(Array.isArray(data) ? data : Object.values(data));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const addGoal = async (goalData) => {
    if (!user?.uid) return;

    const newGoal = {
      id: Date.now(),
      ...goalData,
      createdAt: new Date().toISOString(),
      progress: 0
    };

    const updatedGoals = [...goals, newGoal];
    const goalsRef = ref(db, `users/${user.uid}/dashboard/goals`);
    
    try {
      await set(goalsRef, updatedGoals);
      setShowAddGoal(false);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const updateGoal = async (goalId, updates) => {
    if (!user?.uid) return;

    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    );
    
    const goalsRef = ref(db, `users/${user.uid}/dashboard/goals`);
    
    try {
      await set(goalsRef, updatedGoals);
      setEditingGoal(null);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (goalId) => {
    if (!user?.uid) return;

    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    const goalsRef = ref(db, `users/${user.uid}/dashboard/goals`);
    
    try {
      await set(goalsRef, updatedGoals);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const updateProgress = async (goalId, newProgress) => {
    if (!user?.uid) return;

    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, progress: Math.min(100, Math.max(0, newProgress)) } : goal
    );
    
    const goalsRef = ref(db, `users/${user.uid}/dashboard/goals`);
    
    try {
      await set(goalsRef, updatedGoals);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
              Your Goals
            </h1>
            <p className="text-day-text-secondary dark:text-night-text-secondary">
              Track and manage your fitness objectives
            </p>
          </div>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowAddGoal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </motion.div>

      {/* Goals Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {goals.map((goal) => (
          <Card key={goal.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
                <Badge variant="ghost" size="sm">
                  {goal.unit}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingGoal(goal)}
                  className="p-1"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteGoal(goal.id)}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-day-text-primary dark:text-night-text-primary mb-2">
              {goal.title}
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-day-text-secondary dark:text-night-text-secondary">
                  Progress
                </span>
                <span className="font-medium text-day-text-primary dark:text-night-text-primary">
                  {goal.progress}%
                </span>
              </div>
              
              <div className="w-full bg-day-border dark:bg-night-border rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-day-accent-primary to-day-accent-secondary dark:from-night-accent dark:to-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-day-text-secondary dark:text-night-text-secondary">
                  Current
                </span>
                <span className="font-medium text-day-text-primary dark:text-night-text-primary">
                  {goal.current} {goal.unit}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-day-text-secondary dark:text-night-text-secondary">
                  Target
                </span>
                <span className="font-medium text-day-text-primary dark:text-night-text-primary">
                  {goal.target} {goal.unit}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateProgress(goal.id, goal.progress + 10)}
                disabled={goal.progress >= 100}
                className="flex-1"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                +10%
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateProgress(goal.id, goal.progress - 10)}
                disabled={goal.progress <= 0}
                className="flex-1"
              >
                <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />
                -10%
              </Button>
            </div>

            {goal.progress >= 100 && (
              <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Goal Achieved! 🎉
                </span>
              </div>
            )}
          </Card>
        ))}
      </motion.div>

      {goals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-12"
        >
          <Target className="w-16 h-16 mx-auto text-day-text-secondary dark:text-night-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-day-text-primary dark:text-night-text-primary mb-2">
            No goals yet
          </h3>
          <p className="text-day-text-secondary dark:text-night-text-secondary mb-4">
            Start by creating your first fitness goal
          </p>
          <Button variant="primary" onClick={() => setShowAddGoal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Goal
          </Button>
        </motion.div>
      )}

      {/* Add/Edit Goal Modal */}
      {(showAddGoal || editingGoal) && (
        <GoalModal
          goal={editingGoal}
          onSave={editingGoal ? updateGoal : addGoal}
          onClose={() => {
            setShowAddGoal(false);
            setEditingGoal(null);
          }}
        />
      )}
    </div>
  );
};

// Goal Modal Component
const GoalModal = ({ goal, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    target: goal?.target || '',
    unit: goal?.unit || 'workouts',
    deadline: goal?.deadline || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goal) {
      onSave(goal.id, formData);
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-day-card dark:bg-night-card rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
            {goal ? 'Edit Goal' : 'Add New Goal'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-2">
                Goal Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                placeholder="e.g., Weekly Workouts"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-2">
                Target Value
              </label>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                className="w-full p-3 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                placeholder="e.g., 7"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-2">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full p-3 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
              >
                <option value="workouts">Workouts</option>
                <option value="calories">Calories</option>
                <option value="minutes">Minutes</option>
                <option value="kg">Kilograms</option>
                <option value="lbs">Pounds</option>
                <option value="miles">Miles</option>
                <option value="km">Kilometers</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                {goal ? 'Update Goal' : 'Create Goal'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Goals;
