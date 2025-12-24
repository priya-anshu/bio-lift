import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, CheckCircle, BookOpen, ShoppingBag, Lightbulb } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';

const MealPrepGuide = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('planning');

  const prepSteps = [
    {
      phase: "Planning",
      steps: [
        "Choose your meal prep plan based on your schedule and goals",
        "Create a detailed shopping list with quantities",
        "Plan your prep day (usually Sunday)",
        "Ensure you have enough storage containers"
      ]
    },
    {
      phase: "Shopping",
      steps: [
        "Shop for ingredients 1-2 days before prep day",
        "Buy in bulk when possible to save money",
        "Choose fresh, seasonal produce",
        "Get quality proteins and whole grains"
      ]
    },
    {
      phase: "Preparation",
      steps: [
        "Start with proteins (chicken, fish, beef) - they take longest",
        "Cook grains and legumes in large batches",
        "Roast vegetables in the oven simultaneously",
        "Prepare sauces and dressings"
      ]
    },
    {
      phase: "Portioning",
      steps: [
        "Use consistent portion sizes for easy tracking",
        "Separate proteins, carbs, and vegetables",
        "Label containers with contents and date",
        "Stack containers efficiently in fridge/freezer"
      ]
    }
  ];

  const essentialTools = [
    { name: "Food Scale", purpose: "Accurate portion control", essential: true },
    { name: "Quality Knives", purpose: "Efficient chopping and prep", essential: true },
    { name: "Storage Containers", purpose: "Organized meal storage", essential: true },
    { name: "Slow Cooker", purpose: "Batch cooking proteins", essential: false },
    { name: "Food Processor", purpose: "Quick chopping and blending", essential: false }
  ];

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
        className="bg-day-card dark:bg-night-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-day-accent-primary dark:text-night-accent" />
              <h2 className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                Meal Prep Guide
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-day-hover dark:hover:bg-night-hover rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-day-text-secondary dark:text-night-text-secondary" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-6 bg-day-hover dark:bg-night-hover rounded-lg p-1">
            {[
              { id: 'planning', label: 'Planning', icon: Calendar },
              { id: 'preparation', label: 'Preparation', icon: BookOpen },
              { id: 'tools', label: 'Tools', icon: ShoppingBag },
              { id: 'tips', label: 'Tips', icon: Lightbulb }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === id
                    ? 'bg-day-card dark:bg-night-card text-day-accent-primary dark:text-night-accent shadow-sm'
                    : 'text-day-text-secondary dark:text-night-text-secondary hover:text-day-text-primary dark:hover:text-night-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Content Sections */}
          <AnimatePresence mode="wait">
            {activeTab === 'planning' && (
              <motion.div
                key="planning"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
                    Weekly Prep Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                      <div key={day} className="p-4 bg-day-hover dark:bg-night-hover rounded-lg text-center">
                        <h4 className="font-semibold text-day-text-primary dark:text-night-text-primary mb-2">
                          {day}
                        </h4>
                        <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                          {day === 'Sunday' ? 'Prep Day (2-3 hours)' : 'Grab & Go (5-15 min)'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Quick Start Guide
                  </h4>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p><strong>Week 1:</strong> Prep 3 days of breakfast and lunch</p>
                    <p><strong>Week 2:</strong> Add dinner prep and expand to 5 days</p>
                    <p><strong>Week 3:</strong> Include snacks and optimize your process</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'preparation' && (
              <motion.div
                key="preparation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
                    Step-by-Step Preparation
                  </h3>
                  <div className="space-y-4">
                    {prepSteps.map((phase, index) => (
                      <Card key={index} className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-day-accent-primary dark:bg-night-accent text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary mb-3">
                              {phase.phase}
                            </h4>
                            <ul className="space-y-2">
                              {phase.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start space-x-3">
                                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-day-text-primary dark:text-night-text-primary">
                                    {step}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tools' && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
                    Essential Tools & Equipment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {essentialTools.map((tool, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-day-text-primary dark:text-night-text-primary">
                              {tool.name}
                            </h4>
                            <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                              {tool.purpose}
                            </p>
                          </div>
                          <Badge variant={tool.essential ? "primary" : "ghost"} size="sm">
                            {tool.essential ? "Essential" : "Optional"}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary mb-4">
                    Pro Tips & Best Practices
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary">
                        Planning & Organization
                      </h4>
                      <ul className="space-y-2 text-sm text-day-text-primary dark:text-night-text-primary">
                        <li>• Start with 2-3 days of prep to build confidence</li>
                        <li>• Use a meal prep calendar to track what you're making</li>
                        <li>• Prep ingredients that can be used in multiple recipes</li>
                        <li>• Consider your weekly schedule when planning</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary">
                        Cooking & Preparation
                      </h4>
                      <ul className="space-y-2 text-sm text-day-text-primary dark:text-night-text-primary">
                        <li>• Cook proteins to 90% doneness to prevent overcooking</li>
                        <li>• Undercook grains slightly - they'll finish cooking when reheated</li>
                        <li>• Season food lightly during prep, add more when serving</li>
                        <li>• Let hot food cool completely before storing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MealPrepGuide;
