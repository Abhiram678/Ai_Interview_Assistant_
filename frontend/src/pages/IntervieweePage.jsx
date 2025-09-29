import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ResumeUpload from '../components/ResumeUpload';
import ChatInterface from '../components/ChatInterface';
import ProgressBar from '../components/ProgressBar';
import MissingFieldsForm from '../components/MissingFieldsForm';
import CandidateConfirmation from '../components/CandidateConfirmation';
import InterviewComplete from '../components/InterviewComplete';
import './IntervieweePage.css';

const IntervieweePage = ({ unfinishedInterview, onInterviewComplete }) => {
  const { 
    currentInterview, 
    currentQuestion, 
    loading, 
    error, 
    startInterview, 
    resumeInterview,
    clearError 
  } = useApp();

  const [step, setStep] = useState('upload'); // upload, confirmation, missing-fields, interview, complete
  const [candidateData, setCandidateData] = useState({});
  const [missingFields, setMissingFields] = useState([]);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (unfinishedInterview) {
      handleResumeInterview();
    }
  }, [unfinishedInterview]);

  const handleResumeInterview = async () => {
    const result = await resumeInterview(unfinishedInterview.interview_id);
    if (result) {
      setStep('interview');
    }
  };

  const handleResumeUpload = (extractedData) => {
    setCandidateData(extractedData);
    
    // Always show confirmation screen first
    setStep('confirmation');
  };

  const handleConfirmationComplete = (confirmedData) => {
    setCandidateData(confirmedData);
    
    // Check for missing fields
    const missing = [];
    if (!confirmedData.name) missing.push('name');
    if (!confirmedData.email) missing.push('email');
    if (!confirmedData.phone) missing.push('phone');
    
    if (missing.length > 0) {
      setMissingFields(missing);
      setStep('missing-fields');
    } else {
      setStep('interview');
    }
  };

  const handleMissingFieldsComplete = (completedData) => {
    setCandidateData(completedData);
    setStep('interview');
  };

  const handleInterviewStart = async () => {
    const result = await startInterview(candidateData);
    if (result) {
      setStep('interview');
    }
  };

  const handleInterviewComplete = (score, interviewSummary) => {
    setFinalScore(score);
    setSummary(interviewSummary);
    setInterviewComplete(true);
    setStep('complete');
    onInterviewComplete();
  };

  const handleStartOver = () => {
    setStep('upload');
    setCandidateData({});
    setMissingFields([]);
    setInterviewComplete(false);
    setFinalScore(0);
    setSummary('');
    clearError();
  };

  return (
    <div className="interviewee-page">
      <div className="interview-container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>AI-Powered Interview Assistant</h1>
          <p>Complete your interview with AI-generated questions</p>
        </motion.div>

        <ProgressBar 
          currentStep={step}
          steps={['upload', 'confirmation', 'missing-fields', 'interview', 'complete']}
        />

      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ResumeUpload 
              onUploadComplete={handleResumeUpload}
              loading={loading}
              error={error}
            />
          </motion.div>
        )}

        {step === 'confirmation' && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CandidateConfirmation
              candidateData={candidateData}
              onConfirm={handleConfirmationComplete}
              loading={loading}
              error={error}
            />
          </motion.div>
        )}

        {step === 'missing-fields' && (
          <motion.div
            key="missing-fields"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MissingFieldsForm
              candidateData={candidateData}
              missingFields={missingFields}
              onComplete={handleMissingFieldsComplete}
              loading={loading}
              error={error}
            />
          </motion.div>
        )}

        {step === 'interview' && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ChatInterface
              currentQuestion={currentQuestion}
              onInterviewComplete={handleInterviewComplete}
              onStartInterview={handleInterviewStart}
              loading={loading}
              error={error}
            />
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <InterviewComplete
              finalScore={finalScore}
              summary={summary}
              candidateName={candidateData.name}
              onStartOver={handleStartOver}
            />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default IntervieweePage;
