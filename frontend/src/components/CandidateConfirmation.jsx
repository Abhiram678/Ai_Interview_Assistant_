import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Edit3, Check, X } from 'lucide-react';
import './CandidateConfirmation.css';

const CandidateConfirmation = ({ candidateData, onConfirm, onEdit, loading, error }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(candidateData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(candidateData);
  };

  const handleSave = () => {
    onConfirm(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(candidateData);
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <motion.div 
      className="candidate-confirmation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="confirmation-header">
        <h2>Confirm Your Details</h2>
        <p>Please review and confirm your information before starting the interview</p>
      </div>

      <div className="candidate-details-card">
        <div className="card-header">
          <h3>Candidate Information</h3>
          {!isEditing && (
            <motion.button
              className="edit-button"
              onClick={handleEdit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit3 size={16} />
              Edit
            </motion.button>
          )}
        </div>

        <div className="details-content">
          <div className="detail-row">
            <div className="detail-label">
              <User size={18} />
              <span>Full Name</span>
            </div>
            <div className="detail-value">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="edit-input"
                  placeholder="Enter your full name"
                />
              ) : (
                <span>{candidateData.name || 'Not provided'}</span>
              )}
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">
              <Mail size={18} />
              <span>Email Address</span>
            </div>
            <div className="detail-value">
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="edit-input"
                  placeholder="Enter your email"
                />
              ) : (
                <span>{candidateData.email || 'Not provided'}</span>
              )}
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">
              <Phone size={18} />
              <span>Phone Number</span>
            </div>
            <div className="detail-value">
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="edit-input"
                  placeholder="Enter your phone number"
                />
              ) : (
                <span>{candidateData.phone || 'Not provided'}</span>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="edit-actions">
            <motion.button
              className="save-button"
              onClick={handleSave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Check size={16} />
              Save Changes
            </motion.button>
            <motion.button
              className="cancel-button"
              onClick={handleCancel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={16} />
              Cancel
            </motion.button>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="confirmation-actions">
        <motion.button
          className="btn btn-primary confirm-button"
          onClick={() => onConfirm(editedData)}
          disabled={loading || !editedData.name || !editedData.email}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? (
            <div className="spinner" />
          ) : (
            'Start Interview'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CandidateConfirmation;
