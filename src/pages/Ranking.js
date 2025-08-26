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
  Zap
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Ranking = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const leaderboard = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rank: 1,
      points: 2847,
      level: "Elite",
      streak: 15,
      workouts: 127,
      achievements: 23
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rank: 2,
      points: 2654,
      level: "Elite",
      streak: 12,
      workouts: 115,
      achievements: 21
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rank: 3,
      points: 2489,
      level: "Elite",
      streak: 18,
      workouts: 98,
      achievements: 19
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rank: 4,
      points: 2312,
      level: "Advanced",
      streak: 8,
      workouts: 89,
      achievements: 17
    },
    {
      id: 5,
      name: "Lisa Wang",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rank: 5,
      points: 2156,
      level: "Advanced",
      streak: 10,
      workouts: 76,
      achievements: 15
    }
  ];

  const filters = [
    { id: 'all', label: 'All Users', icon: Trophy },
    { id: 'elite', label: 'Elite', icon: Star },
    { id: 'advanced', label: 'Advanced', icon: TrendingUp },
    { id: 'intermediate', label: 'Intermediate', icon: Flame },
    { id: 'beginner', label: 'Beginner', icon: Zap }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-day-text-secondary dark:text-night-text-secondary">#{rank}</span>;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Elite':
        return 'text-purple-500';
      case 'Advanced':
        return 'text-blue-500';
      case 'Intermediate':
        return 'text-green-500';
      case 'Beginner':
        return 'text-orange-500';
      default:
        return 'text-day-text-secondary dark:text-night-text-secondary';
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
          Leaderboard
        </h1>
        <p className="text-day-text-secondary dark:text-night-text-secondary">
          Compete with fitness enthusiasts worldwide
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <div className="flex-1">
          <Input
            placeholder="Search users..."
            icon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {filters.map((filterOption) => {
            const Icon = filterOption.icon;
            return (
              <Button
                key={filterOption.id}
                variant={filter === filterOption.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(filterOption.id)}
                className="whitespace-nowrap"
              >
                <Icon className="w-4 h-4 mr-1" />
                {filterOption.label}
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* 2nd Place */}
        <div className="order-2 md:order-1">
          <Card className="p-6 text-center">
            <div className="relative mb-4">
              <img
                src={leaderboard[1].avatar}
                alt={leaderboard[1].name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-gray-300"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
            </div>
            <h3 className="font-bold text-day-text-primary dark:text-night-text-primary mb-1">
              {leaderboard[1].name}
            </h3>
            <p className="text-sm text-day-text-secondary dark:text-night-text-secondary mb-2">
              {leaderboard[1].points} points
            </p>
            <Badge variant="ghost" size="sm">
              {leaderboard[1].level}
            </Badge>
          </Card>
        </div>

        {/* 1st Place */}
        <div className="order-1 md:order-2">
          <Card className="p-6 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-300 dark:border-yellow-600">
            <div className="relative mb-4">
              <img
                src={leaderboard[0].avatar}
                alt={leaderboard[0].name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-yellow-400"
              />
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-day-text-primary dark:text-night-text-primary mb-1">
              {leaderboard[0].name}
            </h3>
            <p className="text-sm text-day-text-secondary dark:text-night-text-secondary mb-2">
              {leaderboard[0].points} points
            </p>
            <Badge variant="primary" size="sm">
              {leaderboard[0].level}
            </Badge>
          </Card>
        </div>

        {/* 3rd Place */}
        <div className="order-3">
          <Card className="p-6 text-center">
            <div className="relative mb-4">
              <img
                src={leaderboard[2].avatar}
                alt={leaderboard[2].name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-amber-600"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
            </div>
            <h3 className="font-bold text-day-text-primary dark:text-night-text-primary mb-1">
              {leaderboard[2].name}
            </h3>
            <p className="text-sm text-day-text-secondary dark:text-night-text-secondary mb-2">
              {leaderboard[2].points} points
            </p>
            <Badge variant="ghost" size="sm">
              {leaderboard[2].level}
            </Badge>
          </Card>
        </div>
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <Card.Header>
            <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
              Global Rankings
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-day-hover dark:hover:bg-night-hover transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(user.rank)}
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary">
                        {user.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="ghost" size="sm" className={getLevelColor(user.level)}>
                          {user.level}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-day-text-secondary dark:text-night-text-secondary">
                          <Flame className="w-3 h-3" />
                          <span>{user.streak} day streak</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-day-text-primary dark:text-night-text-primary">
                      {user.points.toLocaleString()}
                    </div>
                    <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                      {user.workouts} workouts • {user.achievements} achievements
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Your Ranking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-day-accent-primary/10 to-day-accent-secondary/10 dark:from-night-accent/10 dark:to-red-600/10">
          <Card.Header>
            <h2 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
              Your Ranking
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">#42</span>
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    alt="Your avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary">
                    You
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="primary" size="sm">
                      Elite
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-day-text-secondary dark:text-night-text-secondary">
                      <Flame className="w-3 h-3" />
                      <span>7 day streak</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-day-text-primary dark:text-night-text-primary">
                  1,250
                </div>
                <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                  45 workouts • 12 achievements
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
};

export default Ranking; 