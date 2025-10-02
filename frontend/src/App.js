import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import IntervieweePage from './pages/IntervieweePage';
import InterviewerPage from './pages/InterviewerPage';
import WelcomeBackModal from './components/WelcomeBackModal';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [unfinishedInterview, setUnfinishedInterview] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check for unfinished interviews on app load
    checkUnfinishedInterview();
  }, []);

  const checkUnfinishedInterview = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/check-unfinished-interview`);
      const data = await response.json();
      
      if (data.has_unfinished) {
        setUnfinishedInterview(data);
        setShowWelcomeModal(true);
      }
    } catch (error) {
      console.error('Error checking unfinished interview:', error);
    }
  };

  const handleResumeInterview = () => {
    setShowWelcomeModal(false);
    setActiveTab('interviewee');
    // The IntervieweePage will handle resuming the interview
  };

  const handleStartNew = () => {
    setShowWelcomeModal(false);
    setUnfinishedInterview(null);
    setActiveTab('interviewee');
  };

  const handleGetStarted = () => {
    setActiveTab('interviewee');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <AppProvider>
      <div className="app">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onMenuToggle={handleMenuToggle}
          isMenuOpen={isMenuOpen}
        />
        
        <main className="main-content">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HomePage onGetStarted={handleGetStarted} />
              </motion.div>
            )}
            
            {activeTab === 'interviewee' && (
              <motion.div
                key="interviewee"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                        <IntervieweePage 
                          unfinishedInterview={unfinishedInterview}
                          onInterviewComplete={() => setUnfinishedInterview(null)}
                        />
              </motion.div>
            )}
            
            {activeTab === 'interviewer' && (
              <motion.div
                key="interviewer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <InterviewerPage />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

                <AnimatePresence>
                  {showWelcomeModal && (
                    <WelcomeBackModal
                      unfinishedInterview={unfinishedInterview}
                      onResume={handleResumeInterview}
                      onStartNew={handleStartNew}
                      onClose={() => setShowWelcomeModal(false)}
                    />
                  )}
                </AnimatePresence>
        </div>
      </AppProvider>
    );
}

export default App;
