import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './src/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import Layout from './src/components/layout/Layout';

// Page Components
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import Dashboard from './src/pages/Dashboard';
import Workout from './src/pages/Workout';
import Ranking from './src/pages/Ranking';
import Diet from './src/pages/Diet';
import Profile from './src/pages/Profile';

// Auth Context (for future use)
import { AuthProvider } from './src/context/AuthContext';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-day-bg dark:bg-night-bg transition-colors duration-300">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="workout" element={<Workout />} />
                  <Route path="ranking" element={<Ranking />} />
                  <Route path="diet" element={<Diet />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
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
