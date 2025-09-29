import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, RotateCcw, Play } from 'lucide-react';
import './WelcomeBackModal.css';

const WelcomeBackModal = ({ 
  unfinishedInterview, 
  onResume, 
  onStartNew, 
  onClose 
}) => {
  if (!unfinishedInterview) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="modal-content welcome-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
                <div className="welcome-header">
                  <motion.div 
                    className="welcome-icon"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock size={48} />
                  </motion.div>
                  <h2>Welcome Back!</h2>
                  <p>You have an unfinished interview session</p>
                </div>

                <div className="interview-info">
                  <div className="info-item">
                    <User size={20} />
                    <div>
                      <strong>{unfinishedInterview.candidate.name}</strong>
                      <span>{unfinishedInterview.candidate.email}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <Clock size={20} />
                    <div>
                      <strong>Started:</strong>
                      <span>{formatDate(unfinishedInterview.started_at)}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <strong>Progress:</strong>
                    <span className="progress-text">
                      Question {unfinishedInterview.current_question || 1} of 6
                    </span>
                  </div>
                  
                  <div className="info-item">
                    <strong>Status:</strong>
                    <span className="status-in-progress">
                      In Progress
                    </span>
                  </div>
                </div>

                <div className="modal-actions">
                  <motion.button
                    className="btn btn-primary"
                    onClick={onResume}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw size={20} />
                    Resume Interview
                  </motion.button>
                  
                  <motion.button
                    className="btn btn-secondary"
                    onClick={onStartNew}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={20} />
                    Start New Interview
                  </motion.button>
                </div>

        <button 
          className="close-button"
          onClick={onClose}
        >
          ×
        </button>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeBackModal;
