import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';
import './MissingFieldsForm.css';

const MissingFieldsForm = ({ candidateData, missingFields, onComplete, loading, error }) => {
  const [formData, setFormData] = useState({
    name: candidateData.name || '',
    email: candidateData.email || '',
    phone: candidateData.phone || ''
  });
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return value.trim().length >= 2 ? '' : 'Name must be at least 2 characters';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Please enter a valid email address';
      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')) ? '' : 'Please enter a valid phone number';
      default:
        return '';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate only missing fields
    const newErrors = {};
    let hasErrors = false;

    missingFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Merge with existing candidate data
    const completedData = { ...candidateData, ...formData };
    onComplete(completedData);
  };

  const fieldConfig = {
    name: { label: 'Full Name', icon: User, placeholder: 'Enter your full name' },
    email: { label: 'Email Address', icon: Mail, placeholder: 'Enter your email address' },
    phone: { label: 'Phone Number', icon: Phone, placeholder: 'Enter your phone number' }
  };

  return (
    <motion.div 
      className="missing-fields-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-header">
        <h2>Complete Your Profile</h2>
        <p>We need a few more details to get started with your interview</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {missingFields.map((field, index) => {
          const config = fieldConfig[field];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={field}
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <label htmlFor={field} className="form-label">
                <Icon size={20} />
                {config.label}
              </label>
              
              <input
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                id={field}
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={config.placeholder}
                className={`form-input ${errors[field] ? 'error' : ''}`}
                required
              />
              
              {errors[field] && (
                <motion.span
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors[field]}
                </motion.span>
              )}
            </motion.div>
          );
        })}

        {error && (
          <motion.div
            className="form-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          className="btn btn-primary submit-button"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <div className="spinner" />
          ) : (
            <>
              Continue to Interview
              <ArrowRight size={20} />
            </>
          )}
        </motion.button>
      </form>

      <div className="form-footer">
        <p>Your information will be used to personalize your interview experience</p>
      </div>
    </motion.div>
  );
};

export default MissingFieldsForm;
