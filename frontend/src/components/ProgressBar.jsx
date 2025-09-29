import React from 'react';
import { motion } from 'framer-motion';
import { Upload, User, MessageCircle, CheckCircle, FileCheck } from 'lucide-react';
import './ProgressBar.css';

const ProgressBar = ({ currentStep, steps }) => {
  const stepIcons = {
    'upload': Upload,
    'confirmation': FileCheck,
    'missing-fields': User,
    'interview': MessageCircle,
    'complete': CheckCircle
  };

  const stepLabels = {
    'upload': 'Upload Resume',
    'confirmation': 'Confirm Details',
    'missing-fields': 'Complete Profile',
    'interview': 'Interview',
    'complete': 'Complete'
  };

  const getStepIndex = (step) => steps.indexOf(step);
  const currentIndex = getStepIndex(currentStep);

  return (
    <motion.div 
      className="progress-bar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="progress-container">
        {steps.map((step, index) => {
          const Icon = stepIcons[step];
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          
          return (
            <div key={step} className="progress-step">
              <motion.div
                className={`step-icon ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted ? '#10b981' : isActive ? '#2563eb' : '#e5e7eb'
                }}
                transition={{ duration: 0.3 }}
              >
                <Icon size={20} />
              </motion.div>
              
              <span className={`step-label ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                {stepLabels[step]}
              </span>
              
              {index < steps.length - 1 && (
                <motion.div
                  className="step-connector"
                  animate={{ 
                    backgroundColor: isCompleted ? '#10b981' : '#e5e7eb'
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          );
        })}
      </div>
      
    </motion.div>
  );
};

export default ProgressBar;
