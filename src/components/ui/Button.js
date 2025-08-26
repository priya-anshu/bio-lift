import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-day-accent-primary dark:bg-night-accent text-white hover:shadow-glow-blue dark:hover:shadow-glow focus:ring-day-accent-primary dark:focus:ring-night-accent',
    secondary: 'bg-day-accent-secondary text-white hover:shadow-glow focus:ring-day-accent-secondary',
    ghost: 'bg-transparent border border-day-border dark:border-night-border text-day-text-primary dark:text-night-text-primary hover:bg-day-hover dark:hover:bg-night-hover',
    outline: 'bg-transparent border-2 border-day-accent-primary dark:border-night-accent text-day-accent-primary dark:text-night-accent hover:bg-day-accent-primary dark:hover:bg-night-accent hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };
  
  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  );
  
  const buttonContent = (
    <>
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
        />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button; 