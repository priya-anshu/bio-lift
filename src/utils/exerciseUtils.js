// Exercise name mapping to directory names
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
  
  // Add more mappings as needed
};

// Function to get exercise image paths
export const getExerciseImagePaths = (exerciseName) => {
  const directoryName = exerciseNameMapping[exerciseName];
  if (!directoryName) {
    return null; // Return null if no mapping found
  }
  
  // Return both image paths for animation
  return {
    image0: `/exercises/${directoryName}/0.jpg`,
    image1: `/exercises/${directoryName}/1.jpg`
  };
};

// Function to get exercise image path (backward compatibility)
export const getExerciseImage = (exerciseName) => {
  const paths = getExerciseImagePaths(exerciseName);
  return paths ? paths.image0 : null;
};

// Function to check if exercise image exists
export const checkExerciseImageExists = async (exerciseName) => {
  const imagePath = getExerciseImage(exerciseName);
  if (!imagePath) return false;
  
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Function to get exercise data
export const getExerciseData = async (exerciseName) => {
  const directoryName = exerciseNameMapping[exerciseName];
  if (!directoryName) {
    return null;
  }
  
  try {
    // Try to fetch from public directory first
    const response = await fetch(`/exercises/${directoryName}.json`);
    if (response.ok) {
      return await response.json();
    }
    
    // Fallback to import if fetch fails
    const importedData = await import(`../exercises/${directoryName}.json`);
    return importedData.default;
  } catch (error) {
    console.error(`Error loading exercise data for ${exerciseName}:`, error);
    return null;
  }
};

// Function to get all available exercise images
export const getAllExerciseImages = () => {
  return Object.entries(exerciseNameMapping).map(([displayName, directoryName]) => ({
    displayName,
    directoryName,
    imagePaths: {
      image0: `/exercises/${directoryName}/0.jpg`,
      image1: `/exercises/${directoryName}/1.jpg`
    }
  }));
};
