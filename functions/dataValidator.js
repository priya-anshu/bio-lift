const { logger } = require("firebase-functions");

/**
 * Smart Ranking System Data Validator
 * 
 * This module validates and sanitizes all incoming user metrics data
 * to ensure data integrity and prevent processing errors.
 */

/**
 * Validate user metrics data
 * @param {Object} metrics - User metrics data to validate
 * @returns {Object} Validation result with isValid flag and data/errors
 */
function validateMetrics(metrics) {
  const errors = [];
  const sanitizedData = {};
  
  try {
    // Validate required fields and data types
    if (!metrics || typeof metrics !== 'object') {
      errors.push('Metrics data must be a valid object');
      return { isValid: false, errors, data: null };
    }
    
    // Strength metrics validation
    if (metrics.maxWeightLifted !== undefined) {
      const maxWeight = parseFloat(metrics.maxWeightLifted);
      if (isNaN(maxWeight) || maxWeight < 0 || maxWeight > 10000) {
        errors.push('maxWeightLifted must be a positive number between 0 and 10000');
      } else {
        sanitizedData.maxWeightLifted = maxWeight;
      }
    }
    
    if (metrics.oneRepMax !== undefined) {
      const oneRepMax = parseFloat(metrics.oneRepMax);
      if (isNaN(oneRepMax) || oneRepMax < 0 || oneRepMax > 10000) {
        errors.push('oneRepMax must be a positive number between 0 and 10000');
      } else {
        sanitizedData.oneRepMax = oneRepMax;
      }
    }
    
    if (metrics.totalWeightLifted !== undefined) {
      const totalWeight = parseFloat(metrics.totalWeightLifted);
      if (isNaN(totalWeight) || totalWeight < 0 || totalWeight > 1000000) {
        errors.push('totalWeightLifted must be a positive number between 0 and 1000000');
      } else {
        sanitizedData.totalWeightLifted = totalWeight;
      }
    }
    
    if (metrics.bodyWeight !== undefined) {
      const bodyWeight = parseFloat(metrics.bodyWeight);
      if (isNaN(bodyWeight) || bodyWeight < 20 || bodyWeight > 500) {
        errors.push('bodyWeight must be a positive number between 20 and 500 kg');
      } else {
        sanitizedData.bodyWeight = bodyWeight;
      }
    }
    
    // Stamina metrics validation
    if (metrics.workoutDuration !== undefined) {
      const duration = parseFloat(metrics.workoutDuration);
      if (isNaN(duration) || duration < 0 || duration > 1440) {
        errors.push('workoutDuration must be a positive number between 0 and 1440 minutes');
      } else {
        sanitizedData.workoutDuration = duration;
      }
    }
    
    if (metrics.cardioMinutes !== undefined) {
      const cardio = parseFloat(metrics.cardioMinutes);
      if (isNaN(cardio) || cardio < 0 || cardio > 1440) {
        errors.push('cardioMinutes must be a positive number between 0 and 1440 minutes');
      } else {
        sanitizedData.cardioMinutes = cardio;
      }
    }
    
    if (metrics.restTimeBetweenSets !== undefined) {
      const restTime = parseFloat(metrics.restTimeBetweenSets);
      if (isNaN(restTime) || restTime < 0 || restTime > 600) {
        errors.push('restTimeBetweenSets must be a positive number between 0 and 600 seconds');
      } else {
        sanitizedData.restTimeBetweenSets = restTime;
      }
    }
    
    if (metrics.maxHeartRate !== undefined) {
      const maxHR = parseFloat(metrics.maxHeartRate);
      if (isNaN(maxHR) || maxHR < 60 || maxHR > 220) {
        errors.push('maxHeartRate must be a positive number between 60 and 220 bpm');
      } else {
        sanitizedData.maxHeartRate = maxHR;
      }
    }
    
    // Heart rate data validation
    if (metrics.heartRateData !== undefined) {
      if (!Array.isArray(metrics.heartRateData)) {
        errors.push('heartRateData must be an array');
      } else {
        const validHeartRates = metrics.heartRateData.filter(hr => {
          const rate = parseFloat(hr);
          return !isNaN(rate) && rate >= 40 && rate <= 220;
        });
        
        if (validHeartRates.length !== metrics.heartRateData.length) {
          errors.push('heartRateData contains invalid heart rate values');
        } else {
          sanitizedData.heartRateData = validHeartRates;
        }
      }
    }
    
    // Consistency metrics validation
    if (metrics.workoutStreak !== undefined) {
      const streak = parseInt(metrics.workoutStreak);
      if (isNaN(streak) || streak < 0 || streak > 10000) {
        errors.push('workoutStreak must be a positive integer between 0 and 10000');
      } else {
        sanitizedData.workoutStreak = streak;
      }
    }
    
    if (metrics.totalWorkouts !== undefined) {
      const total = parseInt(metrics.totalWorkouts);
      if (isNaN(total) || total < 0 || total > 100000) {
        errors.push('totalWorkouts must be a positive integer between 0 and 100000');
      } else {
        sanitizedData.totalWorkouts = total;
      }
    }
    
    if (metrics.daysSinceStart !== undefined) {
      const days = parseInt(metrics.daysSinceStart);
      if (isNaN(days) || days < 0 || days > 36500) { // Max 100 years
        errors.push('daysSinceStart must be a positive integer between 0 and 36500');
      } else {
        sanitizedData.daysSinceStart = days;
      }
    }
    
    if (metrics.missedWorkouts !== undefined) {
      const missed = parseInt(metrics.missedWorkouts);
      if (isNaN(missed) || missed < 0 || missed > 100000) {
        errors.push('missedWorkouts must be a positive integer between 0 and 100000');
      } else {
        sanitizedData.missedWorkouts = missed;
      }
    }
    
    if (metrics.workoutFrequency !== undefined) {
      const frequency = parseFloat(metrics.workoutFrequency);
      if (isNaN(frequency) || frequency < 0 || frequency > 7) {
        errors.push('workoutFrequency must be a positive number between 0 and 7 workouts per week');
      } else {
        sanitizedData.workoutFrequency = frequency;
      }
    }
    
    // Date validation
    if (metrics.lastWorkoutDate !== undefined) {
      const workoutDate = new Date(metrics.lastWorkoutDate);
      if (isNaN(workoutDate.getTime())) {
        errors.push('lastWorkoutDate must be a valid date');
      } else {
        // Check if date is not in the future
        if (workoutDate > new Date()) {
          errors.push('lastWorkoutDate cannot be in the future');
        } else {
          sanitizedData.lastWorkoutDate = workoutDate;
        }
      }
    }
    
    // Array validations
    if (metrics.strengthExercises !== undefined) {
      if (!Array.isArray(metrics.strengthExercises)) {
        errors.push('strengthExercises must be an array');
      } else {
        sanitizedData.strengthExercises = metrics.strengthExercises.filter(exercise => 
          typeof exercise === 'string' && exercise.trim().length > 0
        );
      }
    }
    
    if (metrics.enduranceExercises !== undefined) {
      if (!Array.isArray(metrics.enduranceExercises)) {
        errors.push('enduranceExercises must be an array');
      } else {
        sanitizedData.enduranceExercises = metrics.enduranceExercises.filter(exercise => 
          typeof exercise === 'string' && exercise.trim().length > 0
        );
      }
    }
    
    // Additional metrics validation
    if (metrics.caloriesBurned !== undefined) {
      const calories = parseFloat(metrics.caloriesBurned);
      if (isNaN(calories) || calories < 0 || calories > 10000) {
        errors.push('caloriesBurned must be a positive number between 0 and 10000');
      } else {
        sanitizedData.caloriesBurned = calories;
      }
    }
    
    if (metrics.workoutIntensity !== undefined) {
      const intensity = parseFloat(metrics.workoutIntensity);
      if (isNaN(intensity) || intensity < 0 || intensity > 10) {
        errors.push('workoutIntensity must be a positive number between 0 and 10');
      } else {
        sanitizedData.workoutIntensity = intensity;
      }
    }
    
    if (metrics.workoutSatisfaction !== undefined) {
      const satisfaction = parseFloat(metrics.workoutSatisfaction);
      if (isNaN(satisfaction) || satisfaction < 0 || satisfaction > 10) {
        errors.push('workoutSatisfaction must be a positive number between 0 and 10');
      } else {
        sanitizedData.workoutSatisfaction = satisfaction;
      }
    }
    
    // Custom metrics validation
    if (metrics.customMetrics !== undefined) {
      if (typeof metrics.customMetrics !== 'object' || Array.isArray(metrics.customMetrics)) {
        errors.push('customMetrics must be an object');
      } else {
        const validCustomMetrics = {};
        for (const [key, value] of Object.entries(metrics.customMetrics)) {
          if (typeof key === 'string' && key.trim().length > 0) {
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue >= 0) {
              validCustomMetrics[key.trim()] = numValue;
            }
          }
        }
        sanitizedData.customMetrics = validCustomMetrics;
      }
    }
    
    // Timestamp validation
    if (metrics.timestamp !== undefined) {
      const timestamp = new Date(metrics.timestamp);
      if (isNaN(timestamp.getTime())) {
        errors.push('timestamp must be a valid date');
      } else {
        sanitizedData.timestamp = timestamp;
      }
    } else {
      // Add current timestamp if not provided
      sanitizedData.timestamp = new Date();
    }
    
    // User ID validation
    if (metrics.userId !== undefined) {
      if (typeof metrics.userId !== 'string' || metrics.userId.trim().length === 0) {
        errors.push('userId must be a non-empty string');
      } else {
        sanitizedData.userId = metrics.userId.trim();
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors,
      data: sanitizedData
    };
    
  } catch (error) {
    logger.error('Error during metrics validation:', error);
    return {
      isValid: false,
      errors: ['Internal validation error'],
      data: null
    };
  }
}

/**
 * Sanitize data for storage
 * @param {Object} data - Data to sanitize
 * @returns {Object} Sanitized data
 */
function sanitizeData(data) {
  if (!data || typeof data !== 'object') {
    return {};
  }
  
  const sanitized = {};
  
  // Remove null/undefined values
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) {
      sanitized[key] = value;
    }
  }
  
  // Ensure required fields have default values
  if (!sanitized.timestamp) {
    sanitized.timestamp = new Date();
  }
  
  return sanitized;
}

/**
 * Validate ranking weights
 * @param {Object} weights - Weights to validate
 * @returns {Object} Validation result
 */
function validateWeights(weights) {
  const errors = [];
  
  if (!weights || typeof weights !== 'object') {
    errors.push('Weights must be a valid object');
    return { isValid: false, errors };
  }
  
  const requiredWeights = ['strength', 'stamina', 'consistency', 'improvement'];
  
  for (const weight of requiredWeights) {
    if (weights[weight] === undefined) {
      errors.push(`Missing required weight: ${weight}`);
    } else {
      const weightValue = parseFloat(weights[weight]);
      if (isNaN(weightValue) || weightValue < 0 || weightValue > 1) {
        errors.push(`${weight} weight must be a number between 0 and 1`);
      }
    }
  }
  
  // Check if weights sum to approximately 1
  const totalWeight = requiredWeights.reduce((sum, weight) => {
    return sum + (parseFloat(weights[weight]) || 0);
  }, 0);
  
  if (Math.abs(totalWeight - 1) > 0.01) {
    errors.push('Weights must sum to 1.0');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validate user ID format
 * @param {string} userId - User ID to validate
 * @returns {Object} Validation result
 */
function validateUserId(userId) {
  const errors = [];
  
  if (!userId || typeof userId !== 'string') {
    errors.push('User ID must be a non-empty string');
  } else if (userId.trim().length === 0) {
    errors.push('User ID cannot be empty');
  } else if (userId.length > 128) {
    errors.push('User ID cannot exceed 128 characters');
  } else if (!/^[a-zA-Z0-9_-]+$/.test(userId)) {
    errors.push('User ID can only contain letters, numbers, underscores, and hyphens');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    data: userId ? userId.trim() : null
  };
}

/**
 * Validate pagination parameters
 * @param {Object} params - Pagination parameters
 * @returns {Object} Validation result
 */
function validatePagination(params) {
  const errors = [];
  const sanitized = {};
  
  if (params.limit !== undefined) {
    const limit = parseInt(params.limit);
    if (isNaN(limit) || limit < 1 || limit > 1000) {
      errors.push('Limit must be a positive integer between 1 and 1000');
    } else {
      sanitized.limit = limit;
    }
  } else {
    sanitized.limit = 50; // Default limit
  }
  
  if (params.offset !== undefined) {
    const offset = parseInt(params.offset);
    if (isNaN(offset) || offset < 0) {
      errors.push('Offset must be a non-negative integer');
    } else {
      sanitized.offset = offset;
    }
  } else {
    sanitized.offset = 0; // Default offset
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    data: sanitized
  };
}

/**
 * Validate date range parameters
 * @param {Object} params - Date range parameters
 * @returns {Object} Validation result
 */
function validateDateRange(params) {
  const errors = [];
  const sanitized = {};
  
  if (params.startDate !== undefined) {
    const startDate = new Date(params.startDate);
    if (isNaN(startDate.getTime())) {
      errors.push('startDate must be a valid date');
    } else {
      sanitized.startDate = startDate;
    }
  }
  
  if (params.endDate !== undefined) {
    const endDate = new Date(params.endDate);
    if (isNaN(endDate.getTime())) {
      errors.push('endDate must be a valid date');
    } else {
      sanitized.endDate = endDate;
    }
  }
  
  // Check if startDate is before endDate
  if (sanitized.startDate && sanitized.endDate && sanitized.startDate > sanitized.endDate) {
    errors.push('startDate must be before endDate');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    data: sanitized
  };
}

module.exports = {
  validateMetrics,
  sanitizeData,
  validateWeights,
  validateUserId,
  validatePagination,
  validateDateRange
};
