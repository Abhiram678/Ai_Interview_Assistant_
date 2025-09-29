import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import './Timer.css';

const Timer = ({ timeRemaining, totalTime, isLow }) => {
  const progress = (timeRemaining / totalTime) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <motion.div 
      className={`timer ${isLow ? 'low-time' : ''}`}
      animate={{ 
        scale: isLow ? [1, 1.05, 1] : 1,
        color: isLow ? '#ef4444' : '#6b7280'
      }}
      transition={{ 
        scale: { duration: 0.5, repeat: isLow ? Infinity : 0 },
        color: { duration: 0.3 }
      }}
    >
      <div className="timer-content">
        <Clock size={20} />
        <span className="time-text">{timeString}</span>
      </div>
      
      <div className="timer-progress">
        <motion.div
          className="progress-bar"
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      
      {isLow && (
        <motion.div
          className="warning-indicator"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ⚠️
        </motion.div>
      )}
    </motion.div>
  );
};

export default Timer;
