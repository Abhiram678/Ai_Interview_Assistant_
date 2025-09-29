import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Trophy, Star, RotateCcw } from 'lucide-react';
import './InterviewComplete.css';

const InterviewComplete = ({ finalScore, summary, candidateName, onStartOver }) => {
  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    return 'Needs Improvement';
  };

  const scoreColor = getScoreColor(finalScore);
  const scoreLabel = getScoreLabel(finalScore);

  return (
    <motion.div 
      className="interview-complete"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="complete-header">
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CheckCircle size={64} />
        </motion.div>
        
        <h1>Interview Complete!</h1>
        <p>Thank you for completing the interview, {candidateName}</p>
      </div>

      <div className="score-section">
        <motion.div
          className="score-display"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="score-icon">
            <Trophy size={32} />
          </div>
          
          <div className="score-content">
            <div className="score-value" style={{ color: scoreColor }}>
              {finalScore}/10
            </div>
            <div className="score-label" style={{ color: scoreColor }}>
              {scoreLabel}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="score-breakdown"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="breakdown-item">
            <span>Overall Performance</span>
            <div className="score-bar">
              <motion.div
                className="score-fill"
                style={{ backgroundColor: scoreColor }}
                initial={{ width: 0 }}
                animate={{ width: `${(finalScore / 10) * 100}%` }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </div>
            <span>{finalScore}/10</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="summary-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3>AI Assessment Summary</h3>
        <div className="summary-content">
          <p>{summary}</p>
        </div>
      </motion.div>

      <motion.div
        className="action-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <motion.button
          className="btn btn-primary start-over-button"
          onClick={onStartOver}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={20} />
          Start New Interview
        </motion.button>
      </motion.div>

      <div className="complete-footer">
        <p>Your interview results have been saved and will be reviewed by our team.</p>
      </div>
    </motion.div>
  );
};

export default InterviewComplete;
