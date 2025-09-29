import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Calendar, Star, Eye } from 'lucide-react';
import './CandidateList.css';

const CandidateList = ({ candidates, onCandidateSelect, loading, error }) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not completed';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="candidate-list loading">
        <div className="spinner" />
        <p>Loading candidates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-list error">
        <p>Error loading candidates: {error}</p>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="candidate-list empty">
        <User size={48} />
        <h3>No candidates found</h3>
        <p>No candidates have completed interviews yet.</p>
      </div>
    );
  }

  return (
    <div className="candidate-list">
      <div className="list-header">
        <h3>Candidates ({candidates.length})</h3>
      </div>
      
      <div className="candidates-grid">
        <AnimatePresence>
          {candidates.map((candidate, index) => {
            const scoreColor = getScoreColor(candidate.final_score);
            const scoreLabel = getScoreLabel(candidate.final_score);
            
            return (
              <motion.div
                key={candidate.id}
                className="candidate-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => onCandidateSelect(candidate)}
              >
                <div className="candidate-seq">
                  <span className="seq-number">{index + 1}</span>
                </div>
                <div className="candidate-header">
                  <div className="candidate-avatar">
                    <User size={24} />
                  </div>
                  <div className="candidate-info">
                    <h4>{candidate.name}</h4>
                    <p>{candidate.email}</p>
                  </div>
                  <div className="candidate-score">
                    <div className="score-value" style={{ color: scoreColor }}>
                      {candidate.final_score || 0}/10
                    </div>
                  </div>
                </div>
                
                <div className="candidate-details">
                  <div className="detail-item">
                    <Star size={16} />
                    <span className={`status ${candidate.status}`}>
                      {candidate.status}
                    </span>
                  </div>
                </div>
                
                <div className="candidate-actions">
                  <motion.button
                    className="view-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye size={16} />
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CandidateList;
