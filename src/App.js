import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
// Layout Components
import Layout from './components/layout/Layout';

// Page Components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import Ranking from './pages/Ranking';
import Diet from './pages/Diet';
import Profile from './pages/Profile';
import Social from './pages/Social';
import Shop from './pages/Shop';
import CreatePlan from './pages/CreatePlan';
import Goals from './pages/Goals';
import Workouts from './pages/Workouts';
import Progress from './pages/Progress';
import TrackProgress from './pages/track-progress';
import WorkoutSelection from './pages/WorkoutSelection';
import AdminDashboard from './components/AdminDashboard';
import Checkout from './pages/Checkout';
import Shimmer from './components/Shimmer';

// Auth Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Wrapper
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('PrivateRoute - user:', user, 'loading:', loading); // Debug log

  if (loading) return <Shimmer/>; // Show loader while checking auth
  if (!user) {
    console.log('No user found, redirecting to login'); // Debug log
    return <Navigate to="/login" replace />; // Redirect if not logged in
  }

  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-day-bg dark:bg-night-bg transition-colors duration-300">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route 
                  path="/" 
                  element={
                    <PrivateRoute>
                      <Layout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="workout" element={<Workout />} />
                  <Route path="ranking" element={<Ranking />} />
                  <Route path="diet" element={<Diet />} />
                  <Route path="create-plan" element={<CreatePlan />} />
                  <Route path="goals" element={<Goals />} />
                  <Route path="workouts" element={<Workouts />} />
                  <Route path="progress" element={<Progress />} />
                  <Route path="track-progress" element={<TrackProgress />} />
                  <Route path="workout-selection" element={<WorkoutSelection />} />
                  
                  <Route path="profile" element={<Profile />} />
                  <Route path="social" element={<Social />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="checkout" element={<Checkout />} />

                </Route>

                {/* Fallback: any unknown route → login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
