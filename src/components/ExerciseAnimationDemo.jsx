import React, { useState } from 'react';
import ExerciseImage from './ExerciseImage';
import Card from './ui/Card';
import Button from './ui/Button';
import { Play, Pause, RotateCcw } from 'lucide-react';

const ExerciseAnimationDemo = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(2000);

  const demoExercises = [
    'Push-ups',
    'Dumbbell Rows', 
    'Shoulder Press',
    'Bicep Curls'
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary mb-2">
          Exercise Animation Demo
        </h1>
        <p className="text-day-text-secondary dark:text-night-text-secondary">
          Watch how exercise images animate between initial and final positions
        </p>
      </div>

      {/* Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Button
            variant={isAnimating ? "primary" : "ghost"}
            onClick={() => setIsAnimating(!isAnimating)}
          >
            {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAnimating ? 'Pause Animation' : 'Start Animation'}
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => setAnimationSpeed(2000)}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Speed
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-day-text-secondary dark:text-night-text-secondary">
            Animation Speed:
          </span>
          <input
            type="range"
            min="500"
            max="5000"
            step="500"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-day-text-primary dark:text-night-text-primary min-w-[60px]">
            {animationSpeed}ms
          </span>
        </div>
      </Card>

             {/* Exercise Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {demoExercises.map((exercise, index) => (
           <Card key={index} className="p-6">
             <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary mb-4">
               {exercise}
             </h3>
             <div className="aspect-video rounded-lg overflow-hidden mb-4">
               <ExerciseImage 
                 exerciseName={exercise}
                 className="w-full h-full rounded-lg"
                 showFallback={true}
                 animate={isAnimating}
                 animationSpeed={animationSpeed}
               />
             </div>
             <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
               This animation shows the exercise movement from initial position (0.jpg) to final position (1.jpg), 
               creating a GIF-like effect to help users understand the exercise form.
             </p>
           </Card>
         ))}
       </div>

       {/* Static vs Animated Comparison */}
       <Card className="p-6">
         <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary mb-4">
           Static vs Animated Comparison
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <h4 className="font-medium text-day-text-primary dark:text-night-text-primary mb-2">
               Static Image (Exercise List)
             </h4>
             <div className="w-32 h-32 rounded-lg overflow-hidden bg-day-border dark:bg-night-border mx-auto">
               <ExerciseImage 
                 exerciseName="Push-ups"
                 className="w-full h-full"
                 showFallback={true}
                 isStatic={true}
               />
             </div>
             <p className="text-sm text-day-text-secondary dark:text-night-text-secondary text-center mt-2">
               Shows only 0.jpg (initial position)
             </p>
           </div>
           <div>
             <h4 className="font-medium text-day-text-primary dark:text-night-text-primary mb-2">
               Animated Image (Main Display)
             </h4>
             <div className="w-32 h-32 rounded-lg overflow-hidden bg-day-border dark:bg-night-border mx-auto">
               <ExerciseImage 
                 exerciseName="Push-ups"
                 className="w-full h-full"
                 showFallback={true}
                 animate={isAnimating}
                 animationSpeed={animationSpeed}
               />
             </div>
             <p className="text-sm text-day-text-secondary dark:text-night-text-secondary text-center mt-2">
               Swaps between 0.jpg and 1.jpg
             </p>
           </div>
         </div>
       </Card>

      {/* Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary mb-4">
          How It Works
        </h3>
                 <div className="space-y-3 text-day-text-secondary dark:text-night-text-secondary">
           <p>
             • Each exercise has two images: <strong>0.jpg</strong> (initial position) and <strong>1.jpg</strong> (final position)
           </p>
           <p>
             • The animation automatically swaps between these images at the specified interval
           </p>
           <p>
             • This creates a smooth transition effect that mimics a GIF, showing the exercise movement
           </p>
           <p>
             • Users can control animation speed and pause/resume the animation
           </p>
           <p>
             • The animation helps users understand proper exercise form and movement patterns
           </p>
           <p>
             • <strong>Main Display:</strong> Shows animated images (0.jpg ↔ 1.jpg) for better exercise understanding
           </p>
           <p>
             • <strong>Exercise List:</strong> Shows static images (only 0.jpg) for quick identification without distraction
           </p>
         </div>
      </Card>
    </div>
  );
};

export default ExerciseAnimationDemo;
