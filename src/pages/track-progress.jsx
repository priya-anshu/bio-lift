import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  Legend,
} from 'recharts';
import { Loader2, TrendingUp, Target, Flame, Calendar, Plus, TrendingDown, Activity } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { ref, onValue, set, push, serverTimestamp, off } from 'firebase/database';

const TrackProgress = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [goals, setGoals] = useState(null);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    squat: '',
    bench: '',
    deadlift: '',
    volume: '',
  });
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Normalize and sort entries by date
  const normalizeHistory = (historyArray) => {
    if (!historyArray) return [];

    const mapped = Object.entries(historyArray || {}).map(([id, item]) => {
      const rawDate = item.date || item.timestamp || '';
      const parsed = new Date(rawDate);
      const parsedDate = isNaN(parsed.getTime()) ? null : parsed;
      const weight = typeof item.weight === 'number' ? item.weight : null;
      const trend = typeof item.trend === 'number' ? item.trend : weight;
      const volume = typeof item.volume === 'number' ? item.volume : 0;

      return {
        id,
        ...item,
        date: rawDate,
        parsedDate,
        weight,
        trend,
        volume,
      };
    });

    return mapped.sort((a, b) => {
      if (a.parsedDate && b.parsedDate) return a.parsedDate - b.parsedDate;
      if (a.parsedDate) return -1;
      if (b.parsedDate) return 1;
      return 0;
    });
  };

  // Filter entries by timeframe
  const getFilteredEntries = (items, currentTimeframe) => {
    if (!items.length) return [];
    const daysWindow =
      currentTimeframe === 'daily' ? 30 : currentTimeframe === 'weekly' ? 90 : 9999;
    const now = new Date();

    return items.filter((entry) => {
      if (!entry.parsedDate) return true;
      const diffDays = (now - entry.parsedDate) / (1000 * 60 * 60 * 24);
      return diffDays <= daysWindow;
    });
  };

  // Calculate metrics from entries
  const calculateMetrics = (entriesList) => {
    if (!entriesList.length) {
      return {
        current_weight: null,
        total_loss: null,
        streak: 0,
        adherence: 0,
        total_volume: 0,
      };
    }

    const sorted = [...entriesList].sort((a, b) => {
      if (a.parsedDate && b.parsedDate) return a.parsedDate - b.parsedDate;
      return 0;
    });

    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const currentWeight = last.weight ?? null;
    const totalLoss =
      first.weight && last.weight ? Number((first.weight - last.weight).toFixed(1)) : null;

    // Calculate streak (consecutive days with entries)
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = sorted.length - 1; i >= 0; i--) {
      const entryDate = sorted[i].parsedDate;
      if (!entryDate) continue;
      entryDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    // Calculate total volume
    const totalVolume = sorted.reduce((sum, entry) => sum + (entry.volume || 0), 0);

    // Simple adherence calculation (entries per week target)
    const weeks = Math.max(1, (today - (first.parsedDate || today)) / (1000 * 60 * 60 * 24 * 7));
    const adherence = Math.min(100, Math.round((sorted.length / (weeks * 3)) * 100)); // Target 3 entries per week

    return {
      current_weight: currentWeight,
      total_loss: totalLoss,
      streak,
      adherence,
      total_volume: totalVolume,
    };
  };

  // Fetch data from Firebase
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const entriesRef = ref(db, `users/${user.uid}/progress/entries`);
    const goalsRef = ref(db, `users/${user.uid}/progress/goals`);

    // Listen to entries
    const unsubscribeEntries = onValue(
      entriesRef,
      (snapshot) => {
        const data = snapshot.val();
        const normalized = normalizeHistory(data);
        setEntries(normalized);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching entries:', error);
        setError('Failed to load progress data');
        setLoading(false);
      }
    );

    // Listen to goals
    const unsubscribeGoals = onValue(
      goalsRef,
      (snapshot) => {
        const data = snapshot.val();
        setGoals(data || {
          target_weight: null,
          target_streak: 21,
          target_adherence: 90,
          target_weekly_volume: 15000,
        });
      },
      (error) => {
        console.error('Error fetching goals:', error);
      }
    );

    return () => {
      off(entriesRef);
      off(goalsRef);
    };
  }, [user]);

  const handleFormChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleAddEntry = async (event) => {
    event.preventDefault();
    setFormError(null);
    setSaving(true);

    if (!formValues.date || !formValues.weight) {
      setFormError('Please enter at least a date and your weight.');
      setSaving(false);
      return;
    }

    if (!user?.uid) {
      setFormError('You must be logged in to save progress.');
      setSaving(false);
      return;
    }

    try {
      const weight = parseFloat(formValues.weight);
      const bodyFat = formValues.bodyFat ? parseFloat(formValues.bodyFat) : null;
      const squat = formValues.squat ? parseFloat(formValues.squat) : null;
      const bench = formValues.bench ? parseFloat(formValues.bench) : null;
      const deadlift = formValues.deadlift ? parseFloat(formValues.deadlift) : null;
      const explicitVolume = formValues.volume !== '' ? parseFloat(formValues.volume) : null;

      // Estimate volume from lifts if not provided
      const liftsVolume = [squat, bench, deadlift]
        .filter((v) => typeof v === 'number' && !isNaN(v))
        .reduce((sum, v) => sum + v * 5, 0); // Simple estimate: 1RM * 5 sets

      const volume = explicitVolume != null && !isNaN(explicitVolume) ? explicitVolume : liftsVolume;

      // Calculate trend (simple moving average of last 3 entries)
      const recentEntries = entries.slice(-3);
      const recentWeights = recentEntries
        .map((e) => e.weight)
        .filter((w) => w != null);
      const trend =
        recentWeights.length > 0
          ? (recentWeights.reduce((a, b) => a + b, 0) + weight) / (recentWeights.length + 1)
          : weight;

      const newEntry = {
        date: formValues.date,
        weight: isNaN(weight) ? null : weight,
        bodyFat: bodyFat != null && !isNaN(bodyFat) ? bodyFat : null,
        squat: squat != null && !isNaN(squat) ? squat : null,
        bench: bench != null && !isNaN(bench) ? bench : null,
        deadlift: deadlift != null && !isNaN(deadlift) ? deadlift : null,
        volume: isNaN(volume) ? 0 : volume,
        trend: trend,
        timestamp: serverTimestamp(),
      };

      const entriesRef = ref(db, `users/${user.uid}/progress/entries`);
      await push(entriesRef, newEntry);

      // Reset form
      setFormValues({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        bodyFat: '',
        squat: '',
        bench: '',
        deadlift: '',
        volume: '',
      });
      setShowForm(false);
      setFormError(null);
    } catch (err) {
      console.error('Error saving entry:', err);
      setFormError('Failed to save entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-day-bg dark:bg-night-bg text-day-text-primary dark:text-night-text-primary">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p>Loading your progress...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-day-bg dark:bg-night-bg text-day-text-primary dark:text-night-text-primary">
        <p className="text-red-500">Please log in to track your progress.</p>
      </div>
    );
  }

  const allEntries = entries;
  const filteredEntries = getFilteredEntries(allEntries, timeframe);
  const chartHistory = filteredEntries.length ? filteredEntries : allEntries;
  const metrics = calculateMetrics(allEntries);

  const latestPoint = allEntries[allEntries.length - 1] || {};
  const firstPoint = allEntries[0] || latestPoint;

  const currentWeight = metrics.current_weight ?? latestPoint.weight ?? null;
  const totalLoss = metrics.total_loss ?? null;
  const targetWeight = goals?.target_weight ?? null;
  const remainingToGoal =
    targetWeight != null && currentWeight != null ? Number((currentWeight - targetWeight).toFixed(1)) : null;

  const weightProgressPercent =
    totalLoss != null && remainingToGoal != null && totalLoss + remainingToGoal > 0
      ? Math.min(100, Math.max(0, (totalLoss / (totalLoss + Math.abs(remainingToGoal))) * 100))
      : null;

  const streakProgressPercent =
    goals?.target_streak && metrics.streak != null
      ? Math.min(100, (metrics.streak / goals.target_streak) * 100)
      : null;

  const adherenceProgressPercent =
    goals?.target_adherence && metrics.adherence != null
      ? Math.min(100, (metrics.adherence / goals.target_adherence) * 100)
      : null;

  const latestVolume = latestPoint.volume ?? 0;
  const avgWeeklyVolume = allEntries.length > 0
    ? allEntries.slice(-7).reduce((sum, e) => sum + (e.volume || 0), 0) / Math.min(7, allEntries.length)
    : 0;
  const volumeProgressPercent =
    goals?.target_weekly_volume && avgWeeklyVolume > 0
      ? Math.min(100, (avgWeeklyVolume / goals.target_weekly_volume) * 100)
      : null;

  // Body composition data
  const bodyCompHistory = chartHistory
    .filter((entry) => entry.weight && entry.bodyFat != null)
    .map((entry) => {
      const lean = entry.weight * (1 - entry.bodyFat / 100);
      const fat = entry.weight * (entry.bodyFat / 100);
      return {
        date: entry.date,
        leanMass: Number(lean.toFixed(1)),
        fatMass: Number(fat.toFixed(1)),
        totalWeight: entry.weight,
      };
    });

  // Strength progress data
  const strengthHistory = chartHistory
    .filter((entry) => entry.squat || entry.bench || entry.deadlift)
    .map((entry) => ({
      date: entry.date,
      squat: entry.squat || null,
      bench: entry.bench || null,
      deadlift: entry.deadlift || null,
      total: (entry.squat || 0) + (entry.bench || 0) + (entry.deadlift || 0) || null,
    }));

  // Volume trend data
  const volumeHistory = chartHistory.map((entry) => ({
    date: entry.date,
    volume: entry.volume || 0,
  }));

  const ProgressBar = ({ percent, accentClass = 'bg-blue-500' }) => (
    <div className="w-full h-1.5 rounded-full bg-slate-800/70 overflow-hidden">
      <div
        className={`${accentClass} h-full transition-all duration-500`}
        style={{ width: `${Math.max(0, Math.min(100, percent || 0))}%` }}
      />
    </div>
  );

  return (
    <div className="pt-20 lg:pt-24 px-4 lg:px-8 min-h-screen bg-day-bg dark:bg-night-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary">
              Progress Analytics
            </h1>
            <p className="text-day-text-secondary dark:text-night-text-secondary">
              Track your fitness journey with real-time data from Firebase
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {showForm ? 'Cancel' : 'Add Entry'}
            </button>

            <div className="flex bg-day-card dark:bg-night-card p-1 rounded-lg border border-day-border dark:border-night-border">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-500'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'charts' ? 'bg-blue-600 text-white' : 'text-gray-500'
                  }`}
              >
                Charts
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/40 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Entry Form */}
        {showForm && (
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 text-day-text-primary dark:text-night-text-primary">
              Log New Progress Entry
            </h3>
            <form onSubmit={handleAddEntry} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Date *"
                type="date"
                value={formValues.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
                required
              />
              <Input
                label="Weight (kg) *"
                type="number"
                step="0.1"
                value={formValues.weight}
                onChange={(e) => handleFormChange('weight', e.target.value)}
                required
              />
              <Input
                label="Body Fat % (optional)"
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={formValues.bodyFat}
                onChange={(e) => handleFormChange('bodyFat', e.target.value)}
              />
              <Input
                label="Squat 1RM (kg)"
                type="number"
                step="1"
                value={formValues.squat}
                onChange={(e) => handleFormChange('squat', e.target.value)}
              />
              <Input
                label="Bench 1RM (kg)"
                type="number"
                step="1"
                value={formValues.bench}
                onChange={(e) => handleFormChange('bench', e.target.value)}
              />
              <Input
                label="Deadlift 1RM (kg)"
                type="number"
                step="1"
                value={formValues.deadlift}
                onChange={(e) => handleFormChange('deadlift', e.target.value)}
              />
              <Input
                label="Training Volume (kg, optional)"
                type="number"
                step="1"
                value={formValues.volume}
                onChange={(e) => handleFormChange('volume', e.target.value)}
              />
              <div className="md:col-span-3 flex flex-col gap-2 items-start">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-6 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Entry'
                  )}
                </button>
                {formError && <span className="text-xs text-red-500">{formError}</span>}
              </div>
            </form>
          </Card>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Timeframe Selector */}
            <Card className="p-4">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-day-text-primary dark:text-night-text-primary">
                  View Timeframe
                </span>
                <div className="inline-flex rounded-lg bg-day-card dark:bg-night-card border border-day-border dark:border-night-border overflow-hidden">
                  {[
                    { key: 'daily', label: 'Last 30 Days' },
                    { key: 'weekly', label: 'Last 90 Days' },
                    { key: 'monthly', label: 'All Time' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setTimeframe(option.key)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${timeframe === option.key
                          ? 'bg-blue-600 text-white'
                          : 'text-day-text-secondary dark:text-night-text-secondary hover:bg-slate-700/50'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-day-text-secondary dark:text-night-text-secondary">
                  Showing {filteredEntries.length} of {allEntries.length} entries
                </p>
              </div>
            </Card>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-day-text-secondary dark:text-night-text-secondary">
                    Current Weight
                  </span>
                  {totalLoss != null && totalLoss > 0 ? (
                    <TrendingDown className="w-4 h-4 text-green-400" />
                  ) : totalLoss != null && totalLoss < 0 ? (
                    <TrendingUp className="w-4 h-4 text-red-400" />
                  ) : (
                    <Activity className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="text-2xl font-semibold text-day-text-primary dark:text-night-text-primary">
                  {currentWeight ? `${currentWeight.toFixed(1)} kg` : '--'}
                </div>
                <p className="text-xs text-day-text-secondary dark:text-night-text-secondary">
                  {totalLoss != null ? (
                    totalLoss > 0 ? (
                      <span className="font-semibold text-green-400">Lost {totalLoss.toFixed(1)} kg</span>
                    ) : (
                      <span className="font-semibold text-red-400">Gained {Math.abs(totalLoss).toFixed(1)} kg</span>
                    )
                  ) : (
                    'No data yet'
                  )}
                </p>
                {weightProgressPercent != null && <ProgressBar percent={weightProgressPercent} />}
                {remainingToGoal != null && (
                  <p className="mt-1 text-[11px] text-day-text-secondary dark:text-night-text-secondary">
                    {remainingToGoal > 0
                      ? `${remainingToGoal.toFixed(1)} kg away from goal`
                      : remainingToGoal < 0
                        ? `Exceeded goal by ${Math.abs(remainingToGoal).toFixed(1)} kg`
                        : 'Goal reached!'}
                  </p>
                )}
              </Card>

              <Card className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-day-text-secondary dark:text-night-text-secondary">
                    Consistency
                  </span>
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-semibold text-day-text-primary dark:text-night-text-primary">
                  {metrics.streak} days
                </div>
                <p className="text-xs text-day-text-secondary dark:text-night-text-secondary">
                  Target streak{' '}
                  <span className="font-semibold">
                    {goals?.target_streak ? `${goals.target_streak} days` : '—'}
                  </span>
                </p>
                {streakProgressPercent != null && (
                  <ProgressBar percent={streakProgressPercent} accentClass="bg-emerald-400" />
                )}
              </Card>

              <Card className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-day-text-secondary dark:text-night-text-secondary">
                    Plan Adherence
                  </span>
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-semibold text-day-text-primary dark:text-night-text-primary">
                  {metrics.adherence}%
                </div>
                <p className="text-xs text-day-text-secondary dark:text-night-text-secondary">
                  Target{' '}
                  <span className="font-semibold">
                    {goals?.target_adherence ? `${goals.target_adherence}%` : '—'}
                  </span>
                </p>
                {adherenceProgressPercent != null && (
                  <ProgressBar percent={adherenceProgressPercent} accentClass="bg-purple-400" />
                )}
              </Card>

              <Card className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-day-text-secondary dark:text-night-text-secondary">
                    Weekly Volume
                  </span>
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-semibold text-day-text-primary dark:text-night-text-primary">
                  {avgWeeklyVolume > 0 ? `${Math.round(avgWeeklyVolume).toLocaleString()} kg` : '--'}
                </div>
                <p className="text-xs text-day-text-secondary dark:text-night-text-secondary">
                  Target{' '}
                  <span className="font-semibold">
                    {goals?.target_weekly_volume
                      ? `${goals.target_weekly_volume.toLocaleString()} kg`
                      : '—'}
                  </span>
                </p>
                {volumeProgressPercent != null && (
                  <ProgressBar percent={volumeProgressPercent} accentClass="bg-orange-400" />
                )}
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-day-text-secondary dark:text-night-text-secondary mb-1">
                  Total Entries
                </div>
                <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                  {allEntries.length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-day-text-secondary dark:text-night-text-secondary mb-1">
                  Total Volume
                </div>
                <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                  {metrics.total_volume.toLocaleString()} kg
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-day-text-secondary dark:text-night-text-secondary mb-1">
                  Average Weight
                </div>
                <div className="text-2xl font-bold text-day-text-primary dark:text-night-text-primary">
                  {allEntries.length > 0 && allEntries.filter((e) => e.weight).length > 0
                    ? `${(
                      allEntries
                        .filter((e) => e.weight)
                        .reduce((sum, e) => sum + e.weight, 0) /
                      allEntries.filter((e) => e.weight).length
                    ).toFixed(1)} kg`
                    : '--'}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div className="space-y-6">
            {/* Timeframe Selector */}
            <Card className="p-4">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-day-text-primary dark:text-night-text-primary">
                  View Timeframe
                </span>
                <div className="inline-flex rounded-lg bg-day-card dark:bg-night-card border border-day-border dark:border-night-border overflow-hidden">
                  {[
                    { key: 'daily', label: 'Last 30 Days' },
                    { key: 'weekly', label: 'Last 90 Days' },
                    { key: 'monthly', label: 'All Time' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setTimeframe(option.key)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${timeframe === option.key
                          ? 'bg-blue-600 text-white'
                          : 'text-day-text-secondary dark:text-night-text-secondary hover:bg-slate-700/50'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Weight Trend Chart */}
            {chartHistory.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 text-day-text-primary dark:text-night-text-primary">
                  Weight Trend
                </h3>
                <div style={{ width: '100%', height: 350 }}>

                  <ResponsiveContainer>
                    <AreaChart data={chartHistory}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis domain={['auto', 'auto']} stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          color: '#fff',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="url(#colorWeight)"
                        name="Weight (kg)"
                      />
                      {targetWeight && (
                        <Line
                          type="monotone"
                          dataKey={() => targetWeight}
                          stroke="#10b981"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Target Weight"
                          dot={false}
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Training Volume Chart */}
            {chartHistory.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 text-day-text-primary dark:text-night-text-primary">
                  Training Volume
                </h3>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <BarChart data={volumeHistory}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="volume" fill="#10b981" radius={[4, 4, 0, 0]} name="Volume (kg)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Body Composition Chart */}
            {bodyCompHistory.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 text-day-text-primary dark:text-night-text-primary">
                  Body Composition (Lean Mass vs Fat Mass)
                </h3>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <ComposedChart data={bodyCompHistory}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          color: '#fff',
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="leanMass"
                        stackId="1"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.6}
                        name="Lean Mass (kg)"
                      />
                      <Area
                        type="monotone"
                        dataKey="fatMass"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                        name="Fat Mass (kg)"
                      />
                      <Line
                        type="monotone"
                        dataKey="totalWeight"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Total Weight (kg)"
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Strength Progress Chart */}
            {strengthHistory.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 text-day-text-primary dark:text-night-text-primary">
                  Strength Progress (1RM)
                </h3>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <LineChart data={strengthHistory}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          color: '#fff',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="squat"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Squat (kg)"
                      />
                      <Line
                        type="monotone"
                        dataKey="bench"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Bench (kg)"
                      />
                      <Line
                        type="monotone"
                        dataKey="deadlift"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Deadlift (kg)"
                      />
                      {strengthHistory.some((e) => e.total) && (
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke="#a855f7"
                          strokeWidth={3}
                          strokeDasharray="5 5"
                          dot={{ r: 5 }}
                          name="Total (kg)"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-4 text-xs text-day-text-secondary dark:text-night-text-secondary">
                  Track your powerlifting progress. The total line shows your combined 1RM for all three lifts.
                </p>
              </Card>
            )}

            {chartHistory.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-day-text-secondary dark:text-night-text-secondary">
                  No data to display. Add your first progress entry to see charts!
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackProgress;
