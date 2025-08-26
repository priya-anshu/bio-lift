import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Input = forwardRef(({
  label,
  error,
  success,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  fullWidth = true,
  size = 'md',
  ...props
}, ref) => {
  const baseClasses = 'w-full border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const states = {
    default: 'bg-day-card dark:bg-night-card border-day-border dark:border-night-border text-day-text-primary dark:text-night-text-primary placeholder-day-text-secondary dark:placeholder-night-text-secondary focus:ring-day-accent-primary dark:focus:ring-night-accent',
    error: 'bg-day-card dark:bg-night-card border-red-500 text-day-text-primary dark:text-night-text-primary focus:ring-red-500',
    success: 'bg-day-card dark:bg-night-card border-green-500 text-day-text-primary dark:text-night-text-primary focus:ring-green-500'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };
  
  const getStateClass = () => {
    if (error) return states.error;
    if (success) return states.success;
    return states.default;
  };
  
  const classes = clsx(
    baseClasses,
    getStateClass(),
    sizes[size],
    icon && iconPosition === 'left' && 'pl-10',
    icon && iconPosition === 'right' && 'pr-10',
    fullWidth && 'w-full',
    className
  );
  
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={clsx('space-y-1', fullWidth && 'w-full')}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-day-text-secondary dark:text-night-text-secondary">
              {icon}
            </span>
          </div>
        )}
        
        <motion.input
          ref={ref}
          id={inputId}
          className={classes}
          disabled={disabled || loading}
          {...props}
          whileFocus={{ scale: 1.01 }}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-day-text-secondary dark:text-night-text-secondary">
              {icon}
            </span>
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-day-accent-primary dark:border-night-accent border-t-transparent rounded-full"
            />
          </div>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
      
      {success && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-green-500"
        >
          {success}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 