import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Sun, 
  Moon, 
  Bell, 
  User,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Header = ({ onMenuClick }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Workout', href: '/workout' },
    { name: 'Ranking', href: '/ranking' },
    { name: 'Progress', href: '/track-progress' },
    { name: 'Diet', href: '/diet' },
    { name: 'Social', href: '/social' },
    { name: 'Shop', href: '/shop' },
    { name: 'Profile', href: '/profile' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-day-card dark:bg-night-card border-b border-day-border dark:border-night-border backdrop-blur-sm">
      <div className="px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left side - Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-day-hover dark:hover:bg-night-hover transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-day-accent-primary to-day-accent-secondary dark:from-night-accent dark:to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm lg:text-lg">B</span>
              </div>
              <span className="text-xl lg:text-2xl font-bold font-orbitron text-gradient">
                Biolift
              </span>
            </Link>
          </div>

          {/* Center - Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-day-accent-primary dark:text-night-accent bg-day-hover dark:bg-night-hover'
                    : 'text-day-text-secondary dark:text-night-text-secondary hover:text-day-text-primary dark:hover:text-night-text-primary hover:bg-day-hover dark:hover:bg-night-hover'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-day-hover dark:hover:bg-night-hover transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-day-hover dark:hover:bg-night-hover transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </motion.button>

            {/* User Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-day-hover dark:hover:bg-night-hover transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="hidden md:block text-sm font-medium">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-day-card dark:bg-night-card border border-day-border dark:border-night-border rounded-lg shadow-lg py-2"
                    >
                      <div className="px-4 py-2 border-b border-day-border dark:border-night-border">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-day-text-secondary dark:text-night-text-secondary">
                          {user.email}
                        </p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm hover:bg-day-hover dark:hover:bg-night-hover transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      
                      <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-day-hover dark:hover:bg-night-hover transition-colors">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </button>
                      
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 