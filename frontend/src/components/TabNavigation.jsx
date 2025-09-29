import React from 'react';
import { motion } from 'framer-motion';
import { User, BarChart3 } from 'lucide-react';
import './TabNavigation.css';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'interviewee', label: 'Interviewee', icon: User },
    { id: 'interviewer', label: 'Interviewer', icon: BarChart3 }
  ];

  return (
    <motion.div 
      className="tab-navigation"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="tab-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              className={`tab-button ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  className="tab-indicator"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TabNavigation;
