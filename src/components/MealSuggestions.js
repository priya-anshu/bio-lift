import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Apple, Search, Filter, Clock, Utensils, Star, Heart, Zap } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';

const MealSuggestions = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    cuisine: 'all',
    mealType: 'all',
    dietary: 'all',
    timeToCook: 'all',
    calories: 'all'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);

  const mealDatabase = [
    {
      id: 1,
      name: "Grilled Chicken Quinoa Bowl",
      cuisine: "Mediterranean",
      mealType: "lunch",
      dietary: "high-protein",
      timeToCook: "25",
      calories: 450,
      protein: "35g",
      carbs: "45g",
      fat: "18g",
      ingredients: ["chicken breast", "quinoa", "cherry tomatoes", "cucumber", "olive oil"],
      instructions: [
        "Season chicken with herbs and grill for 8-10 minutes",
        "Cook quinoa according to package instructions",
        "Chop vegetables and mix with olive oil and lemon juice",
        "Assemble bowl with quinoa base, sliced chicken, and vegetables"
      ],
      prepTime: "15 min",
      cookTime: "10 min",
      difficulty: "Easy",
      rating: 4.8,
      tags: ["High Protein", "Gluten-Free", "Quick"]
    },
    {
      id: 2,
      name: "Salmon Teriyaki with Brown Rice",
      cuisine: "Asian",
      mealType: "dinner",
      dietary: "omega-3",
      timeToCook: "30",
      calories: 520,
      protein: "38g",
      carbs: "55g",
      fat: "22g",
      ingredients: ["salmon fillet", "brown rice", "teriyaki sauce", "broccoli", "sesame seeds"],
      instructions: [
        "Marinate salmon in teriyaki sauce for 15 minutes",
        "Cook brown rice according to package instructions",
        "Steam broccoli until tender-crisp",
        "Grill salmon for 6-8 minutes, basting with sauce",
        "Serve with rice and broccoli, garnish with sesame seeds"
      ],
      prepTime: "20 min",
      cookTime: "10 min",
      difficulty: "Medium",
      rating: 4.9,
      tags: ["Omega-3", "High Protein", "Heart Healthy"]
    },
    {
      id: 3,
      name: "Greek Yogurt Parfait",
      cuisine: "Mediterranean",
      mealType: "breakfast",
      dietary: "probiotic",
      timeToCook: "5",
      calories: 280,
      protein: "20g",
      carbs: "35g",
      fat: "8g",
      ingredients: ["greek yogurt", "honey", "granola", "mixed berries", "chia seeds"],
      instructions: [
        "Layer greek yogurt in a glass or bowl",
        "Drizzle with honey",
        "Add granola layer",
        "Top with fresh berries and chia seeds",
        "Serve immediately for best texture"
      ],
      prepTime: "5 min",
      cookTime: "0 min",
      difficulty: "Easy",
      rating: 4.6,
      tags: ["Quick", "Probiotic", "High Protein"]
    },
    {
      id: 4,
      name: "Vegetarian Buddha Bowl",
      cuisine: "Fusion",
      mealType: "lunch",
      dietary: "vegetarian",
      timeToCook: "20",
      calories: 380,
      protein: "18g",
      carbs: "58g",
      fat: "14g",
      ingredients: ["sweet potato", "chickpeas", "quinoa", "kale", "tahini dressing"],
      instructions: [
        "Roast sweet potato and chickpeas with olive oil and spices",
        "Cook quinoa and let cool",
        "Massage kale with olive oil and lemon juice",
        "Assemble bowl with quinoa base, roasted vegetables, and tahini dressing"
      ],
      prepTime: "15 min",
      cookTime: "25 min",
      difficulty: "Easy",
      rating: 4.7,
      tags: ["Vegetarian", "High Fiber", "Nutrient Dense"]
    },
    {
      id: 5,
      name: "Protein Pancakes",
      cuisine: "American",
      mealType: "breakfast",
      dietary: "high-protein",
      timeToCook: "15",
      calories: 320,
      protein: "28g",
      carbs: "42g",
      fat: "12g",
      ingredients: ["protein powder", "oats", "banana", "eggs", "almond milk"],
      instructions: [
        "Blend oats into flour consistency",
        "Mix protein powder, oat flour, mashed banana, eggs, and almond milk",
        "Let batter rest for 5 minutes",
        "Cook on medium heat until bubbles form, then flip",
        "Serve with fresh fruit and maple syrup"
      ],
      prepTime: "10 min",
      cookTime: "5 min",
      difficulty: "Easy",
      rating: 4.5,
      tags: ["High Protein", "Quick", "Post-Workout"]
    }
  ];

  const filteredMeals = mealDatabase.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meal.ingredients.some(ingredient => 
                           ingredient.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    
    const matchesCuisine = filters.cuisine === 'all' || meal.cuisine.toLowerCase() === filters.cuisine;
    const matchesMealType = filters.mealType === 'all' || meal.mealType === filters.mealType;
    const matchesDietary = filters.dietary === 'all' || meal.dietary === filters.dietary;
    const matchesTime = filters.timeToCook === 'all' || parseInt(meal.timeToCook) <= parseInt(filters.timeToCook);
    const matchesCalories = filters.calories === 'all' || 
                           (filters.calories === 'low' && meal.calories <= 300) ||
                           (filters.calories === 'medium' && meal.calories > 300 && meal.calories <= 500) ||
                           (filters.calories === 'high' && meal.calories > 500);

    return matchesSearch && matchesCuisine && matchesMealType && matchesDietary && matchesTime && matchesCalories;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-day-text-secondary dark:text-night-text-secondary';
    }
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
        className="bg-day-card dark:bg-night-card rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Apple className="w-8 h-8 text-day-accent-primary dark:text-night-accent" />
              <h2 className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                Meal Suggestions
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-day-hover dark:hover:bg-night-hover rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-day-text-secondary dark:text-night-text-secondary" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-day-text-secondary dark:text-night-text-secondary" />
              <input
                type="text"
                placeholder="Search meals, ingredients, or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={filters.cuisine}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                className="px-3 py-2 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary text-sm focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent"
              >
                <option value="all">All Cuisines</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="asian">Asian</option>
                <option value="american">American</option>
                <option value="fusion">Fusion</option>
              </select>

              <select
                value={filters.mealType}
                onChange={(e) => handleFilterChange('mealType', e.target.value)}
                className="px-3 py-2 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary text-sm focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent"
              >
                <option value="all">All Meals</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>

              <select
                value={filters.dietary}
                onChange={(e) => handleFilterChange('dietary', e.target.value)}
                className="px-3 py-2 border border-day-border dark:border-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary text-sm focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent"
              >
                <option value="all">All Diets</option>
                <option value="high-protein">High Protein</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="omega-3">Omega-3</option>
                <option value="probiotic">Probiotic</option>
              </select>

              <select
                value={filters.timeToCook}
                onChange={(e) => handleFilterChange('timeToCook', e.target.value)}
                className="px-3 py-2 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary text-sm focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent"
              >
                <option value="all">Any Time</option>
                <option value="15">15 min or less</option>
                <option value="30">30 min or less</option>
                <option value="45">45 min or less</option>
              </select>

              <select
                value={filters.calories}
                onChange={(e) => handleFilterChange('calories', e.target.value)}
                className="px-3 py-2 border border-day-border dark:border-night-border rounded-lg bg-day-card dark:bg-night-card text-day-text-primary dark:text-night-text-primary text-sm focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent"
              >
                <option value="all">All Calories</option>
                <option value="low">Low (≤300)</option>
                <option value="medium">Medium (301-500)</option>
                <option value="high">High (>500)</option>
              </select>
            </div>
          </div>

          {/* Meal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map((meal) => (
              <Card key={meal.id} hover className="p-4 cursor-pointer" onClick={() => setSelectedMeal(meal)}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary text-lg">
                      {meal.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{meal.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-day-text-secondary dark:text-night-text-secondary">
                    <Clock className="w-4 h-4" />
                    <span>{meal.timeToCook} min</span>
                    <span>•</span>
                    <span className={getDifficultyColor(meal.difficulty)}>{meal.difficulty}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-day-text-secondary dark:text-night-text-secondary">
                      {meal.calories} cal
                    </span>
                    <div className="flex space-x-2">
                      <Badge variant="ghost" size="sm">{meal.protein}</Badge>
                      <Badge variant="ghost" size="sm">{meal.carbs}</Badge>
                      <Badge variant="ghost" size="sm">{meal.fat}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {meal.tags.map((tag, index) => (
                      <Badge key={index} variant="primary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="ghost" fullWidth size="sm">
                    <Utensils className="w-4 h-4 mr-2" />
                    View Recipe
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredMeals.length === 0 && (
            <div className="text-center py-12">
              <Apple className="w-16 h-16 mx-auto text-day-text-secondary dark:text-night-text-secondary mb-4" />
              <h3 className="text-lg font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                No meals found
              </h3>
              <p className="text-day-text-secondary dark:text-night-text-secondary">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>

        {/* Meal Detail Modal */}
        <AnimatePresence>
          {selectedMeal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
              onClick={() => setSelectedMeal(null)}
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
                    <h2 className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                      {selectedMeal.name}
                    </h2>
                    <button
                      onClick={() => setSelectedMeal(null)}
                      className="p-2 hover:bg-day-hover dark:hover:bg-night-hover rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-day-text-secondary dark:text-night-text-secondary" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Meal Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-day-hover dark:bg-night-hover rounded-lg">
                        <div className="text-2xl font-bold text-day-accent-primary dark:text-night-accent">
                          {selectedMeal.calories}
                        </div>
                        <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                          Calories
                        </div>
                      </div>
                      <div className="text-center p-3 bg-day-hover dark:bg-night-hover rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">
                          {selectedMeal.protein}
                        </div>
                        <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                          Protein
                        </div>
                      </div>
                      <div className="text-center p-3 bg-day-hover dark:bg-night-hover rounded-lg">
                        <div className="text-2xl font-bold text-green-500">
                          {selectedMeal.carbs}
                        </div>
                        <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                          Carbs
                        </div>
                      </div>
                      <div className="text-center p-3 bg-day-hover dark:bg-night-hover rounded-lg">
                        <div className="text-2xl font-bold text-yellow-500">
                          {selectedMeal.fat}
                        </div>
                        <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                          Fat
                        </div>
                      </div>
                    </div>

                    {/* Time and Difficulty */}
                    <div className="flex items-center justify-between p-4 bg-day-hover dark:bg-night-hover rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
                          <span className="text-day-text-secondary dark:text-night-text-secondary">
                            Prep: {selectedMeal.prepTime}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Utensils className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
                          <span className="text-day-text-secondary dark:text-night-text-secondary">
                            Cook: {selectedMeal.cookTime}
                          </span>
                        </div>
                      </div>
                      <Badge variant="primary">
                        {selectedMeal.difficulty}
                      </Badge>
                    </div>

                    {/* Ingredients */}
                    <div>
                      <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary mb-3 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                        Ingredients
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedMeal.ingredients.map((ingredient, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-day-hover dark:bg-night-hover rounded-lg">
                            <div className="w-2 h-2 bg-day-accent-primary dark:bg-night-accent rounded-full"></div>
                            <span className="text-day-text-primary dark:text-night-text-primary capitalize">
                              {ingredient}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary mb-3 flex items-center">
                        <Utensils className="w-5 h-5 mr-2 text-day-accent-primary dark:text-night-accent" />
                        Instructions
                      </h3>
                      <div className="space-y-3">
                        {selectedMeal.instructions.map((instruction, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-day-hover dark:bg-night-hover rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 bg-day-accent-primary dark:bg-night-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="text-day-text-primary dark:text-night-text-primary">
                              {instruction}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <Button variant="primary" fullWidth>
                        <Heart className="w-5 h-5 mr-2" />
                        Save Recipe
                      </Button>
                      <Button variant="ghost" fullWidth>
                        <Utensils className="w-5 h-5 mr-2" />
                        Start Cooking
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default MealSuggestions;
