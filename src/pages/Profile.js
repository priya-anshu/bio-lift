import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Crown, 
  Calendar,
  Target,
  Award,
  Edit,
  Camera,
  Shield,
  CreditCard,
  Bell,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

// Import settings sub-modules
import PrivacySecurity from '../components/settings/PrivacySecurity';
import Notifications from '../components/settings/Notifications';
import BillingPayment from '../components/settings/BillingPayment';
import LanguageRegion from '../components/settings/LanguageRegion';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSettings, setActiveSettings] = useState(null);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Fitness enthusiast passionate about health and wellness'
  });

  const stats = [
    { label: 'Workouts Completed', value: '127', icon: Target },
    { label: 'Days Active', value: '45', icon: Calendar },
    { label: 'Achievements', value: '23', icon: Award },
    { label: 'Current Streak', value: '7', icon: Award }
  ];

  const membershipTiers = [
    {
      name: 'Free',
      price: '$0',
      features: ['Basic workout plans', 'Progress tracking', 'Community access'],
      current: user?.membership === 'free'
    },
    {
      name: 'Premium',
      price: '$9.99/month',
      features: ['AI-powered plans', 'Advanced analytics', 'Personal trainer', 'Priority support'],
      current: user?.membership === 'premium'
    },
    {
      name: 'Elite',
      price: '$19.99/month',
      features: ['Everything in Premium', '1-on-1 coaching', 'Custom meal plans', 'Exclusive content'],
      current: user?.membership === 'elite'
    }
  ];

  const recentAchievements = [
    { name: 'Streak Master', description: '7 day workout streak', date: '2 days ago', icon: Award },
    { name: 'Goal Crusher', description: 'Hit 3 monthly goals', date: '1 week ago', icon: Target },
    { name: 'Energy Boost', description: 'Burned 2000+ calories', date: '2 weeks ago', icon: Award }
  ];

  const handleSave = () => {
    updateUser(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      bio: 'Fitness enthusiast passionate about health and wellness'
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary mb-2">
          Profile
        </h1>
        <p className="text-day-text-secondary dark:text-night-text-secondary">
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-day-accent-primary dark:bg-night-accent rounded-full flex items-center justify-center text-white hover:bg-day-accent-primary/80 dark:hover:bg-night-accent/80 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                  {user?.name}
                </h2>
                <Badge variant="primary">
                  {user?.rank}
                </Badge>
                {user?.membership === 'premium' && (
                  <Crown className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              
              <p className="text-day-text-secondary dark:text-night-text-secondary mb-3">
                {editData.bio}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-day-text-secondary dark:text-night-text-secondary">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {user?.joinDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{user?.level} level</span>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 text-center">
              <Icon className="w-6 h-6 text-day-accent-primary dark:text-night-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                {stat.label}
              </div>
            </Card>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <Card.Header>
              <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Personal Information
              </h3>
            </Card.Header>
            <Card.Body>
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                  <Input
                    label="Bio"
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  />
                  <div className="flex space-x-3">
                    <Button variant="primary" onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button variant="ghost" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-day-text-secondary dark:text-night-text-secondary">
                      Full Name
                    </label>
                    <p className="text-day-text-primary dark:text-night-text-primary">
                      {user?.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-day-text-secondary dark:text-night-text-secondary">
                      Email
                    </label>
                    <p className="text-day-text-primary dark:text-night-text-primary">
                      {user?.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-day-text-secondary dark:text-night-text-secondary">
                      Bio
                    </label>
                    <p className="text-day-text-primary dark:text-night-text-primary">
                      {editData.bio}
                    </p>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.div>

        {/* Membership */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                  Membership
                </h3>
                <Crown className="w-5 h-5 text-yellow-500" />
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {membershipTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      tier.current
                        ? 'border-day-accent-primary dark:border-night-accent bg-day-accent-primary/5 dark:bg-night-accent/5'
                        : 'border-day-border dark:border-night-border hover:border-day-accent-primary/50 dark:hover:border-night-accent/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-day-text-primary dark:text-night-text-primary">
                        {tier.name}
                      </h4>
                      <div className="text-right">
                        <div className="font-bold text-day-text-primary dark:text-night-text-primary">
                          {tier.price}
                        </div>
                        {tier.current && (
                          <Badge variant="primary" size="sm">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ul className="space-y-1 mb-3">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="text-sm text-day-text-secondary dark:text-night-text-secondary flex items-center">
                          <div className="w-1 h-1 bg-day-accent-primary dark:bg-night-accent rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {!tier.current && (
                      <Button variant="primary" size="sm" fullWidth>
                        Upgrade
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </div>

      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <Card.Header>
            <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
              Recent Achievements
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {recentAchievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-day-hover dark:hover:bg-night-hover transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-day-accent-primary to-day-accent-secondary dark:from-night-accent dark:to-red-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-day-text-primary dark:text-night-text-primary">
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                      {achievement.date}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <Card.Header>
            <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
              Settings
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="ghost" 
                className="justify-start h-12"
                onClick={() => setActiveSettings('privacy')}
              >
                <Shield className="w-5 h-5 mr-3" />
                Privacy & Security
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start h-12"
                onClick={() => setActiveSettings('notifications')}
              >
                <Bell className="w-5 h-5 mr-3" />
                Notifications
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start h-12"
                onClick={() => setActiveSettings('billing')}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                Billing & Payment
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start h-12"
                onClick={() => setActiveSettings('language')}
              >
                <Globe className="w-5 h-5 mr-3" />
                Language & Region
              </Button>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Settings Sub-Modules */}
      {activeSettings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveSettings(null)}
        >
          <div 
            className="bg-white dark:bg-black rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-black border-b border-day-border dark:border-night-border p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                {activeSettings === 'privacy' && 'Privacy & Security'}
                {activeSettings === 'notifications' && 'Notifications'}
                {activeSettings === 'billing' && 'Billing & Payment'}
                {activeSettings === 'language' && 'Language & Region'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSettings(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            
            <div className="p-4">
              {activeSettings === 'privacy' && <PrivacySecurity />}
              {activeSettings === 'notifications' && <Notifications />}
              {activeSettings === 'billing' && <BillingPayment />}
              {activeSettings === 'language' && <LanguageRegion />}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile; 