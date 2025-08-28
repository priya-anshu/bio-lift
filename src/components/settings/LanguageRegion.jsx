import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  MapPin, 
  Clock, 
  Calendar,
  Languages,
  Flag,
  Settings,
  CheckCircle
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const LanguageRegion = () => {
  const [currentSettings, setCurrentSettings] = useState({
    language: 'en',
    region: 'IN',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    currency: 'INR',
    temperature: 'Celsius',
    weight: 'kg',
    distance: 'km'
  });

  const [languages] = useState([
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
  ]);

  const [regions] = useState([
    { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', timezone: 'Asia/Kolkata' },
    { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', timezone: 'America/New_York' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', timezone: 'Europe/London' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', timezone: 'America/Toronto' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', timezone: 'Australia/Sydney' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', timezone: 'Europe/Berlin' },
    { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', timezone: 'Europe/Paris' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', timezone: 'Asia/Tokyo' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', timezone: 'Asia/Singapore' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', timezone: 'Asia/Dubai' }
  ]);

  const [timezones] = useState([
    { value: 'Asia/Kolkata', label: 'India (IST) UTC+5:30', offset: '+5:30' },
    { value: 'Asia/Dubai', label: 'UAE (GST) UTC+4:00', offset: '+4:00' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT) UTC+8:00', offset: '+8:00' },
    { value: 'Asia/Tokyo', label: 'Japan (JST) UTC+9:00', offset: '+9:00' },
    { value: 'America/New_York', label: 'Eastern Time (EST/EDT) UTC-5:00', offset: '-5:00' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT) UTC-8:00', offset: '-8:00' },
    { value: 'Europe/London', label: 'London (GMT/BST) UTC+0:00', offset: '+0:00' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST) UTC+1:00', offset: '+1:00' },
    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST) UTC+1:00', offset: '+1:00' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT) UTC+10:00', offset: '+10:00' }
  ]);

  const [dateFormats] = useState([
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g., 15/01/2024)' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g., 01/15/2024)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g., 2024-01-15)' },
    { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (e.g., 15-01-2024)' }
  ]);

  const [timeFormats] = useState([
    { value: '12h', label: '12-hour (e.g., 2:30 PM)' },
    { value: '24h', label: '24-hour (e.g., 14:30)' }
  ]);

  const [currencies] = useState([
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' }
  ]);

  const handleSettingChange = (setting, value) => {
    setCurrentSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentSettings.language);
  };

  const getCurrentRegion = () => {
    return regions.find(region => region.code === currentSettings.region);
  };

  const getCurrentCurrency = () => {
    return currencies.find(currency => currency.code === currentSettings.currency);
  };

  const getCurrentTimezone = () => {
    return timezones.find(tz => tz.value === currentSettings.timezone);
  };

  const saveSettings = () => {
    console.log('Saving language & region settings:', currentSettings);
    // Handle saving settings logic
  };

  const resetToDefaults = () => {
    setCurrentSettings({
      language: 'en',
      region: 'IN',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      currency: 'INR',
      temperature: 'Celsius',
      weight: 'kg',
      distance: 'km'
    });
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
          <Globe className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
            Language & Region
          </h2>
        </div>
        <p className="text-day-text-secondary dark:text-night-text-secondary">
          Customize your language, regional preferences, and localization settings
        </p>
      </motion.div>

      {/* Current Settings Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl mb-1">{getCurrentLanguage()?.flag}</div>
                <div className="text-sm font-medium text-day-text-primary dark:text-night-text-primary">
                  {getCurrentLanguage()?.name}
                </div>
                <div className="text-xs text-day-text-secondary dark:text-night-text-secondary">
                  {getCurrentLanguage()?.nativeName}
                </div>
              </div>
              
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl mb-1">{getCurrentRegion()?.flag}</div>
                <div className="text-sm font-medium text-day-text-primary dark:text-night-text-primary">
                  {getCurrentRegion()?.name}
                </div>
                <div className="text-xs text-day-text-secondary dark:text-night-text-secondary">
                  {getCurrentRegion()?.currency}
                </div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <div className="text-sm font-medium text-day-text-primary dark:text-night-text-primary">
                  {getCurrentTimezone()?.offset}
                </div>
                <div className="text-xs text-day-text-secondary dark:text-night-text-secondary">
                  {getCurrentTimezone()?.label.split(' ')[0]}
                </div>
              </div>
              
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                <div className="text-sm font-medium text-day-text-primary dark:text-night-text-primary">
                  {currentSettings.dateFormat}
                </div>
                <div className="text-xs text-day-text-secondary dark:text-night-text-secondary">
                  {currentSettings.timeFormat}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <Languages className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                  Language
                </h3>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {languages.map((language) => (
                  <div
                    key={language.code}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      currentSettings.language === language.code
                        ? 'border-day-accent-primary dark:border-night-accent bg-day-accent-primary/5 dark:bg-night-accent/5'
                        : 'border-day-border dark:border-night-border hover:border-day-accent-primary/30 dark:hover:border-night-accent/30'
                    }`}
                    onClick={() => handleSettingChange('language', language.code)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{language.flag}</span>
                      <div>
                        <div className="font-medium text-day-text-primary dark:text-night-text-primary">
                          {language.name}
                        </div>
                        <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                          {language.nativeName}
                        </div>
                      </div>
                    </div>
                    {currentSettings.language === language.code && (
                      <CheckCircle className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Region Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                  Region
                </h3>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {regions.map((region) => (
                  <div
                    key={region.code}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      currentSettings.region === region.code
                        ? 'border-day-accent-primary dark:border-night-accent bg-day-accent-primary/5 dark:bg-night-accent/5'
                        : 'border-day-border dark:border-night-border hover:border-day-accent-primary/30 dark:hover:border-night-accent/30'
                    }`}
                    onClick={() => handleSettingChange('region', region.code)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{region.flag}</span>
                      <div>
                        <div className="font-medium text-day-text-primary dark:text-night-text-primary">
                          {region.name}
                        </div>
                        <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">
                          {region.currency} • {region.timezone.split('/')[1]}
                        </div>
                      </div>
                    </div>
                    {currentSettings.region === region.code && (
                      <CheckCircle className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </div>

      {/* Timezone & Date/Time Format */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Time & Date Format
              </h3>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                  Timezone
                </label>
                <select
                  value={currentSettings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-day-border dark:border-night-border rounded-md focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                  Date Format
                </label>
                <select
                  value={currentSettings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-day-border dark:border-night-border rounded-md focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                >
                  {dateFormats.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                  Time Format
                </label>
                <select
                  value={currentSettings.timeFormat}
                  onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-day-border dark:border-night-border rounded-md focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                >
                  {timeFormats.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Currency & Units */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-bold text-day-text-primary dark:text-night-text-primary">
                Currency & Units
              </h3>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                  Currency
                </label>
                <select
                  value={currentSettings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-day-border dark:border-night-border rounded-md focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                    Temperature
                  </label>
                  <select
                    value={currentSettings.temperature}
                    onChange={(e) => handleSettingChange('temperature', e.target.value)}
                    className="w-full px-3 py-2 border border-day-border dark:border-night-border rounded-md focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                  >
                    <option value="Celsius">Celsius (°C)</option>
                    <option value="Fahrenheit">Fahrenheit (°F)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                    Weight
                  </label>
                  <select
                    value={currentSettings.weight}
                    onChange={(e) => handleSettingChange('weight', e.target.value)}
                    className="w-full px-3 py-2 border border-day-border dark:border-night-border rounded-md focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lbs">Pounds (lbs)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-day-text-primary dark:text-night-text-primary mb-2">
                    Distance
                  </label>
                  <select
                    value={currentSettings.distance}
                    onChange={(e) => handleSettingChange('distance', e.target.value)}
                    className="w-full px-3 py-2 border border-day-border dark:border-night-border rounded-md focus:ring-2 focus:ring-day-accent-primary dark:focus:ring-night-accent focus:border-transparent"
                  >
                    <option value="km">Kilometers (km)</option>
                    <option value="mi">Miles (mi)</option>
                  </select>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-between"
      >
        <Button
          variant="outline"
          onClick={resetToDefaults}
        >
          Reset to Defaults
        </Button>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => console.log('Preview changes')}
          >
            Preview Changes
          </Button>
          <Button
            variant="primary"
            onClick={saveSettings}
          >
            Save Settings
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageRegion;
