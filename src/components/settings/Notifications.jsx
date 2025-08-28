import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  Trophy, 
  Target,
  Users,
  Zap,
  Clock,
  Settings
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const Notifications = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    // General Notifications
    general: {
      appUpdates: true,
      newFeatures: true,
      maintenanceAlerts: false
    },
    
    // Workout Notifications
    workouts: {
      workoutReminders: true,
      restDayReminders: true,
      streakAlerts: true,
      goalAchievements: true,
      weeklyProgress: true
    },
    
    // Social Notifications
    social: {
      friendRequests: true,
      friendWorkouts: false,
      challenges: true,
      leaderboardUpdates: true,
      communityEvents: false
    },
    
    // Achievement Notifications
    achievements: {
      newBadges: true,
      levelUps: true,
      milestoneReached: true,
      rankingChanges: true
    },
    
    // Communication Notifications
    communication: {
      directMessages: true,
      groupChats: true,
      mentions: true,
      comments: false
    }
  });

  const [deliveryPreferences, setDeliveryPreferences] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true
  });

  const [quietHours, setQuietHours] = useState({
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
    timezone: 'Asia/Kolkata'
  });

  const handleNotificationChange = (category, setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleDeliveryChange = (setting, value) => {
    setDeliveryPreferences(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleQuietHoursChange = (setting, value) => {
    setQuietHours(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const toggleAllInCategory = (category, value) => {
    const categorySettings = notificationSettings[category];
    const newSettings = {};
    
    Object.keys(categorySettings).forEach(key => {
      newSettings[key] = value;
    });

    setNotificationSettings(prev => ({
      ...prev,
      [category]: newSettings
    }));
  };

  const getNotificationCount = (category) => {
    return Object.values(notificationSettings[category]).filter(Boolean).length;
  };

  const getTotalNotificationCount = () => {
    return Object.keys(notificationSettings).reduce((total, category) => {
      return total + getNotificationCount(category);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-2">
          <Bell className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
            Notifications
          </h2>
        </div>
        <p className="text-day-text-secondary dark:text-night-text-secondary">
          Manage your notification preferences and delivery methods
        </p>
      </motion.div>

      {/* Notification Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-day-text-primary dark:text-night-text-primary">
                    Notification Summary
                  </h3>
                  <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                    {getTotalNotificationCount()} notifications enabled
                  </p>
                </div>
              </div>
              <Badge variant="primary" size="lg">
                {getTotalNotificationCount()}/25
              </Badge>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Delivery Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Delivery Preferences
              </h3>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-black rounded-lg">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-day-text-primary dark:text-night-text-primary">
                    Push Notifications
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliveryPreferences.pushNotifications}
                    onChange={(e) => handleDeliveryChange('pushNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-black rounded-lg">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-day-text-primary dark:text-night-text-primary">
                    Email Notifications
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliveryPreferences.emailNotifications}
                    onChange={(e) => handleDeliveryChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-black rounded-lg">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-day-text-primary dark:text-night-text-primary">
                    SMS Notifications
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliveryPreferences.smsNotifications}
                    onChange={(e) => handleDeliveryChange('smsNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-black rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-day-text-primary dark:text-night-text-primary">
                    In-App Notifications
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliveryPreferences.inAppNotifications}
                    onChange={(e) => handleDeliveryChange('inAppNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Notification Categories */}
      <div className="space-y-6">
        {/* Workout Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                    Workout Notifications
                  </h3>
                  <Badge variant="primary" size="sm">
                    {getNotificationCount('workouts')}/5
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllInCategory('workouts', true)}
                  >
                    Enable All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllInCategory('workouts', false)}
                  >
                    Disable All
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {Object.entries(notificationSettings.workouts).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-day-text-primary dark:text-night-text-primary capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNotificationChange('workouts', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Social Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                    Social Notifications
                  </h3>
                  <Badge variant="primary" size="sm">
                    {getNotificationCount('social')}/5
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllInCategory('social', true)}
                  >
                    Enable All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllInCategory('social', false)}
                  >
                    Disable All
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {Object.entries(notificationSettings.social).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-day-text-primary dark:text-night-text-primary capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNotificationChange('social', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Achievement Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                    Achievement Notifications
                  </h3>
                  <Badge variant="primary" size="sm">
                    {getNotificationCount('achievements')}/4
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllInCategory('achievements', true)}
                  >
                    Enable All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllInCategory('achievements', false)}
                  >
                    Disable All
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {Object.entries(notificationSettings.achievements).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-day-text-primary dark:text-night-text-primary capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNotificationChange('achievements', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </div>

      {/* Quiet Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Quiet Hours
              </h3>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-day-text-primary dark:text-night-text-primary">
                  Enable quiet hours
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quietHours.enabled}
                    onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {quietHours.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={quietHours.startTime}
                      onChange={(e) => handleQuietHoursChange('startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-day-border dark:border-night-border rounded-md focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={quietHours.endTime}
                      onChange={(e) => handleQuietHoursChange('endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-day-border dark:border-night-border rounded-md focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                      Timezone
                    </label>
                    <select
                      value={quietHours.timezone}
                      onChange={(e) => handleQuietHoursChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-day-border dark:border-night-border rounded-md focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex justify-end"
      >
        <Button variant="primary" size="lg">
          Save Notification Preferences
        </Button>
      </motion.div>
    </div>
  );
};

export default Notifications;
