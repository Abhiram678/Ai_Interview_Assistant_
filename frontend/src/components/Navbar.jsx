import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, BarChart3, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab, onMenuToggle, isMenuOpen }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Brain },
    { id: 'interviewee', label: 'Interviewee', icon: Users },
    { id: 'interviewer', label: 'Interviewer', icon: BarChart3 }
  ];

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <Brain size={28} />
          </div>
          <span className="brand-text">InterviewAI</span>
        </div>

        <div className="navbar-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    className="nav-indicator"
                    layoutId="activeNav"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={onMenuToggle}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <motion.div 
        className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0, 
          height: isMenuOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                onMenuToggle();
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
