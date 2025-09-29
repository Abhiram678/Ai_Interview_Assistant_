import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Calendar, Star, Clock, MessageCircle } from 'lucide-react';
import './CandidateDetails.css';

const CandidateDetails = ({ candidate, interview, onBack, loading }) => {
  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="candidate-details loading">
        <div className="spinner" />
        <p>Loading candidate details...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="candidate-details"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="details-header">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          Back to List
        </motion.button>
        
        <h2>Candidate Details</h2>
      </div>

      <div className="details-content">
        <div className="candidate-profile">
          <div className="profile-header">
            <div className="profile-avatar">
              <User size={32} />
            </div>
            <div className="profile-info">
              <h3>{candidate.name}</h3>
              <p>{candidate.email}</p>
            </div>
            <div className="profile-score">
              <div className="score-value" style={{ color: getScoreColor(interview?.final_score) }}>
                {interview?.final_score || 0}/10
              </div>
              <div className="score-label">Final Score</div>
            </div>
          </div>
          
          <div className="profile-details">
            <div className="detail-item">
              <Mail size={20} />
              <span>{candidate.email}</span>
            </div>
            <div className="detail-item">
              <Phone size={20} />
              <span>{candidate.phone || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <Calendar size={20} />
              <span>Started: {formatDate(interview?.started_at)}</span>
            </div>
            <div className="detail-item">
              <Calendar size={20} />
              <span>Completed: {formatDate(interview?.completed_at)}</span>
            </div>
          </div>
        </div>

        {interview?.summary && (
          <div className="summary-section">
            <h4>AI Assessment Summary</h4>
            <div className="summary-content">
              <p>{interview.summary}</p>
            </div>
          </div>
        )}

        {interview?.questions && (
          <div className="questions-section">
            <h4>Interview Questions & Answers</h4>
            <div className="questions-list">
              {interview.questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  className="question-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="question-header">
                    <div className="question-number">
                      Question {question.number}
                    </div>
                    <div 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(question.difficulty) }}
                    >
                      {question.difficulty}
                    </div>
                    <div className="question-score">
                      <Star size={16} />
                      <span style={{ color: getScoreColor(question.score) }}>
                        {question.score || 0}/10
                      </span>
                    </div>
                  </div>
                  
                  <div className="question-content">
                    <div className="question-text">
                      <MessageCircle size={20} />
                      <p>{question.text}</p>
                    </div>
                    
                    {question.answer && (
                      <div className="answer-text">
                        <h5>Answer:</h5>
                        <p>{question.answer}</p>
                      </div>
                    )}
                    
                    <div className="question-meta">
                      <div className="meta-item">
                        <Clock size={16} />
                        <span>Time taken: {formatTime(question.time_taken || 0)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CandidateDetails;
