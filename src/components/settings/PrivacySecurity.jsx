import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Lock, 
  UserCheck, 
  Smartphone, 
  Mail,
  Key,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const PrivacySecurity = () => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showWorkoutHistory: true,
    showProgress: true,
    allowFriendRequests: true,
    showOnlineStatus: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
    sessionTimeout: 30,
    passwordChangeRequired: false
  });

  const [connectedDevices] = useState([
    { id: 1, name: 'Windows 11 PC', location: 'New Delhi, India', lastActive: '2 hours ago', current: true },
    { id: 2, name: 'iPhone 14', location: 'New Delhi, India', lastActive: '1 day ago', current: false },
    { id: 3, name: 'MacBook Pro', location: 'New Delhi, India', lastActive: '3 days ago', current: false }
  ]);

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSecurityChange = (setting, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const removeDevice = (deviceId) => {
    // Handle device removal logic
    console.log('Removing device:', deviceId);
  };

  const changePassword = () => {
    // Handle password change logic
    console.log('Changing password...');
  };

  const enableTwoFactor = () => {
    // Handle 2FA setup logic
    console.log('Setting up 2FA...');
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
          <Shield className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
            Privacy & Security
          </h2>
        </div>
        <p className="text-day-text-secondary dark:text-night-text-secondary">
          Control your privacy settings and secure your account
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                  Privacy Settings
                </h3>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {/* Profile Visibility */}
                <div>
                  <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                    Profile Visibility
                  </label>
                  <select
                    value={privacySettings.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="w-full px-3 py-2 border border-day-border dark:border-night-border rounded-md focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                  >
                    <option value="public">Public - Anyone can see your profile</option>
                    <option value="friends">Friends Only - Only friends can see your profile</option>
                    <option value="private">Private - Only you can see your profile</option>
                  </select>
                </div>

                {/* Privacy Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-day-text-primary dark:text-night-text-primary">
                        Show email address
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showEmail}
                        onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-day-text-primary dark:text-night-text-primary">
                        Show workout history
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showWorkoutHistory}
                        onChange={(e) => handlePrivacyChange('showWorkoutHistory', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-day-text-primary dark:text-night-text-primary">
                        Show progress achievements
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showProgress}
                        onChange={(e) => handlePrivacyChange('showProgress', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-red-600" />
                <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                  Security Settings
                </h3>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-black rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-day-text-primary dark:text-night-text-primary">
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                        Add an extra layer of security
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {securitySettings.twoFactorAuth ? (
                      <Badge variant="success" size="sm">Enabled</Badge>
                    ) : (
                      <Badge variant="warning" size="sm">Disabled</Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={enableTwoFactor}
                    >
                      {securitySettings.twoFactorAuth ? 'Manage' : 'Enable'}
                    </Button>
                  </div>
                </div>

                {/* Security Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-day-text-primary dark:text-night-text-primary">
                        Login notifications
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.loginNotifications}
                        onChange={(e) => handleSecurityChange('loginNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-day-text-primary dark:text-night-text-primary">
                        Suspicious activity alerts
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.suspiciousActivityAlerts}
                        onChange={(e) => handleSecurityChange('suspiciousActivityAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Password Change */}
                <div className="pt-3 border-t border-day-border dark:border-night-border">
                  <Button
                    variant="outline"
                    onClick={changePassword}
                    className="w-full"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </div>

      {/* Connected Devices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Connected Devices
              </h3>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {connectedDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-black rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-gray-500" />
                    <div>
                      <h4 className="font-medium text-day-text-primary dark:text-night-text-primary">
                        {device.name}
                        {device.current && (
                          <Badge variant="primary" size="sm" className="ml-2">
                            Current
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                        {device.location} • Last active {device.lastActive}
                      </p>
                    </div>
                  </div>
                  {!device.current && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDevice(device.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-end"
      >
        <Button variant="primary" size="lg">
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
};

export default PrivacySecurity;
