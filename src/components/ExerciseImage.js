import React, { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';

const ExerciseImage = ({ exerciseName, className = "", showFallback = true, animate = true, animationSpeed = 2000, isStatic = false }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Import the image dynamically
  const getImagePaths = (name) => {
    const exerciseNameMapping = {
      // Basic exercises
      'Push-ups': 'Push-Up_Wide',
      'Push-Ups': 'Push-Up_Wide',
      'Dumbbell Rows': 'Bent_Over_Two-Dumbbell_Row',
      'Dumbbell Row': 'Bent_Over_Two-Dumbbell_Row',
      'Shoulder Press': 'Dumbbell_Shoulder_Press',
      'Shoulder Presses': 'Dumbbell_Shoulder_Press',
      'Bicep Curls': 'Dumbbell_Bicep_Curl',
      'Bicep Curl': 'Dumbbell_Bicep_Curl',
      
      // Barbell exercises
      'Barbell Deadlift': 'Barbell_Deadlift',
      'Barbell Squat': 'Barbell_Squat',
      'Bench Press': 'Barbell_Bench_Press_-_Medium_Grip',
      'Barbell Bench Press': 'Barbell_Bench_Press_-_Medium_Grip',
      'Barbell Curl': 'Barbell_Curl',
      'Barbell Row': 'Bent_Over_Barbell_Row',
      'Barbell Shoulder Press': 'Barbell_Shoulder_Press',
      'Barbell Lunge': 'Barbell_Lunge',
      
      // Bodyweight exercises
      'Pull-ups': 'Pull-Up',
      'Pull-Ups': 'Pull-Up',
      'Pull Up': 'Pull-Up',
      'Lunges': 'Barbell_Lunge',
      'Planks': 'Plank',
      'Plank': 'Plank',
      'Squats': 'Barbell_Squat',
      'Squat': 'Barbell_Squat',
      'Deadlifts': 'Barbell_Deadlift',
      'Deadlift': 'Barbell_Deadlift',
      
      // Cable exercises
      'Cable Crossover': 'Cable_Crossover',
      'Cable Crunch': 'Cable_Crunch',
      'Cable Row': 'Cable_Row',
      'Cable Press': 'Cable_Chest_Press',
      
      // Machine exercises
      'Lat Pulldown': 'Wide-Grip_Lat_Pulldown',
      'Leg Press': 'Leg_Press',
      'Chest Press Machine': 'Machine_Chest_Press',
      
      // Dumbbell variations
      'Dumbbell Press': 'Dumbbell_Bench_Press',
      'Dumbbell Flyes': 'Dumbbell_Flyes',
      'Dumbbell Lateral Raise': 'Dumbbell_Lateral_Raise',
      'Dumbbell Tricep Extension': 'Dumbbell_Tricep_Extension',
    };

    const directoryName = exerciseNameMapping[name];
    if (!directoryName) return null;
    
    // Return both image paths for animation
    return {
      image0: `/exercises/${directoryName}/0.jpg`,
      image1: `/exercises/${directoryName}/1.jpg`
    };
  };

  const imagePaths = getImagePaths(exerciseName);
  
  // If isStatic is true, always use image0 (initial position)
  // If isStatic is false, use the animated swapping
  const currentImagePath = imagePaths ? (isStatic ? imagePaths.image0 : imagePaths[`image${currentImageIndex}`]) : null;

  // Animation effect - swap between images (only when not static)
  useEffect(() => {
    if (isStatic || !animate || !imagePaths) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex === 0 ? 1 : 0));
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [isStatic, animate, imagePaths, animationSpeed]);

  if (!imagePaths) {
    return showFallback ? (
      <div className={`flex items-center justify-center bg-gradient-to-br from-day-accent-primary/10 to-day-accent-secondary/10 dark:from-night-accent/10 dark:to-red-600/10 ${className}`}>
        <div className="text-center">
          <Dumbbell className="w-8 h-8 text-day-accent-primary dark:text-night-accent mx-auto mb-2" />
          <p className="text-xs text-day-text-secondary dark:text-night-text-secondary">
            {exerciseName}
          </p>
        </div>
      </div>
    ) : null;
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-day-hover dark:bg-night-hover">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-day-accent-primary dark:border-night-accent"></div>
        </div>
      )}
      
      {!imageError ? (
        <img
          src={currentImagePath}
          alt={`${exerciseName}${isStatic ? '' : ` - Position ${currentImageIndex + 1}`}`}
          className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
        />
      ) : null}
      
      {imageError && showFallback && (
        <div className="flex items-center justify-center bg-gradient-to-br from-day-accent-primary/10 to-day-accent-secondary/10 dark:from-night-accent/10 dark:to-red-600/10 w-full h-full">
          <div className="text-center">
            <Dumbbell className="w-8 h-8 text-day-accent-primary dark:text-night-accent mx-auto mb-2" />
            <p className="text-xs text-day-text-secondary dark:text-night-text-secondary">
              {exerciseName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseImage;
