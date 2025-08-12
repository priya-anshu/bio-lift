import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-day-bg dark:bg-night-bg">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <Sidebar onClose={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <main className="pt-16 lg:pt-20 lg:pl-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen p-4 lg:p-8"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout; 