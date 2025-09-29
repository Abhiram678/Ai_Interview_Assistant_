import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Star } from 'lucide-react';
import './QuestionDisplay.css';

const QuestionDisplay = ({ question, difficulty }) => {
  const difficultyConfig = {
    easy: { color: '#10b981', label: 'Easy', stars: 1 },
    medium: { color: '#f59e0b', label: 'Medium', stars: 2 },
    hard: { color: '#ef4444', label: 'Hard', stars: 3 }
  };

  const config = difficultyConfig[difficulty] || difficultyConfig.easy;

  return (
    <motion.div 
      className="question-display"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="question-header">
        <div className="difficulty-badge" style={{ backgroundColor: config.color }}>
          <span>{config.label}</span>
          <div className="stars">
            {Array.from({ length: config.stars }).map((_, index) => (
              <Star key={index} size={12} fill="currentColor" />
            ))}
          </div>
        </div>
      </div>

      <div className="question-content">
        <div className="question-icon">
          <MessageCircle size={24} />
        </div>
        <div className="question-text">
          <h3>Question</h3>
          <p>{question.text}</p>
        </div>
      </div>

    </motion.div>
  );
};

export default QuestionDisplay;
