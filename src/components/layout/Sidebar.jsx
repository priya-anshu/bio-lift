import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  X,
  Home,
  Dumbbell,
  Trophy,
  Apple,
  User,
  TrendingUp,
  Target,
  Calendar,
  Settings,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';

const Sidebar = ({ onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Workout', href: '/workout', icon: Dumbbell },
    { name: 'Ranking', href: '/ranking', icon: Trophy },
    { name: 'Progress', href: '/track-progress', icon: TrendingUp },
    { name: 'Diet', href: '/diet', icon: Apple },
    { name: 'Social', href: '/social', icon: Users },
    { name: 'Shop', href: '/shop', icon: TrendingUp },
    { name: 'Profile', href: '/profile', icon: User }
  ];

  const quickActions = [
    { name: 'Progress', icon: TrendingUp, href: '/progress' },
    { name: 'Goals', icon: Target, href: '/goals' },
    { name: 'Schedule', icon: Calendar, href: '/schedule' },
    { name: 'Settings', icon: Settings, href: '/settings' }
  ];

  return (
    <>
      {/* Mobile overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-64 bg-day-card dark:bg-night-card border-r border-day-border dark:border-night-border z-50 lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-day-border dark:border-night-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-day-accent-primary to-day-accent-secondary dark:from-night-accent dark:to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold font-orbitron text-gradient">
                Biolift
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-day-hover dark:hover:bg-night-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-6 border-b border-day-border dark:border-night-border">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-day-text-primary dark:text-night-text-primary truncate">
                    {user.name}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="primary" size="sm">
                      {user.rank}
                    </Badge>
                    <Badge variant="ghost" size="sm">
                      {user.membership}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-day-text-secondary dark:text-night-text-secondary">
                    Level
                  </span>
                  <span className="font-medium text-day-text-primary dark:text-night-text-primary">
                    {user.level}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-day-text-secondary dark:text-night-text-secondary">
                    Points
                  </span>
                  <span className="font-medium text-day-text-primary dark:text-night-text-primary">
                    {(user.points ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            <h3 className="text-xs font-semibold text-day-text-secondary dark:text-night-text-secondary uppercase tracking-wider mb-4">
              Navigation
            </h3>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-day-accent-primary dark:text-night-accent bg-day-hover dark:bg-night-hover'
                      : 'text-day-text-secondary dark:text-night-text-secondary hover:text-day-text-primary dark:hover:text-night-text-primary hover:bg-day-hover dark:hover:bg-night-hover'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="p-6 border-t border-day-border dark:border-night-border">
            <h3 className="text-xs font-semibold text-day-text-secondary dark:text-night-text-secondary uppercase tracking-wider mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className="flex flex-col items-center p-3 rounded-lg text-center hover:bg-day-hover dark:hover:bg-night-hover transition-colors"
                  >
                    <Icon className="w-5 h-5 mb-1 text-day-text-secondary dark:text-night-text-secondary" />
                    <span className="text-xs font-medium text-day-text-secondary dark:text-night-text-secondary">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar; 