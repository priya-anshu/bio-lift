import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Apple, 
  ShoppingCart, 
  Calculator, 
  Target,
  Plus,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import CalorieCalculator from '../components/CalorieCalculator';
import MealSuggestions from '../components/MealSuggestions';
import MealPrepGuide from '../components/MealPrepGuide';

const Diet = () => {
  const [budget, setBudget] = useState(50);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [showCalorieCalculator, setShowCalorieCalculator] = useState(false);
  const [showMealSuggestions, setShowMealSuggestions] = useState(false);
  const [showMealPrepGuide, setShowMealPrepGuide] = useState(false);

  const mealPlans = [
    {
      id: 1,
      name: "Budget-Friendly Protein Pack",
      calories: 1800,
      protein: "120g",
      carbs: "180g",
      fat: "60g",
      cost: 35,
      duration: "7 days",
      meals: [
        "Oatmeal with banana",
        "Chicken rice bowl",
        "Greek yogurt with berries",
        "Tuna salad sandwich"
      ]
    },
    {
      id: 2,
      name: "Vegetarian Wellness",
      calories: 1600,
      protein: "80g",
      carbs: "200g",
      fat: "50g",
      cost: 40,
      duration: "7 days",
      meals: [
        "Smoothie bowl",
        "Quinoa salad",
        "Hummus wrap",
        "Lentil soup"
      ]
    },
    {
      id: 3,
      name: "High-Performance Athlete",
      calories: 2200,
      protein: "150g",
      carbs: "250g",
      fat: "70g",
      cost: 65,
      duration: "7 days",
      meals: [
        "Protein pancakes",
        "Salmon with sweet potato",
        "Protein shake",
        "Lean beef stir-fry"
      ]
    }
  ];

  const groceryList = [
    { name: "Chicken breast", quantity: "2 lbs", price: 8.99, category: "Protein" },
    { name: "Brown rice", quantity: "2 lbs", price: 3.99, category: "Grains" },
    { name: "Broccoli", quantity: "1 lb", price: 2.49, category: "Vegetables" },
    { name: "Greek yogurt", quantity: "32 oz", price: 4.99, category: "Dairy" },
    { name: "Bananas", quantity: "1 bunch", price: 1.99, category: "Fruits" },
    { name: "Eggs", quantity: "12 count", price: 3.49, category: "Protein" },
    { name: "Oatmeal", quantity: "1 lb", price: 2.99, category: "Grains" },
    { name: "Spinach", quantity: "1 lb", price: 2.99, category: "Vegetables" }
  ];

  const nutritionGoals = {
    calories: { current: 1850, target: 2000 },
    protein: { current: 125, target: 150 },
    carbs: { current: 180, target: 200 },
    fat: { current: 55, target: 65 }
  };

  const getProgressColor = (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-red-500';
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
          Nutrition & Diet
        </h1>
        <p className="text-day-text-secondary dark:text-night-text-secondary">
          Smart meal planning for your fitness goals
        </p>
      </motion.div>

      {/* Budget Setting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
              Weekly Budget
            </h2>
            <DollarSign className="w-6 h-6 text-day-accent-primary dark:text-night-accent" />
          </div>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              placeholder="Enter budget"
              className="flex-1"
            />
            <Button variant="primary">
              Update Budget
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Meal Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Recommended Meal Plans
              </h2>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Custom
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mealPlans.map((plan) => (
                <Card key={plan.id} hover className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="primary" size="sm">
                      ${plan.cost}
                    </Badge>
                    <Badge variant="ghost" size="sm">
                      {plan.duration}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-day-text-primary dark:text-night-text-primary mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-day-text-secondary dark:text-night-text-secondary">Calories:</span>
                      <span className="font-medium">{plan.calories}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-day-text-secondary dark:text-night-text-secondary">Protein:</span>
                      <span className="font-medium">{plan.protein}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-day-text-secondary dark:text-night-text-secondary">Carbs:</span>
                      <span className="font-medium">{plan.carbs}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-day-text-secondary dark:text-night-text-secondary">Fat:</span>
                      <span className="font-medium">{plan.fat}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-day-text-primary dark:text-night-text-primary">Sample Meals:</h4>
                    <ul className="text-sm text-day-text-secondary dark:text-night-text-secondary space-y-1">
                      {plan.meals.slice(0, 3).map((meal, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                          {meal}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button variant="primary" fullWidth>
                    Select Plan
                  </Button>
                </Card>
              ))}
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrition Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
                <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                  Today's Nutrition
                </h2>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {Object.entries(nutritionGoals).map(([nutrient, { current, target }]) => (
                  <div key={nutrient} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-day-text-primary dark:text-night-text-primary capitalize">
                        {nutrient}
                      </span>
                      <span className={`text-sm font-bold ${getProgressColor(current, target)}`}>
                        {current}/{target}
                      </span>
                    </div>
                    <div className="w-full bg-day-border dark:bg-night-border rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-day-accent-primary to-day-accent-secondary dark:from-night-accent dark:to-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((current / target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Grocery List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
                  <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                    Grocery List
                  </h2>
                </div>
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {groceryList.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-day-hover dark:hover:bg-night-hover transition-colors">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-day-accent-primary dark:text-night-accent bg-day-card dark:bg-night-card border-day-border dark:border-night-border rounded focus:ring-day-accent-primary dark:focus:ring-night-accent"
                      />
                      <div>
                        <h4 className="font-medium text-day-text-primary dark:text-night-text-primary">
                          {item.name}
                        </h4>
                        <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                          {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-day-text-primary dark:text-night-text-primary">
                        ${item.price}
                      </div>
                      <Badge variant="ghost" size="sm">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-day-border dark:border-night-border">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-day-text-primary dark:text-night-text-primary">
                    Total:
                  </span>
                  <span className="font-bold text-day-accent-primary dark:text-night-accent">
                    ${groceryList.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <Card.Header>
            <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
              Quick Actions
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="ghost" 
                className="h-20 flex-col"
                onClick={() => setShowCalorieCalculator(true)}
              >
                <Calculator className="w-6 h-6 mb-2" />
                <span>Calorie Calculator</span>
              </Button>
              <Button 
                variant="ghost" 
                className="h-20 flex-col"
                onClick={() => setShowMealSuggestions(true)}
              >
                <Apple className="w-6 h-6 mb-2" />
                <span>Meal Suggestions</span>
              </Button>
              <Button 
                variant="ghost" 
                className="h-20 flex-col"
                onClick={() => setShowMealPrepGuide(true)}
              >
                <Clock className="w-6 h-6 mb-2" />
                <span>Meal Prep Guide</span>
              </Button>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Modal Components */}
      <CalorieCalculator 
        isOpen={showCalorieCalculator} 
        onClose={() => setShowCalorieCalculator(false)} 
      />
      <MealSuggestions 
        isOpen={showMealSuggestions} 
        onClose={() => setShowMealSuggestions(false)} 
      />
      <MealPrepGuide 
        isOpen={showMealPrepGuide} 
        onClose={() => setShowMealPrepGuide(false)} 
      />
    </div>
  );
};

export default Diet; 