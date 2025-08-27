import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Star, 
  Filter,
  Search,
  TrendingUp,
  Flame,
  Zap,
  Settings
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

// Import the new Smart Ranking System components
import Leaderboard from '../components/Leaderboard';
import RankCard from '../components/RankCard';
import AdminDashboard from '../components/AdminDashboard';
import { useAuth } from '../context/AuthContext';

const Ranking = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [showAdmin, setShowAdmin] = useState(false);

  // Check if user is admin (you can modify this logic based on your admin system)
  const isAdmin = user?.email === 'admin@biolift.com' || user?.role === 'admin';

  const tabs = [
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'my-rank', label: 'My Ranking', icon: Star },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Settings }] : [])
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'leaderboard':
        return <Leaderboard />;
      case 'my-rank':
        return user ? <RankCard userId={user.uid} showInsights={true} /> : <div>Please log in to view your ranking</div>;
      case 'admin':
        return isAdmin ? <AdminDashboard /> : <div>Access denied</div>;
      default:
        return <Leaderboard />;
    }
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
          Smart Ranking System
        </h1>
        <p className="text-day-text-secondary dark:text-night-text-secondary">
          Dynamic leaderboards based on multi-factor performance metrics
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <div className="flex flex-wrap gap-2 p-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default Ranking; 